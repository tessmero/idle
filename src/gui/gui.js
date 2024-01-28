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
    
    // draw typical button
    drawButton(g,rect,label){
        let lineCol = global.lineColor
        let labelCol = global.lineColor
        if(inRect(global.mousePos,...rect)){
            lineCol = 'white'
        }
        g.strokeStyle = lineCol
        g.strokeRect(...rect)
        g.fillStyle = labelCol
        drawText(g, ...rectCenter(...rect), label)
    }
}