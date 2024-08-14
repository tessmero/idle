/**
 * @file concat.js wrapper for concat.py
 *
 * outputs dist/production.js
 * by combining all the script tags in test.html
 */
import { PythonShell } from 'python-shell';

PythonShell.run('build/concat.py');
