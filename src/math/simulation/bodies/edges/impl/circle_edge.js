class CircleEdge extends RadspecEdge {
    
    constructor(rad){
        super()
        this.rad = rad
    }
    
    getCircumference(){
        return twopi*this.rad
    }
    
    computeRadius(a){
        return this.rad
    }
    
}