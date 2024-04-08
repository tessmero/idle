

class CircleGrabber extends Grabber {
    constructor(pos,rad,f,edgeOffset){
        super(f)
        this.pos = pos
        this.rad = rad
        this.r2 = rad*rad
        this.edgeOffset = edgeOffset
    }
    
    drawDebug(g){
        let p = this.pos.xy()
        g.fillStyle = 'yellow'
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,this.rad,0,twopi)
        g.fill()
    }
    
    contains(x,y){
        let dx = x-this.pos.x
        let dy = y-this.pos.y
        let hit = (dx*dx + dy*dy) < this.r2
        
        if( !hit ) return false
        
        let eo = 0
        if( this.edgeOffset ) eo = this.edgeOffset
        
        // return arc length
        let a = Math.atan2(dy,dx)
        if( this.edgeReversed ) a *= -1
        return eo + nnmod(a,twopi)*this.rad
    }
}