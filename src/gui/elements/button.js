// abstract base class for typical rectangular buttons
class Button extends GuiElement {
    constructor(rect,action){
        super(rect)
        
        this.rect = rect
        this.action = action
    }
    
    click(){
        this.action()
    }
    
    
    draw(g){
        this.constructor._draw(g,this.rect,this.hovered)
    }
    
    static _draw(g,rect,hovered=false,fill=true)
    {
        let lineCol = global.lineColor
        
        if(hovered){
            lineCol = 'white'
        }
        //g.fillStyle = global.backgroundColor
        g.strokeStyle = lineCol
        if( fill ) g.clearRect(...rect)
        g.strokeRect(...rect)
        g.fillStyle = global.lineColor
    }
}