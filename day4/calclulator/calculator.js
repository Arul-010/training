// Get the display element
const display = document.getElementById('display');

// Initialize display value
let displayValue = '0';

// Update the display
function updateDisplay() {
    display.value = displayValue;
}

// Append a number to the display
function appendNumber(num) {
    if (displayValue === '0' && num !== '.') {
        displayValue = num;
    } else if (num === '.' && !displayValue.includes('.')) {
        displayValue += num;
    } else if (num !== '.') {
        displayValue += num;
    }
    updateDisplay();
}

// Append an operator to the display
function appendOperator(operator) {
    const lastChar = displayValue[displayValue.length - 1];
    
    // Prevent multiple operators in a row
    if (!['+', '-', '*', '/', '%'].includes(lastChar)) {
        displayValue += operator;
        updateDisplay();
    }
}

// Clear the display
function clearDisplay() {
    displayValue = '0';
    updateDisplay();
}

// Delete the last character
function deleteLast() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

// Calculate the result
function calculate() {
    try {
        // Evaluate the expression
        const result = eval(displayValue);
        
        // Check if result is a valid number
        if (isNaN(result) || !isFinite(result)) {
            displayValue = 'Error';
        } else {
            // Round to avoid floating point errors
            displayValue = Math.round(result * 100000000) / 100000000;
        }
    } catch (error) {
        displayValue = 'Error';
    }
    updateDisplay();
}

// Initialize display
updateDisplay();

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendNumber('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
        event.preventDefault();
    } else if (event.key === 'Backspace') {
        deleteLast();
        event.preventDefault();
    } else if (event.key === 'Escape') {
        clearDisplay();
    }
});
