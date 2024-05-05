class TabPaneGroup extends CompositeGuiElement {
    
    // tabContent is list of rect->element callbacks
    constructor( rect, tabLabels, tabContents, tabTooltips=null ){
        super(rect)
        this.tabLabels = tabLabels
        this.selectedTabIndex = 0
        
        let m = .1*rect[2]
        let x = rect[0]
        let y = rect[1]
        let pad = .02
        y += pad
        
        // tab labels at top
        let i = 0
        let p = .05
        x += p
        let tabLabelScale = .5
        let tabHeaderHeight = 0
        tabLabels.map(label => {
            let [w,h] = getTextDims(label,tabLabelScale)
            let rr = padRect(x,y,w,h,pad)
            rr[1] += .01
            tabHeaderHeight = rr[3]
            let ii = i
            x += w+p
            let tb = new TabHeaderButton(this,ii,rr,label,
                    () => {
                        this.selectedTabIndex=ii
                        if( this.tabChangeListeners ) 
                            this.tabChangeListeners.forEach(l=>l(ii))
                    }
                )
            if( tabTooltips ) tb.withTooltip(tabTooltips[i])
                
            tb.scale = tabLabelScale
            this.children.push(tb)
            i += 1
        })
                
        // content for each tab
        rect = [...rect]
        rect[1] += tabHeaderHeight
        rect[3] -= tabHeaderHeight
        this.tabContent = tabContents.map(cons => cons(rect).withOpacity(true))
        
        this.nTabs = tabLabels.length
        this.selectedTabIndex = 0
    }
    
    addTabChangeListener(l){
        if( !this.tabChangeListeners ){
            this.tabChangeListeners = []
        }
        this.tabChangeListeners.push(l)
    }
    
    update(dt,disableHover){
        super.update(dt,disableHover)
        this.tabContent[this.selectedTabIndex].update(dt,disableHover)
    }
    
    draw(g){
        this.tabContent[this.selectedTabIndex].draw(g) // draw tab content
        super.draw(g) // draw tab labels
    }
    
    click(){
        return super.click() || // click tab label
            this.tabContent[this.selectedTabIndex].click() // click tab content
    }
}