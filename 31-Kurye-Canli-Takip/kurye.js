
function updateButtons() {
    const list = getDeliveries();
    const current = list[0];
    if (!current) return;

    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById('btnStep' + i);
        if (i === current.stepIndex) {
            btn.classList.add('current');
        } else {
            btn.classList.remove('current');
        }
    }
}

window.setCourierStatus = (stepIndex, statusName, eta) => {
    const list = getDeliveries();
    if (list[0]) {
        list[0].stepIndex = stepIndex;
        list[0].status = statusName;
        list[0].estimatedMin = eta;
        saveDeliveries(list);
        updateButtons();
    }
};

updateButtons();

window.addEventListener('storage', () => {
    updateButtons();
});
