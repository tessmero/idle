// circle for the user to click and drag
// to rotate another body
class RotationControlPoint extends ControlPoint {
    
    // parent is a body that this will be anchored to
    // aparent will recieve opposite force when dragging
    constructor(sim,parent,aparent){
        super(sim,parent)
        this.aparent = aparent
    }
    
    // pass user input "force" to physics-enabled parent body
    accel(acc){
        
        // extract rotation component
        let a = pio2 + this.parent.pos.sub(this.aparent.pos).getAngle()
        let mag = acc.getMagnitude() * Math.cos(acc.getAngle()-a)
        acc = vp(a,mag*this.fscale) 
        
        this.parent.accel(acc)
        this.aparent.accel(acc.mul(-1))
    }
    
}