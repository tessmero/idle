// a tooltip with some text and a simulation
class TutorialTooltipPopup extends LabelTooltipPopup {
    
    // get rect using TutorialTooltipPopup.pickRect
    constructor(rect,label,tut,scale=null){
        super(rect,label,scale)
        
        // Tutorial instance
        this.tut = tut
        
        
        // position simulation below label
        let pad = global.tooltipPadding
        let sdims = global.tutorialSimDims
        let x = rect[0] + (rect[2]/2) - (sdims[0]/2)
        let y = rect[1] + .1
        let r = [x,y,...sdims]
        
        // ParticleSim instance
        let sim = tut.getSim()
        this.sim = sim
        
        // add gui element to show simulation
        let gsp = new GuiSimPanel(r,sim)
        gsp.tut = tut
        this.children.push( gsp )
        this.gsp = gsp
    }
    
    
    static scale(){ return .4 }
    static pickRect(label,scale=null){
       if( !scale ) scale = .4
       let [w,h] = getTextDims(label,scale)   
        
        /// make space for gui sim under label
        let [tw,th] = global.tutorialSimDims
        if( w < tw ) 
            w = tw
        h += th
        
        let pad = global.tooltipPadding
        w += pad*2
        h += pad*2
       h+= .1
        
       let p = TooltipPopup.pickMouseAnchorPoint(w,h)
       return TooltipPopup.pickTooltipRect(p,w,h)
    }
    
}