// a button with a pixel art icon
class IconButton extends Button {
    
    constructor(rect,icon,action){
        super(rect,action)
        this.icon = icon
    }
    
    // implement GuiElement
    draw(g){
        super.draw(g)
        drawLayout(g,...rectCenter(...this.rect),this.icon) //character.js
    }
}