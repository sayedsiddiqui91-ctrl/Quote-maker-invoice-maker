/* Break the Default — Quote & Invoice Studio */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const today = (add = 0) => { const d = new Date(); d.setDate(d.getDate() + add); return d.toISOString().slice(0, 10); };

/* ---------- default logo (swap in your real one via Branding → Logo) ---------- */
const MARK = (fg = '#c6ff3d', bg = '#0b0b0d') => `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="11" fill="${fg}"/><path d="M13 11h12c8 0 13 5 13 13s-5 13-13 13H13z" fill="${bg}"/><path d="M8 40 40 8" stroke="${fg}" stroke-width="4.5" stroke-linecap="square"/><path d="M8 40 40 8" stroke="${bg}" stroke-width="1" stroke-dasharray="0"/></svg>`;

/* ---------- catalog: edit prices here or use "save custom item" ---------- */
// type 'hours' => price = your hourly rate; 'cost' => cost is what you pay, price = cost + markup
const CATALOG = [
  // Design & development (billed hourly)
  { cat: 'Design', name: 'Discovery & strategy call + sitemap', hrs: 2, unit: 'hrs' },
  { cat: 'Design', name: 'UI/UX design — per page', desc: 'Desktop + mobile layouts in Figma', hrs: 4, unit: 'hrs' },
  { cat: 'Design', name: 'Brand styling (colours, type, components)', hrs: 3, unit: 'hrs' },
  { cat: 'Design', name: 'Custom graphics / icons', hrs: 2, unit: 'hrs' },
  { cat: 'Development', name: 'Page development — per page', desc: 'Responsive build, clean code', hrs: 6, unit: 'hrs' },
  { cat: 'Development', name: 'Animations & micro-interactions', desc: 'Scroll reveals, hovers, page transitions', hrs: 4, unit: 'hrs' },
  { cat: 'Development', name: 'CMS / blog setup', hrs: 5, unit: 'hrs' },
  { cat: 'Development', name: 'Contact form + email routing', hrs: 1.5, unit: 'hrs' },
  { cat: 'Development', name: 'E-commerce setup (per 10 products)', hrs: 6, unit: 'hrs' },
  { cat: 'Development', name: 'Third-party integrations (analytics, CRM, booking)', hrs: 2, unit: 'hrs' },
  { cat: 'Development', name: 'SEO foundations & schema', hrs: 3, unit: 'hrs' },
  { cat: 'Development', name: 'Performance optimisation', hrs: 2, unit: 'hrs' },
  { cat: 'Development', name: 'Cross-device QA & testing', hrs: 3, unit: 'hrs' },
  { cat: 'Development', name: 'Deployment & go-live', hrs: 1, unit: 'hrs' },
  { cat: 'Development', name: 'Client training walkthrough', hrs: 1, unit: 'hrs' },
  { cat: 'Content', name: 'Copywriting — per page', hrs: 2, unit: 'hrs' },
  { cat: 'Content', name: 'Extra revision round', hrs: 2, unit: 'hrs' },
  { cat: 'Content', name: 'Project management & communication', hrs: 2, unit: 'hrs' },
  // Third-party & assets (you pay → marked up)
  { cat: 'Assets', name: 'Domain name (.com, 1 yr)', cost: 12, unit: 'yr' },
  { cat: 'Assets', name: 'Hosting (monthly)', cost: 10, unit: 'mo' },
  { cat: 'Assets', name: 'Premium font licence', cost: 50, unit: 'pcs' },
  { cat: 'Assets', name: 'Stock photo pack', desc: 'Licensed imagery', cost: 30, unit: 'pack' },
  { cat: 'Assets', name: 'Stock video clip (licensed)', cost: 25, unit: 'pcs' },
  { cat: 'Assets', name: '3D model / Lottie / illustration asset', cost: 40, unit: 'pcs' },
  { cat: 'Assets', name: 'Icon pack licence', cost: 20, unit: 'pcs' },
  { cat: 'Assets', name: 'Premium plugin / template licence', cost: 59, unit: 'pcs' },
  { cat: 'Assets', name: 'Music / sound effect licence', cost: 15, unit: 'pcs' },
  { cat: 'Assets', name: 'SSL / security / backup add-on', cost: 20, unit: 'yr' },
  // AI generation (Higgsfield etc.)
  { cat: 'AI Media', name: 'Higgsfield Plus plan — 1 month', desc: '1,000 credits for AI image/video generation', cost: 39, unit: 'mo' },
  { cat: 'AI Media', name: 'AI hero video generation (Kling)', desc: 'Generated via Higgsfield, multiple takes selected', cost: 4, unit: 'clip' },
  { cat: 'AI Media', name: 'AI premium video generation (Veo / Sora)', cost: 12, unit: 'clip' },
  { cat: 'AI Media', name: 'AI image generation — set of 10', cost: 3, unit: 'set' },
  { cat: 'AI Media', name: 'Video upscale / frame-sequence export', hrs: 1.5, unit: 'hrs' },
];
const CATS = ['All', ...new Set(CATALOG.map(c => c.cat)), 'My items'];


