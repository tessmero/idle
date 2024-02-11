
// release procedural particles from a poi
// each instance represents a specific event
class ReleasePattern {
    
    constructor(n,x,y,r){
        this.n = n // total number of particles
        this.x = x
        this.y = y
        this.r = r
        this.startTime = global.t
    }
    
    // draw particles
    // return the number of particles that just passed off-screen
    draw(g){ throw new Error('not implemented') }
}