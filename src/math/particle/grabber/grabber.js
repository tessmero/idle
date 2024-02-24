class Grabber {
    
    // callback f(x,y) when a particle is grabbed
    constructor(f){
        this.grabbed = f
    }
    
    // i is the index of a particle in global.edgeGroup
    canGrabEdgeParticle(i){
        
        // check if we have a EdgeParticleSubgroup instance
        // indicating particles we can't grab
        if(this.eps){
            return !this.eps.hasIndex(i)
        }
        
        return true
    }
    
    // check if point in grab region
    contains(x,y){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}