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
        ProgressIndicator._draw(
            g,this.rect,this.valueFunc(),this.outline)
    }
    
    // draw bar for progress between 0 and 1
    static _draw(g,rect,progress,outline=true){
        
        //force progress into range [0,1]
        if((!progress) || (progress<0)) 
            progress = 0
        
        if( progress > 1 ) 
            progress = 1
        
        // draw outline
        let r = rect
        if( this.outline ){
            g.lineWidth = global.lineWidth
            g.fillStyle = global.colorScheme.fg
            g.strokeRect(...r)
        }
        
        // draw progress bar
        g.globalCompositeOperation = "xor";
        g.fillStyle = global.colorScheme.fg
        g.fillRect(r[0],r[1],r[2]*progress,r[3])
        g.globalCompositeOperation = "source-over";
    }
}