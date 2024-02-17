

class CircleGrabber extends Grabber {
    constructor(x,y,r2){
        super()
        this.x = x
        this.y = y
        this.r2 = r2
    }
    
    grabbed(x,y){
        let dx = x-this.x
        let dy = y-this.y
        return (dx*dx + dy*dy) < this.r2
    }
}