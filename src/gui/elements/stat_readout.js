// a pixel art icon followed by a line of dynamic text
class StatReadout extends DynamicTextLabel {
    
    constructor(rect,icon,labelFunc){
        super(rect,labelFunc)
        this.icon = icon
    }
    
    // implement GuiElement
    draw(g){
        super.draw(g)
        
        let scale = .5
        let s = '  '+this.label // make space for icon on left
        let xy = this.rect
        
        // clear surrounding rectangle
        let rdims = getTextDims(s,scale)
        let dims = padRect( ...xy, ...rdims, .005 )
        g.fillStyle = global.backgroundColor
        g.fillRect(...dims)
        g.fillStyle = global.lineColor
        
        let ch = charHeight
        let tps = global.textPixelSize 
        drawLayout(g,xy[0],xy[1],this.icon,false,0,scale) //character.js
        drawText(g,...xy, s,false,0,.5)
    }
}