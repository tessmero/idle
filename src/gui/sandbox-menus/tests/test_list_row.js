class TestListRow extends CompositeGuiElement {
    constructor(rect,test,testIndex){
        super(rect)
        this.test = test
        this.testIndex = testIndex
        
        //rect = padRect(...rect, -.01)
        
        this.children = [
            new Button(rect,()=>this.clicked()),
            new StatReadout(rect,playIcon,() => test.getTitle())
                    .withScale(.4)
        ]
    }
    
    clicked(){
        // position context menu on bottom/right
        let rects = ContextMenu.pickRects(global.screenRect,v(.1,.1))
        global.contextMenu = new TestContextMenu(...rects,this.test,this.testIndex)
    }
}