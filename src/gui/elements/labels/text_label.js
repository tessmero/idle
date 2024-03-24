// a line of unchanging on-screen text
class TextLabel extends GuiElement {
    constructor(rect,label){
        super(rect)
        
        this.rect = rect
        this.label = label
        this.scale = 1
        this.pad = this.constructor.pad()
        this.letterPixelPad = this.constructor.letterPixelPad()
        this.center = true
    }
        
        
    // default vals
    static pad(){ return .005 }
    static letterPixelPad(){ return .005 }
        
    // set optional style 'tooltip' or 'hud'
    withStyle(s){
        this.style = s
        return this
    }
    
    withCenter(c){
        this.center = c
        return this
    }
    
    withScale(s){ 
        this.scale = s
        return this
    }
    
    withLetterPixelPad(p){
        this.letterPixelPad = p
        return this
    }
    
    withPad(p){
        this.pad = p
        return this
    }
    
    // implement GuiElement
    draw(g){
        let rect = this.rect
        let label = this.label
        
        let p
        if( this.center ){
            p = rectCenter(...rect)
        } else {
            p = [rect[0] + this.pad, rect[1] + this.pad + this.scale*global.textPixelSize]
        }
        
        if( this.style == 'inverted' ){
            
            // draw simple white text
            drawText(g, ...p, label, this.center, 0, this.scale, true)
            
        } else if( this.style == 'hud' ){
            
            // draw extra readable for hud
            drawText(g, ...p, label, this.center, this.letterPixelPad, this.scale, true)
            drawText(g, ...p, label, this.center, 0, this.scale, false)
            
        } else {
            
            // draw simple black text
            drawText(g, ...p, label, this.center, 0, this.scale, false)
        }
    }
    
    // implement GuiElement
    click(){
        //do nothing
    }
}