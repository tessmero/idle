// used in pi_context_menu.js
// to continuously poll the state 
// of one particle by subgroup and (index in subgroup)
class TrackOneParticleGrabber extends Grabber{
    
    constructor(subgroup,i,f){
        super(f)
        this.subgroup = subgroup
        this.i = i
    }
    
    // implement Grabber
    contains(subgroup,i,x,y){
        return (subgroup == this.subgroup) 
            && (i == this.i) 
    }
    
    // implement Grabber
    drawDebug(g){
        // do nothing
    }
    
}