---
title: Pacioli Tables
---

<script type="text/javascript" src="{{ site.bundle_url }}"></script>
<script type="text/javascript" src="tables.js"></script>

# Tables

The `pacioli-table` element displays a table on a web page. The first columns is an
index column. Each remaining column displays a Pacioli value. The columns should agree
on the index.

Columns can be created in HTML with the `column` child element, or with a Pacioli tuple in
code. The `Column` type provides some safety when the columns are created in code, but
its use is optional

The table element is permissive regarding the input. The input can be values or functions,
and the data can be vectors or lists or combinations. Type checks are done at runtime.

---

## Adding a Table to a HTML Page

<pacioli-table decimals=3>
    <column
        header="Mass"
        definition="tables:planetary_mass" 
        exponential>
    </column>
    <column
        header="Density"
        definition="tables:planetary_density">
    </column>
    <column
        header="Earth Mass"
        definition="tables:planetary_mass"
        unit="earthmass">
    </column>
</pacioli-table>
</p>

Create Pacioli file `tables.pacioli`.
Add the following code to Pacioli file `tables.pacioli` and compile it

    defunit earthmass "earth" = 5972 * yotta:gram;

    defindex Planet =
        {Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune};

    defmatrix planetary_mass :: yotta:gram * Planet! = {
        Mercury ->     330.1,
        Venus   ->    4867,
        Earth   ->    5972,
        Mars    ->     641.7,
        Jupiter -> 1899000,
        Saturn  ->  568500,
        Uranus  ->   86820,
        Neptune ->  102400
    };

    defmatrix planetary_density :: gram/centi:metre^3 * Planet! = {
        Mercury -> 5.43,
        Venus   -> 5.24,
        Earth   -> 5.514,
        Mars    -> 3.91,
        Jupiter -> 1.24,
        Saturn  -> 0.62,
        Uranus  -> 1.24,
        Neptune -> 1.61
    };

This file can be compiled to JavaScript with command

    pacioli compile -target javascript tables.pacioli

This produces the `tables.js` file that is included alongside the
Pacioli bundle in the HTML page.

    <script type="text/javascript" src="{{ site.bundle_name }}"></script>
    <script type="text/javascript" src="tables.js"></script>

You can download the [{{ site.bundle_name }}]({{ site.bundle_url }})
file, or copy the link and use that.
Now add the following to the HTML page

    <pacioli-table decimals=3>
        <column
            header="Mass"
            definition="tables:planetary_mass"
            exponential>
        </column>
        <column
            header="Density"
            definition="tables:planetary_density">
        </column>
        <column
            header="Earth Mass"
            definition="tables:planetary_mass"
            unit="earthmass">
        </column>
    </pacioli-table>

This adds the table. The units in the third colunm are converted automatically.

## Adding a Table with Computed Values

<pacioli-table>
  <column
      header="Relative Day Length"
      definition="tables:day_length">
  </column>
  <column
      id="daylength_column"
      header="Total Hours"
      definition="tables:total_hours">
    <parameter label="Earth days1" unit="day"> 1 </parameter>
  </column>
</pacioli-table>
<pacioli-inputs for="daylength_column"></pacioli-inputs>

Add the following Pacioli code for the day length on the planets.

    defmatrix day_length :: hour/day * Planet! = {
        Mercury	-> 1408,
        Venus	-> 5832,
        Earth	-> 24,
        Mars	-> 24.62,
        Jupiter	-> 9.9,
        Saturn	-> 10.7,
        Uranus	-> 17.2,
        Neptune	-> 16.1
    }

    declare total_hours :: (day) -> hour*Planet!;

    define total_hours(days) =
        days '.*' day_length;

Add the following to the HTML

    <pacioli-table>
    <column
        header="Relative Day Length"
        definition="tables:day_length">
    </column>
    <column
        id="daylength_column"
        header="Total Hours"
        definition="tables:total_hours">
        <parameter label="Earth days1" unit="day"> 1 </parameter>
    </column>
    </pacioli-table>
    <pacioli-inputs for="daylength_column"></pacioli-inputs>

The input provides the value for the `days` parameter.

## Defining Columns in Pacioli

<pacioli-table
    id="daylength_table"
    definition="tables:relative_day_columns"
    decimals=5>
<parameter label="Earth days" unit="day">1</parameter>
</pacioli-table>
<pacioli-inputs for="daylength_table"></pacioli-inputs>

The columns can also be defined in Pacioli. In that case the table definition
must yield a tuple. Each tuple element is a column.

    defunit sidereal_day "sid" = 0.9972685185185185 * day;

    defconv sidereal_day_per_day :: sidereal_day / day;

    defconv hour_per_day :: hour/day;

    define relative_day_columns(earth_days) =
        let
            hours = earth_days '.*' day_length,
            solar_days = hours '/.' hour_per_day,
            sidereal_days = sidereal_day_per_day '.*' solar_days
        in
            tuple(
                tuple("Hours", hours),
                tuple("Solar Days", solar_days),
                tuple("Sidereal Days", sidereal_days))
        end;

Add the following HTML.

    <pacioli-table
        id="daylength_table"
        definition="tables:relative_day_columns"
        decimals=5>
      <parameter label="Earth days" unit="day">1</parameter>
    </pacioli-table>

    <pacioli-inputs for="daylength_table"></pacioli-inputs>

All columns depend on the single input.

## Table Columns from Lists

The column value can also be a list instead of a vector or matrix.

For a vector or matrix the domain is its index set. For a list of numbers the domain is the
set `{"0", "1", "2", ..., n-1}` with `n` the size of the list.

<p>
<pacioli-table decimals=0>
    <column header="Squares" definition="tables:squares"></column>
    <column header="Cubes" definition="tables:cubes"></column>
    <column header="Exponents" definition="tables:exponents"></column>
</pacioli-table>
</p>

Add the following code to `tables.pacioli`.

    define N = 11;

    define squares = [n^2 | n <- naturals(N)];

    define cubes = [n^3 | n <- naturals(N)];

    define exponents = [expt(2, n) | n <- naturals(N)];

Add the following HTML

    <pacioli-table decimals=0>
        <column header="Squares" definition="tables:squares"></column>
        <column header="Cubes" definition="tables:cubes"></column>
        <column header="Exponents" definition="tables:exponents"></column>
    </pacioli-table>
