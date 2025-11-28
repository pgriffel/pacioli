/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2025-2025 Paul Griffioen
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

/**
 * Cholesky decomposition for a symmetric positive-definite matrix.
 *
 * Returns the lower-triangular matrix L such that A = L * L^T.
 *
 * Throws an error if the matrix is not symmetric positive-definite.
 *
 * Ported from the NIST JAMA library.
 *
 * @param A A square matrix
 * @returns The lower-triangular matrix L
 */
export function cholesky(A: number[][]): number[][] {
  const n = A.length;

  const L = [];
  for (var i = 0; i < n; i++) {
    var array = [];
    for (var j = 0; j < n; j++) {
      array.push(0);
    }
    L.push(array);
  }

  for (var j = 0; j < n; j++) {
    var Lrowj = L[j];
    var d = 0.0;
    for (var k = 0; k < j; k++) {
      if (A[k][j] !== A[j][k]) {
        throw new Error("matrix not symmetric in Cholesky decomposition");
      }

      var Lrowk = L[k];
      var s = 0.0;
      for (var i = 0; i < k; i++) {
        s += Lrowk[i] * Lrowj[i];
      }
      Lrowj[k] = s = (A[j][k] - s) / L[k][k];
      d = d + s * s;
    }

    d = A[j][j] - d;

    if (d <= 0.0) {
      throw new Error("matrix not positive definite in Cholesky decomposition");
    }

    L[j][j] = Math.sqrt(Math.max(d, 0.0));

    for (var k = j + 1; k < n; k++) {
      L[j][k] = 0.0;
    }
  }

  return L;
}
