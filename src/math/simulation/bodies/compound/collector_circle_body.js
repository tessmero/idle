// controlled circle body in global.mainSim 
// eats particles and contributes to player currency
class CollectorCircleBody extends ControlledCircleBody {
    
    update(dt){
        
        // request a particle to be eaten from edge
        // edge_particle_subgroup.js
        if( Math.random() < .1 )
            this.getMainBody().eatsQueued = 1 
        
        return super.update(dt)
    }
}