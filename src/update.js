

function update(dt) {    
    
    // check for resized window
    fitToContainer()    
    
    // advance countdown for user to be considered idle
    if( global.idleCountdown > 0 ){
        global.idleCountdown -= dt
    }
    
    // advance start menu idle background animation
    if( ((global.t<global.startMenuMoveDelay)||(global.idleCountdown <= 0)) && (global.gameState==GameStates.startMenu) && (global.mainSim.allPois.length > 0) ){
        
        
        // accel to target
        let poi = global.mainSim.allPois[0]
        let d = global.startMenuTargetPos.sub(poi.pos)
        let d2 = d.getD2()
        if( d2 > 1e-4 )
            poi.accel( vp( d.getAngle(), .5*global.poiPlayerF/poi.md2 ).mul(dt) )  
        
        // update target position
        global.startMenuMoveCountdown -= dt
        if( global.startMenuMoveCountdown < 0 ){
            global.startMenuMoveCountdown = global.startMenuMoveDelay
            let r = .3
            global.startMenuTargetPos = v( .5-r + 2*r*Math.random(), .5-r + 2*r*Math.random() )
        }
    }
    
    // update gui hovering status and tooltip 
    global.tooltipPopup = null
    if( global.allGuis[global.gameState].hasHudInBackground ){
        global.allGuis[GameStates.playing].update(dt) // hud may set global.tooltipPopup
    }
    global.allGuis[global.gameState].update(dt) // gui in front may set global.tooltipPopup
    
    //// stop if game is paused
    if( global.gameState==GameStates.pauseMenu ) return
    
    global.t += dt
    global.mainSim.update(dt)
    
    // trigger passive tool behavior
    toolList[global.selectedToolIndex].update(dt)
    
    // upgrades menu transtiino effect
    global.allGuis[GameStates.upgradeMenu].updateTransitionEffect(dt)
    
}

var lastCanvasOffsetWidth = -1;
var lastCanvasOffsetHeight = -1;
function fitToContainer(){
    
    var cvs = global.canvas
    if( (cvs.offsetWidth!=lastCanvasOffsetWidth) || (cvs.offsetHeight!=lastCanvasOffsetHeight) ){
        
        lastCanvasOffsetWidth = cvs.offsetWidth
        lastCanvasOffsetHeight = cvs.offsetHeight
        
      cvs.width  = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
        var padding = 0; // Padding around the square region
        var dimension = Math.min(cvs.width, cvs.height) - padding * 2;
        global.canvasScale = dimension;
        global.canvasOffsetX = (cvs.width - dimension) / 2;
        global.canvasOffsetY = (cvs.height - dimension) / 2;
    global.ctx.setTransform(global.canvasScale, 0, 0, 
        global.canvasScale, global.canvasOffsetX, global.canvasOffsetY);
        
        var xr = -global.canvasOffsetX / global.canvasScale
        var yr = -global.canvasOffsetY / global.canvasScale
        
        let sc = [v(xr,yr),v(1-xr,yr),v(1-xr,1-yr),v(xr,1-yr)]
        global.screenCorners = sc 
        global.screenRect = [sc[0].x,sc[0].y,(sc[2].x-sc[0].x),(sc[2].y-sc[0].y)]
        rebuildGuis() //game_states.js
    }
    
    global.mainSim.rect = global.screenRect
}