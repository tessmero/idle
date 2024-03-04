class BasicRainSkill extends Skill {
    constructor(){
        super('Drizzle')
    }
    
    buildPreviewSim(){
        let sim = new GuiPSim()
        return sim
    }
}