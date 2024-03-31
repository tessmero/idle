class BouncyCircleSkill extends Skill {
    constructor(){
        super('Bouncy Circle')
    }
    
    buildThumbnailSim(){
        let sim = new GuiPSim()
        return sim
    }
}