

class BuildTool extends Tool{
    
    constructor(){
        super()
        
        this.iconLayout = [
            ' www ',
            'wwwww',
            'wwwww',
            'wwwww',
            ' www '
        ]
    }
    
    drawToolbarIcon(g,rect){ 
        drawLayout(g,...rectCenter(...rect),this.iconLayout)
    }
   
    drawCursor(g,p){ 
        drawLayout(g,...p,this.iconLayout) 
    }
   
    mouseDown(){
        if( global.allPois.length < global.maxPoiCount ){
            global.allPois.push(new Poi(global.mousePos))
        }
        global.selectedToolIndex = 0
    }
    
    mouseMove(){}
    
    mouseUp(){}
}