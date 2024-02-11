// a button with a pixel art icon
class IconButton extends Button {
    
    constructor(rect,icon,action){
        super(rect,action)
        this.icon = icon
    }
    
    // implement GuiElement
    draw(g){
        super.draw(g)
        
        // draw pixel art icon
        let layout = this.hovered ? 
            this.icon.getCurrentAnimatedLayout() : this.icon.frames[0] //icon.js
        drawLayout(g,...rectCenter(...this.rect),layout) //character.js
    }
}