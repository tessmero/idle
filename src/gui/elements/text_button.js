// a button with text
class TextButton extends Button {
    
    constructor(rect,label,action){
        super(rect,action)
        this.label = label
    }
   
    draw(g){
        super.draw(g)
        drawText(g, ...rectCenter(...this.rect), this.label)
    }
    
}