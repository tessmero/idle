
class CircleToolTutorial extends Tutorial {
    
    constructor(){
        super()
        
        let t = new CircleTool()
        t.circleRadius *= global.tutorialToolScale
        
        this.primaryTool = t
        this.tool = t
    }
    
    getTitle(){
        return 'Circle Tutorial'
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
            [2*i,'pos',v(.5,.5)],
            
            [4*i,'pos',v(.7,.7)],
            [4.5*i,'pos',v(.7,.7)],
            
            [6*i,'pos',v(.5,.5)],
            [6*i,'down'],
            [7*i,'pos',v(.3,.3)],
            [8*i,'pos',v(.8,.3)],
            [9*i,'pos',v(.5,.5)],
            [9*i,'up'],
            
            [10*i,'pos',startPos],
            [10.5*i,'pos',startPos],
            
        ]
    }
    
}