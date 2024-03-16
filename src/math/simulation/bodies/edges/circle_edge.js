class CircleEdge extends Edge {
    
    constructor(pos,rad){
        super()
        this.pos = pos
        this.rad = rad
        this.terminals = [0,twopi]
    }
    
    // settings for particles sliding on edge
    getF(){ return 4e-5 }
    getG(){ return 2e-5 }
    
    getPos(a){
        return this.pos.add(vp(a,this.rad))
    }
    
    getNorm(a){
        return a
    }
    
    getCircumference(){
        return twopi*this.rad
    }
}