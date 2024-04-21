class SausageGrabber extends CompoundGrabber {
    
    constructor(a,b,rad,f){
        super(f)
        
        this.a = a
        this.b = b
        this.rad = rad
        
        let len = b.sub(a).getMagnitude()
        let cap = pi*rad
        
        this.children = [
            new LineGrabber(a,b,rad,null,0,len+cap),
            new CircleGrabber(b,rad,null,len),
            new CircleGrabber(a,rad,null,len+cap+len),
        ]
        
        let c = this.children
    }
    
    
    // called periodically. set member vars 
    // for objects in this.children
    // do not add or remove children
    update(){
        let a = this.a
        let b = this.b
        let d = b.sub(a)
        let c = this.children
        
        let rad = this.rad
        let angle = d.getAngle()
        let len = d.getMagnitude()
        let cap = pi*rad
        
        c[0].a = a //line 
        c[0].b = b
        
        c[1].pos = b //circle
        c[1].rad = rad
        c[1].edgeOffset = len-cap-rad*(pio2+angle)
        
        c[2].pos = a //circle
        c[2].rad = rad
        c[2].edgeOffset = len+len+cap -rad*(pio2+angle)
    }
}