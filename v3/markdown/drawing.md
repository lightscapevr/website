# Controls and input

<img src="./img/docs/vive-oculus.png" alt="Click 'Send to VR'"> 

#### HTC Vive
  * Trigger - Used to do the action of the current tool. Is similar to clicking with a mouse.
  * Touchpad - This is the ⋮ menu button. Hold it in to choose which tool you want to use. The touchpad is also used to scroll in various tools.
  * Grip buttons - Hold in these buttons to move and scale your model.
  * Small top button - Play/stop in VR videos, when selected from SketchUp.
  * Small bottom button - Is the Steam Home button and will load the Steam Home Page.
#### Oculus Rift
  * Trigger - Used to do the action of the current tool. Is similar to clicking with a mouse.
  * Thumbstick - Used only to scroll.
  * Grip button - Hold in these buttons to move and scale your model.
  * X or A buttons - This is the ⋮ menu button. Hold it in to choose which tool you want to use.
  * Y or B buttons - Play/stop in VR videos, when selected from SketchUp.
  * Left menu button - Unassigned.
  * Right Oculus button - Default action of loading the Oculus home page.

# Tools

### Choosing a tool
How to choose the tool you want to use with each controller.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-choose.mp4" type="video/mp4" />
</video>

* To choose a tool, hold in the **⋮ menu button**, a list of tools will appear in front of the controller, move the controller to the tool you would like to use. The tool's icon will highlight when the controller is over it. Release the **⋮ menu button** while you are over the tool to select it. You will see the icon on the controller change to the current tool of that controller.
* Each controller can have only one active tool.
* Each controller has the same list of tools available.
* You can have two different tools on each controller or the same tool on both controllers.
* With some tools, when you start to use that tool, the other controller can be used to help with that action.
* You cannot use two tools simultaneously (but you can use them in succession).

## Navigation tools
### Teleport tool
The tool for moving around your model at 1:1 scale.

* Pull in the **trigger** to aim where you would like to teleport to.
* Release the **trigger** to teleport to your selected position.
* If the pointer is blue you can teleport, if the pointer is pink you cannot teleport.
* When you teleport the scale is always changed to 1:1.
* While holding the **trigger** in, you can scroll the **touchpad/thumbstick** to set how the pointer works:
    * Short arch
    * Middle arch (default)
    * Long arch
    * Straight line
* When you are not inside the warehouse, there is a small warehouse icon; aim on it to teleport back to the original warehouse view.
* As a shortcut, teleporting straight up (slightly to the back) will also return to the original warehouse view.
* The teleport preview arch will bounce off vertical or slanted surfaces.
* The teleport preview arch can pass through transparent surfaces.  If the surface is half-transparent, the arch will pass through if it aims straight through it, but not if it reaches the surface from a shallow angle.

### Zoom and Pan
Navigate around your model at any scale. This is not a standard tool; instead, it is always available, using the **↔ grip** button.

* Zoom with both controllers. Press in the **↔ grip** button on both controllers at the same time, then move the controllers towards each other to zoom in or away from each other to zoom out.
* Zoom with one controller. Hold in the **↔ grip** button on a controller and then scroll on the **touchpad/thumbstick** to zoom in or out.
* Pan. Press in the **↔ grip** button on one controller and move the controller. The model will move with the controller until you release the **↔ grip** button.
* When zooming, red text will appear between the two controllers indicating what scale you are at. The scale will snap to certain common scales.

## Selection tools

### Select tool
The tool to select individual or multiple lines, faces or groups.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-select.mp4" type="video/mp4" />
</video>

* Click select. Move the controller to the geometry you wish to select and pull the  **trigger** to select it. If that geometry is already selected it will deselect it.
    * You can move the controller while the  **trigger** is pressed to select or deselect more.
    * If you pull the  **trigger** twice quickly, like double clicking, you will select the geometry adjacent the object your controller is touching. If you double-click on an edge that is part of a longer curve, all the edges along that curve are selected.
    * If you pull the  **trigger** three times quickly, you will select all the geometry touching the object your controller is touching.
* Box select. While your controller is not touching any geometry pull in the  **trigger** and drag the controller. This will create a selection box and will select anything that is inside the box.
    * If you drag from the top down your selection (in blue) will include only the geometry fully inside the box.
    * If you drag from the bottom up your selection (in green) will include all the geometry that touches the box.
