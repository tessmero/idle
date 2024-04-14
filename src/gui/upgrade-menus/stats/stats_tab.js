class StatsTab extends CompositeGuiElement {
    constructor(sr){
        super(sr)
        
        let r = padRect(...sr, -.05)
        
        //reassign or append to this.children
        if( global.bonusSummary ){
            let dy = .15
            r = [r[0],r[1],r[2],dy]
            global.bonusSummary.forEach(entry => {
                let [icon,summary] = entry
                this.children.push(new StatReadout(
                    [...r],icon,()=>summary).withScale(.4))
                r[1] += dy
            })
        }
    }
}