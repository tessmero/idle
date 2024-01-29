class Poi {
    constructor(p){
        this.pos = p
        this.vel = v(0,0)
        this.md2 = global.poiStartArea
        if( this.md2 > global.poiMaxArea ) this.md2 = global.poiMaxArea
        
        
        this.pressure = 0 //0-1 increases when held by player
        this.pressurePattern = null//instance of PressurePattern
    }
    
    update(dt){
        this.r = Math.sqrt(this.md2) // only allowed sqrt
        
        // push on-screen
        var sc = global.screenCorners
        if( this.pos.x < sc[0].x ) this.pos.x = sc[0].x
        if( this.pos.x > sc[2].x ) this.pos.x = sc[2].x
        if( this.pos.y < sc[0].y ) this.pos.y = sc[0].y
        if( this.pos.y > sc[2].y ) this.pos.y = sc[2].y
        
        this.vel = this.vel.mul(1.0-dt*global.poiFriction)
        this.pos = this.pos.add(this.vel.mul(dt))
        
        if( this.isHeld ){
            
            // build pressure
            if( !this.pressurePattern ) this.pressurePattern = randomPressurePattern()
            this.pressure = Math.min(1, this.pressure+dt*global.poiPressureBuildRate)
            
        } else if(this.pressure > 0) {
            
            // release pressure
            let p0 = this.pressure
            let p1 = Math.max(0,this.pressure - dt*global.poiPressureReleaseRate)
            let dp = p0-p1
            this.pressure = p1
            if( this.pressure == 0 ) this.pressurePattern = null
            let n = Math.floor( dp * this.md2 * global.poiParticlesReleased )
            if( n > 0 ){
                for( let i = 0 ; i < n ; i++ )
                    global.grabbedParticles.add(global.nParticles+i)
                global.nParticles += n
                global.activeReleasePatterns.push(randomReleasePattern(n,...this.pos.xy(),this.r))
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
            let off = this.pressurePattern.getOffset(
                                global.t,this.r,this.pressure)
            p = this.pos.add(off)
        } else {
            p = this.pos
        }
        p = p.xy()
        
        let r = this.r
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,r,0,twopi)
        g.fill()
        
        
        if( false ){
            
            // debug pressure level
            g.fillStyle = global.backgroundColor
            drawText(g,...p,this.pressure.toFixed(2).toString())
            g.fillStyle = global.lineColor
        }
        
    }
}