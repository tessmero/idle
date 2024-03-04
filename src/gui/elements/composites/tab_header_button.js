class TabHeaderButton extends TextButton {
    
    constructor(tabIndex,rect,label,action){
        super(rect,label,action)
        
        this.tabIndex = tabIndex
        this.debug = true
    }
    
    draw(g){
        let rect = this.rect
        let lineCol = global.lineColor
        
        if(this.hovered){
            lineCol = 'white'
        }
        //g.fillStyle = global.backgroundColor
        g.strokeStyle = lineCol
        g.clearRect(...rect)
        
        let selected = (global.upgradeMenuTabIndex == this.tabIndex)
        if( selected ){
            let [x,y,w,h] = rect
            g.beginPath()
            g.moveTo( x,y+h )
            g.lineTo( x,y )
            g.lineTo( x+w,y )
            g.lineTo( x+w,y+h )
            g.stroke()
        } else {
            g.strokeRect(...rect)
        }
        
        drawText(g, ...rectCenter(...this.rect), this.label, this.center, 0, this.scale, false)
    }
}