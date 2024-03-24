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
    
    getAngle(){
        return this.b.sub(this.a).getAngle()
    }
    
    // implement edge
    getPos(r){
        return va(this.a,this.b,r)
    }
    
    // implement edge
    getNorm(a){
        return this.getAngle() + (this.direction ? pio2 : -pio2)
    }
    
    // implement edge
    getCircumference(){
        return this.b.sub(this.a).getMagnitude()
    }
}