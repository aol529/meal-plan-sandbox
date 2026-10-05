/* ============================================================
   APP SHELL — "View as" switcher, notification bell, reset.
   Members see their own Meal Plan; coaches and admins see the
   Meal Plans list (same split as the gym app's Me > Meal Plan and
   Coach > Meal Plans).
   ============================================================ */
(function(){
  const S = window.MP_STORE;
  const viewerSelect = document.getElementById('viewer-select');
  const memberView = document.getElementById('member-view');
  const coachView = document.getElementById('coach-view');
  const bellBtn = document.getElementById('bell-btn');
  const bellList = document.getElementById('bell-list');
  const bellCount = document.getElementById('bell-count');

  function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function roleLabel(u){
    if (u.roles.includes('admin')) return 'admin';
    if (u.roles.includes('trainer')) return 'coach';
    const coach = u.trainerId && S.user(u.trainerId);
    return 'member' + (coach ? ', coach: ' + coach.fullName : '');
  }

  function renderViewerSelect(){
    const me = S.me();
    viewerSelect.innerHTML = S.users().map(u=>
      '<option value="' + u.id + '"' + (me && u.id === me.id ? ' selected' : '') + '>' + esc(u.fullName) + ' (' + esc(roleLabel(u)) + ')</option>'
    ).join('');
  }

  function renderBell(){
    const list = S.notifications();
    const unread = list.filter(n=> !n.read).length;
    bellCount.hidden = !unread;
    bellCount.textContent = unread > 99 ? '99+' : String(unread);
    bellList.innerHTML = list.length
      ? list.slice(0, 20).map(n=> '<button type="button" class="bell-item' + (n.read ? '' : ' unread') + '" data-id="' + n.id + '">' + esc(n.message) + '</button>').join('')
      : '<div class="bell-empty">No notifications yet.</div>';
    bellList.querySelectorAll('.bell-item').forEach(b=> b.addEventListener('click', ()=>{
      S.markRead(b.getAttribute('data-id'));
      closeBell();
      render();
    }));
  }
  function closeBell(){ bellList.hidden = true; bellBtn.setAttribute('aria-expanded', 'false'); }
  bellBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    const open = bellList.hidden;
    bellList.hidden = !open;
    bellBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e)=>{ if (!document.getElementById('bell').contains(e.target)) closeBell(); });

  function render(){
    const me = S.me();
    const staff = S.isCoachOrAdmin(me);
    memberView.hidden = staff;
    coachView.hidden = !staff;
    if (staff) window.MP_RENDER.coach(); else window.MP_RENDER.member();
    renderBell();
  }

  viewerSelect.addEventListener('change', ()=>{ S.setViewer(viewerSelect.value); closeBell(); render(); window.scrollTo(0, 0); });
  document.getElementById('reset-btn').addEventListener('click', ()=>{
    S.reset();
    renderViewerSelect();
    render();
    const t = document.getElementById('t-toast');
    t.textContent = 'Demo data reset.'; t.classList.add('show'); setTimeout(()=> t.classList.remove('show'), 2200);
  });

  // Saving anything adds notifications for someone — keep the bell
  // current after every action without the module having to know.
  ['submit', 'click'].forEach(ev=> document.addEventListener(ev, ()=> setTimeout(renderBell, 50), true));

  renderViewerSelect();
  render();
})();
