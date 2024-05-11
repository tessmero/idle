function keyDown(event) {
  if (event.key === 'Escape') {
    pause();
  }
  if (event.which === 16) {
    global.shiftHeld = true;
  }
  if (event.which === 17) {
    global.controlHeld = true;
  }
}
function keyUp(event) {
  if (event.which === 16) {
    global.shiftHeld = false;
  }
  if (event.which === 17) {
    global.controlHeld = false;
  }
}

function updateMousePos(event) {

  const rect = global.canvas.getBoundingClientRect();
  const scaleX = global.canvas.width / rect.width;
  const scaleY = global.canvas.height / rect.height;

  global.canvasMousePos = new Vector(
    (event.clientX - rect.left) * scaleX,
    (event.clientY - rect.top) * scaleY

  );
  global.mousePos = new Vector(
    (global.canvasMousePos.x - global.canvasOffsetX) / global.canvasScale,
    (global.canvasMousePos.y - global.canvasOffsetY) / global.canvasScale
  );
}

function mouseMove(e) {
  updateMousePos(e);

  // animate cursor if idle
  global.idleCountdown = global.idleDelay;

  // trigger selected tool movement behavior
  const tool = global.mainSim.getTool();
  if (tool) { tool.mouseMove(global.mousePos); }
}

function mouseDown(e) {
  if (global.mouseDownDisabled) { return; }

  // update mouse position
  if (e.touches) {
    mouseMove(e.touches[0]);
  }
  else {
    mouseMove(e);
  }

  global.mouseDown = true;

  // fall through clickable elements

  // context menu
  // (GuiElement instance)
  const cm = global.contextMenu;
  let clicked = false;
  if (cm) {
    clicked = cm.click();
    if (clicked) {
      // console.log('clicked context menu')
      return;
    }
  }

  // current gui
  // (Gui instance) (game_states.js)
  const gui = global.allGuis[global.gameState];
  clicked = gui.click();
  if (clicked) {
    // console.log('clicked fg gui')
    return;
  }

  // hud gui in background of current gui
  if (gui.hasHudInBackground) {
    const hud = global.allGuis[GameStates.playing];
    clicked = hud.click();
  }
  if (clicked) {
    // console.log('clicked bg hud gui')
    return;
  }

  // console.log('click fell through all guis')
  // close the upgrades menu if it is open
  if (global.gameState === GameStates.upgradeMenu) { toggleStats(); }

  // may click simulation with selected tool
  const tool = global.mainSim.getTool();
  if (tool) { tool.mouseDown(global.mousePos); }

}

function mouseUp(_e) {
  global.mainSim.draggingControlPoint = null;
  global.mouseDownDisabled = false;
  global.mouseDown = false;

  // global.mainSim.getBodies().forEach(p => p.isHeld = false )

  // release tool if it was being held down
  const tool = global.mainSim.getTool();
  if (tool) { tool.mouseUp(global.mousePos); }
}
