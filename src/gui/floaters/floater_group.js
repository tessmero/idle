// base class for temporary visual elements
// text that floats upward and dissolve

var _floaterFontSpecs = null

class FloaterGroup {
    
    // allocate group with 
    // maximum of n floaters
    constructor(n){
        this.n = n
        
        // prepare to keep track of up to 
        // n floaters with 3 props (x,y,remaining time)
        const ndims = 3
        this.ndims = ndims
        this.state = new Float32Array(n*ndims); 
        
        // lifetime for a single floater
        this.duration = 1000
        
        // prepare to keep track of up to
        // n label strings
        this.labels = new Array(n).fill('')
        
        // looping index of next floater to spawn
        this.spawnIndex = 0
        
        // rng for dissolving effect
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
    
    
    spawnFloater(pos,label){
        
        // pick address and advance for next call
        let si = this.spawnIndex
        this.spawnIndex = (si+1) % this.n
        
        // spawn new floater
        this.labels[si] = label
        let st = this.state
        let i = si * this.ndims
        st[i+0] = pos.x
        st[i+1] = pos.y
        st[i+2] = this.duration // duration
    }
    
    draw(g){
            
        // comput ellapsed time
        // since last draw
        let t = global.t
        if( !this.lastT ) this.lastT = t
        let dt = t-this.lastT
        this.lastT = t
            
        //
        let activeCount = 0
        let center = true
        let st = this.state
        let seed = [...this.rngSeed] 
        for( let i = 0 ; i < this.n ; i++ ){
                
            // advance distinct rng for each floater
            seed = seed.map(v => v+1)
            resetRand(seed)
                
            // lookup state for one floater
            let j = i*this.ndims
            let remainingTime = st[j+2]
            if( remainingTime <= 0 ) continue
            activeCount += 1
            let label = this.labels[i]
            let x = st[j+0]
            let y = st[j+1]
            
            // advance one floater
            st[j+1] = y - 1e-4*dt // move up
            st[j+2] = remainingTime - dt // dissolve
            
            
            // draw one floater
            let r = (remainingTime / this.duration)
            let dissolveStart = .5
            let sld = (r+dissolveStart)
            if( sld < 1 ) sld *= (1-dissolveStart)
            _floaterFontSpecs.forEach( fs => {
                fs.solidity = sld
                drawText(g, x,y, label, center, fs)
            })
        }
        
        this.activeCount = activeCount
    }
    
    static signalChange(sim,pos,amt){
        if( !amt ) return
        let label = Math.round(amt).toString()
        if( amt>0 ) label = ('+'+label)
        let floaters = global.floaters
        if( sim ) floaters = sim.floaters
        floaters.spawnFloater(pos,label)
    }
}
