

function update(dt) {  
    let sim = global.mainSim  
    
    // check for resized window
    fitToContainer()    
    
    // advance countdown for user to be considered idle
    if( global.idleCountdown > 0 ){
        global.idleCountdown -= dt
    }
    
    // advance start menu idle background animation
    if( ((global.t<global.startMenuMoveDelay)||(global.idleCountdown <= 0)) 
                    && (global.gameState==GameStates.startMenu) 
                    && (sim.allBodies.size > 1) ){
            
        let bodies =  Array.from(sim.allBodies)
        
        // move circle
        if( true ){
            let poi = bodies[0].circle
            let d = global.startMenuTargetPos.sub(poi.pos)
            let d2 = d.getD2()
            let fr = [1e-4,1e-2] // no force d2, full force d2
            if( d2 > fr[0]){
                let angle = d.getAngle()
                let f = global.poiPlayerF 
                if(d2<fr[1])
                    f *= (d2-fr[0])/(fr[1]-fr[0])
                let acc = vp( angle, f ).mul(dt)
                poi.accel(acc)
            }
        }
            
        // update target position
        global.startMenuMoveCountdown -= dt
        if( global.startMenuMoveCountdown < 0 ){
            global.startMenuMoveCountdown = global.startMenuMoveDelay
            let r = .3
            global.startMenuTargetPos = v( .5-r + 2*r*Math.random(), .5-r + 2*r*Math.random() )
        }
    }
    
    // delete popups, knowing that any persistent 
    // popups will be reinstated below
    global.contextMenu = null
    global.tooltipPopup = null
    
    // update context menu 
    if( sim.selectedBody ){
       let bod = sim.selectedBody
       let rect = [...sim.rect]
       let topMargin = .1
       let bottomMargin = .1
       let sideMargin = .1
       rect[1] += topMargin
       rect[3] -= (topMargin+bottomMargin)
       rect[0] += sideMargin
       rect[2] -= 2*sideMargin
       let cmr = ContextMenu.pickRects(rect,bod.pos)
       global.contextMenu = new BodyContextMenu(...cmr,bod)
    }
    
    // update main gui
    if( global.allGuis[global.gameState].hasHudInBackground ){
        global.allGuis[GameStates.playing].update(dt)
    }
    global.allGuis[global.gameState].update(dt) 
    
    
    // update popups just in case they are persistent
    if( global.contextMenu ){
        global.contextMenu.update(dt)
    }
    if( global.tooltipPopup ){
        global.tooltipPopup.update(dt)
    }
    
    //// stop if game is paused
    if( global.gameState==GameStates.pauseMenu ) return
    
    global.t += dt
    sim.update(dt)
    
    // trigger passive tool behavior
    global.toolList[global.selectedToolIndex].update(dt)
    
    // upgrades menu transition effect (upgrade_menu.js)
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