* The select tool gives you a preview of what will be selected by highlighting the geometry in blue.
* De-select everything: With the select tool active, click on nothing to de-select any current selections.
* De-select individual things: With the select tool active, click on any currently selected geometry to de-select it. There is a pink preview highlighting what will be de-selected.

### Group and Component tools
How to work with Group or Component.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-component.mp4" type="video/mp4" />
</video>

#### Entering a Group or Component. 
  * With the Group or Component selected, press in the **⋮ menu button** and choose the **Open Group** tool (found above the **select** tool) to open it.
  * Or, use the **select** tool to double click on any Group or Component to open it.
  * When inside a Group or Component the rest of the model changes colour and cannot be edited; or it might disappear from view altogether. (This is controlled by the standard SketchUp option "View, Component Edit, Hide Rest Of Model".)

#### Exiting a Group or Component.
  * While inside a Group or Component, press in the **⋮ menu button** and choose the **Exit Group** tool (found above the **select** tool) to exit the current Group or Component.
  * Or, while inside a Group or Component, use the select tool and double click outside of the Group or Component to exit.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-group.mp4" type="video/mp4" />
</video>

#### Creating Group or Component.
  * Use the select tool to select the geometry you wish to group. Then press in the **⋮ menu button** and choose either the **Create Group** tool or the **Create Component** tool.

#### Converting groups into Components.
  * Use the select tool to select the Group you wish to convert, then press in the **⋮ menu button** and choose **Turn Group into Component** tool.

#### Exploding Groups or Components
  * Use the select tool to select the Group or Component, then press in the **⋮ menu button** and choose **Explode** tool to un-group the Group or Component.

## Drawing tools

### Erase tool
How to delete geometry.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-erase.mp4" type="video/mp4" />
</video>


* Move the controller over the object you wish to erase and pull the  **trigger**.
* With the **Erase** tool active, as you move the controller a red highlight will indicate what will be deleted if you where to pull the  **trigger**.
* To delete more than one object per click, use the **select** tool to select what you want to delete then use the **Erase** tool to delete that selection.
* Or, with the **Erase** tool active, hold the  **trigger** pressed and move over several objects.

### Line tool
How to draw a line between two points.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-line.mp4" type="video/mp4" />
</video>


* Click one with the  **trigger** to start drawing the line. Move the controller then click a second time to finish the line.
* It is also possible to start drawing the line by pulling in the  **trigger** and holding it in and only releasing it when you want to finish the line.
* You can cancel drawing a line by pressing the **⋮ menu button**, which is highlighted red while drawing a line.
* After drawing a line, if the end point is not a pre-existing point, then it is automatically chosen as the start point of the next line. If you do not want to draw more lines, use **cancel** as described above.

### Arch tool
How to draw an arch with 3 points of control.

* Drawing an arch is similar to drawing a line. Set the start point of the arch by clicking the  **trigger**, move the controller to set the length and click a second time to mark the end point of the arch. Move the controller again to position the third point which the arch will pass through. Pull the  **trigger** a third time to complete the arch.
* While drawing an arch (after setting the start point) you can choose the number of segments the arch will be divided into by scrolling up or down on the **touchpad/thumbstick**.

### Freehand tool
The tool for freehand sketching.

* Either click the  **trigger** once or hold it in to start drawing the line. Click a second time or just release the  **trigger** to end the line.
* The first and last point follow the normal snapping rules, but the rest of the freehand line mostly does not snap to any axis, plane or object.  The exception is that it snaps to faces that contain the first point.

### Rectangle tool
The tool for drawing rectangles.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-rectange.mp4" type="video/mp4" />
</video>

* Either click the  **trigger** once or hold it in to start drawing the rectangle. Click a second time or just release the  **trigger** to end the rectangle.
* The rectangle is oriented so that one side always follows one of the axes. To do a slanted rectangle, you may have to change which axis is followed. To do that, squeeze the rectangle along this axis, then move back.
* While drawing a rectangle with one controller you can use the other to lock an axis or set a length manually. See the section on **Setting lengths** and **Locking** for more information.

### Polygon tool
The tool for drawing polygons with any number of sides. Very similar to the **circle** tool.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-polygon.mp4" type="video/mp4" />
</video>

* Either click the  **trigger** once or hold it in to set the center point of the polygon. Move the controller away and click a second time or just release the  **trigger** to set the radius and complete the polygon.
* The polygon can be drawn inside one of the axis planes, or, if the center touches one or more existing faces, it can be drawn inside the planes of these faces.
* While drawing a polygon (after setting the center point) you can choose the number of segments the polygon will have by scrolling up or down on the **touchpad/thumbstick**.

