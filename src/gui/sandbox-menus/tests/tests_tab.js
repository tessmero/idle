class TestsTab extends CompositeGuiElement {
    constructor(sr){
        super(sr)
    
        
        //sr = padRect(...sr, -.02 )
        //let rows = divideRows(...sr,6)
        
        let specs = testList // test_list.js
        let rows = this.buildRows(sr,specs.length+1)
        
        
        // build ui rows, leaveing first slot free
        let i = 0
        let tlrs = specs.map( test => {
            i += 1
            return new TestListRow(rows[i], test,i)
        })
        this.tlrs = tlrs
        
        this.children = [
        
            // play all button in first slot
            new TextButton( rows[0], 'run all tests', 
                        ()=>this.playAllClicked() )
                        .withScale(.4),
            
            // ui rows
            ...tlrs
        ]
    }
    
    playAllClicked(){
        _testLoopSetting = 'all'
        this.tlrs[0].clicked()
    }
    
    buildRows(rect,n){
        let sr = rect
        let m = .03
        let w = sr[2]-2*m
        let h = .05
        let r0 = [sr[0]+m,sr[1]+m*2, w,h]
        
        let result = []
        for( let i = 0 ; i < n ; i++ ){
            result.push([...r0])
            r0[1] += r0[3]
        }
        return result
    }
}