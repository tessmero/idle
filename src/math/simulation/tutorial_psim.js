// small particle simulation that appears in the gui
//
// displayed using a GuiSimPanel instance
class TutorialPSim extends ParticleSim {
    constructor(){
        super(1e4,[0,0,...global.tutorialSimDims])
        this.fallSpeed *= .2
        this.particleRadius *= 1
        this.rainGroup.wiggle  *= .3
        this.rainGroup.n  /= 100
    }
    
    addBody(b){
                
        // clear simulation (limit 1 body)
        this.clearBodies()
        this.grabbers.clear()
                
        // scale down control point radius and force
        b.controlPoints.forEach( c => {
            
            if( b instanceof LineBody ){
                c.setRad(c.rad*global.tutorialToolScale)
                c.fscale *= .8
            } else {
                c.fscale *= .8
            }
        })
        
        // reduce stickiness
        if( b instanceof LineBody ){
            let m = 1e6
            b.dripChance *= m
            b.endCaps.forEach(e => e.dripChance *= m)
        }
        
        super.addBody(b)
    }
}