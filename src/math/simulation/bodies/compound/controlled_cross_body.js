class ControlledCrossBody extends CompoundBody {
    
    // sim is a ParticleSim instance
    constructor(sim,pos){
        super(sim,pos)
        
        let cross = new CrossBody(sim,pos)
        this.cross = cross
        
        // init control points for user to click and drag
        this.movCp = new ControlPoint(sim,cross)
        this.rotCp0 = new RotationControlPoint(sim,cross,0,.1)
        this.controlPoints = [this.movCp,this.rotCp0]
        this.rotCp0.fscale = 6
        
        
        this.children = [cross,...this.controlPoints]
        
        this.dripChance = global.poiDripChance
    }
    
    getMainBody(){ return this.cross }
}