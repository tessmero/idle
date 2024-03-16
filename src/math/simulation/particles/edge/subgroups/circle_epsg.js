// simulate particles stuck to a particular circular edge
// EPSG = edge particle subgroup
class CircleEPSG extends EdgeParticleSubgroup{
    constructor(...p){
        super(...p)
        
        // prepare to add up acceleration during updates
        this.acc = v(0,0)
    }
    
    // called in EdgePGroup *generateParticles()
    *generateParticles(dt){
        
        // prepare to multiply and offset velocities
        // to apply gravity and accel to all particles
        let f = this.edge.getF()
        let vm = (1-f*dt)
        let i = 0
        
        // prepare to apply accel and reset accumulated force
        let acc = this.getAccel(0)
        let accAngle = acc.getAngle()
        let accMag = acc.getMagnitude()
        this.acc = v(0,0)
            
        let nd = this.group.ndims
        let m = this.i+this.n
        for(let i = this.i ; i < m ; i++ ){
                
                // check if currently grabbed
                if( this.group.grabbedParticles.has(i) ) continue
                
                // advance physics
                let a = this.group.state[i*nd+0]
                let av = this.group.state[i*nd+1]
                //let norm = this.edge.getNorm(a)
                let norm = a
                av += accMag * Math.sin(norm-accAngle)// accel particle along edge
                if( Math.abs(av)>1e-4 ) av *= vm // friction
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
    
    accel(acc){
        this.acc = this.acc.add(acc)
    }
    
    // compute the accel felt at position along edge
    getAccel(a){
        return this.acc.add(this.g)
    } 
}
