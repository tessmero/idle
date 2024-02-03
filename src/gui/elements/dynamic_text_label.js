// a line of text that may change
class DynamicTextLabel extends TextLabel {
    
    constructor(rect,labelFunc){
        super(rect,'')
        this.labelFunc = labelFunc
    }
    
    draw(g){
        
        // get updated label
        this.label = this.labelFunc()
        
        super.draw(g)
    }
}