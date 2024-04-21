
class PiToolTutorial extends Tutorial {
    
    constructor(){
        super()
        
        let grabRad = .04
        let t = new PiTool(null,grabRad)  
        this.primaryTool = t
        this.tool = t
    }
    
    buildSim(w,h){
        let sim = new TutorialPSim()        
        return sim
    }
    
    buildKeyframes(){
        
        let startPos = v(.5,.9)
        let clickPos = v(.5,.7)
        let endPos = v(.9,.4)
        let i = 400
        
        return [
        
            [0*i,'pos',startPos],
            [1.5*i,'pos',clickPos],
            [1.5*i,'down'],
            [2*i,'up'],
            [2*i,'pos',clickPos],
            [3*i,'pos',endPos],
            [10*i,'pos',endPos],
            
        ]
    }
    
}