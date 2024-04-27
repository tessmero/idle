// static flat surface body
class CrossBody extends Body{
    constructor(sim,pos){
        super(sim,pos) 
        
        //
        this.title = 'cross'
        this.icon = increaseIcon
    }
    
    update(dt,...p){
        this.spin(-1e-6*dt) 
        return super.update(dt,...p)
    }
    
    
    buildEdge(){
        
        let verts = [
            [-1,4],[1,4],[1,1],
            [4,1],[4,-1],[1,-1],
            [1,-4],[-1,-4],[-1,-1],
            [-4,-1],[-4,1],[-1,1],
        ]
        
        verts = verts.map( xy => v(...xy).mul(1e-1) )
        
        return new PolygonEdge(verts)
    }
    
    buildGrabber(){
        return new EdgeGrabber(
            this.pos,this.angle,this.edge,
            (...p) => this.grabbed(...p),0)
    }
    
    draw(g){
        
        // draw star
        let c = this.pos
        g.fillStyle = global.colorScheme.fg
        g.beginPath()
        g.moveTo(...c.xy())
        for( let a = 0 ; a < twopi ; a += 1e-2 ){
            let [r,r2,dist] = this.edge.lookupAngle(a)
            let p = c.add(vp(a+this.angle,r))
            g.lineTo( ...p.xy() )
        }
        g.fill()
        
        
        
        if( false ){
            
            // debug pressure level
            g.fillStyle = global.colorScheme.bg
            drawText(g,...p,this.pressure.toFixed(2).toString())
            g.fillStyle = global.colorScheme.fg
        }
        
    }
    

}