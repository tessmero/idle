class FastRainSkill extends Skill {
    constructor(){
        super('Downpour')
    }
    
    buildThumbnailSim(){
        let sim = new GuiPSim()
        sim.fallSpeed *= 4
        return sim
    }
}