// a button in the toolbar with a pixel art icon
class ToolbarButton extends CompositeGuiElement {
    
    constructor(rect,tool,indexInToolbar){
        super(rect)
        
        this.tool = tool
        this.indexInToolbar = indexInToolbar
        
        let btn = new IconButton(rect,tool.icon,()=>this.click())
        btn.isAnimated = (() => // override IconButton
            btn.hovered || (
                this.isSelected() 
                && (global.gameState==GameStates.playing)
            )
        )
        this.button = btn
        this.children.push(btn)
        
        if( tool.getCost() ){
            let r = rect
            let h = r[3]/4
            r = [r[0],r[1]+r[3]-h,r[2],h]
            r = padRect(...r, -.004)
            let pi = new ProgressIndicator(r,null,
                ()=>'',//tool.getCost(),
                ()=>global.mainSim.particlesCollected/tool.getCost())
                .withScale(.2)
                .withStyle('tiny')
            this.children.push(pi)
        }
    }
    
    update(){
        //this.button.hoverable = this.tool.isUsable()
        super.update()
    }
                
    isSelected(){
        return this.indexInToolbar == global.selectedToolIndex
    }
                
    click(){ 
        if( this.tool.isUsable() ){
    
            global.selectedToolIndex = this.indexInToolbar
            
            // close the upgrades menu if it is open 
            if( global.gameState==GameStates.upgradeMenu ) toggleStats()
                
        } else {
            this.setTemporaryTooltip('collect more raindrops!')
        }
        
        return true
    }
    
    
    draw(g){
        super.draw(g)
        
        if( this.isSelected() ){
            
            //draw extra rectangle to highlight selected
            let outer = this.rect
            let m = .005
            let inner = [outer[0]+m,outer[1]+m,outer[2]-2*m,outer[3]-2*m]
            Button._draw(g,inner,false,false)
        }
    }
}