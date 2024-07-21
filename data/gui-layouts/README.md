# GUI Layouts

Layout data format is like CSS but one-way and very limited.
  - Each ruleset represents a rectangle or set of rectangles with x,y,w,h 
  - no margin/padding box model
  - The order of rules matters
  - You always have an absolute parent rectangle before parsing a ruleset
  - Rules `parent` and `repeat` act like mini DOM within one layout object


## GUI Disambiguation 
In the data folder, the term "gui" (Graphical User Interface) is used loosely.

In the source code, "gui" refers to objects of type `Gui`, a full-screen container such as the start menu. Layout objects are associated with a more general class `CompositeGuiElement` which includes guis. 


## Usage

`CompositeGuiElement` implementations should set `_layoutData` to point to the css data object. They should use `this._layout` to access the computed rectangles.

Layout object in data folder:
```js
  MY_LAYOUT_OBJECT = {
    myRectangle:{
      width: '20%',
    },

    ...
  }
```

Class in source code:
```js
  class MyCompositeElement extends CompositeGuiElement {
    _layoutData = MY_LAYOUT_OBJECT

    _buildElements() {

      // access computed rectangle x,y,w,h
      const myRectangle = this._layout['myRectangle']

      ...
    }
  }
```


Gui's may have css layouts, and so may any composites within them and their descendants. Nesting composites this way can be used for breaking up code and to make up for the limitations of the layout parser. 

However, often we just want to nest rectangles for purposes of alignment, we can choose to do that using a DOM within the layout object without adding any complexity to the source code.


## DOM (Document Object Model)

  Layout objects always exist as flat lists of css rulesets. We don't have a hierarchy of html elements to apply rules to. Instead, made up rules `parent` and `repeat` are used to define a miniature DOM that only exists within a layout object.

  In the source code we consider a simpler DOM. The layout object is translated into a flat array of absolute rectangles. Ultimately some of the rectangles are used for positioning `GuiElement` instances.

  CSS rulesets may begin with the `parent` rule which refers to a previously defined ruleset. If no parent is specified, the enclosing CompositeGuiElement's bounding rectangle is used. At the top level the always-visible square [0,0,1,1] is used as the parent.

  CSS rulesets with plural names result in multiple [x,y,w,h] instead of individual rectangles. They invoke the `repeat` rule.

```js
  LAYOUT_OBJECT = {

    // outer rectangle
    parent_ruleset:{
      margin: .05,
    },

    // array of four inner rectangles
    four_rows_ruleset:{
      parent: 'parent_ruleset',
      height: '25%',
      repeat: 'down',
      margin: .005,
    }
  }
````

Using `margin` after `repeat` creates space between inner rectangles.

## Distance Units
  absolute distances are specified as numbers in units of ~screens, where a square inscribed on the center of the screen spans coordinates 0,0 to 1,1. This square is also the default parent. It is always fully visible regardless of screen aspect ratio.

```js
biggest_inscribed_square: {
  left: 0,
  top: 0,
  width: 1,
  height: 1,
},
```


## Co-Opted CSS rules and values
This rectangle has the same aspect ratio as its parent. The value `'auto'` is co-opted to center in parent. (order matters)
```js
centered_in_parent: {
  width: '10%',
  height: '10%',
  top: 'auto',
  left: 'auto',
},
```

This rectangle is centered in it's parent with equal margin an all sides. We assume that the parent has width and height > 0.1
```js
centered_in_parent: {
  margin: 0.05,
},
```

The `width` or `height` value `'auto'` is co-opted to align with bottom/right of the parent bounds.
```js
bottom_right: {
  top: '90%',
  left: '90%',
  width: 'auto', 
  height: 'auto',
},
```

