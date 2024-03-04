// group of particles stuck to the edges of shapes
//
// instantiated in particle_sim.js
class EdgePGroup extends ParticleGroup {
    
    
    constructor(parent,n){
        super(parent,n)
        this.isEdgeGroup = true // particle_group.js draw()
        
        // preare to keep track of up to 
        // n particles with 4 props a,av
        const ndims = 2
        this.ndims = ndims
        this.state = new Float32Array(n*ndims); 
        
        // maximum number of particles per subgroup
        // subgroup = (garbage-collectable unit)
        this.maxSubgroups = 10
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
    newSubgroup(edgeShape) {
        
        if( this.freeSubgroupIndices.size == 0 ){
            return null
        }
        
        let subgroupIndex = this.freeSubgroupIndices.find(true)
        let n = this.nsub
        let i = subgroupIndex*n
        let sg = new EdgeParticleSubgroup(this,subgroupIndex,i,n,edgeShape)
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
        let n_particles = this.parent.n
        let sr = global.screenRect
        let anim_angle = this.parent.t*1e-4
        let particleRadius = this.parent.particleRadius
        let md2 = global.mouseGrabMd2
        let nd = this.ndims
        
        
        let dt = 0
        if( this.lastDrawTime ) dt = this.parent.t-this.lastDrawTime
        this.lastDrawTime = this.parent.t
        
        
        // prepare to multiply and offset velocities
        // to apply gravity and accel to all particles
        let f = 5e-4
        let g = 2e-6
        let vm = (1-f*dt)
        let vb = g * dt
        let i = 0
        
        
        for( let eps of this.subgroups ){
            
            // prepare to apply subgroup-specific forces
            let am = 2*eps.acc.getMagnitude()
            let aa = eps.acc.getAngle()
            eps.acc = v(0,0)
        
            for( let di = 0 ; di < eps.n ; di++ ){
                let i = eps.i + di
                
                // check if currently grabbed
                if( this.grabbedParticles.has(i) ) continue
                
                // advance physics
                let a = this.state[i*nd+0]
                let av = this.state[i*nd+1]
                av += vb * Math.cos(a) // gravity
                av += am * Math.sin(a-aa) // subgroup forces
                if( Math.abs(av)>1e-4 ) av *= vm // friction
                a += av*dt
                this.state[i*nd+0] = a
                this.state[i*nd+1] = av
                
                // yield one particle to be grabbed/drawn
                let grab = false
                let ungrab = false
                let [x,y] = eps.edgeShape.getPos(a).xy()
                yield [i,x,y,grab,ungrab]
                
            }
        }
    }
}