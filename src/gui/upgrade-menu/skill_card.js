// gui element representing a skill 
class SkillCard extends CompositeGuiElement {
    
    constructor(rect,tree,entry){
        super(rect)
        let r = this.rect
        let d = .05
        let p = (r[3]-d)/2
        let r0 = [r[0]+p,r[1]+p,d,d]
        let r1 = [r0[0]+d+p,r[1]+p,d,d]
        
        
        let sim = entry.skill.getPreviewSim()
        sim.rect = rect
        Array.from(sim.allBodies)[0].pos = v(...rectCenter(...rect))
        let gsp = new GuiSimPanel(rect,sim)
        
        let frac = .4
        let [x,y,w,h] = r
        let rr = [x+w*(1-.5*frac),y+h*(1-.5*frac),w*frac,h*frac]
        
        let icon = lockIcon
        let tooltip = ''
        if( entry.status == 'locked' ){
            icon = lockIcon
            let required = tree.specs[entry.requires].skill.name
            tooltip = `locked\nrequires: ${required}`
            rr = padRect(x,y,w,h,-h/8)
        } else if( entry.status == 'available' ){
            icon = uncheckedIcon
            tooltip = `available`
            //if( entry.precludes ){
            //    let precluded = tree.specs[entry.precludes].skill.name
            //    tooltip += `\nprecludes: ${precluded}`
            //}
        } else if( entry.status == 'purchased' ){
            icon = checkedIcon
            tooltip = `purchased`
        }
        tooltip = `skill: ${entry.skill.name}\n${tooltip}`
        let statusIcon = new IconButton(rr,icon,()=>{}).withScale(.3).withTooltip(tooltip)
        gsp.tooltip = tooltip
        
        
        this.children = [
            gsp,
            statusIcon,
        ]
        
    }
    draw(g){
        Button._draw(g,this.rect) // draw button outline
        super.draw(g) // draw children
    }
}