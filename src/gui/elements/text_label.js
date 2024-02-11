// a line of unchanging on-screen text
class TextLabel extends GuiElement {
    constructor(rect,label){
        super(rect)
        
        this.rect = rect
        this.label = label
        this.scale = 1
        this.pad = .005
        this.center = true
    }
    
    withScale(s){ 
        this.scale = s
        return this
    }
    
    withPad(p){
        this.pad = p
        return this
    }
    
    // implement GuiElement
    draw(g){
        let rect = this.rect
        let label = this.label
        
        let p = rectCenter(...rect)
        if( !this.center ){
            p[0] = rect[0]
            p[1] -= global.textPixelSize
        }
        drawText(g, ...p, label, this.center, this.pad, this.scale, true)
        drawText(g, ...p, label, this.center, 0, this.scale, false)
    }
    
    // implement GuiElement
    click(){
        //do nothing
    }
}