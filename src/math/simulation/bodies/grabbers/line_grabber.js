

class LineGrabber extends Grabber {
    constructor(a,b,rad,f){
        super(f)
        this.a = a
        this.b = b
        this.rad2 = rad*rad
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
        
        return dx*dx + dy*dy < this.rad2
    }
}