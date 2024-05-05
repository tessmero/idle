// a tooltip with just text
class LabelTooltipPopup extends TooltipPopup {
    
    // get rect using LabelTooltipPopup.pickRect
    constructor(rect,label,scale=null){
        super(rect)
        this.label = label
        if(!scale) 
            scale = this.constructor.scale()
        this.scale = scale
        
        let rr = padRect(...rect, -global.tooltipPadding )
        this.children.push( 
            new TextLabel(rr,label)
                .withScale(scale)
                .withCenter(false) )
    }
    
    static scale(){ return .4 }
    
    static pickRect(label,scale=null){
       if( !scale ) scale = LabelTooltipPopup.scale()
       let [w,h] = getTextDims(label,scale)   
       w += 2*global.tooltipPadding
       h += 2*global.tooltipPadding
       let p = TooltipPopup.pickMouseAnchorPoint(w,h)
       return TooltipPopup.pickTooltipRect(p,w,h)
    }
}