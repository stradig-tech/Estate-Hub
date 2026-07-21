import os
import glob

# Paths
search_pattern = 'frontend/src/**/*.jsx'
files = glob.glob(search_pattern, recursive=True)
files.append('frontend/src/index.css')

for file_path in files:
    if not os.path.isfile(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace hardcoded blue with emerald green
    new_content = content.replace('#1A73E8', '#10b981')
    new_content = new_content.replace('hover:bg-blue-700', 'hover:bg-[#059669]')
    new_content = new_content.replace('bg-blue-50', 'bg-emerald-50')
    new_content = new_content.replace('text-blue-600', 'text-emerald-600')
    new_content = new_content.replace('text-blue-500', 'text-emerald-500')
    
    if file_path.endswith('index.css'):
        # Update CSS variables for primary color to emerald-500
        new_content = new_content.replace('--primary: 221 83% 53%;', '--primary: 160 84% 39%;')
        new_content = new_content.replace('--ring: 221 83% 53%;', '--ring: 160 84% 39%;')
        new_content = new_content.replace('--sidebar-primary: 221 83% 53%;', '--sidebar-primary: 160 84% 39%;')
        new_content = new_content.replace('--sidebar-ring: 221 83% 53%;', '--sidebar-ring: 160 84% 39%;')
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file_path}')

print("Done updating colors.")
