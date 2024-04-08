class StarEdge extends Edge {
    
    constructor(n,minRad,maxRad){
        super()
        this.n = n
        this.minRad = minRad
        this.maxRad = maxRad
    }
    
    getStarRad(angle){
        let mi = this.minRad
        let ma = this.maxRad
        let n = this.n
        
        return minRad + (ma-mi)*(1+.5*Math.sin(angle*n))
    }
    
    // called once
    getCircumference(){
        
        // add up pizza crust
        let angleStep = 1e-2
        let d = 0
        let angle = 0
        while( angle < twopi ){
            angle += angleStep
            rad = this.getStarRad(angle)
            d += angleStep*rad 
        }
        return d
    }
    
    // called when pre-computing edge shape
    // compute position+normal [angle,radius,normal angle] 
    // at given distance along circumerence
    computePoint(targetD){
        
        if( !this._lastD ){
            this._lastD = 0
            this._lastAngle = 0
        }
        
        let d = this._lastD
        let angle = this._lastAngle
        let rad = this.getStarRad(angle)
        let angleStep = 1e-2
        
        //make smal steps along curve 
        //until we have moved target distance
        while( d < targetD ){
            angle += angleStep
            rad = this.getStarRad(angle)
            d += angleStep*rad
        }
        
        this._lastD = d
        this._lastAngle = angle
        
        angle = d/rad
        return [angle,rad,angle]
    }
    
}