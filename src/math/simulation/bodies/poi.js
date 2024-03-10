class Poi extends CircleBody{
    constructor(sim,p){
        super(sim,p,Math.sqrt(global.poiStartArea))
        if( this.md2 > sim.poiMaxArea ) this.md2 = sim.poiMaxArea
        this.rad = Math.sqrt(this.md2)
        
        this.pressure = 0 //0-1 increases when held by player
        this.pressurePattern = null//instance of PressurePattern
    }
    
    // called in particle_sim.js removeBody()
    // this.sim has been set
    // sim param passed for convenience
    unregister(){
        this.sim.grabbers.delete(this.grabber)
        this.sim.physicsGroup.deleteSubgroup(this.pps)
        this.sim.edgeGroup.deleteSubgroup(this.eps)
    }
    
    // callback for this.grabber
    // when a particle is grabbed (particle_group.js)
    grabbed(x,y){        
        this.sim.particlesCollected += 1
        this.md2 += global.poiGrowthRate 
        
        if( this.md2 > this.sim.poiMaxArea ){ 
            this.md2 = this.sim.poiMaxArea
            
            let a = v(x,y).sub(this.pos).getAngle()
            
            // stick particle to edge
            this.eps.spawnParticle(a,0)
                
        }
        
    }
    
    update(dt){
        super.update(dt)
        
        if( this.isHeld ){
            
            // build pressure
            if( !this.pressurePattern ) this.pressurePattern = randomPressurePattern()
            this.pressure = Math.min(1, this.pressure+dt*global.poiPressureBuildRate)
            
        } else if(this.pressure > 0) {           
            
            // release pressure
            if( !this.isReleasing ){
                
                // just started releasing, generate new pattern
                this.isReleasing = true
                let n = Math.round( this.pressure * this.md2 * global.poiParticlesReleased )
                global.activeReleasePatterns.push(randomReleasePattern(n,...this.pos.xy(),this.r))
            }
            
            // ongoing gradual release animation
            this.pressure = Math.max(0,this.pressure - dt*global.poiPressureReleaseRate)
            
            if( this.pressure == 0 ){
                
                // finished release animation
                this.pressurePattern = null
                this.isReleasing = false
            }

        }
        
        // shrink gradually
        if( !this.isHeld ) this.md2 -= dt*this.sim.poiShrinkRate
        this.rad = Math.sqrt(this.md2)
        return ( this.md2 > 0 )
    }
    
    drawBuildCursor(g){
        
        let p = global.mousePos.xy()
        
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,this.r,0,twopi)
        g.fill()
    }
    
    draw(g){
        let p
        if( (this.pressure > 0) && this.pressurePattern ){
            // indicate pressure
            let off = v(0,0)//this.pressurePattern.getOffset(global.t,this.r,this.pressure)
            p = this.pos.add(off)
        } else {
            p = this.pos
        }
        
        // draw circle
        let r = this.rad
        let c = p.xy()
        g.beginPath()
        g.moveTo(...c)
        g.arc(...c,r,0,twopi)
        g.fill()
        
        
        if( false ){
            
            // debug pressure level
            g.fillStyle = global.backgroundColor
            drawText(g,...p,this.pressure.toFixed(2).toString())
            g.fillStyle = global.lineColor
        }
        
    }
}