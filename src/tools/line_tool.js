

class LineTool extends BodyTool{
    
    constructor(sim,lineLength=.1){
        super(sim)
        
        this.icon = lineIcon
            
        this.tooltip = 'build line'
        this.cursorCenter = true // tool.js
        
        this.lineRadius = 2e-2 // radius of caps (half of thickness)
        this.lineLength = lineLength 
    }
    
    // implement BodyTool
    buildBody(p){
        let d = sqrt2*this.lineLength/2
        d = v(d,d)
        return new ControlledSausageBody(this.sim,
            p.add(d), p.sub(d),
            this.lineRadius)
    }
   
    getCost(){

        // count previously built lines
        let bods = this.sim.getBodies()
        let lines = [...bods].filter(b => b instanceof ControlledSausageBody)
        let count = lines.length

        return ValueCurve.power(50,10).f(count)
    }

    getTutorial(){ 
        return new LineToolTutorial(); 
    }
    
   
    
}