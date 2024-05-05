class PiToolTutorialTest extends TutorialTest {
    
    
    constructor(){
        super(new PiToolTutorial())
    }
    
    getTestAssertions(sim){
        return [
            // time, label, func
            [0, 'no particle selected', () => {
                return sim.selectedParticle == null
            }],
            [1000, 'particle selected', () => {
                return sim.selectedParticle != null
            }],
            [1400, 'particle at bottom', () => {
                let [subgroup,i,x,y,dx,dy,hit] = sim.selectedParticle
                let relPos = Test.relPos(sim,v(x,y))
                return relPos.y > .5
            }],
            [4000, 'particle at top', () => {
                let [subgroup,i,x,y,dx,dy,hit] = sim.selectedParticle
                let relPos = Test.relPos(sim,v(x,y))
                return relPos.y < .5
            }],
        ]
    }
}