
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
    
    // return newly released particles' [x,y,vx,vy]
    // return empty list to wait
    // return null to finish
    update(t){ 
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}