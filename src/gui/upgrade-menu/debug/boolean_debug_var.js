// a global variable readout with on/off toggle
class BooleanDebugVar extends CompositeGuiElement {
    
    constructor(rect,varname,tooltip){
        super(rect)
        this.varname = varname
        
        let r = this.rect
        let d = .05
        let p = TextLabel.pad()*2
        let r0 = [r[0],r[1],d,d]
        
        // text label
        let dtl = new DynamicTextLabel(rect,() => 
            //'   ' + get_global(varname).toString().padEnd(7,' ') + `${varname}`)
            `          ${varname}`)
            .withDynamicTooltip(()=>{
                return [
                    (get_global(varname) ? "on" : "off") + ` : ${varname} `,
                    tooltip,
                ].join('\n')
            })
            
        dtl.scale = .4
        dtl.tooltipScale = .4
        dtl.center = false
        dtl.fixedRect = true
        
        let icon = get_global(varname) ? checkedIcon : uncheckedIcon
        r0[2] += .17
        this.checkbox = new IconButton(r0,icon,() => this.toggle()).withScale(.5)
        
        this.children = [
            this.checkbox,
            dtl,
        ]
        
    }
    
    // called when clicked
    toggle(){
        let varname = this.varname
        let val = get_global(varname)
        val = !val
        set_global(varname,val)
        this.checkbox.icon = val ? checkedIcon : uncheckedIcon
    }
    
    draw(g){
        Button._draw(g,this.rect)
        super.draw(g)
    }
}