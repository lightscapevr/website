# Point Cloud support

<i>
<dl>
  <dt>Point cloud (Wikipedia)</dt>
  <dd>A point cloud is a set of data points in space. Point clouds are
generally produced by 3D scanners, which measure many points on the external
surfaces of objects around them.</dd>
</dl>
</i>

<br>

VR Sketch can display a point cloud in addition to the usual SketchUp model.
Assuming that you have a 3D scanner of some kind, you can use this feature to
build a polygonal model equivalent from the real-space data.  Note that you
*must* send a SketchUp model to VR Sketch in order to display a point cloud;
use an empty model if necessary.

In this documentation, we assume that you have already used a 3D scanner, and
now you have a 3D point cloud in some file format---basically a list of points,
typically containing many million points.

Various tools produce point clouds in various file formats.  In order to use
one of these with VR Sketch, you must first convert it to the POTree format.
In this format, the data is split into many files, organized in a way suitable
for rendering.  If you have more than a few million points, the files are
organized so that only a fraction are loaded and rendered at the same time,
depending on your current position.

For now, VR Sketch only reads the XYZ position and the color of each point.

Rendering point clouds also works with Oculus Quest.  The point cloud data is
sent over the wireless connection as needed.


## Conversion to LAS/LAZ format

LAS is a standard point cloud file format.  LAZ files contain the same data but
compressed.

If your point cloud is not in the LAS or LAZ format, the first step is to
convert it to that format.  (There is also the option to convert to a binary
table; see the documentation of
[PotreeConverter](https://github.com/potree/PotreeConverter/) for more
details.)

We recommend using [CloudCompare](https://www.danielgm.net/cc/), which can
import many of the existing file formats and convert them to LAS.

Here is a brief summary of the procedure:

* Open your point cloud file with CloudCompare

* Select it from the DB Tree list (list of loaded point clouds)

* Click Save icon (or from menu File/Save)

* Select the LAS format

* You can choose the "Highest resolution" option and save as a LAS instead
  of a LAZ: compressing here is pointless, as the LAS is temporary anyway.


## Convertion from LAS/LAZ to Potree

The next step is to use PotreeConverter: get its
[current stable release](https://github.com/potree/PotreeConverter/releases/tag/1.6_2018_07_29).

This is a command-line tool.  In a Windows command-line console, type these
lines (this assumes that `D:\data\inputfile.las` is the LAS file produced in
the previous step; adapt as needed):

<br>

`cd \Where\You\Unpacked\POTreeConverter`

`PotreeConverter.exe D:\data\inputfile.las -o D:\data\potree_converted`

<br>

This can take some time for large point clouds.  It outputs in
`D:\data\potree_converted` a directory structure with the top-level file
`cloud.js` and more data in the `data` subdirectory.  This is the POTree format
required by VR Sketch, suitable for use by the menu item `extensions -> VR
Sketch -> View a point cloud`.
