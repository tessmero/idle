// a button in the toolbar with a pixel art icon
class ToolbarButton extends IconButton {
    
    constructor(rect,icon,indexInToolbar){
        super(rect,icon,null)
        this.indexInToolbar = indexInToolbar
    }
                
    click(){ 
        global.selectedToolIndex = this.indexInToolbar
    }
    
    draw(g){
        let hovered = super.draw(g)//Button._draw(g,this.rect,this.hoverable,true)
                    
        // check if selected
        if( this.indexInToolbar == global.selectedToolIndex ){
            let outer = this.rect
            let m = .005
            let inner = [outer[0]+m,outer[1]+m,outer[2]-2*m,outer[3]-2*m]
            Button._draw(g,inner,false,false)
        }
        
        // draw icon inside button
        drawLayout(g,...rectCenter(...this.rect),this.icon) //character.js
        
        return hovered
    }
}