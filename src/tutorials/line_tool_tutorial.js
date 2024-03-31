
class LineToolTutorial extends Tutorial {
    
    constructor(){
        super()
        
        let t = new LineTool()
        t.circleRadius *= global.tutorialToolScale
        t.minD2 = 0
        
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
            
            [1*i,'pos',v(.3,.5)],
            [1*i,'down'],
            [3*i,'pos',v(.7,.5)],
            [3.5*i,'pos',v(.7,.4)],
            [4*i,'up'],
            [4*i,'defaultTool'],
            [4*i,'pos',v(.7,.4)],
            
            [5*i,'pos',startPos],
            [5.5*i,'pos',startPos],
            
            
            [6.5*i,'pos',v(.7,.4)],
            [6.5*i,'down'],
            [8*i,'pos',v(.6,.8)],
            [8*i,'up'],
            
            [9*i,'pos',startPos],
            [12*i,'pos',startPos],
            
        ]
    }
    
}