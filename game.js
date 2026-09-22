'use strict';

const WORD_POOL = [
  {
    theme: 'Nature',
    target: 'MOUNTAIN',
    scramble: 'NUMAONTI',
    bonuses: ['MOUNT', 'UNION', 'ANION', 'MOAT', 'MINT', 'MAIN', 'INTO', 'ATOM', 'UNIT', 'ANTI', 'TUNA'],
  },
  {
    theme: 'Waterside',
    target: 'LAKESIDE',
    scramble: 'DIESELKA',
    bonuses: ['IDEAS', 'ASIDE', 'SKIED', 'SLIDE', 'LAKE', 'SIDE', 'IDEA', 'LEAK', 'SAID', 'SEAL', 'DEAL', 'KIDS', 'DAIS', 'SAIL'],
  },
  {
    theme: 'Victory',
    target: 'CHAMPION',
    scramble: 'PANCHIMO',
    bonuses: ['CHAMP', 'PIANO', 'CHAIN', 'MANIC', 'CAMP', 'MOAN', 'PAIN', 'MAIN', 'ICON', 'CHIN', 'CHIP', 'AMINO'],
  },
  {
    theme: 'Forest',
    target: 'PINEWOOD',
    scramble: 'WOODENPI',
    bonuses: ['WOODEN', 'ENDOW', 'PINE', 'WOOD', 'WINE', 'POND', 'DONE', 'NODE', 'WIND', 'OPEN', 'DOWN', 'DINE', 'OWED'],
  },
  {
    theme: 'Weather',
    target: 'SUNSHINE',
    scramble: 'SHINNUES',
    bonuses: ['SHINE', 'NINE', 'HISS', 'SINS', 'HENS', 'NUNS', 'HUES', 'SHUN', 'INNS', 'SUNS'],
  },
  {
    theme: 'Food',
    target: 'PANCAKES',
    scramble: 'SNACKAPE',
    bonuses: ['PANCAKE', 'SNACK', 'CAKES', 'PACKS', 'PEAKS', 'CAPES', 'CANES', 'CAKE', 'PACK', 'PANS', 'CANE', 'NAPE', 'SNAP', 'ACNE', 'PEAK', 'SACK', 'CAPE'],
  },
  {
    theme: 'Night',
    target: 'MOONBEAM',
    scramble: 'BAMMOONE',
    bonuses: ['MOON', 'BEAM', 'MOAN', 'BONE', 'NAME', 'MANE', 'BOOM', 'MEMO', 'BANE', 'OMEN', 'AMEN'],
  },
  {
    theme: 'Ocean',
    target: 'SEASHORE',
    scramble: 'ASHEROES',
    bonuses: ['SEAHORSE', 'ASHORE', 'HORSE', 'SHEAR', 'SHARE', 'HEARS', 'ROSES', 'SHORE', 'ROSE', 'SORE', 'HOSE', 'HERO', 'HEAR', 'EARS', 'SOAR', 'OARS', 'SEAR'],
  },
  {
    theme: 'Music',
    target: 'KEYBOARD',
    scramble: 'OKEYBARD',
    bonuses: ['BARKED', 'BREAK', 'BRAKE', 'BAKED', 'BOARD', 'BROAD', 'BORED', 'ROBED', 'YARD', 'BARK', 'DARK', 'BARD', 'ROAD', 'READ', 'DEAR', 'DARE', 'BORE', 'ROBE'],
  },
  {
    theme: 'Garden',
    target: 'BLOSSOM',
    scramble: 'MOBLOSS',
    bonuses: ['BLOOMS', 'BLOOM', 'MOSS', 'LOOMS', 'LOOM', 'LOSS', 'BOOM'],
  },
  {
    theme: 'Winter',
    target: 'SNOWFLAKE',
    scramble: 'WOLFSKANE',
    bonuses: ['FLAKES', 'FLAKE', 'ALONE', 'WAKE', 'FAKE', 'FAWN', 'FLEA', 'FLOE', 'SLOE', 'LOAN', 'WOLF', 'FLAN', 'KNAW', 'SNOW'],
  },
  {
    theme: 'Animals',
    target: 'ELEPHANT',
    scramble: 'NETHPALE',
    bonuses: ['PLANET', 'PLANE', 'LEAPT', 'HEAL', 'HEEL', 'LEAP', 'PALE', 'TALE', 'TEAL', 'NAPE', 'PANT', 'HEAT', 'HELP', 'PEAL'],
  },
];

