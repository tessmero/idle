// Edge Particle Subgroup
//
// handles any particles stuck to or sliding along
// one specific body
//
// a "subgroup" is a garbage-collectable unit
// owned by an EdgePGroup
//
// members include
//   - body outline shape (Edge instance)
//   - body physics state (position,orientation,momentum)
class EdgeParticleSubgroup{
    // called in EdgePGroup newSubgroup()
    constructor(group,subgroupIndex,i,n,edge,pos,angle){
        this.group = group
        this.subgroupIndex = subgroupIndex
        this.i = i
        this.n = n
        this.edge = edge // Edge instance
        this.g = v(0,-edge.getG()) // gravity
        
        // set all particles as grabbed initially
        let m = this.i+this.n
        for(let j = i ; j < m ; j++ )
            this.group.grabbedParticles.add(j)
        
        // state
        this.pos = v(0,0)
        this.vel = v(0,0)
        this.angle = 0
        this.avel = 0
        
        // prepare to add up net translational force during body updates
        // so particles react accordingly in generateParticles()
        this.acc = v(0,0)
        this.spn = 0
    }
    
    // called in EdgePGroup *generateParticles()
    *generateParticles(dt){
        
        // prepare to multiply and offset velocities
        // to apply gravity and accel to all particles
        let f = this.edge.getFriction()
        let vm = (1-f*dt)
        let i = 0
        
        // update centripital foce due to body spinning
        this.spn = this.avel*dt
        
        // anti-normal stickiness "force" for purposes of 
        // deciding whether a particle remains stuck to edge
        let stickyAccMag = global.particleStickyForce.map(v => v*dt) 
            
        let nd = this.group.ndims
        let m = this.i+this.n
        let circ = this.edge.circ
        for(let i = this.i ; i < m ; i++ ){
                
                // check if currently grabbed
                if( this.group.grabbedParticles.has(i) ) continue      
                
                // advance physics
                let a = this.group.state[i*nd+0]
                
                let av = this.group.state[i*nd+1]
                let [ea,er,norm] = this.edge.lookupDist(a)
                let acc = this.getAccel(a)
                
                let accAngle = acc.getAngle()
                let accMag = acc.getMagnitude()
                norm += this.angle
                av += accMag * Math.sin(norm-accAngle)// accel particle along edge
                av *= vm // friction
                a += av*dt
                a = nnmod(a,circ)
                this.group.state[i*nd+0] = a
                this.group.state[i*nd+1] = av
        
                let grab = false
                    
                // normal force felt by particle anchored to edge at this particle's position
                let normAcc = -accMag * Math.cos(norm-accAngle)

                // additional normal force felt due to sliding along edge
                let slideCentrifugalAcc = 0 
                
                // check if this particle has been pulled off edge
                if( safeRandRange(...stickyAccMag) < (normAcc + slideCentrifugalAcc) ){
                    
                    // pass particle to physics group
                    grab = true
                    let pos = this.getPos(a)
                    let vel = this.getVel(a).add(vp(norm+pio2,av))
                    this.pps.spawnParticle(pos,vel)
                    
                // check if body is waiting to eat particle
                } else if( this.body && (this.body.eatsQueued > 0) ){
                    this.body.eatsQueued -= 1
                    let pos = this.getPos(a)
                    this.body.eatParticleFromEdge(...pos.xy())
                    grab = true
                    
        
                    // show message
                }
                
                // yield one particle to be grabbed/drawn
                let ungrab = false
                let pos = this.getPos(a)
                let [x,y] = pos.xy()
                
                
                yield [i,x,y,grab,ungrab]
        }
        
        // reset net force
        this.acc = v(0,0)
    }
    
    
    // get x,y position at given 
    // distance along cirumference
    getPos(a){
        let [ea,er,norm] = this.edge.lookupDist(a)
        return this.pos.add(vp(ea+this.angle,er))
    }
    
    // compute velocity of a particle 
    // achored to edge at given distance along cirumference
    getVel(a){
        let [ea,er,norm] = this.edge.lookupDist(a)
        return this.vel //translation
            .add(vp(this.angle+ea+pio2,er*this.avel)) //rotation
    }
    
    // compute net force that would be felt by a particle 
    // achored to edge at given distance along cirumference
    getAccel(a){
        let [ea,er,norm] = this.edge.lookupDist(a)
        let acc = this.acc // translational force
                .add(this.g) //gravity
                .add(vp(ea+this.angle,-1e-3*Math.abs(this.spn)*er)) //centripital force        
        return acc
    }  
    
    count(b){
        let result = 0
        for(let j = 0 ; j < this.n ; j++ )
            if( this.isGrabbed(j) == b ) 
                result += 1
        return result
    }
    
    isGrabbed(i){ 
        i += this.i
        return this.group.grabbedParticles.has(i)
    }
    
    // get angle/vel of particle
    get(i){
        i += this.i
        let nd = this.group.ndims
        let a = this.group.state[i*nd]
        let av = this.group.state[i*nd+1]
        return [a,av]
    }
    
    set(i,a,av){
        i += this.i
        let nd = this.group.ndims
        this.group.state[i*nd] = a
        this.group.state[i*nd+1] = av
    }
    
    // set particle as grabbed 
    grab(i){
        i += this.i
        this.group.grabbedParticles.add(i)
    }
    
    hasIndex(i){
        return (i>=this.i) && (i<this.i+this.n)
    }
    
    
    spawnParticle(a,av){

        let i = this.i
        let m = i+this.n
        let nd = this.group.ndims
        
        // find available particle slot
        for(let j = i ; j < m ; j++ ){
            if( this.group.grabbedParticles.has(j) ){
                
                // spawn particle
                this.group.grabbedParticles.delete(j)
                let k = j*nd
                this.group.state[k+0] = a
                this.group.state[k+1] = av
                
                //console.log(`eps ${i}-${m} spawned ${j}`)
                return
            }
        }
    }
}
