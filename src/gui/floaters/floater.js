// base class for temporary visual elements
// text that floats upwards and then dissolves

class Floater{
    
    constructor( pos, label ){
        this.pos = pos
        this.label = label
        this.remainingTime = 1000
    }
    
    update(dt){
        this.pos = this.pos.sub(v(0,1e-4*dt))
        this.remainingTime -= dt
        return (this.remainingTime > 0)
    }
    
    draw(g){
        let center = true
        let letterPixelPad = .002
        let scale = .3
        let label = this.label
        let p = this.pos.xy()
        
        drawText(g, ...p, label, center, letterPixelPad, scale, true)
        drawText(g, ...p, label, center, 0, scale, false)
    }
    
    
}
