

class BuildTool extends Tool{
    
    constructor(){
        super()
        
        this.icon = circleToolIcon
            
        this.tooltip = 'build circles'
        this.cursorCenter = true // tool.js
    }
   
    mouseDown(){
        if( global.mainSim.allPois.length < global.maxPoiCount ){
            let poi = new Poi(global.mainSim,global.mousePos)
            global.mainSim.allPois.push(poi)
            global.mainSim.grabbers.add(poi.grabber)
        }
        global.selectedToolIndex = 0
    }
    
    mouseMove(){}
    
    mouseUp(){}
}