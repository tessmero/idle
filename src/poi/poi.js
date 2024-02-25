class Poi {
    constructor(p){
        this.pos = p
        this.vel = v(0,0)
        this.md2 = global.poiStartArea
        if( this.md2 > global.poiMaxArea ) this.md2 = global.poiMaxArea
        
        
        this.pressure = 0 //0-1 increases when held by player
        this.pressurePattern = null//instance of PressurePattern
        
        // prepare particle grabber instance
        this.grabber = new CircleGrabber(v(0,0),
            global.mouseGrabMd2,(x,y) => this.grabbed(x,y))
            
        // prepare to emit particles
        // PPS = physics particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        this.pps = global.physicsGroup.newSubgroup()
            
        // prepare for particles sliding along edge
        // EPS = edge particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        this.eps = global.edgeGroup.newSubgroup(
            new CircleEdge(v(0,0),global.mouseGrabMd2))
        this.grabber.eps = this.eps
    }
    
    cleanup(){
        global.grabbers.delete(this.grabber)
        global.physicsGroup.deleteSubgroup(this.pps)
        global.edgeGroup.deleteSubgroup(this.eps)
    }
    
    // callback for this.grabber
    // when a particle is grabbed (particle_group.js)
    grabbed(x,y){        
        global.particlesCollected += 1
        this.md2 += global.poiGrowthRate 
        
        if( this.md2 > global.poiMaxArea ){ 
            this.md2 = global.poiMaxArea
            
            let a = v(x,y).sub(this.pos).getAngle()
            
            // stick particle to edge
            this.eps.spawnParticle(a,0)
                
        }
        
    }
    
    // accelerate poi and attached particles
    accel(acc){
        this.vel = this.vel.add(acc)
        this.eps.accel(acc)
    }
    
    update(dt){
        
        // randomly emit attached particles
        let acc = this.eps.acc.add(v(0,-1e-6*dt))
        let ang = acc.getAngle()
        let mag = global.poiDripChance*dt*acc.getMagnitude()
        for( let i = 0 ; i < this.eps.n ; i++ ){
            if( this.eps.isGrabbed(i) ) continue
            let [a,av] = this.eps.get(i)
            let dc = mag*(1-Math.cos(a-ang)) // normal force
            if( (Math.random() < dc) ){
                this.eps.grab(i)
                let r = this.r
                let pos = this.pos.add(vp(a,r))
                let vel = this.vel.mul(.5).add(vp(a+pio2,av*r))
                this.pps.spawnParticle(pos,vel)
            }
        }
        
        // advance physics for poi
        this.vel = this.vel.mul(1.0-dt*global.poiFriction)
        this.pos = this.pos.add(this.vel.mul(dt))
        
        // push on-screen
        var sc = global.screenCorners
        if( this.pos.x < sc[0].x ) this.pos.x = sc[0].x
        if( this.pos.x > sc[2].x ) this.pos.x = sc[2].x
        if( this.pos.y < sc[0].y ) this.pos.y = sc[0].y
        if( this.pos.y > sc[2].y ) this.pos.y = sc[2].y
        
        // update particle grabber instance
        this.r = Math.sqrt(this.md2) 
        this.grabber.p = this.pos
        this.grabber.r2 = this.md2
        this.eps.edgeShape.pos = this.pos
        this.eps.edgeShape.rad = this.r
        
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
        if( !this.isHeld ) this.md2 -= dt*global.poiShrinkRate
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
        let r = this.r
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