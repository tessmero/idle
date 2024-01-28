

function update(dt) {    
    global.t += dt
    
    // check for resized window
    fitToContainer()    
}

var lastCanvasOffsetWidth = -1;
var lastCanvasOffsetHeight = -1;
function fitToContainer(){
    
    var cvs = global.canvas
    if( (cvs.offsetWidth!=lastCanvasOffsetWidth) || (cvs.offsetHeight!=lastCanvasOffsetHeight) ){
        
        lastCanvasOffsetWidth = cvs.offsetWidth
        lastCanvasOffsetHeight = cvs.offsetHeight
        
      cvs.width  = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
        var padding = 0; // Padding around the square region
        var dimension = Math.min(cvs.width, cvs.height) - padding * 2;
        global.canvasScale = dimension;
        global.canvasOffsetX = (cvs.width - dimension) / 2;
        global.canvasOffsetY = (cvs.height - dimension) / 2;
    global.ctx.setTransform(global.canvasScale, 0, 0, 
        global.canvasScale, global.canvasOffsetX, global.canvasOffsetY);
        
        var xr = -global.canvasOffsetX / global.canvasScale
        var yr = -global.canvasOffsetY / global.canvasScale
        
        let sc = [v(xr,yr),v(1-xr,yr),v(1-xr,1-yr),v(xr,1-yr)]
        global.screenCorners = sc 
        global.screenRect = [sc[0].x,sc[0].y,(sc[2].x-sc[0].x),(sc[2].y-sc[0].y)]
        rebuildGuis() //game_states.js
    }
}