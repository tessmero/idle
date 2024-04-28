// context menu (and reticle effect) 
// that appears when a body is clicked 
class BuddyContextMenu extends BodyContextMenu {
    constructor(rect,s0,s1,buddy){
        super(rect,s0,s1,buddy.getMainBody())
        this.buddy = buddy
        
        let stats = [
            'level: 1',
            'collected: 10',
        ]
        stats = stats.join('\n')
        let statScale = .2
        
        
        // divide content squares into rows
        let topRows = divideRect(...s0,4,true)
        let botRows = divideRect(...s1,4,true)
        
        this.children = this.children.concat([
        
            new StatReadout(botRows[0],collectedIcon,() => 
                buddy.particlesCollected.toString())
                .withStyle('hud')
                .withDynamicTooltip(() => `${buddy.particlesCollected} rain drops collected`)
                .withAutoAdjustRect(true)
        ])
    }
}