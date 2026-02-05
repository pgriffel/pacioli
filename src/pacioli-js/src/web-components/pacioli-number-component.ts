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

import { PacioliShadowTreeComponent } from "./pacioli-shadow-tree-component";

/**
 * Options for the PacioliNumberComponent class.
 */
export interface NumberOptions {
  decimals: number;
  zero?: string;
  raw: boolean;
  exponential: boolean;
  ascii: boolean;
  clipboard: boolean;
}

export const NUMBER_ATTRIBUTES = {
  strings: ["zero"],
  booleans: ["raw", "exponential", "ascii", "clipboard"],
  numbers: ["decimals"],
};

/**
 * Abstract class for web components displaying some numerical computed PacioliValue.
 *
 * It adds common options for web components that display numerical values. The
 * options specify how individual numbers are formatted.
 */
export abstract class PacioliNumberComponent extends PacioliShadowTreeComponent {
  get decimals(): number {
    return this.getNumberAttribute("decimals");
  }

  set decimals(value: number) {
    this.setNumberAttribute("decimals", value);
  }

  get zero(): string | undefined {
    return this.getStringAttribute("zero");
  }

  set zero(value: string | undefined) {
    this.setStringAttribute("zero", value);
  }

  get raw(): boolean {
    return this.getBooleAttribute("raw");
  }

  set raw(value: boolean) {
    this.setBooleAttribute("raw", value);
  }

  get exponential(): boolean {
    return this.getBooleAttribute("exponential");
  }

  set exponential(value: boolean) {
    this.setBooleAttribute("exponential", value);
  }

  get ascii(): boolean {
    return this.getBooleAttribute("ascii");
  }

  set ascii(value: boolean) {
    this.setBooleAttribute("ascii", value);
  }

  get clipboard(): boolean {
    return this.getBooleAttribute("clipboard");
  }

  set clipboard(value: boolean) {
    this.setBooleAttribute("clipboard", value);
  }
}
