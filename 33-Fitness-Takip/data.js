const KEY = 'fitnessData';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DEFAULT = {
  msg: 'Bugün harika gidiyorsun, ısınmayı atlama! 💪',
  exercises: [
    { id: 1, name: 'Squat', sets: 4, reps: 12, done: false },
    { id: 2, name: 'Şınav', sets: 3, reps: 15, done: false },
    { id: 3, name: 'Plank', sets: 3, reps: 45, done: false }
  ],
  nextId: 4
};
function getState() {
  try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(DEFAULT); }
  catch (e) { return structuredClone(DEFAULT); }
}
function setState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
function addEx(name, sets, reps) { const s = getState(); s.exercises.push({ id: s.nextId++, name, sets, reps, done: false }); setState(s); }
function toggleEx(id) { const s = getState(); const e = s.exercises.find(x => x.id === id); if (e) e.done = !e.done; setState(s); }
function removeEx(id) { const s = getState(); s.exercises = s.exercises.filter(x => x.id !== id); setState(s); }
function resetDay() { const s = getState(); s.exercises.forEach(e => e.done = false); setState(s); }
function setMsg(m) { const s = getState(); s.msg = m; setState(s); }
function percent(s) { return s.exercises.length ? Math.round(s.exercises.filter(e => e.done).length / s.exercises.length * 100) : 0; }
