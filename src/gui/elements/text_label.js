// a line of unchanging on-screen text
class TextLabel extends GuiElement {
    constructor(rect,label){
        super()
        
        this.rect = rect
        this.label = label
    }
    
    // implement GuiElement
    draw(g){
        let rect = this.rect
        let label = this.label
        
        g.fillStyle = global.backgroundColor
        drawText(g, ...rectCenter(...rect), label, true, .05)
        g.fillStyle = global.lineColor
        drawText(g, ...rectCenter(...rect), label, true, 0)
    }
    
    // implement GuiElement
    click(){
        //do nothing
    }
}