class Calculator {
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
            return `${integerDisplay},${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            let op = this.operation;
            if(op === '*') op = '×';
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${op}`;
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
