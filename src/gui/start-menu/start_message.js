// message appears in the middle of the
// (start menu -> playing) transition sequence
class StartMessage extends StartAnimStage {
    
    constructor(){
        super()
        
        // durations of segments
        let sd = [
            500,//0 black screen
            200,//1 text fades in
            2000,//2 text readable
            500,//3 text fades out
            0,//4 black screen
        ]
        
        // compute start time for each segment
        // compute total duration
        let total = 0
        let sst = []
        for( let i = 0 ; i < sd.length ; i++ ){
            sst[i] = total
            total += sd[i]
        }
        this.segDurations = sd
        this.segStartTimes = sst
        this.duration = total
        
        this.text = randChoice([
            "you are the raincatcher",
        ])
        
        let scale = .6
        this.fontSpec = new DissolvingFontSpec(0, scale, true)
        
    }
    
    
    // override 
    draw(g){
        
        
        // black background
        let sr = global.screenRect
        g.fillStyle = global.fgColor
        g.fillRect(...sr)
        
        // draw text
        let sld = this.pickTextSolidity()
        if( sld > 0 ){
            let label = this.text
            let center = true
            this.fontSpec.solidity = sld
            drawText(g, .5,.5, label, center, this.fontSpec )
        }
    }
    
    pickTextSolidity(){
        
        // identify which animation segment we are in
        let t = this.t
        let sst = this.segStartTimes
        let sd = this.segDurations
        let currentSegIndex = -1 + sst.findIndex( st => st > t )
        let r = (t-sst[currentSegIndex]) / sd[currentSegIndex]
    
        switch(currentSegIndex){
            case 1: 
                return r // text appearing
            
            case 2: 
                return 1 // text readable
            
            case 3: 
                return 1-r // text disappearing
            
            default: 
                return 0 // black screen
        }
    }
}