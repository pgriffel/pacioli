---
title: Pacioli Charts
layout: default
special_command: onload="onLoad();"
---


Setup
-----

A Pacioli vector or list of scalars can be displayed in a chart on a
webpage. Values are converted to the right units of measurement and
labels are added automatically.

Create Pacioli file `series.pacioli` and add the following code

    module Series;
    
    defunit person "p";

    defindex Continent = {Asia, Africa, Americas, Europe, Oceania};

    # source: http://en.wikipedia.org/wiki/List_of_continents_by_population

    defmatrix population :: person*Continent! = {
      Asia -> 4298723000,
      Africa -> 1110635000,
      Americas -> 972005000,
      Europe -> 742452000,
      Oceania -> 38304000
    };

    define wave =
      let n = 1000 in
          [sin(i/n*6*pi*|radian|) | i <- naturals(n)]
      end;

    define random_numbers = [random() | x <- naturals(1000)];


Compile it to JavaScript with command

    pacioli compile -target javascript series.pacioli

This produces the file `series.js` that can be included with the
required libraries into a HTML page as follows:

{% highlight html %}
<script type="text/javascript" src="d3.v2.js"></script>
<script type="text/javascript" src="numeric-1.2.6.js"></script>
<script type="text/javascript" src="pacioli-0.2.0.min.js"></script>
<script type="text/javascript" src="series.js"></script>
{% endhighlight %}

Include the pacioli style sheet:

{% highlight html %}
<link rel="stylesheet" type="text/css" href="pacioli.css" media="screen" />
{% endhighlight %}

Finally add the following divs to the body of the page:

{% highlight html %}
<div id="chart1"></div>
<div id="chart2"></div>
<div id="chart3"></div>
<div id="chart4"></div>
{% endhighlight %}


Bar Chart
---------

Add the following code to create a bar chart for the population:

{% highlight javascript %}
var parent = document.getElementById("chart1")
var population = Pacioli.value("Series", "population")
var chart = new Pacioli.BarChart(parent, population)
chart.options.label = "World Population"
chart.options.unit = Pacioli.unit("giga", "person")
chart.draw()
{% endhighlight %}

<div id="chart1"></div>


Pie Chart
---------

Add the following code to create a pie chart for the population:

{% highlight javascript %}
var parent = document.getElementById("chart2")
var population = Pacioli.value("Series", "population")
var chart = new Pacioli.PieChart(parent, population, {
    width: 500, height: 500,
    label: "World Population (p=person)",
    labelOffset: 1.2,
    unit: Pacioli.unit("giga", "person")
})
chart.draw()
{% endhighlight %}

This should set the second chart to 

<div id="chart2"></div>


Histogram
---------

{% highlight javascript %}
var parent = document.getElementById("chart3")
var chart = new Pacioli.Histogram(parent, random_numbers, {
    label: "Random Numbers",
    bins: 25, 
    width: 500, height: 300
})
chart.draw()
{% endhighlight %}

<div id="chart3"></div>


Line Chart
----------

{% highlight javascript %}
var parent = document.getElementById("chart4")
new Pacioli.LineChart(parent, wave, {width: 500, height: 300}).draw()
{% endhighlight %}

<div id="chart4"></div>


<script>

function onLoad() {

    var population = Pacioli.value("Series", "population")
    var wave = Pacioli.value("Series", "wave")
    var random_numbers = Pacioli.value("Series", "random_numbers")

    var parent = document.getElementById("chart1")
    var chart = new Pacioli.BarChart(parent, population)
    chart.options.label = "World Population"
    chart.options.unit = Pacioli.unit("giga", "person")
    chart.draw()

    var parent = document.getElementById("chart2")
    var chart = new Pacioli.PieChart(parent, population, {
        width: 500, height: 500,
        label: "World Population (p=person)",
        labelOffset: 1.2,
        unit: Pacioli.unit("giga", "person")
    })
    chart.draw()

    var parent = document.getElementById("chart3")
    var chart = new Pacioli.Histogram(parent, random_numbers, {
        label: "Random Numbers",
        bins: 25, 
        width: 500, height: 300
    })
    chart.draw()

    var parent = document.getElementById("chart4")
    new Pacioli.LineChart(parent, wave, {width: 500, height: 300}).draw()

}

</script>

<script type="text/javascript" src="javascripts/d3.v2.js"></script>
<script type="text/javascript" src="javascripts/numeric-1.2.6.js"></script>
<script type="text/javascript" src="javascripts/pacioli-0.2.0.min.js"></script>
<script type="text/javascript" src="javascripts/series.js"></script>