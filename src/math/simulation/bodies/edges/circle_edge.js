class CircleEdge extends Edge {
    
    constructor(rad){
        super()
        this.rad = rad
    }
    
    getCircumference(){
        return twopi*this.rad
    }
    
    // called in constructor
    // compute position+normal [angle,radius,normal angle] 
    // at given distance along circumerence
    computePoint(d){
        let angle = d/this.rad
        return [angle,this.rad,angle]
    }
    
}