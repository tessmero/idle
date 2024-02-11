// default tool, collect raindrops, pressure/move pois

class DefaultTool extends Tool{
    
    constructor(){
        super()
        
        this.icon = defaultToolIcon
            
        this.tooltip = 'default tool'
            
        //null or falsey -> mouse not being pressed
        //Poi instance -> mouse pressed on poi
        //otherwise -> mouse pressed on background
        this.held = null 
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
   
    mouseMove(p){
        
    }
   
    mouseDown(p){ 
        // either grab the poi or start catching rain
        this.held = global.allPois.find( poi => 
            poi.pos.sub(p).getD2() < poi.md2 ) 
        if(!this.held){
            this.held = 'catching'
        } else {
            this.held.isHeld = true
        }
    }
    mouseUp(p){ this.held = null }
    
    update(dt){
        if( this.held instanceof Poi ){
            
            //held on poi
            
            // build pressure
            let poi = this.held
            poi.pressure = Math.min(1, poi.pressure+dt*global.poiPressureBuildRate)
            
            //apply force
            let d = global.mousePos.sub(poi.pos)
            let d2 = d.getD2()
            if( d2 < 1e-4 ) return
            let angle = d.getAngle()
            
            let accel = vp( angle, global.poiPlayerF/poi.md2 )
            poi.vel = poi.vel.add(accel.mul(dt))
            
        } else if( this.held ){
            
            // held on background
            // grab particles from ongoing rain
            if( global.particlesInGrabRange ){ //draw.js
                global.particlesInGrabRange.forEach( i => {
                    if( !global.grabbedParticles.has(i) ){
                        global.grabbedParticles.add(i)
                        global.particlesCollected += 1
                    }
                })
            }
            
            // grab particles from release patterns
            if( global.activeReleasePatterns ){
                let totalGrabbed = 0
                global.activeReleasePatterns.forEach(rp => {
                    rp.inGrabRange.forEach(i => {
                        rp.offScreen[i] = true
                        global.particlesCollected += 1
                        totalGrabbed += 1
                    })
                    rp.inGrabRange.length = 0
                })
                
                // add to ongoing rain
                for( let i = 0 ; i < totalGrabbed ; i++ )
                    global.grabbedParticles.add(global.nParticles+i)
                global.nParticles += totalGrabbed
            }
        }
    }
    
}

    