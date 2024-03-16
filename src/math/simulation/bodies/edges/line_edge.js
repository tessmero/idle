class LineEdge extends Edge {
    
    constructor(a,b,direction=false){
        super()
        this.a = a
        this.b = b
        this.direction = direction
        this.terminals = [0,1]
    }
    
    // settings for particles sliding on edge
    getF(){ return 5e-3 }
    getG(){ return 2e-5 }
    
    getPos(r){
        return va(this.a,this.b,r)
    }
    
    getNorm(a){
        return this.b.sub(this.a).getAngle() + (this.direction ? pio2 : -pio2)
    }
    
    getCircumference(){
        return this.b.sub(this.a).getMagnitude()
    }
}