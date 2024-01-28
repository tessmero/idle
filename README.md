

- support large number of procedural particles
    positions computed on draw and not remembered between frames
    but also support grabbing/eating of individual particles
- consider only distances squared instead of actual distances (avoid square roots)
- for circles, radius-squared also used as an analogue for the area of the circle
    
    
    

## Demo

https://tessmero.github.io/idle.html

## Usage

clone this repository to your computer

open `test.html` to test locally, using source files in `src`

run `python build.py` to concatenate all source files into one distributable file: `production.js`

