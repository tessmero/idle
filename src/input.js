/**
 * @file base input handlers
 *
 * browser event listeners are bound in setup.js
 *
 * here we recieve real user inputs
 * and pass them to global.mainScreen (game_screen.js)
 */

/**
 * compute mouse position in game units
 * @param {object} event The input event object.
 * @returns {Vector} The in-game position of the mouse.
 */
function computeGameMousePos(event) {

  const rect = global.canvas.getBoundingClientRect();
  const scaleX = global.canvas.width / rect.width;
  const scaleY = global.canvas.height / rect.height;

  const canvasMousePos = new Vector(
    (event.clientX - rect.left) * scaleX,
    (event.clientY - rect.top) * scaleY

  );
  const mousePos = new Vector(
    (canvasMousePos.x - global.canvasOffsetX) / global.canvasScale,
    (canvasMousePos.y - global.canvasOffsetY) / global.canvasScale
  );
  return mousePos;
}

function mouseMove(e) {
  const vPos = computeGameMousePos(e);

  global.mainScreen.mouseMove(vPos);

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
  global.mainScreen.mouseDown(e);

}

function mouseUp(e) {
  global.mainScreen.sim.draggingControlPoint = null;
  global.mouseDownDisabled = false;
  global.mouseDown = false;

  global.mainScreen.mouseUp(e);
}

function keyDown(event) {
  // if (event.key === 'Escape') {
  //  pause();
  // }
  if (event.which === 16) {
    global.shiftHeld = true;

    // testSound();
  }
  if (event.which === 17) {
    global.controlHeld = true;
  }

  // console.log(event.which);
}

function keyUp(event) {
  if (event.which === 16) {
    global.shiftHeld = false;
  }
  if (event.which === 17) {
    global.controlHeld = false;
  }
}
