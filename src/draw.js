
let lastDrawTime = 0
    
// Render graphics
function draw(fps, t) {
    
    var ctx = global.ctx
    let g = ctx
    var canvas = global.canvas
    
    // draw background
    ctx.fillStyle = global.backgroundColor
    ctx.fillRect( ...global.screenRect )
    
    // draw falling particles
    ctx.fillStyle = global.lineColor
    resetRand()
    let n_particles = global.nParticles
    let sc = global.screenCorners
    let sr = global.screenRect
    let anim_angle = global.t*1e-4
    let particle_radius = global.particle_radius
    let particle_wiggle = global.particle_wiggle
    let md2 = global.mouseGrabMd2
    global.particlesInGrabRange.clear()
    for( var i = 0 ; i < n_particles ; i++ ){
        var a = anim_angle + rand() * Math.PI*2
        var r = randRange(0,particle_wiggle)
        var x = sr[0] + rand() * sr[2] + r*Math.cos(a * Math.floor(rand()*10))
        var yr = randRange(0,sr[3])
        var rawy = global.fallSpeed*global.t+yr
        var prawy = global.fallSpeed*lastDrawTime+yr
        
        // if this particle just looped, ungrab it
        if( Math.floor( rawy / sr[3] ) != Math.floor( prawy / sr[3] ) ){
            global.grabbedParticles.delete(i)
        }
        var y = sr[1] + nnmod( rawy, sr[3] ) //+ r*Math.sin(a)
        
        // check if currently grabbed
        if( global.grabbedParticles.has(i) ) continue
        
        ctx.fillRect( x-particle_radius, y-particle_radius, 2*particle_radius, 2*particle_radius )
        
        //check if in mouse grab radius
        let p = v(x,y)
        let d2 = global.mousePos.sub(p).getD2()
        if( d2 < md2 ){
            if( !global.particlesInGrabRange.has(i) ){
                global.particlesInGrabRange.add(i)
            }
        }
        
        // check if in any passive grab radius
        global.allPois.some( poi => {
            if( poi.pos.sub(p).getD2() < poi.md2 ){ 
                poi.md2 += global.poiGrowthRate 
                if( poi.md2 > global.poiMaxArea ) poi.md2 = global.poiMaxArea
                global.grabbedParticles.add(i)
                return true
            }
        })
        
    }
    lastDrawTime = global.t
    
    // draw released particles
    resetRand()
    let passed_offscreen_count = 0
    global.activeReleasePatterns.forEach(rp => {
        passed_offscreen_count += rp.draw(ctx,global.t)
        
        //check if in mouse grab radius
        let p = v(x,y)
        let d2 = global.mousePos.sub(p).getD2()
        if( d2 < md2 ){
            if( !global.particlesInGrabRange.has(i) ){
                global.particlesInGrabRange.add(i)
            }
        }
        
    })
        
    // given the total number of released particles 
    // that just passed off-screen,
    // add to ongoing rain
    for( let i = 0 ; i < passed_offscreen_count ; i++ )
        global.grabbedParticles.add(global.nParticles+i)
    global.nParticles += passed_offscreen_count
    
    
    // draw pois
    resetRand()
    global.allPois.forEach( p => p.draw(ctx) )
    
    // update gui hovering status and tooltip 
    global.tooltipPopup = null
    global.allGuis[global.gameState].update() // may set global.tooltipPopup
    
    // draw gui
    ctx.lineWidth = global.lineWidth
    global.allGuis[global.gameState].draw(ctx) 

    if( global.tooltipPopup ){
        
        // draw tooltip
        global.tooltipPopup.draw(ctx)
    }

    // draw cursor
    let p = global.mousePos.xy()
    let tool = toolList[global.selectedToolIndex]
    ctx.fillStyle = global.backgroundColor
    tool.drawCursor(ctx,p,.01)
    ctx.fillStyle = global.lineColor
    tool.drawCursor(ctx,p,0)

    // debug draw mouse
    if( false ){
        let c = global.mousePos
        g.strokeStyle = 'red'
        g.beginPath()
        g.moveTo(c.x,c.y)
        g.arc(c.x,c.y,global.mouseGrabRadius,0,twopi)
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