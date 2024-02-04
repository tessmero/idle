// a pixel art icon followed by a line of dynamic text
class StatReadout extends DynamicTextLabel {
    
    constructor(rect,icon,labelFunc){
        super(rect,labelFunc)
        this.icon = icon
        this.scale = this.constructor.scale()
    }
    
    update(){
        
        
        
        super.update()
    }
    
    static scale(){ return .5 }
    
    // implement GuiElement
    draw(g){
        super.draw(g)
        
        // draw icon
        let xy = [this.rect[0]+this.pad,this.rect[1]+this.pad]
        let ch = charHeight
        let tps = global.textPixelSize 
        
        g.fillStyle = global.backgroundColor
        drawLayout(g,xy[0],xy[1],this.icon,false,this.pad,this.scale) //character.js
        g.fillStyle = global.lineColor
        drawLayout(g,xy[0],xy[1],this.icon,false,0,this.scale) //character.js
    }
}