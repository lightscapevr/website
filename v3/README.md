# VR Sketch Website version 3

### Dependencies
* Jinja2

### Folders
'/markdown' = Where all markdown file go. It will be converted to html and placed in '/templates/generated'.
'/templates' = Where all html template files go before the are rendered and placed in '/web'.
'/templates/generated' = Only auto-generated files go here. They are the converted markdown files.
'/templates/layouts' = Where the layouts the the other template inherit from go.
'/templates/partials' = Where elements that will be 'included' go.
'/web' = All css,img,js files. This is the public folder

### build.py
1. Concerts all markdown files in '/markdown' into html in '/templates/generated'
2. Renders all templates from '/templates' and placed them in '/web'
