class FastRain2Skill extends Skill {
    constructor(){
        super('Monsoon')
    }
    
    buildPreviewSim(){
        let sim = new GuiPSim()
        sim.fallSpeed *= 8
        sim.rainGroup.n *= 3
        return sim
    }
}