const KEY = 'aracKiralama';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DEFAULT = {
  cars: [
    { id: 1, name: 'Renault Clio', cls: 'Ekonomik', price: 900, icon: '🚗', rented: null },
    { id: 2, name: 'Volkswagen Passat', cls: 'Konfor', price: 1500, icon: '🚘', rented: null },
    { id: 3, name: 'BMW 3 Serisi', cls: 'Premium', price: 2600, icon: '🏎️', rented: null },
    { id: 4, name: 'Ford Transit', cls: 'Minibüs', price: 2000, icon: '🚐', rented: null }
  ],
  history: [], nextId: 5
};
function getState() {
  try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(DEFAULT); }
  catch (e) { return structuredClone(DEFAULT); }
}
function setState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
function rentCar(id, customer, days) {
  const s = getState(), c = s.cars.find(x => x.id === id);
  if (!c || c.rented) return false;
  c.rented = { customer, days, total: days * c.price, date: new Date().toLocaleDateString('tr-TR') };
  s.history.push({ car: c.name, ...c.rented });
  setState(s); return true;
}
function returnCar(id) { const s = getState(), c = s.cars.find(x => x.id === id); if (c) c.rented = null; setState(s); }
function addCar(name, cls, price, icon) { const s = getState(); s.cars.push({ id: s.nextId++, name, cls, price, icon, rented: null }); setState(s); }
function removeCar(id) { const s = getState(); s.cars = s.cars.filter(c => c.id !== id); setState(s); }
const tl = n => n.toLocaleString('tr-TR') + ' ₺';
