

class RectangleGrabber extends Grabber {
    constructor(x,y,w,h, f){
        super(f)
        this.rect = [x,y,w,h]
    }
    
    contains(x,y){
        return inRect(x,y,...this.rect)
    }
}