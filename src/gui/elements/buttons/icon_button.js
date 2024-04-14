// a button with a pixel art icon
class IconButton extends Button {
    
    constructor(rect,icon,action){
        super(rect,action)
        this.icon = icon
    }
    
    draw(g){
        super.draw(g)
        
        // draw pixel art icon
        let layout = this.isAnimated() ? 
            this.icon.getCurrentAnimatedLayout() : this.icon.frames[0] //icon.js
        drawLayout(g,...rectCenter(...this.rect),layout,true, 0, this.scale) //character.js
    }
    
    isAnimated(){
        return this.hovered 
    }
}