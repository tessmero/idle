

class BuildTool extends Tool{
    
    constructor(){
        super()
        
        this.icon = circleToolIcon
            
        this.tooltip = 'build circles'
        this.cursorCenter = true // tool.js
    }
   
    mouseDown(){
        if( global.allPois.length < global.maxPoiCount ){
            let poi = new Poi(global.mousePos)
            global.allPois.push(poi)
            global.grabbers.add(poi.grabber)
        }
        global.selectedToolIndex = 0
    }
    
    mouseMove(){}
    
    mouseUp(){}
}