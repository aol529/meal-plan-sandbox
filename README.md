# Meal Plan Sandbox

A standalone copy of the Bells n Barz **Meal Plan** feature (Me → Meal Plan / Coach → Meal Plans) for trying ideas out without touching the gym app or its database.

- `npm start` → http://localhost:3001
- Data is saved in the browser's localStorage only. **Reset demo** in the header wipes it back to the seed users.
- **View as** switches between demo members, coaches and an admin. Each member's coach is shown in the switcher.

## Files
- `js/mealplan.js` — copied from the gym app's `js/bells-n-barz-mealplan.js`; only the Supabase calls are swapped for `MP_STORE`.
- `js/store.js` — localStorage stand-in for the `meal_plan_*`, `nutrition_goals` and `notifications` tables, with the same access rule as the gym app's `sql/45-meal-plans.sql`.
- `js/app.js` — header: View as, notification bell, reset.

Sandbox-only difference: the coach sets calorie/macro targets in the plan editor (with a "Suggest from questionnaire" button using the guide's Mifflin-St Jeor steps), since there's no Nutrition calculator here.
