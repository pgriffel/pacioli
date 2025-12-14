/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
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

export interface DefaultChartOptions {
  width: number;
  height: number;
  margin: { left: number; top: number; right: number; bottom: number };
  caption?: string;
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
  id: string;

  constructor(public className: string) {
    this.id = className
      .split(" ")
      .filter((x) => x !== "")
      .join(".");
  }

  private findDiv(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    // See if a tooltip exists
    const tt: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> =
      d3.select("div." + this.id);

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
      d3.select("div." + this.id);
    tt.style("display", "none");
  }
}
