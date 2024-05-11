
// Main game loop
let secondsPassed;
let oldTimeStamp;
let fps;

function gameLoop(timeStamp) {

  let msPassed = 0;
  if (oldTimeStamp) {
    msPassed = timeStamp - oldTimeStamp;
  }
  oldTimeStamp = timeStamp;

  msPassed = Math.min(msPassed, 50);

  update(msPassed);
  draw(fps);

  requestAnimationFrame(gameLoop);
}

// Initialize the game
function init() {

  const cvs = document.getElementById('gameCanvas');

  cvs.style.width = '100%';
  cvs.style.height = '100%';
  cvs.addEventListener('mousemove', (e) => {
    if (!global.dminput) { mouseMove(e); }
  });
  cvs.addEventListener('mousedown', (e) => {
    if (!global.dminput) { mouseDown(e); }
  });
  cvs.addEventListener('mouseup', (e) => {
    if (!global.dminput) { mouseUp(e); }
  });
  cvs.addEventListener('touchstart', (e) => {
    global.dminput = true;
    mouseDown(e);
  }, false);
  cvs.addEventListener('touchend', (e) => {
    global.dminput = true;
    mouseUp(e);
  }, false);
  cvs.addEventListener('touchcancel', (e) => {
    global.dminput = true;
    mouseUp(e);
  }, false);

  // https://stackoverflow.com/a/63469884
  cvs.addEventListener('touchmove', (e) => {
    global.debug = 'TM';
    const touch = e.touches[0];
    mouseMove({
      clientX: touch.pageX,
      clientY: touch.pageY,
    });
    e.preventDefault();
  });

  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  document.querySelector('body').addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  global.canvas = cvs;
  global.ctx = cvs.getContext('2d');

  // go to start menu
  // calls resetGame() defined further down
  global.mainSim = new MainPSim();
  global.floaters = new FloaterGroup(100);
  quit();

  // ////////////////////////////////////////
  // unit tests 20240505
  const doTests = false;
  if (doTests) {
    doUnitTests();
  }
  else {

    // start game
    requestAnimationFrame(gameLoop);
  }
}

function setColorScheme(cs) {
  global.colorScheme = cs;

  if ((typeof document === 'undefined')) { return; }

  // set html elem background property
  // needed for palette-flip effect
  const gc = document.getElementById('gameCanvas');
  if (gc && gc.style) { gc.style.backgroundColor = global.colorScheme.bg; }
}

function resetGame() {
  setColorScheme(ColorScheme.default);

  // init start menu background sim
  global.t = 0;
  const gms = global.mainSim;
  gms.particlesCollected = 0;

  global.activeReleasePatterns = [];

  global.startMenuTargetPos = v(0.5, 0.5);
  gms.clearBodies();

  resetProgression();
  gms.rainGroup.n = 2000;

  // let poi = new ControlledCircleBody(gms,v(.5,.3),Math.sqrt(global.poiStartArea))
  // gms.addBody(poi)

  const cross = new ControlledCrossBody(gms, v(0.5, 0.45), 5, 0.05, 0.1);
  gms.addBody(cross);

  const comp = new ControlledCompassBody(gms, v(0.15, 0.45), 5, 0.05, 0.1);
  gms.addBody(comp);

  const star = new ControlledStarBody(gms, v(0.85, 0.45), 5, 0.05, 0.1);
  gms.addBody(star);

  resetRand();
  fitToContainer();
}

// Initialize the game
init();

