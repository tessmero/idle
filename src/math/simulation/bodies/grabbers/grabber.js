class Grabber {
    
    // callback f(x,y) when a particle is grabbed
    constructor(f=null){
        this.grabbed = f
    }
    
    drawDebug(g){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // check if point in grab region
    // if so, return nearest edge location
    contains(x,y){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // i is the index of a particle in global.mainSim.edgeGroup
    canGrabEdgeParticle(i){
        
        // check if we have a EdgePSubgroup instance
        // indicating particles we can't grab
        if(this.eps){
            return !this.eps.hasIndex(i)
        }
        
        return true
    }
}