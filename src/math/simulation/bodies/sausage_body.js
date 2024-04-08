class SausageBody extends Body {
    
    // sim is a ParticleSim instance
    constructor(sim,a,b,rad=2e-2){
        super(sim,va(a,b))
        
        this.a = a
        this.b = b
        this.rad = rad
        
        let d = b.sub(a)
        this.length = d.getMagnitude()
        this.angle = d.getAngle()
        
        this.dripChance = global.poiDripChance
    }
    
    buildEdge(){
        let len = this.a.sub(this.b).getMagnitude()
        let edge = new SausageEdge(len,this.rad)
        return edge
    }
    
    buildGrabber(){
        //let grabber = new SausageGrabber(this.a,this.b,this.rad,
        let grabber = new EdgeGrabber(
            this.pos,this.angle,this.edge,
            (...p) => this.grabbed(...p))
        //grabber.update()
        return grabber
    }
    
    update(dt, ...args){
        super.update(dt, ...args)
        
        let p = this.pos
        let a = this.angle
        let r = this.length/2
        
        this.a = p.sub(vp(a,r))
        this.b = p.add(vp(a,r))
        
        this.grabber.pos = p
        this.grabber.angle = a
        //this.grabber.a = this.a
        //this.grabber.b = this.b
        //this.grabber.update()
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