const _allTutorialSims = {}

// base class for animation sequences
//
// involving a GuiParticleSim
// + animated recreation of the user's cursor/tool
class Tutorial {
    constructor(){        
        let kf = this.buildKeyframes()
        this.keyframes = kf
        this.t = 0
        
        let grabRad = global.mouseGrabRadius * global.tutorialToolScale
        let t = new DefaultTool(null,grabRad)
        this.defaultTool = t
        this.primaryTool = t
        this.tool = t
        
        // extract cursor position data
        this.cursorPosKeyframes = kf.filter(e => e[1]=='pos')
    }
    
    getSim(){
        let clazz = this.constructor.name
        if(!( clazz in _allTutorialSims )){
            _allTutorialSims[clazz] = this.buildSim(...global.tutorialSimDims)
        }
        return _allTutorialSims[clazz]
    }
    
    // should only be called in getSim() ^
    buildSim(w,h){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
        
        // example
        let sim = new TutorialPSim()        
        return sim
    }
    
    buildKeyFrames(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
        
        // example
        return [
        
            // be at center at t=0
            [0,'pos',v(.5,.5)], // time, 'pos', location 
            
            // emulate drag
            [100,'down'], // time, 'down'
            [200,'up'], // time, 'up'
        
            // end up at right side
            [300,'pos',v(1,.5)],
            
            
        ]
    }
    
    update(dt){
        
        // advance clock
        let t0 = this.t
        this.t += dt
        
        // return list of events since last update
        let t1 = this.t
        return this.keyframes.filter(k => (k[0] > t0) && (k[0] <= t1))
    }
    
    getCursorPos(){
        
        let t = this.t
        let kf = this.cursorPosKeyframes
        
        
        if( t < kf[0][0] )
            return kf[0][2] // return first position
         
        // iterate over position keyframes
        for( let i = 1 ; i < kf.length ; i++ ){
            let t1 = kf[i][0]
            
            if( t < t1 ){
                
                // return interpolated position
                let t0 = kf[i-1][0]
                let r = ( t-t0 ) / ( t1-t0 )
                return va( kf[i-1][2], kf[i][2], r )
            }
        }
        
        
        this.t = 0
        this.wasReset = true
        return kf.at(-1)[2] // return last position
    }
    
}