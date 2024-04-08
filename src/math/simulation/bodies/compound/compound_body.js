// base class for boddies with "children" boddies
class CompoundBody extends Body {
    
    constructor(sim,pos){
        super(sim,pos)
        
        this.constraints = []
        this.children = []
        this.controlPoints = []
    }
    
    draw(g){
        this.children.forEach(c => c.draw(g) )
    }
    
    drawDebug(g){
        //this.constraints.forEach(c => c.drawDebug(g) )
        this.children.forEach(c => c.drawDebug(g) )
    }
    
    update(dt){
        let beingControlled = this.controlPoints.find( cp => cp == this.sim.draggingControlPoint )
        
        this.constraints.forEach(c => c.update(dt) )
        this.children.forEach(c => c.update(dt,beingControlled) )
        
        return true
    }
    
    register(sim){
        this.children.forEach(c => c.register(sim) )
    }
    
    unregister(sim){
        this.children.forEach(c => c.unregister(sim) )
    }
}