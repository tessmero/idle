

class CircleTool extends Tool{
    
    constructor(sim){
        super(sim)
        
        this.icon = circleIcon
            
        this.tooltip = 'build circles'
        this.cursorCenter = true // tool.js
        this.circleRadius = .1
    }
   
   getTutorial(){ 
    return new CircleToolTutorial(); 
    }
    
    drawBuildCursor(g){
        
        let p = global.mousePos.xy()
        
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,this.r,0,twopi)
        g.fill()
    }
   
    mouseDown(p){
        let poi = new ControlledCircleBody(this.sim,p,this.circleRadius)
        this.sim.addBody(poi)
        if( this.sim == global.mainSim ){
            global.selectedToolIndex = 0
        }
    }
    
    mouseMove(p){}
    
    mouseUp(p){}
}