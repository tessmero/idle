class UpgradesTab extends CompositeGuiElement {
    constructor(sr){
        super(sr)
    
        //let sc = global.screenCorners
        //let sr = global.screenRect
        let m = .05
        let w = sr[2]-2*m
        let h = .05
        let r0 = [sr[0]+m,sr[1]+m*2, w,h]
        
        let specs = global.upgradeTracks.state
        this.children = Object.keys(specs).map( key => {
            let agvRect = r0
            r0 = [...r0]
            r0[1] += r0[3]
            return new StatUpgrader(agvRect,key)
        })
    }
}