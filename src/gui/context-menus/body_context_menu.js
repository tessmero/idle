// context menu (and reticle effect) 
// that appears when a body is clicked 
class BodyContextMenu extends ContextMenu {
    constructor(rect,s0,s1,body){
        super(rect,s0,s1)
        
        this.body = body // Body instance to focus
        if( !body.expLevel ) body.expLevel = 1
        if( !body.title ) body.title = 'body'
        if( !body.icon ) body.icon = circleIcon
        
        let w = .05
        let topRight = [rect[0]+rect[2]-w,rect[1],w,w]
        
        this.children = [
                    
            new StatReadout(s0,body.icon,()=>body.title,()=>0.5),
                    
            new IconButton(topRight,xIcon,()=>this.closeBodyContextMenu())
                    .withScale(.5)
                    .withTooltip('close menu'),
                    
            new IconButton(padRect(...s1,-.1),trashIcon,()=>this.deleteBody())
                    .withTooltip(`delete ${body.title}\n(no refunds)`)
                    .withScale(.8)
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
        g.fillStyle = global.hlColor
        let bod = this.body
        let edge = bod.edge
        let n = Math.floor(edge.circ*50)
        let s = 1e-2 // square size
        let guiScale = .5 
        let center = bod.pos.sub(v(s/2,s/2))
        let space = 2e-2
        let animAng = global.t/1e3
        space += 1e-2*Math.cos(animAng) // in-out anim
        let cdo = 1e-1*Math.sin(animAng/2) // slide anim
        
        for( let i = 0 ; i < n ; i++ ){
            let cd = cdo + i*edge.circ/n
            let [a,r,norm,r2] = bod.edge.lookupDist(cd)
            a += bod.angle
            norm += bod.angle
            let p = center.add(vp(a,r).add(vp(norm,space)))
            g.fillRect(...p.xy(),s,s)
        }
        
        g.fillStyle = global.fgColor
    }
}