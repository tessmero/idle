class SnowSkill extends Skill {
    constructor(){
        super('Wonderland')
    }
    
    buildPreviewSim(){
        let sim = new GuiPSim()
        sim.fallSpeed /= 10
        return sim
    }
}