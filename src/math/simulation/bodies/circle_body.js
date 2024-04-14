// physics-enabled circle
class CircleBody extends Body{
    constructor(sim,pos,rad){
        super(sim,pos) 
        
        this.rad = rad
        this.md2 = rad*rad
        
        this.dripChance = global.poiDripChance
        
        //
        this.title = 'circle'
        this.icon = circleIcon
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
        g.fillStyle = global.fgColor
        g.beginPath()
        g.moveTo(...c)
        g.arc(...c,r,0,twopi)
        g.fill()
        
    }
    

}