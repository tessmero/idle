# Idle Source Code

When executed, the source and data files are concatenated together into one script. They are ordered following a few simple rules like putting data first and putting base classes before their sub-classes. Basically all the source is exposed to all the class names and data objects, along with some "magic" variables defined in source outside of classes.

## Special Naming Conventions

### Magic Variables

Magic functions and variables are immutable constants. They are magical because they have camelCase names like local variables but they aren't defined locally.

- Math utilities like `v(x,y)` shorthand for `new Vector(x,y)` defined in `src/math/util.js`
- `Icon` instances like `soundPlayingIcon` defined in `data/icon_layouts_data.js`

### Global Object

`global` is a special magic variable with properties like `soundEnabled`. Unlike other magic variables, its properties can be changed. It is also a special singleton with class `Global` but should be thought of as a simple object with properties. Other singleton classes (daemons) are functional and can do things like throw errors.

### Data Objects

Data objects are immutable constant variables accessed using their UPPER_SNAKE_CASE name defined in the `data` folder.

## Class Patterns


### Parsers

Parsers read data objects. They follow an extra-encapsulated pattern so they can be easily refactored to support new data language constructs.

Parser classes like `GuiLayoutParser` are only accessed through static functions.

```js
var myRectangles = GuiLayoutParser.computeRects(MY_LAYOUT_DATA)
```

More info in src/parsers/README.md


### Gui Elements

`GuiElement` has a lot of sub-classes like `Button`. Elements are constructed using a bounding rectangle and optional named parameters.

```js
var playButton = new Button(layout.playBtn, {
  titleKey: 'start-menu-play-btn',
  label: 'PLAY',
  action: () => this._playClicked(),
});
```

 More info in src/gui/README.md

### Managers

Managers are functional objects that manage things. They have to be instantiated. Manager classes are named following a convention: class `ThingManager` manages multiple "things".

For example a `GameStateManager` manages the various states (e.g. "paused" and "playing") that a game may be in.

```js
var mgr = new GameStateManager()
```

There may be multiple `GameStateManager` instances since there can be multiple `GameScreen` instances each with a dedicated state manager.

On the other hand, some manager classes can only have one instance and are considered daemons.

### Daemons

Daemons are singleton manager classes defined in `src/daemons`. They are accessed using an "implicit constructor" without `new`.

For example, there is one `ScreenManager` that manages all `GameScreen` instances.

```js
var mgr = ScreenManager();
```

More info in src/daemons/README.md

