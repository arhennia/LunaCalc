class Calculator {
  constructor() {
    this.reset();
  }

  reset() {
    this.displayValue = '0';
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
    this.expression = '';
  }

  inputDigit(digit) {
    if (this.waitingForSecondOperand) {
      this.displayValue = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
    }
  }

  inputDecimal(dot) {
    if (this.waitingForSecondOperand) {
      this.displayValue = '0.';
      this.waitingForSecondOperand = false;
      return;
    }

    if (!this.displayValue.includes(dot)) {
      this.displayValue += dot;
    }
  }

  deleteDigit() {
    if (this.waitingForSecondOperand) return;
    if (this.displayValue.length > 1) {
      this.displayValue = this.displayValue.slice(0, -1);
    } else {
      this.displayValue = '0';
    }
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.displayValue);

    if (this.operator && this.waitingForSecondOperand) {
      this.operator = nextOperator;
      this.expression = `${this.firstOperand} ${this.operator}`;
      return;
    }

    if (this.firstOperand === null && !isNaN(inputValue)) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.calculate(this.firstOperand, inputValue, this.operator);
      this.displayValue = `${parseFloat(result.toFixed(10))}`;
      this.firstOperand = result;
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
    this.expression = `${this.firstOperand} ${this.operator}`;
  }

  calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') return firstOperand + secondOperand;
    if (operator === '-') return firstOperand - secondOperand;
    if (operator === '*') return firstOperand * secondOperand;
    if (operator === '/') {
      if (secondOperand === 0) return 'Error';
      return firstOperand / secondOperand;
    }
    return secondOperand;
  }

  handleEqual() {
    const inputValue = parseFloat(this.displayValue);

    if (this.operator && !this.waitingForSecondOperand) {
      const result = this.calculate(this.firstOperand, inputValue, this.operator);
      
      if (result === 'Error') {
        this.displayValue = 'Error';
      } else {
        this.displayValue = `${parseFloat(result.toFixed(10))}`;
      }
      
      this.expression = '';
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecondOperand = false;
      return true; // Result calculated
    }
    return false;
  }

  toggleSign() {
    this.displayValue = (parseFloat(this.displayValue) * -1).toString();
  }

  inputPercent() {
    const currentValue = parseFloat(this.displayValue);
    this.displayValue = (currentValue / 100).toString();
  }

  getDisplay() {
    return this.displayValue;
  }

  getExpression() {
    return this.expression;
  }
}

const calc = new Calculator();
window.calc = calc; // Expose to other scripts
