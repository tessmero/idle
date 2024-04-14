var charWidth = 5
var charHeight = 7



// draw text centered at point xy
function drawText(g,x,y,s,center=true,pad=0,scale=1, clear=false){
    let lines = s.split('\n')
    let dy = scale * global.textPixelSize * (charHeight+global.textLineSpace )
    lines.forEach( l => {
        _drawTextLine(g,x,y,l,center,pad,scale,clear)
        y +=dy
    })
}
function _drawTextLine(g,x,y,s,center,pad,scale, clear){    
    //s = s.toUpperCase()
    let dx = scale * global.textPixelSize * (charWidth+global.textLetterSpace )
    
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
    let lines = s.split(/\r?\n/)
    let longest = Math.max(...lines.map(l => l.length))
    
    // dims in terms of number of characters
    let charDims = [longest,lines.length]
    
    
    // dims in terms of number of text pixels
    let w = charDims[0]*charWidth + (charDims[0]-1)*global.textLetterSpace
    let h = charDims[1]*charHeight + (charDims[1]-1)*global.textLineSpace
     
    let m = global.textPixelSize * scale
    
    return [m*w, m*h]
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
    
'+': [
    '     ',
    '     ',
    '  w  ',
    ' www ',
    '  w  ',
    '     ',
    '     ',
    '     ',
],
    
'>': [

    '     ',
    ' w   ',
    '  w  ',
    '   w ',
    '  w  ',
    ' w   ',
    '     ',
    '     ',
],
'.': [
    '     ',
    '     ',
    '     ',
    '     ',
    '  #  ',
    '     ',
    '     ',
],
    
':': [
    '     ',
    '     ',
    '  #  ',
    '     ',
    '  #  ',
    '     ',
    '     ',
],
    
'-': [
    '     ',
    '     ',
    '     ',
    '#####',
    '     ',
    '     ',
    '     ',
],

'%': [
    '##   ',
    '##  #',
    '   # ',
    '  #  ',
    ' #   ',
    '#  ##',
    '   ##',
],

'/': [
    '     ',
    '    #',
    '   # ',
    '  #  ',
    ' #   ',
    '#    ',
    '     ',
],

'(': [
    '  #  ',
    ' #   ',
    ' #   ',
    ' #   ',
    ' #   ',
    ' #   ',
    '  #  '
],

')': [
    '  #  ',
    '   # ',
    '   # ',
    '   # ',
    '   # ',
    '   # ',
    '  #  '
],

'0': [
    ' ### ',
    '#   #',
    '#  ##',
    '# # #',
    '##  #',
    '#   #',
    ' ### '
],

'1': [
    '  #  ',
    ' ##  ',
    '  #  ',
    '  #  ',
    '  #  ',
    '  #  ',
    ' ### '
],

'2': [
    ' ### ',
    '#   #',
    '    #',
    '  ## ',
    ' #   ',
    '#    ',
    '#####'
],

'3': [
    ' ### ',
    '#   #',
    '    #',
    '  ## ',
    '    #',
    '#   #',
    ' ### ',
],

'4': [
    '   ##',
    '  # #',
    ' #  #',
    '#   #',
    '#####',
    '    #',
    '    #',
],

'5': [
    '#####',
    '#    ',
    '#### ',
    '    #',
    '    #',
    '#   #',
    ' ### '
],

'6': [
    ' ### ',
    '#   #',
    '#    ',
    '#### ',
    '#   #',
    '#   #',
    ' ### '
],

'7': [
    '#####',
    '    #',
    '   # ',
    '  #  ',
    ' #   ',
    '#    ',
    '#    ',
],

'8': [
    ' ### ',
    '#   #',
    '#   #',
    ' ### ',
    '#   #',
    '#   #',
    ' ### '
],

'9': [
    ' ### ',
    '#   #',
    '#   #',
    ' ####',
    '    #',
    '#   #',
    ' ### '
],
    'a': [
        '     ',
        '     ',
        ' ### ',
        '    #',
        ' ####',
        '#   #',
        ' ####',
    ],
    'b': [
        '#    ',
        '#    ',
        '# ## ',
        '##  #',
        '#   #',
        '#   #',
        '#### ',
    ],
    'c': [
        '     ',
        '     ',
        ' ### ',
        '#    ',
        '#    ',
        '#   #',
        ' ### ',
    ],
    'd': [
        '    #',
        '    #',
        ' ## #',
        '#  ##',
        '#   #',
        '#   #',
        ' ####',
    ],
    'e': [
        '     ',
        '     ',
        ' ### ',
        '#   #',
        '#####',
        '#    ',
        ' ### ',
    ],
    'f': [
        '  ## ',
        ' #   ',
        '###  ',
        ' #   ',
        ' #   ',
        ' #   ',
        ' #   ',
    ],
    'g': [
        '     ',
        '     ',
        ' ####',
        '#   #',
        ' ####',
        '    #',
        ' ### ',
    ],
    'h': [
        '#    ',
        '#    ',
        '# ## ',
        '##  #',
        '#   #',
        '#   #',
        '#   #',
    ],
    'i': [
        '  #  ',
        '     ',
        ' ##  ',
        '  #  ',
        '  #  ',
        '  #  ',
        ' ### ',
    ],
    'j': [
        '    #',
        '     ',
        '   ##',
        '    #',
        '    #',
        '    #',
        '#   #',
        ' ### ',
    ],
    'k': [
        ' #   ',
        ' #   ',
        ' #  #',
        ' # # ',
        ' ##  ',
        ' # # ',
        ' #  #',
    ],
    'l': [
        ' ##  ',
        '  #  ',
        '  #  ',
        '  #  ',
        '  #  ',
        '  #  ',
        ' ### ',
    ],
    'm': [
        '     ',
        '     ',
        '## # ',
        '# # #',
        '# # #',
        '# # #',
        '# # #',
    ],
    'n': [
        '     ',
        '     ',
        '# ## ',
        '##  #',
        '#   #',
        '#   #',
        '#   #',
    ],
    'o': [
        '     ',
        '     ',
        ' ### ',
        '#   #',
        '#   #',
        '#   #',
        ' ### ',
    ],
    'p': [
        '     ',
        '     ',
        '#### ',
        '#   #',
        '#### ',
        '#    ',
        '#    ',
    ],
    'q': [
        '     ',
        '     ',
        ' ### ',
        '#   #',
        ' ####',
        '    #',
        '    #',
    ],
    'r': [
        '     ',
        '     ',
        '# ## ',
        '##  #',
        '#    ',
        '#    ',
        '#    ',
    ],
    's': [
        '     ',
        '     ',
        ' ####',
        '#    ',
        ' ### ',
        '    #',
        '#### ',
    ],
    't': [
        ' #   ',
        '###  ',
        ' #   ',
        ' #   ',
        ' #   ',
        ' #  #',
        '  ## ',
    ],
    'u': [
        '     ',
        '     ',
        '#   #',
        '#   #',
        '#   #',
        '#  ##',
        ' ## #',
    ],
    'v': [
        '     ',
        '     ',
        '#   #',
        '#   #',
        ' # # ',
        ' # # ',
        '  #  ',
    ],
    'w': [
        '     ',
        '     ',
        '#   #',
        '#   #',
        '# # #',
        '# # #',
        ' # # ',
    ],
    'x': [
        '     ',
        '     ',
        '##  #',
        '  ## ',
        '  #  ',
        ' ##  ',
        '#  ##',
    ],
    'y': [
        '     ',
        '     ',
        '#   #',
        ' #  #',
        '  ## ',
        '  #  ',
        '##   ',
    ],
    'z': [
        '     ',
        '     ',
        '#####',
        '   # ',
        '  #  ',
        ' #   ',
        '#####',
    ],

    
    'A': [
        ' ####',
        '#   #',
        '#   #',
        '#####',
        '#   #',
        '#   #',
        '#   #',
    ],
    
    'B': [
        '#### ',
        '#   #',
        '#   #',
        '#### ',
        '#   #',
        '#   #',
        '#### '
    ],
    
    'C': [
        ' hhh ',
        'h   h',
        'h    ',
        'h    ',
        'h    ',
        'h   h',
        ' hhh '
    ],
    
    'D': [
        'wwww ',
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        'wwww '
    ],
    
    'E': [
        'wwwww',
        'w    ',
        'w    ',
        'wwww ',
        'w    ',
        'w    ',
        'wwwww'
    ],
    
    'F': [
        'wwwww',
        'w    ',
        'w    ',
        'wwww ',
        'w    ',
        'w    ',
        'w    '
    ],
    
    'G': [
        ' www ',
        'w   w',
        'w    ',
        'w    ',
        'w  ww',
        'w   w',
        ' www '
    ],
    
    'H': [
        'w   w',
        'w   w',
        'w   w',
        'wwwww',
        'w   w',
        'w   w',
        'w   w'
    ],
    
    'I': [
        'wwwww',
        '  w  ',
        '  w  ',
        '  w  ',
        '  w  ',
        '  w  ',
        'wwwww'
    ],
    
    'J': [
        '   ww',
        '    w',
        '    w',
        '    w',
        '    w',
        'w   w',
        ' www '
    ],
    
    'K': [
        'w   w',
        'w  w ',
        'w w  ',
        'ww   ',
        'w w  ',
        'w  w ',
        'w   w'
    ],
    
    'L': [
        'w    ',
        'w    ',
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
        'w   w',
        'w   w',
        'w   w'
    ],
    
    'N': [
        'w   w',
        'w   w',
        'ww  w',
        'w w w',
        'w  ww',
        'w   w',
        'w   w'
    ],
    
    'O': [
        ' www ',
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        ' www '
    ],
    
    'P': [
        'wwww ',
        'w   w',
        'w   w',
        'wwww ',
        'w    ',
        'w    ',
        'w    '
    ],
    
    'Q': [
        ' www ',
        'w   w',
        'w   w',
        'w   w',
        'w w w',
        'w  w ',
        ' ww w'
    ],
    
    'R': [
        'wwww ',
        'w   w',
        'w   w',
        'wwww ',
        'w   w',
        'w   w',
        'w   w',
    ],
    
    'S': [
        ' www ',
        'w   w',
        'w    ',
        ' www ',
        '    w',
        'w   w',
        ' www '
    ],
    
    'T': [
        'wwwww',
        '  w  ',
        '  w  ',
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
        'w   w',
        'w   w',
        ' www '
    ],
    
    'V': [
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        ' w w ',
        '  w  '
    ],
    
    'W': [
        'w   w',
        'w   w',
        'w   w',
        'w   w',
        'w w w',
        'w w w',
        ' w w '
    ],
    
    'X': [
        'w   w',
        'w   w',
        ' w w ',
        '  w  ',
        ' w w ',
        'w   w',
        'w   w'
    ],
    
    'Y': [
        'w   w',
        'w   w',
        ' w w ',
        '  w  ',
        '  w  ',
        '  w  ',
        '  w  '
    ],
    
    'Z': [
        'wwwww',
        '    w',
        '   w ',
        '  w  ',
        ' w   ',
        'w    ',
        'wwwww'
    ],
}