const ROUND_COUNT = 5;

function pickRounds() {
  const a = WORD_POOL.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, ROUND_COUNT);
}

let ROUNDS = pickRounds();

const ROUND_TIME = 90;
const EMOJIS = ['😄', '😂', '😮', '😭', '😡', '🤔', '😎', '🥳', '👏', '👍', '❤️', '🎉'];
const AMBIENT_LINES = [
  'Nice one!', 'Good luck everyone!', 'Almost there!', "Let's go!",
  'Hmm this one is tricky...', 'This theme is easy 😄',
  'Who shuffled my letters?!', 'One more word...', 'So close!',
];
const REPLY_LINES = ['😄', 'gg', 'haha true', 'good luck!', '👍', 'same here'];
const THANK_LINES = ['thanks! 😄', '😂', '🙌', 'right back at you!'];

const $ = (id) => document.getElementById(id);

const S = {
  phase: 'menu', // menu | splash | playing | roundEnd | gameOver
  mode: 'classic', // classic | sketch
  round: 0,
  timeLeft: ROUND_TIME,
  tiles: [],        // {letter, used}
  slots: [],        // tile index or -1
  found: new Set(),
  solvedBy: null,
  botPlans: [],     // {idx, solve, time, done, gain}
  giftClaimed: false,
  muted: false,
  lastGain: 0,
  players: [],
};

function makePlayers() {
  const guest = 'Guest' + Math.floor(100000 + Math.random() * 900000);
  return [
    { name: 'Surojit',    emoji: '🧑',   ring: '#22d3ee', chat: '#fbbf24', coins: 0, pos: 'pos-tl' },
    { name: 'Isla.Criss', emoji: '👧', ring: '#f472b6', chat: '#fb923c', coins: 0, pos: 'pos-tr' },
    { name: guest,        emoji: '🧑🏻', ring: '#f9a8d4', chat: '#fde047', coins: 0, pos: 'pos-ml', you: true },
    { name: 'Champ',      emoji: '🧑',   ring: '#facc15', chat: '#fbbf24', coins: 0, pos: 'pos-mr' },
  ];
}
const you = () => S.players.find((p) => p.you);
const youIdx = () => S.players.findIndex((p) => p.you);

/* ---------------- sound (all original, synthesized) ---------------- */
let AC = null;
function ac() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function note(freq, dur = 0.12, type = 'sine', gain = 0.05, when = 0, slideTo = null, force = false) {
  if (S.muted && !force) return;
  try {
    const c = ac(), o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime + when);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + when + dur);
    g.gain.setValueAtTime(gain, c.currentTime + when);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime + when); o.stop(c.currentTime + when + dur + 0.02);
  } catch (e) { /* audio unavailable */ }
}
function whoosh(dur = 0.25, gain = 0.05, when = 0, freq = 1200) {
  if (S.muted) return;
  try {
    const c = ac(), len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
    const g = c.createGain(); g.gain.value = gain;
    src.connect(f).connect(g).connect(c.destination);
    src.start(c.currentTime + when);
  } catch (e) { /* audio unavailable */ }
}
const sfx = {
  tap:    () => note(700, 0.05, 'triangle', 0.05),
  place:  (i) => note(500 + i * 60, 0.07, 'square', 0.045),
  back:   () => note(320, 0.07, 'square', 0.04),
  shuffle:() => { whoosh(0.3, 0.06, 0, 900); whoosh(0.25, 0.05, 0.12, 1600); },
  error:  () => { note(220, 0.18, 'sawtooth', 0.06, 0, 110); note(160, 0.22, 'sawtooth', 0.05, 0.08, 80); },
  coin:   () => { note(1250, 0.06, 'sine', 0.06); note(1650, 0.12, 'sine', 0.06, 0.06); },
  bonus:  () => [880, 1108, 1318].forEach((f, i) => note(f, 0.1, 'triangle', 0.06, i * 0.07)),
  good:   () => [523, 659, 784].forEach((f, i) => note(f, 0.12, 'triangle', 0.06, i * 0.09)),
  solve:  () => { [523, 659, 784, 1046].forEach((f, i) => note(f, 0.14, 'triangle', 0.07, i * 0.08)); whoosh(0.4, 0.04, 0, 2000); },
  win:    () => [392, 523, 659, 784, 1046, 1318].forEach((f, i) => note(f, 0.18, 'triangle', 0.07, i * 0.1)),
  lose:   () => { note(300, 0.3, 'sawtooth', 0.05, 0, 150); note(200, 0.4, 'sawtooth', 0.05, 0.25, 100); },
  bot:    () => { note(494, 0.09, 'triangle', 0.05); note(624, 0.12, 'triangle', 0.05, 0.09); },
  round:  () => { whoosh(0.35, 0.05, 0, 800); note(880, 0.15, 'sine', 0.06, 0.25); },
  tick:   () => note(1000, 0.04, 'square', 0.035),
  emote:  () => note(950, 0.08, 'sine', 0.05, 0, 1400),
  gift:   () => [784, 988, 1175, 1568].forEach((f, i) => note(f, 0.1, 'sine', 0.05, i * 0.06)),
};

