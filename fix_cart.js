const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '28-Akilli-Kafe-Sistemi');

// 1. STYLE.CSS - Toast Notification
let styleCss = fs.readFileSync(path.join(dirPath, 'style.css'), 'utf8');
if (!styleCss.includes('.toast')) {
    styleCss += `
/* Toast (Sepete eklendi bildirimi) */
.toast {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    background: #2ed573;
    color: white;
    padding: 12px 25px;
    border-radius: 30px;
    font-weight: bold;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transition: bottom 0.3s;
    z-index: 10000;
}
.toast.show {
    bottom: 100px; /* FAB butonunun üstünde görünsün */
}
`;
    fs.writeFileSync(path.join(dirPath, 'style.css'), styleCss);
}

// 2. INDEX.HTML - Toast Elementi
let indexHtml = fs.readFileSync(path.join(dirPath, 'index.html'), 'utf8');
if (!indexHtml.includes('<div id="toast"')) {
    indexHtml = indexHtml.replace('</body>', '    <div id="toast" class="toast">Sepete eklendi! 🛒</div>\n</body>');
    fs.writeFileSync(path.join(dirPath, 'index.html'), indexHtml);
}

// 3. CUSTOMER.JS - Oto açılmayı iptal et ve toast göster
let customerJs = fs.readFileSync(path.join(dirPath, 'customer.js'), 'utf8');
// Oto açılma satırını kaldır
customerJs = customerJs.replace("cartModal.classList.add('active');", `// cartModal.classList.add('active'); iptal edildi (kullanıcı gezinmeye devam edebilsin)
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1500);`);
fs.writeFileSync(path.join(dirPath, 'customer.js'), customerJs);

console.log('Cart fix applied.');
