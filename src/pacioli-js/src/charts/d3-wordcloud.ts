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
import type { DefaultChartOptions } from "./chart-utils";
import { combineMargins, displayChartError, parseMargin } from "./chart-utils";
import cloud from "d3-cloud";

export interface WordCloudOptions extends DefaultChartOptions {
  onclick?: (data: {
    value: string;
    size: number;
    options: WordCloudOptions;
  }) => void;
}

const DEFAULT_CHART_MARGIN = { left: 40, top: 20, right: 20, bottom: 50 };

export class WordCloud {
  options: {
    width: number;
    height: number;
    margin?: string;
    onclick?: (data: {
      value: string;
      size: number;
      options: WordCloudOptions;
    }) => void;
  };

  readonly defaultOptions = {
    width: 640,
    height: 360,
  };

  constructor(
    public data: [string, number][],
    options: Partial<WordCloudOptions>
  ) {
    this.options = { ...this.defaultOptions, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      const options = this.options;

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      const words = this.data.map(function (d: [string, number]) {
        return {
          text: d[0],
          size: d[1],
        };
      });

      // Determine the drawing dimensions
      const margin = combineMargins(
        DEFAULT_CHART_MARGIN,
        parseMargin(this.options.margin)
      );

      const width = this.options.width - margin.left - margin.right;
      const height = this.options.height - margin.top - margin.bottom;

      const w = width + margin.left + margin.right;
      const h = height + margin.top + margin.bottom;

      // Create an svg element under the parent
      const svg = d3
        .select(parent)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "pacioli wordcloud")
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left.toString()},${margin.top.toString()})`
        );

      const layout = cloud<{ text: string; size: number }>()
        .size([w, h])
        .words(
          /*[
            "Hello", "world", "normally", "you", "want", "more", "words",
            "than", "this"].map(function(d) {
            return {text: d, size: 10 + Math.random() * 90, test: "haha"};
          })*/
          words
        )
        .padding(5)
        .rotate(function () {
          return ~~(Math.random() * 2) * 90;
        })
        .font("Impact")
        .fontSize(function (d) {
          return d.size;
        })
        .on("end", draw);

      layout.start();

      function draw(
        // Can this type be imported?
        words: {
          size: number;
          text: string;
          x: number;
          y: number;
          rotate: number;
        }[]
      ) {
        //          d3.select("body").append("svg")
        //              .attr("width", layout.size()[0])
        //              .attr("height", layout.size()[1])

        svg
          .append("g")
          .attr(
            "transform",
            `translate(${(layout.size()[0] / 2).toString()},${(
              layout.size()[1] / 2
            ).toString()})`
          )
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", function (d) {
            return d.size.toString() + "px";
          })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return `translate(${d.x.toString()},${d.y.toString()})rotate(${d.rotate.toString()})`;
          })
          .text(function (d) {
            return d.text;
          })
          .on("click", (_, d) => {
            const handler = options.onclick;
            if (handler) {
              setTimeout(() => {
                handler({
                  value: d.text,
                  size: d.size,
                  options: options,
                });
              }, 0);
            }
          });
      }
    } catch (err: unknown) {
      displayChartError(parent, "While drawing word cloud:", err);
    }
  }
}
