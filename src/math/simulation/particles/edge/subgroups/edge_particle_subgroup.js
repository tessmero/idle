// Edge Particle Subgroup
//
// handles any particles stuck to or sliding along
// one specific edge on-screen
//
// a subgroup is a garbage-collectable unit
// owned by an EdgePGroup
class EdgeParticleSubgroup{
    
    // called in EdgePGroup newSubgroup()
    constructor(group,subgroupIndex,i,n,edge){
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
        
        
        // prepare to add up acceleration during body updates
        // so particles react accordingly in generateParticles()
        this.acc = v(0,0)
        this.spn = 0 // angular
    }
    
    // called in EdgePGroup *generateParticles()
    *generateParticles(dt){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
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
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
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
