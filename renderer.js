let currentInput = '0';
let previousInput = '';
let operator = null;

const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');

function updateDisplay() {
    display.textContent = currentInput;
    if (operator != null) {
        historyDisplay.textContent = `${previousInput} ${operator}`;
    } else {
        historyDisplay.textContent = '';
    }
    // Auto-scale text
    const len = currentInput.length;
    if (len > 14) {
        display.style.fontSize = '24px';
    } else if (len > 9) {
        display.style.fontSize = '40px';
    } else {
        display.style.fontSize = '64px';
    }
}

function handleNumber(num) {
    if (currentInput === '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator !== null) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    currentInput = '0';
    updateDisplay();
}

function calculate() {
    let result = 0;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '×':
        case '*':
            result = prev * curr;
            break;
        case '÷':
        case '/':
            result = prev / curr;
            break;
        default:
            return;
    }

    let resultString = result.toString();
    if (resultString.length > 10 && resultString.includes('.')) {
        resultString = parseFloat(result.toPrecision(10)).toString();
    }
    currentInput = resultString;
    operator = null;
    previousInput = '';
    updateDisplay();
}

function handleAction(action) {
    switch (action) {
        case 'clear':
            currentInput = '0';
            previousInput = '';
            operator = null;
            break;
        case 'backspace':
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            break;
        case 'calculate':
            calculate();
            if (typeof setCatState === 'function') setCatState('happy', 4000);
            break;
        case 'sqrt':
            const currSqrt = parseFloat(currentInput);
            if (!isNaN(currSqrt) && currSqrt >= 0) {
                currentInput = Math.sqrt(currSqrt).toString();
            }
            break;
        case 'percent':
            const currPct = parseFloat(currentInput);
            if (!isNaN(currPct)) {
                currentInput = (currPct / 100).toString();
            }
            break;
    }
    updateDisplay();
}

document.querySelectorAll('.num-btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent.trim();

        if (typeof isPopupOpen !== 'undefined' && isPopupOpen) {
            if (value === '1') setMode(0);
            if (value === '2') setMode(1);
            if (value === '3') setMode(2);
            if (value === '4') setMode(3);
            return;
        }
        
        // Pet interaction in CAT mode
        if (modes && modes[currentModeIndex] === 'cat') {
            if (value === '7') {
                setCatState('eating', 4000); // 7 feeds
            } else if (value === '8') {
                setCatState('sleeping', 5000); // 8 sleeps
            } else {
                setCatState('bored', 2000); // Any other number pets/pokes
            }
            return;
        }

        if (value === '.') {
            if (!currentInput.includes('.')) {
                currentInput += '.';
                updateDisplay();
            }
        } else {
            handleNumber(value);
        }
    });
});

document.querySelectorAll('.op-btn').forEach(button => {
    button.addEventListener('click', () => {
        const op = button.getAttribute('data-op');
        if (op) {
            handleOperator(op);
        } else {
            const action = button.getAttribute('data-action');
            if (action) handleAction(action);
        }
    });
});

document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        if (action) handleAction(action);
    });
});

let idleTimeout = null;
function resetIdleTimer() {
    clearTimeout(idleTimeout);
    
    // Wait 30 seconds, then switch to CAT mode if idle while in CALC mode
    idleTimeout = setTimeout(() => {
        if (modes[currentModeIndex] === 'calc') {
            setMode(1); // cat
        }
    }, 30000);
}

// Attach resetIdleTimer to all button clicks
document.querySelectorAll('button').forEach(btn => {
    if (btn.id !== 'mode-btn') {
        btn.addEventListener('click', resetIdleTimer);
    }
});

updateDisplay();

// --- Clock Logic ---
const clockEl = document.getElementById('clock');
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- Mode Switching Logic ---
const modes = ['calc', 'cat', 'memo', 'optn'];
let currentModeIndex = 0;

