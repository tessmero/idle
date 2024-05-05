// a tool is an element in the toolbar
// it determines the appearnace of the mouse cursor
// and some interaction with a particle sim when clicking
class Tool{
   
   constructor(sim){
       this.sim = sim
   }
   
    mouseDown(){ throw new Error("not implemented") }
    
    update(dt){}
    
    mouseMove(){}
    
    mouseUp(){}
   
   // remove any grabbers submitted to sim
   unregister(sim){}
   
   isUsable(){
       
       
       if( this.sim != global.mainSim ) return true
       
        let cost = this.getCost()
        let budget = this.sim.particlesCollected
        return budget >= cost
   }
   
   // return number of raindrops
   getCost(){
       return 0
   }
   
   // return Tutorial instance
   getTutorial(){ 
    return null; 
    }
   
   // draw overlay
   draw(g){
       // do nothing
   }
   
    drawCursor(g,p,scale=1,enableIdleAnim=false){ 

        // get static cursor pixel art layout
        // or get animated cursor if idle
        let layout = (enableIdleAnim && (global.idleCountdown <= 0)) ? 
            this.icon.getCurrentAnimatedLayout() : this.icon.frames[0]
        
        g.fillStyle = global.colorScheme.fg
        drawLayout(g,...p,layout,this.cursorCenter,new FontSpec(.005,scale,true)) 
        drawLayout(g,...p,layout,this.cursorCenter,new FontSpec(0,scale,false) )

    }
    
    drawToolbarIcon(g,rect){ 

        // get static cursor pixel art layout
        // or get animated cursor if idle
        let layout = (global.idleCountdown <= 0) ? 
            this.icon.getCurrentAnimatedLayout() : this.icon.frames[0]
            
        drawLayout(g,...rectCenter(...rect),layout)
    }
}