class FastRainSkillCardTest extends SkillCardTest{
    
    constructor(){
        super(new FastRainSkill())
    }
    
    getTitle(){
        return 'Fast Rain Skill Card'
    }
    
    getTestAssertions(sim){
        return [
            // time, label, func
            [0, 'one body', () => sim.getBodies().length == 1],
        ]
    }
}