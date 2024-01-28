class SpinPressurePattern extends PressurePattern {
    
    //get xy for given pressure 0-1
    getOffset(t,pressure) { 
        return vp(
            t*1e-2 + rand()*twopi,
            pressure * 1e-2
        )
    }
}