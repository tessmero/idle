// physics constraint connecting two circle bodies
class Spring {
    constructor(a,b){
        this.a = a
        this.b = b
        
        let restLength = a.pos.sub(b.pos).getMagnitude()
        this.restLength = restLength;
        this.prevLength = restLength;
        this.springConstant = 2e-3;
        this.dampingConstant = 1;
    }
    
    update(dt){
        
        
        // Calculate the vector between the two balls
        let displacement = this.b.pos.sub(this.a.pos);

        // Calculate the current length of the spring
        let currentLength = displacement.getMagnitude();
        let dAngle = displacement.getAngle()

        // Calculate the force exerted by the spring
        let forceMagnitude = this.springConstant * (currentLength - this.restLength);
        let tooLong = true
        if( forceMagnitude < 0 ){
            tooLong = false
            dAngle += Math.PI
            forceMagnitude *= -1
        }

        // apply damping
        let relativeSpeed = (currentLength - this.prevLength) / dt
        if( tooLong == (relativeSpeed < 0) ){
            let dampingMagnitude = Math.abs(relativeSpeed) * this.dampingConstant
            forceMagnitude = Math.max( 0, forceMagnitude - dampingMagnitude )
        }
        this.prevLength = currentLength
        
        // Calculate the force vector
        let force = Vector.polar( dAngle, forceMagnitude )
        
        // Apply damping
        //let dampingForce = relativeVelocity.mul(this.dampingConstant);
        //force = force.sub(dampingForce);

        // Apply the force to the balls
        this.a.accel(force,dt);
        this.b.accel(force.mul(-1),dt);
    }
    
    draw(g){
        g.moveTo(...this.a.pos.xy())
        g.lineTo(...this.b.pos.xy())
        g.stroke()
    }
}