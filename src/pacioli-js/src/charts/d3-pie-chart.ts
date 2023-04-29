/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

import * as d3 from "d3";
import { PieArcDatum } from "d3";
import { PacioliValue } from "../value";
import { PacioliContext } from "../context";
import {
  dataUnit,
  DefaultChartOptions,
  displayChartError,
  ToolTip,
  transformData,
} from "./chart-utils";
import { DimNum, SIUnit } from "uom-ts";

export interface PieChartOptions extends DefaultChartOptions {
  radius?: number;
  unit?: SIUnit;
  convert?: boolean;
  label?: string;
  labelOffset?: number;
  decimals?: number;
  zeros?: boolean;

  /**
   * Callback for mouse clicks. Parameter number is the value of the clicked
   * part, label is the name of the index set element of the clicked part, and
   * fraction is the percentage of the value of the total value.
   */
  onclick?: (number: DimNum, label: string, fraction: number) => void;
  tooltip?: (number: DimNum, label: string, fraction: number) => string;
  tooltipOffset?: { dx: number; dy: number };
}

/**
 * A pie chart for Pacioli
 *
 * Adds css classes pacioli-ts-chart and pacioli-ts-pie-chart to the chart svg.
 */
export class PieChart {
  options: {
    width: number;
    height: number;
    margin: { left: number; top: number; right: number; bottom: number };
    radius: number;
    unit?: SIUnit;
    convert: boolean;
    label: string;
    labelOffset: number;
    decimals: number;
    zeros: boolean;
    onclick?: (number: DimNum, label: string, fraction: number) => void;
    tooltip?: (number: DimNum, label: string, fraction: number) => string;
    tooltipOffset: { dx: number; dy: number };
  };

