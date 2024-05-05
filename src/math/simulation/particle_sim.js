class ParticleSim {
    
    constructor(n,rect,drawOffset=[0,0]){
        this.t = 0
        this.rect = rect
        this.drawOffset = [0,0]
        
        // particles
        this.rainGroup = new ProceduralPGroup(this,n)
        this.physicsGroup = new PhysicsParticleGroup(this,n)
        this.edgeGroup = new EdgeParticleGroup(this,n)
        
        // prepare extra subgroup for various leftover physics particles
        // e.g. particles emitted by body, then body was deleted
        this.leftoverPPS = this.physicsGroup.newSubgroup() 
        
        this._grabbers = new Set() // Grabber instances
        this._bodies = new Set() // Body instances
        this.floaters = new FloaterGroup(1000) 
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
    
    
    // trigger context menu if applicable
    bodyClicked(b){
        
        // go to representative body if 
        // some part of a compound body was selected
        while( b.parent ){
            b = b.parent
        }
        
        if( b instanceof Buddy ){
            // do nothing
        } else if( b instanceof CompoundBody ){
            b = b.getMainBody()
        }  
        
        this.selectedBody = b
        this.selectedParticle = null
    }
    
    // trigger particle context menu
    // using particle inspector tool
    particleClicked(p){
        this.selectedParticle = p
        this.selectedBody = null
    }
    
    
    getTool(){
        return this._tool
    }
    
    setTool(t){
        if( t == this._tool ) return
        
        if(this._tool){
            this._tool.unregister(this)
        }
        this._tool = t
    }
    
    getGrabbers(){
        return [...this._grabbers]
    }
    
    clearGrabbers(){
        this._grabbers.clear()
    }
    
    addGrabber(b){
        this._grabbers.add(b)
    }
    
    removeGrabber(b){
        this._grabbers.delete(b)
    }
    
    getBodies(){
        return [...this._bodies]
    }
    
    addBody(b){
        if( this._bodies.length >= global.maxBodyCount ){
            return
        }
        
        if( this._bodies.has(b) ){
            return
        }
        
        this._bodies.add(b)
        b.sim = this
        b.register(this)
    }
    
    removeBody(b){
        this._bodies.delete(b)
        b.unregister(this)
    }
    
    // remove all bodies
    clearBodies(){
        [...this._bodies].forEach(b => this.removeBody(b))
        this.selectedBody = null
    }
    
    reset(){
        let s = this
        s.clearBodies()
        s.clearGrabbers()
        s.setTool(null)
        s.selectedParticle = null
        s.selectedBody = null
        s.particlesCollected = 0
        //s.t = 0
    }
        
    update(dt){
        this.t += dt
    
        // update bodies
        let toRemove = [...this._bodies].filter( p => {
            let alive = p.update(dt)
            return !alive
        })
        toRemove.forEach( b => this.removeBody(b) )
    }

    updateControlPointHovering(p){
        
        // update control point hovering status
        if( !this.draggingControlPoint ){
            let cps = this.getBodies().flatMap( b => b.controlPoints)
            this.hoveredControlPoint = cps.find( 
                    cp => (cp.pos.sub(p).getD2() < cp.r2) )
        }
    }
    
    draw(g){
        
        g.translate(...this.drawOffset)
        
        resetRand()
        g.fillStyle = global.colorScheme.fg
        this._bodies.forEach( p => p.draw(g) )
        this._bodies.forEach( p => p.drawDebug(g) )
        
        let c = global.colorcodeParticles
        if( c ) g.fillStyle = 'red'
        this.rainGroup.draw(g)
        
        if( c ) g.fillStyle = 'green'
        this.physicsGroup.draw(g)
        
        if( c ) g.fillStyle = 'blue'
        this.edgeGroup.draw(g)
        
        if( global.debugGrabbers ){
            this._grabbers.forEach(gr => gr.drawDebug(g) )
        }
        
        let cp = this.draggingControlPoint
        if( !cp ) cp = this.hoveredControlPoint
        if( cp ) {
            cp.draw(g,global.colorScheme.hl,true)
        }
        
        g.fillStyle = global.colorScheme.fg
        
    
        // draw tool overlay if applicable
        let tool = this._tool
        if( tool && tool.draw ){
            tool.draw(g)
        }
    
        // draw floaters
        this.floaters.draw(g)
        
        g.translate(-this.drawOffset[0],-this.drawOffset[1])
    }
}