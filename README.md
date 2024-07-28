# Idle Rain Catcher

Incremental / physics game used to practice game development.

## Demo

https://tessmero.github.io/raincatcher.html

## Usage with web browser

This repository can be used locally like the small demos on tessmero.github.io. The source code uses ES6 (ECMAScript 2015) `class` definitions and lacks require/import/export statements. It can be developed with just a text editor and a web browser.

clone this repository to your computer

open `test.html` in your web browser to run locally, loading from `src` and `data`.

`test.html` contains a list of source files. It must be updated if the folder structure changes.


## Basic build with python
run `python build/link.py` to update `test.html` so that it include all the files in `src` and `data`. It scans for `class A extends B` statements to decide the order to load source files.

run `python build/concat.py` to concatenate all the source and data into `dist/production.js`

open `production.html` in your web browser to run `dist/production.js`

## Build with npm

Node Package Manager is used to access more advanced development tools. The `npm` build runs the python build, then compiles the concatenated source with [Babel](https://babeljs.io/) so it can finally be rewritten in minified form.

```
npm install
npm run build:prod
```

`build:prod` outputs the minified `dist/production.min.js` which can be run by opening `production.min.html`.


## Enforce coding standards

Coding standards can be enforced using [ESLint](https://eslint.org/). `eslint.config.js` contains the project-specific standards.

Run eslint in the command line to find and fix issues. It can rewrite code and generate boilerplate such as jsdoc comments. 

```
npx eslint --fix src
npx eslint --fix data
```


## Usage with Sublime Text

in [Sublime Text](https://www.sublimetext.com/), install the `ESLint` package and open one of the source files. I also ended up installing packages `npm`, `npm-install`, and `Babel`.

Now violations are highlighted in the editor when saving a file. Install `ESLint-Formatter` to add a hotkey (ctrl-shift-h) to auto-fix the current file.

I found Sublime has pretty good built-in behavior when hovering over code to find references across this repo.
