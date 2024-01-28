
// release procedural particles from a poi

class ReleasePattern {
    
    constructor(n,x,y,r){
        this.n = n // total number of particles
        this.x = x
        this.y = y
        this.r = r
        this.startTime = global.t
    }
    
    // draw particles 
    // released t ms ago
    draw(g,t){ throw new Error('not implemented') }
}