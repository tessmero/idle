// container that displays a particle simulation
// 
class GuiSimPanel extends GuiElement {
    constructor(rect,sim){
        super(rect)
        this.sim = sim
        let r = this.rect
        sim.drawOffset = [r[0]-sim.rect[0],r[1]-sim.rect[1]]
        this.paused = false
        this.loop = true
    }
    
    reset(){
        this.sim.reset()
        let tut = this.tut
        if( tut ){
            tut.t = 0
            tut.finished = false
        }
    }
    
    update(dt,disableHover){
        let hovered = super.update(dt,disableHover)
        
        if( this.paused ) return
            
        this.sim.update(dt)
        
        let tut = this.tut
        if( tut ){

            if( tut.finished ){
                if( this.loop ){
                    this.reset()
                } else {
                    return
                }
            }
            
            let tool = tut.tool
            tool.sim = this.sim
            this.sim.setTool(tool)
            tool.update(dt)
            let keyframes = tut.update(dt)
            let p = tut.getCursorPos().xy()
            let sr = this.sim.rect
            p = v(p[0]*sr[2] , p[1]*sr[3])
            
            // emulate user input if necessary
            // (tutorial.js)
            keyframes.forEach(event => {
                if( event[1] == 'down' ) tool.mouseDown(p)
                if( event[1] == 'up' ) tool.mouseUp(p)
                if( event[1] == 'primaryTool' ) tut.tool = tut.primaryTool
                if( event[1] == 'defaultTool' ) tut.tool = tut.defaultTool
            })
            
            // like update.js
            // update control point hovering status
            this.sim.updateControlPointHovering(p)
        }
        
        return hovered
    }
    
    draw(g){
        
        g.clearRect(...this.rect)
        
        this.sim.draw(g)
        
        // trim sides
        let [x,y,w,h] = this.rect
        let m = w*.1
        h += .002
        y -= .001
        g.clearRect( x-m, y, m, h )
        g.clearRect( x+w, y, m, h )
        g.strokeStyle = global.colorScheme.fg
        g.lineWidth = global.lineWidth
        g.strokeRect(...this.rect)
        
        
        
        if( this.tut ){
            
            // draw cursor like in draw.js
            let tut = this.tut
            let tool = tut.tool
            tool.sim = this.sim
            let p = tut.getCursorPos().xy()
            let sr = this.sim.rect
            p = [p[0]*sr[2] , p[1]*sr[3]]
            if( tut.lastCursorPos ){
                let lp = tut.lastCursorPos
                if( (p[0]!=lp[0]) || (p[1]!=lp[1]) ){
                    tool.mouseMove(v(...p))
                }
            } else {
                tut.lastCursorPos = p
            }
            
            // pos in sim -> real screen pos
            let off = this.sim.drawOffset
            p = [p[0]+off[0], p[1]+off[1]]
            tool.drawCursor(g,p,global.tutorialToolScale,false)
            
            // draw tool overlay if applicable
            if( tool.draw ){
                g.translate(...off)
                tool.draw(g)
                g.translate(-off[0],-off[1])
            }
        }
    }
    
    click(){}
}