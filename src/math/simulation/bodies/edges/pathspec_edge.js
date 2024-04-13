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
        
        
        // pre-compute edge shape as a path in polar coords
        // (distance along circumference) -> (angle,radius,norm,r2)
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
        
        // pre-compute shape again, this time indexed by angle
        // angle -> (radius,r2,distance along circ)
        const angleLutN = 1000
        const angleMargin = twopi/angleLutN
        const angleLutNDims = 3 // radius,r2, dist along circ
        const angleLut = new Float32Array(angleLutN*angleLutNDims); 
        let j = 0
        let dist = 0
        let distStep = circ/10e4
        let startAngle = this.computePoint(0)[0]
        let lastStepAngle = startAngle
        let ioff = nnmod( Math.floor(angleLutN*lastStepAngle/twopi), angleLutN )
        let i = 0
        for( let i = 0 ; i < angleLutN ; i++ ){
            let targetAngle = startAngle + twopi*i/angleLutN
            
            // advance dist and lastStepAngle
            let prevad = null
            while( true ){
                let testDist = dist + distStep
                
                let [angle,radius,norm] = this.computePoint(testDist)
                if( Math.abs(cleanAngle(angle-lastStepAngle)) >= angleMargin ){
                    throw new Error('insufficient angle precision')
                }
                lastStepAngle = angle
                dist = testDist
                
                let adiff = Math.abs(cleanAngle(lastStepAngle-targetAngle))
                //console.log(adiff,angleMargin)
                if( prevad && (adiff > prevad) ){
                    throw new Error('angle estimate getting worse')
                }
                prevad = adiff
                if( adiff < angleMargin ){
                    break
                }
            }
            
            let [angle,rad,norm] = this.computePoint(dist)
            let j = nnmod(i+ioff,angleLutN)*angleLutNDims
            angleLut[j+0] = rad
            angleLut[j+1] = rad*rad
            angleLut[j+2] = dist
        }
        this.angleLutN = angleLutN 
        this.angleLutNDims = angleLutNDims
        this.angleLut = angleLut
    }
    
}