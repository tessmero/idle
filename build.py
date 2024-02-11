
# build production.js
# by combining all the script tags in test.html

from jsmin import jsmin

# load all source code into a string
all_source = ''
with open('test.html','r') as fhtml:
    while True:
        line = fhtml.readline()
        if not line:
            break
        if ("<script" in line) and ("</script>" in line) and ("bootstrap.min.js" not in line):
            i = line.index('"')
            j = line.rindex('"')
            filepath = line[i+1:j]
            
            print(filepath)
            with open(filepath,'r') as fin:
                all_source += '\n' + fin.read() + '\n'
                    
# write minified source to file
minified = jsmin(all_source)
print( f'reduced source from {len(all_source)} to {len(minified)} chars' )
with open('production.js','w') as fout:
    fout.write(minified)