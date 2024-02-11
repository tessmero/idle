// a pixel art icon followed by a line of dynamic text
class StatReadout extends DynamicTextLabel {
    
    constructor(rect,icon,labelFunc){
        super(rect,function(){ return '  ' + labelFunc() })
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
        
        let layout = this.icon.getCurrentAnimatedLayout()
        
        drawLayout(g,xy[0],xy[1],layout,false,this.pad,this.scale,true) //character.js
        drawLayout(g,xy[0],xy[1],layout,false,0,this.scale,false) //character.js
    }
}