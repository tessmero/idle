class SimpleRingReleasePattern extends ReleasePattern{
    
    constructor(...p){
        super(...p)
        
        this.done = false
    }
    
    // return a list of newly released particles
    // return empty list to wait
    // return null to finish
    update(t){ 
        if( this.done ) return null
        
        
        let x = this.x
        let y = this.y
        let r = this.r
        let s = global.fallSpeed
            
        let allp = []
        for( let i = 0 ; i < this.n ; i++ ){
            let a = rand()*twopi
            let vx = s*Math.cos(a)
            let vy = s*Math.sin(a)
            allp.push([x,y,vx,vy])
        }
        
        this.done = true
        return allp
    }
}