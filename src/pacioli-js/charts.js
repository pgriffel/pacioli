/* Charts for the Pacioli language
 *
 * Copyright (c) 2013 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Pacioli = Pacioli || {};

// -----------------------------------------------------------------------------
// Line Chart
// -----------------------------------------------------------------------------

Pacioli.LineChart = function (parent, data, options) {

    this.parent = parent
    this.data = data

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 60, top: 20, right: 10, bottom: 30},
        unit: null,
        label: "",
        xlabel: "",
        norm: null,
        ymin: null,
        ymax: null,
        xticks: 8,
        yticks: 5,
        rotate: false,
        smooth: false
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.LineChart.prototype.draw = function () {

    try {

        // Transform the data to a usable format
        var unit = this.options.unit || Pacioli.dataUnit(this.data);
        var data = Pacioli.transformData(this.data, unit);

        // Make the parent node empty
        var parent = this.parent
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    
        // Define dimensions of graph
        var m = this.options.margin;
        var w = this.options.width - m.left - m.right;
        var h = this.options.height - m.top - m.bottom;
    
        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select(this.parent)
                      .append("svg:svg")
                      .attr("width", w + m.left + m.right)
                      .attr("height", h + m.top + m.bottom)
                      .attr("class", "chart")
                      .append("svg:g")
                      .attr("width", w)
                      .attr("height", h)
                      .attr("transform", "translate(" + m.left + "," + m.top + ")");
    
        // Determine data ranges
        //var xScale = d3.scale.linear().domain([0, data.values.length]).range([0, w]);
        var xScale = d3.scale.ordinal()
                             //.rangeRoundBands([0, w], .1)
                             .rangePoints([0, w], .1)
                             .domain(data.labels);
        var yMin = this.options.ymin ? this.options.ymin : d3.min(data.values);
        var yMax = this.options.ymax ? this.options.ymax : d3.max(data.values);
        var yScale = d3.scale.linear()
                             .domain([yMin, yMax])
                             .range([h, 0]);
    
        // Create a line function that converts the data into x and y points
        var line = d3.svg.line()
                     .x(function(d,i) { return xScale(i); })
                     .y(function(d) { return yScale(d); });
        if (this.options.smooth) {
            line.interpolate("basis");
        }
    
        // Create the x axis
        var mod = this.options.xticks ? Math.ceil(data.values.length / this.options.xticks) : 1
        var xAxis = d3.svg.axis().scale(xScale)
                                 .orient("bottom")
                                 .tickSize(-h)
                                 .tickValues(xScale.domain().filter(function(d, i) { return !(i % mod); }))
        var xElt = graph.append("svg:g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + h + ")")
             .call(xAxis)
        if (this.options.rotate) {
             xElt.selectAll("text")	
            .style("text-anchor", "end")
            .attr("transform","rotate(-45)")
        } else {
            xElt.selectAll("text")	
                .attr("transform","translate(0, 5)")
        }

        xElt.append("text")
            .attr("x", w)
            .attr("y", 20)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text(this.options.xlabel);

        // create left yAxis
        var yAxisLeft = d3.svg.axis()
                              .scale(yScale)
                              .ticks(this.options.yticks)
                              .orient("left");
        graph.append("svg:g")
             .attr("class", "y axis axisLeft")
             .attr("transform", "translate(0,0)")
             .call(yAxisLeft)
             .append("text")
             .attr("x", -30)
             .attr("y", -10)
             .style("text-anchor", "begin")
             .text(this.options.label + " [" + unit.symbolized().toText() + "]");
    
        // Add a norm line if requested
        var norm = this.options.norm;
        if (norm) {
            var normline = d3.svg.line().x(function(d,i) { return xScale(i); })
                                        .y(function(d) { return yScale(norm); });
            graph.append("svg:path")
                 .attr("d", normline(data.values))
                 .attr("class", "")
                 .attr("stroke", "green");
        }

        // Add lines AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path")
             .attr("d", line(data.values))
             .attr("class", "data");
    
    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing bar chart '" + this.options.label + "':", err);
    }

    return this

};


// -----------------------------------------------------------------------------
// Pie Chart
// -----------------------------------------------------------------------------

Pacioli.PieChart = function (parent, data, options) {

    this.parent = parent
    this.data = data 

    var defaultOptions = {
        width: 640,
        height: 360,
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
        unit: null,
        label: "",
        labelOffset: 0.5,
        decimals: 2
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.PieChart.prototype.draw = function () {

    try {

        var shape = this.data.type.param
        var numbers = this.data.value
        var parent = this.parent
        
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    
        // Convert the Pacioli vector to an array with the right info
        var data = []
        var unit = this.options.unit || shape.unitAt(0, 0)
        var decimals = this.options.decimals;
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            data.push({
                number: Pacioli.getNumber(numbers, i, 0) * factor,
                label: shape.rowCoordinates(i).shortText()
            })
        }
            
        var width = this.options.width - this.options.left - this.options.right
        var height = this.options.height - this.options.top - this.options.bottom
        var radius = Math.min(width, height) / 2
    
        var arc = d3.svg.arc()
                    .outerRadius(radius*0.7)
                    .innerRadius(0);
        var arc2 = d3.svg.arc()
                    .outerRadius(radius*1.2*this.options.labelOffset)
                    .innerRadius(0);
    
    
        var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) { return d.number; });
    
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + this.options.left + this.options.right)
                    .attr("height", height + this.options.top + this.options.bottom)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

         svg.append("text")
            .attr("transform", "translate(" + 0*width / 2 + "," + height / 2 + ")")
            .style("text-anchor", "middle")
            //.text(this.options.label + " (" + unit.symbolized().toText() + ")");
            .text(this.options.label);
  
    
        var g = svg.selectAll(".arc")
                   .data(pie(data))
                   .enter().append("g")
                   .attr("class", "arc");
        var color = d3.scale.category20();     //builtin range of colors
          
        g.append("path")
         .attr("d", arc)
         .style("fill", function(d, i) { return color(i) });
    
        g = svg.selectAll(".arctext")
                   .data(pie(data))
                   .enter().append("g")
                   .attr("class", "arctext");

        g.append("text")
         .attr("transform", function(d) {
             return "translate(" + arc2.centroid(d) + ")";
         })
         .attr("dy", ".35em")
         .style("text-anchor", "middle")
         .text(function(d) {
             if (0 < d.data.number) {
                 uom = unit.symbolized().toText();
                 return d.data.label + ' = ' + d.data.number.toFixed(decimals) + (uom === "1" ? '' : ' ' + uom);
             } else {
                 return "";
             }
             //return 0 < d.data.number ? d.data.label + ' = ' + d.data.number.toFixed(this.options.decimals) + ' ' + unit.symbolized().toText() : ""
         });    
    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing bar chart '" + this.options.label + "':", err)
    }

    return this
};

// -----------------------------------------------------------------------------
// Bar Chart
// -----------------------------------------------------------------------------

Pacioli.BarChart = function (parent, data, options) {

    this.parent = parent
    this.data = data 

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 10, top: 10, right: 10, bottom: 10},
        unit: null,
        ymin: null,
        ymax: null,
        label: ""
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.BarChart.prototype.draw = function () {

    try {

        var shape = this.data.type.param
        var numbers = this.data.value
        var parent = this.parent
        
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    
        // Convert the Pacioli vector to an array with the right info
        var data = []
        var unit = this.options.unit || shape.unitAt(0, 0)
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            data.push({
                number: Pacioli.getNumber(numbers, i, 0) * factor,
                label: shape.rowCoordinates(i).shortText()
            })
        }

        // Copied from the interwebs
        var margin = {top: 20, right: 20, bottom: 150, left: 40}
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom
        
        var x = d3.scale.ordinal()
                  .rangeRoundBands([0, width], .1);
        
        var y = d3.scale.linear()
                  .range([height, 0]);
        
        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

        // todo: show this text on x axis
        var xSet = shape.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
        
        var yAxis = d3.svg.axis()
                       .scale(y)
                       .orient("left")
                       .ticks(5, "%");
        
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        x.domain(data.map(function(d) { return d.label; }));
        var yMin = this.options.ymin ? this.options.ymin : 0;
        var yMax = this.options.ymax ? this.options.ymax : d3.max(data, function(d) { return d.number; });
        y.domain([yMin, yMax]);
    
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")  
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("transform", function(d) { return "rotate(-65)" });

        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(this.options.label + " [" + unit.symbolized().toText() + "]");
    
        svg.selectAll(".bar")
           .data(data)
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", function(d) { return x(d.label)+12; })    // the +12 -12 makes room for the y axis label
           .attr("width", x.rangeBand()-12)
           .attr("y", function(d) { return y(d.number); })
           .attr("height", function(d) { return height - y(d.number); });

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing bar chart '" + this.options.label + "':", err)
    }

    return this

};

// -----------------------------------------------------------------------------
// Histogram
// -----------------------------------------------------------------------------

Pacioli.Histogram = function (parent, data, options) {

    this.parent = parent
    this.data = data 

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 40, top: 20, right: 20, bottom: 50},
        unit: null,
        label: "",
        bins: 10,
        lower: null,
        upper: null,
        onclick: function (data) {
            var div = document.createElement("div")
            var close = document.createElement("button")
            close.innerHTML = "close"
            close.onclick = function () {document.body.removeChild(div)}
            div.style.backgroundColor = "#EEE" 
            div.style.position = "fixed"
            div.style.left = "100px"
            div.style.top = 100 + "px"
            div.style.height = "300px" 
            div.style.width = "500px" 
            document.body.appendChild(div)
            div.appendChild(close)
            div.appendChild(Pacioli.DOM(data.value))
            div.style.overflow = "auto"
        }
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.Histogram.prototype.draw = function () {

    try {

        var unit = this.options.unit || Pacioli.dataUnit(this.data)
        var data = Pacioli.transformData(this.data, unit)

        // Create an array with the bin tresholds and generate a histogram layout from it for the data
        var lower = this.options.lower || data.min //d3.min(data)
        var upper = this.options.upper || data.max //d3.max(data)
        var binScale = d3.scale.linear().domain([0, this.options.bins]).range([lower, upper]);
        var binArray = d3.range(this.options.bins + 1).map(binScale);
        var layout = d3.layout.histogram().bins(binArray)(data.values);   

        // Determine the drawing dimensions
        var margin = this.options.margin
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom

        // Create x and y scales mapping the histogram layout to the drawing dimensions
        var x = d3.scale.linear().domain([lower, upper]).range([0, width]);
        var y = d3.scale.linear()
                  .domain([0, d3.max(layout, function(d) { return d.y; })])
                  .range([height, 0]);
        
        // Create the axes
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left")
        
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }

        // Create an svg element under the parent        
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // Add the x axis
        var label = this.options.label || this.data.type.param.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", width)
           .attr("y", 26)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(label + " [" + unit.symbolized().toText() + "]");

        // Add the y axis
        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("x", 20)
           .attr("dy", "-.71em")
           .style("text-anchor", "end")
           .text("Frequency");

        // Add the histogram bars
        svg.selectAll(".bar")
           .data(layout)
           .enter().append("g")
           .attr("class", "bar")
           .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
           .append("rect")
           .attr("x", 1)
           .attr("width", x(lower+layout[0].dx) - 1)
           .attr("height", function(d) { return height - y(d.y); })
           .on("click", function (d, i) {this.onClick(d.x, d.x + d.dx, data.max, d.y)}.bind(this));

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing histogram '" + this.options.label + "':", err)
    }

    return this

};

Pacioli.Histogram.prototype.onClick = function (lower, upper, max, frequency) {

    var result
    var unit = this.options.unit || Pacioli.dataUnit(this.data)
    var unitShape = new Pacioli.Shape(unit);

    if (this.data.type.kind === "matrix") {

        // Find the displayed vector and its units
        var vector = this.data.value
        var shape = this.data.type.param
    
        // Filter the chart's vector for the given bounds
        var filtered = Pacioli.zeroNumbers(vector.nrRows, vector.nrColumns)
        for (var i = 0; i < vector.nrRows; i++) {
            var num = Pacioli.getNumber(vector, i, 0) * shape.unitAt(i, 0).conversionFactor(unit)
            if (lower <= num && (num < upper || (num === max && upper === max))) {
                 //Pacioli.set(filtered, i, 0, Pacioli.getNumber(vector, i, 0))
                 Pacioli.set(filtered, i, 0, num)
            }
        }

        // Create a copy of the original object
        //result = new Pacioli.Box(this.data.type, filtered)
        result = new Pacioli.Box(new Pacioli.Type("matrix", shape.dimensionless().scale(unitShape)), filtered)
        

    } else if (this.data.type.kind === "list") {

        // Todo: convert to chart unit of measurement. See vector case above.
        var factor = this.data.type.param.param.multiplier.conversionFactor(unit)
        var filtered = []
        for (var i = 0; i < this.data.value.length; i++) {
            var num = Pacioli.getNumber(this.data.value[i], 0, 0) * factor
            if (lower <= num && (num < upper || (num === max && upper === max))) {
                 filtered.push(this.data.value[i])
            }
        }
        filtered.kind = this.data.value.kind
        result = new Pacioli.Box(this.data.type, filtered)
        //console.log(this.data)
        //console.log(result)
    }

    // Show the filtered vector in a popup window
    this.options.onclick({
        value: result,
        frequency: new Pacioli.DimensionedNumber(frequency),
        lower: new Pacioli.DimensionedNumber(lower, unit),
        upper: new Pacioli.DimensionedNumber(upper, unit)
    });

}


// -----------------------------------------------------------------------------
// ScatterPlot
// -----------------------------------------------------------------------------

Pacioli.ScatterPlot = function (parent, dataX, dataY, options) {

    this.parent = parent
    this.dataX = dataX 
    this.dataY = dataY 

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 40, top: 20, right: 20, bottom: 50},
        xunit: null,
        yunit: null,
        lowerX: null,
        lowerXa: null,
        upperX: null,
        lowerY: null,
        upperY: null,
        labelX: "",
        labelY: "",
        radius: 2.5,
        trendline: false,
        onclick: function (data) {
                     alert("Values at coordinates " + data.coordinates.names + " of index sets (" +
                           data.coordinates.indexSets.map(function (x) {return x.name}) + ") are \n\n" +
                           data.xlabel + " = " + data.xnumber.toFixed(2) + "\n" +
                           data.ylabel + " = " + data.ynumber.toFixed(2));
                 }
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.ScatterPlot.prototype.draw = function () {

    try {

        var unitX = this.options.xunit || Pacioli.dataUnit(this.dataX)
        var unitY = this.options.yunit || Pacioli.dataUnit(this.dataY)

        var data = Pacioli.mergeData(this.dataX, unitX, this.dataY, unitY)
        var values = data.values

        // Create an array with the bin tresholds and generate a scatterplot layout from it for the data
        var lowerX = this.options.lowerX === null ? data.minX : this.options.lowerX
        var upperX = this.options.upperX === null ? data.maxX : this.options.upperX
        var lowerY = this.options.lowerY === null ? data.minY : this.options.lowerY
        var upperY = this.options.upperY === null ? data.maxY : this.options.upperY
//        var upperX = this.options.upperX || data.maxX // dataX.max //d3.max(data)
//        var lowerY = this.options.lowerY || data.minY // dataY.min //d3.min(data)
//        var upperY = this.options.upperY || data.maxY // dataY.max //d3.max(data)
// alert(this.options.lowerXa === null);

        // Determine the drawing dimensions
        var margin = this.options.margin
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom

        // Create x and y scales mapping the scatterplot layout to the drawing dimensions
        var x = d3.scale.linear().domain([lowerX, upperX]).range([0, width]);
        var y = d3.scale.linear()
                  .domain([lowerY, upperY])
                  .range([height, 0]);
        
        // Create the axes
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left")
        
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }

        // Create an svg element under the parent        
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
        // Add the x axis
        var labelX = this.options.labelX || this.dataX.type.param.rowName()
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", width)
           .attr("y", 26)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(labelX + " [" + unitX.symbolized().toText() + "] (n=" + values.length + ")");

        // Add the y axis
        var labelY = this.options.labelY || this.dataY.type.param.rowName()
        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("x", 2)
           .attr("dy", "-.71em")
           //.style("text-anchor", "centers")
           .text(labelY + " [" + unitY.symbolized().toText() + "]");
           //.text("Frequency");

        var color = d3.scale.category20();     //builtin range of colors

        // Add dots for the data
        svg.selectAll(".dot")
           .data(values)
           .enter().append("circle")
           .attr("class", "dot")
           .attr("r", this.options.radius)
           .attr("cx", function(d) { return x(d.x); })
           .attr("cy", function(d) { return y(d.y); })
           //.attr("cy", function(d) { console.log( d.x + ' - ' + d.y); return d.y; })
           //.attr("cy", function(d) { console.log( d.x + ' - ' + d.y); return y(d.y); })
           //.attr("cy", function(d) { console.log( x(d.x) + '-' + y(d.y)); return y(d.y); })
           //.attr("cy", function(d) { return y(d.y); })
           .style("fill", function(d) { return color(d.species); })
           .on("click", function (d, i) {
                            var dat = {
                                coordinates: data.values[i].coordinates,
                                xnumber: new Pacioli.DimensionedNumber(data.values[i].x, unitX),
                                ynumber: new Pacioli.DimensionedNumber(data.values[i].y, unitY),
                                xlabel: labelX,
                                ylabel: labelY
                            };
                            this.options.onclick(dat);
                        }.bind(this));

//  var legend = svg.selectAll(".legend")
//      .data(color.domain())
//    .enter().append("g")
//      .attr("class", "legend")
//      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//  legend.append("rect")
//      .attr("x", width - 18)
//      .attr("width", 18)
//      .attr("height", 18)
//      .style("fill", color);
//
//  legend.append("text")
//      .attr("x", width - 24)
//      .attr("y", 9)
//      .attr("dy", ".35em")
//      .style("text-anchor", "end")
//      .text(function(d) { return d; });

        if (this.options.trendline) {

            var xs = []
            var ys = []
            var max, min
            for (var i = 0; i < values.length; i++) {
                var xi = values[i].x
                var yi = values[i].y
                xs.push(xi)
                ys.push(yi)
                if (max === undefined || max < xi) max = xi
                if (min === undefined || xi < min) min = xi

            }
            var lr = Pacioli.linearRegression(xs, ys)

            var x1 = min
            var y1 = x1*lr.slope + lr.intercept
            var x2 = max
            var y2 = x2*lr.slope + lr.intercept

            svg.append("line")
               .attr("x1",x(x1))
               .attr("y1",y(y1))
               .attr("x2",x(x2))
               .attr("y2",y(y2))
               .attr("stroke", "#ccc")
	       .attr("stroke-width", 1);
        }

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing scatterplot '" + this.options.labelX + "':", err)
    }

    return this

    };

// from http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
Pacioli.linearRegression = function (x,y){
		var lr = {};
		var n = y.length;
		var sum_x = 0;
		var sum_y = 0;
		var sum_xy = 0;
		var sum_xx = 0;
		var sum_yy = 0;
		
		for (var i = 0; i < y.length; i++) {
			
			sum_x += x[i];
			sum_y += y[i];
			sum_xy += (x[i]*y[i]);
			sum_xx += (x[i]*x[i]);
			sum_yy += (y[i]*y[i]);
		} 
		
		lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
		lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
		lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
		
		return lr;
}
// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

Pacioli.copyOptions = function (options, defaults) {
    var obj = {}
    for (var option in defaults) {
        if (defaults.hasOwnProperty(option)) {
            obj[option] = options && options.hasOwnProperty(option) ? options[option] : defaults[option]
        }
    }
    return obj
}

Pacioli.displayChartError = function (parent, message, err) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
    parent.appendChild(document.createTextNode(message))
    message = document.createElement("p")
    message.style.color = "red"
    parent.appendChild(message)
    message.appendChild(document.createTextNode(err))
}

Pacioli.dataUnit = function (data) {
   switch (data.type.kind) {
    case "list":
        var content = data.type.param
        if (content.kind === "matrix") {
            return content.param.unitAt(0, 0)
        } else {
            throw "exptected a list of numbers but got a list of " + content.kind
        }
    case "matrix":
        return data.type.param.unitAt(0, 0)
    default:
        throw "exptected a vector or a list of numbers but got a " + data.type.kind
    }
}

Pacioli.transformData = function (data, unit) {

    var values = []
    var labels = []
    var min
    var max

    switch (data.type.kind) {
    case "list":
        if (data.type.param.kind !== "matrix") throw "exptected a list of numbers but got a list of " + data.type.param.kind
        var factor = data.type.param.param.multiplier.conversionFactor(unit)
        for (var i = 0; i < data.value.length; i++) {
            var value = Pacioli.getNumber(data.value[i], 0, 0) * factor
            if (value !== 0) {
                values.push(value)
                labels.push(i)
                if (max === undefined || max < value) max = value
                if (min === undefined || value < min) min = value
            }
        }
        break;
    case "matrix":
        var numbers = data.value
        var shape = data.type.param

    var nums = Pacioli.getCOONumbers(numbers)
    var rows = nums[0]
    var columns = nums[1]
    var vals = nums[2]
    for (var i = 0; i < rows.length; i++) {
            var factor = shape.unitAt(rows[i], 0).conversionFactor(unit)
            var value = vals[i] * factor
            values.push(value)
            labels.push(shape.rowCoordinates(rows[i]).shortText())
            if (max === undefined || max < value) max = value
            if (min === undefined || value < min) min = value
    }

//        for (var i = 0; i < numbers.nrRows; i++) {
//            var factor = shape.unitAt(i, 0).conversionFactor(unit)
//            var value = Pacioli.getNumber(numbers, i, 0) * factor
//            if (value !== 0) { 
//                values.push(value)
//                labels.push(shape.rowCoordinates(i).shortText())
//                if (max === undefined || max < value) max = value
//                if (min === undefined || value < min) min = value
//            }
//        }
        break;
    default:
        throw "exptected a vector or a list of numbers but got a " + data.type.kind
    }

    return {
        values: values,
        labels: labels,
        max: max,
        min: min
    }
}


Pacioli.mergeData = function (dataX, unitX, dataY, unitY) {

    var values = []
    var labels = [] // todo X and Y
    var minX, maxX, minY, maxY

    switch (dataX.type.kind) {
    case "list":
        throw "todo"
        break;
    case "matrix":
        var numbersX = dataX.value
        var numbersY = dataY.value
        var shapeX = dataX.type.param
        var shapeY = dataY.type.param

        var numsX = Pacioli.getCOONumbers(numbersX)
        var rowsX = numsX[0]
        var columnsX = numsX[1]
        var valsX = numsX[2]
    
        var numsY = Pacioli.getCOONumbers(numbersY)
        var rowsY = numsY[0]
        var columnsY = numsY[1]
        var valsY = numsY[2]

        var m = rowsX.length
        var n = rowsY.length
        var ptrX = 0
        var ptrY = 0

        while (ptrX < m && ptrY < n) {
            rowX = rowsX[ptrX]
            rowY = rowsY[ptrY]
            if (rowX < rowY) {
                var valueX = valsX[ptrX] * shapeX.unitAt(rowX, 0).conversionFactor(unitX)
                if (valueX !== 0) {
                values.push({x: valueX, y: 0, coordinates: shapeX.rowCoordinates(rowX)})
                if (minX === undefined || valueX < minX) minX = valueX
                if (maxX === undefined || valueX > maxX) maxX = valueX
                }
                ptrX++
            } else if (rowX > rowY) {
                var valueY = valsY[ptrY] * shapeY.unitAt(rowY, 0).conversionFactor(unitY)
                if (valueY !== 0) {
                values.push({x: 0, y: valueY, coordinates: shapeY.rowCoordinates(rowY)})
                if (minY === undefined || valueY < minY) minY = valueY
                if (maxY === undefined || valueY > maxY) maxY = valueY
                }
                ptrY++
            } else {
                var valueX = valsX[ptrX] * shapeX.unitAt(rowX, 0).conversionFactor(unitX)
                var valueY = valsY[ptrY] * shapeY.unitAt(rowY, 0).conversionFactor(unitY)
                if (valueX !== 0 && valueY !== 0) {
                values.push({x: valueX, y: valueY, coordinates: shapeX.rowCoordinates(rowX)})
                if (minX === undefined || valueX < minX) minX = valueX
                if (maxX === undefined || valueX > maxX) maxX = valueX
                if (minY === undefined || valueY < minY) minY = valueY
                if (maxY === undefined || valueY > maxY) maxY = valueY
                }
                ptrX++
                ptrY++
            }
        }
        while (ptrX < m) {
            rowX = rowsX[ptrX]
            var valueX = valsX[ptrX] * shapeX.unitAt(rowX, 0).conversionFactor(unitX)
            if (valueX !== 0) {
            values.push({x: valueX, y: 0, coordinates: shapeX.rowCoordinates(rowX)})
            if (minX === undefined || valueX < minX) minX = valueX
            if (maxX === undefined || valueX > maxX) maxX = valueX
            }
            ptrX++
        }
        while (ptrY < n) {
            rowY = rowsY[ptrY]
            var valueY = valsY[ptrY] * shapeY.unitAt(rowY, 0).conversionFactor(unitY)
            if (valueY !== 0) {
            values.push({x: 0, y: valueY, coordinates: shapeY.rowCoordinates(rowY)})
            if (minY === undefined || valueY < minY) minY = valueY
            if (maxY === undefined || valueY > maxY) maxY = valueY
            }
            ptrY++
        }
        break;
    default:
        throw "exptected a vector or a list of numbers but got a " + data.type.kind
    }
    return {
        values: values,
        labels: labels,
        maxX: maxX,
        minX: minX,
        maxY: maxY,
        minY: minY
    }
}