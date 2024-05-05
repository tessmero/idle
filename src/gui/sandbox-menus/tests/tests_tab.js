class TestsTab extends CompositeGuiElement {
    constructor(sr){
        super(sr)
    
        let scale = .4
        
        //sr = padRect(...sr, -.02 )
        //let rows = divideRows(...sr,6)
        
        let rows = this.buildRows(sr,testList.length+1) // test_list.js
        
        // run all button
        let rab = new Button( rows[0], 
                        ()=>this.playAllClicked() )
                        .withScale(scale)
        this.rab = rab
        
        // build ui rows, leaveing first slot free
        let tlrs = []
        for( let i = 0 ; i < testList.length ; i++ ){ // test_list.js
            tlrs.push( new TestListRow(rows[i+1], testList[i],i) )
        }
        this.tlrs = tlrs
        
        this.children = [
        
            // play all button in first slot
            rab,
            
            new StatReadout( rab.rect, nextIcon, 
                    () => 'run all tests' )
                    .withScale(scale),
            
            // ui rows
            ...tlrs
        ]
    }
    
    draw(g){
        super.draw(g)
        
        // highlight "run all tests" button if active (this.rab)
        let c = global.contextMenu
        if( (_testLoopSetting=='all') && (c instanceof TestContextMenu) )
            ProgressIndicator._draw(g,this.rab.rect,1.0)
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