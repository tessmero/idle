// group of particles stuck to the edges of shapes
//
// instantiated in particle_sim.js
class EdgePGroup extends ParticleGroup {
    
    
    constructor(sim,n){
        super(sim,n)
        this.isEdgeGroup = true // particle_group.js draw()
        
        // preare to keep track of up to 
        // n particles with 2 props a,av
        const ndims = 2
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
    // for bodies that emit particles
    //    
    // should be called in [Body subclass]::register(sim):
    //      sim.edgeGroup.newSubgroup(edge)
    newSubgroup(edge){
        let f
        if(edge instanceof CircleEdge){
            f = (...p) => new CircleEPSG(...p)
        }else if(edge instanceof LineEdge){
            f = (...p) => new LineEPSG(...p)
        }else{
            throw new Error(`unrecognized EPSG subclass`);
        }
        return this._newSubgroup(edge,f)
    }
    _newSubgroup(edge,cons) {
        
        if( this.freeSubgroupIndices.size == 0 ){
            return null
        }
        
        let subgroupIndex = this.freeSubgroupIndices.find(true)
        let n = this.nsub
        let i = subgroupIndex*n
        let sg = cons(this,subgroupIndex,i,n,edge)
        this.subgroups.add(sg)
        this.freeSubgroupIndices.delete(subgroupIndex)
        return sg
    }
    
    // should be called in [Body subclass]::unregister(sim):
    //      sim.edgeGroup.deleteSubgroup(edge)
    deleteSubgroup(sg){
        this.freeSubgroupIndices.add(sg.subgroupIndex)
        this.subgroups.delete(sg)
    }
    
    *generateParticles(){
        resetRand()
        let n_particles = this.sim.n
        let sr = global.screenRect
        let anim_angle = this.sim.t*1e-4
        let particleRadius = this.sim.particleRadius
        let md2 = global.mouseGrabMd2
        let nd = this.ndims
        
        
        let dt = 0
        if( this.lastDrawTime ) dt = this.sim.t-this.lastDrawTime
        this.lastDrawTime = this.sim.t
        
        for( let eps of this.subgroups ){
            yield* eps.generateParticles(dt)
        }
    }
}