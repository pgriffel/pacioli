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

import { UOM, SIBase } from "uom-ts";
import { PacioliContext } from "../context";
import { getNumber, getCOONumbers } from "../values/numbers";
import * as d3 from "d3";
import { PacioliValue } from "../value";

export interface DefaultChartOptions {
  width?: number;
  height?: number;
  margin?: { left: number; top: number; right: number; bottom: number };
}

export function dataUnit(data: PacioliValue): UOM<SIBase> {
  switch (data.kind) {
    case "list":
      const items = data as any as PacioliValue[];
      var content = items[0];
      if (content.kind === "matrix") {
        return content.shape.unitAt(0, 0);
      } else {
        throw "exptected a list of numbers but got a list of " + data.kind;
      }
    case "matrix":
      return data.shape.unitAt(0, 0);
    default:
      throw "exptected a vector or a list of numbers but got a " + data.kind;
  }
}

// computeChartData
export function transformData(
  context: PacioliContext,
  data: PacioliValue,
  unit: UOM<SIBase>,
  includeZeros: boolean,
  convert: boolean
): {
  values: number[];
  labels: string[];
  max: number;
  min: number;
  label: string;
} {
  var values = [];
  var labels = [];
  var min;
  var max;
  let label = "";

  switch (data.kind) {
    case "list":
      const items = data as any as PacioliValue[];
      var content = items[0];
      if (content.kind === "matrix") {
        var factor = convert
          ? context.unitContext.conversionFactor(content.shape.multiplier, unit)
          : 1;
        for (var i = 0; i < content.numbers.length; i++) {
          var value = getNumber(content.numbers, 0, 0) * factor;
          if (includeZeros || value !== 0) {
            values.push(value);
            labels.push(i.toString());
            if (max === undefined || max < value) max = value;
            if (min === undefined || value < min) min = value;
          }
        }
      } else {
        throw "exptected a list of numbers but got a list of " + content.kind;
      }
      break;
    case "matrix":
      var numbers = data.numbers;
      var shape = data.shape;

      label = shape.rowName();

      if (false) {
        var nums = getCOONumbers(numbers);
        var rows = nums[0];
        // var columns = nums[1]
        var vals = nums[2];
        for (var i = 0; i < rows.length; i++) {
          var factor = context.unitContext.conversionFactor(
            shape.unitAt(rows[i], 0),
            unit
          );
          var value = vals[i] * factor;
          values.push(value);
          labels.push(shape.rowCoordinates(rows[i]).shortText());
          if (max === undefined || max < value) max = value;
          if (min === undefined || value < min) min = value;
        }
      } else {
        for (var i = 0; i < numbers.length; i++) {
          var factor = convert
            ? context.unitContext.conversionFactor(shape.unitAt(i, 0), unit)
            : 1;
          var value = getNumber(numbers, i, 0) * factor;
          if (includeZeros || value !== 0) {
            values.push(value);
            labels.push(shape.rowCoordinates(i).shortText());
            if (max === undefined || max < value) max = value;
            if (min === undefined || value < min) min = value;
          }
        }
      }
      break;
    default:
      throw "exptected a vector or a list of numbers but got a " + data.kind;
  }

  return {
    values: values,
    labels: labels,
    max: max || 0,
    min: min || 0,
    label,
  };
}

export function displayChartError(
  parent: HTMLElement,
  message: string,
  err: any
) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent.appendChild(document.createTextNode(message));
  const par = document.createElement("p");
  par.style.color = "red";
  parent.appendChild(par);
  par.appendChild(document.createTextNode(err));
}

// Tooltips in d3:
// https://observablehq.com/@d3/learn-d3-interaction?collection=@d3/learn-d3
// https://stackoverflow.com/questions/24827589/d3-appending-html-to-nodes
// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

/**
 * Tooltips for Pacioli charts.
 *
 * A tooltip is a div appended to the page's body (not to the svg!). It is
 * only displayed when the mouse is above some element.
 *
 * This class is a facade for tooltip singletons. It creates a singleton
 * tooltip per css class name. Each chart has a unique class name, so there are
 * (at most) as many tooltips as there are chart types.
 *
 * Attach the tooltip's show and hide methods to the mouseover and mouseout
 * events of the chart elements.
 */
export class ToolTip {
  constructor(public className: string) {}

  private findDiv(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    // See if a tooltip exists
    const tt: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> =
      d3.select("div." + this.className);

    // Return a tooltip parent with default styling. Create it if it does not exist yet.
    return tt.size() > 0
      ? tt
      : d3
          .select("body")
          .append("div")
          .style("position", "absolute")
          .style("background", "white")
          .style("border", "solid 1pt darkgrey")
          .style("border-radius", "4pt")
          .style("padding", "4pt")
          .style("display", "none")
          .attr("class", this.className);
  }

  public show(html: string, x: number, y: number) {
    // Find the tooltip
    const div = this.findDiv();

    // Set the html and the position
    div.html(html);
    div.style("left", x + "px");
    div.style("top", y + "px");

    // Remove the display none style (set initially and by hide) to make the tooltip appear
    div.style("display", null);
  }

  public hide() {
    // Set the display style to none to make the tooltip disappear
    const tt: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> =
      d3.select("div." + this.className);
    tt.style("display", "none");
  }
}
