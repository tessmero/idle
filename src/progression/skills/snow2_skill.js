class Snow2Skill extends Skill {
    constructor(){
        super('Blizzard')
    }
    
    buildThumbnailSim(){
        let sim = new ThumbnailPSim()
        //sim.rainGroup.wiggle *= 2
        sim.rainGroup.n *= 10
        return sim
    }
}