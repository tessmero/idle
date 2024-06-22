class TunnelingIcon extends Icon {
  constructor() {
    super([[
      '  w       ',
      'w w  w    ',
      '  w  w    ',
      '     w    ',
      '     w    ',
      '     w    ',
      '     w    ',
    ],[
      '  w       ',
      ' ww  w    ',
      '  w  w    ',
      '     w    ',
      '     w    ',
      '     w    ',
      '     w    ',
    ],[
      '  w       ',
      '  w  w    ',
      '  w  w    ',
      '     www  ',
      '     www  ',
      '     w    ',
      '     w    ',
    ],[
      '  w       ',
      '  w  w    ',
      '  w  w    ',
      '     w  ww',
      '     w  ww',
      '     w    ',
      '     w    ',
    ]]);

    // add repeated frames in reverse 
    // to make animation bounce
    const f = this.frames
    const n = f.length-1
    for( let i = 1 ; i < n ; i++ ){
      f.push(f[n-i])
    }
  }
}

const tunnelingIcon = new TunnelingIcon();

