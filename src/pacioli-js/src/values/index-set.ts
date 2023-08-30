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

export class IndexSet {
  // TODO: is an id and name needed?
  public static fromItems(id: string, name: string, items: string[]) {
    const index = new Map();
    for (var i = 0; i < items.length; i++) {
      index.set(items[i], i);
    }
    return new IndexSet(id, name, items, index);
  }

  constructor(
    public id: string,
    public name: string,
    public items: string[],
    private index: Map<string, number>
  ) {}

  public size(): number {
    return this.items.length;
  }

  public position(name: string): number {
    const pos = this.index.get(name);
    if (pos !== undefined) {
      return pos;
    } else {
      throw new Error(
        "Element " +
          name +
          " not found when looking for position in index set " +
          this.name +
          this.items
      );
    }
  }
}
