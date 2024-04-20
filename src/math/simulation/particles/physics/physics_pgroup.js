// group of bouncing particles
//
// instantiated in particle_sim.js
class PhysicsPGroup extends ParticleGroup {
    
    
    constructor(sim,n){
        super(sim,n)
        
        // preare to keep track of up to 
        // n particles with 4 props x,y,vx,vy
        const ndims = 4
        this.ndims = ndims
        this.state = new Float32Array(n*ndims); 
        
        // maximum number of particles per subgroup
        // subgroup = (garbage-collectable unit)
        this.maxSubgroups = 100
        this.nsub = Math.floor(n/this.maxSubgroups)
        this.freeSubgroupIndices = new IntSet(this.maxSubgroups,true)
        
        // prepare to keep track of subgroups
        this.subgroups = new Set()
        
        // set all particles as grabbed initially
        this.grabbedParticles.fill(true)
    }
    
    // return new subgroup instance
    // should be called in constructors 
    // for objects that emit particles
    newSubgroup() {
        
        if( this.freeSubgroupIndices.size() == 0 ){
            return null
        }
        
        let subgroupIndex = this.freeSubgroupIndices.find(true)
        let n = this.nsub
        let i = subgroupIndex*n
        let sg = new PhysicsPSubgroup(this,subgroupIndex,i,n)
        this.subgroups.add(sg)
        this.freeSubgroupIndices.delete(subgroupIndex)
        return sg
    }
    
    deleteSubgroup(sg){
        this.freeSubgroupIndices.add(sg.subgroupIndex)
        this.subgroups.delete(sg)
    }
    
    *generateParticles(){
        resetRand()
        let n_particles = this.n
        let particleRadius = this.sim.particleRadius
        let md2 = global.mouseGrabMd2
        let nd = this.ndims
        
        
        let dt = 0
        if( this.lastDrawTime ) dt = this.sim.t-this.lastDrawTime
        this.lastDrawTime = this.sim.t
        
        
        // set terminal velocity to match falling rain
        let mg = this.sim.particleG.getMagnitude()
        let particleFriction = mg / this.sim.fallSpeed
        
        // prepare to multiply and offset velocities
        // to apply friction and gravity to all particles
        let vm = (1-particleFriction*dt)
        
        
        let vb = this.sim.particleG.mul(dt)
        
        
        for( let pps of this.subgroups ){
            yield *pps.generateParticles(dt,vm,vb)
        }
    }
}