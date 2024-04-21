// particle inspector tool for sandbox mode
class PiTool extends DefaultTool{
    
    constructor(sim,rad){
        super(sim,rad)
        this.icon = piToolIcon
        this.tooltip = 'inspect'
    }
    
    
   unregister(sim){
       sim.selectedParticle = null
       this.pData = null
       sim.removeGrabber(this.grabber)
       sim.removeGrabber(this.topg)
       sim.removeGrabber(this.itopg)
   }
   
    // override DefaultTool
   getTutorial(){ 
        return new PiToolTutorial(); 
    }
    
    // initial grab (inherited DefaultTool behavior)
    grabbed(...p){
        let [subgroup,i,x,y,dx,dy,hit] = p
        let sim = this.sim
        
        // make sure initial circle grabber
        // is canceled
        sim.removeGrabber(this.grabber) 
        
        // request to grab this particle
        sim.removeGrabber(this.topg)//avoid leak
        this.topg = new TrackOneParticleGrabber(subgroup,i,
                            (...p)=>this.grabbedTarget(...p))
        sim.addGrabber(this.topg) 
        
        // indicate that this is passive 
        // (don't actually flag the particle as grabbed)
        return true
    }
    
    
    
    // continous polling of target particle
    grabbedTarget(...p){
        let [subgroup,i,x,y,dx,dy,hit] = p
        let sim = this.sim
        
        // show particle reticle context menu
        this.pData = p
        this.sim.particleClicked(p)
        
        // make sure initial circle grabber
        // is canceled
        sim.removeGrabber(this.grabber) 
        
        // request to grab this particle
        // again next update
        sim.removeGrabber(this.topg)//avoid leak
        this.topg = new TrackOneParticleGrabber(subgroup,i,
                            (...p)=>this.grabbedTarget(...p))
        sim.addGrabber(this.topg) 
        
        // request to grab all other particles
        sim.removeGrabber(this.itopg)//avoid leak
        this.itopg = new InverseGrabber(this.topg,
                            (...p)=>this.grabbedOther(...p))
        //grb.add(this.itopg) 
        
        // indicate that this is passive 
        // (don't actually flag the particle as grabbed)
        return true
    }
    
    // grab non-target for removal
    grabbedOther(...p){
        
        // return falsey
        // particle will disapear
        return false
    }
    
    // override DefaultTool
    mouseMove(p){
        this.grabber.pos = p
    }
   
    // override DefaultTool
    mouseDown(p){ 
        let sim = this.sim
                
        // start grabbing particles
        sim.removeGrabber(this.topg)
        sim.removeGrabber(this.itopg)
        sim.addGrabber(this.grabber)
    }
    
    // override DefaultTool
    mouseUp(p){ 
    
        //stop grabbing particles
        this.sim.removeGrabber(this.grabber)
    }
    
    // override DefaultTool
    update(dt){
        
        // start grabbing particles
        //this.sim.addGrabber(this.topg)
        // do nothing
    }
    
    drawCursor(g,p, ...args){ 
            
        // draw circle
        let c = v(...p)
        let r = Math.sqrt(this.grabber.r2)
        
        g.strokeStyle = global.colorScheme.bg
        g.lineWidth = .005
        g.beginPath()
        g.moveTo(c.x+r,c.y)
        g.arc(c.x,c.y,r,0,twopi)
        g.stroke()
        
        g.strokeStyle = global.colorScheme.fg
        g.lineWidth = .0025
        g.beginPath()
        g.moveTo(c.x+r,c.y)
        g.arc(c.x,c.y,r,0,twopi)
        g.stroke()
        
        // draw standard tool cursor
        super.drawCursor(g,p, ...args)
            
    }
    
    // draw overlay
    draw(g){
        
    }

    draw(g){
        super.draw(g)
        
        if( this.pData ){
            let [subgroup,i,x,y,dx,dy,hit] = this.pData
            let r = this.rad/2
            
            g.strokeStyle = global.colorScheme.hl
            g.lineWidth = .01
            g.beginPath()
            g.moveTo(x+r,y)
            g.arc(x,y,r,0,twopi)
            g.stroke()
        }
    }
}

    