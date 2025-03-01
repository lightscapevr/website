# Built-in model editor

An experimental mode allows editing models independently of SketchUp.
It is included with VR Sketch 24, for now only on the standalone Quest
or Pico Neo versions.  See the "local files" tab in the initial dialog
box.

In this mode, files are saved in VR Sketch's internal format directly on
the Quest or Pico Neo device.  No PC/Mac nor internet connection is
required to view and edit these files.

To **import** an existing model from elsewhere, you need to use SketchUp
on a PC/Mac (for now; this might change in the future).  You can use the
free SketchUp 2017 Make with the VR Sketch extension installed.  On
PC/Mac, import your model into SketchUp, then click "Extensions -> VR
Sketch -> Send to VR on Quest/Pico.  You should see the model in the
Quest.  The final step is to save the model as seen in the Quest into a
local file, by going to the initial dialog box ("cloud" icon on the
bottom right of the tools), then going to the "local files" tab, and
clicking the "&equiv;" button.

A local file can be freely edited on the Quest with no outside
connection.  A few functionalities are not implemented yet; when you try
to use them, you will get an error (for example, trying to load a
texture image; adding tags a.k.a. layers; making scenes).

To **export** a local file, the only option for now is to export it to a
COLLADA file (.dae).  Find the file in the list of local files, click on
its associated "&equiv;" button, and choose "export to COLLADA".

The COLLADA is written as a file with the .dae extension on the headset
itself.  To find it, follow the instructions below.


### <a name="access">Finding the exported files on the headset from a PC/Mac</a>

* Mac only: you first need to install extra software for transferring
  files from an Android Device to a Mac.  See for example
  https://www.macworld.co.uk/how-to/mac-software/transfer-android-mac-3683573/.

* Plug in the headset into the computer using a USB cable.  The charging
  cable of the headset should work fine.

* The first time, you need to put your headset on and accept some dialog
  box that requests permission.  This allows the connected PC to access
  the headset's files.  The details of how you do that changes quite
  often, but in February 2025 it was as a small message that appears for
  5 seconds in the main environment.  You have to click on it before it
  disappears.  You can unplug and plug the cable again to get another
  chance.

* On the PC/Mac, the headset should appear as an extra drive like any
  other external device.  On PC, open the explorer; it should be called
  e.g.  "Quest 3" under the top level "This PC".  If you don't see it,
  try again the previous point.

* Open this "Quest 3" drive, then follow "Internal shared storage",
  "Documents", "VREXport".  This folder contains the .dae files.  If
  there are textures, they are found in a subfolder with the same name
  as the .dae file.  You can copy them to your PC/Mac.

* Note that the "Documents", "VRSketch" folder contains all the local
  files in the internal file format.  You can copy them around for
  backup purposes or to move them to another Quest, for example.
