---
title: 3D Graphics
---

<script
    type="text/javascript"
    src="/bin/pacioli-0.5.1.bundle.js">
</script>
<script
    type="text/javascript" 
    src="graphics.js">
</script>

# 3D Graphics

The [graphics](doc/graphics.html) library allows 3D programming thanks to the [three.js][threejs] library.

3D graphics are displayed by constructing a `Scene`. A scene containts all grahics elements to
display. It can be added to a web page.

<pacioli-scene
    definition="graphics:my_scene"
    width="600"
    axis grid>
</pacioli-scene>

## Creating a scene

Say we have a file `foo.pacioli`. Function `empty_scene` creates an empty scene. It expects
a short description that is only intended for identifying the scene in log and error messages.

    define my_scene() =
        empty_scene("My 3Dscene");

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
                definition="foo:my_scene"
                axis grid>
            </pacioli-scene>
        </body>
    </html>

This should show an empty scene.

## Adding scene elements

Change `my_scene` as follows

    define my_scene() =
        let
            arrow1 =
                origin_arrow(vector3d(5*|metre|, 5*|metre|, 0*|metre|)),

            arrow2 =
                default_arrow(
                    vector3d(5*|metre|, 5*|metre|, 0*|metre|),
                    vector3d(5*|metre|, 5*|metre|, 5*|metre|))
        in
            add_arrows([arrow1, arrow3], empty_scene("My 3Dscene"))
        end;

## Using parameters

    define my_scene(x, y, z) =
        let
            arrow1 = origin_arrow(vector3d(x, y, z))
            arrow2 = make_arrow(
                vector3d(x*|metre|, y*|metre|, z*|metre|),
                vector3d(5*|metre|, 5*|metre|, 5*|metre|))
        in
            add_arrows([arrow1, arrow3], empty_scene("My 3Dscene"))
        end;

[threejs]: http://www.threejs.org
