class DebugTab extends CompositeGuiElement {
    constructor(sr){
        super(sr)
    
        //let sc = global.screenCorners
        //let sr = global.screenRect
        let m = .05
        let w = sr[2]-2*m
        let h = .05
        let r0 = [sr[0]+m,sr[1]+m*2, w,h]
        
        let specs = [
            // variable names in global.js
            ['colorcodeParticles','bool','color particles by category'],
            ['showEdgeNormals','bool','show normal vectors along edges'],
            ['showEdgeAccel', 'bool', 'show force vectors along edges'],
            ['mainSim.rainGroup.n',1,'max raindrops on screen'],
            ['mainSim.fallSpeed',3e-6 , 'terminal velocity'],
            ['mainSim.particleRadius',.001, 'size of falling rain drops'],
            ['mainSim.rainGroup.wiggle',.01, 'horizontal movement of drops'],
            ['poiFriction',1e-3, 'circle friction'],
            ['baseAnimPeriod',100,'idle gui animations'],
        ]
        this.children = specs.map( row => {
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
    }
}