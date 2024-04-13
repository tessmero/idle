// base class for context menus
// - takes up a large fraction of screen
// - content divided into two square regions
class ContextMenu extends CompositeGuiElement{
    
    // get params using ContextMenu.pickRects
    constructor(rect,square0,square1){
        super(rect)
        
        this.square0 = square0
        this.square1 = square1
    }
    
    draw(g){
        Button._draw(g,this.rect)
        super.draw(g)
    }
    
    // pick region for context menu
    // - within given rect
    // - leaving poit of interest visible
    //
    // return [bounding rect, innner square, inner square]
    static pickRects(rect,poi){
        let pad = .05
        
        // pick top/bottom/left/right
        let axis = +( rect[3] > rect[2] ) 
        let side = +( poi.xy()[axis] < (rect[axis]+rect[axis+2]/2) )
        
        // long axis of context menu
        let lax = rect[3-axis]
        
        // size of content squares
        let ss = (lax - 3*pad)/2
        
        // short axis of context menu
        let sax = ss + 2*pad
        
        if( axis ){
            
            //vertical screen
            let h = sax
            let dy = side*(rect[3]-h)
            return [
                [rect[0],rect[1]+dy,rect[2],h],
                [rect[0]+pad,rect[1]+dy+pad,ss,ss],
                [rect[0]+pad+ss+pad,rect[1]+dy+pad,ss,ss]
            ]
            
        } else {
            
            //horizontal screen
            let w = sax
            let dx = side*(rect[2]-w)
            return [
                [rect[0]+dx,rect[1],w,rect[3]],
                [rect[0]+pad+dx, rect[1]+pad, ss, ss],
                [rect[0]+pad+dx, rect[1]+pad+ss+pad, ss, ss]
            ]
            
        }
    }
}