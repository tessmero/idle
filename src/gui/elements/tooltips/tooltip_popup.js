// a rectangle of text that appears on top of all other elements
class TooltipPopup extends CompositeGuiElement {
    
    // get rect using TooltipPopup.pickTooltipRect
    constructor(rect){
        super(rect)
    }
    
    static pad(){ return .02 }
    
    // override GuiElement (disable hover behavior)
    update(){
        //do nothing
    }
    
    draw(g){
        let r = this.rect
        
        
        // draw shadow
        let thick = .01
        g.fillStyle = global.lineColor
        g.fillRect( r[0]-thick,r[1]-thick,thick,r[3] )
        g.fillRect( r[0]-thick,r[1]-thick,r[2],thick )
        
        
        // draw rectangle
       Button._draw(g,r)
        
        
        
        //draw children
        super.draw(g)
    }
    
    // implement GuiElement
    click(){
        //do nothing
    }
    
    // pick anchor point for pickTooltipRect
    // called in label_tooltip_popup.js
    static pickMouseAnchorPoint(w,h){ 
        let p = global.mousePos
        let sr = global.screenRect
        let space = .05
        let cursorSize = .07
        
        
        if( p.y < (sr[1]+sr[3]/2) ){
            
            // mouse is in top half of screen
            p = p.add(v(0,space+cursorSize))
            
        } else {
            
            // mosue is in bottom half of screen
            p = p.sub(v(0,h+space))
            
        }
        
        if( p.x < (sr[0]+sr[2]/2) )
            p = p.add(v(space,0))
        
        return p
    }
    
    // pick position for tooltip 
    // called in gui_element.js
    static pickTooltipRect( anchorPoint, w,h ){
        //let [w,h] = getTextDims(label,TooltipPopup.scale()) //character.js
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
        
        // return padded x,y,w,h
        let pad = TooltipPopup.pad()
        return padRect(xr,yr,w,h,pad)        
    }
}