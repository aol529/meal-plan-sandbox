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
  /* ---------------- 1–4. Background & reference ---------------- */
  // Background & reference sections, as editable text (Coach > My diets).
  // Format: ### heading · - bullet · 1. numbered · | table | row | ·
  // > highlighted note · **bold** · {{your-numbers}} = the viewer's own
  // calorie numbers (yourStatsHtml below).
  const REFERENCE = [
    {
      "title": "Coach KA’s 7 rules",
      "body": "### Rule #1 — Water first\nAfter a good night’s sleep (6+ hours), always drink water first thing in the morning — before your shower, before tea or food. You’ve gone all night without any, and starting the day hydrated supports healthy blood pressure, energy and digestion.\n\nThrough the day, aim for about **30–35 ml of water per kg of bodyweight** — roughly 2.5–3 litres at 80 kg — and more when you train or it’s hot. Water keeps you fuller between meals, which makes it easier to stick to your plan.\n\nHave kidney or heart problems, or been told to limit fluids? Follow your doctor’s advice instead.\n\n### Rule #2 — Fruit is food\nFor real, ask the silverback gorilla.\n\nA later first meal — around 10:00 am — suits a lot of people: it gives your body a longer overnight break before you eat again. If you train in the morning or feel shaky without breakfast, eat earlier; what matters most is what you eat, not the clock.\n\nYour breakfast should be fruit, fruit salad, or at least start with a fruit. Fruit gives you fibre, vitamins and antioxidants, and its natural sugar comes packaged with fibre and water — steadier energy than any energy drink.\n\nWater comes first, and whole fruit beats juice: juice loses most of the fibre and is easy to over-drink. If you want something blended, make it a smoothie, which keeps the whole fruit:\n1. Add a vegetable of your choice to a blender, like bok choy (found at Chandarana Foodplus stores).\n2. Pick either dry or juicy fruit — e.g. pineapple and papaya, or banana and mango.\n3. Add nuts and/or seeds: almonds, chia, flax, pumpkin, sesame seeds, peanuts, groundnuts.\n4. Boost with turmeric and ginger.\n5. Add plant-based milk.\n\n### Rule #3 — It’s not Breakfast, it is Break Fast\nOnce your last meal has been digested your stomach is empty, and from then until you next eat, you are fasting — every night, for everyone. Your first meal is what breaks that fast.\n\nBreak it with something light and easy on an empty stomach that also rehydrates you — a smoothie, porridge, soup, or tea alongside some fruit. Porridge, soup or a smoothie with nuts or seeds beats juice alone, because they bring some protein and fibre to carry you to your next meal.\n\n### Rule #4 — If you want to be as strong as a bull, don’t eat the bull, eat what the bull eats\nRaw nuts, seeds, grains, berries, vegetables. These could best escort the drink that breaks your fast. Most, if not all, of your dietary needs could be met in your first meal of the day.\n\n### Rule #5 — Cooking does not require killing: eat plant-first\nBuild most of what you eat from plants — fruit, vegetables, grains, beans, lentils, nuts and seeds. Keep meat, fish, eggs and dairy mostly to your main meal of the day (your main meal in Options A–C), rather than spreading them through every meal.\n\nPlant proteins count too: beans, lentils, ndengu, chickpeas, groundnuts and soy can stand in for meat on any day.\n\n### Rule #6 — Avoid CRAP, most of the time\nCarbonated, Refined, Artificial and Processed. Build your days on whole foods; the one small planned treat in Options B and C is the exception that keeps the plan livable — not a licence for more.\n\n### Rule #7 — Good health starts in the gut\nLook after your gut and it looks after you. Feed it fibre — fruit, vegetables, beans, lentils and whole grains (Rules 2, 4 and 5) — and fermented foods like mala or plain yoghurt, and go easy on the processed stuff (Rule 6)."
    },
    {
      "title": "The power of \"anti\": protective properties in food",
      "body": "Nutrition is more than macronutrients and calories — food is rich in natural compounds that may help the body resist inflammation, oxidation, infection and metabolic damage. Many have \"anti-\" properties.\n\nThese are reasons to eat more of these foods as part of a varied diet — not cures. Most effects were measured in lab or supplement-dose studies, so everyday amounts help gently over time.\n\n| Anti- property | May help… | Examples |\n| Anti-inflammatory | Calm inflammation | Turmeric, ginger, omega-3s |\n| Antioxidant | Protect cells from oxidative stress | Berries, green tea, vitamin C |\n| Antibacterial | Fight harmful bacteria | Garlic, honey, oregano oil |\n| Antiviral | Support defence against viruses | Elderberry, green tea, zinc |\n| Antifungal | Limit fungal growth | Coconut oil, garlic |\n| Antihypertensive | Support healthy blood pressure | Beets, garlic, potassium |\n| Antithrombotic | Support healthy blood flow | Omega-3s, turmeric |\n| Antiatherogenic | Protect arteries from plaque | Fibre, olive oil |\n| Antilipidemic | Lower cholesterol/triglycerides | Oats, nuts, plant sterols |\n| Antiobesogenic | Support a healthy weight | Green tea, vinegar, fibre |\n| Antiglycation | Reduce AGE-related ageing damage | Cinnamon, polyphenols |\n| Antispasmodic | Ease cramps/spasms | Peppermint, magnesium |\n| Antiemetic | Ease nausea | Ginger, vitamin B6 |\n| Antiallergic | Ease allergic reactions | Quercetin, vitamin C |\n| Antiulcerogenic | Protect the stomach lining | Cabbage juice, licorice |\n| Antinociceptive | Ease pain | Turmeric, capsaicin |\n\n> **Supplements are different from food.** Ashwagandha, licorice root, quercetin, elderberry and other concentrated supplements can interact with medication (including blood-pressure and blood-thinning drugs) and aren’t advised in pregnancy. Check with a doctor or pharmacist before taking them — the foods themselves are fine in normal amounts."
    },
    {
      "title": "Bedtime anti-inflammatory tea",
      "body": "| Ingredient | Key benefits |\n| Turmeric | Anti-inflammatory, antioxidant, liver support, may promote better sleep |\n| Black pepper | Enhances absorption of curcumin (from turmeric), aids digestion |\n| Ginger | Anti-nausea, anti-inflammatory, promotes digestion, warms the body |\n| Lemon | Vitamin C, aids digestion, boosts immunity |\n| Cloves | Antibacterial, anti-inflammatory, aids digestion, may reduce oral bacteria |\n\n### Why before bed\n- May help calm inflammation overnight\n- Supports digestion and may reduce bloating or gas\n- Can support your immune defences\n- Warms the body, helping you relax\n- May support steadier blood sugar\n- Adds antioxidants during your body’s overnight repair\n\n### Recipe (single serving)\n- ½ tsp turmeric powder (or 1-inch fresh root)\n- A pinch (⅛ tsp) of black pepper\n- 1-inch fresh ginger, sliced, or ½ tsp powder\n- 2 cloves\n- ½ lemon, squeezed\n- 1.5–2 cups water\n- Optional: ½ tsp raw honey, added after steeping — not during boiling\n\n1. Bring the water to a boil.\n2. Add turmeric, ginger, cloves and black pepper.\n3. Simmer on low heat for 10 minutes.\n4. Turn off the heat; add the lemon juice and optional honey.\n5. Strain and sip slowly, 30–60 minutes before bed.\n\n**Best time:** 30–60 minutes before bed, or during the post-dinner wind-down. Not right before lying down, to avoid reflux or waking up to pee.\n\n**Variations:** add cinnamon; a splash of coconut or almond milk for a \"golden milk\" style drink; leave out honey (or keep it under ½ tsp) if fasting; swap cloves for cardamom or star anise sometimes.\n\n> **Cautions** — heartburn or reflux (lemon, ginger) in sensitive people; cloves, turmeric and ginger all mildly thin the blood, so **be careful if on blood-thinning medication**; ginger and pepper can be stimulating in excess; too much pepper or turmeric can upset an empty stomach; lemon and ginger can make you urinate more."
    },
    {
      "title": "What to eat — food lists",
      "body": "| Group | Foods |\n| Fruits | Bananas, apples, pears, peaches, mangoes, lemons, limes, papaya, soursop, passion fruit, avocado |\n| Vegetables | Spinach, kale, lettuce, cucumber, cauliflower, broccoli, tomato, celery, cabbage, bell peppers, onions, okra, mushrooms, cayenne pepper |\n| Whole grains | Oats, millet, brown rice, basmati/pishori rice, maize |\n| Nuts | Almonds, cashews, peanuts, hazelnuts, pistachios, walnuts, macadamia |\n| Dried fruit | Dates, raisins, figs, apricots, prunes |\n| Roots | Irish potatoes, sweet potatoes, yam, cassava, carrots |\n| Legumes | Kidney, garbanzo, black and black-eyed beans; red and green lentils; chickpeas, green peas |\n| Seeds | Sesame, pumpkin, chia, flax, sunflower |\n| Plant-based milk | Soy, coconut, almond, cashew, oat |\n| Salad oils | Olive, coconut, avocado, sesame |\n| Salt | Himalayan, sea, iodized, pink |\n| Herbs & spices | Parsley, cilantro, paprika, coriander, cinnamon |\n| Sweeteners | Stevia, jaggery, honey |"
    },
    {
      "title": "Nutrients to watch on a plant-first diet",
      "body": "Eating mostly plants is good for you — but a few nutrients come mainly from animal foods, or are easy to miss when your day is light until mid-afternoon. Keep an eye on these:\n\n| Nutrient | Why it matters | Where to get it |\n| **Iron** | Carries oxygen — low iron means tiredness and weaker training. Women who menstruate need more. | Beans, ndengu, lentils, sukuma wiki, spinach, managu, eggs, omena, red meat |\n| **Vitamin B12** | Nerves and blood. Found almost only in animal foods. | Eggs, milk, mala, yoghurt, omena, fish, meat |\n| **Calcium** | Bones and muscle contraction. | Milk, mala, yoghurt, omena (eaten with the bones), sukuma wiki, kale, sesame |\n| **Vitamin D** | Bones and immunity. | Sunshine on your skin, eggs, oily fish |\n| **Omega-3** | Heart, brain, calmer inflammation. | Omena, tilapia, sardines, flax and chia seeds, walnuts |\n| **Iodine** | Thyroid — your metabolism. | **Iodized** salt, fish, eggs, milk |\n\n### Tips\n- Eat iron-rich food with **vitamin C** (tomatoes, kachumbari, an orange) to absorb more of it — and keep black tea and coffee away from those meals, as they block it.\n- If you eat almost no animal foods, B12 is the one you can’t get from plants — ask about a supplement.\n- Himalayan, sea and pink salt usually **aren’t iodized** — use iodized salt for most of your cooking.\n- Fish (omena or tilapia) twice a week covers omega-3 and a lot of calcium.\n- Indoors most of the day, darker skin, or covered up outdoors? You may get less vitamin D from the sun.\n\n> **Ask your doctor before taking supplements** — and get your iron checked if you’re often tired, pale or have heavy periods."
    },
    {
      "title": "Calorie counting guide for muscle gain",
      "body": "1. **Understanding calories** — a calorie is a unit of energy; calories in food are how much energy your body gets from what you eat and drink.\n2. **Why count?** To gain muscle, eat in a surplus (more than you burn). To lose fat, eat in a deficit. To maintain, eat what you burn.\n3. **How** — track everything you eat and drink, use an app (e.g. MyFitnessPal, Cronometer), and use a food scale for accuracy.\n4. **Calories per gram** — protein 4, carbohydrate 4, fat 9, alcohol 7.\n\n{{your-numbers}}\n\n### Sample week — 2 large meals a day (~1,600–1,700 kcal each), plus an optional shake or snack\nPlant-first, like the rest of this diet: beans, ndengu, eggs, mala and groundnuts carry most of the protein, and meat or fish sits in the main meal. Prefer Coach KA's daily rhythm? Split Meal 1 across Option C's morning, mid-morning and lunch slots.\n\n| Day | Meal 1 (plant-first) | Meal 2 (main meal) |\n| 1 | Githeri (2 cups), 3 boiled eggs, avocado, 500 ml mala | Chicken (200 g), rice (2 cups), sukuma wiki, groundnut sauce |\n| 2 | Ndengu stew with 2 chapatis; yoghurt with oats and banana | Whole tilapia, ugali, cabbage, kachumbari |\n| 3 | Beans and rice (2 cups), 3 eggs, avocado, a glass of milk | Beef stew (150 g), matoke, spinach |\n| 4 | Oat porridge made with milk, peanut butter and banana; 3 eggs | Bean or chickpea curry, brown rice, omena (150 g), greens |\n| 5 | Lentil stew with 2 chapatis, mala, a handful of groundnuts | Chicken thighs (200 g), sweet potatoes, mixed vegetables |\n| 6 | Githeri with 2 eggs and avocado; plain yoghurt | Fish curry, rice with peas, kachumbari |\n| 7 | 3 eggs, sweet potatoes, beans, a glass of milk | Ndengu and beef (100 g) stew, ugali, sukuma wiki, yoghurt |\n\n**Optional shake:** milk or soy milk + banana + peanut butter or groundnuts (add a scoop of whey if you use it — food first).\n\n### Tips for success\n- Track all food daily with an app.\n- Use a kitchen scale.\n- Meal-prep to stay consistent.\n- Weigh yourself weekly — aim for 0.25–0.5 kg gain a week.\n- Adjust intake if your weight stalls for 2–3 weeks.\n\n### Bulking on a budget\nFood over supplements — build on cheap staples. Carbs: maize flour, rice, oats, potatoes, sweet potatoes, matoke. Protein: beans, ndengu, eggs, omena, mala, groundnuts — plus chicken thighs or minced beef at the main meal. Fats: groundnuts, peanut butter, avocado, a little cooking oil, whole milk.\n\n**Example day:** breakfast — oat porridge with milk + peanut butter + banana; lunch — githeri with 2 eggs and avocado; after training — milk + banana + groundnuts; dinner — ugali + beef or beans + sukuma wiki; before bed — a cup of mala or yoghurt."
    }
  ];

  /* ---------------- 5. Weekly options ---------------- */
  const JUICE = ['Juice or whole fruit + a protein†', '6–8 am', 'Coconut', 'Pineapple', 'Watermelon', 'Apple', 'Mango', 'Passion'];
  const FRUIT = ['Whole fruit + a protein†', '6–8 am', 'Coconut pieces', 'Pineapple', 'Watermelon', 'Apple', 'Mango', 'Passion fruit'];
  const TEAS = ['Tea + a protein†', '10–11 am', 'Moringa', 'Lemon', 'Ginger', 'Turmeric', 'Green tea', 'Hibiscus'];
  const DINNER = ['Main meal', '3–7 pm, or with family',
    'Lean meat · matoke · guacamole', 'Lentils · rice · boiled mixed veggies', 'Chicken breast · baked Irish potatoes · guacamole',
    'Legumes · sweet potatoes · ratatouille', 'Fish · chips · kachumbari', 'Your choice'];
  // The three weekly options, as plain data so Coach KA can edit them.
  const HEAD = ['', 'Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Weekend'];
  const MID_MORNING = ['Tea / porridge / yoghurt / smoothie + a protein†', '10–11 am', 'Moringa', 'Lemon', 'Ginger', 'Turmeric', 'Green tea', 'Hibiscus'];
  const TREAT = ['One small planned treat', 'any time', 'Trail mix', '—', 'Chocolate', 'Ice cream', 'Popcorn', 'Cake'];
  const VARIANTS = [
    { id: 'A', label: 'Option A — lose weight', forGoals: ['Lose fat'],
      intro: 'Light until mid-afternoon — whole fruit, tea and a protein smoothie — then one proper meal.',
      week: { head: HEAD, rows: [FRUIT, TEAS,
        ['Balanced smoothie*', '1–2 pm', 'Greens + pineapple', 'Greens + papaya', 'Greens + banana', 'Greens + mango', 'Greens + avocado', 'Your choice'],
        ['Trail mix — only if hungry', 'any time', 'Nuts + raisins', 'Seeds + dates', 'Groundnuts + figs', 'Nuts + apricots', 'Seeds + raisins', '—'],
        DINNER] },
      footnote: '† Protein at every eating time — 2 boiled eggs, a cup of mala or plain yoghurt, a glass of milk or soy milk, a handful of groundnuts, or a spoon of peanut butter.\n\n* **Daily smoothie:** a handful of greens (spinach, sukuma or bok choy) + the day\u2019s fruit + a spoon of nuts or seeds (groundnuts, chia, flax) + a protein (a cup of mala or yoghurt, a spoon of peanut butter, or a scoop of protein powder) + milk or plant milk. A pinch of turmeric and ginger if you like.\n\nFruit and tea by day are just examples — any fruit or herbal tea works. **Weekend:** same rhythm, your choice of foods.' },
    { id: 'B', label: 'Option B — gain mass (some fat)', forGoals: [],
      intro: 'Like Option C, but lunch is anything you fancy — the faster way to gain, accepting a bit of fat.',
      week: { head: HEAD, rows: [JUICE, MID_MORNING, TREAT,
        ['Lunch — anything you fancy', '1–2 pm', 'Beef', 'Poultry', 'Fish', 'Pizza', 'Skip lunch', 'Your choice'],
        DINNER] },
      footnote: '† Protein at every eating time — 2 boiled eggs, a cup of mala or plain yoghurt, a glass of milk or soy milk, a handful of groundnuts, or a spoon of peanut butter.\n\nFruit and tea by day are just examples — any fruit or herbal tea works. **Weekend:** same rhythm, your choice of foods.' },
    { id: 'C', label: 'Option C — lean gain', forGoals: ['Build muscle', 'Sports performance'],
      intro: 'Gain more slowly than Option B, but more of it as muscle: a planned, protein-rich lunch instead of "anything you fancy", a fuller mid-morning, and one daily treat.',
      week: { head: HEAD, rows: [JUICE, MID_MORNING, TREAT,
        ['Lunch — protein · carb · veg', '1–2 pm', 'Githeri · 2 eggs · avocado', 'Rice · beans · chicken', 'Chapati · ndengu · sukuma', 'Ugali · beef stew · cabbage', 'Matoke · beans · greens', 'Your choice'],
        DINNER] },
      footnote: '† Protein at every eating time — 2 boiled eggs, a cup of mala or plain yoghurt, a glass of milk or soy milk, a handful of groundnuts, or a spoon of peanut butter.\n\nFruit and tea by day are just examples — any fruit or herbal tea works. **Weekend:** same rhythm, your choice of foods.' }
  ];
  const WEEK_CAUTION = '';

  // "How this diet works" — Coach KA's notes for members, drafted from
  // the plan's own timetable, rules and calorie guide. options: which
  // weekly options a step shows for ([] = all).
  const HOW = {
    lede: 'This diet runs on a daily rhythm: you eat light — mostly liquids, fruit, nuts and seeds — through the morning and early afternoon, and have **one proper main meal — ideally between 3 and 7 pm**, or with your family if you eat later. Every time you eat — not just that meal — include **a protein**: your muscles use it best spread through the day, 3–4 times. Here\u2019s how to make it work.',
    steps: [
      { title: 'Water, then whole fruit', options: ['A'],
        body: 'Start every day with water (Rule 1), then the day\u2019s fruit between 6 and 8 am — **eaten whole, not juiced** — with a protein alongside: 2 boiled eggs, a cup of mala or yoghurt, or a handful of groundnuts. Whole fruit keeps its fibre, so it fills you up; juice loses it and is easy to over-drink, which works against losing fat. Keep juice to a small glass now and then.' },
      { title: 'Water, then juice or fruit', options: ['B', 'C'],
        body: 'Start every day with water (Rule 1), then a fresh juice or the whole fruit between 6 and 8 am — a different fruit each day — **with a protein alongside**: 2 boiled eggs, a cup of mala or yoghurt, or a handful of groundnuts. When you\u2019re gaining, juice\u2019s easy extra calories help; whole fruit or a smoothie keeps the fibre (Rule 2).' },
      { title: 'Mid-morning: tea', options: ['A'],
        body: 'Between 10 and 11, a herbal tea — moringa, lemon, ginger, turmeric, green tea or hibiscus — whichever you like — **with a protein snack**: a handful of nuts, a cup of yoghurt or a boiled egg.' },
      { title: 'Mid-morning: tea or something more filling', options: ['B', 'C'],
        body: 'Between 10 and 11, a herbal tea — moringa, lemon, ginger, turmeric, green tea or hibiscus — whichever you like. On this option it can be porridge, yoghurt or a smoothie instead, for the extra calories you need to gain — make the porridge with milk, or add yoghurt, peanut butter or nuts, so it **carries protein too**.' },
      { title: 'Early afternoon: a protein smoothie', options: ['A'],
        body: 'Between 1 and 2 pm, the same balanced smoothie every day, just rotating the fruit: a handful of greens, the day\u2019s fruit, nuts or seeds, **a protein**, and milk or plant milk (recipe under the week). Trail mix — a small handful of nuts and dried fruit — is only for if you\u2019re hungry between times.' },
      { title: 'Early afternoon: lunch, your way', options: ['B'],
        body: 'Between 1 and 2 pm, eat anything you fancy — the plan suggests beef, poultry, fish, even pizza across the week, and skipping lunch on Friday. This is what makes Option B the faster way to gain.' },
      { title: 'Early afternoon: a proper lunch', options: ['C'],
        body: 'Between 1 and 2 pm, a planned lunch built like your last meal — **a protein, a carb and vegetables**: githeri with eggs, rice with beans and chicken, chapati with ndengu. Gaining muscle needs a surplus and plenty of protein, and two real meals make that reachable. Planned meals rather than "anything you fancy" are what keep the gain leaner than Option B.' },
      { title: 'Your main meal: ideally 3–7 pm', options: [],
        body: 'Your one proper meal, always built the same way: **a protein, a carb, and a fat or vegetable** — e.g. lean meat · matoke · guacamole, lentils · rice · mixed veggies, fish · chips · kachumbari. Swap any part for another from the food lists. Eat plant-first (Rule 5): this is the meal where meat, fish, eggs and dairy belong. Mostly plants? Check **Nutrients to watch** in the background section below.\n\nIf your family eats later, eat with them — sharing the meal matters more than the clock; just keep the same rhythm (light earlier, one proper meal). After your main meal, the kitchen is closed — apart from a post-workout snack on evening training days and the bedtime tea, 30–60 minutes before sleep.' },
      { title: 'Training days', options: [],
        body: 'Fit your eating around your workout so you train with fuel and recover with protein.\n\n**Training in the morning?** Have your morning slot 30–60 minutes before — fruit plus a protein, e.g. a banana with 2 eggs or a cup of mala. Afterwards, a protein snack (milk, yoghurt, groundnuts) before your mid-morning slot.\n\n**Training in the evening?** Have your last meal 1–3 hours before you train. Afterwards, have a small protein snack — a glass of milk, a cup of mala or 2 eggs — even if it\u2019s after 7 pm. Recovery beats the clock.\n\nOn rest days, just follow the timetable.' },
      { title: 'How much to eat', options: ['A'],
        body: 'Losing fat means eating a little less than you burn — not as little as possible. Here are your own numbers, worked out from your questionnaire:\n\n{{your-fat-loss-numbers}}\n\nDon\u2019t want to count? Use your hand at each meal:\n- **Protein:** a palm-sized portion (two for men)\n- **Carbs:** a cupped handful — about your fist (two for men)\n- **Vegetables:** at least half the plate\n- **Fat:** a thumb-sized amount (oil, avocado, groundnuts)\n\n> **Don\u2019t go lower than about 1,500 kcal a day (men) or 1,200 kcal (women)** without a doctor or dietitian. Eating too little costs you muscle, energy and training — and usually ends in a rebound.' },
      { title: 'One small planned treat', options: ['B', 'C'],
        body: 'Gaining options build in one small treat a day — trail mix, a square or two of chocolate, a scoop of ice cream, a bowl of popcorn or a slice of cake. It\u2019s on purpose: gaining is easier with some fun calories, and one planned treat beats random ones. The rest of the day stays whole-food and plant-first (Rules 5 and 6).' },
      { title: 'Track it', options: ['A'],
        body: 'Weigh yourself once a week, same day and time. Steady, gradual loss is the goal; if the scale hasn\u2019t moved in 2–3 weeks, tell your coach at your check-in so they can adjust.' },
      { title: 'Track it', options: ['B', 'C'],
        body: 'Weigh yourself weekly and aim for **0.25–0.5 kg gain a week**. If your weight stalls for 2–3 weeks, add a bit more — the calorie guide below has your own numbers. Track what you eat with an app for the first couple of weeks if you can.' },
      { title: 'On a budget', options: [],
        body: 'This diet doesn\u2019t need expensive food:\n- **Cheapest proteins first:** beans, ndengu, eggs, omena, groundnuts and mala — meat and fish are optional extras\n- **Fruit:** buy what\u2019s in season at the market; bananas, oranges and pawpaw are cheap all year\n- **Nuts and seeds:** buy groundnuts and sesame in bulk; skip imported nuts if money is tight\n- **Teas:** lemon, ginger and moringa cost very little\n- **Protein powder is optional** — milk, mala and eggs do the same job' },
      { title: 'Check in', options: [],
        body: 'Send your usual check-in every 2–3 weeks — it records that you were on this diet, so you and your coach can see how it compares with your normal plan.' }
    ],
    caution: ''
  };

  /* ---------------- 6. Calorie guide ---------------- */
  // Same method as Coach KA's original 2025 guide (Mifflin-St Jeor x
  // activity, a modest surplus, protein by bodyweight, fat ~1 g/kg,
  // carbs the rest), applied to whoever is viewing.
  const NEED_ANSWERS = '<div class="mp-targets mp-targets-empty">Fill in age, sex, height and weight in your questionnaire to see your own numbers here.</div>';
  const r50 = x => Math.round(x / 50) * 50;
  // Maintenance estimate shared by both guides: Mifflin-St Jeor x an
  // activity factor read from training days per week (and job).
  function estimate(a){
    const age = Number(a && a.age), h = Number(a && a.height_cm), w = Number(a && a.weight_kg);
    if (!age || !h || !w || !a.sex) return null;
    const exercise = String(a.exercise || '');
    const perWeek = Number((exercise.match(/(\d+)\s*(x|×|times|days|sessions)/i) || [])[1]) || (exercise.trim() ? 2 : 0);
    let factor = perWeek >= 6 ? 1.725 : perWeek >= 3 ? 1.55 : perWeek >= 1 ? 1.375 : 1.2;
    if (a.job_activity === 'Physically demanding') factor = Math.min(1.9, factor + 0.175);
    const activity = factor >= 1.725 ? 'Very active' : factor >= 1.55 ? 'Active' : factor >= 1.375 ? 'Lightly active' : 'Sedentary';
    const bmr = 10 * w + 6.25 * h - 5 * age + (a.sex === 'Male' ? 5 : -161);
    return { age, h, w, perWeek, factor, activity, bmr, tdee: bmr * factor };
  }

  // Option A: a moderate deficit (~400-500 kcal), never below a safe
  // floor, with protein kept high to protect muscle while losing fat.
  function yourFatLossHtml(a){
    const e = estimate(a);
    if (!e) return NEED_ANSWERS;
    const floor = a.sex === 'Male' ? 1500 : 1200;
    const maint = r50(e.tdee);
    const lo = Math.max(floor, r50(e.tdee - 500)), hi = Math.max(floor, r50(e.tdee - 400));
    const pLo = Math.round(e.w * 1.6), pHi = Math.round(e.w * 2.2);
    const fLo = Math.round(lo * 0.25 / 9), fHi = Math.round(hi * 0.30 / 9);
    const cLo = Math.max(0, Math.round((lo - pHi * 4 - fHi * 9) / 4)), cHi = Math.max(0, Math.round((hi - pLo * 4 - fLo * 9) / 4));
    return '<div class="mp-plan-block mp-your-numbers"><h4>Your numbers for losing fat</h4><ul>' +
      '<li>Maintenance (what you burn now): about ' + maint.toLocaleString() + ' kcal/day — ' + e.activity.toLowerCase() + (e.perWeek ? ', training ' + e.perWeek + '×/week' : '') + '</li>' +
      '<li><b>Target: ' + (lo === hi ? lo.toLocaleString() : lo.toLocaleString() + '–' + hi.toLocaleString()) + ' kcal/day</b>' + (lo === floor ? ' (held at the safe minimum — ask your coach before going lower)' : '') + '</li>' +
      '<li>Protein ' + pLo + '–' + pHi + ' g · fat ' + fLo + '–' + fHi + ' g · carbs ' + cLo + '–' + cHi + ' g</li></ul></div>';
  }

  function yourStatsHtml(a){
    const e = estimate(a);
    if (!e) return NEED_ANSWERS;
    const { age, h, w, perWeek, activity } = e;
    const tdee = e.tdee;
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

  if (!window.MP_DIETS) return; // diets.js not loaded
  window.MP_DIETS.register({
    id: 'coach-ka-2025',
    name: 'Coach KA\u2019s Diet',
    author: 'Coach KA',
    ownerId: OWNER_ID,
    published: true, // Coach KA can also switch this in Coach > My diets
    summary: 'Light and liquid until mid-afternoon — juice, herbal tea, smoothies, nuts and seeds — then one proper main meal, ideally between 3 and 7 pm. Plant-first, with options to lose weight or gain.',
    tags: ['Plant-first', 'One main meal', 'Lose weight', 'Gain muscle'],
    variants: VARIANTS,
    weekCaution: WEEK_CAUTION,
    precheck: '**Before you try this diet, talk to your coach first if:**\n- you have diabetes or blood-sugar problems — long gaps and fruit sugar can swing your levels\n- you\u2019re pregnant or breastfeeding\n- you take regular medication\n- you\u2019ve ever had a difficult relationship with food or an eating disorder — an eating rhythm like this isn\u2019t right for everyone\n- you\u2019re under 18',
    how: HOW,
    reference: REFERENCE,
    tokens: { 'your-numbers': yourStatsHtml, 'your-fat-loss-numbers': yourFatLossHtml }
  });
})();
