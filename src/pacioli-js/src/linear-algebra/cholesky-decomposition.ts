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

import { copyMatrix, zeroMatrix } from "./util";

/**
 * Cholesky decomposition for a symmetric positive-definite matrix.
 *
 * Returns the lower-triangular matrix L such that A = L * L^T.
 *
 * Throws an error if the matrix is not symmetric positive-definite.
 *
 * Ported from the NIST JAMA library.
 */
export class CholeskyDecomposition {
  private n: number;
  private L: number[][];
  private isspd: boolean;

  constructor(A: number[][]) {
    this.n = A.length;

    if (A.length === 0) {
      throw new Error("Matrix cannot have empty rows.");
    }

    this.L = zeroMatrix(this.n, this.n);

    this.isspd = A[0].length === this.n;

    for (var j = 0; j < this.n; j++) {
      var Lrowj = this.L[j];
      var d = 0.0;
      for (var k = 0; k < j; k++) {
        var Lrowk = this.L[k];
        var s = 0.0;
        for (var i = 0; i < k; i++) {
          s += Lrowk[i] * Lrowj[i];
        }
        Lrowj[k] = s = (A[j][k] - s) / this.L[k][k];
        d = d + s * s;
        this.isspd = (function (lhs, rhs) {
          return lhs && rhs;
        })(this.isspd, A[k][j] === A[j][k]);
      }
      d = A[j][j] - d;
      this.isspd = (function (lhs, rhs) {
        return lhs && rhs;
      })(this.isspd, d > 0.0);
      this.L[j][j] = Math.sqrt(Math.max(d, 0.0));
      for (var k = j + 1; k < this.n; k++) {
        this.L[j][k] = 0.0;
      }
    }
  }

  /**
   * Is the matrix symmetric and positive definite?
   *
   * @return true if A is symmetric and positive definite.
   */
  isSPD(): boolean {
    return this.isspd;
  }

  /**
   * Return triangular factor.
   *
   * @return L
   */
  getL(): number[][] {
    return this.L;
  }

  /**
   * Solve A*X = B
   *
   * @param B    A Matrix with as many rows as A and any number of columns.
   * @return     X so that L*L'*X = B
   * @exception  IllegalArgumentException  Matrix row dimensions must agree.
   * @exception  RuntimeException  Matrix is not symmetric positive definite.
   */
  solve(B: number[][]): number[][] {
    if (B.length === 0) {
      throw new Error("Matrix cannot have empty rows.");
    }

    if (B[0].length !== this.n) {
      throw new Error("Matrix row dimensions must agree.");
    }

    if (!this.isspd) {
      throw new Error("Matrix is not symmetric positive definite.");
    }

    var X = copyMatrix(B);
    var nx = B[0].length;

    for (var k = 0; k < this.n; k++) {
      for (var j = 0; j < nx; j++) {
        for (var i = 0; i < k; i++) {
          X[k][j] -= X[i][j] * this.L[k][i];
        }
        X[k][j] /= this.L[k][k];
      }
    }

    for (var k = this.n - 1; k >= 0; k--) {
      for (var j = 0; j < nx; j++) {
        for (var i = k + 1; i < this.n; i++) {
          X[k][j] -= X[i][j] * this.L[i][k];
        }
        X[k][j] /= this.L[k][k];
      }
    }

    return X;
  }
}

// "use strict";
// /* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
// var Matrix_1 = require("./Matrix");
// /**
//  * Cholesky algorithm for symmetric and positive definite matrix.
//  * Structure to access L and isspd flag.
//  * @param  {Matrix} Arg   Square, symmetric matrix.
//  * @class
//  */
// var CholeskyDecomposition = (function () {
//     function CholeskyDecomposition(Arg) {
//         this.L = null;
//         this.n = 0;
//         this.isspd = false;
//         var A = Arg.getArray();
//         this.n = Arg.getRowDimension();
//         this.L = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
//             return 0;
//         }
//         else {
//             var array = [];
//             for (var i = 0; i < dims[0]; i++) {
//                 array.push(allocate(dims.slice(1)));
//             }
//             return array;
//         } }; return allocate(dims); })([this.n, this.n]);
//         this.isspd = (Arg.getColumnDimension() === this.n);
//         for (var j = 0; j < this.n; j++) {
//             var Lrowj = this.L[j];
//             var d = 0.0;
//             for (var k = 0; k < j; k++) {
//                 var Lrowk = this.L[k];
//                 var s = 0.0;
//                 for (var i = 0; i < k; i++) {
//                     s += Lrowk[i] * Lrowj[i];
//                 }
//                 ;
//                 Lrowj[k] = s = (A[j][k] - s) / this.L[k][k];
//                 d = d + s * s;
//                 this.isspd = (function (lhs, rhs) { return lhs && rhs; })(this.isspd, (A[k][j] === A[j][k]));
//             }
//             ;
//             d = A[j][j] - d;
//             this.isspd = (function (lhs, rhs) { return lhs && rhs; })(this.isspd, (d > 0.0));
//             this.L[j][j] = Math.sqrt(Math.max(d, 0.0));
//             for (var k = j + 1; k < this.n; k++) {
//                 this.L[j][k] = 0.0;
//             }
//             ;
//         }
//         ;
//     }
//     /**
//      * Is the matrix symmetric and positive definite?
//      * @return     {boolean} true if A is symmetric and positive definite.
//      */
//     CholeskyDecomposition.prototype.isSPD = function () {
//         return this.isspd;
//     };
//     /**
//      * Return triangular factor.
//      * @return     {Matrix} L
//      */
//     CholeskyDecomposition.prototype.getL = function () {
//         return new Matrix_1.Matrix(this.L, this.n, this.n);
//     };
//     /**
//      * Solve A*X = B
//      * @param  {Matrix} B   A Matrix with as many rows as A and any number of columns.
//      * @return     {Matrix} X so that L*L'*X = B
//      * @exception  IllegalArgumentException  Matrix row dimensions must agree.
//      * @exception  RuntimeException  Matrix is not symmetric positive definite.
//      */
//     CholeskyDecomposition.prototype.solve = function (B) {
//         if (B.getRowDimension() !== this.n) {
//             throw Object.defineProperty(new Error("Matrix row dimensions must agree."), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
//         }
//         if (!this.isspd) {
//             throw Object.defineProperty(new Error("Matrix is not symmetric positive definite."), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
//         }
//         var X = B.getArrayCopy();
//         var nx = B.getColumnDimension();
//         for (var k = 0; k < this.n; k++) {
//             for (var j = 0; j < nx; j++) {
//                 for (var i = 0; i < k; i++) {
//                     X[k][j] -= X[i][j] * this.L[k][i];
//                 }
//                 ;
//                 X[k][j] /= this.L[k][k];
//             }
//             ;
//         }
//         ;
//         for (var k = this.n - 1; k >= 0; k--) {
//             for (var j = 0; j < nx; j++) {
//                 for (var i = k + 1; i < this.n; i++) {
//                     X[k][j] -= X[i][j] * this.L[i][k];
//                 }
//                 ;
//                 X[k][j] /= this.L[k][k];
//             }
//             ;
//         }
//         ;
//         return new Matrix_1.Matrix(X, this.n, nx);
//     };
//     return CholeskyDecomposition;
// }());
// CholeskyDecomposition.serialVersionUID = 1;
// exports.CholeskyDecomposition = CholeskyDecomposition;
// CholeskyDecomposition["__class"] = "Jama.CholeskyDecomposition";
// CholeskyDecomposition["__interfaces"] = ["java.io.Serializable"];
