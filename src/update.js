let lastCanvasOffsetWidth = -1;
let lastCanvasOffsetHeight = -1;
function fitToContainer() {
  const cvs = global.canvas;

  let ow = cvs.offsetWidth;
  let oh = cvs.offsetHeight;
  if (ow === 0) { ow = 200; }
  if (oh === 0) { oh = 200; }

  if ((ow !== lastCanvasOffsetWidth) || (oh !== lastCanvasOffsetHeight)) {

    lastCanvasOffsetWidth = ow;
    lastCanvasOffsetHeight = oh;

    cvs.width = ow;
    cvs.height = oh;
    const padding = 0; // Padding around the square region
    const dimension = Math.min(ow, oh) - padding * 2;
    global.canvasScale = dimension;
    global.canvasOffsetX = (ow - dimension) / 2;
    global.canvasOffsetY = (oh - dimension) / 2;
    if (global.ctx) {
      global.ctx.setTransform(global.canvasScale, 0, 0,
        global.canvasScale, global.canvasOffsetX, global.canvasOffsetY);
    }

    const xr = -global.canvasOffsetX / global.canvasScale;
    const yr = -global.canvasOffsetY / global.canvasScale;

    const sc = [v(xr, yr), v(1 - xr, yr), v(1 - xr, 1 - yr), v(xr, 1 - yr)];
    global.screenCorners = sc;
    global.screenRect = [sc[0].x, sc[0].y, (sc[2].x - sc[0].x), (sc[2].y - sc[0].y)];

    rebuildGuis(); // game_states.js
  }

  //
  const ms = global.mainScreen;
  ms.rect = global.screenRect;
  ms.sim.rect = global.screenRect;
}

function update(dt) {

  // save Last Update Performance Stats
  global.lupStats = global.performanceStats;

  // start logging performance for this coming update
  global.performanceStats = new PerformanceStats();

  global.t = global.t + dt;
  const sim = global.mainSim;

  // check for resized window
  fitToContainer();

  // advance countdown for user to be considered idle
  if (global.idleCountdown > 0) {
    global.idleCountdown = global.idleCountdown - dt;
  }

  // advance start menu idle background animation
  const bodies = sim.getBodies();
  if (((global.t < global.startMenuMoveDelay) || (global.idleCountdown <= 0)) &&
                    (global.gameState === GameStates.startMenu) &&
                    (bodies.length > 1)) {

    // update target position
    global.startMenuMoveCountdown = global.startMenuMoveCountdown - dt;
    if (global.startMenuMoveCountdown < 0) {
      global.startMenuMoveCountdown = global.startMenuMoveDelay;
      const r = 0.3;
      global.startMenuTargetPos = v(0.5 - r + 2 * r * Math.random(), 0.5 - r + 2 * r * Math.random());
    }
  }

  // update main sim and gui
  global.mainScreen.update(dt);
  global.allGuis[GameStates.upgradeMenu].updateTransitionEffect(dt); // upgrade_menu.js

}
