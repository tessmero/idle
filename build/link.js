/**
 * @file link.js wrapper for link.py
 * scans source and updates test.html
 * so all the js files get linked in the correct order.
 */
import { PythonShell } from 'python-shell';

// scan source folders and classes
PythonShell.run('build/link.py');

