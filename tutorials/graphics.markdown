---
title: 3D Graphics
---

<script
    type="text/javascript"
    src="../js/pacioli-0.5.1.bundle.js">
</script>
<script
    type="text/javascript" 
    src="graphics.js">
</script>

# 3D Graphics

<!--
<pacioli-scene
    id="my-scene"
    definition="graphics:blocks_scene1"
    width="690"
    axis grid>
</pacioli-scene>
<pacioli-controls for="my-scene"></pacioli-controls>

<pacioli-scene
    id="my-scene1"
    definition="graphics:blocks_scene3"
    width="690"
    axis grid>
<parameter label="top" unit="metre">1</parameter>
<parameter label="middle" unit="metre">2</parameter>
<parameter label="bottom" unit="metre">3</parameter>
</pacioli-scene>
<pacioli-controls for="my-scene1"></pacioli-controls>
<pacioli-inputs for="my-scene1"></pacioli-inputs> -->

The [graphics](/doc/graphics.html) library allows 3D programming thanks to the [three.js][threejs] library.

3D graphics are displayed by constructing a `Scene`. A scene containts all grahics elements to
display. It can be added to a web page.

<style>
    pacioli-controls {
        .run {
            margin: 10pt;
            background: red !important;
        }
    }

    pacioli-controls::part(buttons) {
        button {
            margin: 10pt;
            background: red !important;
        }
    //add your css properties
}
</style>

<pacioli-controls for="my-animation"></pacioli-controls>

<pacioli-scene
    id="my-animation"
    definition="graphics:blocks_animation"
    kind="animation"
    width="690"
    axis grid>
<parameter label="top" unit="metre">1</parameter>
<parameter label="middle" unit="metre">2</parameter>
<parameter label="bottom" unit="metre">3</parameter>
</pacioli-scene>
<pacioli-inputs for="my-animation"></pacioli-inputs>

## Creating a scene

Create file `blocks.pacioli` with the following content.

    declare blocks_scene :: Scene(metre, Geom3!);

    define blocks_scene = empty_scene("blocks");

Function `empty_scene` creates an empty scene. It expects
a short description that is only intended for identifying the scene in log and error messages.

The type declaration is optional. In the remainder type declarations are included for readability.
They are not required.

Compile the file to javascript using the menu or with command

    pacioli compile -target javascript blocks.pacioli

This should produce file `blocks.js`.

## Adding the scene to a web page

Web components are the easiest way to work with 3D graphics. Create a file blocks.html and add

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Graphics Tutorial</title>

            <script type="text/javascript" src="pacioli-0.5.1.bundle.js"></script>
            <script type="text/javascript" src="blocks.js"></script>
        </head>

        <body>
            <pacioli-scene
                definition="blocks:blocks_scene"
                axis grid>
            </pacioli-scene>
        </body>
    </html>

This should show an empty scene.

## Adding a Block

To add a block to the empty scene, change `blocks_scene` as follows

    define blocks_scene =
        let
            block = cube_mesh(3*|metre|, make_color("blue"))
        in
            add_meshes([block], empty_scene("blocks"))
        end;

Function `cube_mesh` creates a cube. The cube's centre is positioned at the origion.

After compilation the scene should now contain a blue block at the origin.

## Positioning Blocks

To stack multiple blocks we add helper function `make_block`.

    declare make_block ::
        (metre, Color, metre) -> Mesh(metre, Geom3!);

    define make_block(size, color, offset) =
        begin
            mesh := cube_mesh(size, color);
            mesh := move_mesh(mesh, space_vec(0*|metre|, 0*|metre|, offset));
            return mesh;
        end;

It creates a cube and shifts its position vertically for a given amount.

Define some constants for the colors

    define COLOR_S = make_color("red");
    define COLOR_M = make_color("green");
    define COLOR_X = make_color("blue");

and change the scene as follows.

    declare blocks_scene ::
        (metre, metre, metre) -> Scene(metre, Geom3!);

    define blocks_scene(small, medium, large) =
        let
            large_block =
                make_block(large, COLOR_L, 0.5*large),

            medium_block =
                make_block(medium, COLOR_M, large + 0.5*medium),

            small_block =
                make_block(small, COLOR_S, large + medium + 0.5*small),

            scene = empty_scene("blocks")
        in
            add_meshes([small_block, medium_block, large_block], scene)
        end;

The blocks scene now is a function that expects the size of the three blocks as arguments. It
creates the three blocks. The blocks are stacked by shifting them vertically in the right amount.

The parameters values are provided in the HTML. Add parameter elements to the
scene as follows.

    <pacioli-scene
        id="blocks-scene"
        definition="graphics:blocks_scene"
        width="690"
        axis grid>
    <parameter label="top" unit="metre">1</parameter>
    <parameter label="middle" unit="metre">2</parameter>
    <parameter label="bottom" unit="metre">3</parameter>
    </pacioli-scene>

The parameters are passed to the scene function.

