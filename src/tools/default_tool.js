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
        // either grab the poi or start catching rain
        this.held = global.mainSim.allPois.find( poi => 
            poi.pos.sub(p).getD2() < poi.md2 ) 
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
        
        //stop grabbing particles
        global.mainSim.grabbers.delete(this.grabber)
    }
   
    drawCursor(g,p,pad){ 
            
        if( this.held instanceof Poi ){
            
            //held on poi
            super.drawCursor(g,p,pad)
            
            
        } else if( this.held ){
            
            // held on background
            // catching rain
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
        }
    }
    
    update(dt){
        
        // check if holding poi
        if( this.held instanceof Poi ){
            
            
            // build pressure
            let poi = this.held
            poi.pressure = Math.min(1, poi.pressure+dt*global.poiPressureBuildRate)
            
            //apply force
            let d = global.mousePos.sub(poi.pos)
            let d2 = d.getD2()
            if( d2 < 1e-4 ) return
            let angle = d.getAngle()
            
            let acc = vp( angle, global.poiPlayerF/poi.md2 ).mul(dt)
            poi.accel(acc)
            
        }
    }
    
}

    