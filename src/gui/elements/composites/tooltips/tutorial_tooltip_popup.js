// a tooltip with some text and a simulation
class TutorialTooltipPopup extends LabelTooltipPopup {
    
    // get rect using TutorialTooltipPopup.pickRect
    constructor(rect,label,tut,scale=null){
        super(rect,label,scale)
        
        // Tutorial instance
        this.tut = tut
        
        
        // position simulation below label
        let lh = .05
        rect = [rect[0],rect[1]+lh,rect[2],rect[3]-lh]
        
        // ParticleSim instance
        let sim = tut.getSim()
        sim.drawOffset = [rect[0]-sim.rect[0],rect[1]-sim.rect[1]]
        sim.drawOffset[0] += (rect[2]-sim.rect[2])/2//center x
        this.sim = sim
        
        // add gui element to show simulation
        let gsp = new GuiSimPanel(rect,sim)
        gsp.tut = tut
        this.children.push( gsp )
        this.gsp = gsp
    }
    
    // override tooltip
    update(dt){
        this.gsp.update(dt)
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
        
       let p = TooltipPopup.pickMouseAnchorPoint(w,h)
       return TooltipPopup.pickTooltipRect(p,w,h)
    }
    
}