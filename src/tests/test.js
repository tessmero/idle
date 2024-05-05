const _allTestSims = {}

class Test {
    
    getSim(){
        let clazz = this.constructor
        if(!( clazz in _allTestSims )){
            _allTestSims[clazz] = this.buildSim()
        }
        return _allTestSims[clazz]
    }
    
    buildSim(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`)
    }
    
    getTitle(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`)
    }
    
    getDuration(){
        return 100+this.getTestAssertions().at(-1)[0] // time of last assertion
    }
    
    getTestAssertions(sim){
        throw new Error(`Method not implemented in ${this.constructor.name}.`)
    }
    
    getTutorial(){
        return null
    }
    
    static anglesEqual(a,b){
        let diff = Math.abs(cleanAngle(a-b))
        return diff < 1e-2 // radians
    }
    
    static vectorsEqual(a,b,epsilon=1e-2){
        let d = a.sub(b)
        return d.getMagnitude() < epsilon
    }
    
    //get relative position
    // return value  v(.5,.5) means center of sim
    static relPos(sim,actualPos){
        let r = sim.rect
        return v(
            (actualPos.x-r[0])/r[2],
            (actualPos.y-r[1])/r[3]
        )
    }
}