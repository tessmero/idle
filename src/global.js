
const global = {
    
    // graphics context
    canvas: null,
    ctx: null,
    

    // 
    backgroundColor: '#AAA',
    lineColor: 'black',
    lineWidth: .003,
    
    // relate screen pixels to virtual 2D units
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    canvasScale: 0,
    centerPos: v(.5,.5),
    screenCorners: null, 
    
    
    // text
    textPixelSize: .01, //fraction of screen size
    textLetterSpace: 1, // text pixels
    textLineSpace: 2, // text pixels
    tooltipPadding: .05, //fraction of screen size
    tooltipShadowWidth: .01,
    
    // synchronized gui elements idle animations
    baseAnimPeriod: 500, //ms
    
    // start animating mouse cursor if idle
    idleCountdown: 2000, //state
    idleDelay: 2000, //ms
    
    
    // game state
    gameState: GameStates.startMenu,
    upgradeMenuTabIndex: 0,
    selectedToolIndex: 0,
    t: 0, // total ellapsed time
    maxBodyCount: 10,
    upgradeTracks: new UpgradeTracks(),
    skillTree: new SkillTree(),
    toolList: [], //list of [Tool,Tutorial] instances
   
    // debug
    debugUiRects: false,
    colorcodeParticles: false,
    showEdgeNormals: false,
    showEdgeAccel: false,
    
    controlPointLineWidth: .003,
    controlPointVisibleHoverRadius: .2,
   
    // game advancement
    particlesCollected: 0,
    particlesRequiredToStart: -1, //
    activeReleasePatterns: [], //list of ReleasePattern instances
    mainSim: null, //ParticleSim instance (setup.js)
    //
    poiGrowthRate: 4e-3,// vunits^2 area gained per drop eaten
    poiStartArea: 1e-2, // free area for new poi
    poiPressureBuildRate: 2e-4, // pressure (max 1) increase per ms while held
    poiPressureReleaseRate: 1e-3, 
    poiParticlesReleased: 1e4,// total parts released per unit area at full pressure
    poiDripChance: 5e2, // * normal force = chance of particle unsticking from poi
    
    // start menu background anim
    startMenuTargetPos: v(.5,.5),
    startMenuMoveDelay: 4000,
    startMenuMoveCountdown: 0,
    
    
    // strength of "forces" on poi
    // force=(area/accel) in vunits...ms...
    poiPlayerF: 1e-5, // player clicking and dragging
    bodyFriction: 4e-3, //fraction of speed lost per ms
    
    //
    thumbnailSimDims: [.1,.1],
    tutorialSimDims: [.3,.3],
    tutorialToolScale: .5,
    
    // mouse
    canvasMousePos: v(0,0),     //pixels
    mousePos: v(0,0),           //virtual units
    mouseGrabRadius: .05,
    particlesInMouseRange: new Set(),
    
    //debug
    debugTileIndices: false,
    
}

// access global var by dotpath string 
// like "mainSim.rainGroup.n"
// https://codereview.stackexchange.com/a/240907
function isObj(obj){
    return (typeof obj === 'object') &&
        (!Array.isArray(obj)) &&
        (obj !== null)
}

function set_global(propertyStr, value) {
  const properties = propertyStr.split('.');
  const lastProperty = properties.pop();
  const lastObject = properties.reduce((a, prop) => isObj(a) ? a[prop] : null, global);
  if (isObj(lastObject)) {
    lastObject[lastProperty] = value;
    return true;
  } else {
    return false;
  }
}

function get_global(propertyStr){
  const properties = propertyStr.split('.');
  const lastProperty = properties.pop();
  const lastObject = properties.reduce((a, prop) => isObj(a) ? a[prop] : null, global);
  if (isObj(lastObject)) {
    return lastObject[lastProperty]
  } else {
    return null;
  }
}