// base class for top-level gui groups
// e.g. the start menu
class Gui extends CompositeGuiElement{
    
    constructor(){
        super(global.screenRect)
    }
    
    // build list of GuiElement instances
    buildElements(){ 
        throw new Error(`Method not implemented in ${this.constructor.name}.`)
    }
    
    // return Gui instance to draw behind this
    // e.g. draw hud behind upgrade menu
    getBackgroundGui(){
        return null
    }
    
    // return true to prevent clearing in draw.js
    // used for some start menu transition animations
    stopCanvasClear(){
        return false
    }
    
    // hooks called in game_states.js
    open(){}
    close(){}
}