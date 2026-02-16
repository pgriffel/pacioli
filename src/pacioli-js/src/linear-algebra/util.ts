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

/**
 * Hypotenuse. Pythagoras sqrt(a^2 + b^2) without under/overflow.
 *
 * Helper for deccomposition algorithms.
 *
 * @param a A number
 * @param b A number
 * @returns The hypotenuse
 */
export function hypot(a: number, b: number) {
  var r;
  if (Math.abs(a) > Math.abs(b)) {
    r = b / a;
    r = Math.abs(a) * Math.sqrt(1 + r * r);
  } else if (b !== 0) {
    r = a / b;
    r = Math.abs(b) * Math.sqrt(1 + r * r);
  } else {
    r = 0.0;
  }
  return r;
}

/**
 * Zero matrix of size m x n as array of arrays. Corresponds with the
 * full representation of a matrix in Pacioli.
 *
 * @param m
 * @param n
 * @returns
 */
export function zeroMatrix(m: number, n: number): number[][] {
  const matrix = [];

  for (var i = 0; i < m; i++) {
    matrix.push(new Array(n).fill(0));
  }

  return matrix;
}

export function zeroArray(n: number): number[] {
  return new Array(n).fill(0);
}

/**
 * Copies a matrix that is represented as array of arrays. Corresponds with the
 * full representation of a matrix in Pacioli.
 *
 * @param A
 * @returns
 */
export function copyMatrix(A: number[][]): number[][] {
  return A.map((row) => Array.from(row));
}
