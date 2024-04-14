// progress bar with optional icon and text
class ProgressIndicator extends StatReadout {
    
    constructor(rect,icon,labelFunc,valueFunc){
        super(rect,icon,labelFunc)
        this.valueFunc = valueFunc
        
        this.scale = ProgressIndicator.scale()
        this.fixedRect = true 
        this.center = true
    }
    
    static scale(){ return .5 }
    
    // implement GuiElement
    draw(g){
        super.draw(g)
        
        // draw outline
        let r = this.rect
        g.lineWidth = global.lineWidth
        g.fillStyle = global.fgColor
        g.strokeRect(...r)
        
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