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
                let sp = sim.selectedParticle
                if( !sp ) return false
                let [subgroup,i,x,y,dx,dy,hit] = sp
                let relPos = Test.relPos(sim,v(x,y))
                return relPos.y > .5
            }],
            [3200, 'particle at top', () => {
                let sp = sim.selectedParticle
                if( !sp ) return false
                let [subgroup,i,x,y,dx,dy,hit] = sp
                let relPos = Test.relPos(sim,v(x,y))
                return relPos.y < .5
            }],
        ]
    }
}