const DEFAULT = () => ({
  id: uid(), type: 'quote', number: 'BTD-Q-0001', currency: '$', date: today(), validDays: 14, dueDate: today(14),
  status: 'unpaid', paid: 0,
  client: { name: '', company: '', email: '', phone: '', address: '' },
  project: { title: '', summary: '', timeline: '', pages: '' },
  items: [], discount: { type: 'pct', value: 0 }, taxRate: 0, depositPct: 50,
  payment: 'Bank transfer / PayPal / Wise\nAccount name: \nDetails: ',
  milestones: 'Kick-off & deposit | Day 1\nDesign approval | Week 1\nDevelopment & review | Week 2–3\nLaunch | Week 4',
  included: '2 rounds of revisions\nMobile-responsive build\nBasic SEO setup\n14 days post-launch support',
  excluded: 'Ongoing hosting after the first period\nExtra pages beyond scope\nCopy or photography not listed',
  terms: '• Work begins once the deposit is received.\n• Prices valid for the period stated above.\n• Additional revisions and scope changes are billed at the hourly rate.\n• Third-party asset costs are billed as listed and licences are transferred on final payment.\n• Final files and access are handed over upon full payment.',
  notes: 'Thanks for trusting us to break the default. Let\'s build something that doesn\'t look like everyone else.',
  from: { name: 'Break the Default', tag: 'Websites that refuse to blend in', email: '', web: '' },
  settings: { rate: 25, markup: 25, accent: '#D4FF62' },
});

let S = load('btd-current') || DEFAULT();
S.cur ||= 'USD'; S.fx ||= 122;
const MARK_IMG = 'break-the-default-logo/mark-lime.svg';
let logo = localStorage.getItem('btd-logo') || '';
let custom = JSON.parse(localStorage.getItem('btd-custom') || '[]');
let catFilter = 'All';

function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
const persist = () => localStorage.setItem('btd-current', JSON.stringify(S));

/* ---------- helpers ---------- */
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const set = (o, p, v) => { const ks = p.split('.'); const l = ks.pop(); ks.reduce((a, k) => a[k], o)[l] = v; };
const usd = v => S.cur === 'BDT' ? v * num(S.fx) : v;   // catalog prices are stored in USD
const money = n => { const v = Number(n) || 0, b = S.cur === 'BDT';
  return (b ? 'Tk ' : '$') + v.toLocaleString('en-US', { minimumFractionDigits: b ? 0 : 2, maximumFractionDigits: b ? 0 : 2 }); };
const num = v => parseFloat(v) || 0;
const hmm = h => h.toString().replace(/\.0+$/, '');

function totals() {
  const sub = S.items.reduce((a, i) => a + num(i.qty) * num(i.price), 0);
  const costTotal = S.items.reduce((a, i) => a + num(i.qty) * num(i.cost), 0);
  const disc = S.discount.type === 'pct' ? sub * num(S.discount.value) / 100 : Math.min(sub, num(S.discount.value));
  const taxable = sub - disc;
  const tax = taxable * num(S.taxRate) / 100;
  const total = taxable + tax;
  const deposit = total * num(S.depositPct) / 100;
  const balance = total - num(S.paid);
  const hours = S.items.filter(i => i.unit === 'hrs').reduce((a, i) => a + num(i.qty), 0);
  // profit: hourly work counts fully as yours; costs are what you paid out
  const profit = total - tax - costTotal;
  return { sub, disc, tax, total, deposit, balance, costTotal, profit, hours };
}

/* ---------- items ---------- */
function newItem(p = {}) {
  if (p.cost != null) p = { ...p, cost: usd(p.cost) };
  const rate = num(S.settings.rate), mk = num(S.settings.markup) / 100;
  let it = { id: uid(), cat: p.cat || 'Development', name: p.name || '', desc: p.desc || '', qty: p.qty ?? 1, unit: p.unit || 'pcs', price: 0, cost: 0 };
  if (p.hrs != null) { it.qty = p.hrs; it.unit = 'hrs'; it.price = rate; it.cost = 0; }
  else if (p.cost != null) { it.cost = p.cost; it.price = +(p.cost * (1 + mk)).toFixed(S.cur === 'BDT' ? 0 : 2); }
  else { it.price = p.price || 0; it.cost = p.cost || 0; }
  return it;
}
function addItem(p, quiet) { S.items.push(newItem(p)); renderItems(); refresh(); if (!quiet) toast('Added ✓'); }
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 1400); }

