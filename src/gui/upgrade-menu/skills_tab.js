function buildSkillsTabContent(sr){
    
    let tree = new SkillTree()
    
    let result = [new SkillTreeGraph(sr,tree)]
    let w = .1
    let h = .1
    
    for (const [key,entry] of Object.entries(tree.specs)) {
        let [x,y] = entry.pos
        let rect = [x-w/2,y-h/2,w,h]
        let card = new SkillCard(rect,tree,entry)
        card.status = entry.status
        result.push( card )
    }
    
    
    return result
}