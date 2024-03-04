// a rectangle of text that appears on top of all other elements
// considered static/immutable
class TooltipPopup extends GuiElement {
    constructor(rect,label){
        super(rect)
        
        this.scale = this.constructor.scale()
        this.rect = rect
        this.label = label
    }
    
    // override GuiElement (disable hover behavior)
    update(){
        //do nothing
    }
    
    // implement GuiElement
    draw(g){
        let rect = this.rect
        let label = this.label
        let center = false
        
        
        let p = rectCenter(...rect)
        if( !center ){
            p[0] = rect[0]
            p[1] -= global.textPixelSize
        }
        
        g.fillStyle = global.lineColor
        drawText(g, ...p, label, center, .05, this.scale) //characters.js
        g.fillStyle = global.backgroundColor
        drawText(g, ...p, label, center, 0, this.scale)
        
        new StatReadout()
    }
    
    // implement GuiElement
    click(){
        //do nothing
    }
    
    static scale(){ return .4 }
    
    static pad(){ return .05 }
    
    // pick anchor point for pickTooltipRect
    // called in gui_element.js
    static pickMouseAnchorPoint(){ 
        let p = global.mousePos
        let sr = global.screenRect
        let offset = .1
        
        if( p.x < (sr[0]+sr[2]/2) )
            p = p.add(v(offset,0))
        if( p.y < (sr[1]+sr[3]/2) ){
            p = p.add(v(0,offset))
        } else {
            p = p.add(v(0,-TooltipPopup.pad()))
        }
        
        return p
    }
    
    // pick position for tooltip 
    // called in gui_element.js
    static pickTooltipRect( anchorPoint, label ){
        let [w,h] = getTextDims(label,TooltipPopup.scale()) //character.js
        let sr = global.screenRect
        let ap = anchorPoint
        
        // pick x position
        // start with center screen
        let midx = sr[0]+sr[2]/2
        let xr = midx-w/2
        
        // nudge x to include anchor point
        if( xr>ap.x ) xr = ap.x
        if( (xr+w)<ap.x ) xr = ap.x-w
        
        // pick y position
        // start with center screen
        let midy = sr[1]+sr[3]/2
        let yr = midy-h/2
        
        // nudge y to include anchor point
        if( yr>ap.y ) yr = ap.y
        if( (yr+h)<ap.y ) yr = ap.y-h
        
        // return x,y,w,h
        return [xr,yr,w,h]
        
    }
}