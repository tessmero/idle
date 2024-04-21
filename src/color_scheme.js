class ColorScheme{
    
    // foreground, background, highlight
    constructor(fg,bg,hl){
        this.fg = fg
        this.bg = bg
        this.hl = hl
    }
    
    static default = new ColorScheme(
        'black','#AAA','white')
    static sandbox = new ColorScheme(
        'rgb(63,63,63)','rgb(220,220,204)','rgb(211,130,140)')
}