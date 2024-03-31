// physics-enabled circle
class CircleBody extends Body{
    constructor(sim,pos,rad){
        super(sim) 
        
        this.pos = pos
        this.vel = v(0,0)
        this.rad = rad
        this.md2 = rad*rad
        
        this.dripChance = global.poiDripChance
    }
    
    getPos(){ return this.pos }
    
    // called in particle_sim.js addBody()
    // this.sim has been set
    // sim param passed for convenience
    register(sim){
        
        // prepare particle grabber instance
        this.grabber = new CircleGrabber(this.pos,
            this.md2,(x,y) => this.grabbed(x,y))
        sim.grabbers.add(this.grabber)
            
        // prepare to emit particles
        // PPS = physics particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        this.pps = sim.physicsGroup.newSubgroup()
            
        // prepare for particles sliding along edge
        // EPS = edge particle subgroup instance
        // src/math/particle/group/physics_pgroup.js
        this.eps = sim.edgeGroup.newSubgroup(
            new CircleEdge(v(0,0),global.mouseGrabMd2))
        this.grabber.eps = this.eps 
        
    }
    
    
    // called in particle_sim.js removeBody()
    // this.sim has been set
    // sim param passed for convenience
    unregister(){
        this.sim.grabbers.delete(this.grabber)
        this.sim.physicsGroup.deleteSubgroup(this.pps)
        this.sim.edgeGroup.deleteSubgroup(this.eps)
    }
    
    // callback for this.grabber
    // when a particle is grabbed (particle_group.js)
    grabbed(x,y){        
            
        let a = v(x,y).sub(this.pos).getAngle()
        
        // stick particle to edge
        this.eps.spawnParticle(a,0)
        
    }
    
    // accelerate poi and attached particles
    accel(acc){
        this.vel = this.vel.add(acc)
        this.eps.accel(acc)
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
            let normAcc = Math.abs(accMag*Math.cos(a-accAngle)) // surface accel
            let centrifugalAcc = Math.abs(av*r) // particle sliding momentum
            let dc = global.poiDripChance * (normAcc + centrifugalAcc)
            if( (Math.random() < dc) ){
                this.eps.grab(i)
                let pos = this.pos.add(vp(a,r))
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
        
        // update particle grabber instance
        this.grabber.p = this.pos
        this.grabber.r2 = this.md2
        this.eps.edge.pos = this.pos
        this.eps.edge.rad = this.rad
        
        return true
    }
    
    draw(g){
        let p
        if( (this.pressure > 0) && this.pressurePattern ){
            // indicate pressure
            let off = v(0,0)//this.pressurePattern.getOffset(global.t,this.r,this.pressure)
            p = this.pos.add(off)
        } else {
            p = this.pos
        }
        
        // draw circle
        let r = this.rad
        let c = p.xy()
        g.beginPath()
        g.moveTo(...c)
        g.arc(...c,r,0,twopi)
        g.fill()
        
        if( global.showEdgeNormals ) this.eps.edge.drawNormals(g)
        if( global.showEdgeAccel ) this.eps.edge.drawAccel(g,this.eps)
        
        
        if( false ){
            
            // debug pressure level
            g.fillStyle = global.backgroundColor
            drawText(g,...p,this.pressure.toFixed(2).toString())
            g.fillStyle = global.lineColor
        }
        
    }
}