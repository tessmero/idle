class Gui {
    
    constructor(){
        this.clickableElements = []
    }
    
    // build list of GuiElement instances
    buildElements(){ throw new Error('not implemented') }
    
    draw(g){
        this.clickableElements.forEach(e => e.draw(g))
    }
    
    update(dt){
        this.clickableElements.forEach(e => e.update())
    }
    
    click(){
        return this.clickableElements.some( e => 
            e.rect && vInRect(global.mousePos,...e.rect) && !e.click() )
    }
    
    // hooks called in game_states.js
    open(){}
    close(){}
}