// a stat readout with buttons to increase and decrease
class AdjustableGlobalVar extends DynamicTextLabel {
    
    constructor(rect,varname,inc){
        super(rect,() => 
            '        ' + Math.floor(global[varname]/inc).toString().padEnd(8,' ') + `${varname}`)
        
        
        let r = this.rect
        let d = .05
        let p = (r[3]-d)/2
        let r0 = [r[0]+p,r[1]+p,d,d]
        let r1 = [r0[0]+d+p,r[1]+p,d,d]
        
        this.children = [
            new IconButton(r0,decreaseIcon,()=>{global[varname]-=inc}),
            new IconButton(r1,increaseIcon,()=>{global[varname]+=inc}),
        ]
        
        // disable changing dimensions in dynamic_text_label.js
        this.fixedRect = true
        
        // text drawing settings
        this.scale = .5
        this.center = false
        
    }
    
    update(){
        super.update()
        this.children.forEach(e=>e.update())
        
    }
    draw(g){
        Button._draw(g,this.rect)
        super.draw(g)
        this.children.forEach(e=>e.draw(g))
    }
    
    click(){
        return this.children.some( e => 
            e.rect && vInRect(global.mousePos,...e.rect) && !e.click() )
    }
}