class DefaultToolTutorialTest extends TutorialTest {
    
    
    constructor(){
        super(new DefaultToolTutorial())
    }
    
    getTestAssertions(sim){
        return [
            // time, label, func
            [0, 'no particles collected', () => {
                return sim.particlesCollected == 0
            }],
            [800, 'particles collected', () => {
                return sim.particlesCollected > 0
            }],
            [1200, 'floaters visible', () => {
                return sim.floaters.activeCount > 0
            }],
            [1600, 'no edge particles', () => {
                return 0 == sim.edgeGroup.countActiveParticles()
            }],
            [2000, 'no physics particles', () => {
                return 0 == sim.physicsGroup.countActiveParticles()
            }],
        ]
    }
}