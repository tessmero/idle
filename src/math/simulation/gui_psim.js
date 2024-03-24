// small particle simulation that appears in the gui
// 
// displayed using a GuiSimPanel instance
class GuiPSim extends ParticleSim {
    constructor(rect=[0,0,1,1]){
        super(1e3,rect)
        this.fallSpeed *= .2
        this.particleRadius *= .3
        this.rainGroup.wiggle  *= .3
        this.rainGroup.n  /= 10
    }
    
    update(dt){
        super.update(dt)
    }
    
    draw(g){
        super.draw(g)
    }
    
    // make sure bodies have no control points
    addBody(b){
        if( b.children )
            b.children = b.children.filter(c => !b.controlPoints.includes(c) )
        b.controlPoints = []
        super.addBody(b)
    }
}