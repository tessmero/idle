class FastRain2Skill extends Skill {
    constructor(){
        super('Monsoon')
    }
    
    buildThumbnailSim(){
        let sim = new ThumbnailPSim()
        sim.fallSpeed *= 8
        sim.rainGroup.n *= 3
        return sim
    }
}