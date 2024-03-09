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
    
    draw(g){
        let r = this.sim.particleRadius
        let md2 = global.mouseGrabMd2
        let isEdgeGroup = this.isEdgeGroup
        // start iterating over particle positions
        for( let [i,x,y,grab,ungrab] of this.generateParticles() ){
            
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
                    if( gr.contains(x,y) ){
                        gr.grabbed(x,y)
                        return true
                    }
                    return false
                }))
                if( grabbed ){
                    //console.log(`despawn ${i}`)
                    this.grabbedParticles.add(i)
                } else {
                    
                    // draw particle
                    g.fillRect( x-r, y-r, 2*r, 2*r )
                }
            }
        }
    }
    
    // yield particle x,y coords
    *generateParticles(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}