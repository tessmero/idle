class SkillsTab extends CompositeGuiElement {
    constructor(sr){
        super(sr)
    
        let tree = global.skillTree
        
        let result = [new SkillTreeGraph(sr,tree)]
        let w = .1
        let h = .1
        
        for (const [key,entry] of Object.entries(tree.state)) {
            let [x,y] = entry.pos
            let rect = [x-w/2,y-h/2,w,h]
            let card = new SkillCard(rect,tree,entry)
            card.status = entry.status
            result.push( card )
        }
        
        this.children = result
    }
}