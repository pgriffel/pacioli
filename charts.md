---
title: Pacioli 
layout: default
special_command: onload="onLoad();"
---


Example
-------------

<div style="width: 100%; overflow: auto">
  <div id="space1" style="float:left; width: 40%; height: 250px"></div>
  <div id="space2" style="float:left; width: 40%; height: 250px"></div>
</div>

{% highlight javascript %}
var mesh1 = Pacioli.value("Test", "mesh1")
var mesh2 = Pacioli.value("Test", "mesh2")

space1.addMesh(mesh1, {wireframe: true});
space2.addMesh(mesh2, {transparent: true});
space2.addMesh(mesh1, {wireframe: true});
{% endhighlight %}

<div id="chart2" style="">
</div>
<div id="chart" style="width: 400px;height: 225px; margin: 10px">
</div>

<script>

      function onLoad() {

          var spaceElement1 = document.getElementById("space1")
          var spaceElement2 = document.getElementById("space2")

          var space1 = new Pacioli.Space(spaceElement1, {
              webgl: false,
              width: spaceElement2.offsetWidth,
              height: spaceElement2.offsetHeight,
              unit: Pacioli.unit("centi", "metre"),
              axisSize: 30
          })
          var space2 = new Pacioli.Space(spaceElement2, {
              webgl: false,
              perspective: true,
              width: spaceElement2.offsetWidth,
              height: spaceElement2.offsetHeight,
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


          var chart = new Pacioli.BarChart(document.getElementById("chart"), Pacioli.value("Test", "vec"))
          chart.options.label = "Test vec"
          chart.options.unit = Pacioli.unit("metre")
          chart.draw()

          var chart2 = new Pacioli.PieChart(document.getElementById("chart2"), Pacioli.value("Test", "vec2"), {width: 500, height: 200})
          chart2.options.label = "Test vec2"
          chart2.draw()
      }

</script>

<script type="text/javascript" src="javascripts/three.min.js"></script>
<script type="text/javascript" src="javascripts/detector.js"></script>
<script type="text/javascript" src="javascripts/d3.v2.js"></script>
<script type="text/javascript" src="javascripts/numeric-1.2.6.js"></script>
<script type="text/javascript" src="javascripts/pacioli-0.2.0.min.js"></script>
<script type="text/javascript" src="javascripts/test.js"></script>