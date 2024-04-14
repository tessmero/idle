// a tooltip with some text and a simulation
// also shows tool cost with progress indicator
class ToolbarTooltipPopup extends TutorialTooltipPopup {
    
    // get rect using ToolbarTooltipPopup.pickRect
    constructor(rect,label,tut,tool,scale=null){
        super(rect,label,tut,scale)
        
        
        if( tool.getCost() ){
            // add gui element to show cost
            let r = padRect(...rect,-global.tooltipPadding)
            let h = ToolbarTooltipPopup.piHeight()
            r = [r[0],r[1]+r[3]-h,r[2],h]
            let pi = new ProgressIndicator(r,collectedIcon,
                ()=>{
                    let cost = tool.getCost()
                    let budget = global.mainSim.particlesCollected
                    return `${budget}/${cost}`
                },
                ()=>Math.min(1,global.mainSim.particlesCollected/tool.getCost()))
            this.children.push( pi )
        }
    }
    
    static piHeight(){ return .05 } // thickness of progress bar
    static pickRect(label,scale=null){
        let r = TutorialTooltipPopup.pickRect(label,scale)
        let dh = ToolbarTooltipPopup.piHeight()
        r[3] += dh
        r[1] -= dh
        return r
    }
    
    
}