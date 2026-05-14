// src/renderer/js/sounds.js

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, duration, volume = 0.12, type = 'sine') {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

window.playButtonSound = (key) => {
  // Only play if sound is enabled (TODO: check settings)
  
  if (key >= '0' && key <= '9') {
    playTone(2400, 0.05, 0.08); // Digit click
  } else if (['+', '-', '*', '/'].includes(key)) {
    playTone(1800, 0.06, 0.1);  // Operator click
  } else if (key === '=') {
    // Happy chime
    playTone(880, 0.1, 0.1);
    setTimeout(() => playTone(1047, 0.15, 0.1), 60);
  } else if (key === 'AC') {
    playTone(600, 0.2, 0.05, 'square'); // Clear pop
  }
};

window.playMeow = () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  // Meow pitch sweep: M-e-o-w
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
};

// Initial startup chime
window.addEventListener('load', () => {
  setTimeout(() => {
    playTone(440, 0.1, 0.05);
    setTimeout(() => playTone(554, 0.1, 0.05), 50);
    setTimeout(() => playTone(659, 0.15, 0.05), 100);
  }, 500);
});
