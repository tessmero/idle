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
        let poi = new Poi(this,v(...rectCenter(...rect)))
        poi.md2 = .0002
        this.poiMaxArea  = poi.md2
        this.poiShrinkRate = 0
        this.allPois.push(poi)
        this.grabbers.add(poi.grabber)
    }
    
    update(dt){
        super.update(dt)
    }
    
    draw(g){
        super.draw(g)
    }
}