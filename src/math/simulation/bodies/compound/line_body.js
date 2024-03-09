
class LineBody extends CompoundBody {
    
    // sim is a ParticleSim instance
    constructor(sim,a,b){
        super(sim)
        
        let rad = 2e-2
        this.rad = rad
        let ca = new CircleBody(sim,a,rad)
        let cb = new CircleBody(sim,b,rad)
        this.constraints = [new Spring(ca,cb)]
        this.children = [ca,cb]
    }
    
    // grabbed particle in straight midsection
    grabbed(x,y,speed=0) {
        
        // stick particle to nearest straight edge
        let a = this.children[0].pos
        let b = this.children[1].pos
        let dx = x-a.x
        let dy = y-a.y
        let d = b.sub(a)
        let r = (dx*d.x + dy*d.y) / d.getD2()
        
        let cw = clockwise(a,b,v(x,y))
        let eps = cw ? this.eps[1] : this.eps[0]
        if(cw) speed *= -1
        
        eps.spawnParticle(r,speed)
        
    }
    
    register(sim){
        
        // register children (round caps)
        super.register(sim)
        
        // start registering straight midsection
        
        // prepare particle grabber instance
        this.grabber = new LineGrabber(
            this.children[0].pos,
            this.children[1].pos, 
            this.rad,
            (x,y) => this.grabbed(x,y))
        sim.grabbers.add(this.grabber)
            
        // prepare to emit particles
        // PPS = physics particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        this.pps = sim.physicsGroup.newSubgroup()
            
        // prepare for particles sliding along edge
        // EPS = edge particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        let coords = this.computeStraightEdges()
        this.eps = [ 
            sim.edgeGroup.newSubgroup(
                new LineEdge(...coords[0])),
            sim.edgeGroup.newSubgroup(
                new LineEdge(...coords[1]))
        ]
        this.grabber.eps = this.eps
    }
    
    computeStraightEdges(){
        
        let a = this.children[0].pos
        let b = this.children[1].pos
        let ang = b.sub(a).getAngle()
        let d = vp(ang+pio2,this.rad)
        
        return [
            [this.children[0].pos.add(d),this.children[1].pos.add(d)],
            [this.children[0].pos.sub(d),this.children[1].pos.sub(d)],
        ]
    }
    
    unregister(sim){
        super.unregister(sim)
        sim.grabbers.delete(this.grabber)
        sim.physicsGroup.deleteSubgroup(this.pps)
        this.eps.forEach( eps => sim.edgeGroup.deleteSubgroup(eps) )
    }
    
    draw(g){
        
        // draw children (caps)
        super.draw(g)
        
        g.lineWidth = 2*this.rad
        g.beginPath()
        g.moveTo(...this.children[0].pos.xy())
        g.lineTo(...this.children[1].pos.xy())
        g.stroke()
    }
    
    update(dt){
        
        // update children (caps)
        super.update(dt)
        
        // update midsection particle grabber instance
        let a = this.children[0].pos
        let b = this.children[1].pos
        this.grabber.a = a
        this.grabber.b = b
        
        // update edge particle groups
        let coords = this.computeStraightEdges()
        this.eps[0].edge.a = coords[0][0]
        this.eps[0].edge.b = coords[0][1]
        this.eps[1].edge.a = coords[1][0]
        this.eps[1].edge.b = coords[1][1]
        
        // let particles slide from circular 
        // end caps to stright edges
        let angle = b.sub(a).getAngle() + pio2
        let first = true
        if( true ){
            this.children.forEach( c => {
                
                let eps = c.eps
                for( let i = 0 ; i < eps.n ; i++ ){
                    if( eps.isGrabbed(i) ) continue
                    let [a,va] = eps.get(i)
                    let pos = eps.edge.getPos(a)
                    if( this.grabber.contains(pos.x,pos.y) ){
                        eps.grab(i)
                        let speed = -va*Math.sqrt(c.md2)
                        this.grabbed(pos.x,pos.y,speed)
                    }
                }
                first = false            
            } )
        }
        
        // let particles slide off 
        // the end of straight edges
        // or wrap around end cap
        first = true
        this.eps.forEach(eps => {
            for( let i = 0 ; i < eps.n ; i++ ){
                if( eps.isGrabbed(i) ) continue
                let [r,dr] = eps.get(i)
                if( (r<0) || (r>1) ){
                    if( Math.random() > .9 ){
                        
                        // slide off edge
                        // edge -> physics
                        let pa = eps.edge.getPos(r)
                        let pb = eps.edge.getPos(r+dr)
                        let vel = pb.sub(pa)
                        eps.grab(i)
                        this.pps.spawnParticle(pa,vel)
                        
                    } else {
                        
                        // wrap around circular end cap
                        // edge -> edge
                        let cbody = this.children[((r>1)) ? 1 : 0]
                        let pa = eps.edge.getPos(r)
                        let pb = eps.edge.getPos(r+dr)
                        let vel = pb.sub(pa)
                        let va = vel.getMagnitude() / Math.sqrt(cbody.md2)
                        if( first == (r>1) ) va *= -1
                        eps.grab(i)
                        cbody.eps.spawnParticle(angle + ((first) ? 0 : pi),va)
                        
                    }
                }
            }
            first = false
        })
        
        
        return true
    }
}