

class CircleTool extends Tool{
    
    constructor(){
        super()
        
        this.icon = circleToolIcon
            
        this.tooltip = 'build circles'
        this.cursorCenter = true // tool.js
    }
    
    drawBuildCursor(g){
        
        let p = global.mousePos.xy()
        
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,this.r,0,twopi)
        g.fill()
    }
   
    mouseDown(){
        let poi = new Poi(global.mainSim,global.mousePos)
        global.mainSim.addBody(poi)
        global.selectedToolIndex = 0
    }
    
    mouseMove(){}
    
    mouseUp(){}
}