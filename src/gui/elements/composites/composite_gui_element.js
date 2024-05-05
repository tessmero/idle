// base class for gui elements that contain "children" gui elements
class CompositeGuiElement extends GuiElement {

    constructor(rect){
        super(rect)
        this.children = []
        this.opaque = false
    }
    
    withOpacity(o){
        this.opaque = o
        return this
    }
    
    update(dt, disableHover=false){
        let hovered = super.update(dt, disableHover)
        let result = this.opaque && this.hovered
        this.children.forEach(e=> result = result | e.update(dt, disableHover))
        return result
    }
    draw(g){
        if( this.opaque ) Button._draw(g,this.rect)
        this.children.forEach(e=>e.draw(g))
    }
    
    click(){        
        if( this.children.some( e => vInRect(global.mousePos,...e.rect) 
                && e.click()))
            return true
            
        if( this.opaque && vInRect(global.mousePos,...this.rect) ){
            //console.log( 'clicked opaque composite elemnt background' )
            return true
        }
    }
}