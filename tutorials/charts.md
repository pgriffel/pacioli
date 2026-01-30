---
title: Pacioli Charts
---

<script type="text/javascript" src="../js/pacioli-0.5.1.bundle.js"></script>
<script type="text/javascript" src="charts.js"></script>

# Charts

This tutorial explains how Pacioli values can be displayed in charts on a web page.

A chart displays a value or a function. When a function is displayed,
`parameter` elements are used to pass parameters to the function.

Values are converted to the right units of measurement and
labels are added automatically.

The Pacioli charts can be grouped into band scale charts and linear scale charts,
depending on the kind of domain.

---

## Setup

Create a file `charts.html` and add the following HTML.

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Charts Tutorial</title>

            <script type="text/javascript" src="pacioli-0.5.1.bundle.js"></script>
            <script type="text/javascript" src="charts.js"></script>
        </head>

        <body>

        </body>
    </html>

Create Pacioli file `charts.pacioli`. This file can be compiled to JavaScript with command

    pacioli compile -target javascript charts.pacioli

This produces the `charts.js` file that is included alongside the
Pacioli bundle in the HTML page.

## Band Scale Charts

A band scale chart has a discrete domain.

The input can be

- A list of (string, number) pairs
- A vector
- A list of numbers

For a vector the domain is its index set. For a list of numbers the domain is the
set `{"1", "2", "3", ..., n}` with `n` the size of the list.

The bar chart and the pie chart are examples of band scale charts.

### Adding a Bar Chart and a Pie Chart

<div style="display:flex; gap: 32pt">

<pacioli-bar-chart
    definition="charts:population"
    unit="giga:person"
    ylabel="Population"
    yupper=5
    width=256
    height=304>
</pacioli-bar-chart>

<pacioli-pie-chart
      definition="charts:population"
      unit="mega:person"
      width=256>
</pacioli-pie-chart>

</div>

Add the following code to Pacioli file `charts.pacioli` and compile it

    defunit person "prsn";

    defindex Continent = {Asia, Africa, Americas, Europe, Oceania};

    defmatrix population :: person*Continent! = {
        Asia -> 4298723000,
        Africa -> 1110635000,
        Americas -> 972005000,
        Europe -> 742452000,
        Oceania -> 38304000
    };

source: http://en.wikipedia.org/wiki/List_of_continents_by_population

Add the following HTML code to the body to create a bar chart for the population:

    <div style="display:flex; gap: 32pt">

    <pacioli-bar-chart
        definition="charts:population"
        unit="giga:person"
        label="Population"
        yupper=5
        width=256
        height=384>
    </pacioli-bar-chart>

    <pacioli-pie-chart
        definition="charts:population"
        unit="mega:person"
        width=256>
    </pacioli-pie-chart>

    </div>

The two web-components create the charts. The div places the charts side-by-side.

The value can also be a list of pairs, instead of a vector. If we change the value to

    define population = [
        tuple("Asia", 4298723000*|person|),
        tuple("Africa", 1110635000*|person|),
        ...
    ];

we get the same charts. However, the x-axis label has to be provided with the `xlabel` attribute,
because it can no longer be derived from the data.

### Passing Options from Pacioli

Chart options can be passed from Pacioli code instead of being applied directly in the html.
The options is a list of (string, string) pairs. For example

    define pie_chart_options = [
        tuple("caption", "My Pie Chart"),
        tuple("label", "Continent")
    ];

Add an options attribute that refers to this value with `options="charts:pie_chart_options"`.

## Linear Scale Charts

Linear scales have a numeric range as domain.

The input can be

- A list of (number, number) pairs
- A pair of number lists
- A pair of vectors
- A vector
- A list of numbers

For a vector and for a list of numbers the domain is the set `{1, 2, 3, ..., n}`,
where `n` is the size of the vector or list.

Examples are the line chart, the histogram and the scatterplot.

### Adding a Line Chart

As setup for the line chart we define function `sine_wave`.

    declare sine_wave :: for_unit a:
        (a, 1/second, second, second, 1) -> List(Tuple(second, a));

    define sine_wave(amplitude, frequency, start_time, end_time, nr_samples) =
        let
            w = frequency * 2*pi*|radian|,
            dt = (end_time - start_time) / nr_samples
        in
            [tuple(t, amplitude * sin(w * t)) |
                i <- naturals(nr_samples),
                t := start_time + i * dt]
        end;

