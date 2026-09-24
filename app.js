/* ===== util ===== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem('cx_' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('cx_' + k, JSON.stringify(v)); } catch {} }
};
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/* ===== navegação ===== */
function show(id) {
  if (!document.getElementById(id) || !document.getElementById(id).classList.contains('page')) id = 'home';
  $$('.page').forEach(p => p.classList.toggle('show', p.id === id));
  $$('nav a').forEach(a => a.classList.toggle('active', a.dataset.p === id));
  $('#nav').classList.remove('open');
  window.scrollTo(0, 0);
  if (id === 'home') renderHome();
  if (id === 'crescimento') renderGrowth();
}
window.addEventListener('hashchange', () => show(location.hash.slice(1) || 'home'));
$('#menuBtn').onclick = () => $('#nav').classList.toggle('open');

/* ===== progresso ===== */
const quizStats = () => store.get('quiz', { right: 0, total: 0, wrong: [] });
const dissMarks = () => store.get('diss', {});
function renderHome() {
  const qs = quizStats(), dm = dissMarks();
  const done = Object.values(dm).filter(v => v === 'ok').length;
  const rev = Object.values(dm).filter(v => v === 'rev').length;
  $('#homeStats').innerHTML = `
    <div class="stat"><b>${qs.total ? Math.round(100 * qs.right / qs.total) + '%' : '—'}</b>acertos no quiz (${qs.right}/${qs.total})</div>
    <div class="stat"><b>${qs.wrong.length}</b>questões para refazer</div>
    <div class="stat"><b>${done}/${OPEN.length}</b>da lista G1 dominadas</div>
    <div class="stat"><b>${rev}</b>marcadas para revisar</div>`;
}

