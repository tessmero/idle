// physics-enabled circle
class CircleBody extends Body{
    constructor(sim,pos,rad){
        super(sim,pos) 
        
        this.rad = rad
        this.md2 = rad*rad
        
        this.dripChance = global.poiDripChance
    }
    
    buildEdge(){
        return new CircleEdge(this.rad)
    }
    
    buildGrabber(){
        return new CircleGrabber(
            this.pos,this.rad,
            (...p) => this.grabbed(...p),0)
    }
    
    draw(g){
        let p = this.pos
        
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