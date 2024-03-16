// a global variable readout with buttons to increase and decrease
class ScalarDebugVar extends CompositeGuiElement {
    
    constructor(rect,varname,inc,tooltip){
        super(rect)
        let r = this.rect
        let d = .05
        let p = (r[3]-d)/2
        let r0 = [r[0]+p,r[1]+p,d,d]
        let r1 = [r0[0]+d+p,r[1]+p,d,d]
        
        // text label
        let dtl = new DynamicTextLabel(rect,() => 
            '     ' + Math.floor(get_global(varname)/inc).toString().padEnd(5,' ') + `${varname}`)
            .withDynamicTooltip(()=>{
                return [
                    Math.floor(get_global(varname)/inc).toString() + ` : ${varname} `,
                    tooltip,
                    'shift-click for 10x',
                    'ctrl-click for 100x',
                ].join('\n')
            }) // tooltip
        dtl.scale = .4
        dtl.tooltipScale = .4
        dtl.center = false
        dtl.fixedRect = true
        
        
        this.children = [
            dtl,
            
            // buttons
            new IconButton(r0,decreaseIcon,()=>{
                let m = 1
                if( global.shiftHeld ) m = 10
                if( global.controlHeld ) m = 100
                let val = get_global(varname)
                val-=m*inc
                set_global(varname,val)
            }),
            new IconButton(r1,increaseIcon,()=>{
                let m = 1
                if( global.shiftHeld ) m = 10
                if( global.controlHeld ) m = 100
                let val = get_global(varname)
                val+=m*inc
                set_global(varname,val)
            }),
        ]
        
    }
    draw(g){
        Button._draw(g,this.rect)
        super.draw(g)
    }
}