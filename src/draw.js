
/**
 * @file Top level draw function for main game loop.
 */
function draw() {
  const g = global.ctx;
  const screen = global.mainScreen;
  const sim = screen.sim;

  // limit radius slider for sandbox debug menu
  const lim = 0.005 * 5;
  if (sim.particleRadius > lim) { sim.particleRadius = lim; }
  if (sim.particleRadius < -lim) { sim.particleRadius = -lim; }

  // draw main sim and gui
  screen.sim.rect = screen.rect;
  screen.draw(g);

  // debug draw mouse
  const debugMouse = false;
  if (debugMouse) {
    const c = global.mainScreen.mousePos;
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
