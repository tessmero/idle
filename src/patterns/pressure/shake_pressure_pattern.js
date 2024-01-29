class ShakePressurePattern extends PressurePattern {
    
    constructor(){
        super()
    }
    
    //get xy for given pressure 0-1
    getOffset(t,r, pressure) { 
        return vp(
            rand()*twopi,
            r * pressure * 1e-1 * Math.sin(t*1e-2 + rand()*twopi)
        )
    }
}