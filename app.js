/* app.js - Recursion Blockchain Analysis (static prototype)
   - simulates data for 6 assets
   - hash validator
   - simple animated canvas background (matrix-style)
*/

/* ---------- Sample data ---------- */
const assets = [
  { id: 'BTC', name: 'Bitcoin', price: 57324.12, change: 1.2, txs: ['a1b2...','c3d4...','e5f6...'] },
  { id: 'ETH', name: 'Ethereum', price: 3801.33, change: -0.7, txs: ['1111...','2222...','3333...'] },
  { id: 'SOL', name: 'Solana', price: 110.55, change: 4.6, txs: ['aa11...','bb22...','cc33...'] },
  { id: 'ADA', name: 'Cardano', price: 1.35, change: -2.4, txs: ['zz99...','yy88...','xx77...'] },
  { id: 'DOT', name: 'Polkadot', price: 20.43, change: 0.4, txs: ['p1p1...','q2q2...','r3r3...'] },
  { id: 'XRP', name: 'Ripple', price: 0.95, change: 0.9, txs: ['m1m1...','n2n2...','o3o3...'] }
];

/* ---------- Utilities ---------- */
const $ = (s) => document.querySelector(s);
const fmt = (n) => {
  if (n >= 1e9) return '$' + (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  return '$' + Number(n).toLocaleString();
};

/* ---------- DOM population ---------- */
function createCard(a){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <div class="title">
      <div>
        <div class="name">${a.name} <small class="meta">(${a.id})</small></div>
        <div class="meta">Status: ${Math.random() > 0.05 ? 'OK' : 'Degraded'}</div>
      </div>
      <div class="spark" aria-hidden="true">●</div>
    </div>
    <div class="price">${fmt(a.price)}</div>
    <div class="change" style="color:${a.change >=0 ? '#9bf6ff':'#ffb4b4'}">
      ${a.change >=0 ? '▲' : '▼'} ${Math.abs(a.change).toFixed(2)}% (24h)
    </div>
    <div class="txs">Recent TXs: ${a.txs.slice(0,3).join(', ')}</div>
  `;
  return el;
}

function populateDashboard(){
  const container = $('#asset-cards');
  container.innerHTML = '';
  assets.forEach(a => container.appendChild(createCard(a)));
}

/* ---------- Stats simulation ---------- */
function updateStats(){
  $('#totalActive').textContent = assets.length;
  const est = assets.reduce((s,a)=> s + (a.price * (Math.random()*10000+1000)), 0);
  $('#marketCap').textContent = fmt(est);
  $('#txs').textContent = Math.floor(Math.random()*1000);
}

/* ---------- Live update tick ---------- */
function tick(){
  // small random walk on prices
  assets.forEach(a => {
    const drift = (Math.random()-0.48) * (a.price * 0.005);
    a.price = Math.max(0.0001, a.price + drift);
    a.change = ((Math.random()-0.5)*2).toFixed(2);
  });
  populateDashboard();
  updateStats();
  logEvent('Dashboard updated');
}
setInterval(tick, 4000);
document.addEventListener('DOMContentLoaded', () => {
  populateDashboard();
  updateStats();
});

/* ---------- Hash validator ---------- */
function isHexHash(s){
  if(!s) return false;
  const cleaned = s.trim().toLowerCase();
  // accept 64-digit hex for sha256
  return /^[0-9a-f]{64}$/.test(cleaned);
}
document.getElementById('validate-btn').addEventListener('click', () => {
  const v = document.getElementById('hash-input').value.trim();
  const res = document.getElementById('hash-result');
  if(!v){ res.className = 'result neutral'; res.textContent = 'Please paste a hash.'; return; }
  if(isHexHash(v)){
    res.className = 'result ok'; res.textContent = 'Looks like a valid SHA-256 hex hash.';
  } else {
    res.className = 'result bad'; res.textContent = 'Invalid hash format — expected 64 hex characters.';
  }
});

/* ---------- Small live log ---------- */
function logEvent(txt){
  const el = document.getElementById('live-log');
  const now = new Date().toLocaleTimeString();
  el.innerHTML = `<div>[${now}] ${txt}</div>` + el.innerHTML;
  // cap length
  if (el.children.length > 80) el.removeChild(el.lastChild);
}

/* ---------- login behaviour (mock) ---------- */
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const un = document.getElementById('username').value || 'Guest';
  document.querySelector('.topbar .user').textContent = un;
  logEvent(`User "${un}" signed in (mock)`);
});

/* ---------- Simple matrix-like canvas animation ---------- */
(function matrixCanvas(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const cols = Math.floor(w / 14);
  const y = Array(cols).fill(0);

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  addEventListener('resize', () => { resize(); });

  function frame(){
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,w,h);
    ctx.font = '12px monospace';
    for (let i = 0; i < cols; i++) {
      const txt = String.fromCharCode(48 + Math.floor(Math.random() * 42));
      ctx.fillStyle = `rgba(0,245,255,${Math.random()*0.6 + 0.2})`;
      ctx.fillText(txt, i * 14, y[i] * 14);
      if (y[i] * 14 > h && Math.random() > 0.975) y[i] = 0;
      y[i]++;
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
