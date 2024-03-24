class BasicLineSkill extends Skill {
    constructor(){
        super('Basic Line')
    }
    
    buildPreviewSim(w,h){
        let sim = new GuiPSim()
        
        // add stable poi in center
        let c =  v(w/2,h/2)
        let d = v(.1*w,.1*h)
        let a = c.add(d)
        let b = c.sub(d)
        let rad = 2e-3
        let poi = new LineBody(sim,a,b,rad)
        sim.addBody(poi)
        
        return sim
    }
}