class FastRainSkill extends Skill {
    constructor(){
        super('Downpour')
    }
    
    buildThumbnailSim(){
        let sim = new ThumbnailPSim()
        sim.fallSpeed *= 4
        return sim
    }
}