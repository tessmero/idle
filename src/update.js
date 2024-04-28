

function update(dt) {  
    let sim = global.mainSim  
    
    // check for resized window
    fitToContainer()    
    
    // advance countdown for user to be considered idle
    if( global.idleCountdown > 0 ){
        global.idleCountdown -= dt
    }
    
    // advance start menu idle background animation
    let bodies =  sim.getBodies()
    if( ((global.t<global.startMenuMoveDelay)||(global.idleCountdown <= 0)) 
                    && (global.gameState==GameStates.startMenu) 
                    && (bodies.length > 1) ){
            
        
        // move circle
        if( false ){
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
    
    // identify gui state
    let curGui = global.allGuis[global.gameState]
    
    // delete popups, knowing that any persistent 
    // popups will be reinstated below
    global.contextMenu = null
    global.tooltipPopup = null
    
    // update context menu 
    if( global.gameState!=GameStates.playing ){
        sim.selectedBody = null
        global.contextMenu = null
        
    } else if( sim.selectedBody ){
       let bod = sim.selectedBody
       let rect = curGui.getScreenEdgesForContextMenu()
       let cmr = ContextMenu.pickRects(rect,bod.pos)
       
       if( bod instanceof Buddy ){
            global.contextMenu = new BuddyContextMenu(...cmr,bod)
       } else {
            global.contextMenu = new BodyContextMenu(...cmr,bod)
       }
       
    } else if( sim.selectedParticle ){
       let p = sim.selectedParticle
       let [subgroup,i,x,y,dx,dy,hit] = p
       let rect = curGui.getScreenEdgesForContextMenu()
       let cmr = ContextMenu.pickRects(rect,v(x,y))
       global.contextMenu = new PiContextMenu(...cmr,p)
        
    }
    
    // update main gui
    // if applicable, update another gui in background
    // e.g. hud behind upgrade menu
    let bgGui = curGui.getBackgroundGui()
    if( bgGui ){
        if( global.gameState == GameStates.startTransition ){
            // skip bg hud updates during start transition
        } else {
            bgGui.update(dt) 
        }
    }
    curGui.update(dt) 
    
    
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
    let tool = global.mainSim.getTool()
    if( tool ) tool.update(dt)
    
    // upgrades menu transition effect (upgrade_menu.js)
    global.allGuis[GameStates.upgradeMenu].updateTransitionEffect(dt)
    
    // gui floaters 
    global.floaters = global.floaters.filter(f => f.update(dt))
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