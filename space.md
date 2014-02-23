---
title: Pacioli 
layout: default
special_command: onload="onLoad();"
---


Example
-------

<div style="overflow: auto">
  <div id="space1" style="float:left; margin: 10px"></div>
  <div id="space2" style="float:left; margin: 10px"></div>
</div>


Pacioli Code
------------

    module Test;
    
    include geometry;
    
    defunit metre "m";
    
    define mesh1 =
      cube_mesh(0.3*|metre|);

    define mesh2 =
      let d = -15*|milli:metre| in
          mesh_move(cube_mesh(30*|milli:metre|), space_vec(d, d, d))
      end;

HTML
----

The required HTML are two divs will hold the 3D spaces. Create an HTML
page with the following includes:

{% highlight html %}
<script type="text/javascript" src="javascripts/three.min.js"></script>
<script type="text/javascript" src="javascripts/detector.js"></script>
<script type="text/javascript" src="javascripts/numeric-1.2.6.js"></script>
<script type="text/javascript" src="javascripts/pacioli-0.2.0.min.js"></script>
<script type="text/javascript" src="javascripts/test.js"></script>
{% endhighlight %}

Add two divs with id `space1` and `space2`. Something like the
following will place the divs besides one another.

{% highlight html %}
<div style="overflow: auto">
  <div id="space1" style="float:left; margin: 10px"></div>
  <div id="space2" style="float:left; margin: 10px"></div>
</div>
{% endhighlight %}


JavaScript Code
---------------

Initially the 3D spaces have to be created. Add the following `onLoad`
handler:

{% highlight javascript %}
function onLoad() {
    var spaceElement1 = document.getElementById("space1")
    var spaceElement2 = document.getElementById("space2")
    
    var space1 = new Pacioli.Space(spaceElement1, {
        width: 300,
        height: 200,
        unit: Pacioli.unit("centi", "metre"),
        axisSize: 30
    })
    
    var space2 = new Pacioli.Space(spaceElement2, {
        width: 300,
        height: 200,
        unit: Pacioli.unit("metre"),
        axisSize: 15
    })
          
    space1.showAxes()
    space2.showAxes()
}
{% endhighlight %}

Don't forget to call `onLoad`  when the page is loaded.

The last thing is to add the meshes. Add the following to the `onLoad`
function. In a dynamic setting this would typically be done in an
event handler.

{% highlight javascript %}
var mesh1 = Pacioli.value("Test", "mesh1")
var mesh2 = Pacioli.value("Test", "mesh2")

space1.addMesh(mesh1, {wireframe: true});
space2.addMesh(mesh1, {wireframe: true});
space2.addMesh(mesh2, {transparent: true});

space1.draw()
space2.draw()
{% endhighlight %}




<script>

      function onLoad() {

          var spaceElement1 = document.getElementById("space1")
          var spaceElement2 = document.getElementById("space2")

          var space1 = new Pacioli.Space(spaceElement1, {
              width: 300,
              height: 200,
              unit: Pacioli.unit("centi", "metre"),
              axisSize: 30
          })
          var space2 = new Pacioli.Space(spaceElement2, {
              width: 300,
              height: 200,
              unit: Pacioli.unit("metre"),
              axisSize: 15
          })
      
          space1.showAxes()
          space2.showAxes()

          var mesh1 = Pacioli.value("Test", "mesh1")
          space1.addMesh(mesh1, {wireframe: true});

          var mesh2 = Pacioli.value("Test", "mesh2")
          space2.addMesh(mesh2, {transparent: true});
          space2.addMesh(mesh1, {wireframe: true});

          space1.draw()
          space2.draw()

      }

</script>

<script type="text/javascript" src="javascripts/three.min.js"></script>
<script type="text/javascript" src="javascripts/detector.js"></script>
<script type="text/javascript" src="javascripts/d3.v2.js"></script>
<script type="text/javascript" src="javascripts/numeric-1.2.6.js"></script>
<script type="text/javascript" src="javascripts/pacioli-0.2.0.min.js"></script>
<script type="text/javascript" src="javascripts/test.js"></script>