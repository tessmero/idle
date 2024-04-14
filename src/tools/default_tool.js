// default tool, collect raindrops, pressure/move pois

class DefaultTool extends Tool{
    
    constructor(sim,rad){
        super(sim)
        this.rad = rad
        
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
            rad,(x,y) => this.grabbed(x,y))
    }
   
   getTutorial(){ 
    return new DefaultToolTutorial(); 
    }
    
    // callback for this.grabber
    // when a particle is grabbed (particle_group.js)
    grabbed(x,y){
        DefaultTool._grabbed(this.sim,x,y)
    }
    
    static _grabbed(sim,x,y){
        
        // increase currency
        sim.particlesCollected += 1
        
        // show message
        let p = v(x,y)//.add(v(...sim.drawOffset))
        Floater.signalChange(sim,p,+1)
    }
   
    mouseMove(p){
        this.sim.updateControlPointHovering(p)
        this.lastPos = this.grabber.pos
        this.grabber.pos = p
    }
   
    mouseDown(p){ 
        // either grab control point or start catching rain
        this.sim.updateControlPointHovering(p)
        this.held = this.sim.hoveredControlPoint
        this.sim.draggingControlPoint = this.held
        
        // trigger callback
        // used in main_psim.js to open context menu
        if( this.held ){
            this.sim.bodyClicked(this.held)
        }
        
        if(!this.held){
            this.held = 'catching'
            this.sim.selectedBody = null // close context menu
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
            
            g.strokeStyle = global.bgColor
            g.lineWidth = .005
            g.beginPath()
            g.moveTo(c.x+r,c.y)
            g.arc(c.x,c.y,r,0,twopi)
            g.stroke()
            
            g.strokeStyle = global.fgColor
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
        
        let r = this.rad
        this.grabber.rad = r
        this.grabber.r2 = r
        
        if( this.held instanceof ControlPoint ){
        
            if(!this.lastPos) return
        
            let fr = [1e-4,1e-3] // no force d2, full force d2
        
            //apply force to held control point
            let cp = this.held
            let d = this.lastPos.sub(cp.pos)
            let d2 = d.getD2()
            if( d2 < fr[0]){
                
                
            } else {
                
                let angle = d.getAngle()
                let f = global.poiPlayerF 
                if(d2<fr[1])
                    f *= (d2-fr[0])/(fr[1]-fr[0])
                let acc = vp( angle, f ).mul(dt)
                cp.accel(acc)
            }
        }
    }
    
}

    