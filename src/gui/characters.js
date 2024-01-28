var charWidth = 5
var charHeight = 5

// draw text centered at point xy
function drawText(g,x,y,s){
    let cw = charWidth
    let ch = charHeight
    let tps = global.textPixelSize 
    let dx = tps * cw + tps * global.textLetterSpace  
    
    // compute total size
    let tw = dx*s.length + tps*cw
    let th = tps*ch
    x -= tw/2
    y -= th/2
    
    for( const c of s ){
        let layout = charLayouts[c]
        for( let iy = 0 ; iy < ch ; iy++ ){
            let ix = 0
            for( const b of layout[iy] ){
                if( b!=' ' ) g.fillRect(x+tps*ix,y+tps*iy,tps,tps)
                ix += 1
            }
        }
        
        x += dx
    }
}

var charLayouts = {
    
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