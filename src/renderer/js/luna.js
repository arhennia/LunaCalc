class Luna {
  constructor() {
    this.mood = 'default';
    this.idleTimer = null;
    this.blinkTimer = null;
    this.eyeL = document.getElementById('eye-l');
    this.eyeR = document.getElementById('eye-r');
    this.init();
  }

  init() {
    this.startBlinking();
    this.resetIdleTimer();
    this.initKeyboardSupport();
    
    // Wire up button events
    const buttons = document.querySelectorAll('.calc-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.resetIdleTimer();
        this.handleAction(btn.dataset.key);
      });
    });

    // Cat head click (Meow)
    const catHead = document.querySelector('.cat-head');
    if (catHead) {
      catHead.addEventListener('click', (e) => {
        // Only trigger meow if not dragging (or just trigger it anyway for fun)
        if (window.playMeow) window.playMeow();
        if (window.anim) window.anim.shake();
        this.setMood('happy');
      });
    }
  }

  startBlinking() {
    const blink = () => {
      const delay = Math.random() * 3000 + 2000;
      this.blinkTimer = setTimeout(() => {
        this.eyeL.classList.add('blinking');
        this.eyeR.classList.add('blinking');
        
        setTimeout(() => {
          this.eyeL.classList.remove('blinking');
          this.eyeR.classList.remove('blinking');
          blink();
        }, 140);
      }, delay);
    };
    blink();
  }

  initKeyboardSupport() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      let action = null;

      if (key >= '0' && key <= '9') action = key;
      else if (key === '.') action = '.';
      else if (key === 'Enter' || key === '=') action = '=';
      else if (key === 'Backspace') action = 'DEL';
      else if (key === 'Escape') action = 'AC';
      else if (key === '+') action = '+';
      else if (key === '-') action = '-';
      else if (key === '*') action = '*';
      else if (key === '/') {
        e.preventDefault(); // Prevent search in some browsers
        action = '/';
      }

      if (action) {
        this.handleAction(action);
        this.visualFeedback(action);
      }
    });
  }

  visualFeedback(action) {
    // Map internal action back to data-key attribute
    let selector = `[data-key="${action}"]`;
    if (action === 'DEL') return; // Special case if no button exists, but we can animate display
    
    const btn = document.querySelector(selector);
    if (btn) {
      btn.classList.add('active-keyboard');
      setTimeout(() => btn.classList.remove('active-keyboard'), 100);
    }
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    if (this.mood === 'sleepy') {
      this.setMood('default');
    }
    this.idleTimer = setTimeout(() => {
      this.setMood('sleepy');
    }, 90000); // 90 seconds
  }

  setMood(mood) {
    this.mood = mood;
    const eyes = [this.eyeL, this.eyeR];
    
    // Reset eye styles
    eyes.forEach(eye => {
      eye.style.height = '5px';
      eye.style.background = 'var(--accent2)';
      eye.style.boxShadow = '0 0 4px rgba(143, 184, 160, 0.5)';
      eye.style.transform = 'scale(1)';
    });

    switch (mood) {
      case 'sleepy':
        eyes.forEach(eye => {
          eye.style.height = '1.5px';
          eye.style.transform = 'translateY(1px)';
        });
        document.querySelector('.app-container').style.opacity = '0.75';
        break;
      case 'happy':
        eyes.forEach(eye => {
          eye.style.transform = 'scale(1.3)';
        });
        setTimeout(() => this.setMood('default'), 1500);
        break;
      case 'annoyed':
        eyes.forEach(eye => {
          eye.style.height = '2px';
          eye.style.background = 'var(--ink-dim)';
        });
        setTimeout(() => this.setMood('default'), 3000);
        break;
      case 'error':
        eyes.forEach(eye => {
          eye.style.background = '#c06060'; // red
          eye.style.transform = 'scale(1.4)';
        });
        setTimeout(() => this.setMood('default'), 2000);
        break;
      case 'default':
      default:
        document.querySelector('.app-container').style.opacity = '1';
        break;
    }
  }

  handleAction(key) {
    const displayResult = document.getElementById('display-result');
    const displayExpr = document.getElementById('display-expr');

    if (key >= '0' && key <= '9') {
      calc.inputDigit(key);
    } else if (key === '.') {
      calc.inputDecimal('.');
    } else if (key === 'AC') {
      calc.reset();
      this.setMood('default');
    } else if (key === 'pm') {
      calc.toggleSign();
    } else if (key === 'DEL') {
      calc.deleteDigit();
    } else if (key === '%') {
      calc.inputPercent();
    } else if (['+', '-', '*', '/'].includes(key)) {
      calc.handleOperator(key);
      this.setMood('curious');
    } else if (key === '=') {
      const success = calc.handleEqual();
      if (success) {
        if (calc.getDisplay() === 'Error') {
          this.setMood('error');
        } else {
          this.setMood('happy');
        }
      }
    }

    displayResult.textContent = calc.getDisplay();
    displayExpr.textContent = calc.getExpression();
    
    // Play sound if sound script is loaded
    if (window.playButtonSound) window.playButtonSound(key);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.luna = new Luna();
});
