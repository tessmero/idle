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

    update(){
        
        // check if mouse is in this element's rectangle
        this.hovered = (this.hoverable && vInRect(global.mousePos,...this.rect))
        
        if( this.hovered && (this.tooltipFunc || this.tooltip) ){
            
            if( this.tooltipFunc ) this.tooltip = this.tooltipFunc()
            
            // build new tooltip gui element
            let rect = LabelTooltipPopup.pickRect(this.tooltip,this.tooltipScale)
            rect = padRect( ...rect, TextLabel.pad() )
            global.tooltipPopup = new LabelTooltipPopup(rect,this.tooltip)
            if( this.tooltipScale ) global.tooltipPopup.scale = this.tooltipScale
        }
    }

    draw(g){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }

    click(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}