// a line of text that may change
class DynamicTextLabel extends TextLabel {
    
    constructor(rect,labelFunc){
        super(rect,'')
        this.labelFunc = labelFunc
    }
    
    withAutoAdjustRect(a){
        this.autoAdjustRect = a
        return this
    }

    
    draw(g){
        
        // get updated label
        this.label = this.labelFunc()
        
        if( this.autoAdjustRect ){
            // update bounding rectangle to fit label
            let [w,h] = getTextDims(this.label, this.scale)
            this.rect[2] = w+this.pad*2
            this.rect[3] = h+this.pad*2
        }
        
        super.draw(g)
    }
}