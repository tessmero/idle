class Gui {
    
    constructor(){
        this.clickableElements = []
        //clickableElements populated in game_states.js
    }
    
    // build list of GuiElement instances
    buildElements(){ throw new Error('not implemented') }
    
    draw(g){
        this.clickableElements.forEach(e => e.draw(g))
    }
    
    update(){
        this.clickableElements.forEach(e => e.update())
    }
}