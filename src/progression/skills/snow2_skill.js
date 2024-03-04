class Snow2Skill extends Skill {
    constructor(){
        super('Blizzard')
    }
    
    buildPreviewSim(){
        let sim = new GuiPSim()
        sim.rainGroup.wiggle *= 2
        sim.rainGroup.n *= 10
        return sim
    }
}