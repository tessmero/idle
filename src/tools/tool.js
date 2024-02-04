// a tool is an aelement of the quick bar
// it determines the appearnace of the mouse cursor
// and the click behavior

class Tool{
   
    drawCursor(g,p){ throw new Error("not implemented") }
   
    mouseDown(){ throw new Error("not implemented") }
    
    update(dt){}
    
    mouseMove(){}
    
    mouseUp(){}
}