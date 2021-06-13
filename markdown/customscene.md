# Making a custom background scene in Unity

VR Sketch is written in Unity.  In version 16.0 we added the ability to load
your own Unity scene as the background of a SketchUp model.  When viewing such
a model inside VR Sketch, you get a superposition of the Unity scene and the
actual SketchUp model.  You can use this to render the background using the
extra rendering quality of Unity's static scenes: advanced precomputed
lighting, particle system effects, custom shaders, and so on.  Within this
static background, you can view and edit the usual SketchUp model.

Note that there are many limitations and complexities in this approach.  Please
read carefully at least the following section to decide if it is worth it in
your case.  We also did not test it extensively, so if at some point something
does not work, try again to follow the instructions here more closely and
report issues to `info@baroquesoftware.com`.

This document assumes that you are at least somewhat familiar with Unity.


## Requirements and restrictions

* You need to use the same version of Unity that VR Sketch uses, or at
  least a very close one.  At the time of this writing we use Unity
  2019.1.14f1.  However, we upgrade from time to time; your background
  scenes will then need to be regenerated.  They will likely fail to open
  in a version of VR Sketch that uses a mismatching Unity version.

* The Unity scene needs to be generated twice: once for use on Windows
  (for PC VR), and once for use on Android (for Oculus Quest).  If you
  only ever need one of these platforms then you can skip the other one.
  Otherwise, make sure you have installed both the Windows PC and the
  Android targets in Unity.

* Your custom scene can use common Unity object types because they are
  already present in the base VR Sketch program.  But it cannot include
  any custom script (`.cs` file), for example.  The exact set of Unity
  objects that can or cannot be included is not clearly known.  Particle
  systems work; custom shaders should work but are untested so far.
  Any 3rd-party Unity asset will not work if it relies on runtime code.
  Also, Terrain, Batching Static, and Light Probes objects do not work
  (see next point).

* Internally, VR Sketch loads your scene in the following slightly convoluted
  way: it has already got many game objects around that are important, so
  it makes them all DontDestroyOnLoad, then loads your scene (non-additively
  to make sure the lightmap and other settings are applied), then reparents
  everything from your scene into one of the pre-existing DontDestroyOnLoad
  objects, the one that is moved and rotated and scaled by the user.  This
  means that correctly-prepared precomputed lighting works, as described
  below, but for example Terrain and Light Probes objects are not supported
  because they cannot be rotated or rescaled at runtime.


## Scene setup in Unity

Prepare your scene, e.g. by importing some external model or otherwise
making it ready in Unity.  Once that is done, follow the instructions
here to configure it for VR Sketch.

Most or all the objects in your scene should have the following flags,
as shown in the first few lines in the inspector (this can be easily
achieved by putting all objects into a parent object and applying these
settings on the parent, including all children):

    [X] Object name           [-] Static
    Tag [Untagged]    Layer [Default]

What is important there is the settings for `Static`.  The Static must be
partial, more precisely, when you click on the down arrow, you get this list:

        Nothing
        Everything
    [X] Lightmap Static
    [ ] ...
    [ ]  (several lines, not checked)
    [ ] ...
    [X] Reflection Probe Static

It's important that `Lightmap Static` is set, to get the precomputed lights,
and that `Batching Static` is NOT set, otherwise we won't be able to move and
rotate and rescale the scene in VR Sketch.

Include one main light, typically a directional light, with `Mode: Mixed` and
`Render Mode: Important`.  Add any number of additional lights with
`Mode: Baked`.  These ones will be included in the baked lightmaps but ignored
by the rest of the runtime.  The main light won't be reorientable at runtime
when your scene is shown (the VR Sketch option to do that will be disabled).

The `Lighting` settings of your scene should be similar to the ones used
normally in VR Sketch; it is untested what occurs if they are different.
These are:

    Realtime Lighting
        Realtime Global Illumination    [ ]    (off)

    Mixed Lighting
        Baked Global Illumination       [X]    (checked)
        Lighting Mode                   [PC: Baked Indirect]
                                        [Quest: Subtractive]

