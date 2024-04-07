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
    buildEdge(pps){ 
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
        
        // prepare to pass particles from edge to physics
        this.eps.pps = this.pps
    }
    
    // called in particle_sim.js removeBody()
    unregister(sim){
        this.sim.grabbers.delete(this.grabber)
        this.sim.physicsGroup.deleteSubgroup(this.pps)
        this.sim.edgeGroup.deleteSubgroup(this.eps)
    }
    
    accel(acc){
        this.vel = this.vel.add(acc) // move this body
        this.eps.acc = this.eps.acc.add(acc)// pass momentum to particles on edge
    }
    
    update(dt){
        
        // advance physics for poi
        let frictionAcc = this.vel.mul(-dt*global.bodyFriction)
        this.accel( frictionAcc )
        this.pos = this.pos.add(this.vel.mul(dt))
        
        // push on-screen
        var sc = global.screenCorners
        if( this.pos.x < sc[0].x ) this.pos.x = sc[0].x
        if( this.pos.x > sc[2].x ) this.pos.x = sc[2].x
        if( this.pos.y < sc[0].y ) this.pos.y = sc[0].y
        if( this.pos.y > sc[2].y ) this.pos.y = sc[2].y
        
        // update grabber and edge particles
        this.grabber.pos = this.pos
        this.eps.pos = this.pos
        this.eps.vel = this.vel
        this.eps.accel = this.accel
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