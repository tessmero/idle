/**
 * @file global object definition.
 *
 * class "Global" has one instance "global".
 */
class Global {

  // graphics context
  canvas = null;
  ctx = null;

  /**
   * Special "root gui element" orphaned GuiScreenPanel.
   * Displays the current main GameScreen instance.
   * assigned in setup.js
   */
  gsp = null;

  /**
   * Prevent setting mainScreen with equals sign
   */
  set mainScreen(_s) { throw new Error('should use global.gsp.setInnerScreen()'); }

  /**
   * allow using global.mainScreen as shorthand
   * to get the current main GameScreen instance.
   */
  get mainScreen() { return this.gsp ? this.gsp.innerScreen : null; }

  //
  colorScheme = ColorScheme.default;
  lineWidth = 0.003;

  // relate screen pixels to virtual 2D units
  canvasOffsetX = 0;
  canvasOffsetY = 0;
  canvasScale = 0;
  centerPos = v(0.5, 0.5);
  screenCorners = null;

  // text
  textPixelSize = 0.01; // fraction of screen size
  textLetterSpace = 1; // text pixels
  textLineSpace = 2; // text pixels
  tooltipPadding = 0.05; // fraction of screen size
  tooltipShadowWidth = 0.01;

  // synchronized gui elements idle animations
  baseAnimPeriod = 500; // ms

  // game state
  upgradeMenuTabIndex = 0;
  t = 0; // total elapsed time
  maxBodyCount = 10;

  // debug
  sandboxMode = false;
  debugCssRects = true;
  debugUiRects = false;
  debugGrabbers = false;
  colorcodeParticles = false;
  showEdgeSpokesA = false;
  showEdgeSpokesB = false;
  showEdgeNormals = false;
  showEdgeVel = false;
  showEdgeAccel = false;

  controlPointLineWidth = 0.005;
  controlPointVisibleHoverRadius = 0.2;

  // game advancement
  particlesCollected = 0;
  upgradeTracks = null; // new UpgradeTracks();
  skillTree = null; // new SkillTree();
  mainSim = null; // ParticleSim instance (setup.js)

  //
  poiStartArea = 1e-2; // free area for new poi

  // strength of "forces" on poi
  // force=(area/accel) in vunits...ms...
  poiPlayerF = 1e-6; // player clicking and dragging
  bodyFriction = 1e-3; // body translation friction
  bodyAngleFriction = 1e-3;
  particleStickyForce = [1e-7, 2e-6]; // passive particle force into edge

  //
  thumbnailSimDims = [0.1, 0.1];
  tutorialSimDims = [0.3, 0.3];
  boxSimDims = [1, 1];
  tutorialScaleFactor = 0.5;

  // mouse
  canvasMousePos = v(0, 0); // pixels
  mouseGrabRadius = 0.002;

  // debug
  debugTileIndices = false;

}
const global = new Global();

function resetProgression() {
  let money = 0;
  const screen = global.mainScreen;
  const sim = screen.sim;
  screen.setTool(screen.toolList[0]);
  sim.rainGroup.n = 100;

  if (global.sandboxMode) {
    money = 1e100;
  }
  sim.particlesCollected = money;

  if (!global.sandboxMode) {

    // remove bodies from start menu sim
    sim.clearBodies();
    sim.rainGroup.grabbedParticles.clear();
  }
  global.upgradeTracks = new UpgradeTracks();
  global.skillTree = new SkillTree();
  updateAllBonuses();
}

/**
 * start helpers to access global vars
 * by dotpath string like "mainSim.rainGroup.n"
 * https: *codereview.stackexchange.com/a/240907
 */

/**
 * @param {any} obj
 */
function isObj(obj) {
  return (typeof obj === 'object') &&
        (!Array.isArray(obj)) &&
        (obj !== null);
}

/**
 *
 * @param {string} propertyStr
 * @param {any} value
 */
function setGlobal(propertyStr, value) {
  const properties = propertyStr.split('.');
  const lastProperty = properties.pop();
  const lastObject = properties.reduce((a, prop) => (isObj(a) ? a[prop] : null), global);
  if (isObj(lastObject)) {
    lastObject[lastProperty] = value;
    return true;
  }
  return false;

}

/**
 *
 * @param {string} propertyStr
 */
function getGlobal(propertyStr) {
  const properties = propertyStr.split('.');
  const lastProperty = properties.pop();
  const lastObject = properties.reduce((a, prop) => (isObj(a) ? a[prop] : null), global);
  if (isObj(lastObject)) {
    return lastObject[lastProperty];
  }
  return null;

}
