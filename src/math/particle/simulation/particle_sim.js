class ParticleSim {
    
    constructor(n,rect){
        this.t = 0
        this.rect = rect
        
        // particles
        this.rainGroup = new ProceduralPGroup(this,n)
        this.physicsGroup = new PhysicsPGroup(this,n)
        this.edgeGroup = new EdgePGroup(this,n)
        
        this.grabbers = new Set() // Grabber instances
        this.allPois = [] // Poi instances
        this.poiMaxArea = 1e-2
        this.poiShrinkRate = 1e-6// vunits^2 area lost per ms
        
        // physics params
        this.fallSpeed = 2e-4 // terminal velocity dist/ms
        this.particleRadius = .005 
        this.particleG = v(0,1e-7) // gravity accel dis/ms/ms
        
        this.particlesCollected = 0
    }
    
    update(dt){
        this.t += dt
    
        // update pois
        this.allPois = this.allPois.filter( p => {
            let alive = p.update(dt)
            if( !alive ){
                p.cleanup()
            }
            return alive
        })
    }
    
    draw(g){
        resetRand()
        g.fillStyle = global.lineColor
        this.rainGroup.draw(g)
        this.physicsGroup.draw(g)
        this.edgeGroup.draw(g)
        this.allPois.forEach( p => p.draw(g) )
    }
}