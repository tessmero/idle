class FlipperLineSkill extends Skill {
    constructor(){
        super('Flipper')
    }
    
    buildThumbnailSim(){
        let sim = new GuiPSim()
        return sim
    }
}