/* original background music loop */
let musicOn = false, musicTimer = null, musicBar = 0;
const CHORDS = [
  [261.63, 329.63, 392.00],
  [196.00, 246.94, 293.66],
  [220.00, 261.63, 329.63],
  [174.61, 220.00, 261.63],
];
function playBar() {
  const c = CHORDS[musicBar % CHORDS.length];
  musicBar++;
  const m = (f, d, t, g, w) => note(f, d, t, g, w, null, true);
  c.forEach((f) => m(f, 1.7, 'triangle', 0.012));
  [0, 1, 2, 1, 0, 2, 1, 2].forEach((n, i) => m(c[n] * 2, 0.16, 'sine', 0.018, i * 0.25));
  m(c[0] / 2, 0.4, 'sine', 0.028);
  m(c[0] / 2, 0.4, 'sine', 0.028, 1.0);
}
function setMusic(on) {
  musicOn = on;
  $('musicBtn').textContent = on ? '🎵' : '🎼';
  if (on && !musicTimer) { playBar(); musicTimer = setInterval(playBar, 2000); }
  if (!on && musicTimer) { clearInterval(musicTimer); musicTimer = null; }
}

/* ---------------- rendering ---------------- */
function renderCards() {
  const wrap = $('cards');
  wrap.innerHTML = '';
  S.players.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'pcard ' + p.pos + (p.you ? ' you' : '');
    card.id = 'card-' + i;
    card.style.animationDelay = (i * 90) + 'ms';
    card.innerHTML =
      '<div class="avatar" style="--ring:' + p.ring + '"><div class="bubble"></div><span class="crown hidden">👑</span>' + p.emoji + '</div>' +
      '<div class="info"><div class="pname">' + p.name + '</div>' +
      '<div class="pcoins">🪙 <span class="pcoinval">' + p.coins + '</span></div>' +
      '<button class="emote-btn" data-i="' + i + '">😄 ▾</button></div>';
    wrap.appendChild(card);
  });
  wrap.querySelectorAll('.emote-btn').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    openPicker(+b.dataset.i, b);
  }));
  updateCrown();
}

function updateHUD() {
  $('hudCoins').textContent = you().coins;
  $('roundPill').textContent = 'ROUND ' + Math.min(S.round + 1, ROUNDS.length) + '/' + ROUNDS.length;
  const m = Math.floor(S.timeLeft / 60), s = S.timeLeft % 60;
  $('timerPill').textContent = '⏱ ' + m + ':' + String(s).padStart(2, '0');
  $('timerPill').classList.toggle('low', S.phase === 'playing' && S.timeLeft <= 10);
  S.players.forEach((p, i) => {
    const el = document.querySelector('#card-' + i + ' .pcoinval');
    if (el) el.textContent = p.coins;
  });
}

function updateCrown() {
  const best = S.players.reduce((a, p, i) => (p.coins > S.players[a].coins ? i : a), 0);
  S.players.forEach((_, i) => {
    const c = document.querySelector('#card-' + i + ' .crown');
    if (c) c.classList.toggle('hidden', i !== best || S.players[best].coins === 0);
  });
}

function renderTray(deal) {
  const tilesEl = $('tiles'), slotsEl = $('slots');
  tilesEl.innerHTML = ''; slotsEl.innerHTML = '';
  S.tiles.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = 'tile' + (t.used ? ' used' : '') + (deal ? ' deal' : '');
    if (deal) b.style.animationDelay = (i * 45) + 'ms';
    b.textContent = t.letter;
    b.dataset.i = i;
    b.addEventListener('click', () => tapTile(i));
    tilesEl.appendChild(b);
  });
  const n = ROUNDS[S.round].target.length;
  for (let s = 0; s < n; s++) {
    const d = document.createElement('button');
    const ti = S.slots[s];
    d.className = 'slot' + (ti >= 0 ? ' filled' : '');
    d.textContent = ti >= 0 ? S.tiles[ti].letter : '';
    d.addEventListener('click', () => tapSlot(s));
    slotsEl.appendChild(d);
  }
  $('submitBtn').classList.toggle('ready', S.phase === 'playing' && S.slots.every((i) => i >= 0));
}

