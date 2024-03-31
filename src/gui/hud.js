
class Hud extends Gui {
    
    constructor(){
        super()
    }
    
    // implement gui
    buildElements(){
        let sc = global.screenCorners
        let sr = global.screenRect
        let margin = .02 
        sr = padRect(...sr,-margin)
        let m = .1
        
        // layout buttons at top of screen
        let topRow = [sc[0].x,sc[0].y, (sc[2].x-sc[0].x), m]
        let topLeft = [sr[0],sr[1],m,m]
        let topRight = [sc[2].x-m-margin,sr[1],m,m]
        let topClp = [sr[0]+sr[2]*.1,sr[1]+m/4]
        let topCenterP = [sr[0]+sr[2]*.4,topClp[1]]
        let topCrp = [sr[0]+sr[2]*.7,topClp[1]]
        
        // layout toolbar at bottom of screen
        let mx = .2
        let toolList = global.toolList 
        let nbuttons = toolList.length
        let padding = .005
        let buttonWidth = m-padding*2
        let rowHeight = buttonWidth + padding*2
        let rowWidth = buttonWidth*nbuttons + padding*(nbuttons+1)
        let brow = [sr[0]+sr[2]/2-rowWidth/2,sr[1]+sr[3]-rowHeight, rowWidth, rowHeight]
        let slots = []
        for( let i = 0 ; i < nbuttons ; i++ ){
            slots.push([brow[0]+padding+i*(buttonWidth+padding),brow[1]+padding,buttonWidth,buttonWidth])
        }
        
        
        
        // build top hud
        let result = [
        
            // stats button
            new IconButton(topLeft,statsIcon,toggleStats) //game_state.js
                .withTooltip('toggle upgrades menu'),
        
            // stat readouts constructed with null width and height
            // dims are computed in dynamic_text_label.js
            
            // particles on screen
            new StatReadout(topClp,rainIcon,() => 
                global.mainSim.rainGroup.n.toString())
                .withStyle('hud')
                .withDynamicTooltip(() => `max ${global.mainSim.rainGroup.n} raindrops on screen`),
            
            // catch rate %
            new StatReadout(topCenterP,catchIcon,() => 
                Math.floor(100*(global.mainSim.rainGroup.grabbedParticles.size()/global.mainSim.rainGroup.n)).toString()+'%')
                .withStyle('hud')
                .withDynamicTooltip(() => `caught ${global.mainSim.rainGroup.grabbedParticles.size()} / ${global.mainSim.rainGroup.n} raindrops`),
                
            // total caught
            new StatReadout(topCrp,collectedIcon,() => 
                global.mainSim.particlesCollected.toString())
                .withStyle('hud')
                .withDynamicTooltip(() => `${global.mainSim.particlesCollected} raindrops collected`),
            
            // pause button
            new IconButton(topRight,pauseIcon,pause) //game_state.js
                .withTooltip('pause or quit the game'), 
        ]
        
        
        // build toolbar buttons
        for( let i = 0 ; i < toolList.length ; i++ ){
            
            let tool = toolList[i]
            let button = new ToolbarButton(slots[i],tool.icon,i)
            
            
            let tooltip = tool.tooltip // tooltip string
            
            // check if tutorial available
            let tut = tool.getTutorial()
            if( tut ){
                
                // build tooltip with string label and tutorial sim
                button.withDynamicTooltip(() =>{
                    let rect = TutorialTooltipPopup.pickRect(tooltip)
                    return new TutorialTooltipPopup(rect,tooltip,tut)
                })
                
            } else {
                
                // set tooltip string 
                // standard text tooltip (gui_element.js)
                button.withTooltip(tooltip) 
            }
            
            
            
            result.push(
                button
            )
        }
        
        return result
    }
}