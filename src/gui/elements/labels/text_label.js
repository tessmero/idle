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
        
    // set optional style 'tooltip', 'hud', 'tiny'
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
            drawText(g, ...p, label, this.center, new FontSpec(0, this.scale, true))
            
        } else if( this.style == 'hud' ){
            
            // draw extra readable for hud
            drawText(g, ...p, label, this.center, new FontSpec(this.letterPixelPad, this.scale, true))
            drawText(g, ...p, label, this.center, new FontSpec(0, this.scale, false))
            
        } else if( this.style == 'tiny' ){
            
            // should draw tiny 3x5 pixel font simple black text
            drawText(g, ...p, label, this.center, new FontSpec(0, this.scale, false))
            
        } else {
            
            // draw simple black text
            drawText(g, ...p, label, this.center, new FontSpec(0, this.scale, false))
        }
        
        if( global.debugUiRects ){
            
            // draw debug rectangle
            g.strokeRect(...rect)
        }
    }
    
    // implement GuiElement
    click(){
        //do nothing
    }
}