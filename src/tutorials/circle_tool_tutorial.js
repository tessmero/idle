
class CircleToolTutorial extends Tutorial {
    
    constructor(){
        super()
        
        let t = new CircleTool()
        t.circleRadius *= global.tutorialToolScale
        
        this.primaryTool = t
        this.tool = t
    }
    
    buildSim(w,h){
        let sim = new TutorialPSim()        
        return sim
    }
    
    buildKeyframes(){
        
        let startPos = v(.5,.9)
        let i = 400
        let x0 =.1
        let x1 = .9
        return [
        
            [0,'pos',startPos],
            [1,'primaryTool'],
            
            [1*i,'pos',v(.5,.5)],
            [2*i,'down'],
            [2*i,'up'],
            [2*i,'defaultTool'],
            [3*i,'pos',v(.5,.5)],
            
            [4*i,'pos',startPos],
            [4.5*i,'pos',startPos],
            
        ]
    }
    
}