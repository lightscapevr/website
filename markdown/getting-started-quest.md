# Oculus Quest

Oculus Quest is supported and gives the same capabilities as VR headsets
connected directly to a PC ("tethered" to a PC).  It works without needing a
beefy VR-ready PC.  It can work in purely standalone mode to view cloud models,
or it can work together with a PC running SketchUp.  (A future version might
work with a Mac running SketchUp.)

*Note that VR Sketch 9.1 for Quest was limited to viewing cloud models.*

Note that the beta "Oculus Link" offers a different way to use the Quest:
tethered to the PC.  In this mode, the rendering is done on the PC like with
other tethered solutions.  These solutions are described in the <a
href="docs-getting-started.html">VR Sketch for PC</a> page.


### Installation

Our software is not officially sanctioned by Oculus.  This makes installing it
a rather lenghty process; there is nothing we can do about that.  You will even
have to register on the Oculus web site as a "developer"---even if you are not.
It is just a poor choice of words in our opinion.  Oculus knows about and
recognizes such usages.


### Be sure you have the right cable

You will need a cable to physically connect your computer to the Quest (only
during installation).  The long charging cable that comes with the Quest works
fine if you have a USB-C connector on your computer.  If you don't, you'll need
either a USB-C-to-USB-2 cable, or a converter.

Note that this computer doesn't have to be the same computer as the PC which
runs SketchUp and VR Sketch.  It can be any Windows or Mac or Linux computer.


### Install SideQuest

<a href="https://sidequestvr.com/#/setup-howto">Install SideQuest.</a>  Follow
the steps 1 to 5 (step 6 is not required).


### Install VR Sketch for Quest

Download <a href="downloads.html">VR Sketch for Quest.</a>  It is a file with
the extension ".apk".

With SideQuest running, drag and drop this apk file from your computer's folder
to the SideQuest window (you may have to drop it precisely on the green dot in
the top-left corner; it will say "Drop file(s) here!"). To view the result, or
if there are errors, click the colorful number "1" among the top-line icons.

If everything worked correctly, then in VR, inside the Quest's home
environment, you can go to the Library and pick the "Unknown sources" page.
You should see "eu.baroquesoftware.VRSketch" there.


### Start VR Sketch

In the Quest, run "eu.baroquesoftware.VRSketch" (in "Library", "Unknown
sources").  You are sent to the VR Sketch studio with a floating dialog box in
the middle.  A 6-digit number appears at the top of this dialog box.
This is the unique identifier for your Quest.

The Quest must generally be connected to the Internet via wireless.  If it has
got no connection, it should still be able to display cloud models that have
already been downloaded before ("cached"), but nothing more.


### View demos models

In the dialog box, pick one
of the demo models to see it. You can come back later to this dialog box to
choose another model (use the "cloud" icon, bottom-right in the tools).

IMPORTANT: VR Sketch on Oculus Quest is running in the same "collaborative
viewing" mode as VR Sketch on PC when viewing any cloud model.  This means that
if there are other people that visit the same cloud model at the same time,
then everybody will see each other's avatars and hear what they say.  Please
keep it in mind when viewing the public demo models.


### Edit with SketchUp running on your PC

*This requires VR Sketch 10.0 on both the PC and on Quest.*

On your PC running SketchUp, make sure you have installed the latest version
of <a href="downloads.html">VR Sketch for PC.</a>  (If you just upgraded,
make sure your restart SketchUp now.)

Then choose "Extensions", "VR Sketch", "Send to VR on Oculus Quest".
Equivalently, pick the second icon in the VR Sketch toolbar.

Make sure the Quest is currently running VR Sketch, and wake it up now (e.g. by
putting your hand inside the space where your head normally goes, near the
glasses).

* If your PC is directly connected to the same wireless network as the
  Quest, then it 6-digit number should appear automatically on the PC.  Pick
  this number and click "Go".

* If your PC is not directly connected to the wireless
  network, you need to enter manually the 6-digit number (see "Start VR Sketch"
  above).  In that case, communication between the PC and the Quest will occur
  via our own cloud servers.

(Security notice if you care about keeping your data to yourself: in local
wireless mode, communications are not encrypted.  They *are* usually encrypted
by the wireless protocol itself.  Don't use password-less wireless networks or
wireless networks with untrusted people on it.  On the other hand, in
over-the-cloud mode, communications are always encrypted between the PC and our
servers, and between our servers and the Quest.  Only an attacker that would
take control of our own servers could see the exchange in clear.)


### View your own cloud models

Viewing cloud models on Quest can be done with or without the help of a
PC running SketchUp.

If you have a long model URL of the form
``https://vrsketch.eu/m/####################``, then you can go to the
PC running SketchUp, "Extensions", "VR Sketch", "View cloud model" and
paste that long URL there.  Then click "Go on Quest" and finish like
explained above.
*This requires VR Sketch 10.0 on both the PC and on Quest.*

On the other hand, you can also associate your Quest with your own cloud
account.  This requires you to have a registered version of VR Sketch to
initially upload the model, but you don't need a PC any more once it is
done (e.g. because you are carrying with you your Quest, but not your PC,
and want to make a demo).

To do so, you need to authorize your Quest to access the models from your cloud
account.  To do this, in the Quest's initial floating dialog box, pick "My
Account".  A 4-digits code is presented to you.  (This is a temporary 4-digits
code unrelated to the 6-digits Quest number.)  Exit the Quest, go to your <a
href="https://vrsketch.eu/cloud.html">cloud account page,</a> and log in if
necessary.  Then click the button "Oculus Quest menu", and copy the 4-digits
code there.

Then go back to the Quest.  Your cloud models should be listed there too and
you can pick one model to view it.

The above procedure gives your Quest read-only access to all your models, as
listed below on your <a href="https://vrsketch.eu/cloud.html">cloud account
page.</a>  The association remains in effect even if you shut down and restart
the Quest somewhere else, or if you add more models to your cloud account.  In
order to revoke this access, you need to log in into your <a
href="https://vrsketch.eu/cloud.html">cloud account page</a> again, and in the
"Oculus Quest menu" pick the "Remove" button.


### Rendering of large models

Check the rendering speed in the Settings dialog; the Quest doesn't have the
power of a good PC, but it's still OK if the models are not too large.  The
normal rendering speed of the Quest is 72 frames per second; we don't recommend
looking at models at less than 40 frames per second for longer than a few
minutes.

Opening large models (either geometrically complex or with many textures)
may trigger an out-of-memory condition.  There are several different ways
this can occur.  It can close the VR Sketch program while loading the model,
or the screen can turn completely black (exit with the "Oculus" button on
the right-hand controller).  We try to detect when the situation occurs and
display a message to this effect, but sometimes it will only be displayed
the next time you restart VR Sketch.