### Circle tool
The tool for drawing circles. Very similar to the **polygon** tool.

* Either click the  **trigger** once or hold it in to set the center point of the circle. Move the controller away and click a second time or just release the  **trigger** to set the radius and complete the circle.
* The circle can be drawn inside one of the axis planes, or, if the center touches one or more existing faces, it can be drawn inside the planes of these faces.
* While drawing a circle (after setting the center point) you can choose the number of segments the "circle" will be made of by scrolling up or down on the **touchpad/thumbstick**.

## Editing tools

### Push-Pull tool
The tool to extrude out perpendicular a face to create depth.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-push.mp4" type="video/mp4" />
</video>

* Move the controller until it is intersecting with a face. The face will highlight green to indicate which face will be affected. Click once with the **trigger** on the face to start pulling it. Move the controller the desired distance and then either click a second time or release the  **trigger** to finish.

### Extrude tool / Follow Path
The tool to extrude out faces or edges in any direction or along a path. Similar to the **Push-Pull** tool but not limited to only pulling one face perpendicularly.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-extrude.mp4" type="video/mp4" />
</video>

* Move the controller until it is intersecting with a face or an edge. Click once with the  **trigger** on the face or edge to start extruding it. Move the controller the desired distance and then either click a second time or release the  **trigger** to finish.
* Unlike the **Push-Pull** tool, the **extrude** tool can extrude lines. Select some lines (and/or faces) with the **select** tool, then change to the extrude tool and use it in the same way you would extrude a face, by clicking on the selected lines, moving the controller and clicking again to end the extrusion.
* Extruding in Follow Path mode: After you have clicked once, some nearby lines will be drawn in orange. Move the controller over one of these to enter the Follow Path mode. In this mode you can extend the path (always drawn in orange) to any number of contigous lines. Move the controller to follow the path you want, step by step.

### Offset tool
The tool to offset lines on a face.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-offset.mp4" type="video/mp4" />
</video>

* Offset a face. Move the controller until the face you wish to offset is highlighted in green, then either click once with the  **trigger** or hold it in. Move the controller to the desired position and either click a second time or release the  **trigger** to complete the offset.
* Offset lines. Use the **select** tool to select the lines you wish to offset. Then use the **Offset** tool in the same way as you would when offsetting from a face. This requires more than one line to be selected.

### Move tool
How to move and copy objects.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-move.mp4" type="video/mp4" />
</video>

* Move. Move the controller over the object you wish to move. It will highlight purple. Then either click once with the  **trigger** or hold it in, move the controller to the desired position and then either click a second time or release the  **trigger** to complete the move.
* If you want to move more that one thing at a time, use the **select** tool to select them first then use the move tool.
* Copy. To copy an item, start moving it and then scroll up on the **touchpad/thumbstick** to set the number of copies to 1. Now when you complete the move action it will create a copy instead of moving the first object.
* Copy multiple. To create multiple copies, start moving an item, and then scroll up on the **touchpad/thumbstick** to set the number of copies. The new multiple copies will be placed at the same interval as the initial move length.
* Distribute multiple copies. When coping an item if you scroll down on the **touchpad/thumbstick** to set the number of copies the copies will be distributed equally along the length of the move.
* Freehand movement: In normal usage this tool only allows translations but not rotations. However, if you highlight a group, you will see additional circles drawn on the border of the box. Click inside one of these circles to "grab" the group with the controller. Then the group can be moved and rotated around. There are some custom snapping rules in this mode: the eigth corners of the group will try to snap to existing faces if they are close.

### Rotate tool
The tool to rotate objects.

<!---
<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-rotate.mp4" type="video/mp4" />
</video>
-->

* Move the controller over the thing you wish to rotate. It will highlight purple. Click once with the  **trigger** to set the point around which the object will rotate, move the controller away a little to create a leaver and click a second time. Now move the controller to set the rotation you wish and pull the  **trigger** a third time to complete the rotation.
* A circular ruler is shown to tell you in which plane the rotation occurs. If you move the controller outside the ruler, the angle is unconstrained. If you move the controller inside the ruler, the angle is constrained to multiples of either 5 or 15 degrees. The ruler has got dashes on its edge: short ones every 5 degrees and longer ones every 15 degrees. Move the controller near these dashes for 5-degrees snapping. Move the controller farther inside the ruler for 15-degrees snapping.
* Like the **Move** tool you can create one or multiple copies when rotating. While rotating, scroll up or down on the **touchpad/thumbstick** to set the number of copies you wish to make. It you scroll up the copies will be spaced at regular intervals based the the rotation you choose. If you scroll down the copies with be equally distributed along the rotation you choose.

