// default tool, collect raindrops, pressure/move pois

class DefaultTool extends Tool{
    
    constructor(){
        super()
        
        this.iconLayout = [
            '#### ',
            '###  ',
            '#### ',
            '# ###',
            '   ##']
            
        //null or falsey -> mouse not being pressed
        //Poi instance -> mouse pressed on poi
        //otherwise -> mouse pressed on background
        this.held = null 
    }
    
    drawToolbarIcon(g,rect){ 
        drawLayout(g,...rectCenter(...rect),this.iconLayout)
    }
   
    drawCursor(g,p,pad){ 
        if( this.held instanceof Poi ){
            
            //held on poi
            drawLayout(g,...p,this.iconLayout,false,pad) 
            
            
        } else if( this.held ){
            
            // held on background
            // catching rain
            let c = global.mousePos
            g.beginPath()
            g.moveTo(c.x+global.mouseGrabRadius,c.y)
            g.arc(c.x,c.y,global.mouseGrabRadius,0,twopi)
            g.stroke()
            
        } else {
            drawLayout(g,...p,this.iconLayout,false,pad) 
        }
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
            // grab procedural particles
            if( (this.held) && global.particlesInGrabRange ){ //draw.js
                let grabbedCount = 0
                global.particlesInGrabRange.forEach( i => {
                    if( !global.grabbedParticles.has(i) ){
                        global.grabbedParticles.add(i)
                        grabbedCount += 1
                        global.particlesCollected += 1
                    }
                })
            }
        }
    }
    
}

    