  readonly defaultOptions = {
    width: 640,
    height: 360,
    margin: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10,
    },
    radius: 100,
    label: "",
    labelOffset: 0.5,
    decimals: 2,
    zeros: false,
    convert: true,
    onclick: this.defaultClickHandler.bind(this),
    tooltip: this.defaultTooltip.bind(this),
    tooltipOffset: { dx: 0, dy: -50 },
  };

  defaultClickHandler(number: DimNum, label: string, fraction: number) {
    alert(
      `${this.options.label}: value for ${label} is ${number.toFixed(
        this.options.decimals
      )} (${(fraction * 100).toFixed(0)}%)`
    );
  }

  defaultTooltip(number: DimNum, label: string, fraction: number) {
    return `${label}: ${number.toFixed(this.options.decimals)} (${(
      fraction * 100
    ).toFixed(0)}%)`;
  }

  constructor(
    public data: PacioliValue,
    private context: PacioliContext,
    options: PieChartOptions
  ) {
    this.options = { ...this.defaultOptions, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      const unit = this.options.unit || dataUnit(this.data);
      // TODO: parse options.unit!?
      // var unit = this.options.unit || dataUnit(this.data);
      const input = transformData(
        this.context,
        this.data,
        unit,
        this.options.zeros,
        this.options.convert
      );

      // var shape = this.data.type.param
      // var numbers = this.data.value

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      const data: { value: number; name: string }[] = [];
      for (let i = 0; i < input.labels.length; i++) {
        data.push({ value: input.values[i], name: input.labels[i] });
      }

      // // Convert the Pacioli vector to an array with the right info
      // var data = []
      // var unit = this.options.unit || shape.unitAt(0, 0)
      // var uom = unit.symbolized().toText();
      // var decimals = this.options.decimals;
      // for (var i = 0; i < numbers.nrRows; i++) {
      //   var factor = shape.unitAt(i, 0).conversionFactor(unit)
      //   var num = Pacioli.getNumber(numbers, i, 0) * factor;
      //   if (num != 0) {
      //     data.push({
      //       number: num,
      //       label: shape.rowCoordinates(i).shortText()
      //       //                label: shape.rowCoordinates(i).shortText() + ' ' + num.toFixed(decimals) + (uom === "1" ? '' : ' ' + uom)
      //     })
      //   }
      // }

      const width = this.options.width;
      const height = this.options.height;
      //var radius = Math.min(width, height) / 2
      // const radius = this.options.radius;

      const svg = d3
        .select(parent)
        .append("svg")
        .attr("class", "pacioli-ts-chart pacioli-ts-pie-chart")
        .attr("width", width)
        .attr("height", height);

      //  svg.attr("transform", "translate(" + -width / 2 + "," + -height / 2 + ")");

      const group = svg.append("g");

      // group.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      group.attr(
        "transform",
        "translate(" + width / 2 + "," + height / 2 + ")"
      );

      const size = Math.min(width, height);
      const fourth = size / 4;
      // const half = size / 2;
      const labelOffset = fourth * 1.4;
      const total = data.reduce((acc, cur) => acc + cur.value, 0);
      // const container = group //d3.select(selector);

      // const chart = container.append('svg')
      //   .style('width', '100%')
      //   .attr('viewBox', `0 0 ${size} ${size}`);

      const plotArea = group.append("g");
      // .attr('transform', `translate(${half}, ${half})`);

      const color = d3
        .scaleOrdinal<string>()
        .domain(data.map((d) => d.name))
        .range(d3.schemeAccent);

      const pie = d3
        .pie<{ value: number; name: string }>()
        .sort(null)
        .value((d) => d.value);

      const arcs = pie(data);

      const arc = d3
        .arc<PieArcDatum<{ value: number; name: string }>>()
        .innerRadius(0)
        .outerRadius(fourth);

      const arcLabel = d3
        .arc<PieArcDatum<{ value: number; name: string }>>()
        .innerRadius(labelOffset)
        .outerRadius(labelOffset);

      // Create a tooltip parent with default styling.
      const tooltip = new ToolTip("pacioli-ts-pie-chart");

      plotArea
        .selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("class", "slice")
        .attr("fill", (d) => color(d.data.name))
        .attr("d", arc)
        .on("click", (_, d) => {
          if (this.options.onclick) {
            tooltip.hide();
            // Without the timeout the display: none does not have an effect
            setTimeout(() => {
              this.options.onclick!(
                new DimNum(d.data.value, unit),
                d.data.name,
                d.data.value / total
              );
            }, 0);
          }
        })
        .on("mouseover", (event, d) => {
          if (this.options.tooltip) {
            tooltip.show(
              this.options.tooltip(
                new DimNum(d.data.value, unit),
                d.data.name,
                d.data.value / total
              ),
              event.pageX + this.options.tooltipOffset.dx,
              event.pageY + this.options.tooltipOffset.dy
            );
          }
        })
        .on("mouseout", () => tooltip.hide());

      const labels = plotArea
        .selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`);

      labels
        .append("tspan")
        .attr("y", "-0.6em")
        .attr("x", 0)
        .text((d) => `${d.data.name}`);

      // labels.append('tspan')
      //   .attr('y', '0.6em')
      //   .attr('x', 0)
      //   .text(d => `${d.data.value} (${Math.round(d.data.value / total * 100)}%)`);

      return;

      if (data.length === 0) {
        svg
          .append("text")
          //               .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text("No data available");
      }

      group.append("g").attr("class", "slices");
      group.append("g").attr("class", "labels");
      group.append("g").attr("class", "lines");

      // var pie = d3.pie()
      //   .sort(null)
      //   // .value(function (d) {
      //   //   return d;
      //   // });

      // var arc = d3.arc()
      //   .outerRadius(radius * 0.8)
      //   .innerRadius(radius * 0.4);

      // var outerArc = d3.arc()
      //   .innerRadius(radius * 0.9)
      //   .outerRadius(radius * 0.9);

      group.attr(
        "transform",
        "translate(" + width / 2 + "," + height / 2 + ")"
      );

      // console.log('pie chart', radius, group, pie, arc, outerArc);

      var key = function (d: any) {
        return d.data;
      };

      // var color = d3.scaleOrdinal(
      //   ["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"],
      //   ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

      // function randomData() {
      //   var labels = color.domain();
      //   return labels.map(function (label) {
      //     return { label: label, number: Math.random() }
      //   });
      // }

      function change(data: any) {
        /* ------- PIE SLICES -------*/
        var slice = svg
          .select(".slices")
          .selectAll("path.slice")
          .data(pie(data), key);

        //   console.log(slice)

        slice
          .enter()
          .insert("path")
          // .style("fill", (d) => { return color(d.data); })
          .attr("class", "slice");

        // let _current: number
        // slice
        //   .transition().duration(1000)
        //   .attrTween("d", (d) => {
        //     _current = _current || d;
        //     var interpolate = d3.interpolate(_current, d);
        //     _current = interpolate(0);
        //     return function (t) {
        //       return arc(interpolate(t));
        //     };
        //   })

        // slice.exit()
        //   .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text").data(pie(data), key);

        text
          .enter()
          .append("text")
          .attr("dy", ".35em")
          .text((d: any) => {
            return d.data.label;
          });

        // function midAngle(d) {
        //   return d.startAngle + (d.endAngle - d.startAngle) / 2;
        // }

        // text.transition().duration(1000)
        //   .attrTween("transform", function (d) {
        //     this._current = this._current || d;
        //     var interpolate = d3.interpolate(this._current, d);
        //     this._current = interpolate(0);
        //     return function (t) {
        //       var d2 = interpolate(t);
        //       var pos = outerArc.centroid(d2);
        //       var pos2 = outerArc.centroid(d2);
        //       pos2[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        //       pos2[1] = (1 + 0.2 * Math.abs(Math.cos(midAngle(d2)))) * pos2[1];
        //       return "translate(" + pos2 + ")";
        //     };
        //   })
        //   .styleTween("text-anchor", function (d) {
        //     this._current = this._current || d;
        //     var interpolate = d3.interpolate(this._current, d);
        //     this._current = interpolate(0);
        //     return function (t) {
        //       var d2 = interpolate(t);
        //       return midAngle(d2) < Math.PI ? "start" : "end";
        //     };
        //   });

        // text.exit()
        //   .remove();

        // /* ------- SLICE TO TEXT POLYLINES -------*/

        // var polyline = svg.select(".lines").selectAll("polyline")
        //   .data(pie(data), key);

        // polyline.enter()
        //   .append("polyline");

        // polyline.transition().duration(1000)
        //   .attrTween("points", function (d) {
        //     this._current = this._current || d;
        //     var interpolate = d3.interpolate(this._current, d);
        //     this._current = interpolate(0);
        //     return function (t) {
        //       var d2 = interpolate(t);
        //       var pos = outerArc.centroid(d2);
        //       var pos2 = outerArc.centroid(d2);
        //       //pos2[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        //       pos2[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        //       //pos2[1] = (1 - Math.sin(midAngle(d2))) * pos2[1];
        //       pos[1] = (1 + 0.2 * Math.abs(Math.cos(midAngle(d2)))) * pos[1];
        //       pos2[1] = (1 + 0.2 * Math.abs(Math.cos(midAngle(d2)))) * pos2[1];
        //       return [arc.centroid(d2), pos, pos2];
        //     };
        //   });

        // polyline.exit()
        //   .remove();
      }

      // //console.log('chart', data.filter(function (x) {return x.number != 0; }));

      change(
        data.filter(function (x) {
          return x.value != 0;
        })
      );
      // change(randomData());
      // throw new Error('todo')
    } catch (err) {
      displayChartError(
        parent,
        "While drawing pie chart '" + this.options.label + "':",
        err
      );
    }

    return this;
  }

  // Pacioli.PieChart.prototype.drawOLD = function () {

  //     try {

  //         var shape = this.data.type.param
  //         var numbers = this.data.value
  //         var parent = this.parent

  //         // Make the parent node empty
  //         while (parent.firstChild) {
  //             parent.removeChild(parent.firstChild)
  //         }

  //         // Convert the Pacioli vector to an array with the right info
  //         var data = []
  //         var unit = this.options.unit || shape.unitAt(0, 0)
  //         var decimals = this.options.decimals;
  //         for (var i = 0; i < numbers.nrRows; i++) {
  //             var factor = shape.unitAt(i, 0).conversionFactor(unit)
  //             data.push({
  //                 number: Pacioli.getNumber(numbers, i, 0) * factor,
  //                 label: shape.rowCoordinates(i).shortText()
  //             })
  //         }

  //         var width = this.options.width - this.options.left - this.options.right
  //         var height = this.options.height - this.options.top - this.options.bottom
  //         var radius = Math.min(width, height) / 2

  //         var arc = d3.svg.arc()
  //                     .outerRadius(radius*0.7)
  //                     .innerRadius(0);
  //         var arc2 = d3.svg.arc()
  //                     .outerRadius(radius*1.2*this.options.labelOffset)
  //                     .innerRadius(0);

  //         var pie = d3.layout.pie()
  //                     .sort(null)
  //                     .value(function(d) { return d.number; });

  //         var svg = d3.select(this.parent).append("svg")
  //                     .attr("width", width + this.options.left + this.options.right)
  //                     .attr("height", height + this.options.top + this.options.bottom)
  //                     .append("g")
  //                     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  //          svg.append("text")
  //             .attr("transform", "translate(" + 0*width / 2 + "," + height / 2 + ")")
  //             .style("text-anchor", "middle")
  //             //.text(this.options.label + " (" + unit.symbolized().toText() + ")");
  //             .text(this.options.label);

  //         var g = svg.selectAll(".arc")
  //                    .data(pie(data))
  //                    .enter().append("g")
  //                    .attr("class", "arc");
  //         var color = d3.scale.category20();     //builtin range of colors

  //         g.append("path")
  //          .attr("d", arc)
  //          .style("fill", function(d, i) { return color(i) });

  //         g = svg.selectAll(".arctext")
  //                    .data(pie(data))
  //                    .enter().append("g")
  //                    .attr("class", "arctext");

  //         g.append("text")
  //          .attr("transform", function(d) {
  //              return "translate(" + arc2.centroid(d) + ")";
  //          })
  //          .attr("dy", ".35em")
  //          .style("text-anchor", "middle")
  //          .text(function(d) {
  //              if (0 < d.data.number) {
  //                  uom = unit.symbolized().toText();
  //                  return d.data.label + ' = ' + d.data.number.toFixed(decimals) + (uom === "1" ? '' : ' ' + uom);
  //              } else {
  //                  return "";
  //              }
  //              //return 0 < d.data.number ? d.data.label + ' = ' + d.data.number.toFixed(this.options.decimals) + ' ' + unit.symbolized().toText() : ""
  //          });
  //     } catch (err) {
  //         Pacioli.displayChartError(this.parent, "While drawing pie chart '" + this.options.label + "':", err)
  //     }

  //     return this
  // };
}
