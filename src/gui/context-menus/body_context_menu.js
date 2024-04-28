// context menu (and reticle effect) 
// that appears when a body is clicked 
class BodyContextMenu extends ContextMenu {
    constructor(rect,s0,s1,body){
        super(rect,s0,s1)
        
        this.body = body // Body instance to focus
        if( !body.title ) body.title = 'body'
        if( !body.icon ) body.icon = circleIcon
        
        let w = .05
        let topRight = [rect[0]+rect[2]-w,rect[1],w,w]
        
        let brs = .02
        let bottomRight = [s1[0]+s1[2]-brs,s1[1]+s1[3]-brs,brs,brs]
        bottomRight = padRect( ...bottomRight, .03 )
        
        this.children = [
                    
            new StatReadout(s0,body.icon,()=>body.title,()=>0.5),
                    
            new IconButton(topRight,xIcon,()=>this.closeBodyContextMenu())
                    .withScale(.5)
                    .withTooltip('close menu'),
                    
            new IconButton(bottomRight,trashIcon,()=>this.deleteBody())
                    .withTooltip(`delete ${body.title}\n(no refunds)`)
                    .withScale(.5)
        ]
    }
    
    deleteBody(){
        let b = this.body
        while( b.parent ) b = b.parent// got top parent
        global.mainSim.removeBody(b)
        this.closeBodyContextMenu()
    }
    
    closeBodyContextMenu(){
        global.contextMenu = null
        global.mainSim.selectedBody = null
    }
    
    draw(g){
        super.draw(g)
        
        //debug
        //g.strokeRect(...this.square0)
        
        //draw reticle effect around body
        g.fillStyle = global.colorScheme.hl
        let bod = this.body
        let edge = bod.edge
        let n = Math.floor(edge.circ*500)
        let s = 1e-2 // square size
        let guiScale = .5 
        let center = bod.pos
        let thickness = 1e-2
        
        // strip pattern in units of index (up to n)
        let period = Math.floor( n/20 )
        let fill = Math.floor(period*.75)
        
        let animAng = global.t/1e3 // anim state
        //space += 1e-2*Math.cos(animAng) // in-out anim
        let cdo = 6e-2*animAng//1e-1*Math.sin(animAng/2) // slide anim
        
        let inners = []
        let outers = []
        
        for( let i = 0 ; i < n ; i++ ){
            let cd = cdo + i*edge.circ/n
            let [a,r,norm,r2] = bod.edge.lookupDist(cd)
            a += bod.angle
            norm += bod.angle
            let outer = center.add(vp(a,r))
            let inner = outer.sub(vp(norm,thickness))
            
            let im = i%period
            if( im == 0 ){
                // start segment
                inners = [inner]
                outers = [outer]
            }
            else if( im < fill ){
                // mid segment
                inners.push(inner)
                outers.push(outer)
                
            }
            else if( im = fill ){
                // finish segment
                g.beginPath()
                inners.reverse()
                    .concat(outers)
                    .forEach(p => g.lineTo(...p.xy()))
                g.fill()
                
            }
            else {
                // between segments
                // do nothing
            }
        }
    }
}