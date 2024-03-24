// a tooltip with just text
class LabelTooltipPopup extends TooltipPopup {
    constructor(rect,label,scale=null){
        super(rect)
        this.label = label
        if(!scale) 
            scale = this.constructor.scale()
        this.scale = scale
        
        let rr = padRect(...rect, -super.constructor.pad() )
        this.children.push( 
            new TextLabel(rr,label)
                .withScale(scale)
                .withCenter(false) )
    }
    
    static scale(){ return .4 }
    
    static pickRect(label,scale){
       if( !scale ) scale = .4
       let [w,h] = getTextDims(label,scale)   
       let p = TooltipPopup.pickMouseAnchorPoint(w,h)
       let pad = TooltipPopup.pad()
       return TooltipPopup.pickTooltipRect(p,w+pad*2,h+pad*2)
    }
}