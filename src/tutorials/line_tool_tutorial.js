
class LineToolTutorial extends Tutorial {
    
    constructor(){
        super()
        
        let t = new LineTool()
        t.lineLength *= global.tutorialToolScale
        
        this.primaryTool = t
        this.tool = t
    }
    
    getTitle(){
        return 'Line Tutorial'
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
            [1*i,'down'],
            [1*i,'up'],
            [1*i,'defaultTool'],
            [4*i,'pos',v(.7,.4)],
            [4.5*i,'pos',v(.7,.4)],
            
            [5.5*i,'pos',v(.4,.4)],  // on control point
            [6*i,'pos',v(.4,.4)],
            [6*i,'down'],
            [7*i,'pos',v(.4,.8)],
            [7*i,'up'],
            
            [8*i,'pos',startPos],
            [9*i,'pos',startPos],
            
        ]
    }
    
}