function renderParchment() {
  const r = ROUNDS[S.round];
  $('pTheme').textContent = S.phase === 'menu' ? '' : 'Theme: ' + r.theme + ' · ' + r.target.length + ' letters';
  const found = $('pFound');
  found.innerHTML = '';
  S.found.forEach((w) => {
    const sp = document.createElement('span');
    sp.textContent = w;
    found.appendChild(sp);
  });
}

/* ---------------- sketch board ---------------- */
function renderSketch(word) {
  const svg = $('sketchSvg');
  const data = (window.SKETCH_DATA && window.SKETCH_DATA[word]) || window.SKETCH_DATA._default;
  svg.innerHTML = data.join('');
  $('sketchWord').textContent = '';
  $('sketchWord').classList.remove('show');
  const board = document.querySelector('.board-frame');
  if (board) board.classList.remove('celebrate');
  const els = [...svg.querySelectorAll('path,circle,ellipse,line,polyline,polygon,rect')];
  els.forEach((el, i) => {
    let len = 0;
    try { len = el.getTotalLength ? el.getTotalLength() : 0; } catch (e) { len = 0; }
    if (!len || !isFinite(len)) len = 320;
    el.style.strokeDasharray = len + ' ' + len;
    el.style.strokeDashoffset = len;
    el.getBoundingClientRect();
    const dur = 0.45 + Math.min(0.9, len / 420);
    el.style.transition = 'stroke-dashoffset ' + dur.toFixed(2) + 's ease ' + (i * 0.16).toFixed(2) + 's';
    el.style.strokeDashoffset = '0';
  });
}

function flyLettersToBoard(word) {
  const boardEl = document.querySelector('.board-face');
  if (!boardEl) return;
  const b = boardEl.getBoundingClientRect();
  const slotEls = [...document.querySelectorAll('#slots .slot')];
  const n = word.length;
  const step = Math.min(40, (b.width * 0.86) / n);
  const totalW = step * n;
  const left0 = b.left + b.width / 2 - totalW / 2 + step / 2;
  const topY = b.top + b.height * 0.62;
  slotEls.forEach((el, i) => {
    if (i >= n) return;
    const r = el.getBoundingClientRect();
    const sx = r.left + r.width / 2, sy = r.top + r.height / 2;
    const s = document.createElement('span');
    s.className = 'fly-letter';
    s.textContent = word[i];
    s.style.left = sx + 'px';
    s.style.top = sy + 'px';
    $('fx').appendChild(s);
    const dx = (left0 + i * step) - sx;
    const dy = topY - sy;
    requestAnimationFrame(() => {
      s.style.transition = 'transform .85s cubic-bezier(.35,-0.35,.45,1.35) ' + (i * 0.07).toFixed(2) + 's, opacity .3s ease ' + (0.9 + i * 0.07).toFixed(2) + 's';
      s.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translateZ(140px) rotateY(360deg) scale(1.25)';
      s.style.opacity = '0.15';
    });
    setTimeout(() => s.remove(), 1500 + i * 70);
  });
  setTimeout(() => {
    const cap = $('sketchWord');
    cap.textContent = word;
    cap.classList.add('show');
  }, 950);
}

function announceSketch(solverIdx, reveal) {
  const name = solverIdx === youIdx() ? 'You' : S.players[solverIdx].name;
  const a = $('sketchAnnounce');
  a.textContent = reveal
    ? '🎉 ' + name + ' guessed it — ' + ROUNDS[S.round].target + '!'
    : '🎉 ' + name + ' guessed the word!';
  a.classList.remove('show');
  void a.offsetWidth;
  a.classList.add('show');
}

function setMode(mode) {
  S.mode = mode;
  $('modePill').textContent = mode === 'sketch' ? 'SKETCH' : 'CLASSIC';
  const sketch = mode === 'sketch';
  $('sketchBoard').classList.toggle('hidden', !sketch);
  $('parchment').classList.toggle('hidden', sketch);
}


