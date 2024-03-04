function keyDown(event){
  if (event.key === "Escape") {
    pause()
  }
  if (event.which==16) {
    global.shiftHeld = true
  }
  if (event.which==17) {
    global.controlHeld = true
  }
}
function keyUp(event){
  if (event.which==16) {
    global.shiftHeld = false
  }
  if (event.which==17) {
    global.controlHeld = false
  }
}

function updateMousePos(event){
    
    
    var rect = global.canvas.getBoundingClientRect();
    var scaleX = global.canvas.width / rect.width;
    var scaleY = global.canvas.height / rect.height;
    
    global.canvasMousePos = new Vector( 
        (event.clientX - rect.left) * scaleX, 
        (event.clientY - rect.top) * scaleY 
    
    )
    global.mousePos = new Vector( 
        (global.canvasMousePos.x-global.canvasOffsetX)/global.canvasScale, 
        (global.canvasMousePos.y-global.canvasOffsetY)/global.canvasScale
    )
}

function mouseMove(e){
    updateMousePos(e)
    
    // animate cursor if idle 
    global.idleCountdown = global.idleDelay
    
    // trigger selected tool movement behavior
    toolList[global.selectedToolIndex].mouseMove(global.mousePos)
}

function mouseDown(e){
    if( global.mouseDownDisabled ) return
    
    // update mouse position
    if( e.touches ){
        mouseMove(e.touches[0])
    } else {
        mouseMove(e)
    }
    
    global.mouseDown = true
    
    // trigger clickable gui
    let gui = global.allGuis[global.gameState]
    let clickedGui = gui.click()
    if( clickedGui ){
        //console.log('clicked fg gui')
        return
    }
    if( gui.hasHudInBackground ){
        let hud = global.allGuis[GameStates.playing]
        clickedGui = hud.click()
    }
    if( clickedGui ){
        //console.log('clicked bg hud gui')
        return
    }
    
    //console.log('click fell through all guis')
    // close the upgrades menu if it is open 
    if( global.gameState==GameStates.upgradeMenu ) toggleStats()
    
    // or trigger selected tool
    toolList[global.selectedToolIndex].mouseDown(global.mousePos)
    
}
function mouseUp(e){
    global.mouseDownDisabled = false
    global.mouseDown = false
    
    // release tool if it was being held down
    toolList[global.selectedToolIndex].mouseUp(global.mousePos)
    
    global.mainSim.allPois.forEach(p => p.isHeld = false )
}