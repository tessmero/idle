
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
    textLetterSpace: 1, // text pixels
    
    
    // syncronized gui elements idle animations
    baseAnimPeriod: 500, //ms
    
    // start animating mouse cursor if idle
    idleCountdown: 0, //state
    idleDelay: 2000, //ms
    
    // procedural particle settings
    fallSpeed: 7e-5, // downward movement
    particleRadius: .005,
    particleWiggle: .05, //horizontal movement
    
    // physics particle settings
    // physics_pgroup.js friction computed to match rain
    //particleFriction: 1e-4, //fraction of speed lost per ms
    particleG: v(0,1e-7), // gravity accel dist/ms/ms
    
    
    // game state
    gameState: GameStates.startMenu,
    selectedToolIndex: 0,
    t: 0, // total ellapsed time
    allPois: [], // Poi instances
    maxPoiCount: 10,
   
    
   
    // game advancement
    nParticles: 100, // particles on screen at once
    particlesCollected: 0,
    particlesRequiredToStart: -1, //
    activeReleasePatterns: [], //list of ReleasePattern instances
    rainGroup: null, //instance of ProceduralPGroup
    physicsGroup: null, //instance of PhysicsPGroup
    edgeGroup: null, //instance of EdgePGroup
    grabbers: new Set(), //instances of Grabber
    
    //
    poiShrinkRate: 1e-6,// vunits^2 area lost per ms
    poiGrowthRate: 4e-3,// vunits^2 area gained per drop eaten
    poiStartArea: 1e-2, // free area for new poi
    poiMaxArea: 1e-2,
    poiPressureBuildRate: 2e-4, // pressure (max 1) increase per ms while held
    poiPressureReleaseRate: 1e-3, 
    poiParticlesReleased: 1e4,// total parts released per unit area at full pressure
    poiDripChance: 1e-3, // chance per ms of particle unsticking from poi
    
    
    
    // strength of "forces" on poi
    // force=(area/accel) in vunits...ms...
    poiPlayerF: 4e-8, // player clicking and dragging
    poiScreenF: 1e-7, // automatic correction if poi is off-screen
    poiNeighborF: 1e-7, // two overlapping pois push eachother
    
    poiFriction: 2e-3, //fraction of speed lost per ms
    
    // mouse
    canvasMousePos: v(0,0),     //pixels
    mousePos: v(0,0),           //virtual units
    mouseGrabRadius: .05,
    mouseGrabMd2: .05*.05,
    particlesInMouseRange: new Set(),
    
    //debug
    debugTileIndices: false,
    
}