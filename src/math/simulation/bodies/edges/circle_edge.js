class CircleEdge extends Edge {
    
    constructor(pos,rad){
        super()
        this.pos = pos
        this.rad = rad
    }
    
    // settings for particles sliding on edge
    getF(){ return 5e-4 }
    getG(){ return 2e-6 }
    
    getPos(a){
        return this.pos.add(vp(a,this.rad))
    }
    
    getNorm(a){
        return a
    }
}