class SnowSkill extends Skill {
    constructor(){
        super('Wonderland')
    }
    
    buildThumbnailSim(){
        let sim = new ThumbnailPSim()
        sim.fallSpeed /= 10
        return sim
    }
}