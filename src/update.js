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

  global.mainSim.rect = global.screenRect;
}

function update(dt) {
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

  // identify gui state
  const curGui = global.allGuis[global.gameState];

  // delete popups, knowing that any persistent
  // popups will be reinstated below
  if (!(global.contextMenu instanceof TestContextMenu)) {
    global.contextMenu = null;
  }
  global.tooltipPopup = null;

  // update context menu
  if (global.gameState !== GameStates.playing) {
    sim.selectedBody = null;

  }
  else if (sim.selectedBody) {
    const bod = sim.selectedBody;
    let bodPos = bod.pos;
    if (bod instanceof CompoundBody) {
      bodPos = bod.getMainBody().pos;
    }
    const rect = curGui.getScreenEdgesForContextMenu();
    const cmr = ContextMenu.pickRects(rect, bodPos);

    if (bod instanceof Buddy) {
      global.contextMenu = new BuddyContextMenu(...cmr, bod);
    }
    else {
      global.contextMenu = new BodyContextMenu(...cmr, bod);
    }

  }
  else if (sim.selectedParticle) {
    const p = sim.selectedParticle;
    const [_subgroup, _i, x, y, _dx, _dy, _hit] = p;
    const rect = curGui.getScreenEdgesForContextMenu();
    const cmr = ContextMenu.pickRects(rect, v(x, y));
    global.contextMenu = new PiContextMenu(...cmr, p);

  }

  // update popups just in case they are persistent
  let disableHover = false;
  if (global.contextMenu) {
    disableHover = global.contextMenu.update(dt, disableHover);
  }

  // update main gui
  disableHover = curGui.update(dt, disableHover) || disableHover;

  // if applicable, update another gui in background
  // e.g. hud behind upgrade menu
  const bgGui = curGui.getBackgroundGui();
  if (bgGui) {
    if (global.gameState === GameStates.startTransition) {
      // skip bg hud updates during start transition
    }
    else {
      bgGui.update(dt, disableHover);
    }
  }

  // update popups just in case they are persistent
  if (global.tooltipPopup) {
    global.tooltipPopup.update(dt);
  }

  // // stop if game is paused
  if (global.gameState === GameStates.pauseMenu) { return; }

  global.t = global.t + dt;
  sim.update(dt);

  // trigger passive tool behavior
  const tool = global.mainSim.getTool();
  if (tool) { tool.update(dt); }

  // upgrades menu transition effect (upgrade_menu.js)
  global.allGuis[GameStates.upgradeMenu].updateTransitionEffect(dt);
}