The `Lightmapping Settings` can be anything you like for your scene.  Build
your lightmaps, tweak and repeat until you are happy with the result.
(Note that I've got various problems using various settings.  I have no clue
about the details, but in case of troubles, try to make them closer to the
ones in VR Sketch: Progressive CPU, Directional on PC and Non-Directional on
Quest.  Avoid Ambient Occlusion in the lightmapper on PC: the PC does its own
runtime ambient occlusion.  You can turn it on for Quest.  Don't worry if the
direct shadows look blocky in the editor in Android mode: VR Sketch uses its
own smooth direct shadow logic.)

The scene can contain any number of `Reflection Probe` objects.  These are
important to get right, otherwise the color of dynamic walls or floors or
ceilings will appear wrong.  You can put none, but then all dynamic drawings
will assume a plain white light color, instead of a color influenced by the
nearby static scene.  The Reflection Probes don't need to be super precise
because most VR Sketch objects are not really reflective.  (Doing e.g.
mirrors wouldn't work too well with Reflection Probes anyway, because they
would reflect the standard warehouse instead of whatever the user is
making.)

The scene SHOULD NOT contain `Light Probe Group` objects.  These ones are
not correctly moved when we move and rotate and rescale the scene.  The
effect that you miss should "only" be that dynamic objects don't get any
light at all from the additional baked lights.  I think that the main
directional light always works as expected with a mixture of static and
dynamic objects, casting shadows from one to the other.  So for example,
if your main directional light doesn't reach most of the scene because
it's a closed interior place, then the dynamic objects (the avatars and
the dynamic SketchUp model) will mostly be in the shadows, and won't
receive lights cast by additional baked lights.  If this is a problem,
consider making two directional lights: one with `Mode: Baked` only for
the lightmapped baking, and one with `Mode: Realtime` with a culling mask
that ignores a specific layer; and put all your static scene into that
layer.  (Choose the layer numbers 20-25, as VR Sketch doesn't use these
numbers.)

Your scene can contain non-static geometry objects.  These ones are
rendered like the rest of the dynamic geometry.  That's useful notably
to test what I described above, and to put some objects that show up with
the same lighting conditions as the dynamic geometry that VR Sketch itself
creates.

Your scene must contain colliders, otherwise the teleporting beam will
pass through the floor and when using continuous walking you won't climb
up or down steps nor slopes.  If the scene is made by importing some
external model into Unity, the Unity importing options typically contain a
`Create colliders` option.  For very geometrically complex scenes you might
consider the standard approach used in gaming, which is to make colliders
based on a simpler version of the model.  Objects with colliders will be
moved to layer number 18 by VR Sketch.

You need to use Color Space: Linear in Project settings -> Player ->
Other settings.  Otherwise, you'll build an asset that assumes the Gamma
color space but is loaded in Linear by VR Sketch, making all colors
completely washed out.

In summary:

* Edit -> Project settings -> Player -> Other settings -> Color Space
  must be set to Linear.

* The scene should contain only static geometry, dynamic geometry,
  colliders, baked lights, a single mixed directional
  light, and reflection probes.  You should remove the rest, like
  any camera.  The bundle called `s` contains this scene file.

* The scene lightmaps should typically be baked, but the corresponding
  files are not included in the bundle by Unity for unknown reasons.
  Putting them in a separate bundle called `t` fixes this problem.

* If you are using custom shaders, it is untested if Unity will include
  them in the `s`.  If needed, put them in the `t` bundle too.  If that
  doesn't work either, try to ALSO put them in a folder called
  `Resources` (but this is all untested).

