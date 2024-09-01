
# Parsers

Parsers interpret some complex data objects. In developing parsers we aim to support new rich data languages with features like looping. What starts as a simple parser function tends to grow into various stages of data-specific strategizing and stored state. 

Parsers are defined as a class with a static function that reads a data object. A simple parser may be defined completely in that function.

```js
class MyDataParser {
  static parse(data){
    // ...code to parse data
  }
}
```

The parser is accessed as `MyDataParser.parse(data)`, where `data` refers to an UPPER_SNAKE_CASE data object.

As the parser grows in complexity, it becomes convenient to create a `new` instance of the class in the static function. The private variables of the instance should then be accessed in the static function to return parsed results. In the parser definition we can freely redesign how we use instances, methods, and private variables.

For example, a call to `GuiLayoutParser.computeRects()` may privately involve multiple instances of `GuiLayoutParser` when interpolation is necessary.