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
        this.angle = 0
        
        // prepare to add up acceleration during body updates
        // so particles react accordingly in generateParticles()
        this.acc = v(0,0)
        this.spn = 0 // angular
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
        let circ = this.edge.circ
        for(let i = this.i ; i < m ; i++ ){
                
                // check if currently grabbed
                if( this.group.grabbedParticles.has(i) ) continue
                
                // advance physics
                let a = this.group.state[i*nd+0]
                let av = this.group.state[i*nd+1]
                //let norm = this.edge.getNorm(a)
                let [ea,er,norm] = this.edge.getPoint(a)
                norm += this.angle
                av += accMag * Math.sin(norm-accAngle)// accel particle along edge
                if( Math.abs(av)>1e-4 ) av *= vm // friction
                a += av*dt
                this.group.state[i*nd+0] = nnmod(a,circ)
                this.group.state[i*nd+1] = av
                
                // yield one particle to be grabbed/drawn
                let grab = false
                let ungrab = false
                let pos = this.pos.add(vp(ea+this.angle,er))
                let [x,y] = pos.xy()
                yield [i,x,y,grab,ungrab]
        }
    }
    
    // apply force to particles
    accel(acc){
        this.acc = this.acc.add(acc)
    }
    
    // apply centripital force to porticles
    spin(spn){
        this.spn += spn
    }
    
    // compute force felt by a particle 
    // stuck to edge at point a
    // including gravity
    getAccel(a){
        
        // missing centripital force due to body spinning
        return this.acc.add(this.g) 
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
