// a circle body with a control point 
// for the player to click and drag
class ControlledCircleBody extends CompoundBody {
    
    // sim is a ParticleSim instance
    constructor(sim,pos,rad){
        super(sim,pos)
        
        this.circle = new CircleBody(sim,pos,rad)
        let cp = new ControlPoint(sim,this.circle)
        cp.visible = true
        cp.setRad(rad)
        this.controlPoint = cp
        
        this.children = [this.circle,cp]
        this.controlPoints = [cp]
    }
    
    getPos(){ return this.circle.getPos() }
}