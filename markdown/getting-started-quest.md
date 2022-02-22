# Oculus Quest

Oculus Quest and Quest 2 are supported and give almost the same capabilities
as VR headsets connected directly to a PC ("tethered" to a PC).  They work
without needing a beefy VR-ready PC.  They can work in purely standalone
mode to view cloud models, or they can work together with a PC or Mac
running SketchUp.

Note that the "Oculus Link" cable offers a different way to use the Quest:
tethered to the PC.  In this mode, the rendering is done on the PC like with
other tethered solutions.  These solutions are described in the <a
href="docs-getting-started.html">VR Sketch for PC</a> page.  Like all other
tethered solutions, this does not work on Mac.

Please be aware that the Quest itself has troubles rendering very large models,
because it is not as powerful as the tethered VR solutions.  See [Rendering
of large models](#large-models) below.

*Note:* do not subscribe to the Oculus Public Test Channel.  Your Quest would
be updated to a more recent version of the firmware than the one we can test
with: we did not manage to subscribe ourselves so far.  It would mean that you
could get new bugs related to a firmware version that we cannot run.


### Installation

In the Quest, install the application "VR Sketch".  You have to search for it
by name (big main page, "Search" button at the top right, enter for example
"vrsketch").  It is in the "App Lab" category, so you have to click "App Lab".
Here is a direct link: <a href="Her://www.oculus.com/experiences/quest/3557027837758788/">https://www.oculus.com/experiences/quest/3557027837758788/</a>

If you want to use it together with SketchUp on a PC or a Mac, you need to
install <a href="docs-getting-started.html">VR Sketch for PC/Mac</a> too.


### Start VR Sketch

In the Quest, run the app "VR Sketch" (from the "Apps" tab on the floating panel).

You are sent to the VR Sketch studio with a floating dialog box in
the middle.  A 6-digit number appears at the top of this dialog box.
This is the unique identifier for your Quest.

The Quest must generally be connected to the Internet via wireless.  If it has
got no connection, it should still be able to display cloud models that have
already been downloaded before ("cached"), but nothing more---unless you use the
workaround described next.

If you have problems with the wireless connection, either of setting it up or of
performance, and if you don't want to go for trying to render on the PC with the
cable constantly connected, then you can try an unofficial workaround that uses
the cable only for sending the model.  See
<a href="https://forum.vrsketch.eu/t/first-impressions-suggestions/114/21">this post</a>
in the forum.


### View demos models

In the dialog box, pick one
of the demo models to see it. You can come back later to this dialog box to
choose another model (use the "cloud" icon, bottom-right in the tools).

IMPORTANT: VR Sketch on Oculus Quest is running in the same "collaborative
viewing" mode as VR Sketch on PC when viewing any cloud model.  This means that
if there are other people that visit the same cloud model at the same time,
then everybody will see each other's avatars and hear what they say.  Please
keep it in mind when viewing the public demo models.


### Edit with SketchUp running on your PC or Mac

*You must install VR Sketch on both the computer and the Quest.*

On Mac, you need SketchUp 2020 to really be able to edit: previous versions don't
support the "open group" command from VR.  On PC, any SketchUp from 2017 works
(including SketchUp 2017 Make).

On your PC or Mac, make sure you have installed the latest version of <a
href="downloads.html">VR Sketch for PC/Mac.</a>  The same .rbz file works for
both PC or Mac.  If you just upgraded, make sure your restart SketchUp now.

Then choose "Extensions", "VR Sketch", "Send to VR on Oculus Quest".
Equivalently, pick the second icon in the VR Sketch toolbar.

Make sure the Quest is currently running VR Sketch, and wake it up now (e.g. by
putting your hand inside the space where your head normally goes, near the
top of the nose).

You need to enter manually the 6-digit number (see "Start VR Sketch") in the
SketchUp dialog box and press "Go".

For performance reasons, it is recommended to try to connect your PC or Mac to
the same wireless network as the Quest.  If the Quest is not detected locally,
you will see "encrypted connection via the cloud".  Use the "(?)" link next to
this message for more information.


### View your own cloud models

Viewing cloud models on Quest can be done with or without the help of a
computer running SketchUp.

If you have a long model URL of the form
``https://vrsketch.eu/m/####################``, then you can go to the
PC/Mac running SketchUp, "Extensions", "VR Sketch", "View cloud model" and
paste that long URL there.  Then click "Go on Quest" and finish like
explained above.

On the other hand, you can also associate your Quest with your own cloud
account.  This requires you to have a registered version of VR Sketch to
initially upload the model, but you don't need a PC/Mac any more once it is
done (e.g. because you are carrying with you your Quest, but not your computer,
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



### <a name="large-models">Rendering of large models</a>

The Quest doesn't have the power of a good PC, but it's still OK if the models
are not too large.
In SketchUp, go to Window -> Model Info -> Statistics, select "Enable nested
components", and check the "Faces" line.  The Quest 1 will handle nicely up to
~200'000 faces as an order of magnitude.  The Quest 2 will handle models that
are somewhat bigger, but still in the same order of magnitude.

In VR, you can check the rendering speed in the Settings dialog.  The
normal rendering speed of the Quest is 72 frames per second; we don't recommend
looking at models at less than 40 frames per second for longer than a few
minutes.

When opening models with many or excessively large textures, they will be
rendered at a lower resolution to fit the memory requirements of the Quest.
Nevertheless, large models may trigger an out-of-memory condition, notably
if their geometry is too complex.
There are several different things that can occur in this case.  It can close
the VR Sketch program while loading the model, or the headset's view can turn
completely black (exit with the "Oculus" button on the right-hand controller).
We try to detect when the situation occurs and display a message to this
effect, but sometimes it will only be displayed the next time you restart VR
Sketch.


### If your computer goes to sleep

When you are working in VR, your computer might go to sleep.  The reason is
simply that you are not using the mouse or keyboard for a long enough period
of time.

Note that VR Sketch version 14.0 does contain an attempt at
preventing sleep, but it is known to not work reliably.  This is notably the
case on Mac, depending on the exact system version.

If you hit this problem, you need either to disable sleep mode manually in
the system, or to install a third-party application to do it with one click
(e.g. Amphetamine Mac/PC, Caffeine Mac/PC, etc.).


### Installation without using the App Lab

This is the old installation process.  We keep the documentation here in case
you want to install a different version than the one currently on the App Lab.

**Be sure you have the right cable:**

You will need a cable to physically connect your computer to the Quest (only
during installation).  The long charging cable that comes with the Quest works
fine if you have a USB-C connector on your computer.  If you don't, you will need
either a USB-C-to-USB-2 cable, or a converter.

Note that the computer that you use to install things into the Quest doesn't
have to be the same computer as the PC/Mac on which you have SketchUp.
It can also be any other computer (including Windows, Mac or Linux).

**Install SideQuest:**

<a href="https://sidequestvr.com/#/setup-howto">Install SideQuest</a>
for PC, Mac or Linux as documented on that page.

**Install VR Sketch for Quest:**

This assumes that you have downloaded a file with extension ".apk", which
contains the version of VR Sketch you want to install on your Quest.

With SideQuest running, drag and drop this apk file from your computer's folder
to the SideQuest window (you may have to drop it precisely on the green dot in
the top-left corner; it will say "Drop file(s) here!"). To view the result, or
if there are errors, click the colorful number "1" among the top-line icons.

If everything worked correctly, then in VR, "VRSketch" is installed.  It might
appear in the "Unknown sources" page, depending on whether you previously
installed the App Lab version or not.  Here is how to find this page:
in the Quest's home environment, click on the
<span style="letter-spacing: -.6em">&#x22ee;&#x22ee;&#x22ee;</span>
&nbsp;&nbsp;(3x3 dots) button.  The button in the top-right corner
says "All" by default.  Click this button, and scroll down and pick
"Unknown sources".  You should see "VRSketch" in this page.
