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
        let dtl = new DynamicTextLabel(rect,
            () => `     ${key}`)
            .withDynamicTooltip(()=>{
                let lvl = gutse.level
                let cost = gutse.cost.f(lvl)
                let curVal = gutse.value.f(lvl)
                let nextVal = gutse.value.f(lvl+1)
                let subject = gutse.subject 
                let budget = global.mainSim.particlesCollected
                return [
                    key,
                    `level ${lvl}: ${curVal}${subject}`,
                    `upgrade costs ${cost} raindrops`,
                    `-> level ${lvl+1}: ${nextVal}${subject}`,
                ].join('\n')
            }) 
        dtl.scale = .4
        dtl.tooltipScale = .4
        dtl.center = false
        dtl.fixedRect = true
        
        
        this.children = [
            dtl,
            
            // buttons
            new IconButton(r1,increaseIcon,()=>{
                
                let budget = global.mainSim.particlesCollected
                let lvl = gutse.level
                let cost = gutse.cost.f(lvl)
                if( cost > budget ){
                    return
                }
                
                gutse.level += 1
                updateAllBonuses()
            }),
        ]
        
    }
    
    
    
    draw(g){
        Button._draw(g,this.rect)
        super.draw(g)
    }
}