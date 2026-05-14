// src/renderer/js/animations.js

class AnimationController {
  constructor() {
    this.container = document.querySelector('.app-container');
    this.head = document.querySelector('.cat-head');
    this.tail = document.querySelector('.cat-tail');
  }

  shake() {
    this.container.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-3px)' },
      { transform: 'translateX(3px)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(0)' }
    ], {
      duration: 300,
      easing: 'ease-in-out'
    });
  }

  flickTail() {
    this.tail.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-8deg)' },
      { transform: 'rotate(8deg)' },
      { transform: 'rotate(-4deg)' },
      { transform: 'rotate(0deg)' }
    ], {
      duration: 600,
      easing: 'ease-in-out'
    });
  }
}

window.anim = new AnimationController();
