class SpinPressurePattern extends PressurePattern {
    
    //get xy for given pressure 0-1 for pois of radius r
    getOffset(t,r, pressure) { 
        return vp(
            t*1e-2 + rand()*twopi,
            r * pressure * .2
        )
    }
}