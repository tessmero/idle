

class RectangleGrabber extends Grabber {
    constructor(...rect){
        super()
        this.rect = rect
    }
    
    grabbed(x,y){
        return inRect(x,y,...this.rect)
    }
}