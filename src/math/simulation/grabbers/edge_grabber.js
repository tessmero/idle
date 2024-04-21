
// similar to a circle grabber,
// but checks precomputed shape angle->radius
// instead of having one radius
class EdgeGrabber extends Grabber {
    constructor(pos,angle,edge,f){
        super(f)        
        this.pos = pos
        this.angle = angle
        this.edge = edge
    }
    
    drawDebug(g){
        let p = this.pos.xy()
        g.fillStyle = 'yellow'
        g.beginPath()
        g.moveTo(...p)
        g.arc(...p,this.rad,0,twopi)
        g.fill()
    }
    
    contains(subgroup,i,x,y){
        let dx = x-this.pos.x
        let dy = y-this.pos.y
        let a = Math.atan2(dy,dx)-this.angle
        let [r,r2,dist] = this.edge.lookupAngle(a)
        let hit = (dx*dx + dy*dy) < r2
        
        if( !hit ) return false
        
        let eo = 0
        if( this.edgeOffset ) eo = this.edgeOffset
        
        // return arc length
        return eo + dist
    }
}