* Internally, VR Sketch loads your scene in the following slightly convoluted
  way: it has already got many game objects around that are important, so
  it makes them all DontDestroyOnLoad, then loads your scene (non-additively
  to make sure the lightmap and other settings are applied), then reparents
  everything from your scene into one of the pre-existing DontDestroyOnLoad
  objects, the one that is moved and rotated and scaled by the user.  That
  approach should work as long as game objects you put in your scene are
  happy with being reparented in a mobile object; this is why Batching Static
  cannot be set and why Light Probes cannot be used.


## Building

To build:

* This assumes you are using the same or a similar Unity version than the
  one we do for VR Sketch.  See the current version number at the top of
  this page.

* You need to have installed both the Windows PC and the Android targets
  in Unity.  This is needed to produce the Oculus Quest versions as well
  as the PC versions of your scene.

* Create a script `VRSketchSceneBuilder.cs` into a folder called `Editor`
  in your assets.  Paste the following code into this file.  This causes
  the menu `VR Sketch` to show up in the menu bar:

        using UnityEngine;
        using UnityEditor;
        using System.IO;

        public class VRSketchSceneBuilder
        {
            static string GetDirectory(string relpath)
            {
                string result = Path.Combine(Application.temporaryCachePath, relpath);
                if (!Directory.Exists(result))
                    Directory.CreateDirectory(result);
                return result;
            }

            static string Build1(string dirname, BuildTarget target)
            {
                string path = GetDirectory("VRSketchSceneBuilder/" + dirname);
                var result = BuildPipeline.BuildAssetBundles(
                    path,
                    BuildAssetBundleOptions.None,
                    target);

                if (result == null)
                    throw new System.Exception("BuildAssetBundles failed for target " + dirname);

                string[] names = result.GetAllAssetBundles();
                if (names.Length != 2)
                    throw new System.Exception("Expected 2 asset bundles, got " + names.Length + ": " + string.Join(", ", names));

                names[0] = names[0].ToLowerInvariant();
                names[1] = names[1].ToLowerInvariant();
                if ((names[0] == "s" && names[1] == "t") ||
                    (names[0] == "t" && names[1] == "s"))
                {
                    /* OK */
                }
                else
                    throw new System.Exception("Excepted 2 asset bundles called 's' and 't', got " + string.Join(" and ", names));

                return path;
            }

            static void MaybeDelete(string target_path, string filename)
            {
                string path = Path.Combine(target_path, filename);
                if (File.Exists(path))
                    File.Delete(path);
            }

            static void CopyFiles(string source_path, string target_path, string arch)
            {
                File.Copy(Path.Combine(source_path, "s"), Path.Combine(target_path, arch + "_s.unitybundle"));
                File.Copy(Path.Combine(source_path, "t"), Path.Combine(target_path, arch + "_t.unitybundle"));
        #if false
                if (arch == "android")
                {
                    var p2 = Path.Combine(Application.dataPath, "LoaderDemo");
                    File.Copy(Path.Combine(source_path, "s"), Path.Combine(p2, "android_s.bytes"), true);
                    File.Copy(Path.Combine(source_path, "t"), Path.Combine(p2, "android_t.bytes"), true);
                }
        #endif
            }

            static void ClearConsole()
            {
                /* bah */
                var logEntries = System.Type.GetType("UnityEditor.LogEntries, UnityEditor.dll");
                var clearMethod = logEntries.GetMethod("Clear", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);
                clearMethod.Invoke(null, null);
            }

            [MenuItem("VR Sketch/Make VRSketchScene bundles for current platform")]
            static void BuildAllAssetBundles()
            {
                ClearConsole();

                string path1, arch, other_arch;
                switch (EditorUserBuildSettings.activeBuildTarget)
                {
                    case BuildTarget.StandaloneWindows64:
                        arch = "win64";
                        other_arch = "android";
                        break;

                    case BuildTarget.Android:
                        arch = "android";
                        other_arch = "win64";
                        break;

                    default:
                        Debug.LogError("The current build target is set to an unknown one: " +
                            EditorUserBuildSettings.activeBuildTarget);
                        return;
                }

                var target_path = Path.Combine(Application.dataPath, "VRSketchScene");
                if (Directory.Exists(target_path))
                {
                    MaybeDelete(target_path, arch + "_s.unitybundle");
                    MaybeDelete(target_path, arch + "_t.unitybundle");
                }
                else
                    Directory.CreateDirectory(target_path);

                GetDirectory("VRSketchSceneBuilder");

                path1 = Build1(arch, EditorUserBuildSettings.activeBuildTarget);
                CopyFiles(path1, target_path, arch);

                Debug.Log("Scene built for " + arch + " in directory Assets/VRSketchScene.  " +
                    "Don't forget it must also be built for " + other_arch);
                AssetDatabase.Refresh();
            }
        }

