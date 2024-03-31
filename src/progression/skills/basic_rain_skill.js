class BasicRainSkill extends Skill {
    constructor(){
        super('Drizzle')
    }
    
    buildThumbnailSim(){
        let sim = new GuiPSim()
        return sim
    }
}