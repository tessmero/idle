// small particle simulation that appears in the gui
// 
// displayed using a GuiSimPanel instance
class GuiPSim extends ParticleSim {
    constructor(rect=[0,0,1,1]){
        super(1e2,rect)
        this.fallSpeed *= .2
        this.particleRadius *= .3
        this.rainGroup.wiggle  *= .3
        
        // add stable poi in center
        let poi = new CircleBody(this,v(...rectCenter(...rect)),1e-2)
        this.addBody(poi)
    }
    
    update(dt){
        super.update(dt)
    }
    
    draw(g){
        super.draw(g)
    }
}