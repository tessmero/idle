class StarEdge extends RadspecEdge {
    
    constructor(n,minRad,maxRad){
        super()
        this.n = n
        this.minRad = minRad
        this.maxRad = maxRad
    }
    
    computeRadius(angle){
        let mi = this.minRad
        let ma = this.maxRad
        let n = this.n
        
        return mi + (ma-mi)*(1+.5*Math.sin(angle*n))
    }
    
}