The function calculates a sine wave for a time interval.
The following chart shows an example.

<pacioli-line-chart
    definition="charts:example_wave" 
    xlabel="t"
    ylabel="sin"
    yupper="1"
    ylower="-1"
    smooth>
</pacioli-line-chart>

To create it add the following Pacioli code and compile the file.

    define example_wave =
        sine_wave(0.2, 1/|second|, 0*|second|, 8*|second|, 100);

Add a line chart to the html file as follows.

    <pacioli-line-chart
        definition="charts:example_wave"
        xlabel="t"
        ylabel="sin"
        yupper="1"
        ylower="-1"
        smooth>
    </pacioli-line-chart>

### Calling a Function

Instead of createing the example wave in the Pacioli code we can also pass the
parameters to `sine_wave` from the HTML page.

Replace the chart in the HTML page with the following

    <pacioli-line-chart
        id="sine_wave_chart"
        definition="charts:sine_wave"
        yupper=1
        ylower="-1"
        smooth>
        <parameter>0.2</parameter>
        <parameter>1</parameter>
        <parameter>0</parameter>
        <parameter>8</parameter>
        <parameter>100</parameter>
    </pacioli-line-chart>

This creates the same charts, but the parameters are bound in the HTML file
and don't require recompilation of the Pacioli code when they change.

### Adding an Input Panel

To make the chart interactive you can add an input panel.

<pacioli-line-chart
    id="sine_wave_chart"
    definition="charts:sine_wave"
    yupper=1
    ylower="-1"
    smooth>
<parameter label="amplitude" unit="metre">0.2</parameter>
<parameter label="frequency" unit="1/second">1</parameter>
<parameter label="start time" unit="second">0</parameter>
<parameter label="end time" unit="second">8</parameter>
<parameter label="nr samples" unit="1">100</parameter>
</pacioli-line-chart>

<pacioli-inputs for="sine_wave_chart"></pacioli-inputs>

<br>

Add the following

    <pacioli-inputs for="sine_wave_chart"></pacioli-inputs>

This adds a panel where the parameters can be set. The `id` attribute
connects the input to the chart.

Add labels and units to the parameters as follows

    <pacioli-line-chart
        id="sine_wave_chart"
        definition="charts:sine_wave"
        yupper=1
        ylower="-1"
        smooth>
    <parameter label="amplitude" unit="metre">0.2</parameter>
    <parameter label="frequency" unit="1/second">1</parameter>
    <parameter label="start time" unit="second">0</parameter>
    <parameter label="end time" unit="second">8</parameter>
    <parameter label="nr samples" unit="1">100</parameter>
    </pacioli-line-chart>

### Adding Histograms

<pacioli-histogram definition="charts:random_squares"></pacioli-histogram>

A histogram expects a list of numbers as input. Add the following code to file charts.pacioli

    define random_squares =
        [random()^2 | _ <- naturals(1000)];

The code creates a list of random numbers. Add the following to the page body

    <pacioli-histogram definition="charts:random_squares">
    </pacioli-histogram>

This creates the histogram.

For another example add the following setup

    define random_avg(k) =
        sum[random() | _ <- naturals(k)] / k;

    define random_avg_pairs(k) =
        [tuple(random_avg(k), random_avg(k)) | _ <- naturals(50)];

<pacioli-histogram 
    id="random_pairs"
    caption="Random average pairs"
    width="400"
    height="400"
    definition="charts:random_avg_pairs"
    bins=25
    yupper=100
    xticks=3
    yticks=5>
<parameter label="k">5</parameter>
<parameter label="n">500</parameter>
</pacioli-histogram>

<pacioli-inputs for="random_pairs"></pacioli-inputs>

The HTML is

    <pacioli-histogram
        id="random_pairs"
        caption="Random average pairs"
        width="400"
        height="400"
        definition="charts:random_avg_pairs"
        bins=25
        yupper=100
        xticks=3
        yticks=5>
    <parameter label="k">5</parameter>
    <parameter label="n">500</parameter>
    </pacioli-histogram>

    <pacioli-inputs for="random_pairs"></pacioli-inputs>

### Adding Scatterplots

