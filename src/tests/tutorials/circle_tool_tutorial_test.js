class CircleToolTutorialTest extends TutorialTest {
    
    constructor(){
        super(new CircleToolTutorial())
    }
    
    getTestAssertions(sim){
        
        function b(){
            return sim.getBodies()[0].getMainBody()
        }
        
        return [
            // time, label, func
            [0, 'no bodies', () => {
                return sim.getBodies().length == 0
            }],
            [1200, 'one body', () => {
                return sim.getBodies().length == 1
            }],
            [2400, 'floaters visible', () => {
                return sim.floaters.activeCount > 0
            }],
            [3000, 'particles collected', () => {
                return sim.particlesCollected > 0
            }],
            [3400, 'position changed', () => {
                return !Test.vectorsEqual(v(.5,.5), Test.relPos(sim,b().pos))
            }],
        ]
    }
}