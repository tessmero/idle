// a group of particles owned by a PhysicsParticleGroup
// has fixed address range i to i+n
//
// "subgroup" meaning one garbage-collectable unit
class PhysicsParticleSubgroup{
    constructor(group,subgroupIndex,i,n){
        this.group = group
        this.subgroupIndex = subgroupIndex
        this.i = i
        this.n = n
        
        // set all particles as grabbed initially
        let m = this.i+this.n
        for(let j = i ; j < m ; j++ )
            this.group.grabbedParticles.add(j)
    }
    
    
    // called in PyhsicsPGroup *generateParticles()
    *generateParticles(dt,vm,vb){
        let grp = this.group
        let nd = grp.ndims
        for( let di = 0 ; di < this.n ; di++ ){
            let i = this.i + di
        
            // check if currently grabbed
            if( grp.grabbedParticles.has(i) ) continue
            
            let x = grp.state[i*nd+0]
            let y = grp.state[i*nd+1]
        
            // advance physics
            let vx = grp.state[i*nd+2]
            let vy = grp.state[i*nd+3]
            
            vx = vm*vx + vb.x
            vy = vm*vy + vb.y
            x += vx*dt
            y += vy*dt
            
            grp.state[i*nd+0] = x
            grp.state[i*nd+1] = y
            grp.state[i*nd+2] = vx
            grp.state[i*nd+3] = vy
            
            // check if off-screen
            let grab = false
            if( !inRect(x,y,...grp.sim.rect) ){
                grab = true 
            }
            
            // yield one particle
            let ungrab = false
            yield [this,i,x,y,grab,ungrab]
        
        }
    }        
    
    hasIndex(i){
        return (i>=this.i) && (i<this.i+this.n)
    }
    
    spawnParticle(pos,vel){
        let i = this.i
        let m = i+this.n
        let grp = this.group
        let nd = this.group.ndims
        
        // find available particle slot
        for(let j = i ; j < m ; j++ ){
            if( grp.grabbedParticles.has(j) ){
                
                // spawn particle
                grp.grabbedParticles.delete(j)
                let k = j*nd
                grp.state[k+0] = pos.x
                grp.state[k+1] = pos.y
                grp.state[k+2] = vel.x
                grp.state[k+3] = vel.y
                
                return
            }
        }
    }
}
