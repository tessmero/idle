// a line of unchanging on-screen text
class TextLabel extends GuiElement {
    constructor(rect,label){
        super(rect)
        
        this.rect = rect
        this.label = label
        this.scale = 1
        this.pad = .005
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
        
        g.fillStyle = global.backgroundColor
        drawText(g, ...rectCenter(...rect), label, true, this.pad, this.scale)
        g.fillStyle = global.lineColor
        drawText(g, ...rectCenter(...rect), label, true, 0, this.scale)
    }
    
    // implement GuiElement
    click(){
        //do nothing
    }
}