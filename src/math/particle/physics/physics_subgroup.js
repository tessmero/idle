// a group of particles owned by a physics particle group
// represented by an immutable index
// 
// should only be instantiated 
// through global.mainSim.physicsGroup.newSubgroup()
class PhysicsParticleSubgroup{
    constructor(parent,subgroupIndex,i,n){
        this.parent = parent
        this.subgroupIndex = subgroupIndex
        this.i = i
        this.n = n
        
        // set all particles as grabbed initially
        let m = this.i+this.n
        for(let j = i ; j < m ; j++ )
            this.parent.grabbedParticles.add(j)
    }
    
    hasIndex(i){
        return (i>=this.i) && (i<this.i+this.n)
    }
    
    spawnParticle(pos,vel){
        let i = this.i
        let m = i+this.n
        let nd = this.parent.ndims
        
        // find available particle slot
        for(let j = i ; j < m ; j++ ){
            if( this.parent.grabbedParticles.has(j) ){
                
                // spawn particle
                this.parent.grabbedParticles.delete(j)
                let k = j*nd
                this.parent.state[k+0] = pos.x
                this.parent.state[k+1] = pos.y
                this.parent.state[k+2] = vel.x
                this.parent.state[k+3] = vel.y
                return
            }
        }
    }
}
