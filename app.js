(() => {
'use strict';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clone = v => JSON.parse(JSON.stringify(v));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- icons ---------- */
const IC = {
  down: '<path d="M6 9l6 6 6-6"/>', left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', plus: '<path d="M12 5v14M5 12h14"/>', swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>', more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8.5 20h7M10 17h4"/>',
  trend: '<path d="M4 17l5-5 3.5 3.5L20 8"/><path d="M15 8h5v5"/>', flame: '<path d="M12 21c-3.9 0-7-2.7-7-6.5 0-3.3 2.4-5.4 4-7.5.3 2 1.3 3.2 2.5 3.8C11 7.6 12.5 4.8 15 3c-.2 3 3.9 5.7 3.9 10.8 0 4-3 7.2-6.9 7.2z"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>', scale: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9.5a4 4 0 0 1 6 0l-2 2.2"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', note: '<path d="M5 4h10l4 4v12H5z"/><path d="M14 4v5h5M8 13h8M8 17h5"/>', up: '<path d="M12 19V5M6 11l6-6 6 6"/>', dn: '<path d="M12 5v14M6 13l6 6 6-6"/>', trash: '<path d="M5 7h14M10 11v6M14 11v6M7 7l1 12h8l1-12M9.5 7V4.5h5V7"/>'
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;

/* ---------- exercises & muscles ---------- */
const PARTS = { chest: '胸', back: '背', shoulder: '肩', legs: '腿', arms: '手臂', core: '核心' };
const ALLPARTS = { ...PARTS, full: '全身', free: '自由' };
const MAIN = ['chest', 'back', 'shoulder', 'legs'];
const pcol = p => `var(--p-${p === 'free' ? 'full' : p})`;
const EQUIP = { bb: '槓鈴', db: '啞鈴', mc: '器械', cb: '滑輪', bw: '自體重' };
const STEP = { bb: 2.5, db: 2, mc: 5, cb: 2.5, bw: 2.5 };
const BUILTIN = [
  ['bench', '槓鈴臥推', 'chest', 'bb', 'chest|front_deltoids,triceps'], ['incline_bench', '上斜槓鈴臥推', 'chest', 'bb', 'chest,front_deltoids|triceps'], ['decline_bench', '下斜槓鈴臥推', 'chest', 'bb', 'chest|triceps'],
  ['db_bench', '啞鈴臥推', 'chest', 'db', 'chest|front_deltoids,triceps'], ['incline_db', '上斜啞鈴臥推', 'chest', 'db', 'chest,front_deltoids|triceps'], ['db_fly', '啞鈴飛鳥', 'chest', 'db', 'chest|front_deltoids'],
  ['machine_press', '器械推胸', 'chest', 'mc', 'chest|front_deltoids,triceps'], ['incline_machine', '上斜器械推胸', 'chest', 'mc', 'chest,front_deltoids|triceps'], ['smith_incline', '史密斯上斜臥推', 'chest', 'mc', 'chest,front_deltoids|triceps'], ['pec_deck', '蝴蝶機夾胸', 'chest', 'mc', 'chest|front_deltoids'],
  ['cable_fly', '滑輪夾胸', 'chest', 'cb', 'chest|front_deltoids'], ['dips', '雙槓撐體', 'chest', 'bw', 'chest,triceps|front_deltoids'], ['pushup', '伏地挺身', 'chest', 'bw', 'chest|front_deltoids,triceps,abs'],
  ['pullup', '引體向上', 'back', 'bw', 'upper_back|biceps,back_deltoids,forearm'], ['lat_pulldown', '滑輪下拉', 'back', 'cb', 'upper_back|biceps,back_deltoids'], ['close_pulldown', '窄握下拉', 'back', 'cb', 'upper_back|biceps'], ['seated_row', '坐姿划船', 'back', 'cb', 'upper_back,trapezius|biceps,back_deltoids'], ['straight_pulldown', '直臂下拉', 'back', 'cb', 'upper_back|triceps'],
  ['barbell_row', '槓鈴划船', 'back', 'bb', 'upper_back,trapezius|biceps,back_deltoids,lower_back'], ['tbar_row', 'T 槓划船', 'back', 'bb', 'upper_back,trapezius|biceps,back_deltoids'], ['deadlift', '硬舉', 'back', 'bb', 'lower_back,hamstring,gluteal|trapezius,upper_back,quadriceps,forearm'],
  ['db_row', '單臂啞鈴划船', 'back', 'db', 'upper_back|biceps,back_deltoids'], ['machine_row', '器械划船', 'back', 'mc', 'upper_back,trapezius|biceps,back_deltoids'], ['machine_pulldown', '器械下拉', 'back', 'mc', 'upper_back|biceps'], ['back_ext', '背部伸展', 'back', 'bw', 'lower_back|gluteal,hamstring'],
  ['ohp', '站姿槓鈴肩推', 'shoulder', 'bb', 'front_deltoids|triceps,trapezius,chest'], ['db_ohp', '坐姿啞鈴肩推', 'shoulder', 'db', 'front_deltoids|triceps,trapezius'], ['lateral', '啞鈴側平舉', 'shoulder', 'db', 'front_deltoids,back_deltoids|trapezius'], ['db_rear', '啞鈴俯身飛鳥', 'shoulder', 'db', 'back_deltoids|upper_back,trapezius'], ['shrug', '啞鈴聳肩', 'shoulder', 'db', 'trapezius|forearm'],
  ['machine_ohp', '器械肩推', 'shoulder', 'mc', 'front_deltoids|triceps'], ['smith_ohp', '史密斯肩推', 'shoulder', 'mc', 'front_deltoids|triceps'], ['machine_lateral', '器械側平舉', 'shoulder', 'mc', 'front_deltoids,back_deltoids|trapezius'], ['rear_delt', '反向蝴蝶機', 'shoulder', 'mc', 'back_deltoids|upper_back'],
  ['cable_lateral', '滑輪側平舉', 'shoulder', 'cb', 'front_deltoids,back_deltoids|trapezius'], ['face_pull', '臉拉', 'shoulder', 'cb', 'back_deltoids|trapezius,upper_back'],
  ['squat', '槓鈴深蹲', 'legs', 'bb', 'quadriceps,gluteal|hamstring,adductor,lower_back,calves'], ['front_squat', '前蹲舉', 'legs', 'bb', 'quadriceps|gluteal,abs'], ['rdl', '羅馬尼亞硬舉', 'legs', 'bb', 'hamstring,gluteal|lower_back'], ['hip_thrust', '槓鈴臀推', 'legs', 'bb', 'gluteal|hamstring'],
  ['goblet', '高腳杯深蹲', 'legs', 'db', 'quadriceps,gluteal|adductor'], ['bss', '保加利亞分腿蹲', 'legs', 'db', 'quadriceps,gluteal|hamstring,adductor'], ['lunge', '啞鈴弓箭步', 'legs', 'db', 'quadriceps,gluteal|hamstring'],
  ['leg_press', '腿推機', 'legs', 'mc', 'quadriceps|gluteal,hamstring'], ['hack_squat', '哈克深蹲', 'legs', 'mc', 'quadriceps|gluteal'], ['smith_squat', '史密斯深蹲', 'legs', 'mc', 'quadriceps,gluteal|hamstring'], ['leg_ext', '腿伸屈', 'legs', 'mc', 'quadriceps'], ['leg_curl', '腿後勾', 'legs', 'mc', 'hamstring|calves'], ['calf', '提踵', 'legs', 'mc', 'calves'], ['adductor', '內收機', 'legs', 'mc', 'adductor'],
  ['cgbp', '窄握臥推（三頭）', 'arms', 'bb', 'triceps|chest,front_deltoids'], ['skull', '仰臥臂屈伸（三頭）', 'arms', 'bb', 'triceps'], ['bb_curl', '槓鈴彎舉（二頭）', 'arms', 'bb', 'biceps|forearm'],
  ['db_curl', '啞鈴彎舉（二頭）', 'arms', 'db', 'biceps|forearm'], ['hammer', '錘式彎舉（二頭）', 'arms', 'db', 'biceps,forearm'], ['db_oh_ext', '啞鈴過頭伸展（三頭）', 'arms', 'db', 'triceps'],
  ['pushdown', '滑輪下壓（三頭）', 'arms', 'cb', 'triceps'], ['cable_oh_ext', '滑輪過頭伸展（三頭）', 'arms', 'cb', 'triceps'], ['cable_curl', '滑輪彎舉（二頭）', 'arms', 'cb', 'biceps|forearm'],
  ['preacher', '牧師椅彎舉（二頭）', 'arms', 'mc', 'biceps'], ['dip_machine', '器械撐體（三頭）', 'arms', 'mc', 'triceps|chest'],
  ['cable_crunch', '滑輪捲腹', 'core', 'cb', 'abs|obliques'], ['leg_raise', '懸垂舉腿', 'core', 'bw', 'abs|obliques'], ['ab_wheel', '健腹輪', 'core', 'bw', 'abs|obliques,lower_back'], ['plank', '平板支撐', 'core', 'bw', 'abs|obliques', 'sec']
].map(([id, n, p, e, m, unit]) => ({ id, n, p, e, m, unit }));
const GROUP_MUSCLES = { chest: ['chest'], back: ['upper_back', 'trapezius', 'lower_back'], shoulder: ['front_deltoids', 'back_deltoids'], legs: ['quadriceps', 'hamstring', 'gluteal', 'calves', 'adductor', 'abductors'], arms: ['biceps', 'triceps', 'forearm'], core: ['abs', 'obliques'] };
const MUSCLE_NAME = { chest: '胸大肌', front_deltoids: '前三角肌', back_deltoids: '後三角肌', upper_back: '背闊肌', trapezius: '斜方肌', lower_back: '豎脊肌', biceps: '肱二頭肌', triceps: '肱三頭肌', forearm: '前臂', quadriceps: '股四頭肌', hamstring: '膕繩肌', gluteal: '臀大肌', calves: '小腿', adductor: '內收肌', abductors: '外展肌', abs: '腹直肌', obliques: '腹斜肌' };
const ALL_MUSCLES = Object.values({ chest: ['chest'], back: ['upper_back', 'trapezius', 'lower_back'], shoulder: ['front_deltoids', 'back_deltoids'], legs: ['quadriceps', 'hamstring', 'gluteal', 'calves', 'adductor', 'abductors'], arms: ['biceps', 'triceps', 'forearm'], core: ['abs', 'obliques'] }).flat();
const KEY_MUSCLES = { chest: ['chest'], back: ['upper_back', 'trapezius'], shoulder: ['front_deltoids', 'back_deltoids'], legs: ['quadriceps', 'hamstring', 'gluteal'], arms: ['biceps', 'triceps'], core: ['abs', 'obliques'] };
const LATERAL = new Set(['lateral', 'machine_lateral', 'cable_lateral']);
function muscleNames(exId) { // text list: primary first, deltoid heads spelled out where the figure can't
  const { p, s } = musclesOf(exId);
  const P = LATERAL.has(exId) ? ['中三角肌'] : p.map(m => MUSCLE_NAME[m] || m);
  return { p: P, s: s.map(m => MUSCLE_NAME[m] || m).filter(n => !P.includes(n)) };
}
const musList = (exId, cls = 'mus') => { const { p, s } = muscleNames(exId); return `<ul class="${cls}">${p.map(n => `<li class="p">${n}</li>`).join('')}${s.map(n => `<li>${n}</li>`).join('')}</ul>`; };
const BACKSIDE = new Set(['upper_back', 'trapezius', 'lower_back', 'back_deltoids', 'hamstring', 'gluteal']);
const LOWER = new Set(['quadriceps', 'hamstring', 'gluteal', 'calves', 'adductor', 'abductors']);
const canon = m => (m === 'left_soleus' || m === 'right_soleus') ? 'calves' : m;
const MOODS = { good: ['😎', '很好'], ok: ['🙂', '普通'], tired: ['🫠', '很累'] };
const TAGS = ['睡眠差', '感冒', '肌肉酸痛', '壓力大', '焦慮'];
const FEELS = { easy: '輕鬆', ok: '剛好', hard: '很硬' };

/* ---------- body figures ---------- */
const VB = { anteriorData: [0, 0, 1000, 1960], posteriorData: [0, 0, 1000, 2210] };
function bodySVG(view, colorOf, vb, cls = '') {
  const d = BODY[view], box = vb || VB[view];
  let s = `<svg class="body ${cls}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`;
  for (const [m, pts] of Object.entries(d)) {
    const c = colorOf(canon(m), m);
    for (const p of pts) s += `<polygon points="${p}" style="fill:${c}"/>`;
  }
  return s + '</svg>';
}
function musclesOf(exId) {
  const ex = exOf(exId);
  if (ex.m) { const [p, s = ''] = ex.m.split('|'); return { p: p.split(','), s: s ? s.split(',') : [] }; }
  const g = GROUP_MUSCLES[ex.p] || ['abs'];
  return { p: g.slice(0, ex.p === 'back' ? 1 : g.length > 3 ? 2 : g.length), s: [] };
}
const BASE = m => m === 'head' || m === 'neck' || m === 'knees' ? 'var(--m-dim)' : 'var(--m-off)';
function figThumb(prim, sec, cls = 'thumb') {
  const back = prim.filter(m => BACKSIDE.has(m)).length > prim.length / 2;
  const lower = prim.every(m => LOWER.has(m));
  const view = back ? 'posteriorData' : 'anteriorData';
  const vb = lower ? (back ? [0, 1150, 1000, 1050] : [0, 960, 1000, 1000]) : [0, 130, 1000, 1000];
  const P = new Set(prim), Sx = new Set(sec);
  return `<span class="${cls}">${bodySVG(view, m => P.has(m) ? 'var(--accent)' : Sx.has(m) ? 'var(--accent-2)' : BASE(m), vb)}</span>`;
}
const exThumb = (exId, cls) => { const { p, s } = musclesOf(exId); return figThumb(p, s, cls); };
const groupThumb = (g, cls) => figThumb(GROUP_MUSCLES[g] || ['abs'], [], cls);
function twoFigs(colorOf, cls = 'figs', labels = true) {
  return `<div class="${cls}"><div><div class="fig">${bodySVG('anteriorData', colorOf)}</div>${labels ? '<small>正面</small>' : ''}</div><div><div class="fig">${bodySVG('posteriorData', colorOf)}</div>${labels ? '<small>背面</small>' : ''}</div></div>`;
}

function pairFig(prim, sec, cls = 'figbox') { // front + back side by side, like an anatomy card
  const P = new Set(prim), Sx = new Set(sec);
  const c = m => P.has(m) ? 'var(--accent)' : Sx.has(m) ? 'var(--accent-2)' : BASE(m);
  return `<span class="${cls}">${bodySVG('anteriorData', c)}${bodySVG('posteriorData', c)}</span>`;
}
const exPair = (exId, cls) => { const { p, s } = musclesOf(exId); return pairFig(p, s, cls); };
function groupPair(g, cls) {
  const ms = new Set(GROUP_MUSCLES[g] || []), col = recColor(groupRec(g));
  return `<span class="${cls || 'figbox'}">${['anteriorData', 'posteriorData'].map(v => bodySVG(v, m => ms.has(m) ? col : BASE(m))).join('')}</span>`;
}

/* ---------- dates ---------- */
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date());
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const dnum = s => { const [y, m, d] = s.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
const weekStart = s => { const d = parse(s); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return ymd(d); };
const prevMonth = s => { const d = parse(s); d.setDate(1); d.setMonth(d.getMonth() - 1); return ymd(d).slice(0, 7); };
const md = s => `${+s.slice(5, 7)}/${+s.slice(8, 10)}`;
const DOW = ['日', '一', '二', '三', '四', '五', '六'];
const dow = s => DOW[parse(s).getDay()];
const daysSince = s => dnum(today()) - dnum(s);
const ago = s => { const n = daysSince(s); return n <= 0 ? '今天' : n === 1 ? '昨天' : `${n} 天前`; };

/* ---------- storage: this device first, synced to the account when available ---------- */
const LS_KEY = 'gymlog-v1';
const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const blankProfile = () => ({ customEx: [], notes: {}, templates: [], lastTpl: {} });
const store = { profile: blankProfile(), workouts: {}, bw: { entries: {} }, mode: 'local' };
{
  const c = lsGet(LS_KEY);
  if (c && typeof c === 'object') {
    store.profile = { ...blankProfile(), ...(c.profile || {}) };
    store.workouts = c.workouts || {};
    store.bw = { entries: {}, ...(c.bw || {}) };
  }
}
const memo = new Map();
const bump = () => memo.clear();
const cache = () => lsSet(LS_KEY, { profile: store.profile, workouts: store.workouts, bw: store.bw });

let col = null, unsub = null;
const queues = {}, timers = {};
function cloudOp(id, op) {
  queues[id] = (queues[id] || Promise.resolve()).then(op).catch(e => {
    const code = e && e.code;
    if (code === 'unavailable') return new Promise(r => setTimeout(r, 700 + Math.random() * 900)).then(op).catch(() => toast('暫時無法同步，紀錄先存在這台裝置'));
    if (code === 'quota_exceeded') return toast('雲端空間已滿，紀錄先存在這台裝置');
    goLocal();
    toast('無法同步到雲端，紀錄先存在這台裝置');
  });
}
function save(id, get, delay = 0) {
  bump(); cache();
  if (!col) return;
  clearTimeout(timers[id]);
  const run = () => { const body = get(); if (body) cloudOp(id, () => col.doc(id).set(clone(body))); };
  if (delay) timers[id] = setTimeout(run, delay); else run();
}
function removeDoc(id) { clearTimeout(timers[id]); bump(); cache(); if (col) cloudOp(id, () => col.doc(id).delete()); }
const saveWorkout = (w, delay = 0) => { w.updatedAt = Date.now(); store.workouts[w.id] = w; save('w-' + w.id, () => store.workouts[w.id], delay); };
const saveProfile = () => save('profile', () => store.profile);
const saveBw = () => save('bw', () => store.bw);
function goLocal() { try { unsub && unsub(); } catch {} unsub = null; col = null; store.mode = 'local'; render(); }

async function initCloud() {
  if (!window.claude || typeof claude.use !== 'function') return;
  let db, user;
  try { [db, user] = await Promise.all([claude.use('db'), claude.use('user')]); } catch { return; }
  if (!db || !user) return;
  const uid = await user.id();
  if (!uid) return;
  try { col = db.collection('data/users/' + uid); } catch { col = null; return; }
  let merged = false;
  unsub = col.onSnapshot(snap => {
    if (!merged && snap.metadata.fromCache) return;
    const cw = {}; let cp = null, cbw = null;
    snap.docs.forEach(doc => {
      const v = doc.data(); if (!v) return;
      if (doc.id === 'profile') cp = clone(v);
      else if (doc.id === 'bw') cbw = clone(v);
      else if (doc.id.startsWith('w-')) cw[doc.id.slice(2)] = clone(v);
    });
    store.mode = 'cloud';
    if (!merged) {
      merged = true;
      const lw = store.workouts;
      store.workouts = { ...cw };
      for (const id of Object.keys(lw)) {
        if (!cw[id] || (lw[id].updatedAt || 0) > (cw[id].updatedAt || 0)) { store.workouts[id] = lw[id]; save('w-' + id, () => store.workouts[id]); }
      }
      const lp = store.profile, base = { ...blankProfile(), ...(cp || {}) };
      const union = (a, b) => { const out = [...a]; for (const x of b) if (!out.some(y => y.id === x.id)) out.push(x); return out; };
      const np = { ...base, customEx: union(base.customEx, lp.customEx || []), templates: union(base.templates, lp.templates || []), notes: { ...(lp.notes || {}), ...base.notes }, lastTpl: { ...(lp.lastTpl || {}), ...base.lastTpl } };
      store.profile = np;
      if (JSON.stringify(np) !== JSON.stringify(base)) saveProfile();
      const entries = { ...(store.bw.entries || {}), ...(cbw?.entries || {}) };
      store.bw = { entries };
      if (Object.keys(entries).length !== Object.keys(cbw?.entries || {}).length) saveBw();
    } else {
      const open = cur && store.workouts[cur.id] === cur ? cur : null;
      store.workouts = cw;
      if (open) store.workouts[open.id] = open; // never replace the workout being edited
      if (cp) store.profile = { ...blankProfile(), ...cp };
      if (cbw) store.bw = { entries: {}, ...cbw };
    }
    bump(); cache(); render();
  }, () => goLocal());
}

/* ---------- derived data ---------- */
const allEx = () => [...BUILTIN, ...(store.profile.customEx || [])];
const exOf = id => allEx().find(e => e.id === id) || { id, n: '（已刪除的動作）', p: 'core', e: 'bw' };
const mm = (k, f) => { if (!memo.has(k)) memo.set(k, f()); return memo.get(k); };
const doneWorkouts = () => mm('done', () => Object.values(store.workouts).filter(w => w.status === 'done').sort((a, b) => a.date === b.date ? (a.startedAt || 0) - (b.startedAt || 0) : (a.date < b.date ? -1 : 1)));
const realWorkouts = () => mm('real', () => doneWorkouts().filter(w => !w.seed));
const activeWorkout = () => Object.values(store.workouts).find(w => w.status === 'active') || null;
const fw = w => w == null || w === '' ? '' : String(Math.round(w * 100) / 100);
const isWeighted = (s, ex) => ex.unit !== 'sec' && s.w > 0;
const setTxt = (s, ex) => ex.unit === 'sec' ? `${s.r} 秒` : (s.w > 0 ? `${fw(s.w)}×${s.r}` : `自體重×${s.r}`);
const e1 = (s, ex) => isWeighted(s, ex) ? s.w * (1 + (s.r || 0) / 30) : (s.r || 0);
const volOf = sets => sets.reduce((a, s) => a + (s.w > 0 ? s.w * s.r : 0), 0);
const partName = p => ({ free: '自由訓練', full: '全身', core: '核心' }[p] || `${ALLPARTS[p]}日`);
function bodyweight() { const es = Object.entries(store.bw.entries || {}).sort((a, b) => a[0] < b[0] ? -1 : 1); return es.length ? +es[es.length - 1][1] : 75; }

function sessionsOf(exId) {
  return mm('s:' + exId, () => {
    const ex = exOf(exId), out = [];
    for (const w of doneWorkouts()) for (const e of w.ex) {
      if (e.id !== exId || !e.sets.length) continue;
      const topW = Math.max(...e.sets.map(s => s.w || 0));
      const topR = Math.max(...e.sets.filter(s => (s.w || 0) === topW).map(s => s.r));
      out.push({ wid: w.id, date: w.date, t: w.startedAt || 0, seed: !!w.seed, sets: e.sets, topW, topR,
        best: Math.max(...e.sets.map(s => e1(s, ex))), vol: volOf(e.sets) });
    }
    return out;
  });
}
const before = (s, w) => s.wid !== w.id && (s.date < w.date || (s.date === w.date && s.t < (w.startedAt || 0)));
const prevSessions = (exId, w) => sessionsOf(exId).filter(s => before(s, w));
const lastSession = (exId, w) => { const p = w ? prevSessions(exId, w) : sessionsOf(exId); return p[p.length - 1] || null; };

/* PR of one set against everything done before it (earlier sessions + earlier sets today) */
function setPR(s, ex, prevSets) {
  if (!prevSets.length || !(s.r > 0)) return null;
  if (isWeighted(s, ex)) {
    const maxW = Math.max(...prevSets.map(p => p.w || 0));
    if (s.w > maxW + 1e-9) return { type: 'weight', label: '重量 PR', text: `${fw(s.w)} kg × ${s.r}`, was: `過去最重 ${fw(maxW)} kg` };
    const atOrAbove = prevSets.filter(p => (p.w || 0) >= s.w - 1e-9);
    const bestR = atOrAbove.length ? Math.max(...atOrAbove.map(p => p.r)) : 0;
    if (s.r > bestR) { const ref = atOrAbove.find(p => p.r === bestR); return { type: 'rep', label: '次數 PR', text: `${fw(s.w)} kg × ${s.r}`, was: `過去最佳 ${fw(ref.w)} kg × ${bestR}` }; }
    const maxE = Math.max(...prevSets.map(p => e1(p, ex)));
    if (e1(s, ex) > maxE + 1e-6) return { type: 'e1', label: '1RM PR', text: `估算 ${Math.round(e1(s, ex))} kg`, was: `過去估算 ${Math.round(maxE)} kg` };
    return null;
  }
  const maxR = Math.max(...prevSets.map(p => p.r));
  if (s.r > maxR) return { type: 'rep', label: '次數 PR', text: `${s.r} ${ex.unit === 'sec' ? '秒' : '下'}`, was: `過去最佳 ${maxR}` };
  return null;
}
const RANK = { weight: 3, rep: 2, e1: 1 };
function exercisePRs(e, w) {
  const ex = exOf(e.id), prev = prevSessions(e.id, w);
  const hist = prev.flatMap(s => s.sets);
  const flags = []; let best = null; const running = [...hist];
  e.sets.forEach((s, i) => {
    if (s.done === false) { flags[i] = null; return; }
    const pr = hist.length ? setPR(s, ex, running) : null;
    flags[i] = pr;
    if (pr && (!best || RANK[pr.type] > RANK[best.type])) best = pr;
    running.push(s);
  });
  const v = volOf(e.sets.filter(s => s.done !== false)), pv = prev.length ? Math.max(...prev.map(s => s.vol)) : 0;
  const volPR = pv > 0 && v > pv ? { type: 'vol', label: '總量 PR', text: `${Math.round(v).toLocaleString()} kg`, was: `過去最高 ${Math.round(pv).toLocaleString()} kg` } : null;
  return { flags, best, volPR };
}
const asDone = e => ({ ...e, sets: e.sets.map(s => ({ ...s, done: true })) });
function compareTxt(e, last) {
  if (!last) return null;
  let dr = 0, dw = 0, n = 0;
  e.sets.forEach((s, i) => {
    if (s.done === false) return;
    const p = last.sets[i]; if (!p) return;
    n++;
    const a = s.w || 0, b = p.w || 0;
    if (a > b) dw = Math.max(dw, a - b); else if (a === b) dr += s.r - p.r;
  });
  if (!n) return null;
  if (dw > 0) return { cls: 'up', t: `重量 +${fw(dw)} kg${dr > 0 ? `，次數 +${dr}` : ''}` };
  if (dr > 0) return { cls: 'up', t: `比上次 +${dr} 下` };
  if (dr < 0) return { cls: 'down', t: `比上次 ${dr} 下` };
  return { cls: 'flat', t: '跟上次持平' };
}
/* Suggestion for the next session of one exercise: double progression, nudged by how the sets felt */
function recFor(exId, w) {
  const ss = w ? prevSessions(exId, w) : sessionsOf(exId);
  if (!ss.length) return null;
  const ex = exOf(exId), last = ss[ss.length - 1], prev = ss[ss.length - 2];
  if (ex.unit === 'sec' || !(last.topW > 0)) {
    const r = last.topR, u = ex.unit === 'sec' ? '秒' : '下';
    return { main: `今天可以嘗試 ${r + 1}–${r + 2} ${u}`, why: `上次最多 ${r} ${u}`, alt: `或維持 ${r} ${u}，完成 ${last.sets.length} 組` };
  }
  const step = STEP[ex.e] || 2.5;
  const atTop = last.sets.filter(s => (s.w || 0) === last.topW);
  const minR = Math.min(...atTop.map(s => s.r));
  const feels = atTop.map(s => s.f).filter(Boolean);
  const allEasy = feels.length > 0 && feels.every(f => f === 'easy');
  const prevTop = prev ? prev.sets.filter(s => (s.w || 0) === prev.topW) : [];
  const prevEasy = !!prev && prev.topW === last.topW && prevTop.some(s => s.f) && prevTop.every(s => !s.f || s.f === 'easy');
  const anyHard = feels.includes('hard');
  const cap = ex.e === 'bb' ? 10 : 12;
  const W = fw(last.topW), nW = fw(last.topW + step);
  if ((allEasy && prevEasy) || minR >= cap) {
    return { main: `可以試試 ${nW} kg`, why: allEasy && prevEasy ? `${W} × ${minR} 已經連續兩次「輕鬆」` : `上次 ${W} kg 每組都做到 ${minR} 下以上`, alt: `加重後先求 ${Math.max(5, minR - 3)}–${Math.max(6, minR - 1)} 下` };
  }
  if (anyHard) return { main: `維持 ${W} kg × ${minR}`, why: '上次有「很硬」的組，先把同樣重量做穩', alt: `完成 ${atTop.length} 組就算成功` };
  return { main: `今天可以嘗試 ${W} kg × ${minR + 1}–${minR + 2}`, why: `上次 ${W} kg × ${minR}${allEasy ? '，感覺輕鬆' : ''}`, alt: `或維持 ${minR} 下，完成 ${last.sets.length} 組` };
}
function lastWorkoutOf(part) { const ws = doneWorkouts().filter(w => w.part === part); return ws[ws.length - 1] || null; }
function lastRealOf(part) { const ws = realWorkouts().filter(w => w.part === part); return ws[ws.length - 1] || null; }
function recovery(part) {
  const lw = lastRealOf(part); if (!lw) return { dots: 5, txt: '完全恢復' };
  const n = daysSince(lw.date);
  return n <= 0 ? { dots: 1, txt: '今天練過' } : n === 1 ? { dots: 2, txt: '還在恢復' } : n === 2 ? { dots: 3, txt: '差不多恢復' } : n === 3 ? { dots: 4, txt: '恢復良好' } : { dots: 5, txt: '完全恢復' };
}
function suggestPart() {
  const t = today(), d = parse(t).getDay(), wk = weekStart(t);
  const legsThisWeek = realWorkouts().some(w => w.part === 'legs' && w.date >= wk);
  if ((d === 0 || d === 6) && !legsThisWeek) return 'legs';
  let best = null, bestDate = null;
  for (const p of ['chest', 'back', 'shoulder']) {
    const lw = lastWorkoutOf(p);
    if (!lw) return p;
    if (bestDate == null || lw.date < bestDate) { best = p; bestDate = lw.date; }
  }
  return best;
}
const weekCount = (wk = weekStart(today())) => realWorkouts().filter(w => weekStart(w.date) === wk).length;
const durMin = w => { const n = Math.round(((w.endedAt || 0) - (w.startedAt || 0)) / 60000); return n >= 5 && n <= 240 ? n : null; };
const wSets = w => w.ex.reduce((a, e) => a + e.sets.length, 0);
const wVol = w => w.ex.reduce((a, e) => a + volOf(e.sets), 0);
const tplName = id => (store.profile.templates || []).find(t => t.id === id)?.name;
function keyLift(part) {
  const tpl = (store.profile.templates || []).find(t => t.id === store.profile.lastTpl?.[part]);
  if (tpl && tpl.ex.length) return tpl.ex[0];
  const lw = lastWorkoutOf(part);
  return lw && lw.ex.length ? lw.ex[0].id : null;
}
function recentPRs(days = 30) {
  return mm('rpr' + days, () => {
    const from = addDays(today(), -days), out = [], seen = new Set();
    for (const w of [...realWorkouts()].reverse()) {
      if (w.date < from) break;
      for (const e of w.ex) {
        if (seen.has(e.id)) continue;
        const r = exercisePRs(asDone(e), w), p = r.best || r.volPR;
        if (p) { seen.add(e.id); out.push({ ...p, ex: e.id, date: w.date }); }
      }
    }
    return out;
  });
}
function muscleLoad(from, to) {
  return mm(`ml:${from}:${to}`, () => {
    const load = {};
    for (const w of realWorkouts()) {
      if (w.date < from || w.date >= to) continue;
      for (const e of w.ex) { const { p, s } = musclesOf(e.id), n = e.sets.length; p.forEach(m => load[m] = (load[m] || 0) + n); s.forEach(m => load[m] = (load[m] || 0) + n * .5); }
    }
    return load;
  });
}
/* Per-muscle recovery: hours since the muscle was last trained against a need of 36 h + 4 h per set (cap 96 h). */
function muscleRecovery() {
  return mm('rec', () => {
    const last = {}, out = {}, now = Date.now();
    for (const w of realWorkouts()) {
      const t = w.endedAt || w.startedAt || parse(w.date).getTime(), load = {};
      for (const e of w.ex) { const { p, s } = musclesOf(e.id), n = e.sets.length; p.forEach(m => load[m] = (load[m] || 0) + n); s.forEach(m => load[m] = (load[m] || 0) + n * .5); }
      for (const m in load) last[m] = { t, sets: load[m] };
    }
    const a = activeWorkout();
    if (a) { const load = {}; for (const e of a.ex) { const n = e.sets.filter(x => x.done).length; if (!n) continue; const { p, s } = musclesOf(e.id); p.forEach(m => load[m] = (load[m] || 0) + n); s.forEach(m => load[m] = (load[m] || 0) + n * .5); } for (const m in load) last[m] = { t: now, sets: load[m] }; }
    for (const m of ALL_MUSCLES) {
      const l = last[m];
      if (!l) { out[m] = 100; continue; }
      const need = Math.min(96, 36 + l.sets * 4), h = (now - l.t) / 36e5;
      out[m] = Math.max(0, Math.min(100, Math.round(h / need * 100)));
    }
    return out;
  });
}
const groupRec = g => { const r = muscleRecovery(), ms = KEY_MUSCLES[g] || GROUP_MUSCLES[g]; return Math.round(ms.reduce((a, m) => a + r[m], 0) / ms.length); };
const recColor = pct => pct >= 90 ? '#4DA3FF' : pct >= 65 ? '#3375C0' : pct >= 40 ? '#2A4C78' : '#B4574F';
const recWord = pct => pct >= 90 ? '已恢復' : pct >= 65 ? '大致恢復' : pct >= 40 ? '恢復中' : '剛練完';
const HEAT = ['var(--m-off)', '#1E3A5F', '#2B5E9C', '#3D86DA', '#7CC0FF'];
const heatLevel = v => !v ? 0 : v < 4 ? 1 : v < 8 ? 2 : v < 12 ? 3 : 4;

/* ---------- muscle rank (rough strength standards, relative to body weight) ---------- */
const TIERS = [{ n: '銅', c: '#C38D5E' }, { n: '銀', c: '#BCC6D4' }, { n: '金', c: '#E7C66B' }, { n: '白金', c: '#7FE0D2' }, { n: '鑽石', c: '#8EC9FF' }];
const RANKDEF = {
  chest: [['bench', 'r', [.5, .75, 1, 1.25, 1.5]], ['incline_bench', 'r', [.4, .6, .85, 1.05, 1.3]], ['db_bench', 'r', [.2, .3, .4, .5, .6]]],
  back: [['barbell_row', 'r', [.5, .65, .8, 1, 1.2]], ['lat_pulldown', 'r', [.5, .65, .8, 1, 1.2]], ['pullup', 'n', [1, 5, 10, 15, 20]], ['deadlift', 'r', [1, 1.25, 1.5, 2, 2.5]]],
  shoulder: [['ohp', 'r', [.35, .5, .65, .8, 1]], ['db_ohp', 'r', [.15, .22, .3, .37, .45]], ['lateral', 'r', [.06, .1, .14, .18, .22]]],
  legs: [['squat', 'r', [.75, 1, 1.25, 1.5, 2]], ['front_squat', 'r', [.6, .8, 1, 1.25, 1.6]], ['leg_press', 'r', [1.5, 2, 2.5, 3, 3.5]], ['hack_squat', 'r', [.75, 1, 1.4, 1.8, 2.2]]],
  arms: [['bb_curl', 'r', [.25, .4, .55, .7, .85]], ['db_curl', 'r', [.1, .15, .22, .3, .37]], ['pushdown', 'r', [.25, .4, .55, .7, .9]], ['cgbp', 'r', [.45, .65, .9, 1.1, 1.35]]],
  core: [['plank', 'n', [30, 60, 90, 120, 180]], ['leg_raise', 'n', [3, 8, 12, 16, 20]], ['ab_wheel', 'n', [3, 8, 12, 16, 25]]]
};
function rankOf(group) {
  return mm('rank:' + group, () => {
    const bw = bodyweight(); let best = null;
    for (const [id, kind, th] of RANKDEF[group]) {
      const ss = sessionsOf(id); if (!ss.length) continue;
      const ex = exOf(id);
      const raw = kind === 'r' ? Math.max(...ss.map(s => s.best)) : Math.max(...ss.flatMap(s => s.sets.map(x => x.r)));
      const val = kind === 'r' ? raw / bw : raw;
      let t = -1; th.forEach((x, i) => { if (val >= x) t = i; });
      const lo = t >= 0 ? th[t] : 0, next = t < th.length - 1 ? th[t + 1] : null;
      const frac = next == null ? 1 : Math.max(0, Math.min(1, (val - lo) / (next - lo)));
      const need = next == null ? null : kind === 'r' ? Math.max(.5, Math.ceil((next * bw - raw) * 2) / 2) : Math.ceil(next - val);
      const unit = kind === 'r' ? 'kg' : ex.unit === 'sec' ? '秒' : '下';
      const cand = { group, id, kind, raw, val, t, frac, need, unit };
      if (!best || t > best.t || (t === best.t && frac > best.frac)) best = cand;
    }
    return best;
  });
}
const tierColor = t => t == null ? 'var(--m-off)' : t < 0 ? '#3A4458' : TIERS[t].c;
function gem(t, size = 40) {
  const c = tierColor(t), on = t != null && t >= 0;
  return `<svg class="gem" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" style="${on ? `filter:drop-shadow(0 0 8px ${c})` : ''}">
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="${c}" opacity="${on ? 1 : .55}"/>
    <polygon points="20,2 36,11 20,20 4,11" fill="#fff" opacity=".22"/><polygon points="20,20 36,29 20,38" fill="#000" opacity=".16"/>
    ${on ? '<path d="M20 12l1.9 5.1L27 19l-5.1 1.9L20 26l-1.9-5.1L13 19l5.1-1.9z" fill="#fff" opacity=".92"/>' : ''}
  </svg>`;
}

/* ---------- workout ---------- */
let cur = null, armed = null, menuK = null, kp = null;
function prefill(exId) {
  const ls = lastSession(exId);
  if (!ls) return [0, 1, 2].map(() => ({ w: null, r: null, done: false }));
  return ls.sets.map(s => ({ w: s.w, r: s.r, done: false }));
}
function startWorkout(part, choice, state) {
  let exIds = [];
  if (choice === 'last') { const lw = lastRealOf(part) || lastWorkoutOf(part); exIds = lw ? lw.ex.map(e => e.id) : []; }
  else if (choice && choice !== 'blank') { const t = store.profile.templates.find(x => x.id === choice); exIds = t ? t.ex : []; }
  const tpl = choice && choice !== 'blank' && choice !== 'last' ? choice : null;
  store.profile = { ...store.profile, lastTpl: { ...store.profile.lastTpl, [part]: choice || 'blank' } };
  saveProfile();
  const w = { id: rid(), date: today(), part, tpl, state: state || null, status: 'active', startedAt: Date.now(), updatedAt: Date.now(),
    ex: exIds.map(id => ({ k: rid(), id, sets: prefill(id) })) };
  saveWorkout(w);
  openWorkout(w);
  if (!w.ex.length) setTimeout(() => openLib('add', null, PARTS[part] ? part : 'chest'), 260);
}
function openWorkout(w) { cur = w; armed = null; menuK = null; kp = null; $('#pad').hidden = true; $('#wo').hidden = false; document.body.style.overflow = 'hidden'; renderWorkout(); }
function closeWorkout() { kp = null; $('#pad').hidden = true; $('#pad').innerHTML = ''; cur = null; armed = null; menuK = null; $('#wo').hidden = true; $('#wo').innerHTML = ''; document.body.style.overflow = ''; render(); }
const doneCount = w => w.ex.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
const totalCount = w => w.ex.reduce((a, e) => a + e.sets.length, 0);

function tileHTML(e, i, f, ex, p) {
  const s = e.sets[i], v = s[f], isSec = ex.unit === 'sec';
  const unit = f === 'w' ? (ex.e === 'bw' ? '加重 kg' : 'kg') : (isSec ? '秒' : '次');
  let cap = unit;
  if (p) {
    const pv = f === 'w' ? (p.w || 0) : p.r, cv = f === 'w' ? (s.w || 0) : s.r;
    const sameW = (s.w || 0) === (p.w || 0);
    const arrow = v == null ? '' : cv > pv && (f === 'w' || sameW) ? '<span class="u"> ↑</span>' : cv < pv && (f === 'w' || sameW) ? '<span class="d"> ↓</span>' : '';
    cap = `${unit} · 上次 ${f === 'w' ? (p.w > 0 ? fw(p.w) : '—') : p.r}${arrow}`;
  }
  const editing = kp && kp.k === e.k && kp.i === i && kp.f === f;
  return `<button class="tile${editing ? ' editing' : ''}" data-act="pad" data-k="${e.k}" data-i="${i}" data-f="${f}" aria-label="第 ${i + 1} 組${f === 'w' ? '重量' : '次數'}"><b class="${v == null ? 'empty' : ''}">${v == null ? (f === 'w' && ex.e === 'bw' ? '0' : '—') : fw(v)}</b><small>${cap}</small></button>`;
}
function excHTML(e, idx) {
  const ex = exOf(e.id), last = lastSession(e.id, cur), rec = recFor(e.id, cur);
  const note = store.profile.notes?.[e.id];
  const pr = exercisePRs(e, cur), cmp = compareTxt(e, last);
  const rows = e.sets.map((s, i) => {
    const p = last?.sets[i], f = pr.flags[i];
    return `<div class="set2${s.done ? ' done' : ''}">
      <span class="n">${i + 1}</span>
      ${tileHTML(e, i, 'w', ex, p)}${tileHTML(e, i, 'r', ex, p)}
      <button class="chk" data-act="done" data-k="${e.k}" data-i="${i}" aria-pressed="${!!s.done}" aria-label="完成第 ${i + 1} 組">${ic('check')}</button>
      ${s.done ? `<div class="extra"><span class="feel" role="group" aria-label="這組感覺">${Object.entries(FEELS).map(([k, t]) => `<button class="f-${k}" data-act="feel" data-k="${e.k}" data-i="${i}" data-v="${k}" aria-pressed="${s.f === k}">${t}</button>`).join('')}</span>${f ? `<span class="chip gold">${f.label}</span>` : ''}</div>` : ''}
    </div>`;
  }).join('');
  return `<section class="card exc" data-k="${e.k}" id="exc-${e.k}">
    <div class="exc-h3">${exPair(e.id)}<div class="exc-info"><b>${esc(ex.n)}</b><small>${EQUIP[ex.e]} · ${last ? `上次 ${last.seed ? '起始紀錄' : `${md(last.date)}（${ago(last.date)}）`}` : '第一次做'}</small>${musList(e.id)}</div>
      <div class="exc-a" style="flex-direction:column"><button class="icon-btn" data-act="swap" data-k="${e.k}" aria-label="換動作">${ic('swap')}</button><button class="icon-btn" data-act="menu" data-k="${e.k}" aria-label="更多" aria-expanded="${menuK === e.k}">${ic('more')}</button></div></div>
    ${menuK === e.k ? `<div class="exc-menu">
      <button class="btn sm" data-act="move" data-k="${e.k}" data-d="-1" ${idx === 0 ? 'disabled' : ''}>${ic('up')}上移</button>
      <button class="btn sm" data-act="move" data-k="${e.k}" data-d="1" ${idx === cur.ex.length - 1 ? 'disabled' : ''}>${ic('dn')}下移</button>
      <button class="btn sm" data-act="note" data-id="${e.id}">${ic('note')}${note ? '改備註' : '備註'}</button>
      <button class="btn sm danger" data-act="rm-ex" data-k="${e.k}">${ic('trash')}${armed === 'rm-' + e.k ? '確定移除？' : '移除'}</button>
    </div>` : ''}
    ${note ? `<div class="exc-note">${esc(note)}</div>` : ''}
    ${rec ? `<div class="rec">${ic('spark')}<div><b>${rec.main}</b><small>${rec.why}${rec.alt ? `。${rec.alt}` : ''}</small></div></div>` : ''}
    ${rows}
    <div class="exc-f">
      <button class="btn sm ghost" data-act="add-set" data-k="${e.k}">${ic('plus')}加一組</button>
      <button class="btn sm ghost" data-act="rm-set" data-k="${e.k}" ${e.sets.length ? '' : 'disabled'}>刪一組</button>
      ${cmp ? `<span class="cmp ${cmp.cls}">${cmp.t}</span>` : ''}
    </div>
  </section>`;
}
const stripHTML = () => `<div class="strip" id="wo-strip">${cur.ex.map(e => { const all = e.sets.length && e.sets.every(s => s.done); return `<button data-act="jump" data-k="${e.k}" aria-label="${esc(exOf(e.id).n)}">${exThumb(e.id, 'thumb round')}${all ? `<span class="ok">${ic('check')}</span>` : ''}</button>`; }).join('')}<button class="add" data-act="add-ex" aria-label="加動作">${ic('plus')}</button></div>`;
const woHeader = () => `<b>${partName(cur.part)}${cur.tpl && tplName(cur.tpl) ? ` · ${esc(tplName(cur.tpl))}` : ''}</b><small>已完成 ${doneCount(cur)} / ${totalCount(cur)} 組</small>`;
function renderWorkout() {
  const w = cur, n = doneCount(w), t = totalCount(w), st = w.state;
  $('#wo').innerHTML = `
    <div class="layer-top">
      <button class="back" data-act="wo-hide" aria-label="先收起來，稍後繼續">${ic('down')}收起</button>
      <div class="ttl" id="wo-ttl">${woHeader()}</div>
      <button class="done-btn" data-act="finish">完成</button>
    </div>
    <div class="wo-prog"><i id="wo-bar" style="width:${t ? n / t * 100 : 0}%"></i></div>
    <div class="layer-scroll${kp ? ' padopen' : ''}" id="wo-scroll">
      ${stripHTML()}
      ${st && (st.mood || st.tags?.length) ? `<div class="state-line">今天狀態：${st.mood ? `${MOODS[st.mood][0]} ${MOODS[st.mood][1]}` : ''}${(st.tags || []).map(x => `<span class="chip">${x}</span>`).join('')}</div>` : ''}
      ${w.ex.map(excHTML).join('')}
      <button class="add-ex" data-act="add-ex">${ic('plus')}加動作</button>
      <button class="link${armed === 'discard' ? ' arm' : ''}" data-act="discard">${armed === 'discard' ? '確定放棄？這次的紀錄會刪除' : '放棄這次訓練'}</button>
    </div>
    <div class="layer-bottom"><div><button class="btn primary big block" data-act="finish">完成訓練</button></div></div>`;
}
function rerenderExc(k) {
  const i = cur.ex.findIndex(x => x.k === k), el = $(`#wo .exc[data-k="${k}"]`);
  if (i >= 0 && el) el.outerHTML = excHTML(cur.ex[i], i);
  const tt = $('#wo-ttl'); if (tt) tt.innerHTML = woHeader();
  const sp = $('#wo-strip'); if (sp) sp.outerHTML = stripHTML();
  const n = doneCount(cur), t = totalCount(cur), bar = $('#wo-bar'); if (bar) bar.style.width = `${t ? n / t * 100 : 0}%`;
}
function finishWorkout(silent) {
  const kept = cur.ex.map(e => ({ k: e.k, id: e.id, sets: e.sets.filter(s => s.done && s.r > 0).map(s => { const o = { w: s.w > 0 ? s.w : null, r: s.r }; if (s.f) o.f = s.f; return o; }) })).filter(e => e.sets.length);
  if (!kept.length) { if (!silent) toast('還沒有完成任何一組。做完一組按右邊的 ✓'); return false; }
  const w = cur, prs = [], cmps = [];
  for (const e of kept) {
    const ex = exOf(e.id), r = exercisePRs(e, w);
    if (r.best) prs.push({ ...r.best, n: ex.n });
    if (r.volPR) prs.push({ ...r.volPR, n: ex.n });
    const c = compareTxt(e, lastSession(e.id, w));
    if (c) cmps.push({ n: ex.n, ...c });
  }
  const keyId = kept[0].id;
  w.ex = kept; w.status = 'done'; w.endedAt = Date.now();
  saveWorkout(w);
  closeWorkout();
  if (silent) return true;
  const next = recFor(keyId);
  const dm = durMin(w), sets = wSets(w), v = wVol(w);
  const tplMatch = w.tpl && (store.profile.templates.find(t => t.id === w.tpl)?.ex.join() === w.ex.map(e => e.id).join());
  const load = {}; for (const e of kept) { const { p, s } = musclesOf(e.id); p.forEach(m => load[m] = 2); s.forEach(m => load[m] = load[m] || 1); }
  openSheet(`<div class="sheet-card tall" role="dialog" aria-label="訓練總結">
    <div class="grab"></div>
    <div class="sum-hero"><div class="medal${prs.length ? '' : ' plain'}">${ic(prs.length ? 'trophy' : 'check')}</div><h3>${partName(w.part)}完成</h3><small>${md(w.date)}（${dow(w.date)}）${w.tpl && tplName(w.tpl) ? ` · ${esc(tplName(w.tpl))}` : ''}</small></div>
    <div style="padding:0 40px">${twoFigs(m => load[m] === 2 ? 'var(--accent)' : load[m] === 1 ? 'var(--accent-2)' : BASE(m), 'figs', false)}</div>
    <div class="kpis"><div class="kpi"><small>時間</small><b>${dm ?? '—'}<span class="muted" style="font-size:13px"> 分</span></b></div><div class="kpi"><small>組數</small><b>${sets}</b></div><div class="kpi"><small>總量 kg</small><b>${Math.round(v).toLocaleString()}</b></div></div>
    ${prs.length ? `<div class="sec-h"><h2>${prs.length} 個新紀錄</h2></div><div class="prs">${prs.map(p => `<div class="pr"><span class="tag">${p.label}</span><b>${esc(p.n)}<span class="num">${p.text}</span></b><small>${p.was}</small></div>`).join('')}</div>` : ''}
    ${cmps.length ? `<div class="sec-h"><h2>跟上次比</h2></div><div class="cmps">${cmps.map(c => `<div><span>${esc(c.n)}</span><span class="cmp ${c.cls}" style="font-weight:750">${c.t}</span></div>`).join('')}</div>` : ''}
    ${next ? `<div class="tip"><span class="lb">${ic('spark')}下次的${esc(exOf(keyId).n)}</span><b>${next.main.replace('今天可以嘗試', '試試')}</b><p>${next.why}</p></div>` : ''}
    ${tplMatch ? '' : `<button class="btn block" data-act="save-tpl" data-w="${w.id}">${ic('plus')}把今天的動作存成模板</button>`}
    <button class="btn primary big block" data-act="sheet-close">好</button>
  </div>`);
  return true;
}

/* ---------- number pad: big keys, steps, copy previous set ---------- */
const padEx = () => cur && kp ? cur.ex.find(x => x.k === kp.k) : null;
function openPad(k, i, f) {
  commitPad();
  const e = cur.ex.find(x => x.k === k); if (!e || !e.sets[i]) return;
  const v = e.sets[i][f];
  kp = { k, i, f, buf: v == null ? '' : fw(v), fresh: true, orig: v };
  $('#pad').hidden = false; $('#wo-scroll')?.classList.add('padopen');
  rerenderExc(k); renderPad();
  setTimeout(() => $(`#wo .tile[data-k="${k}"][data-i="${i}"][data-f="${f}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 30);
}
function commitPad() { // a changed value also flows into the later, unfinished sets that still had the old value
  const e = padEx(); if (!e) return;
  const s = e.sets[kp.i]; if (!s) return;
  const nv = s[kp.f], old = kp.orig;
  if (nv !== old) { for (let j = kp.i + 1; j < e.sets.length; j++) { const x = e.sets[j]; if (!x.done && x[kp.f] === old) x[kp.f] = nv; } saveWorkout(cur, 900); }
  kp.orig = nv;
}
function closePad() {
  if (!kp) return;
  commitPad(); const k = kp.k; kp = null;
  $('#pad').hidden = true; $('#pad').innerHTML = ''; $('#wo-scroll')?.classList.remove('padopen');
  rerenderExc(k);
}
function moveTo(i, f) { const k = kp.k; commitPad(); const e = padEx(), v = e.sets[i][f]; kp = { k, i, f, buf: v == null ? '' : fw(v), fresh: true, orig: v }; rerenderExc(k); renderPad(); setTimeout(() => $(`#wo .tile[data-k="${k}"][data-i="${i}"][data-f="${f}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 30); }
function setPadVal(v) {
  const e = padEx(), s = e.sets[kp.i];
  s[kp.f] = v == null || isNaN(v) ? null : kp.f === 'r' ? Math.round(v) : Math.round(v * 100) / 100;
  saveWorkout(cur, 900); rerenderExc(kp.k); renderPad();
}
function renderPad() {
  const e = padEx(); if (!e) return;
  const ex = exOf(e.id), s = e.sets[kp.i], isSec = ex.unit === 'sec', st = STEP[ex.e] || 2.5;
  const steps = kp.f === 'w' ? [-2 * st, -st, st, 2 * st] : [-2, -1, 1, 2];
  const last = lastSession(e.id, cur), src = e.sets[kp.i - 1] || last?.sets[kp.i];
  $('#pad').innerHTML = `<div class="pad" role="dialog" aria-label="輸入重量和次數">
    <div class="pad-h"><span>${esc(ex.n)} · 第 ${kp.i + 1} 組</span><button data-act="pad-close">收起</button></div>
    <div class="pad-fields">
      <button data-act="pad-field" data-f="w" aria-pressed="${kp.f === 'w'}"><b>${s.w == null ? '—' : fw(s.w)}</b>${ex.e === 'bw' ? '加重 kg' : 'kg'}</button>
      <button data-act="pad-field" data-f="r" aria-pressed="${kp.f === 'r'}"><b>${s.r == null ? '—' : s.r}</b>${isSec ? '秒' : '次'}</button>
    </div>
    <div class="pad-quick">${steps.map(d => `<button data-act="pad-step" data-v="${d}">${d > 0 ? '+' : '−'}${fw(Math.abs(d))}</button>`).join('')}<button class="same" data-act="pad-same" ${src ? '' : 'disabled'}>同${e.sets[kp.i - 1] ? '上一組' : '上次'}</button></div>
    <div class="pad-keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'].map(k => `<button data-act="pk" data-v="${k}" ${k === '.' && kp.f === 'r' ? 'disabled' : ''} aria-label="${k === 'del' ? '刪除' : k}">${k === 'del' ? '⌫' : k}</button>`).join('')}</div>
    <div class="pad-act"><button class="btn" data-act="pad-next">${kp.f === 'w' ? '下一格：次數' : kp.i < e.sets.length - 1 ? '下一組' : '收起'} ${ic('right')}</button><button class="btn primary" data-act="pad-done">${ic('check')}完成這組</button></div>
  </div>`;
}
function padKey(k) {
  const e = padEx(), s = e.sets[kp.i];
  let b = kp.fresh ? '' : kp.buf;
  if (k === 'del') b = (kp.fresh ? (s[kp.f] == null ? '' : fw(s[kp.f])) : kp.buf).slice(0, -1);
  else if (k === '.') { if (kp.f === 'r' || b.includes('.')) return; b = (b || '0') + '.'; }
  else { if (b.replace('.', '').length >= 5) return; b = (b === '0' ? '' : b) + k; }
  kp.buf = b; kp.fresh = false;
  setPadVal(b === '' ? null : Number(b.endsWith('.') ? b.slice(0, -1) : b));
}
function padDone() {
  const e = padEx(), i = kp.i, s = e.sets[i];
  if (!(s.r > 0)) { toast('先填次數'); if (kp.f !== 'r') moveTo(i, 'r'); return; }
  commitPad();
  if (!s.done) { s.done = true; saveWorkout(cur, 900); const pr = exercisePRs(e, cur).flags[i]; if (pr) toast(`${pr.label}！${exOf(e.id).n} ${pr.text}`); }
  const j = e.sets.findIndex((x, n) => n > i && !x.done);
  if (j >= 0) moveTo(j, 'w'); else closePad();
}

/* ---------- sheets ---------- */
function openSheet(html) { const sh = $('#sheet'); sh.innerHTML = html; sh.hidden = false; }
function closeSheet() { const sh = $('#sheet'); sh.hidden = true; sh.innerHTML = ''; }

let startSt = null;
function openStart(part) {
  const tpls = (store.profile.templates || []).filter(t => t.part === part);
  const lw = lastRealOf(part) || lastWorkoutOf(part);
  const lc = store.profile.lastTpl?.[part];
  let choice = lc && (lc === 'blank' || lc === 'last' || tpls.some(t => t.id === lc)) ? lc : (tpls[0]?.id || (lw ? 'last' : 'blank'));
  if (choice === 'last' && !lw) choice = 'blank';
  startSt = { part, mood: null, tags: [], choice, manage: false };
  renderStart();
}
function renderStart() {
  const s = startSt, part = s.part;
  const tpls = (store.profile.templates || []).filter(t => t.part === part);
  const lw = lastRealOf(part) || lastWorkoutOf(part);
  const lc = store.profile.lastTpl?.[part];
  const names = ids => ids.map(id => exOf(id).n).join('、');
  const opt = (id, title, sub, extra = '') => `<button class="opt" data-act="st-choice" data-v="${id}" aria-pressed="${s.choice === id}"><span class="radio"></span><span><b>${title}</b><small>${sub}</small></span>${extra}</button>`;
  openSheet(`<div class="sheet-card" role="dialog" aria-label="開始${partName(part)}">
    <div class="grab"></div>
    <div class="sheet-h"><h3>開始${partName(part)}</h3><button class="icon-btn" data-act="sheet-close" aria-label="關閉">${ic('x')}</button></div>
    <div class="lbl"><span>今天狀態如何？</span><span>可略過</span></div>
    <div class="moods">${Object.entries(MOODS).map(([k, [e, t]]) => `<button class="mood" data-act="st-mood" data-v="${k}" aria-pressed="${s.mood === k}"><span class="e">${e}</span>${t}</button>`).join('')}</div>
    <div class="tags">${TAGS.map(t => `<button data-act="st-tag" data-v="${t}" aria-pressed="${s.tags.includes(t)}">${t}</button>`).join('')}</div>
    <div class="lbl"><span>使用哪一套？</span>${tpls.length ? `<button class="btn sm ghost" data-act="st-manage">${s.manage ? '完成' : '管理模板'}</button>` : ''}</div>
    <div class="opts">
      ${tpls.map(t => s.manage
        ? `<div class="opt" style="grid-template-columns:1fr auto"><span><b>${esc(t.name)}</b><small>${esc(names(t.ex))}</small></span><button class="btn sm danger" data-act="tpl-del" data-id="${t.id}">${armed === 'tpl-' + t.id ? '確定刪除？' : '刪除'}</button></div>`
        : opt(t.id, esc(t.name), esc(names(t.ex)), lc === t.id ? '<span class="chip acc">上次使用</span>' : '')).join('')}
      ${!s.manage && lw ? opt('last', '照上次練的', `${lw.seed ? '起始紀錄' : md(lw.date)} · ${esc(names(lw.ex.map(e => e.id)))}`, lc === 'last' ? '<span class="chip acc">上次使用</span>' : '') : ''}
      ${!s.manage ? opt('blank', '空白開始', '自己一個一個加動作') : ''}
    </div>
    ${!tpls.length ? '<p class="muted" style="font-size:12.5px">練完後可以在總結畫面「存成模板」，例如胸 A、胸 B，下次就能直接選。</p>' : ''}
    <button class="btn primary big block" data-act="st-go">開始${partName(part)} ${ic('right')}</button>
  </div>`);
}
function openFree() {
  const items = [['arms', '手臂', '二頭、三頭', GROUP_MUSCLES.arms], ['core', '核心', '腹部、平板支撐', GROUP_MUSCLES.core], ['full', '全身', '各部位混合', ['chest', 'quadriceps', 'abs', 'front_deltoids']], ['free', '自己選', '從動作庫挑', []]];
  openSheet(`<div class="sheet-card" role="dialog" aria-label="自由訓練">
    <div class="grab"></div>
    <div class="sheet-h"><h3>自由訓練</h3><button class="icon-btn" data-act="sheet-close" aria-label="關閉">${ic('x')}</button></div>
    <div class="parts">${items.map(([p, n, d, ms]) => `<button class="card part" data-act="start" data-p="${p}"><span class="g">${n}</span><small>${d}</small>${figThumb(ms.length ? ms : ['abs'], [], 'thumb')}</button>`).join('')}</div>
  </div>`);
}

let lib = null;
function openLib(mode, k, tab) {
  lib = { mode, k, tab: tab && PARTS[tab] ? tab : 'chest', q: '', custom: false };
  openSheet(`<div class="sheet-card tall" role="dialog" aria-label="選擇動作">
    <div class="grab"></div>
    <div class="sheet-h"><h3>${mode === 'swap' ? '換成哪個動作？' : '加動作'}</h3><button class="icon-btn" data-act="sheet-close" aria-label="關閉">${ic('x')}</button></div>
    <input type="search" id="lib-q" placeholder="搜尋動作，例如：臥推" autocomplete="off">
    <div class="lib-tabs" id="lib-tabs">${Object.entries(PARTS).map(([p, n]) => `<button data-act="lib-tab" data-p="${p}" aria-pressed="${p === lib.tab}">${n}</button>`).join('')}</div>
    <div class="lib-list" id="lib-list"></div>
    <div id="lib-custom"></div>
  </div>`);
  renderLibList();
}
function renderLibList() {
  const q = lib.q.trim();
  const inUse = new Set(cur ? cur.ex.map(e => e.id) : []);
  const list = allEx().filter(e => q ? e.n.includes(q) : e.p === lib.tab);
  const groups = Object.keys(EQUIP).map(eq => {
    const items = list.filter(e => e.e === eq);
    if (!items.length) return '';
    return `<div class="lib-grp"><h4>${EQUIP[eq]}</h4>${items.map(e => {
      const ls = lastSession(e.id);
      const top = ls ? ls.sets.reduce((a, s) => e1(s, e) > e1(a, e) ? s : a, ls.sets[0]) : null;
      return `<button class="lib-row" data-act="pick" data-id="${e.id}">${exThumb(e.id)}<span>${esc(e.n)}<small style="display:block;white-space:normal">${q ? `${PARTS[e.p]} · ` : ''}${muscleNames(e.id).p.join('、')}</small></span><small>${inUse.has(e.id) ? '已在清單' : top ? `${setTxt(top, e)} · ${ls.seed ? '起始' : md(ls.date)}` : ''}</small></button>`;
    }).join('')}</div>`;
  }).join('');
  $('#lib-list').innerHTML = groups || `<div class="empty"><p>找不到「${esc(q)}」。可以新增成自訂動作。</p></div>`;
  $$('#lib-tabs button').forEach(b => b.setAttribute('aria-pressed', !q && b.dataset.p === lib.tab));
  $('#lib-custom').innerHTML = lib.custom ? `<form class="card" id="custom-form" style="padding:14px;display:flex;flex-direction:column;gap:10px">
      <b>新增自訂動作</b>
      <input id="c-name" required maxlength="30" placeholder="動作名稱" value="${esc(q)}">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <select id="c-part" aria-label="部位">${Object.entries(PARTS).map(([p, n]) => `<option value="${p}" ${p === lib.tab ? 'selected' : ''}>${n}</option>`).join('')}</select>
        <select id="c-eq" aria-label="器材">${Object.entries(EQUIP).map(([e, n]) => `<option value="${e}">${n}</option>`).join('')}</select>
      </div>
      <button class="btn primary" type="submit">新增並加入</button>
    </form>` : `<button class="btn block" data-act="custom">${ic('plus')}自訂動作</button>`;
}
function pickExercise(id) {
  if (!cur) return;
  if (lib.mode === 'swap') {
    const e = cur.ex.find(x => x.k === lib.k);
    if (e) {
      const ls = lastSession(id, cur);
      e.id = id;
      e.sets = e.sets.map((s, i) => s.done ? s : (ls ? { w: (ls.sets[i] || ls.sets[ls.sets.length - 1]).w, r: (ls.sets[i] || ls.sets[ls.sets.length - 1]).r, done: false } : { w: null, r: s.r, done: false }));
    }
  } else cur.ex.push({ k: rid(), id, sets: prefill(id) });
  saveWorkout(cur);
  closeSheet();
  renderWorkout();
  if (lib.mode === 'add') { const sc = $('#wo-scroll'); if (sc) setTimeout(() => sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' }), 30); }
}
function openNote(exId) {
  const ex = exOf(exId), v = store.profile.notes?.[exId] || '';
  openSheet(`<form class="sheet-card" id="note-form" data-id="${exId}" role="dialog" aria-label="備註">
    <div class="grab"></div>
    <h3>${esc(ex.n)}・備註</h3>
    <p class="muted" style="font-size:13.5px">例如座椅調第幾格、用哪一台機器。之後每次練這個動作都會顯示。</p>
    <textarea id="note-text" rows="3" maxlength="120">${esc(v)}</textarea>
    <div class="sheet-actions"><button type="button" class="btn" data-act="sheet-close">取消</button><button type="submit" class="btn primary">儲存</button></div>
  </form>`);
}
function openBw() {
  const es = Object.entries(store.bw.entries || {}).sort((a, b) => a[0] < b[0] ? 1 : -1);
  openSheet(`<form class="sheet-card" id="bw-form" role="dialog" aria-label="記錄體重">
    <div class="grab"></div>
    <h3>記錄體重</h3>
    <label class="fld"><span>日期</span><input type="date" id="bw-date" value="${today()}" max="${today()}"></label>
    <label class="fld"><span>體重（kg）</span><input type="number" id="bw-val" inputmode="decimal" step="0.1" min="30" max="250" value="${es[0]?.[1] ?? ''}" placeholder="90.0" required></label>
    <p class="muted" style="font-size:13px">建議早上起床、上完廁所後量。每次條件一樣，趨勢才準。肌肉等級也會用最新的體重計算。</p>
    ${es.length ? `<div class="cmps">${es.slice(0, 4).map(([d, v]) => `<div><span>${md(d)}（${dow(d)}）</span><b class="num" style="font-size:16px">${v} kg</b></div>`).join('')}</div>` : ''}
    <div class="sheet-actions"><button type="button" class="btn" data-act="sheet-close">取消</button><button type="submit" class="btn primary">儲存</button></div>
  </form>`);
}
let pending = null;
function openSwitch(next) {
  const a = activeWorkout();
  pending = next;
  openSheet(`<div class="sheet-card" role="dialog" aria-label="還有進行中的訓練">
    <div class="grab"></div>
    <h3>還有一個進行中的${partName(a.part)}</h3>
    <p class="muted" style="font-size:14px">${md(a.date)} 開始，已完成 ${doneCount(a)} 組。</p>
    <button class="btn primary big block" data-act="resume">繼續${partName(a.part)}</button>
    <button class="btn block" data-act="finish-other">${doneCount(a) ? `把${partName(a.part)}存起來` : `放棄${partName(a.part)}`}，改練${partName(next)}</button>
    <button class="btn block ghost" data-act="sheet-close">取消</button>
  </div>`);
}

let toastT = 0;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); }

/* ---------- charts ---------- */
function niceRange(mn, mx) {
  const span = Math.max(mx - mn, 1), step = span <= 4 ? 1 : span <= 10 ? 2 : span <= 25 ? 5 : span <= 50 ? 10 : span <= 120 ? 20 : span <= 400 ? 50 : span <= 1200 ? 200 : span <= 4000 ? 500 : 1000;
  const lo = Math.max(0, Math.floor((mn - span * .2) / step) * step), hi0 = Math.ceil((mx + span * .25) / step) * step;
  return { lo, hi: hi0 <= lo ? lo + step : hi0, step };
}
let gid = 0;
function bubble(x, y, txt, cls, anchor) {
  const w = Math.max(34, txt.length * 7.6 + 14), bx = anchor === 'start' ? x - 6 : anchor === 'end' ? x - w + 6 : x - w / 2;
  return `<rect class="bub ${cls}" x="${bx.toFixed(1)}" y="${(y - 30).toFixed(1)}" width="${w.toFixed(1)}" height="22" rx="11"/><text class="bubt ${cls}" x="${(bx + w / 2).toFixed(1)}" y="${(y - 15).toFixed(1)}" text-anchor="middle">${txt}</text>`;
}
function lineChart(pts, o = {}) {
  const W = 340, H = o.h || 180, l = 38, r = 16, t = 34, b = 24, id = 'ag' + (++gid);
  const all = [...pts.map(p => p.v), ...(o.avg || []).map(p => p.v)];
  const { lo, hi, step } = niceRange(Math.min(...all), Math.max(...all));
  const d0 = dnum(pts[0].date), d1 = dnum(pts[pts.length - 1].date), span = Math.max(1, d1 - d0);
  const single = pts.length === 1 || d1 === d0;
  const x = d => single ? (l + W - r) / 2 : l + (W - l - r) * (dnum(d) - d0) / span;
  const y = v => t + (H - t - b) * (1 - (v - lo) / (hi - lo));
  const fmt = o.fmt || (v => fw(Math.round(v * 10) / 10));
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.label || '趨勢圖'}"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="ag0"/><stop offset="1" class="ag1"/></linearGradient></defs>`;
  for (let v = lo; v <= hi + 1e-9; v += step) s += `<line class="grid" x1="${l}" x2="${W - r}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="ax" x="${l - 7}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${v >= 1000 ? fw(v / 1000) + 'k' : fw(v)}</text>`;
  const series = o.avg || pts;
  if (o.avg) pts.forEach(p => { s += `<circle class="raw" cx="${x(p.date).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="2.6"/>`; });
  const line = series.map(p => `${x(p.date).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  if (!single && series.length > 1) s += `<polygon fill="url(#${id})" points="${x(series[0].date).toFixed(1)},${y(lo)} ${line} ${x(series[series.length - 1].date).toFixed(1)},${y(lo)}"/><polyline class="line" points="${line}"/>`;
  if (!o.avg) { let run = -Infinity; pts.forEach((p, i) => { const pr = o.prs && i > 0 && p.v > run; run = Math.max(run, p.v); s += `<circle class="pt${pr ? ' pr' : ''}" cx="${x(p.date).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="4"/>`; }); }
  const lp = series[series.length - 1];
  if (o.ends && !single) {
    const fp = series[0];
    s += bubble(x(fp.date), y(fp.v), fmt(fp.v), '', 'start') + bubble(x(lp.date), y(lp.v), fmt(lp.v), 'end', 'end');
  } else s += bubble(x(lp.date), y(lp.v), fmt(lp.v), 'end', single ? 'middle' : 'end');
  s += `<text class="ax" x="${x(pts[0].date).toFixed(1)}" y="${H - 6}" text-anchor="${single ? 'middle' : 'start'}">${md(pts[0].date)}</text>`;
  if (!single) s += `<text class="ax" x="${W - r}" y="${H - 6}" text-anchor="end">${md(pts[pts.length - 1].date)}</text>`;
  return s + `</svg>`;
}
function ring(n, goal) {
  const r = 14, c = 2 * Math.PI * r, f = Math.min(1, n / goal);
  return `<svg class="ring" viewBox="0 0 34 34" aria-hidden="true"><circle class="bg" cx="17" cy="17" r="${r}" fill="none" stroke-width="4"/><circle class="fg" cx="17" cy="17" r="${r}" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - f)).toFixed(1)}" transform="rotate(-90 17 17)"/></svg>`;
}
function attendanceChart() {
  const W = 340, H = 150, l = 10, r = 10, t = 22, b = 24, n = 8, max = 7;
  const wk0 = weekStart(today());
  const weeks = Array.from({ length: n }, (_, i) => addDays(wk0, -7 * (n - 1 - i)));
  const cw = (W - l - r) / n, y = v => t + (H - t - b) * (1 - v / max);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="最近 8 週每週訓練次數">`;
  s += `<line class="goal" x1="${l}" x2="${W - r}" y1="${y(4)}" y2="${y(4)}"/><text class="ax" x="${W - r}" y="${y(4) - 5}" text-anchor="end">目標 4</text>`;
  weeks.forEach((wk, i) => {
    const c = weekCount(wk), x = l + cw * i + cw * .22, bw = cw * .56, h = Math.max(2, y(0) - y(Math.min(c, max)));
    s += `<rect class="col${c >= 4 ? ' on' : ''}" x="${x.toFixed(1)}" y="${(y(0) - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="5"/>`;
    s += `<text class="cn" x="${(x + bw / 2).toFixed(1)}" y="${(y(0) - h - 6).toFixed(1)}" text-anchor="middle">${c}</text>`;
    s += `<text class="ax" x="${(x + bw / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${md(wk)}</text>`;
  });
  return s + `</svg>`;
}
function monthBars(ym) {
  const [y, mo] = ym.split('-').map(Number), days = new Date(y, mo, 0).getDate();
  const sets = Array.from({ length: days }, (_, i) => realWorkouts().filter(w => w.date === `${ym}-${pad(i + 1)}`).reduce((a, w) => a + wSets(w), 0));
  const W = 340, H = 110, l = 4, r = 4, t = 6, b = 20, max = Math.max(20, ...sets), cw = (W - l - r) / days;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${mo} 月每天組數">`;
  sets.forEach((v, i) => {
    const h = v ? Math.max(4, (H - t - b) * v / max) : 2, x = l + cw * i + cw * .18;
    s += `<rect class="col${v ? ' on' : ''}" x="${x.toFixed(1)}" y="${(H - b - h).toFixed(1)}" width="${(cw * .64).toFixed(1)}" height="${h.toFixed(1)}" rx="2"/>`;
  });
  [1, 8, 15, 22, 29].filter(d => d <= days).forEach(d => { s += `<text class="ax" x="${(l + cw * (d - 1) + cw / 2).toFixed(1)}" y="${H - 5}" text-anchor="middle">${mo}/${d}</text>`; });
  return s + `</svg>`;
}
function bwSeries() {
  const es = Object.entries(store.bw.entries || {}).sort((a, b) => a[0] < b[0] ? -1 : 1).filter(([d]) => d >= addDays(today(), -90));
  const pts = es.map(([date, v]) => ({ date, v: +v }));
  const avg = pts.map(p => { const win = pts.filter(q => dnum(q.date) <= dnum(p.date) && dnum(q.date) > dnum(p.date) - 7); return { date: p.date, v: win.reduce((a, q) => a + q.v, 0) / win.length }; });
  return { pts, avg };
}

/* ---------- pages ---------- */
const ui = { tab: 'home', focus: null, calMonth: null, calDay: null, pTab: 'rank', pPart: 'chest', armDel: null, exMetric: 'w' };
const dotsHTML = n => `<span class="dots">${[0, 1, 2, 3, 4].map(i => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;

function heatCard() {
  const wk = weekStart(today()), load = muscleLoad(wk, addDays(wk, 7));
  const total = realWorkouts().filter(w => w.date >= wk).reduce((a, w) => a + wSets(w), 0);
  const top = Object.entries(load).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return `<button class="card heat tap" data-act="goto-volume">
    ${twoFigs(m => HEAT[heatLevel(load[m])] === 'var(--m-off)' ? BASE(m) : HEAT[heatLevel(load[m])], 'figs', false)}
    <div class="heat-info">
      <span class="eyebrow">本週練到的肌肉</span>
      <span class="big">${total}<span>組</span></span>
      <div class="mlist">${top.length ? top.map(([m, v]) => `<div><span>${MUSCLE_NAME[m] || m}</span><span>${fw(Math.round(v * 2) / 2)} 組</span></div>`).join('') : '<div><span class="muted">這週還沒練</span><span></span></div>'}</div>
      <span class="scale">少${HEAT.slice(1).map(c => `<i style="background:${c}"></i>`).join('')}多</span>
    </div>
  </button>`;
}
const FOCUSABLE = ['chest', 'back', 'shoulder', 'legs', 'arms', 'core'];
function renderHome() {
  const a = activeWorkout(), sug = suggestPart();
  const focus = ui.focus || (a && MAIN.includes(a.part) ? a.part : sug);
  const t = today(), wc = weekCount();
  const lw = lastRealOf(focus), lwAny = lastWorkoutOf(focus), rec = recovery(focus);
  const kl = keyLift(focus), kr = kl ? recFor(kl) : null, kls = kl ? lastSession(kl) : null;
  const isActive = a && a.part === focus;
  const prs = recentPRs(30).slice(0, 3);
  const mon = t.slice(0, 7), pm = prevMonth(t);
  const monCount = realWorkouts().filter(w => w.date.startsWith(mon)).length;
  const pmCount = realWorkouts().filter(w => w.date.startsWith(pm) && +w.date.slice(8) <= +t.slice(8)).length;
  const { pts, avg } = bwSeries(), lastBw = pts[pts.length - 1];
    const fm = new Set(GROUP_MUSCLES[focus]);
  const back = focus === 'back';
  return `<div class="glow"></div><div class="page">
    <header class="head"><div><div class="eyebrow">${+t.slice(5, 7)} 月 ${+t.slice(8, 10)} 日 星期${dow(t)}</div><h1>今天狀態</h1></div></header>
    ${a && !isActive ? `<button class="card resume" data-act="resume"><span class="pulse"></span><span><b>繼續${partName(a.part)}</b><small>已完成 ${doneCount(a)} 組</small></span><span class="go">${ic('right')}</span></button>` : ''}
    <section class="card hero">
      <div class="hero-row">
        <div class="hero-top">
          <div class="t"><span>今天</span><span class="bar"></span><span class="acc">${PARTS[focus]}</span></div>
          <div>${focus === sug && !isActive ? '<span class="chip acc">輪到這個部位</span>' : ''}${isActive ? '<span class="chip acc">進行中</span>' : ''}</div>
          <small>${lw ? `上次${partName(focus)}：${md(lw.date)} · ${ago(lw.date)}` : lwAny ? '目前只有起始紀錄' : `還沒練過${partName(focus)}`}</small>
        </div>
        <div class="heroFig">${bodySVG(back ? 'posteriorData' : 'anteriorData', m => fm.has(m) ? 'var(--accent)' : BASE(m))}</div>
      </div>
      <div class="stats">
        <div class="stat"><small>恢復度</small><div class="v">${dotsHTML(rec.dots)}</div><small style="color:var(--fg)">${rec.txt}</small></div>
        <div class="stat"><small>本週訓練</small><div class="v">${ring(wc, 4)}<span class="num">${wc}<span class="muted" style="font-size:15px;font-weight:600"> / 4</span></span></div><small style="color:var(--fg)">${wc >= 4 ? '本週達標' : `還差 ${4 - wc} 次`}</small></div>
      </div>
      ${kr ? `<div class="tip"><span class="lb">${ic('spark')}今天建議 · ${esc(exOf(kl).n)}</span><small>上次 ${kls.sets.map(s => setTxt(s, exOf(kl))).join('、')}</small><b>${kr.main}</b><p>${kr.alt || kr.why}</p></div>`
        : `<div class="tip"><span class="lb">${ic('spark')}今天建議</span><b>記下今天的重量和次數</b><p>練完一次之後，這裡會根據上次的成績建議今天的目標。</p></div>`}
      ${isActive
        ? `<button class="btn primary big block" data-act="resume">繼續訓練 · 已完成 ${doneCount(a)} 組 ${ic('right')}</button>`
        : `<button class="btn primary big block" data-act="start" data-p="${focus}">開始${partName(focus)} ${ic('right')}</button>`}
    </section>
    <section class="sec">
      <div class="sec-h"><h2>今天練什麼？</h2><span>點一下切換</span></div>
      <div class="parts">${MAIN.map(p => {
        const l2 = lastRealOf(p);
        return `<button class="card part" data-act="focus" data-p="${p}" aria-pressed="${p === focus}">
          <span class="g">${PARTS[p]}${p === sug ? '<span class="chip acc">輪到</span>' : ''}</span>
          <small>${l2 ? `${md(l2.date)} · ${ago(l2.date)}` : '還沒有紀錄'}</small>
          ${dotsHTML(recovery(p).dots)}
          ${groupThumb(p)}
        </button>`;
      }).join('')}</div>
      <button class="free" data-act="free">${ic('plus')}自由訓練</button>
    </section>
    <section class="sec">${heatCard()}</section>
    <section class="sec">
      <div class="sec-h"><h2>最近進步</h2><span>最近 30 天</span></div>
      <div class="card"><div class="prog-list">
        ${prs.map(p => `<button class="prow" data-act="ex" data-id="${p.ex}">${exThumb(p.ex)}<span><b>${esc(exOf(p.ex).n)}</b><small><span style="color:${p.type === 'weight' || p.type === 'vol' ? 'var(--gold)' : 'var(--good)'};font-weight:700">${p.label}</span> · ${p.was}</small></span><span class="big">${p.text}<small class="muted">${md(p.date)}</small></span></button>`).join('')}
        ${!prs.length ? `<div class="prow"><span class="ic" style="color:var(--gold)">${ic('trophy')}</span><span><b>還沒有新紀錄</b><small>重量、次數或總量超過以前，就會出現在這裡</small></span><span></span></div>` : ''}
        <div class="prow"><span class="ic" style="color:var(--accent)">${ic('flame')}</span><span><b>本月訓練</b><small>上個月同期 ${pmCount} 次</small></span><span class="big">${monCount} 次${monCount !== pmCount ? `<small style="color:${monCount > pmCount ? 'var(--good)' : 'var(--bad)'}">${monCount > pmCount ? '+' : ''}${monCount - pmCount}</small>` : ''}</span></div>
      </div></div>
    </section>
    <button class="card bwrow" data-act="bw"><span class="sq-ic">${ic('scale')}</span><span><b>體重</b><small>${avg.length ? `7 天平均 ${avg[avg.length - 1].v.toFixed(1)} kg` : '想記再記，看的是平均趨勢'}</small></span><span class="num">${lastBw ? `${lastBw.v.toFixed(1)}<span>kg</span>` : ic('plus')}</span></button>

  </div>`;
}

function workoutCard(w) {
  const dm = durMin(w), key = 'del-' + w.id;
  return `<article class="card wcard">
    <div class="wcard-h"><b><span class="pdot" style="background:${pcol(w.part)}"></span>${partName(w.part)}${w.tpl && tplName(w.tpl) ? ` · ${esc(tplName(w.tpl))}` : ''}</b><small>${w.seed ? '起始紀錄' : `${md(w.date)}（${dow(w.date)}）${dm ? ` · ${dm} 分鐘` : ''}`}${w.state?.mood ? ` · ${MOODS[w.state.mood][0]} ${MOODS[w.state.mood][1]}` : ''}${(w.state?.tags || []).length ? ` · ${w.state.tags.join('、')}` : ''}</small></div>
    <div class="kpis"><div class="kpi"><small>動作</small><b>${w.ex.length}</b></div><div class="kpi"><small>組數</small><b>${wSets(w)}</b></div><div class="kpi"><small>總量 kg</small><b>${Math.round(wVol(w)).toLocaleString()}</b></div></div>
    <div class="exlist">${w.ex.map(e => { const ex = exOf(e.id), pr = exercisePRs(asDone(e), w); return `<button class="exitem" data-act="ex" data-id="${e.id}">${exThumb(e.id)}<span><span class="nm"><span>${esc(ex.n)}</span>${pr.best ? `<span class="chip gold">${pr.best.label}</span>` : ''}</span><span class="setchips">${e.sets.map((s, i) => `<span class="sc${pr.flags[i] ? ' pr' : s.f ? ' f-' + s.f : ''}">${setTxt(s, ex)}</span>`).join('')}</span></span></button>`; }).join('')}</div>
    <div style="display:flex;justify-content:flex-end"><button class="btn sm danger ghost" data-act="del-w" data-id="${w.id}">${ui.armDel === key ? '確定刪除這次紀錄？' : '刪除'}</button></div>
  </article>`;
}
function renderHist() {
  const t = today();
  const ws = realWorkouts(), seeds = doneWorkouts().filter(w => w.seed);
  if (!ui.calMonth) ui.calMonth = t.slice(0, 7);
  if (!ui.calDay) ui.calDay = ws.length ? ws[ws.length - 1].date : t;
  const [y, mo] = ui.calMonth.split('-').map(Number);
  const padN = (new Date(y, mo - 1, 1).getDay() + 6) % 7, days = new Date(y, mo, 0).getDate();
  const byDay = {};
  for (const w of ws) (byDay[w.date] = byDay[w.date] || []).push(w);
  let cells = ['一', '二', '三', '四', '五', '六', '日'].map(d => `<span class="wd">${d}</span>`).join('');
  for (let i = 0; i < padN; i++) cells += '<span></span>';
  for (let d = 1; d <= days; d++) {
    const ds = `${y}-${pad(mo)}-${pad(d)}`, list = byDay[ds] || [];
    cells += `<button class="day${list.length ? ' has' : ''}${ds === t ? ' today' : ''}" data-act="day" data-d="${ds}" aria-pressed="${ds === ui.calDay}" aria-label="${mo} 月 ${d} 日${list.length ? '，' + list.map(w => partName(w.part)).join('、') : ''}">${d}<span class="pd">${list.slice(0, 3).map(w => `<i style="background:${pcol(w.part)}"></i>`).join('')}</span></button>`;
  }
  const mws = ws.filter(w => w.date.startsWith(ui.calMonth));
  const sel = byDay[ui.calDay] || [];
  const a = activeWorkout();
  return `<div class="glow"></div><div class="page">
    <header class="head"><div><div class="eyebrow">紀錄</div><h1>${y} 年 ${mo} 月</h1></div>
      <span class="cal-h" style="padding:0"><span class="nav"><button class="icon-btn" data-act="cal" data-d="-1" aria-label="上個月">${ic('left')}</button><button class="icon-btn" data-act="cal" data-d="1" aria-label="下個月" ${ui.calMonth >= t.slice(0, 7) ? 'disabled' : ''}>${ic('right')}</button></span></span></header>
    ${a ? `<button class="card resume" data-act="resume"><span class="pulse"></span><span><b>${partName(a.part)}進行中</b><small>已完成 ${doneCount(a)} 組</small></span><span class="go">${ic('right')}</span></button>` : ''}
    <section class="card mhero">
      <h3>訓練次數</h3>
      <span class="huge num">${mws.length}</span>
      <p>${mo} 月一共練了 ${mws.length} 次、${mws.reduce((s, w) => s + wSets(w), 0)} 組，總量 ${Math.round(mws.reduce((s, w) => s + wVol(w), 0)).toLocaleString()} kg。</p>
      <div style="margin-top:10px">${monthBars(ui.calMonth)}</div>
    </section>
    <section class="card cal">
      <div class="cal-g">${cells}</div>
      <div class="legend">${MAIN.concat(['arms', 'core']).map(p => `<span><i class="pdot" style="background:${pcol(p)}"></i>${PARTS[p]}</span>`).join('')}</div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2>${md(ui.calDay)}（${dow(ui.calDay)}）</h2><span>${sel.length ? `${sel.length} 次訓練` : ''}</span></div>
      ${sel.length ? sel.map(workoutCard).join('') : `<div class="card empty"><p>${ui.calDay === t ? '今天還沒有完成的訓練。' : '這天沒有訓練。'}點有圓點的日期，可以看當天練了什麼。</p></div>`}
    </section>
    ${seeds.length ? `<section class="sec"><div class="sec-h"><h2>起始紀錄</h2><span>開始用 App 之前的成績</span></div>${seeds.map(workoutCard).join('')}</section>` : ''}
  </div>`;
}

function rankHTML() {
  const groups = Object.keys(PARTS), bw = bodyweight(), hasBw = Object.keys(store.bw.entries || {}).length > 0;
  const rs = Object.fromEntries(groups.map(g => [g, rankOf(g)]));
  const ranked = groups.filter(g => rs[g] && rs[g].t >= 0);
  const avgT = ranked.length ? Math.round(ranked.reduce((a, g) => a + rs[g].t, 0) / ranked.length) : null;
  const colorOf = m => { const g = Object.keys(GROUP_MUSCLES).find(k => GROUP_MUSCLES[k].includes(m)); return g && rs[g] ? tierColor(rs[g].t) : BASE(m); };
  const rows = groups.map(g => {
    const r = rs[g];
    if (!r) return `<div class="rrow">${gem(null, 42)}<span><b>${PARTS[g]}</b><small>還沒評級。做一次 ${RANKDEF[g].slice(0, 2).map(([id]) => exOf(id).n).join(' 或 ')} 就會出現</small></span><span class="tn muted">—</span></div>`;
    const ex = exOf(r.id), nxt = r.t < TIERS.length - 1 ? TIERS[r.t + 1] : null;
    const detail = r.kind === 'r' ? `${esc(ex.n)} 估算 ${Math.round(r.raw)} kg · ${r.val.toFixed(2)} 倍體重` : `${esc(ex.n)} 最佳 ${r.raw} ${r.unit}`;
    return `<button class="rrow" data-act="ex" data-id="${r.id}" style="width:100%;text-align:left">${gem(r.t, 42)}<span><b>${PARTS[g]}</b><small>${detail}</small><div class="rbar"><i style="width:${(r.frac * 100).toFixed(0)}%;background:${nxt ? nxt.c : tierColor(r.t)}"></i></div><small style="margin-top:4px">${nxt ? `再 +${fw(r.need)} ${r.unit} 升到${nxt.n}` : '已經是最高等級'}</small></span><span class="tn" style="color:${tierColor(r.t)}">${r.t >= 0 ? TIERS[r.t].n : '起步'}</span></button>`;
  }).join('');
  return `<section class="card rank-hero">
      <div class="tiers">${TIERS.map((x, i) => `<span style="color:${x.c}">${gem(i, 26)}${x.n}</span>`).join('')}</div>
      <div class="rank-figs"><div class="fig">${bodySVG('anteriorData', colorOf)}</div><div class="fig">${bodySVG('posteriorData', colorOf)}</div></div>
      <div class="overall">${gem(avgT, 46)}<div><b style="color:${avgT == null ? 'var(--muted)' : TIERS[avgT].c}">${avgT == null ? '尚未評級' : `整體 ${TIERS[avgT].n}`}</b><small>${ranked.length} / ${groups.length} 個部位已評級</small></div></div>
    </section>
    <div class="card"><div>${rows}</div></div>
    <p class="muted" style="font-size:12.5px;padding:0 2px">等級用估算 1RM 除以體重（${fw(bw)} kg${hasBw ? '' : '，還沒記體重，先用 75 kg 估算'}），對照常見的力量標準。只是讓進步更有感的參考，不是正式評測。</p>`;
}
function strengthCard(id) {
  const ex = exOf(id), ss = sessionsOf(id);
  const win = ss.filter(s => s.date >= addDays(today(), -56));
  const last = ss[ss.length - 1];
  const weighted = last.topW > 0 && ex.unit !== 'sec';
  const val = s => weighted ? s.topW : s.topR;
  const pts = (win.length ? win : [last]).map(s => ({ date: s.date, v: val(s) }));
  const d = win.length > 1 ? val(last) - val(win[0]) : null;
  const unit = weighted ? 'kg' : ex.unit === 'sec' ? '秒' : '下';
  const dcls = d == null || d === 0 ? 'flat' : d > 0 ? 'up' : 'down';
  return `<button class="card scard" data-act="ex" data-id="${id}">
    <div class="scard-h">${exThumb(id)}<div><b>${esc(ex.n)}</b><small>最近 ${last.seed ? '起始紀錄' : md(last.date)} · ${ss.length} 次紀錄</small></div><span class="delta ${dcls}">${d == null ? '剛開始記錄' : d > 0 ? `8 週 +${fw(d)} ${unit}` : d < 0 ? `8 週 ${fw(d)} ${unit}` : '8 週持平'}</span></div>
    <div class="now">${weighted ? `${fw(last.topW)}<span> kg × ${last.topR}</span>` : `${last.topR}<span> ${unit}</span>`}</div>
    ${lineChart(pts, { h: 140, label: `${ex.n}最近 8 週`, fmt: v => fw(v), ends: true })}
  </button>`;
}
function renderProg() {
  const tabs = [['rank', '等級'], ['strength', '力量'], ['volume', '訓練量'], ['freq', '頻率']];
  let body = '';
  if (ui.pTab === 'rank') body = rankHTML();
  else if (ui.pTab === 'strength') {
    const ids = [...new Set(doneWorkouts().flatMap(w => w.ex.map(e => e.id)))].filter(id => exOf(id).p === ui.pPart);
    const order = ['bench', 'squat', 'incline_bench', 'incline_db', 'db_bench', 'ohp', 'deadlift'];
    ids.sort((a, b) => { const ia = order.indexOf(a), ib = order.indexOf(b); if (ia !== ib && (ia > -1 || ib > -1)) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib); return sessionsOf(b).length - sessionsOf(a).length; });
    body = `<div class="pchips">${Object.entries(PARTS).map(([p, n]) => `<button data-act="ppart" data-p="${p}" aria-pressed="${p === ui.pPart}">${n}</button>`).join('')}</div>
      ${ids.length ? ids.map(strengthCard).join('') : `<div class="card empty"><p>還沒有${PARTS[ui.pPart]}的動作紀錄。練完之後，這裡會畫出每個動作最近 8 週的最重組。</p></div>`}`;
  } else if (ui.pTab === 'volume') {
    const wk = weekStart(today());
    const setsIn = (p, from, to) => realWorkouts().filter(w => w.date >= from && w.date < to).reduce((a, w) => a + w.ex.filter(e => exOf(e.id).p === p).reduce((b, e) => b + e.sets.length, 0), 0);
    body = heatCard() + Object.keys(PARTS).map(p => {
      const n = setsIn(p, wk, addDays(wk, 7)), lw = setsIn(p, addDays(wk, -7), wk);
      const avg4 = [1, 2, 3, 4].reduce((a, i) => a + setsIn(p, addDays(wk, -7 * i), addDays(wk, -7 * (i - 1))), 0) / 4;
      const max = Math.max(24, n);
      return `<div class="card vcard">
        <div class="vcard-h"><b>${PARTS[p]}</b><span class="num">${n}<span>組</span></span></div>
        <div class="vtrack"><span class="band" style="left:${10 / max * 100}%;width:${10 / max * 100}%"></span><i style="width:${Math.min(100, n / max * 100)}%;background:${n >= 10 && n <= 20 ? 'var(--accent)' : n ? 'var(--accent-2)' : 'transparent'}"></i></div>
        <div class="vscale"><span>0</span><span>建議 10–20 組</span><span>${max}</span></div>
        <div class="vfoot"><span>上週 <b>${lw}</b> 組</span><span>四週平均 <b>${fw(Math.round(avg4 * 10) / 10)}</b> 組</span></div>
      </div>`;
    }).join('') + '<p class="muted" style="font-size:12.5px;padding:0 2px">只算打勾完成的組，依動作所屬部位計算。10–20 組是增肌常見的每週建議範圍，只是參考。</p>';
  } else {
    const t = today(), mon = t.slice(0, 7), pm = prevMonth(t);
    const mc = realWorkouts().filter(w => w.date.startsWith(mon)).length, pc = realWorkouts().filter(w => w.date.startsWith(pm) && +w.date.slice(8) <= +t.slice(8)).length;
    const from28 = addDays(t, -27);
    const freq = MAIN.concat(['arms', 'core']).map(p => ({ p, n: realWorkouts().filter(w => w.date >= from28 && (w.part === p || w.ex.some(e => exOf(e.id).p === p))).length / 4 }));
    const { pts, avg } = bwSeries();
    body = `<section class="card" style="padding:14px 12px 8px"><div class="sec-h" style="padding:0 4px 6px"><h2>每週訓練次數</h2><span>本月 ${mc} 次 · 上月同期 ${pc} 次</span></div>${attendanceChart()}</section>
      <section class="card" style="padding:16px;display:flex;flex-direction:column;gap:10px"><div class="sec-h" style="padding:0"><h2>各部位一週練幾次</h2><span>最近 4 週平均</span></div>
        ${freq.map(f => `<div class="frow"><span>${PARTS[f.p]}</span><span class="vtrack" style="height:8px"><i style="width:${Math.min(100, f.n / 3 * 100)}%;background:var(--accent)"></i></span><span class="num" style="text-align:right;font-size:17px">${fw(Math.round(f.n * 10) / 10)}<span class="muted" style="font-size:12px;font-weight:600"> 次</span></span></div>`).join('')}
      </section>
      ${insightsHTML()}
      <section class="sec"><div class="sec-h"><h2>體重</h2><button class="lk" data-act="bw">記錄</button></div>
        <div class="card" style="padding:12px 12px 6px">${pts.length ? lineChart(pts, { avg, label: '體重趨勢', fmt: v => v.toFixed(1) + ' kg' }) : `<div class="empty"><p>還沒有體重紀錄。單日體重會因為水分和飲食上下跳，記幾天之後看平均線比較準。</p><button class="btn" data-act="bw">記錄體重</button></div>`}</div></section>`;
  }
  return `<div class="glow"></div><div class="page">
    <header class="head"><div><div class="eyebrow">進步</div><h1>有沒有變強</h1></div></header>
    <div class="seg" role="group" aria-label="切換">${tabs.map(([k, n]) => `<button data-act="ptab" data-v="${k}" aria-pressed="${ui.pTab === k}">${n}</button>`).join('')}</div>
    ${body}
    <div class="sync ${store.mode}"><i></i>${store.mode === 'cloud' ? '紀錄已同步到你的 Claude 帳號' : '紀錄目前存在這台裝置的瀏覽器'}</div>
  </div>`;
}
function insightsHTML() {
  const groups = {};
  for (const w of realWorkouts()) {
    const st = w.state; if (!st || (!st.mood && !(st.tags || []).length)) continue;
    const e = w.ex.find(x => prevSessions(x.id, w).length); if (!e) continue;
    const ex = exOf(e.id), prev = prevSessions(e.id, w), pb = prev[prev.length - 1].best;
    const now = Math.max(...e.sets.map(s => e1(s, ex)));
    const labels = [...(st.tags || []), ...(st.mood === 'tired' ? ['很累'] : st.mood === 'good' ? ['狀態很好'] : [])];
    for (const l of labels) { const g = groups[l] = groups[l] || { n: 0, down: 0, up: 0 }; g.n++; if (now < pb * .99) g.down++; if (now > pb * 1.01) g.up++; }
  }
  const items = Object.entries(groups).filter(([, g]) => g.n >= 2).sort((a, b) => b[1].n - a[1].n);
  return `<section class="sec"><div class="sec-h"><h2>狀態和表現</h2><span>開始訓練時選的狀態</span></div>
    ${items.length ? items.map(([l, g]) => `<div class="card insight"><span class="sq-ic">${ic(g.down > g.up ? 'moon' : 'trend')}</span><div><p>標記「${l}」的 ${g.n} 次訓練，${g.down ? `有 ${g.down} 次主項表現比上次差` : g.up ? `有 ${g.up} 次主項比上次進步` : '主項表現大致持平'}</p><small>主項是當天第一個有歷史紀錄的動作，用估算 1RM 比較</small></div></div>`).join('')
      : `<div class="card insight"><span class="sq-ic">${ic('moon')}</span><div><p>還沒有足夠的資料</p><small>開始訓練時選「今天狀態」（例如很累、睡眠差）。同一個狀態累積 2 次以上，這裡會告訴你狀態和表現有沒有關係。</small></div></div>`}
  </section>`;
}

/* ---------- exercise page ---------- */
let expId = null;
const layerStack = [];
function pushLayer(x) { layerStack.push(x); if (x.t === 'ex') ui.exMetric = 'w'; $('#exp').hidden = false; document.body.style.overflow = 'hidden'; renderLayer(); $('#exp .layer-scroll')?.scrollTo(0, 0); }
function popLayer() { layerStack.pop(); if (!layerStack.length) { expId = null; $('#exp').hidden = true; $('#exp').innerHTML = ''; if (!cur) document.body.style.overflow = ''; } else renderLayer(); }
function renderLayer() { const top = layerStack[layerStack.length - 1]; if (!top) return; if (top.t === 'ex') { expId = top.id; renderExPage(); } else renderGroupPage(top.g); }
const openExPage = id => pushLayer({ t: 'ex', id });
const closeExPage = () => popLayer();
function spark(vals) {
  const w = 84, h = 30, p = 4, mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
  const x = i => vals.length === 1 ? w - p : p + (w - 2 * p) * i / (vals.length - 1), y = v => h - p - (v - mn) / rg * (h - 2 * p);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true">${vals.length > 1 ? `<polyline class="line" points="${vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}"/>` : ''}<circle class="dot" cx="${x(vals.length - 1).toFixed(1)}" cy="${y(vals[vals.length - 1]).toFixed(1)}" r="3"/></svg>`;
}
const weekSetsOf = g => { const wk = weekStart(today()); return realWorkouts().filter(w => w.date >= wk).reduce((a, w) => a + w.ex.filter(e => exOf(e.id).p === g).reduce((b, e) => b + e.sets.length, 0), 0); };
function renderGroups() {
  return `<div class="glow"></div><div class="page">
    <header class="head"><div><div class="eyebrow">肌群</div><h1>各部位狀態</h1></div></header>
    ${FOCUSABLE.map(g => {
      const r = groupRec(g), rk = rankOf(g), n = weekSetsOf(g);
      return `<button class="card gcard" data-act="group" data-g="${g}">${groupPair(g)}<span style="min-width:0"><b class="gn">${PARTS[g]}</b><ul class="mus">${GROUP_MUSCLES[g].slice(0, 4).map(m => `<li class="p">${MUSCLE_NAME[m]}</li>`).join('')}</ul>
        <span class="gstats"><span style="color:${recColor(r)};font-weight:700">${recWord(r)} ${r}%</span><span>本週 <b>${n}</b> 組</span>${rk ? `<span style="display:inline-flex;align-items:center;gap:4px">${gem(rk.t, 18)}<b style="color:${tierColor(rk.t)}">${rk.t >= 0 ? TIERS[rk.t].n : '起步'}</b></span>` : ''}</span></span><span class="chev">${ic('right')}</span></button>`;
    }).join('')}
    <p class="muted" style="font-size:12.5px;padding:0 2px">恢復度依每塊肌肉上次練的時間和組數估算（大約 2–4 天恢復），只是參考。</p>
  </div>`;
}
function renderGroupPage(g) {
  const r = groupRec(g), rk = rankOf(g), n = weekSetsOf(g), ms = new Set(GROUP_MUSCLES[g]), col = recColor(r);
  const done = [...new Set(doneWorkouts().flatMap(w => w.ex.map(e => e.id)))].filter(id => exOf(id).p === g);
  const others = allEx().filter(e => e.p === g && !done.includes(e.id));
  $('#exp').innerHTML = `
    <div class="layer-top"><button class="back" data-act="exp-close">${ic('left')}返回</button><div class="ttl"><b>${PARTS[g]}</b></div><span style="min-width:72px"></span></div>
    <div class="layer-scroll">
      <section class="card recov">
        <div class="recov-figs">${['anteriorData', 'posteriorData'].map(v => `<div class="fig">${bodySVG(v, m => ms.has(m) ? col : BASE(m))}</div>`).join('')}</div>
        <ul class="mus row" style="justify-content:center">${GROUP_MUSCLES[g].map(m => `<li class="p">${MUSCLE_NAME[m]}</li>`).join('')}</ul>
      </section>
      <div class="ex-tiles">
        <div><small>恢復度</small><b style="color:${col}">${r}<span>%</span></b><small>${recWord(r)}</small></div>
        <div><small>本週</small><b>${n}<span>組</span></b><small>建議 10–20</small></div>
        <div><small>等級</small>${rk ? `<b style="display:flex;align-items:center;gap:6px;color:${tierColor(rk.t)}">${gem(rk.t, 22)}${rk.t >= 0 ? TIERS[rk.t].n : '起步'}</b>` : '<b class="muted">—</b>'}<small>${rk ? esc(exOf(rk.id).n) : '還沒評級'}</small></div>
      </div>
      <section class="sec"><div class="sec-h"><h2>練過的動作</h2><span>${done.length} 個</span></div>
        <div class="card">${done.length ? done.map(id => { const ex = exOf(id), ss = sessionsOf(id), last = ss[ss.length - 1], wtd = last.topW > 0 && ex.unit !== 'sec';
          return `<button class="exrow" data-act="ex" data-id="${id}">${exThumb(id)}<span><b>${esc(ex.n)}</b><small>最近 ${wtd ? `${fw(last.topW)} kg × ${last.topR}` : `${last.topR} ${ex.unit === 'sec' ? '秒' : '下'}`} · ${last.seed ? '起始紀錄' : md(last.date)}</small></span>${spark(ss.slice(-10).map(x => wtd ? x.topW : x.topR))}</button>`; }).join('') : `<div class="empty"><p>還沒練過${PARTS[g]}的動作。</p></div>`}</div>
      </section>
      <section class="sec"><div class="sec-h"><h2>其他動作</h2><span>可在訓練中加入</span></div>
        <div class="card">${others.map(e => `<div class="exrow">${exThumb(e.id)}<span><b>${esc(e.n)}</b><small>${EQUIP[e.e]} · ${muscleNames(e.id).p.join('、')}</small></span><span></span></div>`).join('')}</div>
      </section>
    </div>`;
}
function renderExPage() {
  const ex = exOf(expId), ss = sessionsOf(expId);
  if (!ss.length) { closeExPage(); return; }
  const weighted = ss.some(s => s.topW > 0) && ex.unit !== 'sec';
  const all = ss.flatMap(s => s.sets);
  const bestSet = all.reduce((a, s) => e1(s, ex) > e1(a, ex) ? s : a, all[0]);
  const maxW = Math.max(...all.map(s => s.w || 0)), maxVol = Math.max(...ss.map(s => s.vol));
  const metrics = weighted ? [['w', '重量'], ['r', '次數'], ['v', '總量']] : [['r', '次數']];
  if (!metrics.some(([k]) => k === ui.exMetric)) ui.exMetric = metrics[0][0];
  const val = s => ui.exMetric === 'w' ? s.topW : ui.exMetric === 'r' ? s.topR : Math.round(s.vol);
  const unit = ui.exMetric === 'r' ? (ex.unit === 'sec' ? '秒' : '下') : 'kg';
  const pts = ss.map(s => ({ date: s.date, v: val(s) }));
  const first = pts[0].v, lastV = pts[pts.length - 1].v;
  const pctUp = first > 0 && pts.length > 1 ? Math.round((lastV - first) / first * 100) : null;
  const recent = [...ss].reverse().slice(0, 12);
  const { p, s } = musclesOf(expId);
  const r = Object.keys(RANKDEF).map(g => [g, RANKDEF[g].some(([id]) => id === expId) ? rankOf(g) : null]).find(([, x]) => x && x.id === expId);
  $('#exp').innerHTML = `
    <div class="layer-top"><button class="back" data-act="exp-close">${ic('left')}返回</button><div class="ttl"></div><span style="min-width:72px"></span></div>
    <div class="layer-scroll">
      <div class="ex-hero">${figThumb(p, s, 'thumb lg')}<div><h2>${esc(ex.n)}</h2><p>${PARTS[ex.p]} · ${EQUIP[ex.e]} · ${ss.length} 次紀錄</p>
        <div class="mus">${p.map(m => `<span class="chip acc">${MUSCLE_NAME[m] || m}</span>`).join('')}${s.map(m => `<span class="chip">${MUSCLE_NAME[m] || m}</span>`).join('')}</div>
        ${r ? `<div style="display:flex;align-items:center;gap:8px;margin-top:10px">${gem(r[1].t, 28)}<span style="font-weight:750;color:${tierColor(r[1].t)}">${r[1].t >= 0 ? TIERS[r[1].t].n : '起步'}等級</span></div>` : ''}
      </div></div>
      <div class="card" style="padding:16px 12px 8px;display:flex;flex-direction:column;gap:10px">
        ${metrics.length > 1 ? `<div class="seg" style="background:var(--bg)">${metrics.map(([k, n]) => `<button data-act="exm" data-v="${k}" aria-pressed="${ui.exMetric === k}">${n}</button>`).join('')}</div>` : ''}
        <div class="statline" style="padding:0 4px"><span class="num">${fw(lastV)} <span class="muted" style="font-size:15px;font-weight:600">${unit}</span></span>${pctUp != null ? `<span class="delta ${pctUp > 0 ? 'up' : pctUp < 0 ? 'down' : 'flat'}">${pctUp > 0 ? '↑ ' : ''}${pctUp}%</span>` : ''}<span class="muted" style="font-size:12.5px">${ss[0].seed ? '起始' : md(ss[0].date)} – ${md(ss[ss.length - 1].date)}</span></div>
        ${lineChart(pts, { prs: true, ends: true, label: `${ex.n}的變化`, fmt: v => `${fw(v)}${unit === 'kg' ? 'kg' : ''}` })}
        <p class="muted" style="font-size:12px;padding:0 4px">${ui.exMetric === 'w' ? '每次的最重一組。金色點是破紀錄的那一次。' : ui.exMetric === 'r' ? '每次最重那組做了幾下。' : '每次所有組的重量 × 次數加總。'}</p>
      </div>
      <section class="sec"><div class="sec-h"><h2>${ic('trophy').replace('class="i"', 'class="i" style="color:var(--gold);vertical-align:-3px"')} 個人紀錄</h2></div>
        <div class="card" style="padding:2px 16px"><div class="recs">
          <div><span>最佳單組</span><b>${setTxt(bestSet, ex)}</b></div>
          ${weighted ? `<div><span>估算 1RM</span><b>${Math.round(e1(bestSet, ex))} kg</b></div><div><span>最重</span><b>${fw(maxW)} kg</b></div><div><span>單次最高總量</span><b>${Math.round(maxVol).toLocaleString()} kg</b></div>` : `<div><span>總次數</span><b>${all.reduce((a, x) => a + x.r, 0)}</b></div>`}
        </div></div>
      </section>
      <section class="sec"><div class="sec-h"><h2>最近紀錄</h2><span>綠底線＝輕鬆、紅底線＝很硬</span></div>
        <div class="card" style="padding:4px 16px"><div class="hist">${recent.map(x => {
          const w = store.workouts[x.wid], pr = exercisePRs({ id: expId, sets: x.sets.map(y => ({ ...y, done: true })) }, w);
          return `<div><span class="d"><span>${x.seed ? '起始紀錄' : `${md(x.date)}（${dow(x.date)}）`}</span>${pr.best ? `<span class="chip gold">${pr.best.label}</span>` : ''}</span><div class="setchips">${x.sets.map((y, i) => `<span class="sc${pr.flags[i] ? ' pr' : y.f ? ' f-' + y.f : ''}">${setTxt(y, ex)}</span>`).join('')}</div></div>`;
        }).join('')}</div></div>
      </section>
    </div>`;
}

function render() {
  const fn = { home: renderHome, hist: renderHist, groups: renderGroups, prog: renderProg }[ui.tab];
  $('#app').innerHTML = fn();
  $$('.tab').forEach(b => b.setAttribute('aria-current', b.dataset.tab === ui.tab ? 'page' : 'false'));
  if (layerStack.length) renderLayer();
}

/* ---------- events ---------- */
function disarm(act) {
  if (!armed || act === 'rm-ex' || act === 'discard' || act === 'tpl-del') return;
  const was = armed; armed = null;
  if (cur && was.startsWith('rm-')) rerenderExc(was.slice(3));
  else if (cur && was === 'discard') renderWorkout();
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) { if (e.target.id === 'sheet') { closeSheet(); armed = null; } return; }
  const act = el.dataset.act;
  disarm(act);
  switch (act) {
    case 'tab': ui.tab = el.dataset.tab; ui.armDel = null; render(); window.scrollTo(0, 0); break;
    case 'focus': ui.focus = el.dataset.p; render(); break;
    case 'free': openFree(); break;
    case 'goto-volume': ui.tab = 'prog'; ui.pTab = 'volume'; render(); window.scrollTo(0, 0); break;
    case 'start': {
      const p = el.dataset.p, a = activeWorkout();
      if (a) { if (a.part === p) { closeSheet(); openWorkout(a); } else openSwitch(p); }
      else openStart(p);
      break;
    }
    case 'st-mood': startSt.mood = startSt.mood === el.dataset.v ? null : el.dataset.v; renderStart(); break;
    case 'st-tag': { const v = el.dataset.v, t = startSt.tags; startSt.tags = t.includes(v) ? t.filter(x => x !== v) : [...t, v]; renderStart(); break; }
    case 'st-choice': startSt.choice = el.dataset.v; renderStart(); break;
    case 'st-manage': startSt.manage = !startSt.manage; armed = null; renderStart(); break;
    case 'tpl-del': {
      const id = el.dataset.id;
      if (armed !== 'tpl-' + id) { armed = 'tpl-' + id; renderStart(); break; }
      armed = null;
      store.profile = { ...store.profile, templates: store.profile.templates.filter(t => t.id !== id) }; saveProfile();
      if (startSt.choice === id) startSt.choice = 'blank';
      if (!store.profile.templates.some(t => t.part === startSt.part)) startSt.manage = false;
      renderStart(); toast('模板已刪除'); break;
    }
    case 'st-go': { const s = startSt; closeSheet(); startWorkout(s.part, s.choice, s.mood || s.tags.length ? { mood: s.mood, tags: s.tags } : null); break; }
    case 'resume': { const a = activeWorkout(); closeSheet(); if (a) openWorkout(a); break; }
    case 'finish-other': {
      const a = activeWorkout(); closeSheet();
      if (a) { cur = a; if (!finishWorkout(true)) { delete store.workouts[a.id]; removeDoc('w-' + a.id); cur = null; } }
      if (pending) openStart(pending);
      break;
    }
    case 'wo-hide': closeWorkout(); break;
    case 'group': pushLayer({ t: 'group', g: el.dataset.g }); break;
    case 'pad': openPad(el.dataset.k, +el.dataset.i, el.dataset.f); break;
    case 'pad-close': closePad(); break;
    case 'pad-field': if (kp) moveTo(kp.i, el.dataset.f); break;
    case 'pk': if (kp) padKey(el.dataset.v); break;
    case 'pad-step': {
      if (!kp) break;
      const e = padEx(), s = e.sets[kp.i], last = lastSession(e.id, cur);
      const base = s[kp.f] ?? (last?.sets[kp.i] || {})[kp.f] ?? 0;
      kp.fresh = true; setPadVal(Math.max(0, base + Number(el.dataset.v)));
      break;
    }
    case 'pad-same': {
      if (!kp) break;
      const e = padEx(), s = e.sets[kp.i], src = e.sets[kp.i - 1] || lastSession(e.id, cur)?.sets[kp.i];
      if (src) { s.w = src.w ?? null; s.r = src.r ?? null; kp.fresh = true; saveWorkout(cur, 900); rerenderExc(kp.k); renderPad(); }
      break;
    }
    case 'pad-next': {
      if (!kp) break;
      const e = padEx();
      if (kp.f === 'w') moveTo(kp.i, 'r'); else if (kp.i < e.sets.length - 1) moveTo(kp.i + 1, 'w'); else closePad();
      break;
    }
    case 'pad-done': if (kp) padDone(); break;
    case 'jump': $(`#exc-${el.dataset.k}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
    case 'done': {
      const ex = cur.ex.find(x => x.k === el.dataset.k), i = +el.dataset.i, s = ex?.sets[i];
      if (!s) break;
      if (!s.done && !(s.r > 0)) { toast('先填次數再打勾'); $(`#r-${ex.k}-${i}`)?.focus(); break; }
      s.done = !s.done; if (!s.done) delete s.f;
      saveWorkout(cur, 900); rerenderExc(ex.k);
      if (s.done) { const pr = exercisePRs(ex, cur).flags[i]; if (pr) toast(`${pr.label}！${exOf(ex.id).n} ${pr.text}`); }
      break;
    }
    case 'feel': {
      const ex = cur.ex.find(x => x.k === el.dataset.k), s = ex?.sets[+el.dataset.i]; if (!s) break;
      if (s.f === el.dataset.v) delete s.f; else s.f = el.dataset.v;
      saveWorkout(cur, 900); rerenderExc(ex.k); break;
    }
    case 'add-set': {
      const ex = cur.ex.find(x => x.k === el.dataset.k); if (!ex) break;
      const last = ex.sets[ex.sets.length - 1];
      ex.sets.push({ w: last ? last.w : null, r: last ? last.r : null, done: false });
      saveWorkout(cur, 900); rerenderExc(ex.k); break;
    }
    case 'rm-set': { const ex = cur.ex.find(x => x.k === el.dataset.k); if (!ex || !ex.sets.length) break; if (kp && kp.k === ex.k) closePad(); ex.sets.pop(); saveWorkout(cur, 900); rerenderExc(ex.k); break; }
    case 'menu': { const k = el.dataset.k, was = menuK; menuK = menuK === k ? null : k; if (was && was !== k) rerenderExc(was); rerenderExc(k); break; }
    case 'move': {
      const i = cur.ex.findIndex(x => x.k === el.dataset.k), j = i + (+el.dataset.d);
      if (i < 0 || j < 0 || j >= cur.ex.length) break;
      [cur.ex[i], cur.ex[j]] = [cur.ex[j], cur.ex[i]]; saveWorkout(cur, 600); renderWorkout();
      $(`#exc-${el.dataset.k}`)?.scrollIntoView({ block: 'center' });
      break;
    }
    case 'rm-ex': {
      const k = el.dataset.k, key = 'rm-' + k;
      if (armed !== key) { armed = key; rerenderExc(k); break; }
      armed = null; menuK = null; cur.ex = cur.ex.filter(x => x.k !== k); saveWorkout(cur); renderWorkout(); break;
    }
    case 'swap': { closePad(); const ex = cur.ex.find(x => x.k === el.dataset.k); openLib('swap', el.dataset.k, exOf(ex.id).p); break; }
    case 'add-ex': closePad(); openLib('add', null, cur.ex.length ? exOf(cur.ex[cur.ex.length - 1].id).p : (PARTS[cur.part] ? cur.part : 'chest')); break;
    case 'lib-tab': { lib.tab = el.dataset.p; lib.q = ''; const qi = $('#lib-q'); if (qi) qi.value = ''; renderLibList(); break; }
    case 'pick': pickExercise(el.dataset.id); break;
    case 'custom': lib.custom = true; renderLibList(); setTimeout(() => $('#c-name')?.focus(), 50); break;
    case 'note': openNote(el.dataset.id); break;
    case 'discard': {
      if (armed !== 'discard') { armed = 'discard'; renderWorkout(); break; }
      const id = cur.id; armed = null; delete store.workouts[id]; removeDoc('w-' + id); closeWorkout(); toast('已放棄這次訓練'); break;
    }
    case 'finish': closePad(); finishWorkout(); break;
    case 'save-tpl': {
      const w = store.workouts[el.dataset.w]; if (!w) break;
      const used = new Set(store.profile.templates.filter(t => t.part === w.part).map(t => t.name));
      const base = ALLPARTS[w.part];
      let name = ''; for (const L of 'ABCDEFGHIJ') { if (!used.has(`${base} ${L}`)) { name = `${base} ${L}`; break; } }
      const tpl = { id: 't-' + rid(), part: w.part, name: name || `${base} ${used.size + 1}`, ex: w.ex.map(e => e.id) };
      store.profile = { ...store.profile, templates: [...store.profile.templates, tpl], lastTpl: { ...store.profile.lastTpl, [w.part]: tpl.id } };
      w.tpl = tpl.id; saveWorkout(w); saveProfile();
      el.outerHTML = `<div class="chip acc" style="align-self:center;padding:8px 14px">已存成「${esc(tpl.name)}」，下次開始時可以直接選</div>`;
      break;
    }
    case 'sheet-close': closeSheet(); armed = null; break;
    case 'bw': openBw(); break;
    case 'seed': {
      const d = today(), now = Date.now();
      const mk = (part, exId, sets, n) => ({ id: rid(), date: d, part, seed: true, status: 'done', startedAt: now - 60000 * n, endedAt: now - 60000 * n, updatedAt: now, ex: [{ k: rid(), id: exId, sets }] });
      saveWorkout(mk('chest', 'bench', [{ w: 60, r: 8 }, { w: 60, r: 8 }, { w: 55, r: 10 }, { w: 55, r: 10 }], 2));
      saveWorkout(mk('legs', 'squat', [{ w: 90, r: 10 }, { w: 90, r: 10 }, { w: 100, r: 10 }, { w: 100, r: 10 }], 1));
      render(); toast('起始紀錄已放入');
      break;
    }
    case 'day': ui.calDay = el.dataset.d; ui.armDel = null; render(); break;
    case 'cal': { const [y, mo] = ui.calMonth.split('-').map(Number); ui.calMonth = ymd(new Date(y, mo - 1 + (+el.dataset.d), 1)).slice(0, 7); render(); break; }
    case 'del-w': {
      const id = el.dataset.id, key = 'del-' + id;
      if (ui.armDel !== key) { ui.armDel = key; render(); break; }
      delete store.workouts[id]; removeDoc('w-' + id); ui.armDel = null; render(); toast('已刪除');
      break;
    }
    case 'ptab': ui.pTab = el.dataset.v; render(); break;
    case 'ppart': ui.pPart = el.dataset.p; render(); break;
    case 'ex': closeSheet(); if (sessionsOf(el.dataset.id).length) openExPage(el.dataset.id); break;
    case 'exm': ui.exMetric = el.dataset.v; renderExPage(); break;
    case 'exp-close': closeExPage(); break;
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'lib-q') { lib.q = t.value; renderLibList(); return; }
  if (cur && t.dataset.f) {
    const ex = cur.ex.find(x => x.k === t.dataset.k), s = ex?.sets[+t.dataset.i];
    if (!s) return;
    const v = t.value === '' ? null : Number(t.value);
    s[t.dataset.f] = v == null || isNaN(v) ? null : (t.dataset.f === 'r' ? Math.round(v) : v);
    saveWorkout(cur, 1200);
  }
});
document.addEventListener('focusin', e => { if (cur && e.target.dataset?.f) { e.target.dataset.old = e.target.value; try { e.target.select(); } catch {} } });
document.addEventListener('change', e => {
  const t = e.target;
  if (!(cur && t.dataset.f)) return;
  // Changing one set also updates the later, unfinished sets that still had the old value.
  const ex = cur.ex.find(x => x.k === t.dataset.k); if (!ex) return;
  const i = +t.dataset.i, f = t.dataset.f, old = t.dataset.old === '' || t.dataset.old == null ? null : Number(t.dataset.old), nv = ex.sets[i][f];
  for (let j = i + 1; j < ex.sets.length; j++) { const s = ex.sets[j]; if (!s.done && s[f] === old) s[f] = nv; }
  saveWorkout(cur, 1200); rerenderExc(ex.k);
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'note-form') {
    const id = f.dataset.id, v = $('#note-text').value.trim();
    const notes = { ...(store.profile.notes || {}) };
    if (v) notes[id] = v; else delete notes[id];
    store.profile = { ...store.profile, notes }; saveProfile();
    closeSheet(); if (cur) renderWorkout(); toast(v ? '備註已儲存' : '已清除備註');
  } else if (f.id === 'bw-form') {
    const d = $('#bw-date').value || today(), v = Math.round(+$('#bw-val').value * 10) / 10;
    if (!(v >= 30 && v <= 250)) { toast('請輸入 30–250 之間的體重'); return; }
    store.bw = { entries: { ...(store.bw.entries || {}), [d]: v } }; saveBw();
    closeSheet(); render(); toast('體重已記錄');
  } else if (f.id === 'custom-form') {
    const n = $('#c-name').value.trim(); if (!n) return;
    const c = { id: 'c-' + rid(), n, p: $('#c-part').value, e: $('#c-eq').value };
    store.profile = { ...store.profile, customEx: [...(store.profile.customEx || []), c] }; saveProfile();
    pickExercise(c.id); toast('已新增自訂動作');
  }
});

render();
initCloud();
})();