const modeBtn = document.getElementById('mode-btn');
const popupView = document.getElementById('view-popup');
let isPopupOpen = false;

function updateModeView() {
    modes.forEach(mode => {
        document.getElementById(`view-${mode}`).style.display = 'none';
    });

    const activeMode = modes[currentModeIndex];
    const activeView = document.getElementById(`view-${activeMode}`);
    
    if (activeMode === 'calc' || activeMode === 'optn' || activeMode === 'cat') {
        activeView.style.display = 'flex';
    } else if (activeMode === 'memo') {
        activeView.style.display = 'block';
    }
}

function togglePopup() {
    isPopupOpen = !isPopupOpen;
    popupView.style.display = isPopupOpen ? 'flex' : 'none';
}

modeBtn.addEventListener('click', (e) => {
    // Only toggle popup if it wasn't triggered by idle timer
    if (e && e.isTrusted) {
        togglePopup();
    }
});

function setMode(index) {
    if (index >= 0 && index < modes.length) {
        currentModeIndex = index;
        updateModeView();
        isPopupOpen = false;
        popupView.style.display = 'none';
    }
}

document.getElementById('menu-calc').addEventListener('click', () => setMode(0));
document.getElementById('menu-cat').addEventListener('click', () => setMode(1));
document.getElementById('menu-memo').addEventListener('click', () => setMode(2));
document.getElementById('menu-optn').addEventListener('click', () => setMode(3));

// --- Cat Virtual Pet Logic ---
const catReactionEl = document.getElementById('cat-reaction');
const catFaceEl = document.getElementById('cat-face');

let catState = 'bored';
let catTimer = null;

const catData = {
    bored: {
        texts: ["calculating is boring", "study later?", "mrp..."],
        face: " /\\_/\\\n( o.o )\n > ^ < "
    },
    hungry: {
        texts: ["feed me...", "fish pls ><"],
        face: " /\\_/\\\n( O.o )\n > ^ < "
    },
    sleepy: {
        texts: ["i'm sleepy zZ"],
        face: " /\\_/\\\n( -.- )\n > ^ < "
    },
    eating: {
        texts: ["nom nom", "full now..."],
        face: " /\\_/\\\n( ^.^ )\n > ^ < "
    },
    sleeping: {
        texts: ["zzz..."],
        face: " /\\_/\\\n( u.u )\n > ^ < "
    },
    happy: {
        texts: ["smart human.", "good math."],
        face: " /\\_/\\\n( ^_^ )\n > ^ < "
    }
};

function updateCat() {
    const stateData = catData[catState];
    const randomText = stateData.texts[Math.floor(Math.random() * stateData.texts.length)];
    catReactionEl.textContent = randomText;
    catFaceEl.textContent = stateData.face;
}

function setCatState(newState, duration = 0) {
    catState = newState;
    updateCat();
    
    if (duration > 0) {
        clearTimeout(catTimer);
        catTimer = setTimeout(() => {
            setCatState('bored');
        }, duration);
    }
}

// Randomly change state if idle in CAT mode
setInterval(() => {
    if (modes[currentModeIndex] === 'cat' && catState === 'bored') {
        const rand = Math.random();
        if (rand < 0.2) setCatState('hungry');
        else if (rand < 0.4) setCatState('sleepy');
    }
}, 15000);

updateCat();

// --- Memo Logic ---
const memoPad = document.getElementById('memo-pad');
memoPad.value = localStorage.getItem('lumina-memo') || '';
memoPad.addEventListener('input', () => {
    localStorage.setItem('lumina-memo', memoPad.value);
});

// --- Settings Logic (Visual) ---
const settingsItems = document.querySelectorAll('#view-optn div');
settingsItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.textContent.startsWith('[x]')) {
            item.textContent = item.textContent.replace('[x]', '[ ]');
        } else if (item.textContent.startsWith('[ ]')) {
            item.textContent = item.textContent.replace('[ ]', '[x]');
        }
    });
});
