// default tool, collect raindrops, pressure/move pois

class DefaultTool extends Tool{
    
    constructor(sim,rad){
        super(sim)
        
        this.icon = defaultToolIcon
            
        this.tooltip = 'default tool'
        this.cursorCenter = false // tool.js
            
        //null or falsey -> mouse not being pressed
        //Poi instance -> mouse pressed on poi
        //otherwise -> mouse pressed on background
        this.held = null 
        
        // prepare grabber instance that will be 
        // added/removed from global.grabbers
        this.grabber = new CircleGrabber(v(0,0),
            Math.pow(rad,2),() => this.grabbed)
    }
   
   getTutorial(){ 
    return new DefaultToolTutorial(); 
    }
    
    // callback for this.grabber
    // when a particle is grabbed (particle_group.js)
    grabbed(x,y){
        this.sim.particlesCollected += 1
    }
   
    mouseMove(p){
        this.grabber.p = p
    }
   
    mouseDown(p){ 
        // either grab control point or start catching rain
        this.held = this.sim.hoveredControlPoint
        this.sim.draggingControlPoint = this.held
        
        if(!this.held){
            this.held = 'catching'
        } else {
            this.held.isHeld = true
        }
        
        // toggle grabbing particles
        if( this.held == 'catching' ){
            this.sim.grabbers.add(this.grabber)
        } else {
            this.sim.grabbers.delete(this.grabber)
        }
    }
    mouseUp(p){ 
        this.held = null 
        this.sim.draggingControlPoint = null
        
        //stop grabbing particles
        this.sim.grabbers.delete(this.grabber)
    }
   
    drawCursor(g,p, ...args){ 
            
        if( this.held instanceof ControlPoint ){
            
            // held on control point
            this.sim.hoveredControlPoint = this.held
            super.drawCursor(g,p, ...args)
            
            
        } else if( this.held ){
            
            // held on background
            let c = v(...p)
            let r = Math.sqrt(this.grabber.r2)
            
            g.strokeStyle = global.backgroundColor
            g.lineWidth = .005
            g.beginPath()
            g.moveTo(c.x+r,c.y)
            g.arc(c.x,c.y,r,0,twopi)
            g.stroke()
            
            g.strokeStyle = global.lineColor
            g.lineWidth = .0025
            g.beginPath()
            g.moveTo(c.x+r,c.y)
            g.arc(c.x,c.y,r,0,twopi)
            g.stroke()
            
        } else {
            
            // not held
            super.drawCursor(g,p, ...args)
            
            // debug control points hover vis radius
            //let r = global.controlPointVisibleHoverRadius
            //ControlPoint._draw(g,v(...p),r)
        }
    }
    
    update(dt){
        
        if( this.held instanceof ControlPoint ){
        
            let fr = [1e-4,1e-2] // no force d2, full force d2
        
            //apply force to held control point
            let cp = this.held
            let d = global.mousePos.sub(cp.pos)
            let d2 = d.getD2()
            if( d2 < fr[0]) return
            let angle = d.getAngle()
            let f = global.poiPlayerF 
            if(d2<fr[1])
                f *= (d2-fr[0])/(fr[1]-fr[0])
            let acc = vp( angle, f ).mul(dt)
            cp.accel(acc)
        }
    }
    
}

    