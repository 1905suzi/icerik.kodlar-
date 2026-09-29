const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '21-Hesap-Makineleri');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dual Calculators - Barbie vs Classic</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="split-container">
        <!-- BARBIE THEME -->
        <div class="side barbie-side">
            <h2 class="title">Barbie 💖</h2>
            <div class="calculator barbie-calc" id="calcBarbie">
                <div class="display">
                    <div class="previous-operand" id="barbie-prev"></div>
                    <div class="current-operand" id="barbie-curr">0</div>
                </div>
                <div class="keypad">
                    <button class="key btn-clear span-2" data-action="clear">C</button>
                    <button class="key btn-del" data-action="delete">DEL</button>
                    <button class="key btn-op" data-action="divide">÷</button>
                    
                    <button class="key btn-num" data-num="7">7</button>
                    <button class="key btn-num" data-num="8">8</button>
                    <button class="key btn-num" data-num="9">9</button>
                    <button class="key btn-op" data-action="multiply">×</button>
                    
                    <button class="key btn-num" data-num="4">4</button>
                    <button class="key btn-num" data-num="5">5</button>
                    <button class="key btn-num" data-num="6">6</button>
                    <button class="key btn-op" data-action="subtract">-</button>
                    
                    <button class="key btn-num" data-num="1">1</button>
                    <button class="key btn-num" data-num="2">2</button>
                    <button class="key btn-num" data-num="3">3</button>
                    <button class="key btn-op" data-action="add">+</button>
                    
                    <button class="key btn-num" data-num="0">0</button>
                    <button class="key btn-num" data-num=".">.</button>
                    <button class="key btn-eq span-2" data-action="equals">=</button>
                </div>
            </div>
        </div>

        <!-- CLASSIC BLUE THEME -->
        <div class="side classic-side">
            <h2 class="title">Classic 🔵</h2>
            <div class="calculator classic-calc" id="calcClassic">
                <div class="display">
                    <div class="previous-operand" id="classic-prev"></div>
                    <div class="current-operand" id="classic-curr">0</div>
                </div>
                <div class="keypad">
                    <button class="key btn-clear span-2" data-action="clear">C</button>
                    <button class="key btn-del" data-action="delete">DEL</button>
                    <button class="key btn-op" data-action="divide">÷</button>
                    
                    <button class="key btn-num" data-num="7">7</button>
                    <button class="key btn-num" data-num="8">8</button>
                    <button class="key btn-num" data-num="9">9</button>
                    <button class="key btn-op" data-action="multiply">×</button>
                    
                    <button class="key btn-num" data-num="4">4</button>
                    <button class="key btn-num" data-num="5">5</button>
                    <button class="key btn-num" data-num="6">6</button>
                    <button class="key btn-op" data-action="subtract">-</button>
                    
                    <button class="key btn-num" data-num="1">1</button>
                    <button class="key btn-num" data-num="2">2</button>
                    <button class="key btn-num" data-num="3">3</button>
                    <button class="key btn-op" data-action="add">+</button>
                    
                    <button class="key btn-num" data-num="0">0</button>
                    <button class="key btn-num" data-num=".">.</button>
                    <button class="key btn-eq span-2" data-action="equals">=</button>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`;

const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body, html {
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.split-container {
    display: flex;
    width: 100%;
    height: 100vh;
}

.side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: all 0.3s;
}

.title {
    position: absolute;
    top: 40px;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 2px;
}

/* =========================================
   BARBIE THEME (LEFT SIDE)
========================================= */
.barbie-side {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
}
.barbie-side .title {
    color: #ff1493;
    text-shadow: 0 0 10px rgba(255, 20, 147, 0.5);
    font-family: 'Comic Sans MS', cursive, sans-serif;
}

.barbie-calc {
    width: 320px;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 30px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(255, 105, 180, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.5);
}

.barbie-calc .display {
    background: rgba(255, 192, 203, 0.8);
    border-radius: 20px;
    padding: 20px;
    text-align: right;
    margin-bottom: 20px;
    box-shadow: inset 0 5px 15px rgba(255, 20, 147, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.barbie-calc .previous-operand {
    color: #ff69b4;
    font-size: 1.2rem;
    min-height: 1.5rem;
}
.barbie-calc .current-operand {
    color: #ff1493;
    font-size: 3rem;
    font-weight: bold;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
    overflow: hidden;
    text-overflow: ellipsis;
}

.barbie-calc .keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.barbie-calc .key {
    border: none;
    outline: none;
    background: linear-gradient(145deg, #ffffff, #ffe4e1);
    color: #ff1493;
    font-size: 1.5rem;
    font-weight: bold;
    border-radius: 50%; /* Yuvarlak şirin tuşlar */
    height: 60px;
    cursor: pointer;
    box-shadow: 5px 5px 10px rgba(255, 105, 180, 0.2), -5px -5px 10px rgba(255, 255, 255, 1);
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.barbie-calc .key.span-2 {
    grid-column: span 2;
    border-radius: 30px;
}

.barbie-calc .key:active {
    transform: scale(0.9);
    box-shadow: inset 5px 5px 10px rgba(255, 105, 180, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 1);
}

.barbie-calc .btn-op {
    background: #ff1493;
    color: white;
    box-shadow: 0 5px 15px rgba(255, 20, 147, 0.4);
}
.barbie-calc .btn-eq {
    background: linear-gradient(145deg, #ff1493, #ff69b4);
    color: white;
    box-shadow: 0 10px 20px rgba(255, 20, 147, 0.5);
}
.barbie-calc .btn-clear, .barbie-calc .btn-del {
    color: #ff4500;
}


/* =========================================
   CLASSIC BLUE THEME (RIGHT SIDE)
========================================= */
.classic-side {
    background: #0d1117;
}
.classic-side .title {
    color: #c9d1d9;
    text-transform: uppercase;
}

.classic-calc {
    width: 320px;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px; /* Keskin, profosyonel hatlar */
    padding: 2px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}

.classic-calc .display {
    background: #0d1117;
    border-bottom: 1px solid #30363d;
    padding: 30px 20px;
    text-align: right;
    margin-bottom: 10px;
}

.classic-calc .previous-operand {
    color: #8b949e;
    font-size: 1.1rem;
    min-height: 1.5rem;
    font-family: 'Consolas', monospace;
}
.classic-calc .current-operand {
    color: #c9d1d9;
    font-size: 3rem;
    font-family: 'Consolas', monospace;
    overflow: hidden;
    text-overflow: ellipsis;
}

.classic-calc .keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: #30363d; /* Çizgi/Border efekti için arka plan */
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow: hidden;
}

.classic-calc .key {
    border: none;
    outline: none;
    background: #21262d;
    color: #c9d1d9;
    font-size: 1.4rem;
    height: 70px;
    cursor: pointer;
    transition: background 0.1s;
}

.classic-calc .key.span-2 {
    grid-column: span 2;
}

.classic-calc .key:hover {
    background: #30363d;
}
.classic-calc .key:active {
    background: #161b22;
}

.classic-calc .btn-op {
    background: #1f6feb; /* Açık Mavi operasyon tuşları */
    color: white;
}
.classic-calc .btn-op:hover { background: #388bfd; }
.classic-calc .btn-op:active { background: #0969da; }

.classic-calc .btn-eq {
    background: #238636; /* Yeşil Eşittir */
    color: white;
}
.classic-calc .btn-eq:hover { background: #2ea043; }
.classic-calc .btn-eq:active { background: #1f6feb; }

.classic-calc .btn-clear, .classic-calc .btn-del {
    color: #f85149; /* Kırmızı hata/temizleme */
}

/* =========================================
   RESPONSIVE (Mobil için alt alta)
========================================= */
@media (max-width: 800px) {
    .split-container {
        flex-direction: column;
        height: auto;
    }
    .side {
        padding: 80px 20px 40px 20px;
        min-height: 100vh;
    }
}
`;

