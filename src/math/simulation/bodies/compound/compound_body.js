// base class for boddies with "children" boddies
class CompoundBody extends Body {
    
    constructor(sim){
        super(sim)
        
        this.constraints = []
        this.children = []
    }
    
    draw(g){
        //this.constraints.forEach(c => c.draw(g) )
        this.children.forEach(c => c.draw(g) )
    }
    
    update(dt){
        this.constraints.forEach(c => c.update(dt) )
        this.children.forEach(c => c.update(dt) )
        
        return true
    }
    
    register(sim){
        this.children.forEach(c => c.register(sim) )
    }
    
    unregister(sim){
        this.children.forEach(c => c.unregister(sim) )
    }
}