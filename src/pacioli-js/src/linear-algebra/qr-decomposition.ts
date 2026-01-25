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

import { hypot, zeroMatrix } from "./util";

/**
 * QR Decomposition, computed by Householder reflections.
 * Structure to access R and the Householder vectors and compute Q.
 *
 * Ported from the NIST JAMA library.
 */
export class QRDecomposition {
  private QR: number[][];
  private m: number;
  private n: number;
  private Rdiag: number[];

  constructor(A: number[][]) {
    if (A.length === 0) {
      throw new Error("Matrix cannot have empty rows.");
    }

    this.m = A.length;
    this.n = A[0].length;

    this.QR = A.map((row) => Array.from(row));

    this.Rdiag = [];
    for (var i = 0; i < this.n; i++) {
      this.Rdiag.push(0);
    }

    for (var k = 0; k < this.n; k++) {
      var nrm = 0;
      for (var i = k; i < this.m; i++) {
        nrm = hypot(nrm, this.QR[i][k]);
      }
      if (nrm !== 0.0) {
        if (this.QR[k][k] < 0) {
          nrm = -nrm;
        }
        for (var i = k; i < this.m; i++) {
          this.QR[i][k] /= nrm;
        }
        this.QR[k][k] += 1.0;
        for (var j = k + 1; j < this.n; j++) {
          var s = 0.0;
          for (var i = k; i < this.m; i++) {
            s += this.QR[i][k] * this.QR[i][j];
          }
          s = -s / this.QR[k][k];
          for (var i = k; i < this.m; i++) {
            this.QR[i][j] += s * this.QR[i][k];
          }
        }
      }
      this.Rdiag[k] = -nrm;
    }
  }

  /**
   * Is the matrix full rank?
   *
   * @return true if R, and hence A, has full rank.
   */
  isFullRank(): boolean {
    for (var j = 0; j < this.n; j++) {
      if (this.Rdiag[j] === 0) return false;
    }
    return true;
  }

  /**
   * Return the Householder vectors
   *
   * @return Lower trapezoidal matrix whose columns define the reflections
   */
  getH() {
    const H = zeroMatrix(this.m, this.n);
    for (var i = 0; i < this.m; i++) {
      for (var j = 0; j < this.n; j++) {
        if (i >= j) {
          H[i][j] = this.QR[i][j];
        } else {
          H[i][j] = 0.0;
        }
      }
    }
    return H;
  }

  /**
   * Return the upper triangular factor
   *
   * @return R
   */
  getR() {
    const R = zeroMatrix(this.n, this.n);
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        if (i < j) {
          R[i][j] = this.QR[i][j];
        } else if (i === j) {
          R[i][j] = this.Rdiag[i];
        } else {
          R[i][j] = 0.0;
        }
      }
    }
    return R;
  }

  /**
   * Generate and return the (economy-sized) orthogonal factor
   *
   * @return Q
   */
  getQ() {
    const Q = zeroMatrix(this.m, this.n);
    for (var k = this.n - 1; k >= 0; k--) {
      for (var i = 0; i < this.m; i++) {
        Q[i][k] = 0.0;
      }
      Q[k][k] = 1.0;
      for (var j = k; j < this.n; j++) {
        if (this.QR[k][k] !== 0) {
          var s = 0.0;
          for (var i = k; i < this.m; i++) {
            s += this.QR[i][k] * Q[i][j];
          }
          s = -s / this.QR[k][k];
          for (var i = k; i < this.m; i++) {
            Q[i][j] += s * this.QR[i][k];
          }
        }
      }
    }
    return Q;
  }

  // TODO PORT:

  //   /**
  //    * Least squares solution of A*X = B
  //    * @param {Matrix} B    A Matrix with as many rows as A and any number of columns.
  //    * @return     {Matrix} X that minimizes the two norm of Q*R*X-B.
  //    * @exception  IllegalArgumentException  Matrix row dimensions must agree.
  //    * @exception  RuntimeException  Matrix is rank deficient.
  //    */
  //   solve(B: number[][]) {
  //     if (B.length === 0) {
  //       throw new Error("Matrix cannot have empty rows.");
  //     }

  //     if (B.length !== this.m) {
  //       throw new Error("Matrix row dimensions must agree when solving with QR.");
  //     }
  //     if (!this.isFullRank()) {
  //       throw new Error("QR: cannot solve, matrix is rank deficient.");
  //     }

  //     // var nx = B.getColumnDimension();
  //     // var X = B.getArrayCopy();
  //     // deep copy to avoid overwriting input matrix B
  //     var X = B.map((row) => Array.from(row));
  //     var nx = B[0].length;

  //     for (var k = 0; k < this.n; k++) {
  //       for (var j = 0; j < nx; j++) {
  //         var s = 0.0;
  //         for (var i = k; i < this.m; i++) {
  //           s += this.QR[i][k] * X[i][j];
  //         }
  //         s = -s / this.QR[k][k];
  //         for (var i = k; i < this.m; i++) {
  //           X[i][j] += s * this.QR[i][k];
  //         }
  //       }
  //     }
  //     for (var k = this.n - 1; k >= 0; k--) {
  //       for (var j = 0; j < nx; j++) {
  //         X[k][j] /= this.Rdiag[k];
  //       }
  //       for (var i = 0; i < k; i++) {
  //         for (var j = 0; j < nx; j++) {
  //           X[i][j] -= X[k][j] * this.QR[i][k];
  //         }
  //       }
  //     }
  //     return new Matrix_1.Matrix(X, this.n, nx).getMatrix$int$int$int$int(
  //       0,
  //       this.n - 1,
  //       0,
  //       nx - 1
  //     );
  //   }
}

