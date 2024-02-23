# VR Sketch Website version 3

## Branches
* master - Automatically updates the test site at "https://test.vrsketch.eu/"
* prod2 - Automatically updates the main site at "https://vrsketch.eu/"


### Dependencies
* jinja2 http://jinja.pocoo.org/docs/2.10/
* libsass https://sass.github.io/libsass-python/
* markdown

### Folders
'/markdown' = Where all markdown file go. It will be converted to html and placed in '/templates/generated'.
'/scss' = The source files for sass that then get compiled into '/web/css'
'/scss/bootstrap-scss' = Bootstrap source files that our custom 'styles.scss' imports from
'/templates' = Where all html template files go before the are rendered and placed in '/web'.
'/templates/generated' = Only auto-generated files go here. They are the converted markdown files.
'/templates/layouts' = Where the layouts the the other template inherit from go.
'/templates/partials' = Where elements that will be 'included' go.
'/web' = All css,img,js files. This is the public folder

### build.py
1. Concerts all markdown files in '/markdown' into html in '/templates/generated'
2. Renders all templates from '/templates' and placed them in '/web'
3. Compiles '/sass/styles.scss' into '/web/css/styles.css'

### Dev server
While in the "web" directory:
```bash
python -m SimpleHTTPServer 8080 index.html        
```

### Build
```bash
python build.py --test       
```
