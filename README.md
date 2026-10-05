# Meal Plan Sandbox

A standalone copy of the Bells n Barz **Meal Plan** feature (Me → Meal Plan / Coach → Meal Plans) for trying ideas out without touching the gym app or its database.

- `npm start` → http://localhost:3001
- Data is saved in the browser's localStorage only. **Reset demo** in the header wipes it back to the seed users.
- **View as** switches between demo members, coaches and an admin. Each member's coach is shown in the switcher.

## AI suggestions (Claude)
Each member has two pages: **Coach's plan** and **AI suggestion**. The AI page drafts a plan from the questionnaire (and any check-ins) with Claude, following the gym's meal-plan guide; coaches can **Copy into my plan** to start from it. The API key stays on the server and is never sent to the browser.

To turn it on, create a file named `.env` in this folder containing one line:

    ANTHROPIC_API_KEY=your-key-here

then restart with `npm start`. `.env` is git-ignored and the server refuses to serve dotfiles. Each suggestion is one request to `claude-opus-5-5` (a few cents).

## Files
- `js/mealplan.js` — copied from the gym app's `js/bells-n-barz-mealplan.js`; only the Supabase calls are swapped for `MP_STORE`.
- `js/store.js` — localStorage stand-in for the `meal_plan_*`, `nutrition_goals` and `notifications` tables, with the same access rule as the gym app's `sql/45-meal-plans.sql`.
- `js/app.js` — header: View as, Member/Coach toggle (for accounts with both roles), notification bell, reset.
- `ai.js` + `server.js` — `/api/ai-suggest`: sends the answers to Claude and returns a plan via structured outputs.

Sandbox-only difference: the coach sets calorie/macro targets in the plan editor (with a "Suggest from questionnaire" button using the guide's Mifflin-St Jeor steps), since there's no Nutrition calculator here.
