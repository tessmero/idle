class SimpleRingReleasePattern extends ReleasePattern{
    // draw released particles 
    draw(g,t){ 
        let speed = global.fallSpeed*5
        t -= this.startTime - this.r/speed
        let particle_radius = global.particle_radius
        let n = this.n
        let a0 = rand() * twopi
        let da = twopi/n
        let r = speed*t
        
        for( let i = 0 ; i < n ; i++ ){
            let a = a0+da*i
            let x = this.x+Math.cos(a)*r
            let y = this.y+Math.sin(a)*r
            g.fillRect( x-particle_radius, y-particle_radius, 2*particle_radius, 2*particle_radius )
        }
    }
}