/* ---------------- fx ---------------- */
function showBubble(cardIdx, emoji) {
  const card = $('card-' + cardIdx);
  if (!card) return;
  const b = card.querySelector('.bubble');
  b.textContent = emoji;
  b.classList.remove('show');
  void b.offsetWidth;
  b.classList.add('show');
  clearTimeout(b._t);
  b._t = setTimeout(() => b.classList.remove('show'), 1900);
  sfx.emote();
}
function coinFly(fromEl) {
  const a = fromEl.getBoundingClientRect(), b = $('hudCoins').getBoundingClientRect();
  const sp = document.createElement('span');
  sp.className = 'coin-fly';
  sp.textContent = '🪙';
  sp.style.left = (a.left + a.width / 2) + 'px';
  sp.style.top = a.top + 'px';
  $('fx').appendChild(sp);
  requestAnimationFrame(() => {
    sp.style.transform = 'translate(' + (b.left - a.left - a.width / 2) + 'px,' + (b.top - a.top) + 'px) scale(.6)';
    sp.style.opacity = '0.2';
  });
  setTimeout(() => sp.remove(), 750);
}
function confetti(n = 70) {
  const colors = ['#fbbf24', '#f472b6', '#4db1ff', '#34d977', '#f87171', '#a78bfa'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    c.style.animationDelay = (Math.random() * 0.5) + 's';
    $('fx').appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}
let toastTimer = null;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 1600);
}

/* ---------------- chat ---------------- */
function addMsg(who, text, color, sys) {
  const box = $('chatMsgs');
  const d = document.createElement('div');
  d.className = 'msg' + (sys ? ' sys' : '');
  if (sys) {
    d.textContent = text;
  } else {
    const w = document.createElement('span');
    w.className = 'who';
    w.style.color = color || '#fbbf24';
    w.textContent = who + ': ';
    d.appendChild(w);
    d.appendChild(document.createTextNode(text));
  }
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
  while (box.children.length > 60) box.removeChild(box.firstChild);
}
function botChat(line) {
  const bots = S.players.filter((p) => !p.you);
  const b = bots[Math.floor(Math.random() * bots.length)];
  addMsg(b.name, line, b.chat);
}

/* ---------------- game flow ---------------- */
function newGame() {
  ROUNDS = pickRounds();
  S.players = makePlayers();
  S.round = 0;
  S.giftClaimed = false;
  $('giftBtn').disabled = false;
  renderCards();
  $('chatMsgs').innerHTML = '';
  addMsg('Isla.Criss', 'Nice one!', '#fb923c');
  addMsg(you().name, 'Good luck everyone!', you().chat);
  addMsg('Surojit', 'Almost there!', '#fbbf24');
  addMsg('Champ', "Let's go!", '#fbbf24');
  hideOverlays();
  startRound(0);
}

function startGame(mode) {
  setMode(mode);
  sfx.good();
  newGame();
}

