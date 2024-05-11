
// Render graphics
function draw() {

  const ctx = global.ctx;
  const g = ctx;

  // limit radius slider for 20240211 demo
  const lim = 0.005 * 5;
  if (global.mainSim.particleRadius > lim) { global.mainSim.particleRadius = lim; }
  if (global.mainSim.particleRadius < -lim) { global.mainSim.particleRadius = -lim; }

  // clear canvas, unless gui requests not to
  const curGui = global.allGuis[global.gameState];
  if (!curGui.stopCanvasClear()) {
    ctx.clearRect(...global.screenRect);
  }

  // draw particles and bodies
  resetRand();
  ctx.fillStyle = global.colorScheme.fg;
  global.mainSim.draw(ctx);

  // if applicable, draw another gui in background
  // e.g. hud behind upgrade menu
  const bgGui = curGui.getBackgroundGui();
  if (bgGui) {
    bgGui.draw(ctx);
  }

  // draw upgrade menu gui transition effect
  global.allGuis[GameStates.upgradeMenu].drawTransitionEffect(g); // upgrade_menu.js

  // draw current gui
  ctx.lineWidth = global.lineWidth;
  global.allGuis[global.gameState].draw(ctx);

  if (global.contextMenu) {
    global.contextMenu.draw(ctx);
  }
  if (global.tooltipPopup) {
    global.tooltipPopup.draw(ctx);
  }

  // draw tool cursor
  const p = global.mousePos.xy();
  const tool = global.mainSim.getTool();
  if (tool) { tool.drawCursor(ctx, p); }

  // draw gui floaters (as apposed to floaters in sims)
  global.floaters.draw(g);

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
