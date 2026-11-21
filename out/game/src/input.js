// Shade Run — keyboard + mouse input.
export function createInput(canvas) {
  const keys = new Set();
  const pressed = new Set();
  const mouse = { x: 0, y: 0, down: false };

  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (!keys.has(e.code)) pressed.add(e.code);
    keys.add(e.code);
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
    mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
  });
  canvas.addEventListener('mousedown', () => { mouse.down = true; });
  window.addEventListener('mouseup', () => { mouse.down = false; });

  return {
    keys,
    mouse,
    moveAxis() {
      let dx = 0, dy = 0;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) dx -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) dx += 1;
      if (keys.has('KeyW') || keys.has('ArrowUp')) dy -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) dy += 1;
      const len = Math.hypot(dx, dy);
      return len ? { x: dx / len, y: dy / len } : { x: 0, y: 0 };
    },
    isSneaking() {
      return keys.has('ShiftLeft') || keys.has('ShiftRight');
    },
    wasPressed(code) {
      return pressed.has(code);
    },
    endFrame() {
      pressed.clear();
    },
  };
}