### Scale tool
The tool to scale objects.

<video controls preload="none" poster="./img/docs/placeholder-600x338.png">
  <source src="./img/docs/tool-scale.mp4" type="video/mp4" />
</video>

* Move the controller to highlight the object you wish to scale. It will highlight green. Pull the trigger to bring up the scale axis handles (green cubes). Move the controller to a handle to select the axis you want to scale the object by. Pull the trigger a second time to start scaling the object. Pull the trigger a third time to finish the scale command. 
* To change the scaling center, click on another handle with the other controller. 
* The tool can apply distortion. When it does, a purple line is shown. If you want to avoid distortion, keep the controller over this purple line.

## Other tools

### Paint tool
The tool to choose and place colours and textures on the model.

* Choose a material. Hold in the **⋮ menu button** and move the controller over the paint bucket, then move the controller to the right to select a material from the palette and release the **⋮ menu button** to choose that material.
* Placing a material. With a material selected aim the laser at the face you wish to paint and click with the  **trigger**.
* Eye-drop a material. With the paint tool selected move the controller to touch the face with the material you want. You will see the tool icon will change to a bucket with a red arrow pointing into the bucket. Click with the  **trigger** to make the material of the face become your currently selected material.

### Notes tool
Notes tool is designed for leaving temporary notes in the VR. Simple freehand notes that can be removed later.

* Draw by holding the **trigger** down.
* You can change color by moving the **touchpad/thumbstick** left or right.
* To remove notes, use the **eraser** tool.
* Notes appear in SketchUp too, but only if the "Send to VR" tool is currently selected in SketchUp.

### Tape measure tool
Tape measure can be used for measuring distances and angles.

* The tool always projects a laser in front of it, with a green cross at the end. This green cross is also visible on the computer screen (it is a way to communicate between the person in VR and the person in front of the computer).
* The approximate distance between the controller and the green cross is displayed along the line.
* When the green cross is showing on a face, click the **trigger** to measure the length perpendicular to the face. (This is useful to measure e.g. the width of a corridor.)
* If you move the controller over an object, the tool switches to a different mode: Click the **trigger** once on the starting point, and another time on the ending point. You will see the distance between the two points. After this, move the controller around to see angles.
* The location of the second click is recorded as a special guide point. This point will show up for alignment in all tools that you use afterwards. To remove it, use the **eraser** tool.

### Materials
The tool where you can select, edit and create new materials.

* Enter the material menu. Hold in the **⋮ menu button** and move the controller over the materials icon and then release the button. This will display the materials menu.
* Select a material. While inside the materials menu, click on the vertical bar on the left to access the full materials menu. Use the  **trigger** to click on the material you want. Press the **⋮ menu button** to leave the materials menu.
* You can add more materials to your quick-access palette by clicking on each of them with the **trigger**.
* The quick-access palette is just a list of the most recently used materials. You can reorganize this list by dragging materials around or out of the quick-access palette.
* Edit a material: You can edit the currently selected material with the controls on the right.
    * In the colour bowl you can drag the control point by moving the controller over the point and holding in the  **trigger** and moving the controller. You will see the preview cube update. Moving the point around the circle changes its hue and saturation while moving the point up and down adjusts its value.
    * You can adjust the amount for red, blue, green and transparency of the material by using the  **trigger** to drag the sliders left or right. You will see the preview cube update.
* As common for SketchUp, if you change the color of a material, it affects anything in your model that is currently using this material. Use the "Duplicate" icon if you want to first make a copy.
* To exit the material menu, press the **⋮ menu button**.

### Component tool
The tool to place component inside your model.

* Select a component: Hold in the **⋮ menu button** and move the controller over the component icon and then release the button. This will display a list of all the components in the model. You can choose the one you want to insert by clicking on it with the  **trigger**.
* There are two ways to scroll up and down the menu:
    * While in the component selection menu hold in a **grip** button on either controller and move it to move the menu.
    * While in the component selection menu scroll on the **touchpad/thumbstick** to scroll the menu.
