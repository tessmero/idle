function keyDown(event){
  if (event.key === "Escape") {
    pause()
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
    
    // apply user-set motion
    global.autoMoveCountdown = global.autoMoveDelay
    global.innerFocus = global.mousePos.x
    global.outerFocus = global.mousePos.y
    
}

function mouseDown(e){
    if( global.mouseDownDisabled ) return
    global.mouseDown = true
    
    // trigger clickable elements
    let gui = global.allGuis[global.gameState]
    gui.clickableElements.forEach( e => {
        if( inRect(global.mousePos,...e.rect) ){
            e.click()
        }
    })
}
function mouseUp(e){
    global.mouseDownDisabled = false
    global.mouseDown = false
}