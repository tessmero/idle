

class LineTool extends Tool{
    
    constructor(){
        super()
        
        this.icon = lineToolIcon
            
        this.tooltip = 'build lines'
        this.cursorCenter = true // tool.js
        
        // prepare for drag or two clicks
        // to build line between two points
        this.mouseHeld = false
        this.startPoint = null
    }
    
    draw(g){
        if( !this.startPoint ) return
        
        if( true ){
            let c = this.startPoint
            g.lineWidth = 1e-2
            g.beginPath()
            g.moveTo(...c.xy())
            g.lineTo(...global.mousePos.xy())
            g.stroke()
        }
        
    }
   
    mouseDown(){
        this.mouseHeld = true
        
        if( !this.startPoint ){
            this.startPoint = global.mousePos
        } else {
            let d2 = this.startPoint.sub(global.mousePos).getD2()
            if( d2 < 1e-2 ) return
            this._spawnLine()
        }
    }
    
    _spawnLine(){
            let poi = new LineBody(global.mainSim,this.startPoint,global.mousePos)
            global.mainSim.addBody(poi)
            this.startPoint = null
            global.selectedToolIndex = 0
    }
    
    mouseMove(){
    }
    
    mouseUp(){
        this.mouseHeld = false
        
        // check if dragged a significant distance
        if( this.startPoint ){
            let d2 = this.startPoint.sub(global.mousePos).getD2()
            if( d2 < 1e-2 ) return
            
            this._spawnLine()
        }
    }
}