// a tooltip with some text and a simulation
// also shows tool cost with progress indicator
class ToolbarTooltipPopup extends TutorialTooltipPopup {
    
    // get rect using ToolbarTooltipPopup.pickRect
    constructor(rect,label,tut,tool,scale=null){
        super(rect,label,tut,scale)
        
        
        if( tool.getCost() ){
            
            // prepare gui elements to show cost
            let r = padRect(...rect,-global.tooltipPadding)
            let h = ToolbarTooltipPopup.piHeight()
            r = [r[0],r[1]+r[3]-h,r[2],h]
            function bc(f){ // apply f to budget,cost
                let b = global.mainSim.particlesCollected
                let c = tool.getCost()
                return f(b,c)
            }
            
            // text readout
            this.children.push( new StatReadout(r,collectedIcon,
                ()=>bc((budget,cost)=> `${budget}/${cost}` ))
                .withCenter(true))
            
            // progress bar overlay
            this.children.push( new ProgressIndicator(r,
                ()=>bc((budget,cost)=> budget/cost )))
        }
    }
    
    static piHeight(){ return .05 } // thickness of progress bar
    static pickRect(label,scale=null){
        
        // start with TutorialTooltipPopup
        let r = TutorialTooltipPopup.pickRect(label,scale)
        
        // add space for progress indicator
        let dh = ToolbarTooltipPopup.piHeight()
        r[3] += dh
        r[1] -= dh
        
        return r
    }
    
    
}