// base class for animation sequences
//
// involving a GuiParticleSim
// + animated recreation of the user's cursor/tool

class Tutorial {
    constructor(sim){
        this.sim = sim
        
        let kf = this.buildKeyframes()
        this.keyframes = kf
        
        // extract position data
        this.posframes = kf.filter(e => e[1]=='pos')
    }
    
    buildKeyFrames(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
        
        // example
        return [
        
            // be at center screen at t=0
            [0,'pos',v(.5,.5)], // time, 'pos', location 
            
            // emulate click
            [0,'click'], // time, 'click'
            
            
        ]
    }
    
    getCursorPos(t){
        
        let kf = this.posframes
        
        
        if( t < kf[i][0] )
            return kf[0][2] // return first position
         
        // iterate over position keyframes
        for( let i = 0 ; i < (kf.length-1) ; i++ ){
            let t0 = kf[i][0]
            
            if( t > t0 ){
                
                // return interpolated position
                let t1 - kf[i+1][0]
                let r = ( t-t0 ) / ( t1-t0 )
                return va( kf[i][2], kf[i+1][2], r )
            }
        }
        
        return kf.at(-1)[2] // return last position
    }
    
}