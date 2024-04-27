const global = {
    
    // graphics context
    canvas: null,
    ctx: null,
    

    // 
    colorScheme: ColorScheme.default,
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
    t: 0, // total ellapsed time
    maxBodyCount: 10,
    toolList: [], //list of Tool instances
    floaters: [], //list of Floater instances to draw on top of gui
   
    // debug
    sandboxMode:        false,
    debugUiRects:       false,
    debugGrabbers:      false,
    colorcodeParticles: false,
    showEdgeSpokesA:    true,
    showEdgeSpokesB:    false,
    showEdgeNormals:    false,
    showEdgeVel:        false,
    showEdgeAccel:      false,
    
    controlPointLineWidth: .005,
    controlPointVisibleHoverRadius: .2,
   
    // game advancement
    upgradeTracks: null,//new UpgradeTracks(),
    skillTree: null,//new SkillTree(),
    mainSim: null, //ParticleSim instance (setup.js)
    
    //
    poiStartArea: 1e-2, // free area for new poi
    
    // start menu background anim
    startMenuTargetPos: v(.5,.5),
    startMenuMoveDelay: 1000,
    startMenuMoveCountdown: 0,
    
    
    // strength of "forces" on poi
    // force=(area/accel) in vunits...ms...
    poiPlayerF: 1e-6, // player clicking and dragging
    bodyFriction: 1e-3, // body translation friction
    bodyAngleFriction: 1e-3,
    particleStickyForce: [1e-7,2e-6], // passive particle force into edge
    
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

// start helpers to access global vars
// by dotpath string like "mainSim.rainGroup.n"
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