/* ===== QUIZ ===== */
let deck = [], qi = 0, qRight = 0, answered = false;
$('#quizStart').onclick = () => {
  const topic = $('#quizTopic').value, n = +$('#quizCount').value;
  let pool = MCQ.map((q, i) => ({ ...q, id: i }));
  if (topic === 'erradas') { const w = quizStats().wrong; pool = pool.filter(q => w.includes(q.id)); }
  else if (topic !== 'all') pool = pool.filter(q => q.t === topic);
  if (!pool.length) { $('#quizArea').innerHTML = '<div class="card ok">Nenhuma questão nesse filtro 🎉</div>'; return; }
  deck = shuffle(pool).slice(0, n); qi = 0; qRight = 0;
  renderQ();
};
function renderQ() {
  if (qi >= deck.length) return endQuiz();
  answered = false;
  const q = deck[qi];
  const opts = shuffle(q.o.map((t, i) => ({ t, ok: i === q.a })));
  $('#quizArea').innerHTML = `
    <div class="bar"><i style="width:${100 * qi / deck.length}%"></i></div>
    <div class="card">
      <span class="pill">${qi + 1} / ${deck.length}</span><span class="pill">${q.t}</span>
      <p style="font-size:1.1rem;margin:12px 0">${q.q}</p>
      <div id="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}">${o.t}</button>`).join('')}</div>
      <div id="qExp"></div>
    </div>`;
  $$('#opts .opt').forEach(b => b.onclick = () => {
    if (answered) return; answered = true;
    const o = opts[+b.dataset.i];
    b.classList.add(o.ok ? 'right' : 'wrong');
    $$('#opts .opt').forEach((x, i) => { if (opts[i].ok) x.classList.add('right'); });
    const s = quizStats();
    s.total++;
    if (o.ok) { qRight++; s.right++; s.wrong = s.wrong.filter(id => id !== q.id); }
    else if (!s.wrong.includes(q.id)) s.wrong.push(q.id);
    store.set('quiz', s);
    $('#qExp').innerHTML = `<div class="expl"><b>${o.ok ? '✅ Correto!' : '❌ Não foi dessa vez.'}</b><br>${q.e}</div>
      <div class="row"><button id="qNext">${qi + 1 < deck.length ? 'Próxima →' : 'Ver resultado'}</button></div>`;
    $('#qNext').onclick = () => { qi++; renderQ(); };
  });
}
function endQuiz() {
  const pct = Math.round(100 * qRight / deck.length);
  $('#quizArea').innerHTML = `<div class="card ${pct >= 70 ? 'ok' : 'tip'}">
    <h3 style="margin-top:0">Resultado: ${qRight} / ${deck.length} (${pct}%)</h3>
    <p>${pct >= 90 ? 'Excelente! 🚀' : pct >= 70 ? 'Bom caminho! Revise as que errou.' : 'Vale reler a teoria e tentar de novo.'}</p>
    <button onclick="$('#quizTopic').value='erradas';$('#quizStart').click()">Refazer as que errei</button></div>`;
}

/* ===== DISSERTATIVAS ===== */
function renderDiss() {
  const marks = dissMarks(), notes = store.get('notes', {});
  $('#dissList').innerHTML = OPEN.map((o, i) => `
    <details class="q" data-i="${i}">
      <summary><span>${i + 1})</span><span>${o.q.split('<')[0].replace(/&nbsp;/g, ' ')}</span>
        <span class="mark ${marks[i] === 'ok' ? 'done' : marks[i] === 'rev' ? 'review' : ''}">${marks[i] === 'ok' ? '✔ dominada' : marks[i] === 'rev' ? '↻ revisar' : ''}</span></summary>
      <div class="body">
        <div>${o.q.includes('<') ? o.q : ''}</div>
        <textarea placeholder="Escreva sua resposta aqui antes de ver o gabarito…" data-n="${i}">${(notes[i] || '').replace(/</g, '&lt;')}</textarea>
        <div class="row"><button class="ghost" data-show="${i}">Ver resposta-modelo</button></div>
        <div class="model card ok" id="model${i}">${o.a}
          <div class="row"><button data-ok="${i}">✔ Acertei</button><button class="ghost" data-rev="${i}">↻ Preciso revisar</button></div>
        </div>
      </div>
    </details>`).join('');
  $$('#dissList textarea').forEach(t => t.oninput = () => { const n = store.get('notes', {}); n[t.dataset.n] = t.value; store.set('notes', n); });
  $$('#dissList [data-show]').forEach(b => b.onclick = () => $('#model' + b.dataset.show).classList.toggle('show'));
  const mark = (i, v) => { const m = dissMarks(); m[i] = v; store.set('diss', m); renderDiss(); $(`#dissList details[data-i="${i}"]`).open = true; $('#model' + i).classList.add('show'); };
  $$('#dissList [data-ok]').forEach(b => b.onclick = () => mark(b.dataset.ok, 'ok'));
  $$('#dissList [data-rev]').forEach(b => b.onclick = () => mark(b.dataset.rev, 'rev'));
  const done = Object.values(marks).filter(v => v === 'ok').length;
  $('#dissBar').style.width = (100 * done / OPEN.length) + '%';
  $('#dissCount').textContent = `${done} de ${OPEN.length} dominadas`;
}

