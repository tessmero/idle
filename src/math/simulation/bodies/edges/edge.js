// base class for edges which map angles to positions
class Edge {
    getPos(a){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // settings for particles sliding on edge
    getF(){ throw new Error(`Method not implemented in ${this.constructor.name}.`); }
    getG(){ throw new Error(`Method not implemented in ${this.constructor.name}.`); }
}