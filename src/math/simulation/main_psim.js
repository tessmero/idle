// main particle simulation
//
// one instance: global.mainSim 
// constructed in setup.js
// referenced in update.js and draw.js
class MainPSim extends ParticleSim {
    constructor(){
        super(1e5,[0,0,1,1])
    }
}