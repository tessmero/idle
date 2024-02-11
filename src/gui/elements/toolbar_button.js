// a button in the toolbar with a pixel art icon
class ToolbarButton extends IconButton {
    
    constructor(rect,icon,indexInToolbar){
        super(rect,icon,null)
        this.indexInToolbar = indexInToolbar
    }
                
    click(){ 
        global.selectedToolIndex = this.indexInToolbar
    }
    
    // override IconButton
    draw(g){
        
        // check if selected
        let selected = (this.indexInToolbar == global.selectedToolIndex )
        
        // draw pixel art icon (like in icon_button.js)
        let layout = (this.hovered || ((global.gameState==GameStates.playing)&&selected) ) ? 
            this.icon.getCurrentAnimatedLayout() : this.icon.frames[0] //icon.js
        drawLayout(g,...rectCenter(...this.rect),layout) //character.js
                    
        
        if( selected ){
            
            //draw extra rectangle to highlight selected
            let outer = this.rect
            let m = .005
            let inner = [outer[0]+m,outer[1]+m,outer[2]-2*m,outer[3]-2*m]
            Button._draw(g,inner,false,false)
        }
    }
}