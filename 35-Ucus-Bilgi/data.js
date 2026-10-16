const KEY = 'ucusBilgi';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const STATUSES = ['Zamanında', 'Check-in Açık', 'Biniş', 'Kapı Kapandı', 'Kalktı', 'İndi', 'Gecikmeli', 'İptal'];
const DEFAULT = {
  flights: [
    { id: 1, type: 'Kalkış', airline: 'TK', no: 'TK 1923', city: 'Londra', time: '14:20', gate: 'A12', status: 'Biniş' },
    { id: 2, type: 'Kalkış', airline: 'PC', no: 'PC 2041', city: 'Berlin', time: '14:45', gate: 'B07', status: 'Zamanında' },
    { id: 3, type: 'Varış', airline: 'TK', no: 'TK 0881', city: 'Paris', time: '15:10', gate: 'C03', status: 'Gecikmeli' },
    { id: 4, type: 'Kalkış', airline: 'AJ', no: 'AJ 0345', city: 'Roma', time: '15:35', gate: 'A05', status: 'Check-in Açık' }
  ],
  nextId: 5
};
function getState() {
  try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(DEFAULT); }
  catch (e) { return structuredClone(DEFAULT); }
}
function setState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
function addFlight(f) { const s = getState(); s.flights.push({ id: s.nextId++, ...f }); setState(s); }
function updateFlight(id, patch) { const s = getState(); const f = s.flights.find(x => x.id === id); if (f) Object.assign(f, patch); setState(s); }
function removeFlight(id) { const s = getState(); s.flights = s.flights.filter(f => f.id !== id); setState(s); }
function sorted(s) { return [...s.flights].sort((a, b) => a.time.localeCompare(b.time)); }
function statusClass(st) {
  if (st === 'Gecikmeli') return 'warn';
  if (st === 'İptal') return 'bad';
  if (st === 'Biniş' || st === 'Kapı Kapandı') return 'go';
  return 'ok';
}
