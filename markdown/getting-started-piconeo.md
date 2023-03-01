
# Pico Neo 3

The Pico Neo 3 is a standalone VR headset that is supported by VR Sketch since release 17.

*Warning: the Pico Neo 4 is not supported.*

The Pico Neo 3 can be used either as a standalone headset (fully supported)
or tethered to a PC with a DisplayPort cable or over wireless (not well-tested but works, see below).


### Installation (in standalone mode)

These instructions are for Windows.  It is likely that something similar
works on Mac (or Linux) but this has not been tested yet.

* Connect the Pico Neo 3 to your PC using any USB cable, like for
  example the charging cable.

* In the headset go to "Settings", then "Developer Mode".  Click and
  allow "USB Debugging".

* Go to your PC.  A window of the Explorer should have opened
  automatically with a folder containing the files on the Pico Neo 3.
  This folder is called "Internal shared storage".

* Download the APK file for Pico Neo 3 from <a href="/downloads.html">our download page</a>
  and copy it into this "Internal shared storage" folder.

* In the headset, go to the File Manager (bottom right button).
  
* At the top of the screen it says "videos", "images" or "APK".  Pick
  "APK", then choose the APK file you just copied.  Confirm that you want to
  install it.

* After installation, VR Sketch should be accessible from the "Library"
  button.  It should be in the folder "All" or in the subfolder "Games"
  (not "Apps").


### More information

For now, please see our documentation about the similar Oculus Quest for
more information.  We will update this page with more specific
information in the future.

Note that many places in VR Sketch still refer to "Oculus Quest" when
they really mean "any standalone headset that we support".  We will fix
this in the future.  When working with our software please understand
that for now most options that apply to Quest also apply to the Pico Neo
3.


### Tethered mode

The Pico Neo 3 can be used tethered to a PC (not a Mac).  It works since
VR Sketch 17.0.9, but we cannot officially endorse it because we only
performed minimal testing and have no first-hand experience of how well
it performs in practice.

Nevertheless, you can try to install it as follows:

- First, follow the official instructions which make it work like a
  SteamVR headset.  Do not install the outdated "Pico Link" found in
  Steam.  Even the Pico web site appears confused and different pages
  promote different versions of this Pico Link.  I believe that
  as of this writing, the latest version of this software is the one found on
  <a href="https://www.picoxr.com/global/software/pico-link">this page</a>
  in the tab "Neo3 Link/Pro/Pro Eye".

- Once you have SteamVR working, you can follow the instructions from
  the <a href="docs-getting-started.html">VR Sketch for PC</a> page.
