class LineBody extends CompoundBody {
    
    // sim is a ParticleSim instance
    constructor(sim,a,b,rad=2e-2){
        super(sim)
        
        this.rad = rad
        let ca = new CircleBody(sim,a,rad)
        let cb = new CircleBody(sim,b,rad)
        this.constraints = [new Spring(ca,cb)]
        
        this.endCaps = [ca,cb]
        this.endCaps.forEach(c => {
            c.dripMinAv = 5e-4
            c.slowDripChanceMult = .1
            c.dripChance *= 10 
        })
        
        // init control points for user to click and drag
        this.movCp = new ControlPoint(sim,this)
        this.rotCp0 = new RotationControlPoint(sim,ca,cb)
        this.rotCp1 = new RotationControlPoint(sim,cb,ca)
        this.controlPoints = [this.movCp,this.rotCp0,this.rotCp1]
        this.controlPoints.forEach(cp => cp.fscale = .6)
        
        
        this.children = [...this.endCaps,...this.controlPoints]
    }
    
    getPos(){ return va(...this.endCaps.map(c=>c.getPos())) }
    
    // translate this whole body without rotating it
    accel(acc){
        this.endCaps.forEach(b => b.accel(acc))
    }
    
    // grabbed particle in straight midsection
    grabbed(x,y,edgeSpeed=0) {
        
        // locate edge point
        let a = this.children[0].pos
        let b = this.children[1].pos
        let dx = x-a.x
        let dy = y-a.y
        let d = b.sub(a)
        let r = (dx*d.x + dy*d.y) / d.getD2() // position along edge (float)
        let cw = clockwise(a,b,v(x,y)) // which side (boolean)
        let eps = cw ? this.eps[1] : this.eps[0]
        
        // stick particle to edge
        if(cw) edgeSpeed *= -1
        eps.spawnParticle(r,edgeSpeed)
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
                new LineEdge(...coords[0],true)),
            sim.edgeGroup.newSubgroup(
                new LineEdge(...coords[1],false))
        ]
        
        // perpare to compute accel along edge
        // based on terminals (line_epsg.js)
        this.eps.forEach( eps => 
            eps.tipAccelsCallback = () => this.getTipAccels()
        )
        this.grabber.eps = this.eps
    }
    
    // get acceleration at terminals
    getTipAccels(){
        return [this.children[0].eps.getAccel(0), this.children[1].eps.getAccel(0)]
    }
    
    
    computeStraightEdges(){
        
        let a = this.children[0].pos
        let b = this.children[1].pos
        let ang = b.sub(a).getAngle()
        let d = vp(ang+pio2,this.rad)
        
        return [
            [a.add(d),b.add(d)],
            [a.sub(d),b.sub(d)],
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
        
        g.strokeStyle = global.lineColor
        g.lineWidth = 2*this.rad
        g.beginPath()
        g.moveTo(...this.children[0].pos.xy())
        g.lineTo(...this.children[1].pos.xy())
        g.stroke()
        g.lineWidth = global.lineWidth
        
        if( global.showEdgeNormals ) this.eps.forEach(eps => eps.edge.drawNormals(g))
        if( global.showEdgeAccel ) this.eps.forEach(eps => eps.edge.drawAccel(g,eps))
    }
    
    update(dt){
        
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
        
        // apply centr force to particles on midsection
        let angle = b.sub(a).getAngle() + pio2
        if( this.prevAngle ){
            let spn = Math.abs(cleanAngle(angle-this.prevAngle))/dt
            this.eps.forEach(eps=>eps.spin(spn))
        }
        this.prevAngle = angle
        
        // let particles slide from circular 
        // end caps to stright edges
        let first = true
        this.endCaps.forEach( c => {
            
            let eps = c.eps
            for( let i = 0 ; i < eps.n ; i++ ){
                if( eps.isGrabbed(i) ) continue
                let [a,va] = eps.get(i)
                let pos = eps.edge.getPos(a)
                if( this.grabber.contains(pos.x,pos.y) ){
                    eps.grab(i)
                    let speed = -va*this.rad
                    this.grabbed(pos.x,pos.y,speed)
                }
            }
            first = false            
        } )
        
        // let particles slide off 
        // the end of straight edges
        // or wrap around end cap
        first = true
        this.eps.forEach(eps => {
            for( let i = 0 ; i < eps.n ; i++ ){
                if( eps.isGrabbed(i) ) continue
                let [r,dr] = eps.get(i)
                if( (r<0) || (r>1) ){
                    if( false ){
                        
                        // slide off edge
                        // edge -> physics
                        let pa = eps.edge.getPos(r)
                        let pb = eps.edge.getPos(r+dr)
                        let vel = pb.sub(pa)
                        vel = vel.mul(.5+.5*Math.random())
                        eps.grab(i)
                        this.pps.spawnParticle(pa,vel)
                        
                    } else {
                        
                        // wrap around circular end cap
                        // edge -> edge
                        let cbody = this.children[((r>1)) ? 1 : 0]
                        let pa = eps.edge.getPos(r)
                        let pb = eps.edge.getPos(r+dr)
                        let vel = pb.sub(pa)
                        let va = vel.getMagnitude() / cbody.rad
                        if( first == (r>1) ) va *= -1
                        eps.grab(i)
                        cbody.eps.spawnParticle(angle + ((first) ? 0 : pi),va)
                        
                    }
                }
            }
            first = false
        })
        
        //randomly emit particles from straight edges
        angle = b.sub(a).getAngle()
        this.eps.forEach(eps => {
            for( let i = 0 ; i < eps.n ; i++ ){
                if( eps.isGrabbed(i) ) continue
                let [r,dr] = eps.get(i)
                
                let acc = eps.getAccel(r)
                let accMag = acc.getMagnitude()
                let accAngle = acc.getAngle()
                let normAcc = accMag*Math.sin(angle-accAngle) // surface accel
                let dc = 1e1 * global.poiDripChance * (normAcc)
                if( (Math.random() < dc) ){
        
                    // emit
                    eps.grab(i)
                    let pos = eps.edge.getPos(r)
                    let npos = eps.edge.getPos(r+dr)
                    let vel = npos.sub(pos)
                    vel = vel.add(va(this.children[0].vel,this.children[1].vel,r))
                    this.pps.spawnParticle(pos,vel)
                    
                } else if(Math.random() < dt*1e-3) {
                
                    // halt
                    eps.set(i,r,0)
                    
                }
            }
        })
        
        
        // update children (caps)
        super.update(dt)
        
        return true
    }
}