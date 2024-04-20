class TabHeaderButton extends TextButton {
    
    // called in TabPaneGroup constructor
    constructor(parent,tabIndex,rect,label,action){
        super(rect,label,action)
        
        this.parent = parent
        this.tabIndex = tabIndex
        this.debug = true
    }
    
    draw(g){
        let rect = this.rect
        let lineCol = global.fgColor
        
        if(this.hovered){
            lineCol = 'white'
        }
        //g.fillStyle = global.bgColor
        g.strokeStyle = lineCol
        g.clearRect(...rect)
        
        let selected = (this.parent.selectedTabIndex == this.tabIndex)
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
        
        drawText(g, ...rectCenter(...this.rect), this.label, this.center, new FontSpec(0, this.scale, false))
    }
}