// a group of particles owned by a physics particle group
// represented by an immutable index
// 
// should only be instantiated 
// through global.edgeGroup.newSubgroup()
class EdgeParticleSubgroup{
    constructor(parent,subgroupIndex,i,n,edgeShape){
        this.parent = parent
        this.subgroupIndex = subgroupIndex
        this.i = i
        this.n = n
        this.edgeShape = edgeShape
        
        // set all particles as grabbed initially
        let m = this.i+this.n
        for(let j = i ; j < m ; j++ )
            this.parent.grabbedParticles.add(j)
        
        // prepare to add up acceleration
        // edge_pgroup.js
        this.acc = v(0,0)
    }
    
    isGrabbed(i){ 
        i += this.i
        return this.parent.grabbedParticles.has(i)
    }
    
    // get angle/vel of particle
    get(i){
        let nd = this.parent.ndims
        let a = this.parent.state[i*nd]
        let av = this.parent.state[i*nd+1]
        return [a,av]
    }
    
    // set particle as grabbed 
    grab(i){
        this.parent.grabbedParticles.add(i)
    }
    
    // move particles in reaction to edge moving
    accel(acc){
        this.acc = this.acc.add(acc)
    }
    
    hasIndex(i){
        return (i>=this.i) && (i<this.i+this.n)
    }
    
    spawnParticle(a,av){
        let i = this.i
        let m = i+this.n
        let nd = this.parent.ndims
        
        // find available particle slot
        for(let j = i ; j < m ; j++ ){
            if( this.parent.grabbedParticles.has(j) ){
                
                // spawn particle
                this.parent.grabbedParticles.delete(j)
                let k = j*nd
                this.parent.state[k+0] = a
                this.parent.state[k+1] = av
                return
            }
        }
    }
}
