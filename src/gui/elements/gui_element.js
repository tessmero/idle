class GuiElement {

    constructor(rect){
        this.rect = rect
        this.hoverable = true
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
            let anchorPoint = TooltipPopup.pickMouseAnchorPoint()
            let rect = TooltipPopup.pickTooltipRect(anchorPoint,this.tooltip)
            global.tooltipPopup = new TooltipPopup(rect,this.tooltip)
        }
    }

    draw(g){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }

    click(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}