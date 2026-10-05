/* ============================================================
   DIETS — "try somebody else's diet"
   A registry of named diets (e.g. Coach KA's) that members can browse
   and try, and that each diet's author can edit from the coach side.

   A diet file registers its defaults with MP_DIETS.register():
     { id, name, author, ownerId, published, summary, tags: [..],
       variants: [{ id, label, forGoals: [questionnaire goals], intro,
                    week: { head: [...], rows: [[...], ...] }, footnote }],
       weekCaution,                       // shown under every week
       how: { lede, steps: [{ title, body, options: [variant ids] }], caution },
       reference(answers) -> html }       // long background (not editable here)

   The author's edits (Coach > My diets) are saved in MP_STORE and
   replace those defaults field by field — get()/visibleTo() always
   return the edited version. Text fields use a tiny format: a blank
   line starts a new paragraph, **double asterisks** make bold.
   ============================================================ */
(function(){
  const S = window.MP_STORE;
  const bases = [];
  const EDITABLE = ['name', 'summary', 'tags', 'published', 'variants', 'weekCaution', 'how'];

  function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function fmtDate(iso){ return new Date(iso).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' }); }
  // Plain text -> safe HTML: paragraphs on blank lines, **bold**.
  function rich(text){
    return String(text || '').trim().split(/\n\s*\n/).filter(Boolean).map(p=>
      '<p>' + esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>') + '</p>').join('');
  }
  const clone = o => JSON.parse(JSON.stringify(o));

  function merged(base){
    const edits = S.getDietEdits(base.id);
    const d = Object.assign({}, base);
    if (edits) EDITABLE.forEach(k=>{ if (edits[k] !== undefined) d[k] = edits[k]; });
    d.editedAt = edits ? edits.updated_at : null;
    return d;
  }
  function all(){ return bases.map(merged); }
  function visibleTo(user){ return all().filter(d=> d.published || (user && d.ownerId === user.id)); }
  function ownedBy(user){ return user ? all().filter(d=> d.ownerId === user.id) : []; }
  function get(id){ const b = bases.find(x=> x.id === id); return b ? merged(b) : null; }

  function variantFor(diet, answers){
    const goals = (answers && answers.goals) || [];
    return diet.variants.find(v=> (v.forGoals || []).some(g=> goals.includes(g))) || diet.variants[0];
  }

  function weekTableHtml(week){
    return '<table class="admin-table diet-week"><tr>' + week.head.map(h=> '<th>' + esc(h) + '</th>').join('') + '</tr>' +
      week.rows.map(r=> '<tr>' + r.map((c, i)=> i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table>';
  }

  function howHtml(diet, variant){
    const how = diet.how || { steps: [] };
    const steps = how.steps.filter(s=> !s.options || !s.options.length || s.options.includes(variant.id));
    return (how.lede ? '<div class="mp-how-lede">' + rich(how.lede) + '</div>' : '') +
      steps.map((s, i)=> '<div class="mp-how-step"><div class="mp-how-num">' + (i + 1) + '</div><div><h3>' + esc(s.title) + '</h3>' + rich(s.body) + '</div></div>').join('') +
      (how.caution ? '<div class="admin-notice mp-refer">' + rich(how.caution) + '</div>' : '');
  }

  /* ---------------- Member: list + detail ---------------- */
  function listHtml(user, trial){
    const list = visibleTo(user);
    let html = '<div class="day-focus">Try a diet</div>' +
      '<p class="mp-how-lede">Curious how someone else eats? Try their diet for a few weeks. Your coach is told, your check-ins record which diet you were on, and you can stop any time.</p>';
    if (trial){
      html += '<div class="admin-notice diet-active">You’re trying <b>' + esc(trial.diet_name) + '</b>' +
        (trial.variant_label ? ' (' + esc(trial.variant_label) + ')' : '') + ' since ' + fmtDate(trial.started_at) + '. ' +
        '<button type="button" class="btn2" data-diet-open="' + esc(trial.diet_id) + '">Open it</button></div>';
    }
    html += '<div class="diet-cards">' + list.map(d=>
      '<div class="diet-card' + (trial && trial.diet_id === d.id ? ' trying' : '') + '">' +
        '<div class="diet-card-head"><h3>' + esc(d.name) + '</h3>' + (d.published ? '' : '<span class="diet-private">🔒 Not published</span>') + '</div>' +
        '<div class="field-hint">by ' + esc(d.author) + '</div>' +
        '<p>' + esc(d.summary) + '</p>' +
        '<div class="diet-tags">' + (d.tags || []).map(t=> '<span>' + esc(t) + '</span>').join('') + '</div>' +
        '<button type="button" class="btn2 primary" data-diet-open="' + esc(d.id) + '">' + (trial && trial.diet_id === d.id ? 'Open — you’re trying this' : 'Take a look') + '</button>' +
      '</div>'
    ).join('') + '</div>';
    return html;
  }

  function detailHtml(diet, user, answers, trial, variantId){
    const trying = !!(trial && trial.diet_id === diet.id);
    const variant = diet.variants.find(v=> v.id === variantId) ||
      (trying && diet.variants.find(v=> v.id === trial.variant)) || variantFor(diet, answers);
    const matched = variantFor(diet, answers);
    let html = '<button type="button" class="btn2 diet-back" data-diet-back>← All diets</button>' +
      '<div class="day-focus">' + esc(diet.name) + ' · by ' + esc(diet.author) + '</div>';
    if (!diet.published){
      html += '<div class="admin-notice ka-private"><b>Not published — only you can see this diet.</b> Publish it from Coach → My diets.</div>';
    }
    html += '<div class="diet-trial-bar">' + (trying
      ? '<span>✅ You’re trying this diet' + (trial.variant_label ? ' — <b>' + esc(trial.variant_label) + '</b>' : '') + ' since ' + fmtDate(trial.started_at) + '.</span>' +
        (variant.id !== trial.variant ? '<button type="button" class="btn2 primary" data-diet-start>Switch to ' + esc(variant.label) + '</button>' : '') +
        '<button type="button" class="btn2" data-diet-stop>Stop trying</button>'
      : '<span>Want to give it a go? Your coach is told, and your check-ins will show you were on this diet.</span>' +
        '<button type="button" class="btn2 primary" data-diet-start>Try ' + esc(variant.label) + '</button>') + '</div>';

    html += '<div class="mp-sub-head">Your week</div><div class="sched-sub diet-variants">' + diet.variants.map(v=>
      '<button type="button" data-diet-variant="' + esc(v.id) + '" class="' + (v.id === variant.id ? 'active' : '') + '">' + esc(v.label) +
      (v.id === matched.id && answers && (answers.goals || []).length ? ' · fits your goal' : '') + '</button>'
    ).join('') + '</div>';
    if (variant.intro) html += '<div class="diet-variant-intro">' + rich(variant.intro) + '</div>';
    html += weekTableHtml(variant.week);
    if (variant.footnote) html += '<div class="ka-small">' + rich(variant.footnote) + '</div>';
    if (diet.weekCaution) html += '<div class="admin-notice mp-refer">' + rich(diet.weekCaution) + '</div>';

    html += '<div class="mp-sub-head">How this diet works</div>' + howHtml(diet, variant);
    if (diet.reference) html += '<div class="mp-sub-head">Background & reference</div>' + diet.reference(answers);
    return html;
  }

  /* ---------------- Coach: My diets editor ----------------
     Works on a draft copy; nothing reaches members until Save. */
  let editing = null;      // { id, draft }
  let editVariant = null;

  function editorListHtml(user){
    const mine = ownedBy(user);
    if (!mine.length) return '<div class="empty-msg">You haven’t written any diets yet.</div>';
    return '<div class="diet-cards">' + mine.map(d=>
      '<div class="diet-card"><div class="diet-card-head"><h3>' + esc(d.name) + '</h3>' +
      '<span class="' + (d.published ? 'mp-pill ok' : 'diet-private') + '">' + (d.published ? 'Published' : '🔒 Not published') + '</span></div>' +
      '<p>' + esc(d.summary) + '</p>' +
      '<div class="field-hint">' + (d.editedAt ? 'Last edited ' + fmtDate(d.editedAt) : 'Original version from its file') + '</div>' +
      '<button type="button" class="btn2 primary" data-diet-edit="' + esc(d.id) + '">Edit</button></div>'
    ).join('') + '</div>';
  }

  function cellInput(value, attrs){ return '<input type="text" class="mp-input diet-cell" value="' + esc(value) + '" ' + attrs + '>'; }

  function editorHtml(){
    const d = editing.draft;
    const v = d.variants.find(x=> x.id === editVariant) || d.variants[0];
    editVariant = v.id;
    const vi = d.variants.indexOf(v);
    let html = '<button type="button" class="btn2 diet-back" data-edit-close>← My diets</button>' +
      '<div class="day-focus">Editing · ' + esc(d.name) + '</div>' +
      '<div class="admin-notice">Changes go live for members when you press <b>Save</b>. In text boxes, a blank line starts a new paragraph and <b>**double asterisks**</b> make text bold.</div>';

    html += '<div class="diet-edit-section"><h3>Basics</h3>' +
      '<div class="mp-editor-grid"><div class="mp-q"><label class="mp-q-label">Name</label><input type="text" class="mp-input" data-f="name" value="' + esc(d.name) + '"></div>' +
      '<div class="mp-q"><label class="mp-q-label">Tags <span class="field-hint">(comma-separated)</span></label><input type="text" class="mp-input" data-f="tags" value="' + esc((d.tags || []).join(', ')) + '"></div>' +
      '<div class="mp-q mp-wide"><label class="mp-q-label">Summary <span class="field-hint">(shown on the diet’s card)</span></label><textarea class="mp-input" rows="2" data-f="summary">' + esc(d.summary) + '</textarea></div></div>' +
      '<label class="mp-choice diet-publish"><input type="checkbox" data-f="published"' + (d.published ? ' checked' : '') + '> Published — every member can see and try it</label></div>';

    html += '<div class="diet-edit-section"><h3>Your week</h3><div class="sched-sub">' + d.variants.map(x=>
      '<button type="button" data-edit-variant="' + esc(x.id) + '" class="' + (x.id === v.id ? 'active' : '') + '">' + esc(x.label) + '</button>').join('') + '</div>' +
      '<div class="mp-editor-grid"><div class="mp-q"><label class="mp-q-label">Option name</label><input type="text" class="mp-input" data-vf="label" value="' + esc(v.label) + '"></div>' +
      '<div class="mp-q"><label class="mp-q-label">Suggested for goals <span class="field-hint">(comma-separated, as in the questionnaire)</span></label><input type="text" class="mp-input" data-vf="forGoals" value="' + esc((v.forGoals || []).join(', ')) + '"></div>' +
      '<div class="mp-q mp-wide"><label class="mp-q-label">Intro</label><textarea class="mp-input" rows="2" data-vf="intro">' + esc(v.intro) + '</textarea></div></div>' +
      '<div class="diet-week-edit"><table class="admin-table"><tr>' + v.week.head.map(h=> '<th>' + esc(h) + '</th>').join('') + '<th></th></tr>' +
      v.week.rows.map((r, ri)=> '<tr>' + r.map((c, ci)=> '<td>' + cellInput(c, 'data-cell="' + ri + ':' + ci + '" aria-label="' + esc((r[0] || 'Row') + ' — ' + (v.week.head[ci] || 'label')) + '"') + '</td>').join('') +
        '<td><button type="button" class="btn2 diet-row-del" data-row-del="' + ri + '" aria-label="Delete row">✕</button></td></tr>').join('') +
      '</table></div><div class="mp-actions" style="margin-top:6px;"><button type="button" class="btn2" data-row-add>+ Add row</button></div>' +
      '<div class="mp-q"><label class="mp-q-label">Footnote under this week</label><textarea class="mp-input" rows="2" data-vf="footnote">' + esc(v.footnote) + '</textarea></div>' +
      '<div class="mp-q"><label class="mp-q-label">Caution under every week</label><textarea class="mp-input" rows="2" data-f="weekCaution">' + esc(d.weekCaution) + '</textarea></div></div>';

    const how = d.how;
    html += '<div class="diet-edit-section"><h3>How this diet works</h3>' +
      '<div class="mp-q"><label class="mp-q-label">Opening paragraph</label><textarea class="mp-input" rows="3" data-hf="lede">' + esc(how.lede) + '</textarea></div>' +
      how.steps.map((s, si)=> '<div class="diet-step-edit"><div class="diet-step-head"><span class="mp-how-num">' + (si + 1) + '</span>' +
        '<input type="text" class="mp-input" data-step="' + si + ':title" value="' + esc(s.title) + '" aria-label="Step ' + (si + 1) + ' title">' +
        '<button type="button" class="btn2" data-step-move="' + si + ':-1" aria-label="Move up"' + (si === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button type="button" class="btn2" data-step-move="' + si + ':1" aria-label="Move down"' + (si === how.steps.length - 1 ? ' disabled' : '') + '>↓</button>' +
        '<button type="button" class="btn2 diet-row-del" data-step-del="' + si + '" aria-label="Delete step">✕</button></div>' +
        '<textarea class="mp-input" rows="3" data-step="' + si + ':body" aria-label="Step ' + (si + 1) + ' text">' + esc(s.body) + '</textarea>' +
        '<div class="mp-choices diet-step-opts"><span class="field-hint">Show for:</span>' + d.variants.map(x=>
          '<label class="mp-choice"><input type="checkbox" data-step-opt="' + si + ':' + esc(x.id) + '"' + (!s.options || !s.options.length || s.options.includes(x.id) ? ' checked' : '') + '> ' + esc(x.label) + '</label>').join('') +
        '</div></div>').join('') +
      '<div class="mp-actions"><button type="button" class="btn2" data-step-add>+ Add step</button></div>' +
      '<div class="mp-q"><label class="mp-q-label">Closing caution</label><textarea class="mp-input" rows="3" data-hf="caution">' + esc(how.caution) + '</textarea></div></div>';

    html += '<div class="diet-edit-bar"><button type="button" class="btn2 primary" data-edit-save>Save — members see it now</button>' +
      '<button type="button" class="btn2" data-edit-reset>Reset to original</button>' +
      '<span class="field-hint">Background & reference sections (rules, tea, food lists, calorie guide) are edited in the diet’s file.</span></div>';
    void vi;
    return html;
  }

  // Copies every input in the editor back into the draft (so switching
  // option tabs or adding rows never loses typing).
  function readEditor(root){
    const d = editing.draft;
    const v = d.variants.find(x=> x.id === editVariant);
    root.querySelectorAll('[data-f]').forEach(el=>{
      const k = el.getAttribute('data-f');
      if (k === 'published') d.published = el.checked;
      else if (k === 'tags') d.tags = el.value.split(',').map(x=> x.trim()).filter(Boolean);
      else d[k] = el.value;
    });
    root.querySelectorAll('[data-vf]').forEach(el=>{
      const k = el.getAttribute('data-vf');
      v[k] = k === 'forGoals' ? el.value.split(',').map(x=> x.trim()).filter(Boolean) : el.value;
    });
    root.querySelectorAll('[data-cell]').forEach(el=>{
      const [ri, ci] = el.getAttribute('data-cell').split(':').map(Number);
      v.week.rows[ri][ci] = el.value;
    });
    root.querySelectorAll('[data-hf]').forEach(el=>{ d.how[el.getAttribute('data-hf')] = el.value; });
    root.querySelectorAll('[data-step]').forEach(el=>{
      const [si, k] = el.getAttribute('data-step').split(':');
      d.how.steps[Number(si)][k] = el.value;
    });
    d.how.steps.forEach((s, si)=>{
      const boxes = [...root.querySelectorAll('[data-step-opt^="' + si + ':"]')];
      const on = boxes.filter(b=> b.checked).map(b=> b.getAttribute('data-step-opt').split(':')[1]);
      s.options = on.length === boxes.length ? [] : on;
    });
  }

  function renderEditor(root, user, toast, onDone){
    if (!editing){
      root.innerHTML = editorListHtml(user);
      root.querySelectorAll('[data-diet-edit]').forEach(b=> b.addEventListener('click', ()=>{
        const d = get(b.getAttribute('data-diet-edit'));
        editing = { id: d.id, draft: clone(EDITABLE.reduce((o, k)=> (o[k] = d[k], o), {})) };
        editing.draft.how = editing.draft.how || { lede: '', steps: [], caution: '' };
        editVariant = null;
        renderEditor(root, user, toast, onDone);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }));
      return;
    }
    root.innerHTML = editorHtml();
    const again = ()=> renderEditor(root, user, toast, onDone);
    const act = (sel, fn) => root.querySelectorAll(sel).forEach(b=> b.addEventListener('click', ()=>{ readEditor(root); fn(b); again(); }));
    const v = () => editing.draft.variants.find(x=> x.id === editVariant);
    act('[data-edit-variant]', b=>{ editVariant = b.getAttribute('data-edit-variant'); });
    act('[data-row-add]', ()=>{ v().week.rows.push(v().week.head.map(()=> '')); });
    act('[data-row-del]', b=>{ v().week.rows.splice(Number(b.getAttribute('data-row-del')), 1); });
    act('[data-step-add]', ()=>{ editing.draft.how.steps.push({ title: 'New step', body: '', options: [] }); });
    act('[data-step-del]', b=>{ editing.draft.how.steps.splice(Number(b.getAttribute('data-step-del')), 1); });
    act('[data-step-move]', b=>{
      const [si, dir] = b.getAttribute('data-step-move').split(':').map(Number);
      const st = editing.draft.how.steps; const j = si + dir;
      if (j >= 0 && j < st.length) [st[si], st[j]] = [st[j], st[si]];
    });
    root.querySelector('[data-edit-close]').addEventListener('click', ()=>{ editing = null; again(); });
    root.querySelector('[data-edit-save]').addEventListener('click', ()=>{
      readEditor(root);
      const diet = get(editing.id);
      try { S.saveDietEdits(diet, editing.draft); } catch (err){ toast(err.message); return; }
      toast('Saved — members see the new version' + (editing.draft.published ? '.' : ' once it’s published.'));
      editing = null; again(); if (onDone) onDone();
    });
    root.querySelector('[data-edit-reset]').addEventListener('click', ()=>{
      const diet = get(editing.id);
      if (!confirm('Throw away all your edits to ' + diet.name + ' and go back to the original from its file?')) return;
      try { S.clearDietEdits(diet); } catch (err){ toast(err.message); return; }
      toast('Back to the original version.');
      editing = null; again(); if (onDone) onDone();
    });
  }

  window.MP_DIETS = {
    register(d){ bases.push(d); },
    visibleTo, ownedBy, get,
    listHtml, detailHtml,
    renderEditor,
    rich
  };
})();
