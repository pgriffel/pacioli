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

import { PacioliWebComponent } from "./pacioli-web-component";

/**
 * Abstract base class for Pacioli web component controllers.
 */
export abstract class PacioliWebController extends PacioliWebComponent {
  /**
   * The content div
   */
  private readonly parentDiv: HTMLDivElement = document.createElement("div");

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    this.rootElement().appendChild(this.contentParent());
  }

  /**
   * Implementation for PacioliWebComponentBase
   */
  rootElement(): HTMLElement {
    return this;
  }

  /**
   * Implementation for PacioliWebComponentBase
   */
  contentParent(): HTMLElement {
    return this.parentDiv;
  }

  /**
   *Implementation for PacioliWebComponentBase
   */
  clearContent(): void {
    const parent = this.contentParent();
    while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }

  /**
   *Implementation for PacioliWebComponentBase
   */

  findElement(selectors: string): HTMLElement {
    const element = this.rootElement().querySelector(selectors);

    if (element === null) {
      throw new Error(`Cannot find element '${selectors}'`);
    }

    return element as HTMLElement;
  }
}
