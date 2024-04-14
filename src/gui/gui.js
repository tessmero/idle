// top-level gui group e.g. the start menu
class Gui extends CompositeGuiElement{
    
    constructor(){
        super(global.screenRect)
    }
    
    // build list of GuiElement instances
    buildElements(){ 
        throw new Error(`Method not implemented in ${this.constructor.name}.`)
    }
    
    // hooks called in game_states.js
    open(){}
    close(){}
}