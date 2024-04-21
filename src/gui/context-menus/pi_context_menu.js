// sandbox mode
// particle inspector context menu
class PiContextMenu extends ContextMenu {
    constructor(rect,s0,s1,pData){
        super(rect,s0,s1)
        this.pData = pData 
        
        // idenfity particle type
        let [subgroup,i,x,y,dx,dy,hit] = pData
        let flavor, icon
        if( !subgroup ){
            icon = proceduralParticleIcon
            flavor = 'procedural'
        } else if( subgroup instanceof PhysicsPSubgroup ){
            icon = physicsParticleIcon
            flavor = 'physics'
        } else {
            icon = edgeParticleIcon
            flavor = 'edge'
        }
        
        
        let w = .05
        let topRight = [rect[0]+rect[2]-w,rect[1],w,w]
        
        let statScale = .4
        let stats = this.buildStats(flavor)
        
        stats = stats.map(e => (e.length==1) ? e[0] : this.showCoord(...e) )
        stats = stats.join("\n")
        
        this.children = [
                    
            new StatReadout(s0,icon,()=>`\n${flavor}\nparticle\nno. ${i}`,()=>0.5),
            new TextLabel(s1,stats).withScale(statScale),
                    
            new IconButton(topRight,xIcon,()=>this.closePiContextMenu())
                    .withScale(.5)
                    .withTooltip('close'),
        ]
    }
    
    buildStats(flavor){
        
        // data passed from grab event
        // in need of cleanup
        let [subgroup,i,x,y,dx,dy,hit] = this.pData
        
        
        // lookup group needs cleanup
        let s = global.mainSim
        let grp = ((flavor == 'physics') ? s.physicsGroup : (
            (flavor == 'edge') ? s.edgeGroup : s.rainGroup
        ))
        
        // group members (not relevent for procedural)
        let nd = grp.ndims
        let st = grp.state
                
        let grabbed = grp.grabbedParticles.has(i)
        let state = grabbed ? 'inactive' : 'active'
        let vscale = 1e3
        
        switch( flavor ){
            case 'physics':
                let vx = vscale*st[i*nd+2]
                let vy = vscale*st[i*nd+3]
                return [
                    [state],
                    ['x',x],
                    ['y',y],
                    ['vx',vx],
                    ['vy',vy],
                ]
                
            case 'edge':
                let d = st[i*nd+0]
                let v = vscale*st[i*nd+1]
                return [
                    [state],
                    ['pos',d],
                    ['vel',v],
                ]
                
            default:
                return [
                    [state],
                    ['x',x],
                    ['y',y]
                ]
        }
    }
    
    showCoord(label, val){
        
        let s = Number(val).toFixed(3)
        let tl = 10 - label.length
        while( s.length < tl ){
            s = ' ' + s
        }
        return `${label}:${s}`
    }
    
    deleteBody(){
        let b = this.body
        while( b.parent ) b = b.parent// got top parent
        global.mainSim.removeBody(b)
        this.closeBodyContextMenu()
    }
    
    closePiContextMenu(){
        global.contextMenu = null
        global.mainSim.selectedParticle = null
        
        global.mainSim.setTool( global.toolList[0] )
    }
}