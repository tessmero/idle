# Singleton Daemons

The `daemons` folder contains classes for high-level,persistent,unique manager objects.

These classes follow a singleton pattern so they have one instance and it can be accessed without `new`. 


```js
var mgr = ScreenManager() // recommended
```

Using the `new` keyword also returns the single instance instead of actually making a new instance.

```js
var mgr = new ScreenManager() // safe but misleading
```

Using the `new` keyword this way will trigger a warning in ESLint. It violates the coding standard `idle/no-new-singleton` configured in `eslint.config.js`.


## Performance / Debugging / Standards

Managers oversee the construction of expensive objects such as `GameScreen` instances. 

Classes like `GameScreen` make a call to the relevant daemon like `ScreenManager` in their constructors.

## Story

`StoryManager` also uses this pattern used to track player progression. It looks at `data/story_hooks_data.js`.