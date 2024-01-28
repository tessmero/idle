class Poi {
    constructor(p,dropCount){
        this.pos = p
        this.vel = v(0,0)
        this.md2 = global.poiStartArea + global.poiGrowthRate*dropCount
        if( this.md2 > global.poiMaxArea ) this.md2 = global.poiMaxArea
        
        
        this.pressure = 0 //0-1 increases when held by player
    }
    
    update(dt){
        
        this.vel = this.vel.mul(1.0-dt*global.poiFriction)
        this.pos = this.pos.add(this.vel.mul(dt))
        
        if( this.isHeld ){
            
            // build pressure
            this.pressure = Math.min(1, this.pressure+dt*global.poiPressureBuildRate)
            
        } else if(this.pressure > 0) {
            
            // release pressure
            let p0 = this.pressure
            let p1 = Math.max(0,this.pressure - dt*global.poiPressureReleaseRate)
            let dp = p0-p1
            this.pressure = p1
            let n = Math.floor( dp * this.md2 * global.poiParticlesReleased )
            for( let i = 0 ; i < n ; i++ )
                global.grabbedParticles.add(global.nParticles+i)
            global.nParticles += n
        }
        
        // shrink gradually
        if( !this.isHeld ) this.md2 -= dt*global.poiShrinkRate
        return ( this.md2 > 0 )
    }
    
    drawBuildCursor(g){
        
        let p = global.mousePos.xy()
        
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,Math.sqrt(this.md2),0,twopi)
        g.fill()
    }
    
    draw(g){
        let p = this.pos.xy()
        let r = Math.sqrt(this.md2)
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,r,0,twopi)
        g.fill()
        
        g.fillStyle = global.backgroundColor
        drawText(g,...p,this.pressure.toFixed(2).toString())
        g.fillStyle = global.lineColor
        
        // indicate pressure
        if( this.pressure > 0 ){
            g.beginPath()
            let rr = r*.1
            let n = 50
            let da = twopi/n
            let prs = this.pressure
            let amp = r*.2*prs
            let off = randRange(0,twopi)
            let period = randRange(100,300)
            for( let i = 0 ; i < n ; i++ ){
                p = this.pos.add(vp(da*i,r+amp*Math.cos(global.t/period/twopi * Math.floor(rand()*10)))).xy()
                g.moveTo(...p)
                g.arc(...p,rr,0,twopi)
            }
            g.fill()
        }
        
    }
}