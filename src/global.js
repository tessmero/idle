resetRand()

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
    
    // game state
    gameState: GameStates.startMenu,
    selectedToolIndex: 0,
    t: 0, // total ellapsed time
    allPois: [], // Poi instances
    maxPoiCount: 10,
    poiFriction: 1e-3,//fraction of speed lost per ms
   
    // game advancement
    nParticles: 100, // particles on screen at once
    particlesCollected: 0,
    
    //
    poiShrinkRate: 1e-6,// vunits^2 area lost per ms
    poiGrowthRate: 4e-3,// vunits^2 area gained per drop eaten
    poiStartArea: 1e-4, // free area for new poi
    poiMaxArea: 1e-2,
    poiPressureBuildRate: 1e-3, // pressure (max 1) increase per ms while held
    poiParticlesReleased: 1e3,// total parts released per unit area at full pressure
    
    // strength of "forces" on poi
    // force=(area/accel) in vunits...ms...
    poiPlayerF: 1e-4, // player clicking and dragging
    poiScreenF: 1e-4, // automatic correction if poi is off-screen
    poiNeighborF: 1e-6, // two overlapping pois push eachother
    
    // mouse
    canvasMousePos: v(0,0),     //pixels
    mousePos: v(0,0),           //virtual units
    mouseGrabRadius: .05,
    grabbedParticles: new Set(), // particle indices
    particlesInGrabRange: new Set(),
    
    //debug
    debugTileIndices: false,
    
}