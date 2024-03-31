// base class for animation sequences
//
// involving a GuiParticleSim
// + animated recreation of the user's cursor/tool

class DefaultToolTutorial extends Tutorial {
    
    
    buildSim(w,h){
        let sim = new GuiPSim([0,0,w,h])        
        return sim
    }
    
    buildKeyframes(){
        
        // example
        return [
        
            [0,'pos',v(.5,.5)], // time, 'pos', location 
            [100,'pos',v(.2,.5)],
            [200,'pos',v(.8,.5)],
            
        ]
    }
    
}