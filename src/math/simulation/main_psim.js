// main particle simulation
//
// one instance: global.mainSim 
// constructed in setup.js
// referenced in update.js and draw.js
class MainPSim extends ParticleSim {
    constructor(){
        super(1e5,[0,0,1,1])
    }
    
    // trigger context menu if applicable
    bodyClicked(b){
        
        // go to representative body if 
        // some part of a compound body was selected
        while( b.parent ){
            b = b.parent
        }
        if( b instanceof CompoundBody ){
            b = b.getMainBody()
        }  
        this.selectedBody = b
    }
}