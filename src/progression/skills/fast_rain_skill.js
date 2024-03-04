class FastRainSkill extends Skill {
    constructor(){
        super('Downpour')
    }
    
    buildPreviewSim(){
        let sim = new GuiPSim()
        sim.fallSpeed *= 4
        return sim
    }
}