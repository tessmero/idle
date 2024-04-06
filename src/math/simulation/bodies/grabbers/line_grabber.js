

class LineGrabber extends Grabber {
    constructor(a,b,rad,f,edgeOffsetA,edgeOffsetB){
        super(f)
        this.a = a
        this.b = b
        this.rad = rad
        this.rad2 = rad*rad
        
        this.edgeOffsetA = edgeOffsetA
        this.edgeOffsetB = edgeOffsetB
    }
    
    drawDebug(g){
        g.strokeStyle = 'yellow'
        g.lineWidth = this.rad*2
        g.beginPath()
        g.moveTo(...this.a.xy())
        g.lineTo(...this.b.xy())
        g.stroke()
    }
    
    contains(x,y){
        let dx = x-this.a.x
        let dy = y-this.a.y
        let d = this.b.sub(this.a)
        let r = (dx*d.x + dy*d.y) / d.getD2()
        if( (r<0) || (r>1) )
            return false
        
        // nearest point on line
        let px = this.a.x + d.x*r
        let py = this.a.y + d.y*r
        
        dx = px-x
        dy = py-y
        
        let hit = dx*dx + dy*dy < this.rad2
        if( !hit ) return null
        
        // return 1D edge location
        let cw = clockwise(this.a,this.b,v(x,y)) // which side (boolean)
        let len = this.a.sub(this.b).getMagnitude()
        r *= len
        return cw ? this.edgeOffsetA+r : this.edgeOffsetB+r
    }
}