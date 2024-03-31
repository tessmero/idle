class BasicRainSkill extends Skill {
    constructor(){
        super('Drizzle')
    }
    
    buildThumbnailSim(){
        let sim = new ThumbnailPSim()
        return sim
    }
}