function startRound(i) {
  S.round = i;
  S.phase = 'splash';
  S.timeLeft = ROUND_TIME;
  S.found = new Set();
  S.solvedBy = null;
  S.lastGain = 0;
  const r = ROUNDS[i];
  S.tiles = r.scramble.split('').map((ch) => ({ letter: ch, used: false }));
  S.slots = new Array(r.target.length).fill(-1);
  S.botPlans = S.players
    .map((p, idx) => ({ idx, solve: !p.you && Math.random() < 0.8, time: 25 + Math.floor(Math.random() * 55), done: false, gain: 0 }))
    .filter((b) => !S.players[b.idx].you);
  $('splashRound').textContent = 'ROUND ' + (i + 1) + '/' + ROUNDS.length;
  $('splashTheme').textContent = S.mode === 'sketch' ? 'Guess the sketch!' : 'Theme: ' + r.theme;
  $('splashOverlay').classList.remove('hidden');
  updateHUD();
  renderTray();
  if (S.mode === 'sketch') {
    $('sketchAnnounce').classList.remove('show');
    $('sketchAnnounce').textContent = '';
    renderSketch(r.target);
  } else {
    renderParchment();
  }
  setTimeout(() => {
    $('splashOverlay').classList.add('hidden');
    if (S.phase === 'splash') S.phase = 'playing';
    renderTray(true);
    if (S.mode === 'sketch') renderSketch(r.target);
    sfx.round();
    if (Math.random() < 0.7) {
      const bots = S.players.map((p, i) => i).filter((i) => !S.players[i].you);
      showBubble(bots[Math.floor(Math.random() * bots.length)], EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    }
  }, 1600);
}

function tick() {
  if (S.phase !== 'playing') return;
  S.timeLeft--;
  const elapsed = ROUND_TIME - S.timeLeft;
  for (const b of S.botPlans) {
    if (!b.done && b.solve && elapsed >= b.time) {
      b.done = true;
      botSolves(b);
    }
  }
  if (S.timeLeft <= 5 && S.timeLeft > 0) sfx.tick();
  if (S.timeLeft <= 0) { endRound(null); return; }
  updateHUD();
}

function botSolves(b) {
  const p = S.players[b.idx];
  b.gain = 80 + S.timeLeft;
  p.coins += b.gain;
  sfx.bot();
  if (S.mode === 'sketch') {
    addMsg(p.name, 'I guessed it! 🎉', p.chat);
    announceSketch(b.idx, false);
  } else {
    addMsg(p.name, 'I found the word! 😄', p.chat);
  }
  showBubble(b.idx, '🎉');
  if (!S.solvedBy) S.solvedBy = b.idx;
  updateHUD(); updateCrown();
}

function tapTile(i) {
  if (S.phase !== 'playing') return;
  const t = S.tiles[i];
  if (t.used) return;
  const s = S.slots.indexOf(-1);
  if (s < 0) return;
  t.used = true;
  S.slots[s] = i;
  sfx.place(s);
  renderTray();
  const slotEl = document.querySelectorAll('#slots .slot')[s];
  if (slotEl) slotEl.classList.add('pop');
}

function tapSlot(s) {
  if (S.phase !== 'playing') return;
  const ti = S.slots[s];
  if (ti < 0) return;
  S.tiles[ti].used = false;
  S.slots[s] = -1;
  sfx.back();
  renderTray();
}

function shuffleTiles() {
  if (S.phase !== 'playing') return;
  clearSlots();
  for (let i = S.tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [S.tiles[i], S.tiles[j]] = [S.tiles[j], S.tiles[i]];
  }
  sfx.shuffle();
  renderTray();
}

function submit() {
  if (S.phase !== 'playing') return;
  const word = S.slots.filter((i) => i >= 0).map((i) => S.tiles[i].letter).join('');
  if (!word) { sfx.error(); return; }
  const r = ROUNDS[S.round];
  if (S.mode === 'sketch') { submitSketch(word, r); return; }
  if (word === r.target) {
    const gain = 100 + S.timeLeft;
    you().coins += gain;
    S.lastGain = gain;
    S.phase = 'roundEnd';
    sfx.solve();
    coinFly($('bottomPanel'));
    confetti(80);
    toast('+' + gain + ' 🪙  ' + word + '!');
    addMsg(you().name, 'I got it!! 🎉', you().chat);
    showBubble(youIdx(), '🥳');
    updateHUD(); updateCrown();
    setTimeout(() => showResult(youIdx()), 900);
    return;
  }
  if (r.bonuses.includes(word) && !S.found.has(word)) {
    S.found.add(word);
    you().coins += 25;
    sfx.bonus();
    coinFly($('bottomPanel'));
    toast('+25 🪙 bonus word: ' + word);
    clearSlots();
    renderParchment();
    updateHUD(); updateCrown();
    return;
  }
  if (S.found.has(word)) toast('Already found!');
  else toast('Not a word!');
  sfx.error();
  const panel = $('bottomPanel');
  panel.classList.remove('shake');
  void panel.offsetWidth;
  panel.classList.add('shake');
  document.querySelectorAll('#slots .slot.filled').forEach((el) => {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  });
}

function submitSketch(word, r) {
  if (word === r.target) {
    const gain = 100 + S.timeLeft;
    you().coins += gain;
    S.lastGain = gain;
    S.phase = 'roundEnd';
    sfx.solve();
    coinFly($('bottomPanel'));
    confetti(90);
    toast('+' + gain + ' 🪙  ' + word + '!');
    flyLettersToBoard(word);
    setTimeout(() => {
      const board = document.querySelector('.board-frame');
      if (board) board.classList.add('celebrate');
    }, 1000);
    announceSketch(youIdx(), true);
    addMsg(you().name, 'I guessed it!! 🎉', you().chat);
    showBubble(youIdx(), '🥳');
    updateHUD(); updateCrown();
    setTimeout(() => showResult(youIdx()), 1800);
    return;
  }
  sfx.error();
  toast('Not it — look closer at the sketch!');
  const panel = $('bottomPanel');
  panel.classList.remove('shake');
  void panel.offsetWidth;
  panel.classList.add('shake');
  document.querySelectorAll('#slots .slot.filled').forEach((el) => {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  });
}

function clearSlots() {
  S.slots.forEach((ti, s) => { if (ti >= 0) { S.tiles[ti].used = false; S.slots[s] = -1; } });
  renderTray();
}

function endRound(solverIdx) {
  if (S.phase === 'roundEnd' || S.phase === 'gameOver') return;
  S.phase = 'roundEnd';
  showResult(solverIdx);
}

function showResult(solverIdx) {
  const r = ROUNDS[S.round];
  const title = $('resultTitle');
  const body = $('resultBody');
  body.innerHTML = '';
  if (solverIdx === null) {
    title.textContent = "⏰ Time's up!";
    addMsg(null, "Time's up — the word was " + r.target, null, true);
  } else if (solverIdx === youIdx()) {
    title.textContent = S.solvedBy === youIdx() || S.solvedBy === null ? '🎉 You solved it!' : '🎉 You found it too!';
  } else {
    title.textContent = '😮 ' + S.players[solverIdx].name + ' solved it first!';
  }
  const row = document.createElement('div');
  row.className = 'row first';
  if (solverIdx === null) {
    row.innerHTML = '<span>The word was</span><span class="pts">' + r.target + '</span>';
  } else {
    const pts = solverIdx === youIdx() ? S.lastGain : (S.botPlans.find((b) => b.idx === solverIdx) || { gain: 0 }).gain;
    row.innerHTML = '<span>' + (solverIdx === youIdx() ? 'You' : S.players[solverIdx].name) +
      ' found ' + r.target + '</span><span class="pts">+' + pts + ' 🪙</span>';
  }
  body.appendChild(row);
  if (S.found.size) {
    const frow = document.createElement('div');
    frow.className = 'row';
    frow.innerHTML = '<span>Your bonus words (' + S.found.size + ')</span><span class="pts">+' + (S.found.size * 25) + ' 🪙</span>';
    body.appendChild(frow);
  }
  const srow = document.createElement('div');
  srow.className = 'row';
  srow.innerHTML = '<span>Standings</span><span class="pts">' +
    [...S.players].sort((a, b) => b.coins - a.coins).map((p) => (p.you ? 'You' : p.name.split('.')[0]) + ' ' + p.coins).join(' · ') + '</span>';
  body.appendChild(srow);
  $('nextBtn').textContent = S.round + 1 < ROUNDS.length ? 'NEXT ROUND ➜' : 'SEE RESULTS 🏆';
  $('resultOverlay').classList.remove('hidden');
}

function nextRound() {
  $('resultOverlay').classList.add('hidden');
  if (S.round + 1 < ROUNDS.length) startRound(S.round + 1);
  else gameOver();
}

function gameOver() {
  S.phase = 'gameOver';
  const sorted = [...S.players].sort((a, b) => b.coins - a.coins);
  const winner = sorted[0];
  $('endTitle').textContent = winner.you ? '🏆 You are the Champ!' : '🏆 ' + winner.name + ' wins!';
  const body = $('endBody');
  body.innerHTML = '';
  sorted.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'row' + (i === 0 ? ' first' : '');
    row.innerHTML = '<span>' + (i === 0 ? '👑 ' : '') + (i + 1) + '. ' + (p.you ? 'You (' + p.name + ')' : p.name) +
      '</span><span class="pts">' + p.coins + ' 🪙</span>';
    body.appendChild(row);
  });
  $('endOverlay').classList.remove('hidden');
  if (winner.you) { sfx.win(); confetti(120); } else { sfx.lose(); }
}

