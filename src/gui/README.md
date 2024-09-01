# Gui Elements

The user interface is composed of `GuiElement` instances. Various types of elements are defined by sub-classes such as `Button`. Elements that contain other elements extend `CompositeGuiElement`.

## Life Cycle

Elements are first superficially "constructed" with `new`. For composite elements, they may later be "built", at which point they construct direct children. 

## Composites

Composite elements define a `_buildElements()` method where they return `new` child elements. They may reference a css layout object in the data folder to define bounding rectangles for their children. Layout data are automatically parsed between construction and building. See /data/gui-layouts/README.md

Composite elements are themselves elements with their own bounding rectangles which may be visible. Or they may have `opaque` set to `false` to act as transparent containers.

## Guis

Top-level composite elements associated with game states extend `Gui`. For example, when the game is paused, an instance of `PauseMenuGui` is the active gui (even though another gui may still be visible behind it). 

`GameScreen` represents the layered particle simulation, gui, and extra. The extra include the tooltip and the context menu gui elements which are built in `GameScreen`.

`GameStateManager` builds guis and swaps out the gui layer for `GameScreen`

## Element Constructors

Lower-level elements are constructed with `new` in their parent's `_buildElements()` method. 

The `new` call is used to:
 - assign the element class like `Button`
 - assign the bounding rectangle
 - (optional) pass an object with named parameters like `action`
 
 ```js
var nothingButton = new Button(rectangleA);
var actionButton = new Button(rectangleB, { action: myFunction });
 ```

Inside the constructor, we pass parameters up through the class hierarchy. At each level of abstraction we may
 - inject default parameters
 - forcefully override parameters
 - set private variables like based on parameters

At the top the most general constructor `GuiElement` sets private variables applicable to ALL elements like `#border`.

Elements' constructors should be defined using combinations of the patterns below where we take advantage of spread syntax `...` and destructuring.

### constructor pattern - assign private variable
Destructuring is used to unpack relevant parameters and optionally assign default values.

```js
class Button extends GuiElement {
  #action

  constructor(rect, params = {}) {
    super(rect, params);

    const {
      action = () => {}, // default action is empty function
    } = params;

    this.#action = action;
  }

  // connect action with mouse click
  // ...
}
```
`#action` is defined here because it is relevant at this level and not for the more general class. All buttons have actions, but not all gui elements. 

Note that the default action `()=>{}` is not sent to the super-class. On the other hand, an action set in the `new` statement or a sub-class's call to `super` would be passed all the way to `GuiElement`, with no real effect.

### constructor pattern - inject default parameter

```js
class MyButton extends Button {
  constructor(rect, params = {}) {
    super(rect, {

      action: () => alert('clicked!'), 

      ...params,

    });
  }
}
```

`MyButton` acts like `Button`, but has a different default action. Any default actions defined in super-classes will be ignored. On the other hand, actions passed through `new` or a sub-class's call to `super` would take priority. 


### constructor pattern - override parameter

To be used sparingly. Parameters placed after the spread syntax will forcefully replace existing parameters.

```js
class MyButton extends Button {
  constructor(rect, params = {}) {
    super(rect, {

      ...params,

      action: () => alert('I always do this action'), 

    });
  }
}
```

This button will IGNORE any action passed through the `new` statement or a sub-class's call to `super`.