// "use strict";
// /* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
// var Maths_1 = require("./util/Maths");
// var Matrix_1 = require("./Matrix");
// /**
//  * QR Decomposition, computed by Householder reflections.
//  * Structure to access R and the Householder vectors and compute Q.
//  * @param {Matrix} A    Rectangular matrix
//  * @class
//  */
// var QRDecomposition = (function () {
//   function QRDecomposition(A) {
//     this.QR = null;
//     this.m = 0;
//     this.n = 0;
//     this.Rdiag = null;
//     this.QR = A.getArrayCopy();
//     this.m = A.getRowDimension();
//     this.n = A.getColumnDimension();
//     this.Rdiag = (function (s) {
//       var a = [];
//       while (s-- > 0) a.push(0);
//       return a;
//     })(this.n);
//     for (var k = 0; k < this.n; k++) {
//       var nrm = 0;
//       for (var i = k; i < this.m; i++) {
//         nrm = Maths_1.Maths.hypot(nrm, this.QR[i][k]);
//       }
//       if (nrm !== 0.0) {
//         if (this.QR[k][k] < 0) {
//           nrm = -nrm;
//         }
//         for (var i = k; i < this.m; i++) {
//           this.QR[i][k] /= nrm;
//         }
//         this.QR[k][k] += 1.0;
//         for (var j = k + 1; j < this.n; j++) {
//           var s = 0.0;
//           for (var i = k; i < this.m; i++) {
//             s += this.QR[i][k] * this.QR[i][j];
//           }
//           s = -s / this.QR[k][k];
//           for (var i = k; i < this.m; i++) {
//             this.QR[i][j] += s * this.QR[i][k];
//           }
//         }
//       }
//       this.Rdiag[k] = -nrm;
//     }
//   }
//   /**
//    * Is the matrix full rank?
//    * @return     {boolean} true if R, and hence A, has full rank.
//    */
//   QRDecomposition.prototype.isFullRank = function () {
//     for (var j = 0; j < this.n; j++) {
//       if (this.Rdiag[j] === 0) return false;
//     }
//     return true;
//   };
//   /**
//    * Return the Householder vectors
//    * @return     {Matrix} Lower trapezoidal matrix whose columns define the reflections
//    */
//   QRDecomposition.prototype.getH = function () {
//     var X = new Matrix_1.Matrix(this.m, this.n);
//     var H = X.getArray();
//     for (var i = 0; i < this.m; i++) {
//       for (var j = 0; j < this.n; j++) {
//         if (i >= j) {
//           H[i][j] = this.QR[i][j];
//         } else {
//           H[i][j] = 0.0;
//         }
//       }
//     }
//     return X;
//   };
//   /**
//    * Return the upper triangular factor
//    * @return     {Matrix} R
//    */
//   QRDecomposition.prototype.getR = function () {
//     var X = new Matrix_1.Matrix(this.n, this.n);
//     var R = X.getArray();
//     for (var i = 0; i < this.n; i++) {
//       for (var j = 0; j < this.n; j++) {
//         if (i < j) {
//           R[i][j] = this.QR[i][j];
//         } else if (i === j) {
//           R[i][j] = this.Rdiag[i];
//         } else {
//           R[i][j] = 0.0;
//         }
//       }
//     }
//     return X;
//   };
//   /**
//    * Generate and return the (economy-sized) orthogonal factor
//    * @return     {Matrix} Q
//    */
//   QRDecomposition.prototype.getQ = function () {
//     var X = new Matrix_1.Matrix(this.m, this.n);
//     var Q = X.getArray();
//     for (var k = this.n - 1; k >= 0; k--) {
//       for (var i = 0; i < this.m; i++) {
//         Q[i][k] = 0.0;
//       }
//       Q[k][k] = 1.0;
//       for (var j = k; j < this.n; j++) {
//         if (this.QR[k][k] !== 0) {
//           var s = 0.0;
//           for (var i = k; i < this.m; i++) {
//             s += this.QR[i][k] * Q[i][j];
//           }
//           s = -s / this.QR[k][k];
//           for (var i = k; i < this.m; i++) {
//             Q[i][j] += s * this.QR[i][k];
//           }
//         }
//       }
//     }
//     return X;
//   };
//   /**
//    * Least squares solution of A*X = B
//    * @param {Matrix} B    A Matrix with as many rows as A and any number of columns.
//    * @return     {Matrix} X that minimizes the two norm of Q*R*X-B.
//    * @exception  IllegalArgumentException  Matrix row dimensions must agree.
//    * @exception  RuntimeException  Matrix is rank deficient.
//    */
//   QRDecomposition.prototype.solve = function (B) {
//     if (B.getRowDimension() !== this.m) {
//       throw Object.defineProperty(
//         new Error("Matrix row dimensions must agree."),
//         "__classes",
//         {
//           configurable: true,
//           value: [
//             "java.lang.Throwable",
//             "java.lang.Object",
//             "java.lang.RuntimeException",
//             "java.lang.IllegalArgumentException",
//             "java.lang.Exception",
//           ],
//         }
//       );
//     }
//     if (!this.isFullRank()) {
//       throw Object.defineProperty(
//         new Error("Matrix is rank deficient."),
//         "__classes",
//         {
//           configurable: true,
//           value: [
//             "java.lang.Throwable",
//             "java.lang.Object",
//             "java.lang.RuntimeException",
//             "java.lang.Exception",
//           ],
//         }
//       );
//     }
//     var nx = B.getColumnDimension();
//     var X = B.getArrayCopy();
//     for (var k = 0; k < this.n; k++) {
//       for (var j = 0; j < nx; j++) {
//         var s = 0.0;
//         for (var i = k; i < this.m; i++) {
//           s += this.QR[i][k] * X[i][j];
//         }
//         s = -s / this.QR[k][k];
//         for (var i = k; i < this.m; i++) {
//           X[i][j] += s * this.QR[i][k];
//         }
//       }
//     }
//     for (var k = this.n - 1; k >= 0; k--) {
//       for (var j = 0; j < nx; j++) {
//         X[k][j] /= this.Rdiag[k];
//       }
//       for (var i = 0; i < k; i++) {
//         for (var j = 0; j < nx; j++) {
//           X[i][j] -= X[k][j] * this.QR[i][k];
//         }
//       }
//     }
//     return new Matrix_1.Matrix(X, this.n, nx).getMatrix$int$int$int$int(
//       0,
//       this.n - 1,
//       0,
//       nx - 1
//     );
//   };
//   return QRDecomposition;
// })();
// QRDecomposition.serialVersionUID = 1;
// exports.QRDecomposition = QRDecomposition;
// QRDecomposition["__class"] = "Jama.QRDecomposition";
// QRDecomposition["__interfaces"] = ["java.io.Serializable"];
