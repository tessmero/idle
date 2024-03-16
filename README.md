# Idle Rain Catcher

Idle game based on procedural/physics particle simulation
    

## Demo

https://tessmero.github.io/raincatcher.html

## Usage

clone this repository to your computer

open `test.html` to test locally, loading source files in `src`

run `python imports.py` to update links in `test.html` to include all files in `src`


## build for production

run `python build.py` to concatenate all source files into one file: `production.js`

open `production.html` to test locally using `production.js`

use `webpack` subdir to minify javascript
```
cp production.js webpack/src
cd webpack
npm run build
```
minified output appears at `webpack/dist/production.js`

