/* ============================================================
   COACH KA'S DIET — defaults for MP_DIETS (js/diets.js)
   From "Diet Plan By Coach KA 2025.pdf", reviewed with Claude: claims
   softened where the evidence is weaker, cautions added, and the
   calorie guide uses each viewer's own questionnaire numbers.

   Coach KA (ownerId) can edit the name, summary, tags, publishing,
   the weekly options and "How this diet works" from Coach > My diets;
   those edits override what's here. The Background & reference
   sections below (rules, tea, food lists, calorie guide) are edited in
   this file.
   ============================================================ */
(function(){
  const OWNER_ID = '870adc3b-df42-4435-b3c5-942bb4cc2245'; // Coach KA's account (Kevin Aol)

  function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  const table = (head, rows) => '<table class="admin-table ka-table"><tr>' + head.map(h=> '<th>' + esc(h) + '</th>').join('') + '</tr>' +
    rows.map(r=> '<tr>' + r.map(c=> '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table>';
  const section = (title, body, open) => '<details class="mp-details ka-section"' + (open ? ' open' : '') + '><summary>' + title + '</summary>' + body + '</details>';

  /* ---------------- 1. Rules ---------------- */
  const RULES = section('Coach KA’s 7 rules', `
    <div class="ka-rule"><h4>Rule #1 — Water first</h4>
      <p>After a good night’s sleep (6+ hours), always drink water first thing in the morning — before your shower, before tea or food. You’ve gone all night without any, and starting the day hydrated supports healthy blood pressure, energy and digestion.</p>
      <p>Through the day, aim for about <b>30–35 ml of water per kg of bodyweight</b> — roughly 2.5–3 litres at 80 kg — and more when you train or it’s hot. Water keeps you fuller between meals, which makes it easier to stick to your plan.</p>
      <p class="ka-small">Have kidney or heart problems, or been told to limit fluids? Follow your doctor’s advice instead.</p>
    </div>
    <div class="ka-rule"><h4>Rule #2 — Fruit is food</h4>
      <p>For real, ask the silverback gorilla.</p>
      <p>A later first meal — around 10:00 am — suits a lot of people: it gives your body a longer overnight break before you eat again. If you train in the morning or feel shaky without breakfast, eat earlier; what matters most is what you eat, not the clock.</p>
      <p>Your breakfast should be fruit, fruit salad, or at least start with a fruit. Fruit gives you fibre, vitamins and antioxidants, and its natural sugar comes packaged with fibre and water — steadier energy than any energy drink.</p>
      <p>Water comes first, and whole fruit beats juice: juice loses most of the fibre and is easy to over-drink. If you want something blended, make it a smoothie, which keeps the whole fruit:</p>
      <ol>
        <li>Add a vegetable of your choice to a blender, like bok choy (found at Chandarana Foodplus stores).</li>
        <li>Pick either dry or juicy fruit — e.g. pineapple and papaya, or banana and mango.</li>
        <li>Add nuts and/or seeds: almonds, chia, flax, pumpkin, sesame seeds, peanuts, groundnuts.</li>
        <li>Boost with turmeric and ginger.</li>
        <li>Add plant-based milk.</li>
      </ol>
    </div>
    <div class="ka-rule"><h4>Rule #3 — It’s not Breakfast, it is Break Fast</h4>
      <p>Once your last meal has been digested your stomach is empty, and from then until you next eat, you are fasting — every night, for everyone. Your first meal is what breaks that fast.</p>
      <p>Break it with something light and easy on an empty stomach that also rehydrates you — a smoothie, porridge, soup, or tea alongside some fruit. Porridge, soup or a smoothie with nuts or seeds beats juice alone, because they bring some protein and fibre to carry you to your next meal.</p>
    </div>
    <div class="ka-rule"><h4>Rule #4 — If you want to be as strong as a bull, don’t eat the bull, eat what the bull eats</h4>
      <p>Raw nuts, seeds, grains, berries, vegetables. These could best escort the drink that breaks your fast. Most, if not all, of your dietary needs could be met in your first meal of the day.</p>
    </div>
    <div class="ka-rule"><h4>Rule #5 — Cooking does not require killing: eat plant-first</h4>
      <p>Build most of what you eat from plants — fruit, vegetables, grains, beans, lentils, nuts and seeds. Keep meat, fish, eggs and dairy mostly to your main meal of the day (the 3–7 pm last meal in Options A–C), rather than spreading them through every meal.</p>
      <p>Plant proteins count too: beans, lentils, ndengu, chickpeas, groundnuts and soy can stand in for meat on any day.</p>
    </div>
    <div class="ka-rule"><h4>Rule #6 — Avoid CRAP</h4>
      <p>Carbonated, Refined, Artificial and Processed.</p>
    </div>
    <div class="ka-rule"><h4>Rule #7 — Good health starts in the gut</h4>
      <p>Look after your gut and it looks after you. Feed it fibre — fruit, vegetables, beans, lentils and whole grains (Rules 2, 4 and 5) — and fermented foods like mala or plain yoghurt, and go easy on the processed stuff (Rule 6).</p>
    </div>`);

  /* ---------------- 2. Anti- properties ---------------- */
  const ANTI = section('The power of "anti": protective properties in food', `
    <p>Nutrition is more than macronutrients and calories — food is rich in natural compounds that may help the body resist inflammation, oxidation, infection and metabolic damage. Many have "anti-" properties.</p>
    <p class="ka-small">These are reasons to eat more of these foods as part of a varied diet — not cures. Most effects were measured in lab or supplement-dose studies, so everyday amounts help gently over time.</p>
    ${table(['Anti- property', 'May help…', 'Examples'], [
      ['Anti-inflammatory', 'Calm inflammation', 'Turmeric, ginger, omega-3s'],
      ['Antioxidant', 'Protect cells from oxidative stress', 'Berries, green tea, vitamin C'],
      ['Antibacterial', 'Fight harmful bacteria', 'Garlic, honey, oregano oil'],
      ['Antiviral', 'Support defence against viruses', 'Elderberry, green tea, zinc'],
      ['Antifungal', 'Limit fungal growth', 'Coconut oil, garlic'],
      ['Anticarcinogenic', 'Lower cancer risk', 'Cruciferous vegetables, green tea'],
      ['Antidiabetic', 'Support steady blood sugar', 'Cinnamon, fibre, bitter melon'],
      ['Antihypertensive', 'Support healthy blood pressure', 'Beets, garlic, potassium'],
      ['Antithrombotic', 'Support healthy blood flow', 'Omega-3s, turmeric'],
      ['Antiatherogenic', 'Protect arteries from plaque', 'Fibre, olive oil'],
      ['Antilipidemic', 'Lower cholesterol/triglycerides', 'Oats, nuts, plant sterols'],
      ['Antiobesogenic', 'Support a healthy weight', 'Green tea, vinegar, fibre'],
      ['Antiglycation', 'Reduce AGE-related ageing damage', 'Cinnamon, polyphenols'],
      ['Antimutagenic', 'Protect DNA', 'Cruciferous vegetables, chlorophyll'],
      ['Antidepressant', 'Support mood', 'Omega-3s, dark chocolate, B vitamins'],
      ['Antianxiety', 'Calm the nervous system', 'Magnesium, ashwagandha'],
      ['Antineurodegenerative', 'Protect brain function', 'Curcumin, resveratrol'],
      ['Antispasmodic', 'Ease cramps/spasms', 'Peppermint, magnesium'],
      ['Antiemetic', 'Ease nausea', 'Ginger, vitamin B6'],
      ['Antiallergic', 'Ease allergic reactions', 'Quercetin, vitamin C'],
      ['Antiulcerogenic', 'Protect the stomach lining', 'Cabbage juice, licorice'],
      ['Antinociceptive', 'Ease pain', 'Turmeric, capsaicin'],
      ['Antiaging', 'Slow cellular ageing', 'Antioxidants, healthy fats']
    ])}
    <div class="admin-notice mp-refer"><b>Supplements are different from food.</b> Ashwagandha, licorice root, quercetin, elderberry and other concentrated supplements can interact with medication (including blood-pressure and blood-thinning drugs) and aren\u2019t advised in pregnancy. Check with a doctor or pharmacist before taking them — the foods themselves are fine in normal amounts.</div>`);

  /* ---------------- 3. Bedtime tea ---------------- */
  const TEA = section('Bedtime anti-inflammatory tea', `
    ${table(['Ingredient', 'Key benefits'], [
      ['Turmeric', 'Anti-inflammatory, antioxidant, liver support, may promote better sleep'],
      ['Black pepper', 'Enhances absorption of curcumin (from turmeric), aids digestion'],
      ['Ginger', 'Anti-nausea, anti-inflammatory, promotes digestion, warms the body'],
      ['Lemon', 'Vitamin C, aids digestion, boosts immunity'],
      ['Cloves', 'Antibacterial, anti-inflammatory, aids digestion, may reduce oral bacteria']
    ])}
    <h4>Why before bed</h4>
    <ul><li>May help calm inflammation overnight</li><li>Supports digestion and may reduce bloating or gas</li><li>Can support your immune defences</li><li>Warms the body, helping you relax</li><li>May support steadier blood sugar</li><li>Adds antioxidants during your body\u2019s overnight repair</li></ul>
    <h4>Recipe (single serving)</h4>
    <ul><li>½ tsp turmeric powder (or 1-inch fresh root)</li><li>A pinch (⅛ tsp) of black pepper</li><li>1-inch fresh ginger, sliced, or ½ tsp powder</li><li>2 cloves</li><li>½ lemon, squeezed</li><li>1.5–2 cups water</li><li>Optional: ½ tsp raw honey, added after steeping — not during boiling</li></ul>
    <ol><li>Bring the water to a boil.</li><li>Add turmeric, ginger, cloves and black pepper.</li><li>Simmer on low heat for 10 minutes.</li><li>Turn off the heat; add the lemon juice and optional honey.</li><li>Strain and sip slowly, 30–60 minutes before bed.</li></ol>
    <p><b>Best time:</b> 30–60 minutes before bed, or during the post-dinner wind-down. Not right before lying down, to avoid reflux or waking up to pee.</p>
    <p><b>Variations:</b> add cinnamon; a splash of coconut or almond milk for a "golden milk" style drink; leave out honey (or keep it under ½ tsp) if fasting; swap cloves for cardamom or star anise sometimes.</p>
    <div class="admin-notice mp-refer"><b>Cautions</b> — heartburn or reflux (lemon, ginger) in sensitive people; cloves, turmeric and ginger all mildly thin the blood, so <b>be careful if on blood-thinning medication</b>; ginger and pepper can be stimulating in excess; too much pepper or turmeric can upset an empty stomach; lemon and ginger can make you urinate more.</div>
`);

  /* ---------------- 4. Food lists ---------------- */
  const FOODS = section('What to eat — food lists', table(['Group', 'Foods'], [
    ['Fruits', 'Bananas, apples, pears, peaches, mangoes, lemons, limes, papaya, soursop, passion fruit, avocado'],
    ['Vegetables', 'Spinach, kale, lettuce, cucumber, cauliflower, broccoli, tomato, celery, cabbage, bell peppers, onions, okra, mushrooms, cayenne pepper'],
    ['Whole grains', 'Oats, millet, brown rice, basmati/pishori rice, maize'],
    ['Nuts', 'Almonds, cashews, peanuts, hazelnuts, pistachios, walnuts, macadamia'],
    ['Dried fruit', 'Dates, raisins, figs, apricots, prunes'],
    ['Roots', 'Irish potatoes, sweet potatoes, yam, cassava, carrots'],
    ['Legumes', 'Kidney, garbanzo, black and black-eyed beans; red and green lentils; chickpeas, green peas'],
    ['Seeds', 'Sesame, pumpkin, chia, flax, sunflower'],
    ['Plant-based milk', 'Soy, coconut, almond, cashew, oat'],
    ['Salad oils', 'Olive, coconut, avocado, sesame'],
    ['Salt', 'Himalayan, sea, iodized, pink'],
    ['Herbs & spices', 'Parsley, cilantro, paprika, coriander, cinnamon'],
    ['Sweeteners', 'Stevia, jaggery, honey']
  ])) ;

  /* ---------------- 5. Weekly options ---------------- */
  const JUICE = ['Juice', '6–8 am', 'Coconut', 'Pineapple', 'Watermelon', 'Apple', 'Mango', 'Passion'];
  const TEAS = ['Tea', '10–11 am', 'Moringa', 'Lemon', 'Ginger', 'Turmeric', 'Ginseng', 'Ginkgo biloba'];
  const DINNER = ['Last meal (dinner)', '3–7 pm',
    'Lean meat · matoke · guacamole', 'Lentils · rice · boiled mixed veggies', 'Chicken breast · baked Irish potatoes · guacamole',
    'Legumes · sweet potatoes · ratatouille', 'Fish · chips · kachumbari', 'Your choice'];
  // The three weekly options, as plain data so Coach KA can edit them.
  const HEAD = ['', 'Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Weekend'];
  const MID_MORNING = ['Tea / porridge / yoghurt / smoothie', '10–11 am', 'Moringa', 'Lemon', 'Ginger', 'Turmeric', 'Ginseng', 'Ginkgo biloba'];
  const TREAT = ['Treat', 'any time', 'Trail mix', '—', 'Chocolate', 'Ice cream', 'Popcorn', 'Cake'];
  const VARIANTS = [
    { id: 'A', label: 'Option A — lose weight', forGoals: ['Lose fat'],
      intro: 'Light and liquid until mid-afternoon, then one proper meal.',
      week: { head: HEAD, rows: [JUICE, TEAS,
        ['Smoothie + a protein*', '1–2 pm', 'Veggie', 'Fruit', 'Nuts', 'Seeds', 'Booster', 'Plant-based milk'],
        ['Trail mix', 'any time', 'Nuts', 'Seeds', 'Dried fruit', 'Fun stuff', '—', '—'],
        DINNER] },
      footnote: '* Add a protein to the smoothie so it carries you to your last meal — plain yoghurt or mala, peanut butter, soy milk, or a scoop of protein powder.' },
    { id: 'B', label: 'Option B — gain mass (some fat)', forGoals: [],
      intro: 'Option C plus a lunch of anything you fancy — the faster way to gain, accepting a bit of fat.',
      week: { head: HEAD, rows: [JUICE, MID_MORNING, TREAT,
        ['Lunch — anything you fancy', '1–2 pm', 'Beef', 'Poultry', 'Fish', 'Pizza', 'Skip lunch', 'Your choice'],
        DINNER] },
      footnote: '' },
    { id: 'C', label: 'Option C — lean gain', forGoals: ['Build muscle', 'Sports performance'],
      intro: 'Gain more slowly than Option B, but more of it as muscle: no lunch, a fuller mid-morning, and one daily treat.',
      week: { head: HEAD, rows: [JUICE, MID_MORNING, TREAT, DINNER] },
      footnote: '' }
  ];
  const WEEK_CAUTION = '**Herbal teas:** ginseng and ginkgo biloba can interact with blood-thinning, diabetes and blood-pressure medication. If you take any of these, swap them for green, ginger or lemon tea.';

  // "How this diet works" — Coach KA's notes for members, drafted from
  // the plan's own timetable, rules and calorie guide. options: which
  // weekly options a step shows for ([] = all).
  const HOW = {
    lede: 'This diet runs on a daily rhythm: you eat light — mostly liquids, fruit, nuts and seeds — through the morning and early afternoon, and have **one proper meal between 3 and 7 pm**. Here\u2019s how to make it work.',
    steps: [
      { title: 'Water, then juice', options: [],
        body: 'Start every day with water (Rule 1), then a fresh juice between 6 and 8 am — a different fruit each day. Whole fruit or a smoothie works too if you\u2019d rather keep the fibre (Rule 2).' },
      { title: 'Mid-morning: tea', options: ['A'],
        body: 'Between 10 and 11, a herbal tea — moringa, lemon, ginger, turmeric, ginseng or ginkgo, one per day.' },
      { title: 'Mid-morning: tea or something more filling', options: ['B', 'C'],
        body: 'Between 10 and 11, a herbal tea — moringa, lemon, ginger, turmeric, ginseng or ginkgo, one per day. On this option it can be porridge, yoghurt or a smoothie instead, for the extra calories you need to gain.' },
      { title: 'Early afternoon: a protein smoothie', options: ['A'],
        body: 'Between 1 and 2 pm, a smoothie built with the 5 smoothie steps (Rule 2) — one day veggie-led, then fruit, nuts, seeds, a turmeric/ginger booster, plant milk — **plus a protein**. Trail mix (nuts, seeds, dried fruit) covers you if you\u2019re hungry between times.' },
      { title: 'Early afternoon: lunch, your way', options: ['B'],
        body: 'Between 1 and 2 pm, eat anything you fancy — the plan suggests beef, poultry, fish, even pizza across the week, and skipping lunch on Friday. This is what makes Option B the faster way to gain.' },
      { title: 'Early afternoon: nothing scheduled', options: ['C'],
        body: 'No lunch on this option — the fuller mid-morning (porridge, yoghurt or a smoothie) and your daily treat carry you to the last meal. That\u2019s what keeps the gain leaner than Option B.' },
      { title: 'The last meal: 3–7 pm', options: [],
        body: 'Your one proper meal, always built the same way: **a protein, a carb, and a fat or vegetable** — e.g. lean meat · matoke · guacamole, lentils · rice · mixed veggies, fish · chips · kachumbari. Swap any part for another from the food lists. Eat plant-first (Rule 5): this is the meal where meat, fish, eggs and dairy belong.\n\nAfter it, the kitchen is closed — apart from the bedtime tea, 30–60 minutes before sleep.' },
      { title: 'One planned treat', options: ['B', 'C'],
        body: 'Gaining options build in one treat a day — trail mix, chocolate, ice cream, popcorn or cake. It\u2019s on purpose: gaining is easier with some fun calories, and planned treats beat random ones.' },
      { title: 'Track it', options: ['A'],
        body: 'Weigh yourself once a week, same day and time. Steady, gradual loss is the goal; if the scale hasn\u2019t moved in 2–3 weeks, tell your coach at your check-in so they can adjust.' },
      { title: 'Track it', options: ['B', 'C'],
        body: 'Weigh yourself weekly and aim for **0.25–0.5 kg gain a week**. If your weight stalls for 2–3 weeks, add a bit more — the calorie guide below has your own numbers. Track what you eat with an app for the first couple of weeks if you can.' },
      { title: 'Check in', options: [],
        body: 'Send your usual check-in every 2–3 weeks — it records that you were on this diet, so you and your coach can see how it compares with your normal plan.' }
    ],
    caution: '**Check with your coach first if…** you have diabetes or blood-sugar problems (long gaps and juice can swing your sugar), you\u2019re pregnant or breastfeeding, you take regular medication (some of the herbal teas interact), you train early in the morning (you may need to eat sooner — Rule 2), or you\u2019ve ever had a difficult relationship with food — an eating window like this one isn\u2019t right for everyone.'
  };

  /* ---------------- 6. Calorie guide ---------------- */
  // Same method as Coach KA's original 2025 guide (Mifflin-St Jeor x
  // activity, a modest surplus, protein by bodyweight, fat ~1 g/kg,
  // carbs the rest), applied to whoever is viewing.
  function yourStatsHtml(a){
    const age = Number(a && a.age), h = Number(a && a.height_cm), w = Number(a && a.weight_kg);
    if (!age || !h || !w || !a.sex){
      return '<div class="mp-targets mp-targets-empty">Fill in age, sex, height and weight in your questionnaire to see your own numbers here.</div>';
    }
    const exercise = String(a.exercise || '');
    const perWeek = Number((exercise.match(/(\d+)\s*(x|×|times|days|sessions)/i) || [])[1]) || (exercise.trim() ? 2 : 0);
    let factor = perWeek >= 6 ? 1.725 : perWeek >= 3 ? 1.55 : perWeek >= 1 ? 1.375 : 1.2;
    if (a.job_activity === 'Physically demanding') factor = Math.min(1.9, factor + 0.175);
    const activity = factor >= 1.725 ? 'Very active' : factor >= 1.55 ? 'Active' : factor >= 1.375 ? 'Lightly active' : 'Sedentary';
    const bmr = 10 * w + 6.25 * h - 5 * age + (a.sex === 'Male' ? 5 : -161);
    const r50 = x => Math.round(x / 50) * 50;
    const tdee = bmr * factor;
    const tLo = r50(tdee - 100), tHi = r50(tdee + 100);
    const sLo = tHi + 100, sHi = tHi + 200;
    const pLo = Math.round(w * 2.0), pHi = Math.round(w * 2.2);
    const fLo = Math.round(w * 1.0), fHi = Math.round(w * 1.05);
    const cLo = Math.round((sLo - pHi * 4 - fHi * 9) / 4), cHi = Math.round((sHi - pLo * 4 - fLo * 9) / 4);
    const goals = a.goals || [];
    const goalLine = goals.length ? goals.join(', ') : 'Not stated';
    const pMid = Math.round((pLo + pHi) / 2), fMid = Math.round((fLo + fHi) / 2);
    const cal = Math.round((sLo + sHi) / 2 / 50) * 50;
    const cMid = Math.round((cal - pMid * 4 - fMid * 9) / 4);
    return '<h4>Your personal stats</h4>' +
      table(['Age', 'Sex', 'Height', 'Weight', 'Activity', 'Goal'], [[age, a.sex, h + ' cm', w + ' kg', activity + (perWeek ? ' (workouts ' + perWeek + '×/week)' : ''), goalLine]]) +
      (goals.includes('Build muscle') ? '' : '<p class="ka-small">This guide is for <b>building muscle</b>. Your questionnaire goal is ' + esc(goalLine.toLowerCase()) + ' — for that, Option A above (or your coach\u2019s plan) fits better; the numbers below show what a muscle-gain phase would look like for you.</p>') +
      '<h4>Your targets for muscle gain</h4>' +
      '<ul><li>TDEE estimate: ' + tLo.toLocaleString() + '–' + tHi.toLocaleString() + ' kcal/day</li>' +
      '<li>Target (surplus): ' + sLo.toLocaleString() + '–' + sHi.toLocaleString() + ' kcal/day</li>' +
      '<li>Protein 2.0–2.2 g/kg → ' + pLo + '–' + pHi + ' g · Fat ~1 g/kg → ' + fLo + '–' + fHi + ' g · Carbs: the rest → ' + cLo + '–' + cHi + ' g</li>' +
      '<li><b>Daily example:</b> ' + pMid + ' g protein, ' + fMid + ' g fat, ' + cMid + ' g carbs ≈ ' + cal.toLocaleString() + ' kcal</li></ul>';
  }

  const CALORIES = (answers) => section('Calorie counting guide for muscle gain', `
    <ol>
      <li><b>Understanding calories</b> — a calorie is a unit of energy; calories in food are how much energy your body gets from what you eat and drink.</li>
      <li><b>Why count?</b> To gain muscle, eat in a surplus (more than you burn). To lose fat, eat in a deficit. To maintain, eat what you burn.</li>
      <li><b>How</b> — track everything you eat and drink, use an app (e.g. MyFitnessPal, Cronometer), and use a food scale for accuracy.</li>
      <li><b>Calories per gram</b> — protein 4, carbohydrate 4, fat 9, alcohol 7.</li>
    </ol>
    ${yourStatsHtml(answers)}
    <h4>Sample week — 2 large meals a day (~1,600–1,700 kcal each), plus an optional shake or snack</h4>
    ${table(['Day', 'Meal 1', 'Meal 2'], [
      ['1', 'Chicken breast (200 g), rice (200 g), avocado (50 g), Greek yoghurt with honey & oats', 'Salmon (150 g), sweet potatoes (250 g), olive-oil-dressed salad, banana + whey shake'],
      ['2', 'Beef mince (150 g), couscous, chickpeas, mixed greens, 1 tbsp olive oil', 'Grilled tofu or paneer (200 g), brown rice, peanut-butter smoothie (banana + whey)'],
      ['3', 'Turkey breast, roasted potatoes, hummus, Greek yoghurt with granola', 'Shrimp stir-fry (200 g), noodles, avocado, a square of dark chocolate'],
      ['4', 'Lamb or steak (150 g), quinoa, spinach sautéed in oil, fruit + yoghurt', 'Cottage cheese (200 g), oats with nuts and banana, whey shake'],
      ['5', 'Eggs (4), chicken sausage, toast (2), beans, apple with peanut butter', 'Grilled chicken thighs (200 g), pasta, olive oil, side salad'],
      ['6', 'Tuna wrap (2 large wraps), guacamole, Greek yoghurt', 'Baked salmon, rice with peas, avocado salad, chocolate protein shake'],
      ['7', 'Eggs (3), smoked salmon, potatoes, oats with a protein scoop', 'Chicken curry (200 g), basmati rice, yoghurt, peanut-butter smoothie']
    ])}
    <p class="ka-small"><b>Kenyan swaps:</b> turkey → chicken · salmon or shrimp → tilapia or omena · paneer or cottage cheese → eggs, beans or mala · couscous or quinoa → rice, githeri or ugali · noodles or pasta → rice or chapati · whey or casein shake → milk with groundnuts or peanut butter · Greek yoghurt → mala or plain yoghurt.</p>
    <h4>Tips for success</h4>
    <ul><li>Track all food daily with an app.</li><li>Use a kitchen scale.</li><li>Meal-prep to stay consistent.</li><li>Weigh yourself weekly — aim for 0.25–0.5 kg gain a week.</li><li>Adjust intake if your weight stalls for 2–3 weeks.</li></ul>
    <h4>Bulking on a budget</h4>
    <p>Food over supplements — build on cheap staples. Carbs: rice, oats, potatoes, pasta, maize flour. Protein: eggs, chicken thighs, minced beef, beans, omena. Fats: peanut butter, groundnuts, cooking oil, whole milk.</p>
    <p><b>Example day:</b> breakfast — oats + peanut butter + whey; lunch — rice + chicken thighs + veggies; post-workout — whey shake + banana; dinner — pasta + ground beef + cheese; before bed — casein shake or cottage cheese.</p>
`);

  if (!window.MP_DIETS) return; // diets.js not loaded
  window.MP_DIETS.register({
    id: 'coach-ka-2025',
    name: 'Coach KA\u2019s Diet',
    author: 'Coach KA',
    ownerId: OWNER_ID,
    published: true, // Coach KA can also switch this in Coach > My diets
    summary: 'Light and liquid until mid-afternoon — juice, herbal tea, smoothies, nuts and seeds — then one proper meal between 3 and 7 pm. Plant-first, with options to lose weight or gain.',
    tags: ['Plant-first', 'One main meal', 'Lose weight', 'Gain muscle'],
    variants: VARIANTS,
    weekCaution: WEEK_CAUTION,
    how: HOW,
    reference: (answers) => RULES + ANTI + TEA + FOODS + CALORIES(answers)
  });
})();
