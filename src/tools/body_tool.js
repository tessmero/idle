
// base class for tools that spawn bodies
class BodyTool extends Tool{
    
    constructor(sim,title,icon){
        super(sim)
        
        this.title = title
        this.icon = icon
        this.tooltip = `build ${title}`
        this.cursorCenter = true // tool.js
    }
   
   // get title of body to build e.g. 'circle'
   getTitle(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`)
   }
   
   // create Body instance at point p
   buildBody(p){
        throw new Error(`Method not implemented in ${this.constructor.name}.`)
   }
   
    mouseDown(p){
        if( this.isUsable() ){
            
            // pay
            let cost = this.getCost()
            this.sim.particlesCollected -= cost
            let fp = p.add(v(...this.sim.drawOffset))
            FloaterGroup.signalChange(this.sim,p,-cost)
        
            // add body
            let poi = this.buildBody(p)
            this.sim.addBody(poi)
            
            // 
            if( this.sim == global.mainSim ){
                global.mainSim.setTool(global.toolList[0])
            }
        }
    }
    
    mouseMove(p){}
    
    mouseUp(p){}
}