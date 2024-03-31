var _defaultGlobalVals = null

class DebugTab extends CompositeGuiElement {
    constructor(sr){
        super(sr)
        
        let specs = [
            
            [
                "UI","debug user interface",[
                
                    ['debugUiRects','bool','show gui bounding rectangles'],
                    ['baseAnimPeriod',100,'idle gui animation frame duration'],
                    ['textPixelSize', .001,'font size'],
                    ['textLetterSpace', 1, 'space between letters'],
                    ['textLineSpace', 1, 'space between lines'],
                    ['tooltipPadding', .001, 'extra space around tooltip content'],
                    ['tooltipShadowWidth', .001, 'size of shadow effect\nfor tooltip popups'],
                    ['lineWidth', .001, 'line thickness'],
                ]
            ],
            
            [
                // tab title, tooltip
                "SIM", "debug particle simulation",[
                
                    // variable name in global.js,  increment or 'bool',  description
                    ['colorcodeParticles','bool','color particles by category'],
                    ['showEdgeNormals','bool','show normal vectors along edges'],
                    ['showEdgeAccel', 'bool', 'show force vectors along edges'],
                    ['mainSim.rainGroup.n',1,'max raindrops on screen'],
                    ['mainSim.fallSpeed',3e-6 , 'terminal velocity'],
                    ['mainSim.particleRadius',.001, 'size of falling rain drops'],
                    ['mainSim.rainGroup.wiggle',.01, 'horizontal movement of drops'],
                    ['poiFriction',1e-3, 'friction for circles and lines'],
                ]
            ],
        ]
        
        // remember default values based on global.js contents
        if( !_defaultGlobalVals ){
            _defaultGlobalVals = {}
            specs.forEach(r => r[2].forEach( rr => {
                let varname = rr[0]
                _defaultGlobalVals[varname] = get_global(varname)
            }))
        }
        
        
        //let tabLabels = ['upgrades','skills','debug']
        let tabLabels = specs.map(r => r[0])
        let tabTooltips = specs.map(r => r[1]) 
        let tabContent = specs.map(r => (
            rect => this.buildTabContent(rect,r[2])
        ))
        let rect = padRect(...sr,-.05)
        let tabGroup = new TabPaneGroup(rect,tabLabels,tabContent,tabTooltips)
        if( global.debugMenuTabIndex ) 
            tabGroup.selectedTabIndex = global.debugMenuTabIndex
        tabGroup.addTabChangeListener( i => 
            global.debugMenuTabIndex = i )
        
        this.children = [tabGroup]
    }
    
    buildTabContent(rect,tabSpecs){
    
        //let sc = global.screenCorners
        //let sr = global.screenRect
        let sr = rect
        let m = .03
        let w = sr[2]-2*m
        let h = .05
        let r0 = [sr[0]+m,sr[1]+m*2, w,h]
        
        let result = new CompositeGuiElement(rect)
        result.children = tabSpecs.map( row => {
            let varname = row[0]
            let inc = row[1]
            let tooltip = row[2]
            let agvRect = r0
            r0 = [...r0]
            r0[1] += r0[3]
            if( inc == 'bool' ){
                return new BooleanDebugVar(agvRect,varname,tooltip)
            } else {
                return new ScalarDebugVar(agvRect,varname,inc,tooltip) 
            }
        })
        return result
    }
}