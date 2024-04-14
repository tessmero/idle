

class CircleTool extends BodyTool{
    
    constructor(sim){
        super(sim,'circle',circleIcon)
        
        this.cursorCenter = true // tool.js
        this.circleRadius = .1
    }
    
    // implement BodyTool
    buildBody(p){
        return new CollectorCircleBody(this.sim,p,this.circleRadius)
    }

    // implement Tool
    getCost(){

        // count previously built circles
        let bods = global.mainSim.allBodies
        let circles = [...bods].filter(b => b instanceof CollectorCircleBody)
        let count = circles.length

        return ValueCurve.power(100,2.5).f(count)
    }

    // implement Tool
    getTutorial(){ 
        return new CircleToolTutorial(); 
    }
    
    mouseMove(p){}
    
    mouseUp(p){}
}