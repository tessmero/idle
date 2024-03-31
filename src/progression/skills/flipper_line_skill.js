class FlipperLineSkill extends Skill {
    constructor(){
        super('Flipper')
    }
    
    buildThumbnailSim(){
        let sim = new ThumbnailPSim()
        return sim
    }
}