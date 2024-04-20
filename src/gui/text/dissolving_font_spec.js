// specification for drawing single layer
// of   some specific text on screen
class DissolvingFontSpec extends FontSpec {
    constructor(...p){
        super(...p)
    
        this.solidity = 1 // 0 = fully dissolved
    }
    
    withSolidity(s){
        this.solidity = s
        return this
    }
    
    //override FontSpec
    // skip drawing some pixels
    skipPixel(){
        return rand() > this.solidity
    }
}