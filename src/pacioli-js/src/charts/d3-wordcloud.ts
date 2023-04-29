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
import { DefaultChartOptions, displayChartError } from "./chart-utils";
import cloud from "d3-cloud";

export interface WordCloudOptions extends DefaultChartOptions {
  onclick?: (data: any) => void;
}

export class WordCloud {
  options: {
    width: number;
    height: number;
    margin: { left: number; top: number; right: number; bottom: number };
    onclick: (data: any) => void;
  };

  readonly defaultOptions = {
    width: 640,
    height: 360,
    margin: { left: 40, top: 20, right: 20, bottom: 50 },
    onclick: (data: any) => {
      alert("Todo: word cloud click " + data);
    },
  };

  constructor(public data: [string, number][], options: WordCloudOptions) {
    this.options = { ...this.defaultOptions, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      var words = this.data.map(function (d: any) {
        return {
          text: d[0],
          size: d[1],
        };
      });

      // Determine the drawing dimensions
      var margin = this.options.margin;
      var width = this.options.width - margin.left - margin.right;
      var height = this.options.height - margin.top - margin.bottom;

      var w = width + margin.left + margin.right;
      var h = height + margin.top + margin.bottom;

      // Create an svg element under the parent
      var svg = d3
        .select(parent)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "pacioli-ts-chart pacioli-ts-wordcloud")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var layout = cloud<{ text: string; size: number }>()
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

      function draw(words: any[]) {
        //          d3.select("body").append("svg")
        //              .attr("width", layout.size()[0])
        //              .attr("height", layout.size()[1])

        svg
          .append("g")
          .attr(
            "transform",
            "translate(" +
              layout.size()[0] / 2 +
              "," +
              layout.size()[1] / 2 +
              ")"
          )
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", function (d) {
            return d.size + "px";
          })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) {
            return d.text;
          });
      }
    } catch (err) {
      displayChartError(parent, "While drawing word cloud:", err);
    }
  }
}
