
// Render graphics
function draw() {
  const ctx = global.ctx;
  const g = ctx;

  // limit radius slider for sandbox debug menu
  const lim = 0.005 * 5;
  if (global.mainSim.particleRadius > lim) { global.mainSim.particleRadius = lim; }
  if (global.mainSim.particleRadius < -lim) { global.mainSim.particleRadius = -lim; }

  // draw main sim and gui
  global.mainScreen.draw(g);

  // debug draw mouse
  const debugMouse = false;
  if (debugMouse) {
    const c = global.mousePos;
    g.strokeStyle = 'red';
    g.beginPath();
    g.moveTo(c.x, c.y);
    g.arc(c.x, c.y, global.mouseGrabRadius / 10, 0, twopi);
    g.stroke();
  }

  // debug screen corners
  const debugCorners = false;
  if (debugCorners) {
    const r = 0.1;
    ctx.fillStyle = 'red';
    global.screenCorners.forEach((c) => ctx.fillRect(c.x - r, c.y - r, 2 * r, 2 * r));
  }

}
