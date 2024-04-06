

class CircleGrabber extends Grabber {
    constructor(p,rad,f,edgeOffset){
        super(f)
        this.p = p
        this.rad = rad
        this.r2 = rad*rad
        this.edgeOffset = edgeOffset
    }
    
    drawDebug(g){
        g.fillStyle = 'yellow'
        g.beginPath()
        g.moveTo(...this.p.xy())
        g.arc(...this.p.xy(),this.rad,0,twopi)
        g.fill()
    }
    
    contains(x,y){
        let dx = x-this.p.x
        let dy = y-this.p.y
        let hit = (dx*dx + dy*dy) < this.r2
        
        if( !hit ) return false
        
        // return arc length
        let a = Math.atan2(dy,dx)
        return nnmod(a,twopi)*this.rad
    }
}