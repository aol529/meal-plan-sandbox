# Meal Plan Sandbox

A standalone copy of the Bells n Barz **Meal Plan** feature (Me → Meal Plan / Coach → Meal Plans) for trying ideas out without touching the gym app or its database.

- `npm start` → http://localhost:3001
- Data is saved in the browser's localStorage only. **Reset demo** in the header wipes it back to the seed users.
- **View as** switches between demo members, coaches and an admin. Each member's coach is shown in the switcher.

## Suggested plan (a program, for now)
Each member has two pages: **Coach's plan** and **Suggested plan**. The suggested plan is worked out in the browser by `js/plan-program.js`, with no AI and no server: the guide's calorie method (Mifflin-St Jeor × activity ± goal; a typical body size and a range when height or weight is missing), meal options from the foods the member loves and their way of eating, hand portions, swaps, eating out, a grocery list, gut-comfort notes and the weekly weigh-in rule. Check-ins with weights adjust the calories. It's worked out again each time the page opens, so updated answers and new check-ins show straight away. Allergies and dislikes are respected ("No pork" avoids pork; "shellfish" doesn't rule out fish, "eggplant" doesn't rule out eggs; gluten, nuts, dairy and legumes are handled). Coaches can **Copy into my plan** to start from it. **Download PDF** (on the suggested plan, the member's coach's plan and the coach's plan editor) opens a clean printable copy; choose Save as PDF in the print box. The same program powers the coach's "Suggest from questionnaire" button and `starter.html`, so the numbers always agree.

To go back to Claude drafting the suggestion, set `SUGGEST_WITH_AI = true` in `js/mealplan.js`, create a file named `.env` in this folder containing one line:

    ANTHROPIC_API_KEY=your-key-here

and restart with `npm start`. `.env` is git-ignored and the server refuses to serve dotfiles. Each AI suggestion is one request to `claude-opus-5-5` (a few cents).

## Uploading a filled questionnaire
The questionnaire page has **Upload PDF or photos**:
- **The fillable PDF** (`docs/Meal_Plan_Questionnaire.pdf`) filled in on a phone or computer: the answers are read in the browser from the form fields and dropped into the form. No AI, works offline from the server too.
- **A printed copy filled in by hand** (scans or photos, or a PDF with no typed answers): **Read the handwriting with AI** sends the pages to Claude (`/api/ai-read-questionnaire`, needs the API key above, a few cents per form). Questions it couldn't read are listed.

Either way the answers only fill the form, marked in green; nothing is saved until the member checks them and presses Send.

## Starter estimate
`starter.html` (http://localhost:3001/starter.html): a starting point a client can follow right away, even with height or weight missing. Upload the questionnaire PDF (or type the answers) and it gives:
- foods left out by way of eating (vegetarian, halal…) and what they won't eat or are allergic to
- daily calories and macros by the guide's method (Mifflin-St Jeor × activity ± goal); without height/weight it assumes a typical adult of that sex in Kenya (about 158 cm women / 170 cm men, BMI 22) and shows the range for a smaller or larger body
- hand portions that need no numbers, and a sample day built from the foods they love, scaled to the target
- the weekly weigh-in rule that corrects the estimate, and gut-comfort notes when they mention bloating or constipation

Nothing is saved or sent anywhere.

## Files
- `js/mealplan.js` — copied from the gym app's `js/bells-n-barz-mealplan.js`; only the Supabase calls are swapped for `MP_STORE`.
- `js/plan-program.js` — the suggested-plan program (targets, meal options, notes), shared with the coach's target button and `starter.html`.
- `js/store.js` — localStorage stand-in for the `meal_plan_*`, `nutrition_goals` and `notifications` tables, with the same access rule as the gym app's `sql/45-meal-plans.sql`.
- `js/app.js` — header: View as, Member/Coach toggle (for accounts with both roles), notification bell, reset.
- `ai.js` + `server.js` — `/api/ai-suggest` (off for now, see above): sends the answers to Claude and returns a plan via structured outputs; `/api/ai-read-questionnaire`: reads a handwritten questionnaire from scans/photos into the same answer shape.

Sandbox-only difference: the coach sets calorie/macro targets in the plan editor (with a "Suggest from questionnaire" button using the guide's Mifflin-St Jeor steps), since there's no Nutrition calculator here.
