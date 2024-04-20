// base class for groups of similar particles
// particles may be grabbed by Grabber instances
class ParticleGroup {
    
    constructor(sim,n){
        // ParticleSim instance
        this.sim = sim
        
        // indices of particels that have been grabbed
        this.grabbedParticles = new IntSet(n)
        this.n = n
    }
    
    // draw all the particles in this group
    // second param is optional override
    // drawing individual particles
    draw( g, pdraw=((g,x,y,r) => g.fillRect( x-r, y-r, 2*r, 2*r )) ){
        
        let r = this.sim.particleRadius
        let md2 = global.mouseGrabMd2
        let isEdgeGroup = this.isEdgeGroup
        
        
        // start iterating over particle positions
        for( let [i,x,y,grab,ungrab,dx,dy] of this.generateParticles() ){
            
            // check if previously grabbed
            if( this.grabbedParticles.has(i) ){
            
                if( ungrab ){
                    //console.log(`ungrab ${i}`)
                    this.grabbedParticles.delete(i)
                }
                
            }else{
                
                // check if newly grabbed
                let grabbed = (grab || [...this.sim.grabbers].some( gr => {
                    //if( isEdgeGroup && (!gr.canGrabEdgeParticle(i)) ) return false
                    if( isEdgeGroup ) return false
                    let hit = gr.contains(x,y)
                    if( hit ){
                        if( gr.grabbed ) gr.grabbed(x,y,dx,dy,hit)
                        return true
                    }
                    return false
                }))
                
                
                
                
                // draw particle
                pdraw(g,x,y,r)
                    
                if( grabbed ){
                    //console.log(`despawn ${i}`)
                    this.grabbedParticles.add(i)
                } else {
                    
                }
            }
        }
    }
    
    // yield particle x,y coords
    *generateParticles(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}