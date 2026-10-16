// Ortak veri katmanı (iki sayfa localStorage + storage olayı ile senkron çalışır)
const KEY = 'hastaneKuyruk';
const DEPTS = ['Dahiliye', 'Kardiyoloji', 'Ortopedi', 'Göz', 'Çocuk Sağlığı'];

function getState() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { queue: [], current: null, counter: 0, callId: 0 };
  } catch (e) {
    return { queue: [], current: null, counter: 0, callId: 0 };
  }
}
function setState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

function addPatient(name, dept) {
  const s = getState();
  s.counter++;
  s.queue.push({ no: s.counter, name, dept });
  setState(s);
}
function callNext() {
  const s = getState();
  if (!s.queue.length) return;
  const p = s.queue.shift();
  s.current = { ...p, room: 'Oda ' + (1 + (p.no % 5)) };
  s.callId++;
  setState(s);
}
function removePatient(no) {
  const s = getState();
  s.queue = s.queue.filter(p => p.no !== no);
  setState(s);
}
function resetAll() { localStorage.removeItem(KEY); }
function fmtNo(n) { return 'A-' + String(n).padStart(3, '0'); }
