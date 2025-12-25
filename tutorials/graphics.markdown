---
title: 3D Graphics
---

<script
    type="text/javascript"
    src="/js/pacioli-0.5.1.bundle.js">
</script>
<script
    type="text/javascript" 
    src="graphics.js">
</script>

# 3D Graphics

<pacioli-scene
    id="my-scene"
    definition="graphics:blocks_scene1"
    width="690"
    axis grid>
</pacioli-scene>
<pacioli-controls for="my-scene"></pacioli-controls>

<pacioli-scene
    id="my-scene"
    definition="graphics:blocks_scene3"
    width="690"
    axis grid>
<parameter label="top" unit="metre">1</parameter>
<parameter label="middle" unit="metre">2</parameter>
<parameter label="bottom" unit="metre">3</parameter>
</pacioli-scene>
<pacioli-controls for="my-scene"></pacioli-controls>

The [graphics](doc/graphics.html) library allows 3D programming thanks to the [three.js][threejs] library.

3D graphics are displayed by constructing a `Scene`. A scene containts all grahics elements to
display. It can be added to a web page.

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
<pacioli-controls for="my-animation"></pacioli-controls>
<pacioli-inputs for="my-animation"></pacioli-inputs>

## Creating a scene

Say we have a file `foo.pacioli`. Function `empty_scene` creates an empty scene. It expects
a short description that is only intended for identifying the scene in log and error messages.

    define blocks_scene() =
        empty_scene("blocks");

Compile the file to javascript using the menu or with command

    pacioli compile -target javascript foo.pacioli

## Adding the scene to a web page

Web components are the easiest way to work with 3D graphics. Create a file foo.html and add

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Graphics Tutorial</title>

            <script type="text/javascript" src="pacioli-0.5.1.bundle.js"></script>
            <script type="text/javascript" src="foo.js"></script>
        </head>

        <body>
            <pacioli-scene
                definition="foo:blocks_scene"
                axis grid>
            </pacioli-scene>
        </body>
    </html>

This should show an empty scene.

## Adding a Block

Change `blocks_scene` as follows

    define blocks_scene =
        let
            block = cube_mesh(3*|metre|, make_color("blue"))
        in
            add_meshes([block], empty_scene("blocks"))
        end;

The type of `blocks_scene` is `Scene(metre, Geom3!)`, a scene in unit metre.

## Positioning Blocks

Add function `make_block`.

    define make_block(size, color, offset) =
        begin
            mesh := cube_mesh(size, color);
            mesh := move_mesh(mesh, space_vec(0*|metre|, 0*|metre|, offset));
            return mesh;
        end;

    define COLOR_S = make_color("red");
    define COLOR_M = make_color("green");
    define COLOR_X = make_color("blue");

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

The derived type of function `blocks_scene` is `(metre, metre, metre) -> Scene(metre, Geom3!)`.

## Adding Light

Utility function `make_center_spot_light`.

    define make_center_spot_light(angle, distance, color, intensity) =
        let
            direction = vector3d(sin(angle), cos(angle), 0.5),
            position = distance '.*' direction
        in
            make_spotlight(position, 0 '.*' position, color, intensity)
        end;

Make the following change after the `scene = ...` binding.

    define blocks_scene(small, medium, large) =
        let
            large_block =
                make_block(large, COLOR_X, 0.5*large),

            medium_block =
                make_block(medium, COLOR_M, large + 0.5*medium),

            small_block =
                make_block(small, COLOR_S, large + medium + 0.5*small),

            scene = illuminated_scene()
        in
            add_meshes([small_block, medium_block, large_block], scene)
        end;

## Adding Animation

The animation spins the blocks around the z-axis.

Create utility function `spin` to spin the blocks. It rotates a mesh
around the z-axis by a given angle.

    define spin(mesh, angle) =
        rotate_mesh(mesh, 0*|radian|, 0*|radian|, angle);

We need to implement an animation callback. The callback computes a scene for a moment
in time.

Replace the parts involving the scene as follows.

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

[threejs]: http://www.threejs.org
