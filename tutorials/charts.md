---
title: Pacioli Charts
---

<script type="text/javascript" src="/javascript/pacioli-0.5.0.bundle.js"></script>
<script type="text/javascript" src="charts.js"></script>

# Charts

Explains how to add charts to a web page.

---

## Setup

A Pacioli vector or list of scalars can be displayed in a chart on a
webpage. Values are converted to the right units of measurement and
labels are added automatically.

Create a file `charts.html` and add the following HTML.

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Charts Tutorial</title>

            <script type="text/javascript" src="pacioli-0.5.0.bundle.js"></script>
            <script type="text/javascript" src="charts.js"></script>
        </head>

        <body>

        </body>
    </html>

Create Pacioli file `charts.pacioli`. This file can be compiled to JavaScript with command

    pacioli compile -target javascript charts.pacioli

This produces the `charts.js` file that is included alongside the
Pacioli bundle in the HTML page.

## Adding a Bar Chart and a Pie Chart

<div style="display:flex; gap: 32pt">

<pacioli-bar-chart
    script="charts"
    definition="population"
    unit="giga:person"
    label="Population"
    ymax=5
    width=256
    height=384>
</pacioli-bar-chart>

<pacioli-pie-chart
      script="charts"
      definition="population"
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
        script="series"
        definition="population"
        unit="giga:person"
        label="Population"
        ymax=5
        width=256
        height=384>
    </pacioli-bar-chart>

    <pacioli-pie-chart
        script="series"
        definition="population"
        unit="mega:person"
        width=256>
    </pacioli-pie-chart>

    </div>

The two web-components create the charts. The div places the charts side-by-side.

## Adding a Histogram

<pacioli-histogram
    script="charts"
    definition="random_numbers">
</pacioli-histogram>

A histogram expects a list of numbers as input. Add the following code to file charts.pacioli

    define random_squares =
        [random()^2 | _ <- naturals(1000)];

The code creates a list of random numbers. Add the following to the page body

    <pacioli-histogram
      script="series"
      definition="random_numbers">
    </pacioli-histogram>

This creates the histogram.

## Adding a Line Chart

The line chart also expect a list of numbers

    define wave =
    let n = 1000 in
        [sin(i/n*6*pi*|radian|) | i <- naturals(n)]
    end;

    define random_numbers = [random() | x <- naturals(1000)];

<pacioli-line-chart
    script="charts"
    definition="wave">
</pacioli-line-chart>

    <pacioli-line-chart
        script="series"
        definition="wave">
    </pacioli-line-chart>

## Adding Chart Parameters

Instead of a value definition we can also provide a function definition. The parameters are passed with the `parameter` element.

<pacioli-line-chart
    id="sine_wave_chart"
    script="charts"
    definition="sine_wave"
    ymax=1
    ymin="-1">
<parameter label="amplitude" unit="metre">0.1</parameter>
<parameter label="frequency" unit="radian/second">2</parameter>
<parameter label="phase" unit="radian">0.25</parameter>
<parameter label="sampling rate" unit="sample/second">32</parameter>
<parameter label="nr seconds" unit="sample">10</parameter>
</pacioli-line-chart>

<pacioli-inputs for="sine_wave_chart"></pacioli-inputs>

<br>

Add the following code to charts.pacioli

    declare sine_wave :: for_unit a:
        (a, radian/second, radian, 1/second, 1) -> List(a);

    define sine_wave(amplitude, frequency, phase, sampling_rate, nr_samples) =
        let angle = frequency / sampling_rate in
            [amplitude * sin(i * angle + phase) | i <- naturals(nr_samples)]
        end;

Add the following element to the HTML page.

    <pacioli-line-chart
        id="sine_wave_chart"
        script="charts"
        definition="sine_wave"
        ymax=1
        ymin="-1">
        <parameter label="amplitude" unit="metre">0.1</parameter>
        <parameter label="frequency" unit="radian/second">2</parameter>
        <parameter label="phase" unit="radian">0.25</parameter>
        <parameter label="sampling rate" unit="sample/second">100</parameter>
        <parameter label="nr samples" unit="sample">1000</parameter>
    </pacioli-line-chart>

Now we can add inputs. Add the following

    <pacioli-inputs for="sine_wave_chart"></pacioli-inputs>

This adds a panel where the parameters can be set.
