class ParticleSim {
    
    constructor(n,rect,drawOffset=[0,0]){
        this.t = 0
        this.rect = rect
        this.drawOffset = [0,0]
        
        // particles
        this.rainGroup = new ProceduralPGroup(this,n)
        this.physicsGroup = new PhysicsPGroup(this,n)
        this.edgeGroup = new EdgePGroup(this,n)
        
        // prepare extra subgroup for various leftover physics particles
        // e.g. particles emitted by body, then body was deleted
        this.leftoverPPS = this.physicsGroup.newSubgroup() 
        
        this.grabbers = new Set() // Grabber instances
        this.allBodies = new Set() // Body instances
        this.poiMaxArea = 1e-2
        this.poiShrinkRate = 1e-6// vunits^2 area lost per ms
        
        // physics params
        this.fallSpeed = 2e-4 // terminal velocity dist/ms
        this.particleRadius = .005 
        this.particleG = v(0,1e-7) // gravity accel dis/ms/ms
        
        // state
        this.particlesCollected = 0
        
        // circles for mouse to click and drag
        this.controlPointRadius = .05
        
        this.hoveredControlPoint = null //ControlPoint instance
        this.draggingControlPoint = null //ControlPoint instance
    }
    
    // callback used in main_psim.js
    // to trigger context menu
    bodyClicked(b){}
    
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
        this.selectedBody = null
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

    updateControlPointHovering(p){
        
        // update control point hovering status
        if( !this.draggingControlPoint ){
            let bodies = [...this.allBodies]
            let cps = bodies.flatMap( b => b.controlPoints)
            this.hoveredControlPoint = cps.find( 
                    cp => (cp.pos.sub(p).getD2() < cp.r2) )
        }
    }
    
    draw(g){
        g.translate(...this.drawOffset)
        
        resetRand()
        g.fillStyle = global.fgColor
        this.allBodies.forEach( p => p.draw(g) )
        this.allBodies.forEach( p => p.drawDebug(g) )
        
        let c = global.colorcodeParticles
        if( c ) g.fillStyle = 'red'
        this.rainGroup.draw(g)
        
        if( c ) g.fillStyle = 'green'
        this.physicsGroup.draw(g)
        
        if( c ) g.fillStyle = 'blue'
        this.edgeGroup.draw(g)
        
        if( global.debugGrabbers ){
            this.grabbers.forEach(gr => gr.drawDebug(g) )
        }
        
        let cp = this.draggingControlPoint
        if( !cp ) cp = this.hoveredControlPoint
        if( cp ) {
            cp.draw(g,'white',true)
        }
        
        g.fillStyle = global.fgColor
        
        g.translate(-this.drawOffset[0],-this.drawOffset[1])
    }
}