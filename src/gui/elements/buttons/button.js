// abstract base class for typical rectangular buttons
class Button extends GuiElement {
    constructor(rect,action){
        super(rect)
        
        this.rect = rect
        this.action = action
    }
    
    click(){
        let result = !this.action()
        return result
    }
    
    
    draw(g){
        this.constructor._draw(g,this.rect,this.hovered)
    }
    
    static _draw(g,rect,hovered=false,fill=true)
    {
        let lineCol = global.colorScheme.fg
        
        if(hovered){
            lineCol = global.colorScheme.hl
        }
        //g.fillStyle = global.colorScheme.bg
        g.strokeStyle = lineCol
        g.lineWidth = global.lineWidth
        if( fill ) g.clearRect(...rect)
        g.strokeRect(...rect)
        g.strokeStyle = global.colorScheme.fg
    }
}