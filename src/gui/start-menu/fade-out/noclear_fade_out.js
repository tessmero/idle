// black grid gradually covers start menu
class NoclearFadeOut extends FadeOut {
    constructor(){
        super()
        this.duration = 5000
    }
    
    // overide FadeOut
    stopCanvasClear(){
        return true
    }
    
    // implement FadeOut
    draw(g){
        // do nothing
    }
}