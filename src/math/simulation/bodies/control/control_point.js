// circle for the user to click and drag
// to move or rotate another body
class ControlPoint extends Body {
    
    // anchoredTo is a body that this will be anchored to
    constructor(sim,anchoredTo){
        super(sim)
        this.anchoredTo = anchoredTo
        this.pos = anchoredTo.pos
        this.setRad(this.sim.controlPointRadius)
        this.visible = true
        this.fscale = 1
    }
    
    setRad(r){
        this.rad = r
        this.r2 = Math.pow(this.rad,2)
    }
    
    draw(g,color=null,forceDraw=false){
        if( !forceDraw ){
            if( !this.visible ) return  
            if( this.sim.draggingControlPoint ) return
            if( global.idleCountdown<=0 ) return
        }
        this.constructor._draw(g,this.pos,this.rad,color,forceDraw)
    }
    
    static _draw(g,pos,rad,color=null,forceDraw=false){
        if( !color ) color=global.colorScheme.fg
        
        let c = pos.xy()
        
        let start = 0
        let stop = twopi
        
        
        // only draw in certain range of mouse
        if( !forceDraw ){
            
            // skip hover effect for gui simulations
            if( this.sim != global.mainSim ) return 
            
            let ia = intersectionAngles( //util.js
                ...pos.xy(),rad,
                ...global.mousePos.xy(),
                global.controlPointVisibleHoverRadius)
            if( ia == 'out' ) return
            if( (ia!='in') && ia[0] ){
                stop = ia[0]
                start = ia[1]
            }
        }
        
        g.strokeStyle = color
        g.lineWidth = global.controlPointLineWidth
        g.beginPath()
        g.moveTo(...pos.add(vp(start,rad)).xy())
        g.arc(...c,rad,start,stop)
        g.stroke()
            
        
    }
    
    // pass user input "force" to physics-enabled parent body
    accel(acc){
        this.anchoredTo.accel(acc.mul(this.fscale))
    }
    
    // remain stuck to parent
    update(dt){
        this.pos = this.anchoredTo.pos
    }
    
    // no direct interaction with particles
    register(sim){}
    unregister(sim){}
    
}