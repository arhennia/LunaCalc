// src/renderer/js/drag.js

document.addEventListener('DOMContentLoaded', () => {
  const dragHandle = document.getElementById('drag-handle');
  let isDragging = false;
  let startX, startY;

  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.screenX;
    startY = e.screenY;

    // Apply visual feedback during drag
    document.body.style.opacity = '0.88';
    dragHandle.style.cursor = 'grabbing';
    
    // Notify Luna state (e.g. eyes squint)
    if (window.luna) window.luna.setMood('curious');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.screenX - startX;
    const deltaY = e.screenY - startY;

    startX = e.screenX;
    startY = e.screenY;

    // Send to main process via context bridge
    if (window.lunaAPI) {
        window.lunaAPI.moveWindow(deltaX, deltaY);
    } else if (window.luna) {
        // Fallback for direct electron access if contextBridge wasn't used correctly
        // (Though we should use window.luna exposed in index.html)
        window.luna.moveWindow(deltaX, deltaY);
    }
    // Using the name from the preload script
    if (window.luna && window.luna.moveWindow) {
        window.luna.moveWindow(deltaX, deltaY);
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.opacity = '1';
    dragHandle.style.cursor = 'grab';
    
    if (window.luna) window.luna.setMood('default');
  });
});
