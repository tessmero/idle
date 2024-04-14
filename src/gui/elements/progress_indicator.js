// progress bar
class ProgressIndicator extends GuiElement {
    
    // valueFunc returns a number 
    // will be truncated to range [0,1]
    constructor(rect,valueFunc){
        super(rect)
        this.valueFunc = valueFunc
        
        this.scale = ProgressIndicator.scale()
        this.outline = true
    }
    
    withOutline(o){
        this.outline = o
        return this
    }
    
    static scale(){ return .5 }
    
    // implement GuiElement
    draw(g){
        
        let r = this.rect
        if( this.outline ){
            g.lineWidth = global.lineWidth
            g.fillStyle = global.fgColor
            g.strokeRect(...r)
        }
        
        //[0,1]
        let progress = this.valueFunc()
        if( progress > 1 ) progress = 1
        if( progress < 0 ) progress = 0
        
        // draw progress
        g.globalCompositeOperation = "xor";
        g.fillStyle = 'black'
        g.fillRect(r[0],r[1],r[2]*progress,r[3])
        g.globalCompositeOperation = "source-over";
    }
}