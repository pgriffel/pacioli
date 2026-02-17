/**
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as d3 from "d3";

export type Margin = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function stringifyMargin(margin: {
  left: number;
  top: number;
  right: number;
  bottom: number;
}): string {
  return [margin.left, margin.top, margin.right, margin.bottom].join(" ");
}

export const ZERO_MARGIN = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

export function parseMargin(text: string | undefined): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  try {
    if (text === undefined) {
      return ZERO_MARGIN;
    }

    const nums = text.split(" ").map(Number);
    const n = nums.length;

    if (n === 0) {
      return ZERO_MARGIN;
    }

    return {
      left: nums[0 % n],
      top: nums[1 % n],
      right: nums[2 % n],
      bottom: nums[3 % n],
    };
  } catch {
    return ZERO_MARGIN;
  }
}

export function combineMargins(
  x: { left: number; top: number; right: number; bottom: number } | undefined,
  y: { left: number; top: number; right: number; bottom: number } | undefined,
) {
  return {
    left: (x?.left ?? 0) + (y?.left ?? 0),
    top: (x?.top ?? 0) + (y?.top ?? 0),
    right: (x?.right ?? 0) + (y?.right ?? 0),
    bottom: (x?.bottom ?? 0) + (y?.bottom ?? 0),
  };
}

/**
 * Options shared by all charts.
 */
export interface DefaultChartOptions {
  width: number;
  height: number;
  margin?: string;
  caption?: string;
  xlabel?: string;
  ylabel?: string;

  /**
   * Number of decimals used for numbers. Default is 2.
   */
  decimals?: number;
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

  private findDiv(): d3.Selection<
    HTMLDivElement,
    unknown,
    HTMLElement,
    unknown
  > {
    // See if a tooltip exists
    const tt: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown> =
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
    div.style("left", x.toString() + "px");
    div.style("top", y.toString() + "px");

    // Remove the display none style (set initially and by hide) to make the tooltip appear
    div.style("display", null);
  }

  public hide() {
    // Set the display style to none to make the tooltip disappear
    const tt: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown> =
      d3.select("div." + this.id);
    tt.style("display", "none");
  }
}

/**
 * Appends the message as text in the middle of the chart.
 *
 * @param svg The parent to attach the text to
 * @param message The message text
 * @param options The chart options
 */
export function appendEmptyChartMessage(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  message: string,
  options: DefaultChartOptions,
) {
  svg
    .append("text")
    .attr("x", options.width / 2)
    .attr("y", options.height / 2)
    .style("text-anchor", "middle")
    .text(message);
}

/**
 * Appends the caption as text in the top middle of the chart.
 *
 * If no caption is provided the caption from the options is used.
 *
 * @param svg
 * @param options
 * @param caption
 */
export function appendChartCaption(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  options: DefaultChartOptions,
  caption?: string,
) {
  const text = caption ?? options.caption;

  if (text !== undefined) {
    svg
      .append("text")
      .attr("x", options.width / 2)
      .attr("y", 16)
      .style("text-anchor", "middle")
      .text(text);
  }
}
