// edge defined by polygon vertices
class PolygonEdge extends PathspecEdge {
    
    constructor(verts){
        super()
        
        verts.push(verts[0])
        this.verts = verts
        
        // comput total circumference
        // and cumulative side lengths
        let csl = [0]
        let n = verts.length
        let dist = 0
        for( let i = 0 ; i < n ; i++ ){
            dist += verts[(i+1)%n]
                    .sub(verts[i])
                    .getMagnitude()
            csl.push(dist)
        }
        this.csl = csl
    }
    
    
    getCircumference(){
        return this.csl[this.csl.length-1]
    }
    
    // compute position+normal [angle,radius,normal angle] 
    // at given distance along circumerence
    computePoint(d){
        
        // list of cumulative side lengths
        let csl = this.csl 
        
        // which side of polygon are we on
        // Side Index
        let si = -1+csl.findIndex( td => d<td )
        
        // where along that side
        // Side Ratio 0-1
        let sr = (d-csl[si]) / (csl[si+1]-csl[si])
        
        // xy of two relevant polygon verts
        let v = this.verts
        let v0 = v[si]
        let v1 = v[si+1]
        
        // normal angle of polygon side
        let norm = v1.sub(v0).getAngle()-pio2
        
        // xy of point in question
        let p = va( v0, v1, sr )
                
        return [p.getAngle(),p.getMagnitude(),norm]
    }
}