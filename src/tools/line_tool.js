

class LineTool extends Tool{
    
    constructor(sim){
        super(sim)
        
        this.icon = lineToolIcon
            
        this.tooltip = 'build lines'
        this.cursorCenter = true // tool.js
        
        // prepare for drag or two clicks
        // to build line between two points
        this.mouseHeld = false
        this.startPoint = null
        this.lineRadius = 2e-2 // radius of caps (half of thickness)
        this.minD2 = 1e-2 // minimum length squared
    }
   
   getTutorial(){ 
    return new LineToolTutorial(); 
    }
    
    draw(g){
        if( !this.startPoint ) return
        
        if( true ){
            let c = this.startPoint
            g.lineWidth = 1e-2
            g.beginPath()
            g.moveTo(...c.xy())
            g.lineTo(...this.dragPoint.xy())
            g.stroke()
        }
        
    }
   
    mouseDown(p){
        this.mouseHeld = true
        
        if( !this.startPoint ){
            this.startPoint = p
            this.dragPoint = p
        } else {
            let d2 = this.startPoint.sub(p).getD2()
            if( d2 < this.minD2 ) return
            this._spawnLine(p)
        }
    }
    
    _spawnLine(p){
            let poi = new LineBody(this.sim,
                this.startPoint,p,
                this.lineRadius)
            this.sim.addBody(poi)
            this.startPoint = null
            if( this.sim == global.mainSim )
                global.selectedToolIndex = 0
    }
    
    mouseMove(p){
        this.dragPoint = p
    }
    
    mouseUp(p){
        this.mouseHeld = false
        
        // check if dragged a significant distance
        if( this.startPoint ){
            let d2 = this.startPoint.sub(p).getD2()
            if( d2 < this.minD2 ) return
            
            this._spawnLine(p)
        }
    }
}