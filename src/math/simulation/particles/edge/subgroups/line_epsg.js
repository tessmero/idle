// Line Edge Particle Subgroup
class LineEPSG extends EdgeParticleSubgroup{
    constructor(...p){
        super(...p)
    }
    
    // called in EdgePGroup *generateParticles()
    *generateParticles(dt){
        
        // prepare to multiply and offset velocities
        // to apply gravity and accel to all particles
        let f = this.edge.getF()
        let vm = (1-f*dt)
        let i = 0
        
        // prepare to apply accel
        let norm = this.edge.getNorm(0)
            
        let nd = this.group.ndims
        let m = this.i+this.n
        for(let i = this.i ; i < m ; i++ ){
                
                // check if currently grabbed
                if( this.group.grabbedParticles.has(i) ) continue
                
                // advance physics
                let a = this.group.state[i*nd+0]
                let av = this.group.state[i*nd+1]
                let acc = this.getAccel(a)
                let accAngle = acc.getAngle()
                let accMag = acc.getMagnitude() * Math.sin(norm-accAngle)// accel particle along edge
                if( this.edge.direction ) accMag *= -1
                av += accMag 
                av *= vm // friction
                a += av*dt
                this.group.state[i*nd+0] = a
                this.group.state[i*nd+1] = av
                
                // yield one particle to be grabbed/drawn
                let grab = false
                let ungrab = false
                let pos = this.edge.getPos(a)
                let [x,y] = pos.xy()
                yield [i,x,y,grab,ungrab]
        }
        
        // reset accumulated centripital force
        this.spn = 0
    }
    
    // compute force felt by a particle 
    // stuck to edge at point a
    // including gravity
    getAccel(a){
        
        // translational force based on tips
        let tf
        let f = this.tipAccelsCallback // line_body.js register()
        if(f){
            let [start,stop] = f()
            tf = va(start,stop,a)
        } else {
            tf = v(0,0)
        }
        
        
        // centripital force
        let mag = 6e-2*this.spn*(.5-a) // angular vel * radius
        let angle = this.edge.getAngle()
        let cf = vp(angle,mag)
        
        return tf.add(cf)
        //return cf
    }
}
