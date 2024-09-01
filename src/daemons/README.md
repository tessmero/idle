# Singleton Daemons

The `daemons` folder contains classes for high-level,persistent,unique manager objects like `ScreenManager`. Their definitions are intentionally cumbersome and should be limited or avoided as a rule of thumb.

These classes follow a singleton pattern so they have one instance and it can be accessed without `new`. 

```js
var mgr = ScreenManager() // recommended
```

Using the `new` keyword also returns the single instance instead of actually making a new instance.

```js
var mgr = new ScreenManager() // safe but misleading
```

Using the `new` keyword this way will trigger a warning in ESLint. It violates the coding standard `idle/no-new-singleton` configured in `eslint.config.js`. 

```js
var mgr = NotSingleton() // incorrect
```
Omitting `new` for a non-singleton uppercase function name is a violation of `new-cap`. This reversal of standards provides some extra free spell-checking. It is convenient for elevating a regular manager to daemon or vice-versa.

## Performance / Debugging / Standards

Managers oversee the construction of expensive objects such as `GameScreen` instances. 

Classes like `GameScreen` make a call to the relevant daemon like `ScreenManager` in their constructors.

## Gui Element Borders

Currently only used for animated story gui border.

`BorderManager` is used to cache detailed shapes for gui elements with fixed dimensions. 

Special `Border` implementations may cache multiple shapes
  - for different-sized rectangles
  - for different params submitted in the `Border` implementation's constructor
  - requires unique key for every shape

## Story

`StoryManager` tracks player progression. It looks at `data/story_hooks_data.js`.