const openIds = new Set();
function renderItems() {
  const cats = [...new Set([...CATALOG.map(c => c.cat), ...custom.map(c => c.cat), 'Hero Video', 'Custom'])];
  if (!S.items.length) {
    $('#items').innerHTML = `<div class="empty"><b>Nothing added yet</b><p>Start with one of the buttons above — or see how a finished quote looks.</p><button class="btn" id="example">Fill with an example</button></div>`;
    return;
  }
  $('#items').innerHTML = S.items.map((it, n) => {
    const hrs = it.unit === 'hrs', open = openIds.has(it.id);
    const margin = num(it.cost) > 0 ? `<span class="margin">you earn ${money(num(it.qty) * (num(it.price) - num(it.cost)))}</span>` : '';
    return `<div class="item" data-i="${n}">
      <div class="top"><input data-f="name" value="${esc(it.name)}" placeholder="Name of this line"><button class="x" data-del title="Remove">✕</button></div>
      ${it.unit === 'fixed' ? `<div class="calc"><span>Fixed price</span>
        <span class="dollar"><input type="number" step="any" data-f="price" value="${it.price}"></span>
        <b data-tot>${money(num(it.qty) * num(it.price))}</b></div>` : `<div class="calc">
        <input type="number" step="any" data-f="qty" value="${it.qty}"><span>${hrs ? 'hours' : esc(it.unit)} ×</span>
        <span class="dollar"><input type="number" step="any" data-f="price" value="${it.price}"></span><span>${hrs ? '/hr' : 'each'}</span>
        <b data-tot>${money(num(it.qty) * num(it.price))}</b>
      </div>`}
      <div class="meta">${margin}<button class="tog" data-more>${open ? 'Hide details ▴' : 'Details ▾'}</button></div>
      <div class="extra" ${open ? '' : 'hidden'}>
        <label>Description shown to client <em>(what was used, which tool…)</em><textarea data-f="desc" rows="2">${esc(it.desc)}</textarea></label>
        <div class="grid2">
          <label>Section in PDF<select data-f="cat">${cats.map(c => `<option ${c === it.cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
          <label>Unit <em>(hrs, pcs, mo…)</em><input data-f="unit" value="${esc(it.unit)}"></label>
        </div>
        <label>What I paid for this <em>(private — only used to show your profit)</em><span class="dollar"><input type="number" step="any" data-f="cost" value="${it.cost}"></span></label>
      </div>
    </div>`;
  }).join('');
}
$('#items').addEventListener('input', e => {
  const row = e.target.closest('.item'); if (!row || !e.target.dataset.f) return;
  const it = S.items[row.dataset.i]; it[e.target.dataset.f] = e.target.value;
  $('[data-tot]', row).textContent = money(num(it.qty) * num(it.price));
  refresh();
});
$('#items').addEventListener('change', e => { if (e.target.dataset.f === 'cat') refresh(); });
$('#items').addEventListener('click', e => {
  if (e.target.id === 'example') return loadExample();
  const row = e.target.closest('.item'); if (!row) return;
  if (e.target.matches('[data-del]')) { S.items.splice(row.dataset.i, 1); renderItems(); refresh(); }
  if (e.target.matches('[data-more]')) { const id = S.items[row.dataset.i].id; openIds.has(id) ? openIds.delete(id) : openIds.add(id); renderItems(); }
});
function loadExample() {
  if (!S.client.name) S.client.name = 'Jane Doe';
  if (!S.project.title) S.project.title = 'Brand website with scroll-driven hero';
  if (!S.project.summary) S.project.summary = 'A 5-page website with a cinematic, scroll-controlled hero video.';
  [CATALOG[1], CATALOG[4], CATALOG[18], CATALOG[22]].forEach(c => S.items.push(newItem(c)));
  heroAdd({ model: 0, clips: 2, tries: 4, imgs: 4, cp: 0.039, parts: ['plan', 'edit', 'dev'] });
  syncFields(); renderItems(); refresh();
}

/* ---------- pop-up helper ---------- */
function modal(html, mount) { $('#dlgBody').innerHTML = html; mount && mount($('#dlgBody')); dlg.showModal(); }

/* ---------- add: my time ---------- */
/* ---------- add: fixed price (no hours) ---------- */
$('#aFixed').onclick = () => {
  const ideas = ['Website design & development', 'Landing page', 'Portfolio website', 'Logo & branding', 'Website redesign', 'Monthly maintenance'];
  modal(`<h3>💰 Fixed price</h3>
    <p class="hint">Charge one flat amount — no hours shown to the client.</p>
    <div class="chips">${ideas.map(t => `<span class="chip" data-t="${esc(t)}">${esc(t)}</span>`).join('')}</div>
    <label>What is it for?<input id="fName" placeholder="e.g. Website design & development"></label>
    <label>Price<span class="dollar"><input id="fPrice" type="number" step="any" placeholder="15000"></span></label>
    <label>Short description <em>(optional, shown under the name)</em><textarea id="fDesc" rows="2"></textarea></label>
    <button class="btn primary" id="fAdd">Add to quote</button>`, m => {
    m.onclick = e => { if (e.target.dataset.t) $('#fName', m).value = e.target.dataset.t; };
    $('#fAdd', m).onclick = () => {
      S.items.push({ id: uid(), cat: 'Services', name: $('#fName', m).value || 'Project', desc: $('#fDesc', m).value, qty: 1, unit: 'fixed', price: num($('#fPrice', m).value), cost: 0 });
      renderItems(); refresh(); toast('Added ✓'); dlg.close();
    };
    $('#fName', m).focus();
  });
};

$('#aTime').onclick = () => {
  const tasks = CATALOG.filter(c => c.hrs != null);
  modal(`<h3>⏱ Add my time</h3>
    <label>What's the work?<input id="tName" list="tl" placeholder="Type or pick from the list"></label>
    <datalist id="tl">${tasks.map(t => `<option value="${esc(t.name)}">`).join('')}</datalist>
    <label>How many hours?<input id="tHrs" type="number" step="0.5" value="2"></label>
    <div class="sum" id="tCalc"></div>
    <button class="btn primary" id="tAdd">Add to quote</button>`, m => {
    const calc = () => $('#tCalc', m).innerHTML = `${hmm(num($('#tHrs', m).value))} hrs × ${money(S.settings.rate)}/hr = <b>${money(num($('#tHrs', m).value) * num(S.settings.rate))}</b>`;
    $('#tName', m).oninput = e => { const f = tasks.find(t => t.name === e.target.value); if (f) { $('#tHrs', m).value = f.hrs; calc(); } };
    $('#tHrs', m).oninput = calc; calc();
    $('#tAdd', m).onclick = () => {
      const f = tasks.find(t => t.name === $('#tName', m).value);
      addItem({ cat: f?.cat || 'Development', name: $('#tName', m).value || 'Work', desc: f?.desc, hrs: num($('#tHrs', m).value) }); dlg.close();
    };
  });
};

/* ---------- add: something I paid for ---------- */
$('#aPaid').onclick = () => {
  const quick = CATALOG.filter(c => c.cost != null && c.cat === 'Assets').concat(CATALOG.filter(c => c.name.startsWith('Higgsfield')));
  modal(`<h3>🧾 Something I paid for</h3>
    <p class="hint">Tap a common one, or type your own.</p>
    <div class="chips">${quick.map((q, i) => `<span class="chip" data-q="${i}">${esc(q.name.replace(/ \(.*\)/, ''))} · ${money(usd(q.cost))}</span>`).join('')}</div>
    <label>What is it?<input id="pName" placeholder="e.g. Premium font licence"></label>
    <label>What did it cost you?<span class="dollar"><input id="pCost" type="number" step="any" value="0"></span></label>
    <label>What is it used for? <em>(shown to client)</em><input id="pDesc" placeholder="e.g. Headline typeface for the brand"></label>
    <label class="chk"><input type="checkbox" id="pMk" checked> Add my ${S.settings.markup}% markup</label>
    <div class="sum" id="pCalc"></div>
    <button class="btn primary" id="pAdd">Add to quote</button>`, m => {
    const price = () => num($('#pCost', m).value) * ($('#pMk', m).checked ? 1 + num(S.settings.markup) / 100 : 1);
    const calc = () => $('#pCalc', m).innerHTML = `Client pays <b>${money(price())}</b> · you keep <b>${money(price() - num($('#pCost', m).value))}</b>`;
    m.addEventListener('input', calc); m.addEventListener('change', calc); calc();
    m.onclick = e => { const q = quick[e.target.dataset.q]; if (!q) return; $('#pName', m).value = q.name; $('#pCost', m).value = usd(q.cost); $('#pDesc', m).value = q.desc || ''; calc(); };
    $('#pAdd', m).onclick = () => {
      S.items.push({ id: uid(), cat: 'Assets', name: $('#pName', m).value || 'Asset', desc: $('#pDesc', m).value, qty: 1, unit: 'pcs', price: +price().toFixed(S.cur === 'BDT' ? 0 : 2), cost: num($('#pCost', m).value) });
      renderItems(); refresh(); toast('Added ✓'); dlg.close();
    };
  });
};

/* ---------- add: from catalog ---------- */
let catKind = 'all';
$('#aCat').onclick = () => {
  modal(`<h3>📚 Catalog</h3>
    <input id="cQ" placeholder="Search… (hero, font, SEO, domain)" autocomplete="off">
    <div class="chips" id="cKinds">${[['all', 'All'], ['time', 'My time'], ['paid', 'Things I paid for'], ['ai', 'AI media'], ['mine', 'Mine']].map(([k, n]) => `<span class="chip" data-k="${k}">${n}</span>`).join('')}</div>
    <div class="catalog" id="cList"></div>`, m => {
    const draw = () => {
      $$('#cKinds .chip', m).forEach(c => c.classList.toggle('on', c.dataset.k === catKind));
      const q = $('#cQ', m).value.toLowerCase();
      const kind = c => c._my ? 'mine' : c.cat === 'AI Media' ? 'ai' : c.hrs != null ? 'time' : 'paid';
      const all = [...CATALOG, ...custom.map(c => ({ ...c, _my: true }))];
      $('#cList', m).innerHTML = all.filter(c => (catKind === 'all' || kind(c) === catKind || (catKind === 'mine' && c._my)) && (c.name + ' ' + (c.desc || '')).toLowerCase().includes(q)).map(c => {
        const p = c.hrs != null ? `${hmm(c.hrs)}h · ${money(c.hrs * S.settings.rate)}` : c.cost != null ? money(usd(c.cost) * (1 + num(S.settings.markup) / 100)) : money(c.price);
        return `<button class="cat" data-n="${esc(c.name)}"><div>${esc(c.name)}${c.desc ? `<small>${esc(c.desc)}</small>` : ''}</div><span>${p}</span></button>`;
      }).join('') || '<p class="hint">No matches.</p>';
    };
    $('#cQ', m).oninput = draw;
    $('#cKinds', m).onclick = e => { if (e.target.dataset.k) { catKind = e.target.dataset.k; draw(); } };
    $('#cList', m).onclick = e => { const b = e.target.closest('.cat'); if (!b) return; const p = [...CATALOG, ...custom].find(c => c.name === b.dataset.n); if (p) { addItem(p); } };
    draw();
  });
};

/* ---------- add: hero video ---------- */
const MODELS = [
  { n: 'Kling 3.0 — fast & cheap (~6 credits/clip)', c: 6 }, { n: 'Kling 2.x Pro (~12 credits)', c: 12 }, { n: 'Veo 3.1 — premium (~50 credits)', c: 50 },
  { n: 'Sora 2 — premium (~40 credits)', c: 40 }, { n: 'Seedance (~10 credits)', c: 10 }, { n: 'Other / custom', c: 20 },
];
const HV = { plan: ['Storyboard & prompt engineering', 2], edit: ['Video editing, colour & seamless loop', 2], frames: ['Frame-sequence export & compression', 1.5], dev: ['Scroll-scrub effect development (GSAP/canvas)', 6], mob: ['Mobile fallback & performance tuning', 2] };
function heroCalc(o) {
  const c = MODELS[o.model].c, mk = 1 + num(S.settings.markup) / 100;
  const cr = c * o.clips * o.tries + o.imgs * o.tries * 2, gen = cr * o.cp, hours = o.parts.reduce((a, k) => a + HV[k][1], 0);
  return { cr, gen, genPrice: gen * mk, hours, labour: hours * num(S.settings.rate) };
}
function heroAdd(o) {
  const r = heroCalc(o), name = MODELS[o.model].n.split(' —')[0].split(' (')[0];
  S.items.push({ id: uid(), cat: 'AI Media', name: `Hero scroll-video generation (${name})`, desc: `${o.clips} hero clip(s) + ${o.imgs} start frames generated with Higgsfield AI; multiple takes iterated and the best selected.`, qty: 1, unit: 'pkg', price: +r.genPrice.toFixed(S.cur === 'BDT' ? 0 : 2), cost: +r.gen.toFixed(S.cur === 'BDT' ? 0 : 2) });
  o.parts.forEach(k => S.items.push(newItem({ cat: 'Hero Video', name: HV[k][0], hrs: HV[k][1] })));
}
$('#aHero').onclick = () => {
  modal(`<h3>🎬 Scroll hero video</h3>
    <p class="hint">The website video that plays as your client scrolls. This adds the AI generation cost <b>and</b> your work to build it.</p>
    <label>Which AI model?<select id="hM">${MODELS.map((m, i) => `<option value="${i}">${m.n}</option>`).join('')}</select></label>
    <label>How many video clips?<input id="hC" type="number" value="2" min="1"></label>
    <div class="checks">
      <label><input type="checkbox" data-p="plan" checked> Storyboard &amp; prompts <span>2h</span></label>
      <label><input type="checkbox" data-p="edit" checked> Edit, colour &amp; loop <span>2h</span></label>
      <label><input type="checkbox" data-p="frames" checked> Frame export &amp; compression <span>1.5h</span></label>
      <label><input type="checkbox" data-p="dev" checked> Build the scroll effect <span>6h</span></label>
      <label><input type="checkbox" data-p="mob" checked> Mobile &amp; speed tuning <span>2h</span></label>
    </div>
    <details class="more"><summary>Advanced — change credit maths</summary>
      <div class="grid2">
        <label>Tries per usable clip<input id="hT" type="number" value="4"></label>
        <label>Start-frame images<input id="hI" type="number" value="4"></label>
        <label>Price per credit<input id="hP" type="number" step="0.001" value="${+usd(0.039).toFixed(4)}"></label>
      </div><p class="hint small">Higgsfield Plus ≈ $39 for 1,000 credits. Most clips take several tries.</p>
    </details>
    <div class="sum" id="hOut"></div>
    <button class="btn primary" id="hAdd">Add to quote</button>`, m => {
    const read = () => ({ model: +$('#hM', m).value, clips: num($('#hC', m).value), tries: num($('#hT', m).value), imgs: num($('#hI', m).value), cp: num($('#hP', m).value), parts: $$('[data-p]:checked', m).map(x => x.dataset.p) });
    const draw = () => { const r = heroCalc(read()); $('#hOut', m).innerHTML = `You'll spend ~<b>${r.cr} credits (${money(r.gen)})</b> on Higgsfield<br>Client pays: AI <b>${money(r.genPrice)}</b> + ${hmm(r.hours)}h work <b>${money(r.labour)}</b><br>Hero video total: <b class="big">${money(r.genPrice + r.labour)}</b>`; };
    m.addEventListener('input', draw); m.addEventListener('change', draw); draw();
    $('#hAdd', m).onclick = () => { heroAdd(read()); renderItems(); refresh(); toast('Hero video added ✓'); dlg.close(); };
  });
};
function renderCatalog() { }

/* ---------- document render ---------- */
function renderDoc() {
  const inv = S.type === 'invoice', t = totals();
  const a = S.settings.accent || '#c6ff3d';
  const groups = {}; S.items.forEach(i => (groups[i.cat] ??= []).push(i));
  const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
  const validUntil = (() => { const d = new Date(S.date); d.setDate(d.getDate() + num(S.validDays)); return d.toISOString().slice(0, 10); })();
  const fmtD = d => d ? new Date(d + 'T00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  const logoHtml = `<img src="${logo || MARK_IMG}" alt="Break the Default logo">`;
  const rows = Object.entries(groups).map(([cat, its]) => {
    const sub = its.reduce((x, i) => x + num(i.qty) * num(i.price), 0);
    return `<tr class="grp"><td colspan="3">${esc(cat)}</td><td colspan="1"></td><td class="n">${money(sub)}</td></tr>` +
      its.map(i => `<tr><td><div class="nm">${esc(i.name) || '—'}</div>${i.desc ? `<div class="ds">${esc(i.desc)}</div>` : ''}</td>
      <td class="n">${i.unit === 'fixed' ? 'Fixed' : hmm(num(i.qty)) + ' ' + esc(i.unit)}</td><td class="n" colspan="2">${i.unit === 'fixed' ? '—' : money(i.price) + (i.unit === 'hrs' ? '/h' : '')}</td><td class="n"><b>${money(num(i.qty) * num(i.price))}</b></td></tr>`).join('');
  }).join('');
  const ms = lines(S.milestones).map(l => l.split('|').map(x => x.trim()));
  $('#doc').style.setProperty('--a', a);
  $('#doc').innerHTML = `
  ${inv && S.status !== 'unpaid' ? `<div class="stamp ${S.status}">${S.status === 'paid' ? 'PAID' : 'PARTIAL'}</div>` : ''}
  <div class="d-head">
    <div class="d-top">
      <div class="d-logo">${logoHtml}<div class="d-brand">${esc(S.from.name)}<small>${esc(S.from.tag)}</small></div></div>
      <div class="d-type"><h1>${inv ? 'Invoice' : 'Quote'}<span>.</span></h1><p>${esc(S.number)}</p></div>
    </div>
    <div class="d-title"><small>${inv ? 'Billed for' : 'Proposal for'}</small><h2>${esc(S.project.title) || 'Untitled project'}</h2></div>
  </div>
  <div class="d-body">
    <div class="d-meta">
      <div><h6>${inv ? 'Bill to' : 'Prepared for'}</h6><p><b>${esc(S.client.name) || 'Client name'}</b>${S.client.company ? '\n' + esc(S.client.company) : ''}${S.client.email ? '\n' + esc(S.client.email) : ''}${S.client.phone ? '\n' + esc(S.client.phone) : ''}${S.client.address ? '\n' + esc(S.client.address) : ''}</p></div>
      <div><h6>Issued</h6><p>${fmtD(S.date)}</p><br><h6>${inv ? 'Due' : 'Valid until'}</h6><p>${fmtD(inv ? S.dueDate : validUntil)}</p></div>
      <div><h6>From</h6><p>${esc(S.from.name)}${S.from.email ? '\n' + esc(S.from.email) : ''}${S.from.web ? '\n' + esc(S.from.web) : ''}</p>${S.project.timeline ? `<br><h6>Timeline</h6><p>${esc(S.project.timeline)}</p>` : ''}</div>
    </div>
    ${S.project.summary ? `<div class="d-sum">${esc(S.project.summary)}${S.project.pages ? '\n\n<b>Scope:</b> ' + esc(S.project.pages) : ''}</div>` : ''}
    <h3 class="d-sec">Breakdown</h3>
    <table class="d-t"><thead><tr><th>Item</th><th class="n">Qty</th><th class="n" colspan="2">Rate</th><th class="n">Amount</th></tr></thead><tbody>${rows || '<tr><td colspan="5" style="color:#999">Add line items to begin.</td></tr>'}</tbody></table>
    <div class="d-tot"><table>
      <tr><td>Subtotal</td><td>${money(t.sub)}</td></tr>
      ${t.disc > 0 ? `<tr><td>Discount${S.discount.type === 'pct' ? ` (${S.discount.value}%)` : ''}</td><td>−${money(t.disc)}</td></tr>` : ''}
      ${num(S.taxRate) > 0 ? `<tr><td>Tax (${S.taxRate}%)</td><td>${money(t.tax)}</td></tr>` : ''}
      <tr class="grand"><td>Total</td><td>${money(t.total)}</td></tr>
      ${inv && num(S.paid) > 0 ? `<tr class="g"><td>Paid</td><td>−${money(S.paid)}</td></tr><tr class="dep"><td>Balance due</td><td>${money(t.balance)}</td></tr>` : ''}
      ${!inv && num(S.depositPct) > 0 ? `<tr class="g dep"><td>Deposit to start (${S.depositPct}%)</td><td>${money(t.deposit)}</td></tr>` : ''}
    </table></div>
    ${ms.length && !inv ? `<h3 class="d-sec">Timeline</h3><div class="d-ms">${ms.map(m => `<div><b>${esc(m[0])}</b><span>${esc(m[1] || '')}</span></div>`).join('')}</div>` : ''}
    ${!inv && (S.included || S.excluded) ? `<div class="d-cols"><div class="in"><h3 class="d-sec">Included</h3><ul>${lines(S.included).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="out"><h3 class="d-sec">Not included</h3><ul>${lines(S.excluded).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>` : ''}
    ${S.payment ? `<h3 class="d-sec">Payment</h3><div class="d-pay">${esc(S.payment)}</div>` : ''}
    ${S.terms ? `<h3 class="d-sec">Terms</h3><div class="d-terms">${esc(S.terms)}</div>` : ''}
    ${S.notes ? `<div class="d-note">“${esc(S.notes)}”</div>` : ''}
    ${!inv ? `<div class="d-sign"><div>Client signature & date</div><div>${esc(S.from.name)}</div></div>` : ''}
    <div class="d-foot"><span>${esc(S.from.name)}${S.from.web ? ' · ' + esc(S.from.web) : ''}</span><span>${esc(S.number)}</span></div>
  </div>`;
}

function renderStats() {
  const t = totals();
  $('#stats').innerHTML = `<div><small>Total</small><b>${money(t.total)}</b></div><div class="pv" title="Private — never shown on the PDF"><small>🔒 My profit</small><b>${money(t.profit)}</b></div>`;
}
function refresh() { renderDoc(); renderStats(); persist(); }

/* ---------- bindings ---------- */
function syncFields() {
  $$('[data-k]').forEach(el => { if (el.type !== 'file') el.value = get(S, el.dataset.k) ?? ''; });
  const inv = S.type === 'invoice';
  $$('#typeSeg button').forEach(b => b.classList.toggle('on', b.dataset.type === S.type));
  $('#lblValid').style.display = inv ? 'none' : ''; $('#lblDue').style.display = inv ? '' : 'none';
  $('#lblStatus').style.display = inv ? '' : 'none'; $('#lblPaid').style.display = inv ? '' : 'none';
  $('#miniMark').innerHTML = `<img src="${MARK_IMG}" alt="" style="width:100%;height:100%">`;
  $$('#curSeg button').forEach(b => b.classList.toggle('on', b.dataset.cur === S.cur));
  $('#fxRow').style.display = S.cur === 'BDT' ? '' : 'none';
  document.body.classList.toggle('bdt', S.cur === 'BDT');
}
function setCurrency(code) {
  if (code === S.cur) return;
  const r = code === 'BDT' ? num(S.fx) : 1 / num(S.fx), d = code === 'BDT' ? 0 : 2, cv = v => +(num(v) * r).toFixed(d);
  S.items.forEach(i => { i.price = cv(i.price); i.cost = cv(i.cost); });
  S.settings.rate = cv(S.settings.rate); S.paid = cv(S.paid);
  if (S.discount.type === 'flat') S.discount.value = cv(S.discount.value);
  S.cur = code; S.currency = code === 'BDT' ? 'Tk' : '$';
  syncFields(); renderItems(); refresh(); toast(code === 'BDT' ? 'Now in Tk (৳ rate applied)' : 'Now in USD');
}
$('#curSeg').onclick = e => { if (e.target.dataset.cur) setCurrency(e.target.dataset.cur); };
document.addEventListener('input', e => {
  const k = e.target.dataset?.k; if (!k) return;
  set(S, k, e.target.value);
  if (k.startsWith('settings.')) renderCatalog();
  refresh();
});
$('#typeSeg').onclick = e => {
  const ty = e.target.dataset.type; if (!ty || ty === S.type) return;
  S.type = ty; S.number = nextNumber(ty, S.id);
  syncFields(); refresh();
};
$('#logoFile').onchange = e => {
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { logo = r.result; try { localStorage.setItem('btd-logo', logo); } catch { } refresh(); }; r.readAsDataURL(f);
};
$('#logoReset').onclick = () => { logo = ''; localStorage.removeItem('btd-logo'); refresh(); };

/* ---------- save / open / new / pdf ---------- */
const docs = () => load('btd-docs') || {};
$('#btnSave').onclick = () => { const d = docs(); d[S.id] = S; localStorage.setItem('btd-docs', JSON.stringify(d)); flash('Saved ✓'); };
// next free number for a type: BTD-I-0001, 0002… counted separately for quotes and invoices
function nextNumber(type, skipId) {
  const tag = type === 'invoice' ? 'I' : 'Q', d = docs(); let max = 0;
  Object.values(d).forEach(x => { if (x.id === skipId) return; const m = String(x.number).match(new RegExp('^BTD-' + tag + '-([0-9]+)$')); if (m) max = Math.max(max, +m[1]); });
  return `BTD-${tag}-${String(max + 1).padStart(4, '0')}`;
}
$('#btnNew').onclick = () => {
  if (S.client.name || S.items.length) { const d = docs(); d[S.id] = S; localStorage.setItem('btd-docs', JSON.stringify(d)); }  // auto-save current one first
  const n = DEFAULT(); n.type = S.type; n.cur = S.cur; n.fx = S.fx; n.settings = S.settings; n.from = S.from; n.payment = S.payment; n.terms = S.terms;
  n.number = nextNumber(n.type); S = n; start(); toast('New ' + n.type + ' ' + n.number);
};
$('#btnLoad').onclick = () => {
  const d = docs(), ids = Object.keys(d);
  $('#dlgBody').innerHTML = `<h3 style="font-family:'Space Grotesk'">Saved documents</h3>` + (ids.map(id => `<div class="saved"><span><b>${esc(d[id].number)}</b> · ${esc(d[id].client.name || 'No client')} · ${esc(d[id].project.title || '')}</span><span><button class="btn" data-o="${id}">Open</button><button class="btn" data-x="${id}">✕</button></span></div>`).join('') || '<p class="hint">Nothing saved yet.</p>') +
    `<div class="row"><button class="btn" id="exp">Export JSON</button><label class="btn" style="margin:0">Import JSON<input type="file" id="imp" hidden></label></div>`;
  dlg.showModal();
};
$('#dlgBody').addEventListener('click', e => {
  const d = docs();
  if (e.target.dataset.o) { S = d[e.target.dataset.o]; dlg.close(); start(); }
  if (e.target.dataset.x) { delete d[e.target.dataset.x]; localStorage.setItem('btd-docs', JSON.stringify(d)); $('#btnLoad').click(); }
  if (e.target.id === 'exp') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)])); a.download = S.number + '.json'; a.click(); }
});
$('#dlgBody').addEventListener('change', e => {
  if (e.target.id !== 'imp') return; const r = new FileReader();
  r.onload = () => { try { S = { ...DEFAULT(), ...JSON.parse(r.result) }; dlg.close(); start(); } catch { alert('Not a valid file'); } }; r.readAsText(e.target.files[0]);
});
$('#btnPdf').onclick = () => {
  const old = document.title; document.title = `${S.number} ${S.client.company || S.client.name || ''}`.trim();
  window.print(); setTimeout(() => document.title = old, 500);
};
function flash(msg) { const b = $('#btnSave'), o = b.textContent; b.textContent = msg; setTimeout(() => b.textContent = o, 1200); }

let step = 1;
function goStep(n) {
  step = Math.max(1, Math.min(3, n));
  $$('.step').forEach(x => x.style.display = +x.dataset.step === step ? '' : 'none');
  $$('#stepper button').forEach(b => { b.classList.toggle('on', +b.dataset.s === step); b.classList.toggle('done', +b.dataset.s < step); });
  $('#back').style.visibility = step === 1 ? 'hidden' : ''; $('#next').style.display = step === 3 ? 'none' : '';
  $('.body').scrollTop = 0;
}
$('#stepper').onclick = e => { const b = e.target.closest('button'); if (b) goStep(+b.dataset.s); };
$('#back').onclick = () => goStep(step - 1); $('#next').onclick = () => goStep(step + 1);
function start() { syncFields(); renderItems(); refresh(); goStep(1); }
start();
