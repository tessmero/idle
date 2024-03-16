// a stat readout with button to upgrade
// modifies one entry in global.upgradeTracks.state
class StatUpgrader extends CompositeGuiElement {
    
    // key should exist in global.upgradeTracks.state
    constructor(rect,key){
        super(rect)
        let r = this.rect
        let d = .05
        let p = (r[3]-d)/2
        let r0 = [r[0]+p,r[1]+p,d,d]
        let r1 = [r0[0]+d+p,r[1]+p,d,d]
        
        let gutse = global.upgradeTracks.state[key]
        
        // text label
        let dtl = new DynamicTextLabel(rect,() => 
            `${key}`)
            .withDynamicTooltip(()=>{
                return [
                    key,
                    `${gutse.level} -> ${gutse.level+1}`,
                ].join('\n')
            }) // tooltip
        dtl.scale = .4
        dtl.tooltipScale = .4
        dtl.center = false
        dtl.fixedRect = true
        
        
        this.children = [
            dtl,
            
            // buttons
            new IconButton(r1,increaseIcon,()=>{
                gutse.level += 1
            }),
        ]
        
    }
    
    
    
    draw(g){
        Button._draw(g,this.rect)
        super.draw(g)
    }
}