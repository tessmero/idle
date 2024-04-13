
let lastDrawTime = 0
    
// Render graphics
function draw(fps, t) {
    
    var ctx = global.ctx
    let g = ctx
    var canvas = global.canvas
    
    // limit radius slider for 20240211 demo
    let lim = .005*5
    if( global.mainSim.particleRadius > lim ) global.mainSim.particleRadius = lim
    if( global.mainSim.particleRadius < -lim ) global.mainSim.particleRadius = -lim
    
    // draw background
    //ctx.fillStyle = global.bgColor
    ctx.clearRect( ...global.screenRect )
    
    // draw particles and pois
    resetRand()
    ctx.fillStyle = global.fgColor
    global.mainSim.draw(ctx)
    passed_offscreen_count = 0
        
        
    // given the total number of released particles 
    // that just passed off-screen,
    // add to ongoing rain
    //for( let i = 0 ; i < passed_offscreen_count ; i++ )
    //    global.grabbedParticles.add(global.nParticles+i)
    //global.nParticles += passed_offscreen_count
    
    // draw hud gui in background
    if( global.allGuis[global.gameState].hasHudInBackground ){
        global.allGuis[GameStates.playing].draw(ctx) 
    }
    
    // draw upgrade menu gui transition effect
    global.allGuis[GameStates.upgradeMenu].drawTransitionEffect(g) //upgrade_menu.js
    
    // draw current gui
    ctx.lineWidth = global.lineWidth
    global.allGuis[global.gameState].draw(ctx) 

    
    if( global.contextMenu ){
        global.contextMenu.draw(ctx)
    }
    if( global.tooltipPopup ){
        global.tooltipPopup.draw(ctx)
    }


    // draw tool cursor
    let p = global.mousePos.xy()
    let tool = global.toolList[global.selectedToolIndex]
    tool.drawCursor(ctx,p)
    
    // draw tool overlay if applicable
    if( tool.draw ){
        tool.draw(ctx)
    }

    // debug draw mouse
    if( false ){
        let c = global.mousePos
        g.strokeStyle = 'red'
        g.beginPath()
        g.moveTo(c.x,c.y)
        g.arc(c.x,c.y,global.mouseGrabRadius/10,0,twopi)
        g.stroke()
    }
    
    //debug
    if( false && global.debug ){
        drawText(ctx,.5,.5,global.debug)
    }


    if( false ){
        //debug
        // draw screen corners
        var r = .1
        ctx.fillStyle = 'red'
        global.screenCorners.forEach(c => ctx.fillRect( c.x-r, c.y-r, 2*r, 2*r ))
    }
    
    

    // debug 
    if( false ){
        ctx.fillStyle = 'black'
        ctx.font = ".001em Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${global.angleX.toFixed(2)},${global.angleY.toFixed(2)},${global.angleZ.toFixed(2)}`, .5,.5);
    }
}