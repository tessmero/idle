var charWidth = 5
var charHeight = 5

// draw text centered at point xy
function drawText(g,x,y,s,center=true,pad=0,scale=1, clear=false){
    s = s.toUpperCase()
    let cw = charWidth
    let ch = charHeight
    let tps = global.textPixelSize * scale 
    let tls = global.textLetterSpace * scale
    let dx = tps * cw + tps * tls
    
    if( center ){
        let [tw,th] = getTextDims(s,scale)
        x -= tw/2
        y -= th/2
    }
    
    for( const c of s ){
        drawLayout(g,x,y,charLayouts[c],false,pad,scale,clear)        
        x += dx
    }
}

function getTextDims(s,scale=1){
    let cw = charWidth
    let ch = charHeight
    let tps = global.textPixelSize 
    let tls = global.textLetterSpace  
    let dx = tps * cw + tps * tls
    let tw = dx*s.length - tps*tls
    let th = tps*ch
    return [tw*scale,th*scale]
}

function drawLayout(g,x,y, layout, center=true, pad=0, scale=1, clear=false){
    if( !layout ) return
    
    let tps = global.textPixelSize*scale
    let tls = global.textLetterSpace*scale
    let ch = layout.length//charHeight
    
    if( center ){
        x -= tps*layout[0].length/2
        y -= tps*layout.length/2
    }
    
    for( let iy = 0 ; iy < ch ; iy++ ){
        let ix = 0
        for( const b of layout[iy] ){
            if( b!=' ' ){
                if( clear ){
                    g.clearRect(x+tps*ix-pad,y+tps*iy-pad,tps+pad*2,tps+pad*2)
                }  else {
                    g.fillRect(x+tps*ix-pad,y+tps*iy-pad,tps+pad*2,tps+pad*2)
                }
            }
            ix += 1
        }
    }
}

var charLayouts = {
    
'-': [
    '     ',
    '     ',
    '#####',
    '     ',
    '     ',
],
    
'%': [
    '#   #',
    '#  # ',
    '  #  ',
    ' #  #',
    '#   #'
],

'/': [
    '    #',
    '   # ',
    '  #  ',
    ' #   ',
    '#    '
],

'(': [
    '  ## ',
    ' #   ',
    '#    ',
    ' #   ',
    '  ## '
],

')': [
    '##   ',
    '   # ',
    '    #',
    '   # ',
    '##   '
],

'0': [
    ' ### ',
    '#   #',
    '#   #',
    '#   #',
    ' ### '
],

'1': [
    '  #  ',
    ' ##  ',
    '  #  ',
    '  #  ',
    ' ### '
],

'2': [
    ' ### ',
    '#   #',
    '   # ',
    '  #  ',
    '#####'
],

'3': [
    '###  ',
    '   # ',
    ' ### ',
    '   # ',
    '###  '
],

'4': [
    '#   #',
    '#   #',
    '#####',
    '    #',
    '    #'
],

'5': [
    '#####',
    '#    ',
    '#####',
    '    #',
    '#####'
],

'6': [
    ' ### ',
    '#    ',
    '#####',
    '#   #',
    ' ### '
],

'7': [
    '#####',
    '   # ',
    '  #  ',
    ' #   ',
    '#    '
],

'8': [
    ' ### ',
    '#   #',
    ' ### ',
    '#   #',
    ' ### '
],

'9': [
    ' ### ',
    '#   #',
    ' ####',
    '    #',
    ' ### '
],

    
    'A': [
        ' ### ',
        '#   #',
        '#####',
        '#   #',
        '#   #'
    ],
    
    'B': [
        '#### ',
        '#   #',
        '#### ',
        '#   #',
        '#### '
    ],
    
    'C': [
        ' hhh ',
        'h   h',
        'h    ',
        'h   h',
        ' hhh '
    ],
    
    'D': [
        'wwww ',
        'w   w',
        'w   w',
        'w   w',
        'wwww '
    ],
    
    'E': [
        'wwwww',
        'w    ',
        'wwwww',
        'w    ',
        'wwwww'
    ],
    
    'F': [
        'wwwww',
        'w    ',
        'wwwww',
        'w    ',
        'w    '
    ],
    
    'G': [
        ' www ',
        'w    ',
        'w  ww',
        'w   w',
        ' www '
    ],
    
    'H': [
        'w   w',
        'w   w',
        'wwwww',
        'w   w',
        'w   w'
    ],
    
    'I': [
        'wwwww',
        '  w  ',
        '  w  ',
        '  w  ',
        'wwwww'
    ],
    
    'J': [
        'wwwww',
        '  w  ',
        '  w  ',
        'w w  ',
        ' w   '
    ],
    
    'K': [
        'w   w',
        'w  w ',
        'www  ',
        'w  w ',
        'w   w'
    ],
    
    'L': [
        'w    ',
        'w    ',
        'w    ',
        'w    ',
        'wwwww'
    ],
    
    'M': [
        'w   w',
        'ww ww',
        'w w w',
        'w   w',
        'w   w'
    ],
    
    'N': [
        'w   w',
        'ww  w',
        'w w w',
        'w  ww',
        'w   w'
    ],
    
    'O': [
        ' www ',
        'w   w',
        'w   w',
        'w   w',
        ' www '
    ],
    
    'P': [
        'wwww ',
        'w   w',
        'wwww ',
        'w    ',
        'w    '
    ],
    
    'Q': [
        ' www ',
        'w   w',
        'w   w',
        ' www ',
        '   ww'
    ],
    
    'R': [
        'wwww ',
        'w   w',
        'wwww ',
        'w  w ',
        'w   w'
    ],
    
    'S': [
        'wwwww',
        'w    ',
        'wwwww',
        '    w',
        'wwwww'
    ],
    
    'T': [
        'wwwww',
        '  w  ',
        '  w  ',
        '  w  ',
        '  w  '
    ],
    
    'U': [
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        ' www '
    ],
    
    'V': [
        'w   w',
        'w   w',
        'w   w',
        ' w w ',
        '  w  '
    ],
    
    'W': [
        'w   w',
        'w w w',
        'w w w',
        'w w w',
        ' w w '
    ],
    
    'X': [
        'w   w',
        ' w w ',
        '  w  ',
        ' w w ',
        'w   w'
    ],
    
    'Y': [
        'w   w',
        ' w w ',
        '  w  ',
        '  w  ',
        '  w  '
    ],
    
    'Z': [
        'wwwww',
        '   w ',
        '  w  ',
        ' w   ',
        'wwwww'
    ],
}