function hideOverlays() {
  ['menuOverlay', 'splashOverlay', 'resultOverlay', 'endOverlay'].forEach((id) => $(id).classList.add('hidden'));
}

/* ---------------- emoji picker / reactions ---------------- */
let pickerFor = -1;
function openPicker(targetIdx, anchorEl) {
  const pk = $('emojiPicker');
  pickerFor = targetIdx;
  pk.innerHTML = '';
  EMOJIS.forEach((e) => {
    const b = document.createElement('button');
    b.textContent = e;
    b.addEventListener('click', (ev) => { ev.stopPropagation(); pickEmoji(e); });
    pk.appendChild(b);
  });
  const r = anchorEl.getBoundingClientRect();
  pk.classList.remove('hidden');
  const left = Math.min(window.innerWidth - 300, Math.max(8, r.left - 120));
  pk.style.left = left + 'px';
  pk.style.top = Math.max(8, r.bottom + 8) + 'px';
}
function pickEmoji(e) {
  $('emojiPicker').classList.add('hidden');
  sfx.tap();
  if (pickerFor === youIdx()) {
    showBubble(youIdx(), e);
  } else {
    showBubble(pickerFor, e);
    const t = S.players[pickerFor];
    if (Math.random() < 0.5) setTimeout(() => addMsg(t.name, THANK_LINES[Math.floor(Math.random() * THANK_LINES.length)], t.chat), 900 + Math.random() * 1200);
  }
}

