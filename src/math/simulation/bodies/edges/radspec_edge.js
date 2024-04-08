// base class for edges that are specified 
// based on an angle->radius function
class RadspecEdge extends Edge {

    computeRadius(angle){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }

    computeEdgeShape(){
        
        // pre-compute angle->(radius,r2,distance)
        // (similar to shape, but indexed by 
        // angle instead of distance along circumference)
        const angleLutN = 1000
        const angleLutNDims = 3 // radius,r2
        const angleLut = new Float32Array(angleLutN*angleLutNDims); 
        let circ = 0
        let angleStep = twopi/angleLutN
        for( let i = 0 ; i< angleLutN ; i++ ){
            let rad = this.computeRadius(i*twopi/angleLutN)
            angleLut[i*angleLutNDims+0] = rad
            angleLut[i*angleLutNDims+1] = rad*rad
            angleLut[i*angleLutNDims+2] = circ
            circ += angleStep*rad
            
            if( isNaN(circ) ) throw new Error('poop')
        }
        this.angleLutN = angleLutN 
        this.angleLutNDims = angleLutNDims
        this.angleLut = angleLut
        this.circ = circ
        
        // pre-compute edge path shape in polar coords
        // (distance along circumference) -> (a,r,norm,r2)
        const distLutN = 1000
        const distLutNDims = 4 // angle, radius, normal angle,r2
        const distLut = new Float32Array(distLutN*distLutNDims); 
        for( let i = 0 ; i< distLutN ; i++ ){
            let [angle,radius,norm] = this.computePoint(circ*i/distLutN)
            distLut[i*distLutNDims+0] = angle
            distLut[i*distLutNDims+1] = radius
            distLut[i*distLutNDims+2] = norm
            distLut[i*distLutNDims+3] = radius*radius
        }
        this.distLutN = distLutN
        this.distLutNDims = distLutNDims
        this.distLut = distLut
    }
    
    // called when pre-computing edge shape
    // compute position+normal [angle,radius,normal angle] 
    // at given distance along circumerence
    computePoint(targetD){
        
        let dmarg = 1e-3
        let bestI = 0
        let bestCirc = 1e5
        let bestD = 1e5
        for( let i = 0 ; i< this.angleLutN ; i++ ){
            let circ = this.angleLut[i*this.angleLutNDims+2]
            let d = Math.abs(circ-targetD)
            if( d < bestD ){
                bestD = d
                bestCirc = circ
                bestI = i
            } else {
                break
            }
        }
        let angle = bestI*twopi/this.angleLutN
        let j = bestI*this.angleLutNDims
        let r = this.angleLut[j+0]
        
        let prevI = nnmod(bestI-1,this.angleLutN)
        let prevAngle = prevI*twopi/this.angleLutN
        let prevJ = prevI*this.angleLutNDims
        let prevRad = this.angleLut[prevJ]
        let prevP = vp(prevAngle,prevRad)
        
        let nextI = nnmod(bestI+1,this.angleLutN)
        let nextAngle = nextI*twopi/this.angleLutN
        let nextJ = nextI*this.angleLutNDims
        let nextRad = this.angleLut[nextJ]
        let nextP = vp(nextAngle,nextRad)
        
        let norm = nextP.sub(prevP).getAngle()-pio2
        
        return [ angle, r, norm]
        
    }
    
}