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
        
        // prepare to apply accel and reset accumulated force
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
                let accMag = acc.getMagnitude()
                if( this.edge.direction ) accMag *= -1
                av += accMag * Math.sin(norm-accAngle)// accel particle along edge
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
    }
    
    getAccel(a){
        let f = this.tipAccelsCallback // line_body.js register()
        if(!f) return v(0,0)
        let [start,stop] = f()
        return va(start,stop,a)
    }
}
