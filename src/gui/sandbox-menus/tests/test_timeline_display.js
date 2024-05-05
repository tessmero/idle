// progress indicator with checkboxes
class TestTimelineDisplay extends CompositeGuiElement {
    constructor(rect,duration,checkTimes,checkLabels){
        super(rect)
        this.duration = duration
        this.checkTimes = checkTimes
        this.checkLabels = checkLabels
        this.t = 0
        
        let innerRect = padRect( ...rect, -.01 )
        this.innerRect = innerRect
        
        
        // position icon for each checkpoint in timeline
        let boxes = []
        let boxRad = .02
        for( let i = 0 ; i < checkTimes.length ; i++ ){
            let t = checkTimes[i]
            let label = checkLabels[i]
            let x = innerRect[0] + (t/duration)*innerRect[2]
            let r = [x-boxRad,innerRect[1]-.05,2*boxRad,2*boxRad]
            boxes.push( new IconButton( r, uncheckedIcon, ()=>{} )
                .withScale(.2)
                .withTooltip(label)
                .withTooltipScale(.25))
        }
        this.checkboxes = boxes
        
        
        
        this.children = [
            
            ...this.checkboxes,
            new ProgressIndicator(innerRect,()=>this.t/this.duration),
        ]
    }
    
    draw(g){
        
        // position line with tick marks
        let [x,y,w,h] = this.innerRect
        let specs = [
            [
                [x  ,y+h/2],
                [x+w,y+h/2]
            ]
        ]
        for( let t = 0 ; t < this.duration ; t += 1000 ){
            let tx = x + w*t/this.duration
            specs.push([
                [tx,y],
                [tx,y+h]
            ])
        }   
        
        // draw lines
        g.lineWidth = global.lineWidth
        g.strokeStyle = global.colorScheme.fg
        g.beginPath()
        specs.forEach( entry => {
            g.moveTo( ...entry[0] )
            g.lineTo( ...entry[1] )
        })
        g.stroke()
        
        // draw children
        super.draw(g)
    }
    
    setTime(t){
        this.t = t
        
        let ct = this.checkTimes
        let n = ct.length
    }
    
    setCheckboxIcon(i,icon){
        this.checkboxes[i].icon = icon
    }
}