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
        margin: {left: 10, top: 10, right: 10, bottom: 10},
        unit: null,
        label: ""
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.LineChart.prototype.draw = function () {

    try {

        var shape = this.data.type.param.param
        var matlist = this.data.value
        var parent = this.parent

        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }

        // Determine the unit of measurement
        var unit = this.options.unit || shape.multiplier
        var factor = shape.multiplier.conversionFactor(unit)
    
        // Convert the Pacioli values to an array of numbers
        var data = matlist.map(function (x) {
            return Pacioli.getNumber(x, 0, 0) * factor
        })
    
        // Add the label if defined
        if (this.options.label !== undefined) {
            var label = this.options.label
            parent.appendChild(typeof label == "string" ? document.createTextNode(label) : label)
        }
    
        // Source: http://bl.ocks.org/2579619
    
        // Define dimensions of graph
        var m = [4, 20, 14, 20]; // margins
        var w = 300 - m[1] - m[3]; // width
        var h = 50 - m[0] - m[2]; // height
    
        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select(this.parent).append("svg:svg")
                      //.attr("id", id + "_chart")
                      .attr("class", "chart")
                      .append("svg:g")
                      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    
        // Determine data ranges
        var xRange = d3.scale.linear().domain([0, data.length]).range([0, w]);
        var yRange = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
    
        // Create a line function that converts the data into x and y points
        var line = d3.svg.line()
                     .x(function(d,i) { return xRange(i); })
                     .y(function(d) { return yRange(d); })
    
        // Create the x axis
        var xAxis = d3.svg.axis().scale(xRange).tickSize(-h).tickSubdivide(true).ticks(5);
        graph.append("svg:g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + h + ")")
             .call(xAxis);
    
        // create left yAxis
    //    var yAxisLeft = d3.svg.axis().scale(yRange).ticks(2).orient("left");
    //    graph.append("svg:g")
    //         .attr("class", "y axis axisLeft")
    //         .attr("transform", "translate(-15,0)")
    //         .call(yAxisLeft);
    
        // Add lines AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path").attr("d", line(data)).attr("class", "data");
    
    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing bar chart '" + this.options.label + "':", err)
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
        margin: {left: 10, top: 10, right: 10, bottom: 10},
        unit: null,
        label: "",
        labelOffset: 0.5
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
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            data.push({
                number: Pacioli.getNumber(numbers, i, 0) * factor,
                label: shape.rowCoordinates(i).shortText()
            })
        }
    
        
        var margin = this.options.margin
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom
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
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
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
         .text(function(d) { return 0 < d.data.number ? d.data.label + ' = ' + d.data.number.toFixed(2) + ' ' + unit.symbolized().toText() : "" });    
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
                       .ticks(10, "%");
        
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        x.domain(data.map(function(d) { return d.label; }));
        y.domain([0, d3.max(data, function(d) { return d.number; })]);
    
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
           .text(this.options.label + " (" + unit.symbolized().toText() + ")");
    
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
        upper: null
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.Histogram.prototype.draw = function () {

    try {

        var unit = this.options.unit || Pacioli.dataUnit(this.data)
        var data = Pacioli.transformData(this.data, unit)

/*
        var shape = this.data.type.param
        var numbers = this.data.value
        var parent = this.parent

        // Convert the Pacioli vector to an array with the non-zero
        // numbers converted to the chart's unit
        var data = []
        var unit = this.options.unit || shape.unitAt(0, 0)

        for (var i = 0; i < numbers.nrRows; i++) {
            var num = Pacioli.getNumber(numbers, i, 0)
            if (num !== 0) {
                var factor = shape.unitAt(i, 0).conversionFactor(unit)
                data.push(num * factor)
            }
        }
*/
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
        var label = this.options.label || vector.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", width)
           .attr("y", 26)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(label + " (" + unit.symbolized().toText() + ")");

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
           .on("click", function (d, i) {this.onClick(d.x, d.x + d.dx)}.bind(this));

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing histogram '" + this.options.label + "':", err)
    }

    return this

};

Pacioli.Histogram.prototype.onClick = function (lower, upper) {

    var result
    var unit = this.options.unit || Pacioli.dataUnit(this.data)

    if (this.data.type.kind === "matrix") {

        // Find the displayed vector and its units
        var vector = this.data.value
        var shape = this.data.type.param
    
        // Filter the chart's vector for the given bounds
        var filtered = Pacioli.zeroNumbers(vector.nrRows, vector.nrColumns)
        for (var i = 0; i < vector.nrRows; i++) {
            var num = Pacioli.getNumber(vector, i, 0) * shape.unitAt(i, 0).conversionFactor(unit)
            if (lower <= num && num < upper) {
                 Pacioli.set(filtered, i, 0, Pacioli.getNumber(vector, i, 0))
            }
        }

        // Create a copy of the original object
        result = new Pacioli.Box(this.data.type, filtered)

    } else if (this.data.type.kind === "list") {

        var factor = this.data.type.param.param.multiplier.conversionFactor(unit)
        var filtered = []
        for (var i = 0; i < this.data.value.length; i++) {
            var num = Pacioli.getNumber(this.data.value[i], 0, 0) * factor
            if (lower <= num && num < upper) {
                 filtered.push(this.data.value[i])
            }
        }
        filtered.kind = this.data.value.kind
        result = new Pacioli.Box(this.data.type, filtered)
        console.log(this.data)
        console.log(result)
    }

    // Show the filtered vector in a popup window    
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
    div.appendChild(Pacioli.DOM(result))
    div.style.overflow = "auto"
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
            values.push(value)
            labels.push(i)
            if (max === undefined || max < value) max = value
            if (min === undefined || value < min) min = value
        }
        break;
    case "matrix":
        var numbers = data.value
        var shape = data.type.param
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            var value = Pacioli.getNumber(numbers, i, 0) * factor
            values.push(value)
            labels.push(shape.rowCoordinates(i).shortText())
            if (max === undefined || max < value) max = value
            if (min === undefined || value < min) min = value
        }
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