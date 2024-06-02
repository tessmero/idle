# scan source files, generate html tags, and update test.html 
# so all the js files get linked



import os

# get all source file paths
base_folder = 'src'
all_src_paths = {}
for foldername, subfolders, filenames in os.walk(base_folder):
    for filename in filenames:
        if filename.endswith('.js'):
            relative_path = os.path.relpath(os.path.join(foldername, filename), base_folder).replace("\\","/")
            if( '__tests__' not in relative_path ):
                all_src_paths[filename] = f"{base_folder}/{relative_path}"


# get mapping of classes to filenames
class_filenames = {}
for filename in all_src_paths:
    file_path = all_src_paths[filename]
    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('class '):
                tokens = line.split()
                class_name = tokens[1].strip(':\n{')
                class_filenames[class_name] = filename

# get mapping of classes to their base classes
class_hierarchy = {}
for filename in all_src_paths:
    file_path = all_src_paths[filename]
    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('class ') and 'extends' in line:
                tokens = line.split()
                class_name = tokens[1]
                extends_index = tokens.index('extends')
                base_class = tokens[extends_index + 1].strip(':\n{')
                class_hierarchy[filename] = class_filenames[base_class]

# start planning order of import statements
order = sorted(list(all_src_paths.keys()))
def toFirst(my_list, element_to_move):
    assert element_to_move in my_list, f"'{element_to_move}' must exist in the list"
    my_list.remove(element_to_move)
    return [element_to_move] + my_list

def toLast(my_list, element_to_move):
    assert element_to_move in my_list, f"'{element_to_move}' must exist in the list"
    my_list.remove(element_to_move)
    return my_list + [element_to_move]



# Separate class files and non-class files
class_files = [filename for filename in order if filename in class_filenames.values()]
non_class_files = [filename for filename in order if filename not in class_filenames.values()]

# Define a function to get the depth of a class in the hierarchy
def get_hierarchy_depth(class_fname):
    depth = 0
    while class_fname in class_hierarchy.keys():
        class_fname = class_hierarchy[class_fname]
        depth += 1
    return depth

# Sort the class names based on their hierarchy depth
class_files = sorted(class_files, key=get_hierarchy_depth)

# Concatenate class files and non-class files
order = class_files + non_class_files

# utils must be first
order = toFirst(order, 'util.js')
order = toFirst(order, 'rng.js')
order = toFirst(order, 'vector.js')

# setup.js must be last
order = toLast(order, 'setup.js')

# generate import statements
generated_html = ''
for fname in order:
    path = all_src_paths[fname]
    generated_html += f'<script src="{path}"></script>\n'
    
    

# Path to the existing HTML file
existing_html_file_path = 'test.html'

# Read the existing HTML content
with open(existing_html_file_path, 'r') as file:
    html_content = file.read()

# Find the start and end indices of the special comment lines
start_comment = '<!-- START_IMPORTS -->'
end_comment = '<!-- END_IMPORTS -->'

start_index = html_content.find(start_comment) + len(start_comment)
end_index = html_content.find(end_comment)

# Replace the content between the special comment lines
new_html_content = (
    html_content[:start_index] +
    generated_html +
    html_content[end_index:]
)

# Write the updated HTML content back to the file
with open(existing_html_file_path, 'w') as file:
    file.write(new_html_content)

print("HTML content between special comment lines replaced successfully.")