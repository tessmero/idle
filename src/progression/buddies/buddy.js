// base class for privileged bodies 
// with their own progression state
class Buddy extends CompoundBody {

    constructor( sim,pos ){
        super(sim,pos)
        
        this.exp = 0
        this.expLevel = 1
        this.particlesCollected = 0
        
        this.levelCosts = ValueCurve.power(100,2)
    }
    
    update(dt){
        
        // request a particle to be eaten from edge
        // edge_particle_subgroup.js
        if( Math.random() < .1 )
            this.getMainBody().eatsQueued = 1 
        
        return super.update(dt)
    }
}