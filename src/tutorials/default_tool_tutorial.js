
class DefaultToolTutorial extends Tutorial {
    
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
            
            [1*i,'down'],
            [1*i,'pos',v(x0,.5)],
            [2*i,'pos',v(x1,.5)],
            [3*i,'pos',v(x0,.5)],
            [4*i,'pos',v(x1,.5)],
            [5*i,'pos',v(x0,.5)],
            [5*i,'up'],
            
            [6*i,'pos',startPos],
            [6.5*i,'pos',startPos],
            
        ]
    }
    
}