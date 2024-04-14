// a stat readout with button to upgrade
// modifies one entry in global.upgradeTracks.state
class StatUpgrader extends CompositeGuiElement {
    
    // key should exist in global.upgradeTracks.state
    constructor(rect,key){
        super(rect)
        this.key = key
        let gutse = global.upgradeTracks.state[key]
        this.gutse = gutse
        
        let r = this.rect
        let sl = Math.min(r[2],r[3])
        r = [r[0],r[1],sl,sl]
        let d = .05
        let p = (r[3]-d)/2
        let r0 = [r[0]+p,r[1]+p,d,d]
        let r1 = [r0[0]+d+p,r[1]+p,d,d]
        
        
        // upgrade button
        let buttonWidth = .15
        let rbutton = padRect(r[0],rect[1],buttonWidth,r[3],-global.lineWidth*2)
        let btn = new TextButton(rbutton,'upgrade',()=>this.upgradeButtonClicked(gutse)).withScale(.3)
        
        // upgrade cost progress indicator
        // overlay on upgrade button
        let btno = new ProgressIndicator(rbutton,()=> {
                let budget = global.mainSim.particlesCollected
                let cost = gutse.cost.f(gutse.level-1)
                return budget/cost
            }).withOutline(false)
        
        // visual progression display 
        let displayWidth = .4
        let rdisp = padRect(r[0]+buttonWidth,r[1],displayWidth,rect[3],0)
        this.progressDisplayRect = rdisp 
        
        // text label
        let dx = .02 + buttonWidth + displayWidth
        let rlabel = [r[0] + dx,r[1],r[2]-dx,r[3]]
        let dtl = new StatReadout(rlabel,gutse.icon,
            () => `${key}`)
            .withDynamicTooltip(() => this.buildStatUpgradeTooltip()) 
        dtl.scale = .4
        dtl.tooltipScale = .4
        dtl.center = false
        dtl.fixedRect = true
        
        
        this.children = [
            btn,btno,dtl,
        ]
    }
    
    tooltipFunc(){
        let key = this.key
        let gutse = this.gutse
        let lvl = gutse.level
        let cost = gutse.cost.f(lvl-1)
        let curVal = gutse.value.f(lvl-1)
        let nextVal = gutse.value.f(lvl)
        let subject = gutse.subject 
        let budget = global.mainSim.particlesCollected
        return [
            key,
            `level ${lvl}: ${curVal}${subject}`,
            `upgrade costs ${cost} raindrops`,
            `-> level ${lvl+1}: ${nextVal}${subject}`,
        ].join('\n')
    }
    
    upgradeButtonClicked(gutse){
        let budget = global.mainSim.particlesCollected
        let lvl = gutse.level
        let cost = gutse.cost.f(lvl-1)
        if( cost > budget ){
            this.setTemporaryTooltip('collect more raindrops!')
            return
        }
        if( lvl >= gutse.maxLevel ){
            this.setTemporaryTooltip('max level!')
            return
        }
        
        global.mainSim.particlesCollected -= cost
        Floater.signalChange(null,global.mousePos,-cost)
        gutse.level += 1
        updateAllBonuses()
        this.setTemporaryTooltip('upgrade purchased!')
    }
    
    draw(g){
        Button._draw(g,this.rect)
        super.draw(g)
        
        let gutse = this.gutse
        let r = this.progressDisplayRect
        let pad = .01
        let sl = r[3] - pad*2//box size
       
        let x = r[0]+pad
        let y = r[1]+pad
        let dx = sl+pad
       
        // draw progression display boxes
        g.strokeStyle = global.fgColor
        g.fillStyle = global.fgColor
        g.lineWidth = global.lineWidth
        for( let i = 0 ; i < gutse.maxLevel ; i++ ){
            let box = [x+i*dx,y,sl,sl]
            if( i<gutse.level ){
                g.fillRect(...box)
            } else {
                g.strokeRect(...box)
            }
        }
    }
}