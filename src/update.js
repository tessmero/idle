/**
 * @file update function for top-level game loop
 */

let lastCanvasOffsetWidth = -1;
let lastCanvasOffsetHeight = -1;

/**
 * Helper to continuously fit game to browser window.
 */
function fitToContainer() {
  const cvs = global.canvas;
  const screen = global.mainScreen;

  let ow = cvs.offsetWidth;
  let oh = cvs.offsetHeight;
  if (ow === 0) { ow = 200; }
  if (oh === 0) { oh = 200; }

  if ((!global.screenCorners) || (ow !== lastCanvasOffsetWidth) || (oh !== lastCanvasOffsetHeight)) {

    lastCanvasOffsetWidth = ow;
    lastCanvasOffsetHeight = oh;

    cvs.width = ow;
    cvs.height = oh;
    const padding = 0; // Padding around the square region
    const dimension = Math.min(ow, oh) - padding * 2;
    global.canvasScale = dimension;
    global.canvasOffsetX = (ow - dimension) / 2;
    global.canvasOffsetY = (oh - dimension) / 2;
    global.canvasTransform = [global.canvasScale, 0, 0,
      global.canvasScale, global.canvasOffsetX, global.canvasOffsetY];
    if (global.ctx) {
      global.ctx.setTransform(...global.canvasTransform);
    }

    const xr = -global.canvasOffsetX / global.canvasScale;
    const yr = -global.canvasOffsetY / global.canvasScale;

    const sc = [v(xr, yr), v(1 - xr, yr), v(1 - xr, 1 - yr), v(xr, 1 - yr)];
    global.screenCorners = sc;
    const sr = [sc[0].x, sc[0].y, (sc[2].x - sc[0].x), (sc[2].y - sc[0].y)];
    screen.setMainScreenRect(sr);
    screen.stateManager.rebuildGuis(screen, false);
  }
}

/**
 *
 * @param {number} dt The time elapsed in millisecs.
 */
function update(dt) {

  // save Last Update Performance Stats
  global.lupStats = global.livePerformanceStats;

  // start logging performance for this coming update
  global.livePerformanceStats = new LivePerformanceStats();

  global.t = global.t + dt;

  // check for resized window
  fitToContainer();

  // perform full/standard update of main sim and gui
  // may also update descendant boxes
  global.mainScreen.update(dt);

  // make sure all black box heirarchies were updated
  // (in case the descendants weren't updated for some reason)
  // (in case the main screen is itself in a box)
  // (in case of active test with boxes)
  // (in case some other GuiSimPanel was drawn involving separate boxes)
  BoxBuddy.ensureAllBoxesUpdated(dt);
}
