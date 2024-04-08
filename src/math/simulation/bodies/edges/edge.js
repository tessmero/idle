
// An edge is a boundary that particles interact with
//
// teh shape of the edge is stored in constant set of polar coords
// where the origin is the center of a rotating body outlined by this edge
//
// the edge object is agnostic of the body's state
// so we don't care about the specific position/orientation/momentum
// here we only consider one arbitrary orientation 
class Edge {
    
    computeEdgeShape(){
        
        
        const circ = this.getCircumference()
        
        // compute edge shape
        const n = 1000
        const ndims = 3 // angle, radius, normal angle
        const shape = new Float32Array(n*ndims); 
        for( let i = 0 ; i< n ; i++ ){
            let [angle,radius,norm] = this.computePoint(circ*i/n)
            shape[i*ndims+0] = angle
            shape[i*ndims+1] = radius
            shape[i*ndims+2] = norm
        }
        
        this.circ = circ
        this.n = n
        this.ndims = ndims
        this.shape = shape
    }
    
    // get length of edge (which may loop)
    getCircumference(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // compute position+normal [angle,radius,normal angle] 
    // at given distance along circumerence
    computePoint(d){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // get precomputed [angle,radius,normal angle]
    // at given distance along circumerence
    getPoint(d){
        let i =  Math.round(d*this.n/this.circ)
        i = nnmod(i,this.n)
        i *= this.ndims
        let s = this.shape
        return [s[i],s[i+1],s[i+2]]
    }
    
    // settings for particles sliding on edge
    getFriction(){ return 2e-3 }
    getG(){ return 6e-6 }
}