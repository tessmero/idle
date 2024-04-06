// physics-enabled object that interacts with particles
class Body {
    
    // sim is a ParticleSim instance
    constructor(sim,pos,angle=0){
        this.sim = sim
        this.controlPoints = []
        
        this.pos = pos
        this.vel = v(0,0)
        this.angle = angle
    }
    
    // called in register()
    buildEdge(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // called in register()
    buildGrabber(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    draw(g){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // callback for this.grabber
    // when a particle is grabbed (particle_group.js)
    grabbed(x,y,dx,dy,hit){   
        
        // place particle on edge
        this.eps.spawnParticle(hit,0)
        
    }
    
    // called in particle_sim.js addBody()
    register(sim){
            
        
        // prepare particle grabber instance
        this.grabber = this.buildGrabber()//new LineGrabber(a,b,rad,(x,y) => this.grabbed(x,y))
        sim.grabbers.add(this.grabber)
        
        // prepare to emit particles
        // PPS = physics particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        this.pps = sim.physicsGroup.newSubgroup()
            
        // prepare for particles sliding along edge
        // EPS = edge particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        let edge = this.buildEdge()//new SausageEdge(len,this.rad)
        edge.computeEdgeShape()
        edge.pos = this.pos
        this.edge = edge
        this.eps = sim.edgeGroup.newSubgroup(edge)
    }
    
    // called in particle_sim.js removeBody()
    unregister(sim){
        this.sim.grabbers.delete(this.grabber)
        this.sim.physicsGroup.deleteSubgroup(this.pps)
        this.sim.edgeGroup.deleteSubgroup(this.eps)
    }
    
    accel(acc){
        this.vel = this.vel.add(acc)
    }
    
    update(dt){
        
        // randomly emit attached particles
        let acc = this.eps.getAccel(0)
        let accAngle = acc.getAngle()
        let accMag = acc.getMagnitude()
        let r = this.rad
        for( let i = 0 ; i < this.eps.n ; i++ ){
            if( this.eps.isGrabbed(i) ) continue
            let [a,av] = this.eps.get(i)
            //let normAcc = Math.abs(accMag*Math.cos(a-accAngle)) // surface accel
            //let centrifugalAcc = Math.abs(av*r) // particle sliding momentum
            //let dc = global.poiDripChance * (normAcc + centrifugalAcc)
            if( (Math.random() < .01) ){
                this.eps.grab(i)
                let [pang,prad,norm] = this.edge.getPoint(a)
                let pos = this.pos.add(vp(this.angle+pang,prad))
                let vel = this.vel.mul(.5).add(vp(a+pio2,av*r))
                this.pps.spawnParticle(pos,vel)
            }
        }
        
        // advance physics for poi
        this.vel = this.vel.mul(1.0-dt*global.bodyFriction)
        this.pos = this.pos.add(this.vel.mul(dt))
        
        // push on-screen
        var sc = global.screenCorners
        if( this.pos.x < sc[0].x ) this.pos.x = sc[0].x
        if( this.pos.x > sc[2].x ) this.pos.x = sc[2].x
        if( this.pos.y < sc[0].y ) this.pos.y = sc[0].y
        if( this.pos.y > sc[2].y ) this.pos.y = sc[2].y
        
        // update grabber and edge particles
        this.grabber.p = this.pos
        this.grabber.r2 = this.md2
        this.eps.pos = this.pos
        this.eps.angle = this.angle
        
        return true
    }
    
    // debug
    
    drawDebug(g){
        if( global.showEdgeNormals ) this.drawNormals(g,this.pos,this.angle)
        if( global.showEdgeAccel ) this.drawAccel(g,this.pos,this.angle)
    }

    drawNormals(g){
        this._drawDebugVectors(g, a => {
            let len = 1e-2
            let [ang,r,norm] = this.edge.getPoint(a)
            norm += this.angle
            let p = this.pos.add(vp(this.angle+ang,r))
            return[ p, p.add(vp(norm,len)) ]
        })
    }
    
    
    drawAccel(g){
        this._drawDebugVectors(g, a => {
            let [ang,r,norm] = this.edge.getPoint(a)
            let p = this.pos.add(vp(this.angle+ang,r))
            let acc = this.eps.getAccel(a)
            return[ p, p.add(acc.mul(5e2)) ]
        })
    }
    
    _drawDebugVectors(g,f){
        if( !this.edge ) return
        
        let circ = this.edge.circ
        let t = [0,circ]
        
        let density = 100 // ~lines per screen length
        let n = circ*density
        g.strokeStyle = 'yellow'
        g.beginPath()
        for( let i = 0 ; i < n ; i++ ){
            let a = avg(t[0],t[1],i/n)
            let [start,stop] = f(a)
            g.moveTo(...start.xy())
            g.lineTo(...stop.xy())
        }
        g.stroke()
        g.strokeStyle = global.lineColor
    }
}