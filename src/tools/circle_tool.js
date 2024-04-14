

class CircleTool extends Tool{
    
    constructor(sim){
        super(sim)
        
        this.icon = circleIcon
            
        this.tooltip = 'build circle'
        this.cursorCenter = true // tool.js
        this.circleRadius = .1
    }
   
   getCost(){
       
       // count previously built circles
       let bods = global.mainSim.allBodies
       let circles = [...bods].filter(b => b instanceof ControlledCircleBody)
       let count = circles.length
       
       return ValueCurve.power(100,2.5).f(count)
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
        if( this.isUsable() ){
            
            // pay
            this.sim.particlesCollected -= this.getCost()
        
            // add body
            let poi = new ControlledCircleBody(this.sim,p,this.circleRadius)
            this.sim.addBody(poi)
            
            // 
            if( this.sim == global.mainSim ){
                global.selectedToolIndex = 0
            }
        }
    }
    
    mouseMove(p){}
    
    mouseUp(p){}
}