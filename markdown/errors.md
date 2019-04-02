
# Bugs and errors
### What should work and what does not
Changes to the SketchUp model should be immediately visible in the VR headset. If they are not (likely because of a bug), you need to reselect "Send to VR", which sends the whole model from scratch.

VRSketch will try to send automated bug reports in the cases described below:

* most VR bugs should show up as a long piece of text in the VR mirror screen. These texts can be expanded and copy-pasted.

* after you complete an editing operation in VR (and provided you are not running the unlicensed version, in which case you just see "License needed" on the controllers): if you don't see the changes, try opening the Ruby console in SketchUp ("Window" menu) and repeat the procedure. If it is a bug in the Ruby side, it should be reported there.


In large models, it takes a few seconds before the in-VR teleport starts working (even after loading appears complete).

Most editing operations will take time to complete if your model is medium-large and doesn't use groups or components. This is because groups and components are currently the unit of transfer between the SketchUp and the Unity side.

We render the following elements in VR: faces (with or without texture); edges; and "Images". This excludes more advanced SketchUp constructs like construction lines, text labels, and so on. The "soft" edge option is supported, but not the "smooth" one: all edges appear sharp.

Textures may very occasionally appear badly positioned when you open a subgroup. (This issue cannot occur if you don't have any group or component opened for editing.) After release 2.2 we have improved the situation but not completely. The cause is SketchUp's textures, which can be either "positioned" or "non-positioned" (right-click, Texture, "Reset Position" makes it non-positioned). However, non-positioned textures are reported at a bogus position by SketchUp's Ruby API when editing inside groups or components. We work around that by computing this bogus position on our own; then, if that is precisely what we get, we assume that it was a non-positioned texture that is misreported, and fix it manually. This might occasionally be foiled if it was actually a positioned texture that happened to be exactly at the same position.

### Reporting problems
Please report any other bug to the issue tracker or by writing to info@baroquesoftware.com
