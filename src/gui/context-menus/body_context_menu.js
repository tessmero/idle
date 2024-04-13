// context menu (and reticle effect) 
// that appears when a body is clicked
class BodyContextMenu extends ContextMenu {
    constructor(rect,s0,s1,body){
        super(rect,s0,s1)
        
        this.body = body // Body instance to focus
        
        let w = .05
        let topRight = [rect[0]+rect[2]-w,rect[1],w,w]
        
        this.children = [
            new StatReadout(s0,circleIcon,()=>'circle')
                    .withScale(.5)
                    .withCenter(false),
            new StatReadout(s1,collectedIcon,()=>'circle')
                    .withScale(.5)
                    .withCenter(false),
            new IconButton(topRight,xIcon,()=>this.closeBodyContextMenu())
                    .withScale(.5)
                    .withTooltip('close menu'),
        ]
    }
    
    closeBodyContextMenu(){
        global.contextMenu = null
        global.mainSim.selectedBody = null
    }
    
    draw(g){
        super.draw(g)
        
        //draw reticle effect around body
        g.fillStyle = 'white'
        g.strokeStyle = global.fgColor
        let n = 5
        let space = .1
        let bod = this.body
        let center = bod.pos
        let ao = 0//global.t/1e3 // spinning animation angle
        let ta = .5 // tip shape angle
        let tl = .03 // tip length
        let fill = [false,true] 
        for( let i = 0 ; i < n ; i++ ){
            let a = ao + i*twopi/n
            let r = space + bod.edge.lookupAngle(a-bod.angle)[0]
            let tip = center.add(vp(a,r))
            let left = tip.add(vp(a+ta,tl))
            let right = tip.add(vp(a-ta,tl))
            fill.forEach( f => this.drawArrow(g,tip,left,right,f) )
        }
        
        g.fillStyle = global.fgColor
    }
    
    drawArrow(g,a,b,c,fill){
        g.beginPath()
        g.moveTo(...a.xy())
        g.lineTo(...b.xy())
        g.lineTo(...c.xy())
        g.closePath()
        if( fill ){
            g.fill()
        } else {
            g.stroke()
        }
    }
}