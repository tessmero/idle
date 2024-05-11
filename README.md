# Idle Rain Catcher

Idle game based on procedural/physics particle simulation

## Demo

https://tessmero.github.io/raincatcher.html

## Usage with web browser

clone this repository to your computer

open `test.html` in your web browser to test locally, loading source files in `src`

`test.html` contains a list of source files. It must be updated if the folder structure changes.

## Basic build with python

run `python build/link.py` to update `test.html` so that it include all the files in `src`.

The source code is organized into ES6 classes without `require`/`import`/`export` statements. Instead the python script scans for `class A extends B` statements, then decides the order to link the files. 

run `python build/concat.py` to concatenate the source code into `dist/production.js`

open `production.html` in your web browser to run `dist/production.js`

## Build with npm

The non-standard ES6 linking system described above keeps this repository accessible. One downside is that the code is not directly compatible with nodejs development tools. Node Package Manager is used to bridge this gap and form a standard build pipeline. It wraps the python scripts above and performs transpilation with Babel.

```
npm install
npm run build:prod
```

This performs the basic build and also outputs the minified distributable `dist/production.min.js` which can be run by opening `production.min.html`.


## Enforce coding standards

Use `eslint` to check source files for syntax errors and violations of preferred coding style. `eslint.config.js` contains the list of chosen standards.

```
npx eslint --fix src
```

The chosen standards are mostly copied from [elierotenberg/coding-styles](https://github.com/elierotenberg/coding-styles/blob/master/es6.md)

Works with [Sublime Text](https://www.sublimetext.com/) [ESlint-Formatter plugin](https://github.com/TheSavior/ESLint-Formatter) to automatically highlight and fix violations.
