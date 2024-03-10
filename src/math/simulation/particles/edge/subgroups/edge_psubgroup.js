// Edge Particle Subgroup
//
// handles any particles suck or sliding along
// one specific edge on-screen
//
// a subgroup is a garbage-collectable unit
// owned by an EdgePGroup
class EdgePSubgroup{
    
    // called in EdgePGroup newSubgroup()
    constructor(group,subgroupIndex,i,n,edge){
        this.group = group
        this.subgroupIndex = subgroupIndex
        this.i = i
        this.n = n
        this.edge = edge // Edge instance
        
        // set all particles as grabbed initially
        let m = this.i+this.n
        for(let j = i ; j < m ; j++ )
            this.group.grabbedParticles.add(j)
        
        // prepare to add up acceleration
        // edge_pgroup.js
        this.acc = v(0,0)
    }
    
    // called in EdgePGroup *generateParticles()
    *generateParticles(dt){
        
        // prepare to multiply and offset velocities
        // to apply gravity and accel to all particles
        let f = this.edge.getF()
        let g = this.edge.getG()
        let vm = (1-f*dt)
        let vb = g * dt
        let i = 0
        
        // prepare to apply subgroup-specific forces
        let am = this.acc.getMagnitude()
        let aa = this.acc.getAngle()
        this.acc = v(0,0)
            
        let nd = this.group.ndims
        let m = this.i+this.n
        for(let i = this.i ; i < m ; i++ ){
                
                // check if currently grabbed
                if( this.group.grabbedParticles.has(i) ) continue
                
                // advance physics
                let a = this.group.state[i*nd+0]
                let av = this.group.state[i*nd+1]
                let norm = this.edge.getNorm(a)
                av += vb * Math.cos(norm) // gravity
                av += am * Math.sin(norm-aa) // subgroup forces
                if( Math.abs(av)>1e-4 ) av *= vm // friction
                a += av*dt
                this.group.state[i*nd+0] = a
                this.group.state[i*nd+1] = av
                
                // yield one particle to be grabbed/drawn
                let grab = false
                let ungrab = false
                let pos = this.edge.getPos(a)
                let [x,y] = pos.xy()
                yield [i,x,y,grab,ungrab]
        }
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
