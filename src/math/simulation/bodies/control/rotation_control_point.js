// circle for the user to click and drag
// to rotate another body
class RotationControlPoint extends ControlPoint {
    
    // parent is a body that this will be anchored to
    // aparent will recieve opposite force when dragging
    constructor(sim,parent,angle,radius){
        super(sim,parent)
        this.angle = angle
        this.radius = radius
    }
    
    // pass user input "force" to physics-enabled parent body
    accel(acc){
        
        // extract rotation component
        let a = this.angle + this.parent.angle
        let mag = acc.getMagnitude() * Math.sin(acc.getAngle()-a)
        let spn = mag*this.fscale
        
        this.parent.spin(spn)
    }
    
    // remain stuck to parent
    update(dt){
        let par = this.parent
        let a = this.angle + par.angle
        this.pos = par.pos.add(vp(a,this.radius))
    }
    
}