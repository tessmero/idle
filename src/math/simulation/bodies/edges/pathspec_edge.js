// base class for edges that are specified 
// based on a path along the circumference
class PathspecEdge extends Edge {
    
    // compute position+normal [angle,radius,normal angle,r2] 
    // at given distance along circumerence
    computePoint(d){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // get length of edge (which may loop)
    getCircumference(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }

    computeEdgeShape(){
        const circ = this.getCircumference()
        this.circ = circ
        
        // pre-compute edge path shape in polar coords
        // (distance along circumference) -> (a,r,norm,r2)
        const distLutN = 1e6
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
        
        // pre-compute angle->(radius,r2,distance)
        // (similar to shape, but indexed by 
        // angle instead of distance along circumference)
        const angleLutN = 1000
        const angleLutNDims = 3 // radius,r2, dist along circ
        const angleLut = new Float32Array(angleLutN*angleLutNDims); 
        let j = 0
        let dist = 0
        let amarg = 2.1*twopi/angleLutN
        for( let i = 0 ; i < angleLutN ; i++ ){
            let targetAngle = i*twopi/angleLutN
            while( Math.abs(cleanAngle(distLut[j*distLutNDims+0] - targetAngle)) > amarg ){
                j = (j+1)%distLutN
            }
            let rad = distLut[j*distLutNDims+1]
            let dist = circ*j/distLutN
            angleLut[i*angleLutNDims+0] = rad
            angleLut[i*angleLutNDims+1] = rad*rad
            angleLut[i*angleLutNDims+2] = dist
        }
        this.angleLutN = angleLutN 
        this.angleLutNDims = angleLutNDims
        this.angleLut = angleLut
    }
    
}