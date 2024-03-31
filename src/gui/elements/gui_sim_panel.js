// container that displays a particle simulation
// 
class GuiSimPanel extends Button {
    constructor(rect,sim){
        super(rect)
        this.sim = sim
    }
    
    update(dt){
        super.update(dt)
        this.sim.update(dt)
        
        if( this.tut ) this.tut.update(dt)
    }
    
    draw(g){
        super.draw(g)
        
        //g.rect(...this.rect)
        //g.clip()
        this.sim.draw(g)
        //g.restore()
        
        let [x,y,w,h] = this.rect
        let p = .01
        //g.clearRect(x+w,y-p,w,h+2*p)
        //g.clearRect(x-w,y-p,w,h+2*p)
        
        
        // draw cursor like in draw.js
        if( this.tut ){
            
            let tool = new DefaultTool()
            
            let p = this.tut.getCursorPos().xy()
            let sr = this.sim.rect
            let off = this.sim.drawOffset
            p = [ p[0]*sr[2] + off[0], p[1]*sr[3] + off[1] ]
            g.fillStyle = global.backgroundColor
            tool.drawCursor(g,p,.01,false)
            g.fillStyle = global.lineColor
            tool.drawCursor(g,p,0,false)
            
            // draw tool overlay if applicable
            if( tool.draw ){
                tool.draw(g)
            }
        }
    }
    
    click(){}
}