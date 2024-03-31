class BasicCircleSkill extends Skill {
    constructor(){
        super('Basic Circle')
    }
    
    buildThumbnailSim(w,h){
        let sim = new GuiPSim()
        
        // add stable poi in center
        let poi = new CircleBody(sim,v(w/2,h/2),1e-2)
        sim.addBody(poi)
        
        return sim
    }
}