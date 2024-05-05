// base class for pixel art icon layouts which may be animated


// icon instances are singletons
class Icon {
    
    // frames is a list of layouts like text characters (gui/characters.js)
    constructor(frames){
        this.frames = frames
        
        //debug
        //console.log(`icon constructed ${this.constructor.name}`)
    }
    
    getCurrentAnimatedLayout(){
        let n = this.frames.length
        let i = Math.floor(global.t / global.baseAnimPeriod) % n
        return this.frames[i]
    }
}