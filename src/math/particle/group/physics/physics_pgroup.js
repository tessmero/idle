// group of bouncing particles
//
// global.physicsGroup should be the only instance (setup.js)
class PhysicsPGroup extends ParticleGroup {
    
    
    constructor(){
        super()
        
        // maximum total number of particles
        const n = 1e4
        
        // preare to keep track of up to 
        // n particles with 4 props x,y,vx,vy
        const ndims = 4
        this.ndims = ndims
        this.state = new Float32Array(n*ndims); 
        
        // maximum number of particles per subgroup
        // subgroup = (garbage-collectable unit)
        const nsub = 1e3
        this.nsub = nsub
        this.maxSubgroups = Math.floor(n/nsub)
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
        let sg = new PhysicsParticleSubgroup(this,subgroupIndex,i,n)
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
        let n_particles = global.nParticles
        let sc = global.screenCorners
        let sr = global.screenRect
        let anim_angle = global.t*1e-4
        let particleRadius = global.particleRadius
        let particleWiggle = global.particleWiggle
        let md2 = global.mouseGrabMd2
        let nd = this.ndims
        
        
        let dt = 0
        if( this.lastDrawTime ) dt = global.t-this.lastDrawTime
        this.lastDrawTime = global.t
        
        
        // set terminal velocity to match falling rain
        let mg = global.particleG.getMagnitude()
        let particleFriction = mg / global.fallSpeed
        
        // prepare to multiply and offset velocities
        // to apply friction and gravity to all particles
        let vm = (1-particleFriction*dt)
        
        
        let vb = global.particleG.mul(dt)
        
        
        for( let pps of this.subgroups ){
            for( let di = 0 ; di < pps.n ; di++ ){
                let i = pps.i + di
            
                // check if currently grabbed
                if( this.grabbedParticles.has(i) ) continue
                
                let x = this.state[i*nd+0]
                let y = this.state[i*nd+1]
            
                // advance physics
                let vx = this.state[i*nd+2]
                let vy = this.state[i*nd+3]
                
                vx = vm*vx + vb.x
                vy = vm*vy + vb.y
                x += vx*dt
                y += vy*dt
                
                this.state[i*nd+0] = x
                this.state[i*nd+1] = y
                this.state[i*nd+2] = vx
                this.state[i*nd+3] = vy
                
                // check if off-screen
                let grab = !inRect(x,y,...global.screenRect) 
                
                // yield one particle to be grabbed/drawn
                let ungrab = false
                yield [i,x,y,grab,ungrab]
            
            }
        }
    }
}