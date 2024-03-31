// container that displays a particle simulation
// 
class GuiSimPanel extends GuiElement {
    constructor(rect,sim){
        super(rect)
        this.sim = sim
    }
    
    update(dt){
        super.update(dt)
        this.sim.update(dt)
        
        let tut = this.tut
        if( tut ){
            let tool = tut.tool
            tool.sim = this.sim
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

            if( tut.wasReset ){
                this.sim.clearBodies()
                tut.wasReset = false
            }
        }
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
        g.strokeRect(...this.rect)
        
        
        
        if( this.tut ){
            
            // draw cursor like in draw.js
            let tut = this.tut
            let tool = tut.tool
            let p = tut.getCursorPos().xy()
            let sr = this.sim.rect
            p = [p[0]*sr[2] , p[1]*sr[3]]
            console.log(p)
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
                tool.draw(g)
            }
        }
    }
    
    click(){}
}