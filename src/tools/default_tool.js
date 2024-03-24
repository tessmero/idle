// default tool, collect raindrops, pressure/move pois

class DefaultTool extends Tool{
    
    constructor(){
        super()
        
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
            global.mouseGrabMd2,this.grabbed)
    }
    
    // callback for this.grabber
    // when a particle is grabbed (particle_group.js)
    grabbed(x,y){
        global.mainSim.particlesCollected += 1
    }
   
    mouseMove(p){
        this.grabber.p = p
    }
   
    mouseDown(p){ 
        // either grab control point or start catching rain
        this.held = global.mainSim.hoveredControlPoint
        global.draggingControlPoint = this.held
        
        if(!this.held){
            this.held = 'catching'
        } else {
            this.held.isHeld = true
        }
        
        // toggle grabbing particles
        if( this.held == 'catching' ){
            global.mainSim.grabbers.add(this.grabber)
        } else {
            global.mainSim.grabbers.delete(this.grabber)
        }
    }
    mouseUp(p){ 
        this.held = null 
        
        global.draggingControlPoint = null
        
        // global.draggingControlPoint also set in input.js
        // to handle edge cases, e.g. gui state changed somehow mid-drag
        
        //stop grabbing particles
        global.mainSim.grabbers.delete(this.grabber)
    }
   
    drawCursor(g,p,pad){ 
            
        if( this.held instanceof ControlPoint ){
            
            // held on control point
            global.mainSim.hoveredControlPoint = this.held
            super.drawCursor(g,p,pad)
            
            
        } else if( this.held ){
            
            // held on background
            let c = global.mousePos
            let r = global.mouseGrabRadius
            
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
            super.drawCursor(g,p,pad)
            
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

    