<pacioli-scatter-plot
    id="random_pairs_scatter"
    caption="Random average pairs"
    definition="charts:random_avg_pairs"
    width="400"
    height="400"
    xlower="0"
    xupper="1"
    ylower="0"
    yupper="1"
    xticks="3"
    yticks="3">
<parameter label="k">5</parameter>
<parameter label="n">500</parameter>
</pacioli-scatter-plot>

<pacioli-inputs for="random_pairs_scatter"></pacioli-inputs>

Add the following

    <pacioli-scatter-plot
        id="random_pairs_scatter"
        caption="Random average pairs"
        definition="charts:random_avg_pairs"
        width="400"
        height="400"
        xlower="0"
        xupper="1"
        ylower="0"
        yupper="1"
        xticks="3"
        yticks="3">
    <parameter label="k">5</parameter>
    <parameter label="n">500</parameter>
    </pacioli-scatter-plot>

    <pacioli-inputs for="random_pairs_scatter"></pacioli-inputs>

### Manipulating Charts with JavaScript

When functionality beyond the input panel is required the charts can be manipulated
with JavaScript.

An example is using the same parameter for multiple charts. Say we want to create four
copies of the charts from the previous section for k=1, 10, 100 and 1000, but set parameter `n` with one input.
In that case an input panel won't work. We can create our own inputs and manipulate
the charts from JavaScript directly.

n = <input id="nrsamples" type="number" value=100>
<button onclick="onSetSamples()">Apply</button>

<script>
    function onSetSamples() {
        const value = document.querySelector("#nrsamples").value
        document
            .querySelectorAll("parameter.samples")
            .forEach((paramElt) => {
                paramElt.innerText = value    
            })
    }
</script>

<div style="display:flex; gap: 64pt">

<pacioli-scatter-plot
    class="avg"
    caption="k=1"
    definition="charts:random_avg_pairs"
    xlower="0"
    xupper="1"
    ylower="0"
    yupper="1"
    width="200"
    height="200"
    xticks="3"
    yticks="3">
<parameter>1</parameter>
<parameter class="samples">100</parameter>
</pacioli-scatter-plot>

<pacioli-scatter-plot
    class="avg"
    caption="k=10"
    definition="charts:random_avg_pairs"
    xlower="0"
    xupper="1"
    ylower="0"
    yupper="1"
    width="200"
    height="200"
    xticks="3"
    yticks="3">
<parameter>10</parameter>
<parameter class="samples">100</parameter>
</pacioli-scatter-plot>

</div>

<div style="display:flex; gap: 64pt">

<pacioli-scatter-plot
    class="avg"
    caption="k=100"
    definition="charts:random_avg_pairs"
    xlower="0"
    xupper="1"
    ylower="0"
    yupper="1"
    width="200"
    height="200"
    xticks="3"
    yticks="3">
<parameter>100</parameter>
<parameter class="samples">100</parameter>
</pacioli-scatter-plot>

<pacioli-scatter-plot
    class="avg"
    caption="k=1000"
    definition="charts:random_avg_pairs"
    xlower="0"
    xupper="1"
    ylower="0"
    yupper="1"
    width="200"
    height="200"
    xticks="3"
    yticks="3">
<parameter>1000</parameter>
<parameter class="samples">100</parameter>
</pacioli-scatter-plot>

</div>

Add HTML. We need to find the relevant parameter elements to set the values. In this case
the parameter `n` elements are given css class `samples`. This allows us to query them
from JavaScript.

    n = <input id="nrsamples" type="number" value=100>
    <button onclick="onSetSamples()">Apply</button>

    <script>
        function onSetSamples() {
            const value = document.querySelector("#nrsamples").value
            document
                .querySelectorAll("parameter.samples")
                .forEach((paramElt) => {
                    paramElt.innerText = value
                })
        }
    </script>

    <pacioli-scatter-plot
        class="avg"
        caption="k=1"
        definition="charts:random_avg_pairs"
        xlower="0"
        xupper="1"
        ylower="0"
        yupper="1"
        width="200"
        height="200"
        xticks="3"
        yticks="3">
    <parameter>1</parameter>
    <parameter class="samples">100</parameter>
    </pacioli-scatter-plot>

Repeat the `pacioli-scatter-plot` for the others three plots, adjusting the caption and parameter for each chart.
