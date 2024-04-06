class SausageBody extends Body {
    
    // sim is a ParticleSim instance
    constructor(sim,a,b,rad=2e-2){
        super(sim,va(a,b))
        
        this.a = a
        this.b = b
        this.rad = rad
        this.angle = b.sub(a).getAngle()
        
        this.dripChance = global.poiDripChance
    }
    
    buildEdge(){
        let len = this.a.sub(this.b).getMagnitude()
        let edge = new SausageEdge(len,this.rad)
        return edge
    }
    
    buildGrabber(){
        return new SausageGrabber(this.a,this.b,this.rad,
            (...p) => this.grabbed(...p))
    }
    
    draw(g){
        let a = this.a.xy()
        let b = this.b.xy()
        
        // draw sraight segmetn
        g.strokeStyle = global.lineColor
        g.lineCap = 'round'
        g.lineWidth = 2*this.rad
        g.beginPath()
        g.moveTo(...a)
        g.lineTo(...b)
        g.stroke()
        g.lineWidth = global.lineWidth
    }
}