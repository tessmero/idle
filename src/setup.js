/**
 * @file Top-level game setup and loop.
 */

let secondsPassed;
let oldTimeStamp;
let fps;

/**
 * Game loop function that is called repeatedly.
 * @param {number} timeStamp The system time in milliecs.
 */
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

/**
 * Initialize the game
 */
function init() {

  // start keeping track of stats
  global.logPerformanceStats = new LogPerformanceStats();

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

  const sim = new MainPSim();
  sim.usesGlobalCurrency = true;
  const gsm = new GameStateManager();
  const screen = new GameScreen('root screen', [0, 0, 1, 1], sim, gsm);
  global.rootScreen = screen;
  global.gsp = new GuiScreenPanel(screen.rect, screen);
  global.gsp.setScreen = () => {
    throw new Error('can only use global.gsp.setInnerScreen()');
  };
  screen.stateManager.quit();

  const doTests = false;
  if (doTests) {
    doUnitTests();
  }
  else {

    // start game
    requestAnimationFrame(gameLoop);
  }
}

/**
 *
 * @param {object} cs
 */
function setColorScheme(cs) {
  global.colorScheme = cs;

  if ((typeof document === 'undefined')) { return; }

  // set html elem background property
  // needed for palette-flip effect
  const gc = document.getElementById('gameCanvas');
  if (gc && gc.style) { gc.style.backgroundColor = global.colorScheme.bg; }
}

/**
 *
 */
function resetGame() {
  setColorScheme(ColorScheme.default);

  // init start menu background sim
  global.t = 0;
  const sim = global.mainScreen.sim;
  sim.particlesCollected = 0;

  global.activeReleasePatterns = [];

  global.startMenuTargetPos = v(0.5, 0.5);
  sim.clearBodies();

  resetProgression();
  sim.rainGroup.n = 2000;

  // let poi = new ControlledCircleBody(sim,v(.5,.3),Math.sqrt(global.poiStartArea))
  // sim.addBody(poi)

  const cross = new DefaultControlFrame(
    new CrossBody(sim, v(0.5, 0.45)));
  sim.addBody(cross);

  const comp = new DefaultControlFrame(
    new CompassBody(sim, v(0.15, 0.45)));
  sim.addBody(comp);

  const nTips = 5;
  const star = new DefaultControlFrame(
    new StarBody(sim, v(0.85, 0.45), nTips, 0.05, 0.1));
  sim.addBody(star);

  resetRand();
  fitToContainer();
}

// Initialize the game
init();

