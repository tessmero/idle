class BouncyCircleSkill extends Skill {
    constructor(){
        super('Bouncy Circle')
    }
    
    buildPreviewSim(){
        let sim = new GuiPSim()
        return sim
    }
}