// abstract base class for typical rectangular buttons
class Button extends GuiElement {
    constructor(rect,action){
        super()
        
        this.rect = rect
        this.action = action
        this.hoverable = true
    }
    
    click(){
        this.action()
    }
    
    
    draw(g){
        this.constructor._draw(g,this.rect,this.hoverable)
    }
    
    static _draw(g,rect,hoverable=true,fill=true)
    {
        let lineCol = global.lineColor
        let labelCol = global.lineColor
        
        if(this.hoverable && vInRect(global.mousePos,...rect)){
            lineCol = 'white'
        }
        g.fillStyle = global.backgroundColor
        g.strokeStyle = lineCol
        if( fill ) g.fillRect(...rect)
        g.strokeRect(...rect)
        g.fillStyle = global.lineColor
    }
}