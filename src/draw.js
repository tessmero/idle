
let lastDrawTime = 0
    
// Render graphics
function draw(fps, t) {
    
    var ctx = global.ctx
    let g = ctx
    var canvas = global.canvas
    
    // draw background
    ctx.fillStyle = global.backgroundColor
    ctx.fillRect( ...global.screenRect )
    
    // draw particles
    ctx.fillStyle = global.lineColor
    resetRand()
    let n_particles = global.nParticles
    let sc = global.screenCorners
    let sr = global.screenRect
    let anim_angle = global.t*1e-4
    let particle_radius = .005
    let particle_wiggle = .05
    let md2 = Math.pow(global.mouseGrabRadius,2)
    global.particlesInGrabRange.clear()
    for( var i = 0 ; i < n_particles ; i++ ){
        var a = anim_angle + rand() * Math.PI*2
        var r = randRange(0,particle_wiggle)
        var x = sr[0] + rand() * sr[2] + r*Math.cos(a * Math.floor(rand()*10))
        var yr = randRange(0,sr[3])
        var rawy = 3e-5*global.t+yr
        var prawy = 3e-5*lastDrawTime+yr
        
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
                global.particlesCollected += 1
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
    
    // draw pois
    global.allPois.forEach( p => p.draw(ctx) )
    
    // draw gui
    ctx.lineWidth = global.lineWidth
    global.allGuis[global.gameState].draw(ctx)

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