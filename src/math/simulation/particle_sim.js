class ParticleSim {
    
    constructor(n,rect){
        this.t = 0
        this.rect = rect
        
        // particles
        this.rainGroup = new ProceduralPGroup(this,n)
        this.physicsGroup = new PhysicsPGroup(this,n)
        this.edgeGroup = new EdgePGroup(this,n)
        
        this.grabbers = new Set() // Grabber instances
        this.allBodies = new Set() // Body instances
        this.poiMaxArea = 1e-2
        this.poiShrinkRate = 1e-6// vunits^2 area lost per ms
        
        // physics params
        this.fallSpeed = 2e-4 // terminal velocity dist/ms
        this.particleRadius = .005 
        this.particleG = v(0,1e-7) // gravity accel dis/ms/ms
        
        this.particlesCollected = 0
    }
    
    addBody(b){
        if( this.allBodies.length >= global.maxBodyCount ){
            return
        }
        
        if( this.allBodies.has(b) ){
            return
        }
        
        this.allBodies.add(b)
        b.sim = this
        b.register(this)
    }
    
    removeBody(b){
        this.allBodies.delete(b)
        b.unregister(this)
    }
    
    // remove all bodies
    clearBodies(){
        [...this.allBodies].forEach(b => this.removeBody(b))
    }
    
    update(dt){
        this.t += dt
    
        // update bodies
        let toRemove = [...this.allBodies].filter( p => {
            let alive = p.update(dt)
            return !alive
        })
        toRemove.forEach( b => this.removeBody(b) )
    }
    
    draw(g){
        resetRand()
        g.fillStyle = global.lineColor
        this.allBodies.forEach( p => p.draw(g) )
        
        let c = global.colorcodeParticles
        if( c ) g.fillStyle = 'red'
        this.rainGroup.draw(g)
        
        if( c ) g.fillStyle = 'green'
        this.physicsGroup.draw(g)
        
        if( c ) g.fillStyle = 'blue'
        this.edgeGroup.draw(g)
    }
}