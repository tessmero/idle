// base class for groups of similar particles
// they may be grabbed by Grabber instances
class ParticleGroup {
    
    constructor(n){
        
        // indices of particels that have been grabbed
        this.grabbedParticles = new IntSet(n)
    }
    
    draw(g){
        let r = global.particleRadius
        let md2 = global.mouseGrabMd2
        let isEdgeGroup = (this==global.edgeGroup)
        // start iterating over particle positions
        for( let [i,x,y,grab,ungrab] of this.generateParticles() ){
            
            // check if previously grabbed
            if( this.grabbedParticles.has(i) ){
            
                if( ungrab ){
                    this.grabbedParticles.delete(i)
                }
                
            }else{
                
                // check if newly grabbed
                let grabbed = (grab || [...global.grabbers].some( gr => {
                    if( isEdgeGroup && (!gr.canGrabEdgeParticle(i)) ) return false
                    if( gr.contains(x,y) ){
                        gr.grabbed(x,y)
                        return true
                    }
                    return false
                }))
                if( grabbed ){
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