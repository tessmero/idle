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
        this.clearGrabbers()
                
        // scale down control point radius and force
        b.controlPoints.forEach( c => {
            
            if( b instanceof ControlledSausageBody ){
                c.setRad(c.rad*global.tutorialToolScale)
                //c.fscale *= .5
            } else {
                c.fscale *= .6
            }
        })
        
        super.addBody(b)
    }
}