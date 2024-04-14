// a rectangle of text that appears on top of all other elements
class TooltipPopup extends CompositeGuiElement {
    
    // get rect using TooltipPopup.pickTooltipRect
    constructor(rect){
        super(rect)
    }
    
    draw(g){
        let r = this.rect
        
        
        // draw shadow
        let thick = global.tooltipShadowWidth
        let x = r[0]-thick
        let y = r[1]-thick
        g.fillStyle = global.fgColor
        g.fillRect( x,y,thick,r[3] )
        g.fillRect( x,y,r[2],thick )
        
        // draw white shadow of shadow
        let tt = global.lineWidth
        x -= tt
        y -= tt
        g.clearRect( x,y,tt,r[3] )
        g.clearRect(x,y+r[3],r[2],tt)
        g.clearRect( x,y,r[2],tt )
        g.clearRect(x+r[2],y,tt,r[3])
        
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
        let cursorSize = .05
        
        if( p.y < (sr[1]+sr[3]/2) ){
            
            // mouse is in top half of screen
            p = p.add(v(0,space+cursorSize))
            
        } else {
            
            // mouse is in bottom half of screen
            p = p.sub(v(0,space))
            
        }
        
        if( p.x < (sr[0]+sr[2]/2) ){
            
            // mouse is in left half of screen
            p = p.add(v(space+cursorSize,0))
            
        } else {
            
            // mouse is in right half of screen
            p = p.sub(v(space,0))
            
        }
        
        return p
    }
    
    // pick position for tooltip 
    // called in gui_element.js
    static pickTooltipRect( anchorPoint, w,h ){
        let sr = global.screenRect
        let ap = anchorPoint
        
        // pick x position to just touch anchorPoint
        let midx = sr[0]+sr[2]/2
        let xr = (ap.x > midx) ? ap.x-w : ap.x
        
        // pick y position to just touch anchorPoint
        let midy = sr[1]+sr[3]/2
        let yr = (ap.y > midy) ? ap.y-h : ap.y
        
        // try to keep the whole rect is on screen
        if( xr < sr[0] ) xr = sr[0]
        if( yr < sr[1] ) yr = sr[1]
        if( (xr+w) > (sr[0]+sr[2]) ) xr = (sr[0]+sr[2]-w)
        if( (yr+h) > (sr[1]+sr[3]) ) yr = (sr[1]+sr[3]-h)
        
        return [xr,yr,w,h]  
    }
}