/* ===== MESTRE LAB ===== */
let ml = null, mlR = 0, mlT = 0;
const fmtExp = (e, lg) => {
  const base = e === 0 ? '' : e === 1 ? 'n' : `n^${Number.isInteger(e) ? e : e.toFixed(2)}`;
  return 'Θ(' + (lg ? (base ? base + ' log n' : 'log n') : (base || '1')) + ')';
};
function newMaster() {
  const b = rnd(2, 4);
  let a, d = rnd(0, 3);
  if (Math.random() < 0.3) a = Math.pow(b, d); else a = rnd(1, 9);
  const lg = Math.log(a) / Math.log(b), eq = Math.abs(lg - d) < 1e-9;
  const cas = eq ? 2 : lg > d ? 1 : 3;
  const lgs = Number.isInteger(+lg.toFixed(9)) ? String(Math.round(lg)) : lg.toFixed(2);
  const right = cas === 1 ? fmtExp(lg, false) : cas === 2 ? fmtExp(lg, true) : fmtExp(d, false);
  const texts = [...new Set([fmtExp(lg, false), fmtExp(lg, true), fmtExp(d, false), fmtExp(d, true)])];
  const opts = shuffle(texts.map(t => ({ t, ok: t === right })));
  const dTxt = d === 0 ? '1' : d === 1 ? 'n' : `n^${d}`;
  ml = { a, b, d, lg, cas, lgs, opts, dTxt };
  $('#mlProb').innerHTML = `T(n) = ${a === 1 ? '' : a}T(n/${b}) + ${dTxt}`;
  $('#mlOpts').innerHTML = opts.map((o, i) => `<button class="opt" data-i="${i}">${o.t}</button>`).join('');
  $('#mlExp').style.display = 'none';
  $$('#mlOpts .opt').forEach(btn => btn.onclick = () => {
    if ($('#mlExp').style.display === 'block') return;
    const o = opts[+btn.dataset.i];
    mlT++; if (o.ok) mlR++;
    btn.classList.add(o.ok ? 'right' : 'wrong');
    $$('#mlOpts .opt').forEach((x, i) => { if (opts[i].ok) x.classList.add('right'); });
    const cmp = ml.cas === 1 ? 'f(n) cresce <b>menos</b>' : ml.cas === 2 ? 'f(n) cresce <b>igual</b>' : 'f(n) cresce <b>mais</b>';
    $('#mlExp').style.display = 'block';
    $('#mlExp').innerHTML = `<b>${o.ok ? '✅ Certo!' : '❌ Errado.'}</b><br>
      a = ${ml.a}, b = ${ml.b} ⇒ n<sup>log<sub>${ml.b}</sub>${ml.a}</sup> = n<sup>${ml.lgs}</sup> (expoente ${ml.lg.toFixed(3)}).<br>
      f(n) = ${ml.dTxt} tem expoente ${ml.d}. Como ${ml.lg.toFixed(3)} ${ml.cas === 1 ? '&gt;' : ml.cas === 2 ? '=' : '&lt;'} ${ml.d}: ${cmp} que as folhas ⇒ <b>caso ${ml.cas}</b>.`;
    $('#mlScore').textContent = `Acertos: ${mlR}/${mlT}`;
  });
}
$('#mlNext').onclick = newMaster;