To make the scene interactive controls and an input panel can be added by
including the following fragments.

    <pacioli-controls for="blocks-scene"></pacioli-controls>

    <pacioli-inputs for="blocks-scene"></pacioli-inputs>

In the panel the sizes of the blocks can be adjusted interactively.

## Creating a Light Source

With function `make_spotlight` we can add a light to a scene.

Create utility function `make_center_spot_light`.

    declare make_center_spot_light ::
        for_unit a: (radian, a, Color, candela) -> SpotLight(a, Geom3!);

    define make_center_spot_light(angle, distance, color, intensity) =
        let
            direction = vector3d(sin(angle), cos(angle), 0.5),
            position = distance '.*' direction
        in
            make_spotlight(position, 0 '.*' position, color, intensity)
        end;

It creates a light with the give color and intensity that points at the origin.
It is positioned at the given angle and distance in the xy-plane and elevated
halve that distance in the z-direction.

Create helper function `illuminated_scene`. It creates a scene with a single light.

    declare illuminated_scene ::
        (String) -> Scene(metre, Geom3!);

    define illuminated_scene(id) =
        let
            light =
                make_center_spot_light(
                    0*|radian|,
                    20*|metre|,
                    make_color("white"),
                    5000*|candela|)
        in
            add_spotlights([light], empty_scene(id))
        end;

## Adding Light to the Scene

We need to add the right material to the blocks for the light to have effect. Change function
`make_block` as follows

    define make_block(size, color, offset) =
        begin
            mesh := cube_mesh(size, color);
            mesh := move_mesh(mesh, space_vec(0*|metre|, 0*|metre|, offset));
            mesh := with_mesh_material("Phong", mesh);

            return mesh;
        end;

Function `with_mesh_material` sets the mesh material. Materials suitable for light
are "Phong" and "Lambert". An other value is "Normal".

Make the following change.

    define blocks_scene(top, middle, bottom) =
        let
            bottom_block =
                make_block(bottom, COLOR_BOTTOM, 0.5*bottom),

            middle_block =
                make_block(middle, COLOR_MIDDLE, bottom + 0.5*middle),

            top_block =
                make_block(top, COLOR_TOP, bottom + middle + 0.5*top),

            scene = illuminated_scene("blocks")
        in
            add_meshes([top_block, middle_block, bottom_block], scene)
        end;

This should display illuminated blocks.

## Adding Animation

Finally we turn the static scene into an animation. An animation is created
with a function that maps time to a scene.

The example animation spins the blocks around the z-axis.
Create utility function `spin` to spin the blocks. It rotates a mesh
around the z-axis by a given angle.

    declare spin ::
        for_unit a, Geom3!b: (Mesh(a, Geom3!b), radian) -> Mesh(a, Geom3!b);

    define spin(mesh, angle) =
        rotate_mesh(mesh, 0*|radian|, 0*|radian|, angle);

Next we meed to add an extra parameter to function `make_block` to pass an identifier.
Scene elements require an identifier if we want to change it. The identifier is needed to
locate the element when applying changes.

    declare make_block ::
        (String, metre, Color, metre) -> Mesh(metre, Geom3!);

    define make_block(name, size, color, offset) =
        begin
            mesh := cube_mesh(size, color);
            mesh := move_mesh(mesh, space_vec(0*|metre|, 0*|metre|, offset));
            mesh := with_mesh_material("Phong", mesh);
            mesh := with_mesh_name(name, mesh);

            return mesh;
        end;

This completes the setup. Now we can implement an animation callback. The callback computes a
scene for a moment in time.

Replace the parts involving the scene as follows.

    declare blocks_scene ::
        (metre, metre, metre) -> Animation(metre, Geom3!);

    define blocks_scene(top, middle, bottom) =
        let
            bottom_block =
                make_block3("bottom", bottom, COLOR_BOTTOM, 0.5*bottom),

            middle_block =
                make_block3("middle", middle, COLOR_MIDDLE, bottom + 0.5*middle),

            top_block =
                make_block3("top", top, COLOR_TOP, bottom + middle + 0.5*top),

            velocity = 1*|radian/second|,

            animation_callback = (time, scene) ->
                let
                    bottom_spun = spin(bottom_block, time*velocity),
                    middle_spun = spin(middle_block, 2*time*velocity),
                    top_spun = spin(top_block, 4*time*velocity)
                in
                    with_scene_meshes([bottom_spun, middle_spun, top_spun], scene)
                end,

            initial_scene =
                animation_callback(0*|second|, illuminated_scene("blocks"))
        in
            add_animation_callback(animation_callback, initial_scene)
        end;

Function `add_animation_callback` creates an animation. It expects a function of
type `(second, Scene(a, Geom3!u)) -> Scene(a, Geom3!u)`. This callback is passed a
time parameter and the previous scene, and computes the new scene. In this case
it rotates the blocks. The previous scene is not used in this case.

[threejs]: http://www.threejs.org
