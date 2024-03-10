class LineEdge extends Edge {
    
    constructor(a,b){
        super()
        this.a = a
        this.b = b
    }
    
    // settings for particles sliding on edge
    getF(){ return 5e-3 }
    getG(){ return 3e-6 }
    
    getPos(r){
        return va(this.a,this.b,r)
    }
    
    getNorm(a){
        return this.b.sub(this.a).getAngle() - pio2
    }
}