* Click on your scene file in the Assets, and at the bottom of the
  inspector, pick an `AssetBundle` name (choose `New...` the first time)
  and call it simply `s`.

* In the same directory, click on the folder with the same name as the
  scene file.  (This is where the lightmap data is stored.)  A similar
  AssetBundle entry should appear in the inspector; you need to click
  once on the folder itself, not open it.  Put the AssetBundle name `t`.

* Now with your scene opened, pick the `VR Sketch` menu, the only item.
  It makes and packages 2 files into a directory called
  `Assets/VRSketchScene/`.  Look in the console for potential errors.
  (You can ignore the warnings `cannot be included: LightingData.asset`).

* Switch to the other platform in `File, Build Settings...`, tweak and
  maybe rebuild your lightmap data, and finally pick the menu item again.
  It makes 2 more files in the same directory `Assets/VRSketchScene/`.


## Using the custom scene in your own SketchUp models

The custom scene can't be enabled by default everywhere (for now): it is
enabled for specific SketchUp models.  When opening that file with VR Sketch,
your custom scene will be loaded instead of the standard warehouse, and can't
be turned off: as you move and rotate and scale the world, it moves and
rotates and scales like the rest of the dynamic SketchUp model.

It is enabled by setting an attribute in the model.  In SketchUp, with
your model loaded, open the Ruby console and type:

    Sketchup.active_model.set_attribute('Baroque_VRSketch_scene', 'directory', 'C:\Path\to\VRSketchScene')

The last argument is the path to the directory `VRSketchScene` on
your machine, either an absolute path starting with `C:\` or `D:\` or
something, or a path relative to the folder in which your .skp file is saved.
It should be the name of a directory with the 4 files called
`{win64,android}_{s,t}.unitybundle`.

The goal is that VR Sketch should load files in this directory when you start
it locally, and that it should upload this data (with proper caching) to other
people in collaborative-editing or in cloud-model-viewing mode.

By default, custom scenes are loaded at 1:1 scale and your starting position is
SketchUp position `(0, 0, 0)`.  You can change that initial scale and location,
though it is a bit hard to do without a specific UI.  The easiest is
to install the SketchUp extension `Attribute Editor` from Eneroth.  Then pick
`Extensions`, `Attribute Editor`, `Current Model`.  You should see
the block 'Baroque_VRSketch_scene' that you created with the above command,
with the `directory` key.  Click `Add key` on the next line, name it
`initial_position`, click `Point/Vector from Model`, and click in the model on
that position---it should be a point on the floor.
To the question `Convert point to array?` answer `No`.
Then click OK.  You can click again on the line `initial_position` to change
it at any time.  Changing the initial scale is done as follows: click `Add key`,
name it `initial_scale`, and type a number like 0.2 to have the initial scale be
1/5 (i.e. the custom scene along with the SketchUp model should be initially 5
times smaller than actual size).  To know the actual scale, you can try to
load it in VR, and scale down (grip button on both controllers) and look at
the scale displayed in VR.  Convert that to a single fractional number by
doing the division manually.  If unspecified, the `initial_scale` defaults to 1.
