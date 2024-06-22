class InsertIcon extends Icon {
  constructor() {
    super([[
      '  w  ',
      '     ',
      ' ### ',
      ' w # ',
      ' ww# ',
    ], [
      '     ',
      '  w  ',
      'w   w',
      ' w # ',
      ' ww# ',
    ], [
      '     ',
      '     ',
      'w w w',
      ' w # ',
      ' ww# ',
    ],[
      '     ',
      '     ',
      ' ### ',
      ' ww# ',
      ' ww# ',
    ]]);
  }
}

const insertIcon = new InsertIcon();
const extractIcon = new Icon([...insertIcon.frames].reverse())
