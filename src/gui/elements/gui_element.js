// base class for gui elements

// instances represent rectangles positioned on-screen
class GuiElement {

    constructor(rect){
        this.rect = rect
        this.hoverable = true
        this.scale = 1
    }
    
    withScale(s){
        this.scale = s
        return this
    }
    
    // set text to appear on hover
    withTooltip(s){
        this.tooltip = s
        return this
    }
    
    withDynamicTooltip(f){
        this.tooltipFunc = f
        return this
    }

    
    // override normal tooltip 
    // until user stops hovering
    setTemporaryTooltip(s){
        this.tempTooltip = s
        this.tempTooltipEndTime = global.t+1000 // millisecs
    }
    
    update(){
        
        // check if mouse is in this element's rectangle
        this.hovered = (this.hoverable && vInRect(global.mousePos,...this.rect))
        
        // reset temporary tooltip if necessary
        if( !this.hovered || (global.t>this.tempTooltipEndTime) ) this.tempTooltip = null
        
        // check if a tooltip should be shown
        if( this.hovered && (this.tempTooltip || this.tooltipFunc || this.tooltip) ){
            if( this.tempTooltip ) { 
                this.tooltip = this.tempTooltip
            } else if( this.tooltipFunc ) { 
                this.tooltip = this.tooltipFunc()
            }
            
            if( this.tooltip instanceof TooltipPopup ) {
                global.tooltipPopup = this.tooltip
                
            } else if( (typeof this.tooltip === 'string' || this.tooltip instanceof String) ){
            
                // build standard tooltip gui element
                let rect = LabelTooltipPopup.pickRect(this.tooltip,this.tooltipScale)
                rect = padRect( ...rect, TextLabel.pad() )
                global.tooltipPopup = new LabelTooltipPopup(rect,this.tooltip)
                if( this.tooltipScale ) global.tooltipPopup.scale = this.tooltipScale
                
            }
        }
    }

    draw(g){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }

    click(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}