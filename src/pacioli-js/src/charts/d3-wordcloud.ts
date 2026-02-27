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
import type { DefaultChartOptions } from "./chart-utils";
import {
  appendChartCaption,
  appendEmptyChartMessage,
  combineMargins,
  parseMargin,
  ToolTip,
} from "./chart-utils";
import cloud from "d3-cloud";

export interface WordCloudOptions extends DefaultChartOptions {
  angles: number;
  /** offset for tooltip popups */
  tooltipOffset: { dx: number; dy: number };
}

export type WordCloudEvent = CustomEvent<{
  value: string;
  size: number;
  options: WordCloudOptions;
}>;

const DEFAULT_CHART_MARGIN = { left: 40, top: 20, right: 20, bottom: 50 };

const DEFAULT_WORDCLOUD_OPTIONS = {
  angles: 2,
  width: 640,
  height: 360,
  tooltipOffset: { dx: 16, dy: -64 },
};

/**
 * Default click handler for a word in the cloud.
 */
function wordCloudClickHandler(event: WordCloudEvent) {
  const { value, size } = event.detail;
  alert(`${value}: ${size.toString()}`);
}

/**
 * Default tooltip content generator for a word
 */
function wordCloudTooltip(event: WordCloudEvent) {
  const { value, size } = event.detail;
  return `${value}: ${size.toString()}`;
}

export class WordCloud {
  options: {
    width: number;
    height: number;
    margin?: string;
    angles: number;
    tooltipOffset: { dx: number; dy: number };
  };

  /** click handler invoked with a WordCloudEvent */
  clickHandler?: (event: WordCloudEvent) => void = wordCloudClickHandler;

  /** tooltip generator invoked with a WordCloudEvent */
  tooltipText?: (event: WordCloudEvent) => string = wordCloudTooltip;

  constructor(
    public data: [string, number][],
    options: Partial<WordCloudOptions>,
  ) {
    this.options = { ...DEFAULT_WORDCLOUD_OPTIONS, ...options };
  }

  public draw(parent: HTMLElement) {
    const options = this.options;

    // Make the parent node empty
    while (parent.firstChild) {
      parent.firstChild.remove();
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
      parseMargin(this.options.margin),
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
      .attr("class", "pacioli wordcloud");

    if (words.length === 0) {
      appendEmptyChartMessage(svg, "No words to display", options);
    } else {
      const group = svg
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left.toString()},${margin.top.toString()})`,
        );

      appendWordcloud(
        group,
        words,
        w,
        h,
        options,
        this.clickHandler,
        this.tooltipText,
      );
    }

    // Add the caption above all other elements
    appendChartCaption(svg, this.options);
  }
}

/**
 * Appends a word cloud to an svg group.
 *
 * This helper extracts the drawing logic from {@link WordCloud.draw} so the
 * chart class remains small and other charts follow the same pattern.
 *
 * @param group The svg `<g>` element already translated by the chart margins.
 * @param words Array of word/size pairs to render.
 * @param w Total width of the cloud (including margins).
 * @param h Total height of the cloud (including margins).
 * @param options Chart options (provides rotation angles and onclick handler).
 */
function appendWordcloud(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  words: { text: string; size: number }[],
  w: number,
  h: number,
  options: WordCloudOptions,
  clickHandler?: (event: WordCloudEvent) => void,
  tooltipText?: (event: WordCloudEvent) => string,
) {
  const layout = cloud<{ text: string; size: number }>()
    .size([w, h])
    .words(words)
    .padding(5)
    .rotate(function () {
      return (
        Math.trunc(Math.random() * options.angles) * (180 / options.angles)
      );
    })
    .font("Impact")
    .fontSize((d) => {
      return d.size;
    })
    .on("end", draw);

  layout.start();

  function draw(
    words: {
      size: number;
      text: string;
      x: number;
      y: number;
      rotate: number;
    }[],
  ) {
    // create tooltip singleton for this chart type
    const tooltip = new ToolTip("pacioli tooltip wordcloud");

    group
      .append("g")
      .attr(
        "transform",
        `translate(${(layout.size()[0] / 2).toString()},${(
          layout.size()[1] / 2
        ).toString()})`,
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
        if (clickHandler) {
          // hide any visible tooltip before firing user handler
          tooltip.hide();
          const evt: WordCloudEvent = new CustomEvent("onclick", {
            detail: { value: d.text, size: d.size, options },
          });
          setTimeout(() => {
            clickHandler(evt);
          }, 0);
        }
      })
      .on("mouseover", (event: MouseEvent, d) => {
        if (tooltipText) {
          const evt: WordCloudEvent = new CustomEvent("tooltip", {
            detail: { value: d.text, size: d.size, options },
          });
          tooltip.show(
            tooltipText(evt),
            event.pageX + options.tooltipOffset.dx,
            event.pageY + options.tooltipOffset.dy,
          );
        }
      })
      .on("mouseout", () => {
        tooltip.hide();
      });
  }
}
