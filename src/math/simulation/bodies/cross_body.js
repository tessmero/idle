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
        
        let a = 1
        let b = 5
        
        let aa = 1/2
        let c = 6
        let scale = 2e-2
        
        let verts = [
            [-a,b],[-aa,c],[aa,c],[a,b],[a,a],
            [b,a],[c,aa],[c,-aa],[b,-a],[a,-a],
            [a,-b],[aa,-c],[-aa,-c],[-a,-b],[-a,-a],
            [-b,-a],[-c,-aa],[-c,aa],[-b,a],[-a,a],
        ]
        
        verts = verts.map( xy => v(...xy).mul(scale) )
        
        
        return new PolygonEdge(verts.reverse())
    }
    
    buildGrabber(){
        return new EdgeGrabber(
            this.pos,this.angle,this.edge,
            (...p) => this.grabbed(...p),0)
    }

}