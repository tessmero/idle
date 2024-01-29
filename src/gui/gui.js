class Gui {
    
    constructor(){
        this.clickableElements = this.buildElements()
    }
    
    // build list of clickable elements
    // with "rect" and functions "click" and "draw" 
    buildElements(){ throw new Error('not implemented') }
    
    draw(g){
        this.clickableElements.forEach(e => e.draw(g))
    }
    
    // draw pixel art icon followed by a line of text
    drawStatReadout(g,xy,icon,s){
        let scale = .5
        s = '  '+s // make space for icon on left
        
        // clear surrounding rectangle
        let rdims = getTextDims(s,scale)
        let dims = padRect( ...xy, ...rdims, .005 )
        g.fillStyle = global.backgroundColor
        g.fillRect(...dims)
        g.fillStyle = global.lineColor
        
        let ch = charHeight
        let tps = global.textPixelSize 
        drawLayout(g,xy[0],xy[1],icon,false,0,scale) //character.js
        drawText(g,...xy, s,false,0,.5)
    }
    
    // draw button with pixel art icon 
    drawButtonWithIcon(g,rect,icon){
        this.drawButton(g,rect)
        drawLayout(g,...rectCenter(...rect),icon) //character.js
    }
    
    // draw typical button
    drawButton(g,rect,label=null,hoverable=true){
        let lineCol = global.lineColor
        let labelCol = global.lineColor
        if(hoverable && inRect(global.mousePos,...rect)){
            lineCol = 'white'
        }
        g.fillStyle = global.backgroundColor
        g.strokeStyle = lineCol
        g.fillRect(...rect)
        g.strokeRect(...rect)
        g.fillStyle = global.lineColor
        
        if( label ){
            g.fillStyle = labelCol
            drawText(g, ...rectCenter(...rect), label)
        }
    }
    
    // draw typical label
    drawLabel(g,rect,label){
        g.fillStyle = global.backgroundColor
        drawText(g, ...rectCenter(...rect), label, true, .05)
        g.fillStyle = global.lineColor
        drawText(g, ...rectCenter(...rect), label, true, 0)
    }
}