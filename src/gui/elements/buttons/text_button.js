// a button with text
class TextButton extends Button {
    
    constructor(rect,label,action){
        super(rect,action)
        this.label = label
        this.scale = 1
        this.center = true
    }
   
    draw(g){
        super.draw(g)
        drawText(g, ...rectCenter(...this.rect), 
            this.label, this.center, 
            new FontSpec(0, this.scale, false))
    }
    
}