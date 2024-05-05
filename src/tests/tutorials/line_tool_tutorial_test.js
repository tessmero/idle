class LineToolTutorialTest extends TutorialTest {
    
    
    constructor(){
        super(new LineToolTutorial())
    }
    
    getTestAssertions(sim){
        
        function b(){
            return sim.getBodies()[0].getMainBody()
        }
        
        return [
            // time, label, test function
            [0, 'no bodies', () => {
                return sim.getBodies().length == 0
            }],
            [900, 'one floater', () => {
                return sim.floaters.activeCount == 1
            } ],
            [900, 'one body', () => {
                return sim.getBodies().length == 1
            }],
            [1300, 'angle = -135°',  () => {
                return Test.anglesEqual( -3*pi/4, b().angle )
            }],
            [2400, 'no floaters', () => {
                return sim.floaters.activeCount == 0
            }],
            [2800, 'angle changed',  () => {
                return !Test.anglesEqual( -3*pi/4, b().angle )
            }],
            [3200, 'position unchanged',  () => {
                return Test.vectorsEqual(v(.5,.5), Test.relPos(sim,b().pos))
            }],
        ]
    }
}