// a group of particles owned by a physics particle group
// represented by an immutable index
// 
// should only be instantiated 
// through global.mainSim.physicsGroup.newSubgroup()
class PhysicsPSubgroup{
    constructor(sim,subgroupIndex,i,n){
        this.sim = sim
        this.subgroupIndex = subgroupIndex
        this.i = i
        this.n = n
        
        // set all particles as grabbed initially
        let m = this.i+this.n
        for(let j = i ; j < m ; j++ )
            this.sim.grabbedParticles.add(j)
    }
    
    hasIndex(i){
        return (i>=this.i) && (i<this.i+this.n)
    }
    
    spawnParticle(pos,vel){
        let i = this.i
        let m = i+this.n
        let nd = this.sim.ndims
        
        // find available particle slot
        for(let j = i ; j < m ; j++ ){
            if( this.sim.grabbedParticles.has(j) ){
                
                // spawn particle
                this.sim.grabbedParticles.delete(j)
                let k = j*nd
                this.sim.state[k+0] = pos.x
                this.sim.state[k+1] = pos.y
                this.sim.state[k+2] = vel.x
                this.sim.state[k+3] = vel.y
                
                return
            }
        }
    }
}
