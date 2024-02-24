class CircleEdge extends Edge {
    
    constructor(pos,rad){
        super()
        this.pos = pos
        this.rad = rad
    }
    
    getPos(a){
        return this.pos.add(vp(a,this.rad))
    }
}