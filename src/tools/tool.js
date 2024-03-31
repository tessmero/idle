// a tool is an element in the toolbar
// it determines the appearnace of the mouse cursor
// and some interaction with a particle sim when clicking
class Tool{
   
   constructor(sim){
       this.sim = sim
   }
   
   // return Tutorial instance
   getTutorial(){ 
    return null; 
    }
   
    drawCursor(g,p,enableIdleAnim=false){ 

        // get static cursor pixel art layout
        // or get animated cursor if idle
        let layout = (enableIdleAnim && (global.idleCountdown <= 0)) ? 
            this.icon.getCurrentAnimatedLayout() : this.icon.frames[0]
        
        
        drawLayout(g,...p,layout,this.cursorCenter,.005,1,true) 
        drawLayout(g,...p,layout,this.cursorCenter,0,1,false) 

    }
    
    drawToolbarIcon(g,rect){ 

        // get static cursor pixel art layout
        // or get animated cursor if idle
        let layout = (global.idleCountdown <= 0) ? 
            this.icon.getCurrentAnimatedLayout() : this.icon.frames[0]
            
        drawLayout(g,...rectCenter(...rect),layout)
    }
   
    mouseDown(){ throw new Error("not implemented") }
    
    update(dt){}
    
    mouseMove(){}
    
    mouseUp(){}
}