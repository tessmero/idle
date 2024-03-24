class FlipperLineSkill extends Skill {
    constructor(){
        super('Flipper')
    }
    
    buildPreviewSim(){
        let sim = new GuiPSim()
        return sim
    }
}