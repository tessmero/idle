// base class for edges which map angles to positions
class Edge {
    getPos(a){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}