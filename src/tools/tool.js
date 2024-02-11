// a tool is an aelement of the quick bar
// it determines the appearnace of the mouse cursor
// and the click behavior

// tool instances are singletons
class Tool{
   
    drawCursor(g,p){ 

        // get static cursor pixel art layout
        // or get animated cursor if idle
        let layout = (global.idleCountdown <= 0) ? 
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