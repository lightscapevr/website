# VR Sketch Website

### Folders
Working files go in "resources/"
Public files go in "web/"
Sources for the text go in "src/"

### update_website.py
This script is called when we commit to the master branch.
It compiles selected files from "src/" to "web/"

### src/template.html
This is the example template layout to copy/paste from. (one day we will use a real templating engine)

### src/documentation.html
This is the *template*.  The update_website script reads it together with
src/documentation.md, and emits web/documentation.html.