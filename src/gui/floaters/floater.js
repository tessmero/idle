// base class for temporary visual elements
// text that floats upwards and then dissolves

var _floaterFontSpecs = null

class Floater{
    
    constructor( pos, label ){
        this.pos = pos
        this.label = label
        this.duration = 1000
        this.remainingTime = this.duration
        
        // seed for dissolving effect rng
        this.rngSeed = randomSeed()

        if( !_floaterFontSpecs ){
            let letterPixelPad = .002
            let scale = .3
            _floaterFontSpecs = [
                new DissolvingFontSpec(letterPixelPad, scale, true),
                new DissolvingFontSpec(0, scale, false),
            ]
        }
    }
    
    update(dt){
        this.pos = this.pos.sub(v(0,1e-4*dt))
        this.remainingTime -= dt
        return (this.remainingTime > 0)
    }
    
    draw(g){
        let center = true
        let label = this.label
        let p = this.pos.xy()
        
        let r = (this.remainingTime / this.duration)
        let dissolveStart = .5
        let sld = (r+dissolveStart)
        if( sld < 1 ) sld *= (1-dissolveStart)
        
        resetRand(this.rngSeed)
        _floaterFontSpecs.forEach( fs => {
            fs.solidity = sld
            drawText(g, ...p, label, center, fs)
        })
    }
    
    static signalChange(sim,pos,amt){
        if( !amt ) return
        let label = Math.round(amt).toString()
        if( amt>0 ) label = ('+'+label)
        let floaters = global.floaters
        if( sim ) floaters = sim.floaters
        floaters.push( new Floater(pos,label))
    }
}
