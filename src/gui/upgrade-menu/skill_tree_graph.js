class SkillTreeGraph extends GuiElement {
    
    constructor(rect,tree){
        super(rect)
        this.tree = tree
    }
    
    
    draw(g){
        g.beginPath()
        let specs = this.tree.specs
        for (const [key,entry] of Object.entries(specs)) {
            if( !entry.requires ) continue
            
            let pos = entry.pos
            let rpos = specs[entry.requires].pos
            g.moveTo(...pos)
            g.lineTo(...rpos)
        }
        g.stroke()
    }
    
    click(){}
}