/* ---------------- wiring ---------------- */
$('shuffleBtn').addEventListener('click', shuffleTiles);
$('submitBtn').addEventListener('click', submit);
$('playBtn').addEventListener('click', () => startGame('classic'));
$('sketchBtn').addEventListener('click', () => startGame('sketch'));
$('againBtn').addEventListener('click', () => { sfx.good(); newGame(); });
$('nextBtn').addEventListener('click', () => { sfx.tap(); nextRound(); });
$('menuBtn').addEventListener('click', () => { hideOverlays(); openMenu(); });
$('homeBtn').addEventListener('click', () => { openMenu(); });
$('resumeBtn').addEventListener('click', () => { hideOverlays(); });

function openMenu() {
  $('resumeBtn').classList.toggle('hidden', S.phase === 'menu' || S.phase === 'gameOver');
  $('menuOverlay').classList.remove('hidden');
}

$('musicBtn').addEventListener('click', () => { setMusic(!musicOn); sfx.tap(); });
$('soundBtn').addEventListener('click', () => {
  S.muted = !S.muted;
  $('soundBtn').textContent = S.muted ? '🔇' : '🔊';
  if (!S.muted) sfx.tap();
});

$('giftBtn').addEventListener('click', () => {
  if (S.giftClaimed || S.phase === 'menu') return;
  S.giftClaimed = true;
  $('giftBtn').disabled = true;
  you().coins += 75;
  sfx.gift();
  coinFly($('giftBtn'));
  confetti(40);
  toast('🎁 Gift claimed! +75 🪙');
  showBubble(youIdx(), '🎁');
  updateHUD(); updateCrown();
});

$('chatBtn').addEventListener('click', () => {
  $('chatPanel').classList.toggle('hidden');
  sfx.tap();
});
$('reactBtn').addEventListener('click', (e) => openPicker(youIdx(), e.currentTarget));

function sendChat() {
  const inp = $('chatText');
  const text = inp.value.trim();
  if (!text) return;
  addMsg(you().name, text, you().chat);
  inp.value = '';
  sfx.tap();
  if (Math.random() < 0.6) setTimeout(() => botChat(REPLY_LINES[Math.floor(Math.random() * REPLY_LINES.length)]), 1000 + Math.random() * 2000);
}
$('chatSend').addEventListener('click', sendChat);
$('chatText').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

document.addEventListener('click', (e) => {
  if (!e.target.closest('#emojiPicker') && !e.target.closest('.emote-btn') && !e.target.closest('#reactBtn')) {
    $('emojiPicker').classList.add('hidden');
  }
});

setInterval(tick, 1000);
setInterval(() => {
  if (S.phase === 'playing' && Math.random() < 0.45) botChat(AMBIENT_LINES[Math.floor(Math.random() * AMBIENT_LINES.length)]);
}, 11000);
setInterval(() => {
  if (S.phase === 'playing' && Math.random() < 0.25) {
    const bots = S.players.map((p, i) => i).filter((i) => !S.players[i].you);
    showBubble(bots[Math.floor(Math.random() * bots.length)], EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  }
}, 14000);

/* boot */
S.players = makePlayers();
setMode('classic');
renderCards();
updateHUD();
renderParchment();
addMsg('Isla.Criss', 'Nice one!', '#fb923c');
addMsg('Surojit', 'Almost there!', '#fbbf24');
addMsg('Champ', "Let's go!", '#fbbf24');

/* test hook */
window.__champ = {
  S, ROUNDS: () => ROUNDS, WORD_POOL,
  target: () => ROUNDS[S.round].target,
  spell(word) {
    for (const ch of word) {
      const i = S.tiles.findIndex((t) => t.letter === ch && !t.used);
      if (i >= 0) tapTile(i);
    }
  },
  submit, startRound, newGame, startGame, setMode, renderSketch, flyLettersToBoard, announceSketch,
};