const js = `class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        // Convert operation symbols to actual math symbols
        let mathOp = operation;
        if(operation === '÷') mathOp = '÷';
        if(operation === '×') mathOp = '*';

        this.operation = mathOp;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
            case '×':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    alert("Sıfıra bölünemez!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Virgülden sonra çok uzamasını engelle
        computation = Math.round(computation * 100000000) / 100000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return \`\${integerDisplay},\${decimalDigits}\`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            let op = this.operation;
            if(op === '*') op = '×';
            this.previousOperandTextElement.innerText = \`\${this.getDisplayNumber(this.previousOperand)} \${op}\`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Hesap makinelerini başlat
function initCalculator(calcId, prevId, currId) {
    const calcElement = document.getElementById(calcId);
    const prevElement = document.getElementById(prevId);
    const currElement = document.getElementById(currId);
    
    const calculator = new Calculator(prevElement, currElement);

    calcElement.querySelectorAll('.key').forEach(button => {
        button.addEventListener('click', () => {
            
            if (button.classList.contains('btn-num')) {
                calculator.appendNumber(button.dataset.num);
                calculator.updateDisplay();
            }
            
            if (button.classList.contains('btn-op')) {
                calculator.chooseOperation(button.innerText);
                calculator.updateDisplay();
            }
            
            if (button.classList.contains('btn-eq')) {
                calculator.compute();
                calculator.updateDisplay();
            }
            
            if (button.classList.contains('btn-clear')) {
                calculator.clear();
                calculator.updateDisplay();
            }
            
            if (button.classList.contains('btn-del')) {
                calculator.delete();
                calculator.updateDisplay();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Barbie hesap makinesini kur
    initCalculator('calcBarbie', 'barbie-prev', 'barbie-curr');
    
    // Classic hesap makinesini kur
    initCalculator('calcClassic', 'classic-prev', 'classic-curr');
});
`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('21-Hesap-Makineleri created successfully!');
