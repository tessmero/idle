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
            new CircleGrabber(a,rad,null,len),
            new CircleGrabber(b,rad,null,len+cap+len),
        ]
    }
    
    
    // called periodically. set member vars 
    // for objects in this.children
    // do not add or remove children
    updateChildren(){
        let c = this.children
        
        c[0].a = this.a //line 
        c[0].b = this.b
        
        c[1].pos = this.a //circle
        c[1].rad = this.rad
        
        c[2].pos = this.b //circle
        c[2].rad = this.rad
    }
}