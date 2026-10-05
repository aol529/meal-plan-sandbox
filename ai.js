/* ============================================================
   AI SUGGESTION — server side only (the API key never reaches the
   browser). Sends a member's questionnaire answers, and any check-ins,
   to Claude and gets back a draft meal plan in exactly the shape the
   app's plan view uses, via structured outputs (output_config.format
   with a JSON schema).

   Credentials come from the environment the usual SDK way:
   ANTHROPIC_API_KEY (or an `ant auth login` profile).
   ============================================================ */
const AnthropicModule = require('@anthropic-ai/sdk');
const Anthropic = AnthropicModule.default || AnthropicModule;

const MODEL = 'claude-opus-5-5';

const listOfStrings = { type: 'array', items: { type: 'string' } };
const PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['targets', 'pattern', 'breakfasts', 'lunches', 'dinners', 'snacks', 'swaps', 'eating_out', 'grocery', 'notes', 'rationale', 'referral_note'],
  properties: {
    targets: {
      type: 'object',
      additionalProperties: false,
      required: ['target_calories', 'target_protein_g', 'target_carbs_g', 'target_fat_g'],
      properties: {
        target_calories: { type: 'integer' },
        target_protein_g: { type: 'integer' },
        target_carbs_g: { type: 'integer' },
        target_fat_g: { type: 'integer' }
      }
    },
    pattern: { type: 'string' },
    breakfasts: listOfStrings,
    lunches: listOfStrings,
    dinners: listOfStrings,
    snacks: listOfStrings,
    swaps: listOfStrings,
    eating_out: { type: 'string' },
    grocery: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['category', 'items'],
        properties: { category: { type: 'string' }, items: listOfStrings }
      }
    },
    notes: { type: 'string' },
    rationale: { type: 'string' },
    referral_note: { type: 'string' }
  }
};

// The gym's meal-plan guide, condensed — the AI follows the same method
// a coach is asked to, so the two pages are comparable.
const SYSTEM = `You draft meal plans for members of a gym, following the gym's own meal-plan guide. A coach reviews every draft before the member relies on it.

Method (from the guide):
1. Use the member's questionnaire answers. Their current typical day matters most: adjust their existing habits rather than replacing them.
2. Estimate energy needs with Mifflin-St Jeor (women: 10*kg + 6.25*cm - 5*age - 161; men: same but +5), times an activity factor (1.2 sedentary, 1.375 lightly active, 1.55 moderately active, 1.725 very active). For gradual fat loss subtract about 300-500 kcal; for muscle gain add about 200-300 kcal.
3. Protein about 1.6-2.2 g/kg if they train, about 1.2 g/kg if less active. Fat about 25-35% of calories. Carbs are the remainder.
4. Pick a meal pattern that fits their day, e.g. 3 meals + 1 snack. Build each meal around a protein, a carb or starch, vegetables and/or fruit, and a little fat.
5. Don't make many unique meals: 2-3 breakfast options, 3-4 lunches, 4-5 dinners, a few snacks, rotated across the week. Plan leftovers on purpose (cook once, eat twice). Group the grocery list by category.
6. Make it flexible: simple swaps, a plan for eating out, and room for foods they enjoy.
7. If check-ins are provided, use them to adjust in small steps (energy, hunger, digestion, ease of following the plan, weight trend).

Respect everything they told you: diet (vegetarian, halal, etc.), dislikes, allergies, budget, cooking skill and time, household, and how often they eat out. Use foods that fit where they live and what they already eat — many members are in Kenya, so local staples (ugali, githeri, sukuma wiki, chapati, beans, rice, tea) are normal everyday foods, not exotic ones.

Safety: if they mention diabetes, kidney disease, pregnancy or breastfeeding, a history of disordered eating, or medication that may be affected by diet, set referral_note to a short, kind suggestion to also work with a registered dietitian, and keep the plan to general healthy-eating structure. Otherwise set referral_note to an empty string. Never suggest very low-calorie diets, fasting protocols, or supplements as requirements.

Write every list item as one short line a member can read on a phone. In rationale, explain in 2-4 sentences how you arrived at the targets and the main choices, so the coach can check your reasoning.`;

function buildUserMessage(answers, checkins){
  let text = 'Questionnaire answers (JSON):\n' + JSON.stringify(answers || {}, null, 2);
  if (checkins && checkins.length){
    text += '\n\nCheck-ins since the plan started, newest first (ratings are 1-5, higher is better; for hunger, 5 = satisfied):\n' + JSON.stringify(checkins.map(c => ({
      date: c.created_at, weight_kg: c.weight_kg, energy: c.energy, hunger: c.hunger, digestion: c.digestion, ease: c.ease, notes: c.notes
    })), null, 2);
  }
  text += '\n\nDraft their meal plan.';
  return text;
}

let client = null;
function getClient(){
  if (!client) client = new Anthropic();
  return client;
}

async function suggestPlan({ answers, checkins }){
  const response = await getClient().beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: PLAN_SCHEMA } },
    system: SYSTEM,
    messages: [{ role: 'user', content: buildUserMessage(answers, checkins) }]
  });

  if (response.stop_reason === 'refusal'){
    const err = new Error('The AI declined to draft this plan.');
    err.status = 422;
    throw err;
  }
  if (response.stop_reason === 'max_tokens'){
    const err = new Error('The AI ran out of room before finishing — try again.');
    err.status = 502;
    throw err;
  }
  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) {
    const err = new Error('The AI returned no plan.');
    err.status = 502;
    throw err;
  }
  return { plan: JSON.parse(textBlock.text), model: response.model, usage: response.usage };
}

module.exports = { suggestPlan, Anthropic };
