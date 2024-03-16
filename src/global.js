
const global = {
    
    // graphics context
    canvas: null,
    ctx: null,
    

    // 
    backgroundColor: '#AAA',
    lineColor: 'black',
    lineWidth: .002,
    
    // relate screen pixels to virtual 2D units
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    canvasScale: 0,
    centerPos: v(.5,.5),
    screenCorners: null, 
    
    
    // text
    textPixelSize: .01, //virtual units
    textLetterSpace: 2, // text pixels
    
    
    // syncronized gui elements idle animations
    baseAnimPeriod: 500, //ms
    
    // start animating mouse cursor if idle
    idleCountdown: 2000, //state
    idleDelay: 2000, //ms
    
    // particle settings now in particle_sim.js
    //fallSpeed: 2e-4, // downward movement
    //particleRadius: .005,
    //wiggle: .05, //horizontal movement
    //particleG: v(0,1e-7), // gravity accel dist/ms/ms
    
    // physics particle settings
    // physics_pgroup.js friction computed to match rain
    //particleFriction: 1e-4, //fraction of speed lost per ms
    
    
    // game state
    gameState: GameStates.startMenu,
    upgradeMenuTabIndex: 0,
    selectedToolIndex: 0,
    t: 0, // total ellapsed time
    maxBodyCount: 10,
    upgradeTracks: new UpgradeTracks(),
    skillTree: new SkillTree(),
   
    // debug
    colorcodeParticles: false,
    showEdgeNormals: false,
    showEdgeAccel: false,
    
   
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
    poiScreenF: 1e-7, // automatic correction if poi is off-screen
    poiNeighborF: 1e-7, // two overlapping pois push eachother
    
    poiFriction: 4e-3, //fraction of speed lost per ms
    
    // mouse
    canvasMousePos: v(0,0),     //pixels
    mousePos: v(0,0),           //virtual units
    mouseGrabRadius: .05,
    mouseGrabMd2: .05*.05,
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