* To exit the component selection menu, press the **⋮ menu button**.

### History tool
The tool to undo or redo any action.

* To undo an action, hold down the **⋮ menu button**, move the controller over the red arrow icon, and then release the **⋮ menu button**.
* When you move the controller over the red action arrow icon, more actions appear below it. Lower icons correspond to older actions. If you select a lower icon, all actions up to that one are undone.
* To redo an action that you have just undone, hold down the **⋮ menu button**, move the controller over the green arrow icon and then release the **⋮ menu button**.
* The redo arrow icon only shows if you have just used the **Undo** tool. If you have undone more than one step, you can also redo more than one step at once.

### Section cut tool
The tool to temporarily cut your model.

* Move the controller to the point at which you want to draw the section plane. Click with the  **trigger** to set the position of the plane, then move the controller to choose the axis perpendicular to the section plane. Click a second time to set the orientation of the plane.
* To remove a section plane, hold in the **⋮ menu button** and choose the **Delete section plane** tool. This tool is only visible if you have already created a section plane.
* You can also use the **eraser**, the **move** and the **rotate** tools on the section plane.
* You can only create one section plane at a time.

### Hide and Un-hide tool
The tool to control what you can and cannot see.

* To hide any geometry, first use the **select** tool to select what you want to hide, then hold down the **⋮ menu button** and move the controller over the **Hide** tool and release the **⋮ menu button**.
* To un-hide all your hidden geometry, first make sure nothing is selected, then hold down the **⋮ menu button** and move the controller over the **Un-Hide all** tool and release the **⋮ menu button**.

### Intersect tool
The tool to compute the intersection of faces (only available from version 2.3).

* Use the **select** tool to select faces or groups, then hold down the **⋮ menu button** and move the controller over the **Intersect** tool and release the **⋮ menu button**.
* In the simple usage, this computes the intersection of the selected face (or faces) with the rest of the model, and adds it as extra edges.
* If you have selected several faces or groups and there is an intersection between them, then this is the intersection that will be computed, and the rest of the model is ignored.


## Tool Extras

### Canceling any action
How to end or stop doing an action.

* To end an action you don't want to finish, press the **⋮ menu button**. This button is shown in red when clicking it will cancel an action in progress.

### Setting lengths
* When dragging out a length like when using the **Line** or **Push/Pull** tools, the length snaps to logical increments depending on the current scale. If you are zoomed out the length might snap to the nearest meter. If you are zoomed in the length might snap to the nearest mm.
* Whenever the length measurement is visible it is possible to manually input a precise length: click on the numbers with the other controller. For example if you start drawing a line with your right controller, you can use the left controller to click on the measurement text. A small calculator window will appear where you can use the  **trigger** to input any length you wish the line to be.

### Snapping
* Axis snapping. Many actions like drawing a line or rectangle automatically snap to the x,y,z axis. The guidelines change colour (red, green and blue) to match the axis currently snapped to. 
* Plane snapping. Many actions also snap to the x,y,z planes. This is indicated by a small coloured square at the controller's tip. The square changes colour to match the plane it is snapping to.
* Point snapping. Many actions snap to the nearest existing point, line, midpoint of a line or face.
* The distance at which snapping starts to happen can be set in the **configurations menu**.
* If you have trouble picking the point you want, try this:
    * Zoom in. This will make the points farther apart, and easier to pick. It is expected that with a little bit of practice you should constantly be zooming in and out when editing.
    * Move the **touchpad/thumbstick** left or right. This will temporarily reduce the snapping distance.

### Locking
* Locking an axis or plane. Many actions like drawing a line or rectangle can have their axis locked. This is done by using the controller not doing the action to click on the length indicator line or plane indicator guideline.
* When locking is available an icon of a lock will appear on the length indicator line.
* To unlock a locked axis or plane, pull the  **trigger** of the controller not doing the main action.
* The rectangle tool has got more advanced locking rules: you can lock any edge of the rectangle being drawn, which fixes this edge's direction and length. It is possible to draw a rectangle which is not aligned to any axis, by locking an edge and moving the other, possibly several times.

### Guidelines
* When drawing, guidelines and reference points (white spheres, also called input points) will appear and mark what points the current action is snapping to.
* When drawing with one controller you can move the other controller over a point to create a reference point and guideline that the first controller can snap to.
* You can also use a single-controller movement: move over a point to create a reference point, and then move back to where you want to be (similar to SketchUp with the mouse).