/* ===== CRESCIMENTO ===== */
function fmtCount(l10) { // l10 = log10 do valor
  if (l10 < 6) return Math.round(Math.pow(10, l10)).toLocaleString('pt-BR');
  const e = Math.floor(l10), m = Math.pow(10, l10 - e);
  return `≈ ${m.toFixed(1).replace('.', ',')}×10<sup>${e}</sup>`;
}
function fmtTime(l10) { // segundos em log10 (1e6 instr/s)
  const s = l10 - 6;
  if (s < 0) return '&lt; 1 s';
  const S = s < 300 ? Math.pow(10, s) : Infinity;
  const units = [[60, 's'], [3600, 'min'], [86400, 'h'], [86400 * 365, 'dias'], [Infinity, 'anos']];
  if (S < 60) return S.toFixed(S < 10 ? 1 : 0).replace('.', ',') + ' s';
  if (S < 3600) return Math.round(S / 60) + ' min';
  if (S < 86400) return Math.round(S / 3600) + ' h';
  if (S < 86400 * 365) return Math.round(S / 86400) + ' dias';
  const y = s - Math.log10(86400 * 365);
  return y < 6 ? Math.round(Math.pow(10, y)).toLocaleString('pt-BR') + ' anos' : `≈ 10<sup>${Math.round(y)}</sup> anos`;
}
function log10fact(n) {
  if (n < 2) return 0;
  if (n <= 5000) { let s = 0; for (let i = 2; i <= n; i++) s += Math.log10(i); return s; }
  return (n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n)) / Math.LN10;
}
function renderGrowth() {
  const n = Math.max(1, Math.floor(+$('#gN').value || 1));
  const L = Math.log10(n);
  const rows = [
    ['O(1)', 0], ['O(log n)', Math.log10(Math.max(1, Math.log2(n)))], ['O(n)', L],
    ['O(n log n)', L + Math.log10(Math.max(1, Math.log2(n)))], ['O(n²)', 2 * L], ['O(n³)', 3 * L],
    ['O(2ⁿ)', n * Math.log10(2)], ['O(n!)', log10fact(n)], ['O(nⁿ)', n * L]
  ];
  $('#gTable').innerHTML = `<tr><th>Ordem</th><th>Nº de instruções</th><th>Tempo (10⁹ instr/s)</th></tr>` +
    rows.map(r => `<tr><td>${r[0]}</td><td>${fmtCount(r[1])}</td><td>${fmtTime(r[1])}</td></tr>`).join('');
  drawGrowth();
}
$('#gN').oninput = renderGrowth;
function drawGrowth() {
  const c = $('#gCanvas'), g = c.getContext('2d');
  const cs = getComputedStyle(document.body);
  const ink = cs.color, line = cs.getPropertyValue('--line').trim();
  g.clearRect(0, 0, c.width, c.height);
  const P = 40, W = c.width - P - 10, H = c.height - P - 10, N = 12, YM = 150;
  g.strokeStyle = line; g.fillStyle = ink; g.font = '12px sans-serif'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(P, 10); g.lineTo(P, 10 + H); g.lineTo(P + W, 10 + H); g.stroke();
  for (let i = 0; i <= N; i += 2) g.fillText(i, P + W * i / N - 4, 10 + H + 16);
  for (let y = 0; y <= YM; y += 30) g.fillText(y, 8, 10 + H - H * y / YM + 4);
  const fs = [['log n', x => Math.log2(Math.max(x, 1)), '#22c55e'], ['n', x => x, '#0ea5e9'], ['n log n', x => x * Math.log2(Math.max(x, 1)), '#eab308'],
  ['n²', x => x * x, '#f97316'], ['2ⁿ', x => Math.pow(2, x), '#ef4444']];
  fs.forEach(([nm, f, col], k) => {
    g.strokeStyle = col; g.lineWidth = 2.5; g.beginPath();
    for (let i = 0; i <= 240; i++) {
      const x = N * i / 240, y = Math.min(f(x), YM * 1.2);
      const px = P + W * x / N, py = 10 + H - H * y / YM;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.stroke(); g.fillStyle = col; g.fillRect(P + 12 + k * 90, 16, 12, 12); g.fillStyle = ink; g.fillText(nm, P + 28 + k * 90, 27);
  });
}

/* ===== MERGE SORT VIZ ===== */
const parseList = s => s.split(/[\s,;]+/).filter(Boolean).map(Number).filter(x => !isNaN(x)).slice(0, 12);
let mFrames = [], mIdx = 0, mTimer = null;
function buildMerge(arr) {
  const boxes = new Map(), frames = [];
  let comps = 0;
  const key = (lo, hi) => lo + '-' + hi;
  const snap = (msg, hot) => frames.push({ msg, comps, hot, boxes: [...boxes.values()].map(b => ({ ...b, vals: [...b.vals] })) });
  boxes.set(key(0, arr.length - 1), { lo: 0, hi: arr.length - 1, d: 0, vals: arr.slice(), merged: arr.length === 1 });
  snap(`Lista original: [${arr.join(', ')}]. Vamos dividir até restarem sub-listas de 1 item.`);
  function rec(lo, hi, d) {
    if (lo >= hi) return;
    const q = Math.floor((lo + hi) / 2);
    boxes.set(key(lo, q), { lo, hi: q, d: d + 1, vals: arr.slice(lo, q + 1), merged: lo === q });
    boxes.set(key(q + 1, hi), { lo: q + 1, hi, d: d + 1, vals: arr.slice(q + 1, hi + 1), merged: q + 1 === hi });
    snap(`DIVISÃO: [${arr.slice(lo, hi + 1).join(', ')}] → [${arr.slice(lo, q + 1).join(', ')}] e [${arr.slice(q + 1, hi + 1).join(', ')}]`, key(lo, hi));
    rec(lo, q, d + 1); rec(q + 1, hi, d + 1);
    const L = boxes.get(key(lo, q)).vals, R = boxes.get(key(q + 1, hi)).vals, out = [];
    let i = 0, j = 0;
    while (i < L.length && j < R.length) { comps++; out.push(L[i] <= R[j] ? L[i++] : R[j++]); }
    while (i < L.length) out.push(L[i++]); while (j < R.length) out.push(R[j++]);
    const b = boxes.get(key(lo, hi)); b.vals = out; b.merged = true;
    snap(`CONQUISTA: intercala [${L.join(', ')}] e [${R.join(', ')}] → [${out.join(', ')}]  (comparações até agora: ${comps})`, key(lo, hi));
  }
  rec(0, arr.length - 1, 0);
  snap(`✅ Lista ordenada: [${boxes.get(key(0, arr.length - 1)).vals.join(', ')}]. Total de comparações: ${comps}.`);
  return frames;
}
function renderMerge() {
  const f = mFrames[mIdx];
  $('#mMsg').textContent = f.msg;
  $('#mInfo').textContent = `Passo ${mIdx + 1} / ${mFrames.length}`;
  const maxD = Math.max(...f.boxes.map(b => b.d));
  let html = '';
  for (let d = 0; d <= maxD; d++) {
    const row = f.boxes.filter(b => b.d === d).sort((x, y) => x.lo - y.lo);
    // esconde caixas já consumidas por uma caixa-pai fundida
    html += `<div class="vizrow">${row.map(b => {
      const hot = f.hot === b.lo + '-' + b.hi;
      return `<div class="box ${b.merged && b.vals.length > 1 ? 'merged' : ''} ${hot ? 'hot' : ''}">${b.vals.map(v => `<div class="cell ${b.merged && b.vals.length > 1 ? 'sorted' : ''}">${v}</div>`).join('')}</div>`;
    }).join('')}</div>`;
  }
  $('#mViz').innerHTML = html;
  $('#mPrev').disabled = mIdx === 0; $('#mNext').disabled = mIdx === mFrames.length - 1;
}
function loadMerge() { stopAuto('m'); const a = parseList($('#mInput').value); if (a.length < 2) { $('#mMsg').textContent = 'Digite pelo menos 2 números (máx. 12).'; return; } mFrames = buildMerge(a); mIdx = 0; renderMerge(); }
$('#mLoad').onclick = loadMerge;
$('#mRand').onclick = () => { $('#mInput').value = shuffle([...Array(8).keys()]).join(' '); loadMerge(); };
$('#mNext').onclick = () => { if (mIdx < mFrames.length - 1) { mIdx++; renderMerge(); } };
$('#mPrev').onclick = () => { if (mIdx > 0) { mIdx--; renderMerge(); } };
$('#mReset').onclick = () => { stopAuto('m'); mIdx = 0; renderMerge(); };
$('#mAuto').onclick = () => toggleAuto('m');

/* ===== HEAP SORT VIZ ===== */
let hFrames = [], hIdx = 0;
function buildHeap(input) {
  const v = input.slice(), N = v.length, frames = [];
  let size = N, sortedFrom = N; // índices >= sortedFrom estão finalizados
  const snap = (msg, hl = [], sw = []) => frames.push({ msg, arr: v.slice(), size, sortedFrom, hl, sw });
  snap('Vetor inicial. Fase 1: transformar em um max heap (pai ≥ filhos), do último nó interno até a raiz.');
  function sift(i, f) {
    snap(`criaHeap: ajustando o nó ${i} (valor ${v[i]}).`, [i]);
    while (true) {
      let j = 2 * i + 1;
      if (j > f) break;
      if (j < f) { snap(`Compara filhos: ${v[j]} (esq.) × ${v[j + 1]} (dir.) → maior é ${v[j] < v[j + 1] ? v[j + 1] : v[j]}.`, [i, j, j + 1]); if (v[j] < v[j + 1]) j++; }
      snap(`Compara pai ${v[i]} × maior filho ${v[j]}.`, [i, j]);
      if (v[i] < v[j]) { [v[i], v[j]] = [v[j], v[i]]; snap(`${v[i]} > ${v[j]}: troca pai e filho.`, [], [i, j]); i = j; }
      else { snap(`${v[i]} ≥ ${v[j]}: o nó já está no lugar certo.`, [i]); break; }
    }
  }
  for (let i = Math.floor((N - 1) / 2); i >= 0; i--) sift(i, N - 1);
  snap(`✅ Max heap pronto! O maior valor (${v[0]}) está no topo. Fase 2: ordenar.`, [0]);
  for (let i = N - 1; i >= 1; i--) {
    [v[0], v[i]] = [v[i], v[0]]; size = i; sortedFrom = i;
    snap(`Troca a raiz (maior) com a última folha: ${v[i]} vai para a posição ${i} (definitiva). O heap agora tem ${size} elementos.`, [], [0, i]);
    sift(0, i - 1);
  }
  sortedFrom = 0; size = 0;
  snap(`✅ Vetor ordenado: [${v.join(', ')}].`);
  return frames;
}
function renderHeap() {
  const f = hFrames[hIdx];
  $('#hMsg').textContent = f.msg;
  $('#hInfo').textContent = `Passo ${hIdx + 1} / ${hFrames.length}`;
  const cls = i => i >= f.sortedFrom ? 'sorted' : f.sw.includes(i) ? 'swap' : f.hl.includes(i) ? 'hl' : '';
  // árvore só dos elementos no heap
  let html = '', lvl = 0;
  for (let s = 0; s < f.size; s = 2 * s + 1, lvl++) {
    const e = Math.min(2 * s + 1, f.size);
    html += `<div class="lvl">${f.arr.slice(s, e).map((x, k) => { const i = s + k; return `<div class="n ${cls(i)}">${x}<small>${i}</small></div>`; }).join('')}</div>`;
  }
  $('#hTree').innerHTML = html || '<i style="color:var(--muted)">(heap vazio)</i>';
  $('#hArr').innerHTML = f.arr.map((x, i) => `<div class="cell ${cls(i)}">${x}</div>`).join('');
  $('#hPrev').disabled = hIdx === 0; $('#hNext').disabled = hIdx === hFrames.length - 1;
}
function loadHeap() { stopAuto('h'); const a = parseList($('#hInput').value); if (a.length < 2) { $('#hMsg').textContent = 'Digite pelo menos 2 números (máx. 12).'; return; } hFrames = buildHeap(a); hIdx = 0; renderHeap(); }
$('#hLoad').onclick = loadHeap;
$('#hRand').onclick = () => { $('#hInput').value = shuffle([...Array(8).keys()].map(x => x + 1)).join(' '); loadHeap(); };
$('#hNext').onclick = () => { if (hIdx < hFrames.length - 1) { hIdx++; renderHeap(); } };
$('#hPrev').onclick = () => { if (hIdx > 0) { hIdx--; renderHeap(); } };
$('#hReset').onclick = () => { stopAuto('h'); hIdx = 0; renderHeap(); };
$('#hAuto').onclick = () => toggleAuto('h');

/* auto-play */
const timers = {};
function stopAuto(k) { clearInterval(timers[k]); timers[k] = null; const b = $(`#${k}Auto`); if (b) b.textContent = '▶ Auto'; }
function toggleAuto(k) {
  if (timers[k]) return stopAuto(k);
  $(`#${k}Auto`).textContent = '⏸ Pausar';
  timers[k] = setInterval(() => {
    const next = $(`#${k}Next`);
    if (next.disabled) return stopAuto(k);
    next.click();
  }, 900);
}

/* ===== init ===== */
renderDiss(); newMaster(); loadMerge(); loadHeap();
show(location.hash.slice(1) || 'home');

/* ===== PROVA SIMULADA (método mestre) ===== */
let exQs = [], exAns = [], exTimer = null, exEnd = 0, exDone = false;
const exHist = () => store.get('exam', []);
function renderExHist() {
  const h = exHist();
  $('#exHist').innerHTML = h.length
    ? 'Últimas notas: ' + h.slice(-6).map(x => `<b>${x.score}/${x.total}</b>`).join(' · ') + ` — melhor: <b>${Math.max(...h.map(x => Math.round(100 * x.score / x.total)))}%</b>`
    : 'Nenhuma prova feita ainda.';
}
$('#exStart').onclick = () => {
  const n = +$('#exQ').value, mins = +$('#exT').value;
  const all = MCQ.filter(q => q.t === 'mestre');
  const calc = shuffle(all.filter(q => q.q.startsWith('Resolva')));
  const conc = shuffle(all.filter(q => !q.q.startsWith('Resolva')));
  const nc = Math.round(n * 0.75);
  exQs = shuffle([...calc.slice(0, nc), ...conc.slice(0, n - nc)]).map(q => {
    const opts = shuffle(q.o.map((t, i) => ({ t, ok: i === q.a })));
    return { ...q, opts };
  });
  exAns = exQs.map(() => -1); exDone = false;
  $('#examSetup').style.display = 'none';
  clearInterval(exTimer);
  if (mins) { exEnd = Date.now() + mins * 60000; exTimer = setInterval(tickEx, 500); } else exEnd = 0;
  renderExam();
};
function tickEx() {
  const left = Math.max(0, exEnd - Date.now());
  const el = $('#exClock');
  if (el) el.textContent = `${String(Math.floor(left / 60000)).padStart(2, '0')}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`;
  if (left <= 0 && !exDone) finishExam(true);
}
function renderExam() {
  $('#exArea').innerHTML = `
    <div class="card" style="position:sticky;top:0;z-index:5">
      <div class="row"><b>Prova — Método mestre</b><span style="margin-left:auto">⏱ <b id="exClock">${exEnd ? '' : '∞'}</b></span>
      <span id="exProg" style="color:var(--muted)"></span><button id="exFinish">Finalizar prova</button></div>
    </div>
    ${exQs.map((q, i) => `<div class="card"><span class="pill">Questão ${i + 1}</span>
      <p style="margin:10px 0">${q.q}</p>
      ${q.opts.map((o, j) => `<label class="opt" style="cursor:pointer"><input type="radio" name="ex${i}" value="${j}"> ${o.t}</label>`).join('')}
    </div>`).join('')}
    <button id="exFinish2">Finalizar prova</button>`;
  const upd = () => { $('#exProg').textContent = `${exAns.filter(x => x >= 0).length}/${exQs.length} respondidas`; };
  $$('#exArea input[type=radio]').forEach(r => r.onchange = () => { exAns[+r.name.slice(2)] = +r.value; upd(); });
  $('#exFinish').onclick = $('#exFinish2').onclick = () => {
    const blank = exAns.filter(x => x < 0).length;
    if (!blank || confirm(`Há ${blank} questão(ões) em branco. Finalizar mesmo assim?`)) finishExam(false);
  };
  upd(); if (exEnd) tickEx();
}
function finishExam(timeout) {
  exDone = true; clearInterval(exTimer);
  const score = exQs.filter((q, i) => exAns[i] >= 0 && q.opts[exAns[i]].ok).length;
  const h = exHist(); h.push({ score, total: exQs.length, at: Date.now() }); store.set('exam', h);
  // registra erros no quiz
  const pct = Math.round(100 * score / exQs.length);
  $('#exArea').innerHTML = `
    <div class="card ${pct >= 60 ? 'ok' : 'tip'}">
      <h3 style="margin-top:0">${timeout ? '⏰ Tempo esgotado! ' : ''}Nota: ${score} / ${exQs.length} (${pct}%)</h3>
      <p>${pct >= 90 ? 'Excelente! Você está pronto. 🚀' : pct >= 70 ? 'Muito bom! Revise os erros abaixo.' : pct >= 50 ? 'Razoável. Refaça o treino do método mestre e tente de novo.' : 'Estude a seção 4 e use o treino do método mestre antes de refazer.'}</p>
      <div class="row"><button id="exAgain">Nova prova</button><a href="#mestre"><button class="ghost">Reler método mestre</button></a></div>
    </div>
    ${exQs.map((q, i) => {
      const a = exAns[i], ok = a >= 0 && q.opts[a].ok;
      return `<div class="card"><span class="pill">${i + 1}</span><b>${ok ? '✅' : a < 0 ? '⬜ em branco' : '❌'}</b>
        <p style="margin:8px 0">${q.q}</p>
        ${q.opts.map((o, j) => `<div class="opt ${o.ok ? 'right' : j === a ? 'wrong' : ''}">${o.t}${j === a ? ' &nbsp;← sua resposta' : ''}</div>`).join('')}
        <div class="expl">${q.e}</div></div>`;
    }).join('')}`;
  $('#exAgain').onclick = () => { $('#exArea').innerHTML = ''; $('#examSetup').style.display = ''; renderExHist(); window.scrollTo(0, 0); };
  window.scrollTo(0, 0);
}
renderExHist();
