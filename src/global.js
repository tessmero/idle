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
    t: 0, // total ellapsed time
    
    // mouse
    canvasMousePos: v(0,0),     //pixels
    mousePos: v(0,0),           //virtual units
    mouseGrabRadius: .05,
    
    
    //debug
    debugTileIndices: false,
    
}