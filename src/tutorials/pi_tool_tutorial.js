
class PiToolTutorial extends Tutorial {
    
    constructor(){
        super()
        
        let grabRad = .04
        let t = new PiTool(null,grabRad)  
        this.primaryTool = t
        this.tool = t
    }
    
    
    getTitle(){
        return 'Inspector Tutorial'
    }
    
    buildSim(w,h){
        let sim = new TutorialPSim()        
        return sim
    }
    
    buildKeyframes(){
        let [startPos,clickPos,endPos] = [
            v(.9,.4), // start
            v(.5,.8), // click
            v(.9,.4), // end
        ]
        
        let i = 400 // duration scale in ms
        
        return [
        
            // time, ...action/position
            [0*i,'pos',startPos],
            [1.5*i,'pos',clickPos],
            [1.5*i,'down'],
            [2*i,'up'],
            [2*i,'pos',clickPos],
            [3*i,'pos',endPos],
            [9*i,'pos',endPos],
            
        ]
    }
    
}