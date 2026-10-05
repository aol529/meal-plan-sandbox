/* ============================================================
   STORE — a localStorage stand-in for the gym app's Supabase tables
   (meal_plan_intake, meal_plans, meal_plan_checkins, nutrition_goals,
   notifications). Same shapes and the same access rule as sql/45 in
   the gym app, so anything tried out here ports back cleanly:
     * a member sees only their own data,
     * a coach sees only members whose trainerId is them,
     * an admin sees everyone.
   Everything lives in one localStorage key; "Reset demo data" in the
   header wipes it back to the seed below.
   ============================================================ */
(function(){
  const KEY = 'mealplan-sandbox-v1';

  const SEED = {
    users: [
      { id:'u-achol', fullName:'Achol Deng', roles:['member'], trainerId:'u-ka', height:165, weight:68 },
      { id:'u-brian', fullName:'Brian Otieno', roles:['member'], trainerId:'u-ka', height:178, weight:84 },
      { id:'u-wanjiru', fullName:'Wanjiru Kamau', roles:['member'], trainerId:'u-bravo', height:160, weight:59 },
      { id:'u-ka', fullName:'Coach KA', roles:['trainer'] },
      { id:'u-bravo', fullName:'Coach Bravo', roles:['trainer'] },
      { id:'u-admin', fullName:'Admin', roles:['admin'] }
    ],
    intake: {},        // memberId -> { member_id, answers, submitted_at, updated_at }
    plans: {},         // memberId -> { member_id, coach_id, content, updated_at }
    checkins: [],      // { id, member_id, weight_kg, energy, hunger, digestion, ease, notes, created_at }
    goals: {},         // memberId -> { target_calories, target_protein_g, target_carbs_g, target_fat_g }
    notifications: []  // { id, user_id, message, link, read, created_at }
  };

  function load(){
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch(e){ /* storage unavailable or corrupt — fall back to seed */ }
    return JSON.parse(JSON.stringify(SEED));
  }
  let db = load();
  function save(){
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch(e){ /* storage unavailable — keep in memory */ }
  }
  function uid(){ return (crypto.randomUUID && crypto.randomUUID()) || ('id-' + Date.now() + Math.random().toString(16).slice(2)); }
  function now(){ return new Date().toISOString(); }

  let currentUserId = (function(){
    try { return localStorage.getItem(KEY + '-viewer') || 'u-achol'; } catch(e){ return 'u-achol'; }
  })();

  function user(id){ return db.users.find(u=>u.id===id) || null; }
  function me(){ return user(currentUserId); }
  function isAdmin(u){ return !!(u && u.roles.includes('admin')); }

  // Mirrors is_meal_plan_staff_for() in the gym app's sql/45.
  function isStaffFor(memberId, viewer){
    viewer = viewer || me();
    const m = user(memberId);
    return isAdmin(viewer) || !!(m && m.trainerId && m.trainerId === viewer.id);
  }
  function canSee(memberId){
    const v = me();
    return !!v && (v.id === memberId || isStaffFor(memberId, v));
  }
  function assert(ok, msg){ if (!ok) throw new Error(msg); }

  // Same routing as meal_plan_notify_staff() in sql/45: the member's
  // coach, or every admin if they have no coach.
  function notifyStaffOf(memberId, what){
    const m = user(memberId);
    const targets = m && m.trainerId ? [m.trainerId] : db.users.filter(isAdmin).map(u=>u.id);
    targets.filter(id=> id !== memberId).forEach(id=> notify(id, (m ? m.fullName : 'A member') + ' ' + what, 'coach'));
  }
  function notify(userId, message, link){
    db.notifications.unshift({ id: uid(), user_id: userId, message, link, read: false, created_at: now() });
  }

  window.MP_STORE = {
    users: () => db.users.slice(),
    user,
    me,
    setViewer(id){ currentUserId = id; try { localStorage.setItem(KEY + '-viewer', id); } catch(e){} },
    isAdmin,
    isStaffFor,
    isCoachOrAdmin(u){ u = u || me(); return !!(u && (u.roles.includes('trainer') || isAdmin(u))); },

    getIntake(memberId){ return canSee(memberId) ? (db.intake[memberId] || null) : null; },
    saveIntake(answers){
      const m = me(); assert(m && m.roles.includes('member'), 'Only members fill in the questionnaire.');
      const existing = db.intake[m.id];
      db.intake[m.id] = { member_id: m.id, answers, submitted_at: existing ? existing.submitted_at : now(), updated_at: now() };
      notifyStaffOf(m.id, existing ? 'updated their meal plan questionnaire.' : 'filled in the meal plan questionnaire.');
      save();
    },
    // RLS equivalent: only intakes this viewer may see.
    visibleIntakes(){
      return Object.values(db.intake).filter(r=> canSee(r.member_id))
        .sort((a,b)=> a.updated_at < b.updated_at ? 1 : -1);
    },

    getPlan(memberId){ return canSee(memberId) ? (db.plans[memberId] || null) : null; },
    savePlan(memberId, content){
      const v = me(); assert(isStaffFor(memberId, v), 'Only this member’s coach or an admin can write their plan.');
      const existing = db.plans[memberId];
      db.plans[memberId] = { member_id: memberId, coach_id: v.id, content, updated_at: now() };
      notify(memberId, existing ? 'Your coach updated your meal plan.' : 'Your meal plan is ready — take a look.', 'mealplan');
      save();
    },

    getCheckins(memberId){
      return canSee(memberId) ? db.checkins.filter(c=> c.member_id === memberId).sort((a,b)=> a.created_at < b.created_at ? 1 : -1) : [];
    },
    addCheckin(row){
      const m = me(); assert(m && m.roles.includes('member'), 'Only members send check-ins.');
      db.checkins.push(Object.assign({ id: uid(), member_id: m.id, created_at: now() }, row));
      notifyStaffOf(m.id, 'sent a meal plan check-in.');
      save();
    },

    // Stand-in for the gym app's Nutrition calculator (nutrition_goals).
    // Here the coach sets them from the plan editor instead.
    getGoals(memberId){ return canSee(memberId) ? (db.goals[memberId] || null) : null; },
    saveGoals(memberId, goals){
      assert(isStaffFor(memberId), 'Only this member’s coach or an admin can set targets.');
      db.goals[memberId] = goals; save();
    },

    notifications(){ const v = me(); return v ? db.notifications.filter(n=> n.user_id === v.id) : []; },
    markRead(id){ const n = db.notifications.find(x=> x.id === id); if (n){ n.read = true; save(); } },

    reset(){ db = JSON.parse(JSON.stringify(SEED)); save(); }
  };
})();
