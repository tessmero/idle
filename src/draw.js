
    
    
// Render graphics
function draw(fps, t) {
    
    var ctx = global.ctx
    let g = ctx
    var canvas = global.canvas
    
    // draw background
    ctx.fillStyle = global.backgroundColor
    ctx.fillRect( ...global.screenRect )
    
    // draw particles
    ctx.fillStyle = 'black'
    resetRand()
    let n_particles = 100
    let sc = global.screenCorners
    let sr = global.screenRect
    let anim_angle = global.t*1e-4
    let particle_radius = .005
    let particle_wiggle = .05
    let md2 = Math.pow(global.mouseGrabRadius,2)
    global.particlesInGrabRange = []
    for( var i = 0 ; i < n_particles ; i++ ){
        var a = anim_angle + rand() * Math.PI*2
        var r = randRange(0,particle_wiggle)
        var x = sr[0] + rand() * sr[2] + r*Math.cos(a * Math.floor(rand()*10))
        var y = sr[1] + nnmod( 3e-5*global.t+randRange(0,sr[3]), sr[3] ) //+ r*Math.sin(a)
        ctx.fillRect( x-particle_radius, y-particle_radius, 2*particle_radius, 2*particle_radius )
        
        //check if in grab radius
        let d2 = global.mousePos.sub(v(x,y)).getD2()
        if( d2 < md2 ) global.particlesInGrabRange.push([x,y,i]) // input.js
    }

    
    // draw gui
    ctx.lineWidth = global.lineWidth
    global.allGuis[global.gameState].draw(ctx)

    // debug draw mouse
    if( true ){
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