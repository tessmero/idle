

class BuildTool extends Tool{
    
    constructor(){
        super()
        
        this.icon = circleToolIcon
            
        this.tooltip = 'build circles'
        this.cursorCenter = true // tool.js
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