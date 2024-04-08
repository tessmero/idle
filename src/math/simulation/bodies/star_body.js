// sinusoidal star/flower
class StarBody extends Body{
    constructor(sim,pos,n,minRad,maxRad){
        super(sim,pos) 
        
        this.n = n
        this.minRad = minRad
        this.maxRad = maxRad
        
        this.dripChance = global.poiDripChance
    }
    
    update(dt,...p){
        this.spin(1e-6*dt) 
        return super.update(dt,...p)
    }
    
    
    buildEdge(){
        return new StarEdge(this.n,this.minRad,this.maxRad)
    }
    
    buildGrabber(){
        return new EdgeGrabber(
            this.pos,this.angle,this.edge,
            (...p) => this.grabbed(...p),0)
    }
    
    draw(g){
        
        // draw star
        let c = this.pos
        g.fillStyle = global.lineColor
        g.beginPath()
        g.moveTo(...c.xy())
        for( let a = 0 ; a < twopi ; a += 1e-2 ){
            let [r,r2,dist] = this.edge.lookupAngle(a)
            let p = c.add(vp(a+this.angle,r))
            g.lineTo( ...p.xy() )
        }
        g.fill()
        
        
        
        if( false ){
            
            // debug pressure level
            g.fillStyle = global.backgroundColor
            drawText(g,...p,this.pressure.toFixed(2).toString())
            g.fillStyle = global.lineColor
        }
        
    }
    

}