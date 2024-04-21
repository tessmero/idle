class Grabber {
    
    // callback f(x,y) when a particle is grabbed
    constructor(f=null){
        this.grabbed = f
    }
    
    withEdgeMap(em){
        this.edgeMap = em
        return this
    }
    
    drawDebug(g){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // check if point in grab region
    // if so, return nearest edge location
    contains(subgroup,i,x,y){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}