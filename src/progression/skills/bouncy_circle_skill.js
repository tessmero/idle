class BouncyCircleSkill extends Skill {
    constructor(){
        super('Bouncy Circle')
    }
    
    buildThumbnailSim(){
        let sim = new ThumbnailPSim()
        return sim
    }
}