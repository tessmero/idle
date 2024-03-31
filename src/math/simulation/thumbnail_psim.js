// extra small particle simulation that appears in the gui
// control points will be removed from bodies
//
// displayed using a GuiSimPanel instance
class ThumbnailPSim extends ParticleSim {
    constructor(){
        super(1e4,[0,0,...global.thumbnailSimDims])
        
        this.fallSpeed *= .2
        this.particleRadius *= .6
        this.rainGroup.wiggle  *= .15
        this.rainGroup.n  *= .005
        
        // add stable poi in center
        let p = v(...rectCenter(...this.rect))
        let poi = new CircleBody(this,p,2e-2)
        this.addBody(poi)
    }
    
    // make sure bodies have no control points
    addBody(b){
        if( b.children )
            b.children = b.children.filter(c => !b.controlPoints.includes(c) )
        b.controlPoints = []
        super.addBody(b)
    }
}