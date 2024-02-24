

class CircleGrabber extends Grabber {
    constructor(p,r2,f){
        super(f)
        this.p = p
        this.r2 = r2
    }
    
    contains(x,y){
        let dx = x-this.p.x
        let dy = y-this.p.y
        return (dx*dx + dy*dy) < this.r2
    }
}