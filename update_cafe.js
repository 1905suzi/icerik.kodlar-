const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '28-Akilli-Kafe-Sistemi');

// 1. data.js güncellemesi
let dataJs = fs.readFileSync(path.join(dirPath, 'data.js'), 'utf8');
dataJs = dataJs.replace(/{ id: 2, category: 'Kahveler', name: 'Latte'/g, "{ id: 2, category: 'Sıcak İçecekler', name: 'Latte'");
dataJs = dataJs.replace(/{ id: 3, category: 'Kahveler', name: 'Americano'/g, "{ id: 3, category: 'Sıcak İçecekler', name: 'Americano'");
fs.writeFileSync(path.join(dirPath, 'data.js'), dataJs);

// 2. index.html güncellemesi
let indexHtml = fs.readFileSync(path.join(dirPath, 'index.html'), 'utf8');
indexHtml = indexHtml.replace('<h1>KAFE BAL KÖPÜĞÜ</h1>', '<h1>SUZİSWEB</h1>');
const splashHTML = `
    <!-- Açılış Ekranı (Splash Screen) -->
    <div class="splash-screen" id="splashScreen">
        <div class="splash-content">
            <i class="fa-solid fa-mug-hot splash-icon"></i>
            <h1 class="splash-title">SUZİSWEB</h1>
            <p class="splash-subtitle">Kahvenin en lezzetli hali...</p>
            <button id="enterMenuBtn" class="cat-btn splash-btn">Menüyü Gör</button>
        </div>
    </div>
    
    <div class="admin-nav">`;
indexHtml = indexHtml.replace('<div class="admin-nav">', splashHTML);
fs.writeFileSync(path.join(dirPath, 'index.html'), indexHtml);

// 3. style.css güncellemesi
let styleCss = fs.readFileSync(path.join(dirPath, 'style.css'), 'utf8');
const splashCSS = `
/* Splash Ekranı */
.splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--white);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s, visibility 0.5s;
}
.splash-content {
    text-align: center;
    animation: fadeInDown 0.8s ease;
}
.splash-icon {
    font-size: 6rem;
    color: var(--primary);
    margin-bottom: 20px;
}
.splash-title {
    font-size: 3rem;
    color: var(--text-dark);
    letter-spacing: 4px;
    margin-bottom: 10px;
}
.splash-subtitle {
    font-size: 1.2rem;
    color: var(--primary);
    margin-bottom: 40px;
}
.splash-btn {
    font-size: 1.2rem;
    padding: 15px 40px;
    box-shadow: 0 10px 20px rgba(212, 163, 115, 0.3);
}
@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
styleCss += splashCSS;
fs.writeFileSync(path.join(dirPath, 'style.css'), styleCss);

// 4. customer.js güncellemesi
let customerJs = fs.readFileSync(path.join(dirPath, 'customer.js'), 'utf8');
customerJs = customerJs.replace("const categories = ['Tümü', ...new Set(menuData.map(item => item.category))];", "const categories = [...new Set(menuData.map(item => item.category))];");
customerJs = customerJs.replace(
    "const btn = document.createElement('button');\n            btn.className = 'cat-btn' + (cat === 'Tümü' ? ' active' : '');",
    "const btn = document.createElement('button');\n            btn.className = 'cat-btn' + (cat === categories[0] ? ' active' : '');"
);
customerJs = customerJs.replace(
    "const filtered = filterCat === 'Tümü' ? menuData : menuData.filter(item => item.category === filterCat);",
    "const filtered = menuData.filter(item => item.category === filterCat);"
);
customerJs = customerJs.replace("renderMenu();", "renderMenu(categories[0]);\n\n    // Splash ekranı kapatma\n    document.getElementById('enterMenuBtn').addEventListener('click', () => {\n        const splash = document.getElementById('splashScreen');\n        splash.style.opacity = '0';\n        setTimeout(() => splash.style.visibility = 'hidden', 500);\n    });");
fs.writeFileSync(path.join(dirPath, 'customer.js'), customerJs);

console.log('Update script finished.');
