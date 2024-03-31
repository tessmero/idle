// small particle simulation that appears in the gui
//
// displayed using a GuiSimPanel instance
class TutorialPSim extends ParticleSim {
    constructor(){
        super(1e3,[0,0,...global.tutorialSimDims])
        this.fallSpeed *= .2
        this.particleRadius *= 1
        this.rainGroup.wiggle  *= .3
        this.rainGroup.n  /= 10
    }
}