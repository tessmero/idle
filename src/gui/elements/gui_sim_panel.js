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
    }
    
    draw(g){
        super.draw(g)
        
        //g.rect(...this.rect)
        //g.clip()
        this.sim.draw(g)
        //g.restore()
        
        let [x,y,w,h] = this.rect
        let p = .01
        g.clearRect(x+w,y-p,w,h+2*p)
        g.clearRect(x-w,y-p,w,h+2*p)
    }
    
    click(){}
}