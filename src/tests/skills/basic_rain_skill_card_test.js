class BasicRainSkillCardTest extends SkillCardTest{
    
    constructor(){
        super(new BasicRainSkill())
    }
    
    getTitle(){
        return 'Basic Rain Skill Card'
    }
    
    getTestAssertions(sim){
        return [
            // time, label, func
            [1000, 'one body', () => {
                return sim.getBodies().length == 1
            }],
            [2000, 'active edge particles', () => {
                return 0 < sim.edgeGroup.countActiveParticles()
            }],
            [3000, 'active physics particles', () => {
                return 0 < sim.physicsGroup.countActiveParticles()
            }],
        ]
    }
}