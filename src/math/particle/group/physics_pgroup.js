// group of bouncing particles
class PhysicsPGroup extends ParticleGroup {
    
    
    constructor(){
        super()
        this.lastDrawTime = 0
        
        // maximum number of particles
        let n = 1e5
        
        // preare to keep track of up to 
        // n particles with 4 props x,y,vx,vy
        this.state = new Float32Array(n*4); 
        
        // set all particles as grabbed initially
        for(let i = 0 ; i < n ; i++ )
            this.grabbedParticles.add(i)
        
        // maximum number of particles per subgroup
        // subgroup = (garbage-collectable unit)
        let nsub = 1e3
        this.nsub = nsub
        this.max_subgroups = Math.floor(n/nsub)
        this.free_subgroup_indices = [...Array(this.max_subgroups).keys()];
        
        // prepare to keep track of subgroups
        this.subgroups = []
    }
    
    // attempt to allocate new subgroup
    // return new subgroup instance
    newSubgroup() {
        
        let i = Math.min(...free_subgroup_indices)
        let sg = new PhysicsParticleSubgroup(i)
        this.subgroups.push(sg)
        return sg
    }
    
    *generateParticles(){
        resetRand()
        let n_particles = global.nParticles
        let sc = global.screenCorners
        let sr = global.screenRect
        let anim_angle = global.t*1e-4
        let particle_radius = global.particle_radius
        let particle_wiggle = global.particle_wiggle
        let md2 = global.mouseGrabMd2
        global.particlesInMouseRange.clear()
        for( let i = 0 ; i < n_particles ; i++ ){
            
            // check if currently grabbed
            if( this.grabbedParticles.has(i) ) continue
            
            let x = this.state[i*4+0]
            let y = this.state[i*4+1]
            
            // check if off-screen
            if( !inRect(x,y,...global.screenRect) ){
                this.grabbedParticles.add(i)
                continue
            }
            
            // advance physics
            let vx = this.state[i*4+2]
            let vy = this.state[i*4+3]
            x += vx
            y += vy
            this.state[i*4+0] = x
            this.state[i*4+1] = y
            
            // yield one particle to be grabbed/drawn
            yield [x,y]
            
        }
        this.lastDrawTime = global.t
    }
}