class LineEdge extends Edge {
    
    constructor(a,b){
        super()
        this.a = a
        this.b = b
    }
    
    getPos(r){
        return va(this.a,this.b,r)
    }
    
    getNorm(a){
        return this.b.sub(this.a).getAngle() - pio2
    }
}