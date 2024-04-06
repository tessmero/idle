class CompoundGrabber extends Grabber {
    
    constructor(f=null){
        super(f)
        this.children = []
    }
    
    drawDebug(g){
        this.children.forEach(c => c.drawDebug(g))
    }
    
    // called periodically
    // set child member vars
    // do not add or remove children
    updateChildren(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // check if point in grab region
    // if so, return nearest edge location
    contains(x,y){
        for( let i = 0 ; i < this.children.length ; i++ ){
            let c = this.children[i]
            let hit = c.contains(x,y)
            if(hit){
                return hit
            }
        }
        return null
    }
}