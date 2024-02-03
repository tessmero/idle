class SimpleRingReleasePattern extends ReleasePattern{
    
    constructor(...p){
        super(...p)
        
        // prepare to keep track of OOB particles
        this.offScreen = new Array(this.n).fill(false)
    
        // prepare to keep track of particles grabbed by the player
        this.inGrabRange = []
    }
    
    // draw released particles
    // return the number of particles that just passed off-screen
    draw(g,t){ 
        let result = 0
    
        let speed = global.fallSpeed*5
        t -= this.startTime - this.r/speed
        let particle_radius = global.particle_radius
        let n = this.n
        let a0 = rand() * twopi
        let da = twopi/n
        let r = speed*t
        this.inGrabRange.length = 0
        for( let i = 0 ; i < n ; i++ ){
            if( this.offScreen[i] ) continue //skip particles that previously passed off-screen
            
            let a = a0+da*i
            let x = this.x+Math.cos(a)*r
            let y = this.y+Math.sin(a)*r
            
            if( !inRect( x,y, ...global.screenRect ) ){
                //particle just passed off-screen
                this.offScreen[i] = true
                result += 1
            }
            
            ///
            let p = v(x,y)
            let d2 = global.mousePos.sub(p).getD2()
            if( d2 < global.mouseGrabMd2 ){
                this.inGrabRange.push(i)
            }
            
            // draw particle
            g.fillRect( x-particle_radius, y-particle_radius, 2*particle_radius, 2*particle_radius )
        }
        
        return result
    }
}