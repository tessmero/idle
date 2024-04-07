class ControlledSausageBody extends CompoundBody {
    
    // sim is a ParticleSim instance
    constructor(sim,a,b,rad=2e-2){
        super(sim,va(a,b))
        
        this.a = a
        this.b = b
        this.rad = rad
        
        let sausage = new SausageBody(sim,a,b,rad)
        this.sausage = sausage
        
        // init control points for user to click and drag
        this.movCp = new ControlPoint(sim,sausage)
        let r = a.sub(b).getMagnitude()/2
        this.rotCp0 = new RotationControlPoint(sim,sausage,0,r)
        this.rotCp1 = new RotationControlPoint(sim,sausage,pi,r)
        this.controlPoints = [this.movCp,this.rotCp0,this.rotCp1]
        this.controlPoints.forEach(cp => cp.fscale = .6)
        
        
        //this.constraints = [new Spring(this.rotCp0,this.rotCp1)]
        this.children = [sausage,...this.controlPoints]
        
        this.dripChance = global.poiDripChance
    }
    
    // grabbed particle in straight midsection
    grabbed(x,y,edgeSpeed=0) {
        
        // locate edge point
        let a = this.a
        let b = this.b
        let dx = x-a.x
        let dy = y-a.y
        let d = b.sub(a)
        let r = (dx*d.x + dy*d.y) / d.getD2() // position along edge (float)
        let cw = clockwise(a,b,v(x,y)) // which side (boolean)
        let eps = cw ? this.eps[1] : this.eps[0]
        
        // stick particle to edge
        if(cw) edgeSpeed *= -1
        this.eps.spawnParticle(r,edgeSpeed)
    }
}