// base class for groups of similar particles
// they may be grabbed by "grabbers" 
// grabbers are circles (x,y,r2) or rectangles (x,y,w,h)
class ParticleGroup {
    
    constructor(n){
        
        // indices of particels that have been grabbed
        this.grabbedParticles = new Set()
    }
    
    draw(g){
        let r = global.particle_radius
        let md2 = global.mouseGrabMd2
        
        // start iterating over particle positions
        let i = 0
        for( let [x,y,ungrab] of this.generateParticles() ){
            
            // check if previously grabbed
            if( this.grabbedParticles.has(i)){
                if( ungrab ){
                    this.grabbedParticles.delete(i)
                }
            }else{
                
                // check if newly grabbed
                let grabbed = [...global.grabbers].some( gr => {
                    return gr.grabbed(x,y)
                    
                    //if( poi.pos.sub(p).getD2() < poi.md2 ){ 
                    //    poi.md2 += global.poiGrowthRate 
                    //    if( poi.md2 > global.poiMaxArea ) poi.md2 = global.poiMaxArea
                    //    this.grabbedParticles.add(i)
                    //    return true
                    //}
                })
                if( grabbed ){
                    this.grabbedParticles.add(i)
                } else {
                    
                    // draw particle
                    g.fillRect( x-r, y-r, 2*r, 2*r )
                }
            }
            
            i += 1
        }
    }
    
    // yield particle x,y coords
    *generateParticles(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}