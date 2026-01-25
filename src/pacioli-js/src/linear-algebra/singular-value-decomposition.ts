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

import { copyMatrix, hypot, zeroArray, zeroMatrix } from "./util";

/**
 * Singular Value Decomposition (SVD) of a matrix.
 *
 * Requires that the number of rows is at least the number of columns (m >= n).
 *
 * Ported from the NIST JAMA library.
 */
export class SingularValueDecomposition {
  private m: number;
  private n: number;
  private U: number[][];
  private V: number[][];
  private s: number[];

  constructor(mat: number[][]) {
    if (mat.length === 0) {
      throw new Error("Matrix cannot have empty rows.");
    }

    var A = copyMatrix(mat);

    this.m = A.length;
    this.n = A[0].length;

    // The code below handles the m < n case, but it is not clear if that works. Better
    // safe than sorry, so we throw an error for now.
    if (this.m < this.n) {
      throw new Error(
        "SVD Error: number of rows must be at least number of columns (m >= n)",
      );
    }

    var nu = Math.min(this.m, this.n);

    this.s = zeroArray(Math.min(this.m + 1, this.n));

    this.U = zeroMatrix(this.m, nu);

    this.V = zeroMatrix(this.n, this.n);

    var e = (function (s) {
      var a = [];
      while (s-- > 0) a.push(0);
      return a;
    })(this.n);
    var work = (function (s) {
      var a = [];
      while (s-- > 0) a.push(0);
      return a;
    })(this.m);
    var wantu = true;
    var wantv = true;
    var nct = Math.min(this.m - 1, this.n);
    var nrt = Math.max(0, Math.min(this.n - 2, this.m));
    for (var k = 0; k < Math.max(nct, nrt); k++) {
      if (k < nct) {
        this.s[k] = 0;
        for (var i = k; i < this.m; i++) {
          this.s[k] = hypot(this.s[k], A[i][k]);
        }
        if (this.s[k] !== 0.0) {
          if (A[k][k] < 0.0) {
            this.s[k] = -this.s[k];
          }
          for (var i = k; i < this.m; i++) {
            A[i][k] /= this.s[k];
          }
          A[k][k] += 1.0;
        }
        this.s[k] = -this.s[k];
      }
      for (var j = k + 1; j < this.n; j++) {
        if (
          (function (lhs, rhs) {
            return lhs && rhs;
          })(k < nct, this.s[k] !== 0.0)
        ) {
          var t = 0;
          for (var i = k; i < this.m; i++) {
            t += A[i][k] * A[i][j];
          }
          t = -t / A[k][k];
          for (var i = k; i < this.m; i++) {
            A[i][j] += t * A[i][k];
          }
        }
        e[j] = A[k][j];
      }
      if (
        (function (lhs, rhs) {
          return lhs && rhs;
        })(wantu, k < nct)
      ) {
        for (var i = k; i < this.m; i++) {
          this.U[i][k] = A[i][k];
        }
      }
      if (k < nrt) {
        e[k] = 0;
        for (var i = k + 1; i < this.n; i++) {
          e[k] = hypot(e[k], e[i]);
        }
        if (e[k] !== 0.0) {
          if (e[k + 1] < 0.0) {
            e[k] = -e[k];
          }
          for (var i = k + 1; i < this.n; i++) {
            e[i] /= e[k];
          }
          e[k + 1] += 1.0;
        }
        e[k] = -e[k];
        if (
          (function (lhs, rhs) {
            return lhs && rhs;
          })(k + 1 < this.m, e[k] !== 0.0)
        ) {
          for (var i = k + 1; i < this.m; i++) {
            work[i] = 0.0;
          }
          for (var j = k + 1; j < this.n; j++) {
            for (var i = k + 1; i < this.m; i++) {
              work[i] += e[j] * A[i][j];
            }
          }
          for (var j = k + 1; j < this.n; j++) {
            var t = -e[j] / e[k + 1];
            for (var i = k + 1; i < this.m; i++) {
              A[i][j] += t * work[i];
            }
          }
        }
        if (wantv) {
          for (var i = k + 1; i < this.n; i++) {
            this.V[i][k] = e[i];
          }
        }
      }
    }
    var p = Math.min(this.n, this.m + 1);
    if (nct < this.n) {
      this.s[nct] = A[nct][nct];
    }
    if (this.m < p) {
      this.s[p - 1] = 0.0;
    }
    if (nrt + 1 < p) {
      e[nrt] = A[nrt][p - 1];
    }
    e[p - 1] = 0.0;
    if (wantu) {
      for (var j = nct; j < nu; j++) {
        for (var i = 0; i < this.m; i++) {
          this.U[i][j] = 0.0;
        }
        this.U[j][j] = 1.0;
      }
      for (var k = nct - 1; k >= 0; k--) {
        if (this.s[k] !== 0.0) {
          for (var j = k + 1; j < nu; j++) {
            var t = 0;
            for (var i = k; i < this.m; i++) {
              t += this.U[i][k] * this.U[i][j];
            }
            t = -t / this.U[k][k];
            for (var i = k; i < this.m; i++) {
              this.U[i][j] += t * this.U[i][k];
            }
          }
          for (var i = k; i < this.m; i++) {
            this.U[i][k] = -this.U[i][k];
          }
          this.U[k][k] = 1.0 + this.U[k][k];
          for (var i = 0; i < k - 1; i++) {
            this.U[i][k] = 0.0;
          }
        } else {
          for (var i = 0; i < this.m; i++) {
            this.U[i][k] = 0.0;
          }
          this.U[k][k] = 1.0;
        }
      }
    }
    if (wantv) {
      for (var k = this.n - 1; k >= 0; k--) {
        if (
          (function (lhs, rhs) {
            return lhs && rhs;
          })(k < nrt, e[k] !== 0.0)
        ) {
          for (var j = k + 1; j < nu; j++) {
            var t = 0;
            for (var i = k + 1; i < this.n; i++) {
              t += this.V[i][k] * this.V[i][j];
            }
            t = -t / this.V[k + 1][k];
            for (var i = k + 1; i < this.n; i++) {
              this.V[i][j] += t * this.V[i][k];
            }
          }
        }
        for (var i = 0; i < this.n; i++) {
          this.V[i][k] = 0.0;
        }
        this.V[k][k] = 1.0;
      }
    }
    var pp = p - 1;
    var iter = 0;
    var eps = Math.pow(2.0, -52.0);
    var tiny = Math.pow(2.0, -966.0);
    while (p > 0) {
      var k = 0;
      var kase = 0;
      for (k = p - 2; k >= -1; k--) {
        if (k === -1) {
          break;
        }
        if (
          Math.abs(e[k]) <=
          tiny + eps * (Math.abs(this.s[k]) + Math.abs(this.s[k + 1]))
        ) {
          e[k] = 0.0;
          break;
        }
      }
      if (k === p - 2) {
        kase = 4;
      } else {
        var ks = 0;
        for (ks = p - 1; ks >= k; ks--) {
          if (ks === k) {
            break;
          }
          var t =
            (ks !== p ? Math.abs(e[ks]) : 0.0) +
            (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0.0);
          if (Math.abs(this.s[ks]) <= tiny + eps * t) {
            this.s[ks] = 0.0;
            break;
          }
        }
        if (ks === k) {
          kase = 3;
        } else if (ks === p - 1) {
          kase = 1;
        } else {
          kase = 2;
          k = ks;
        }
      }
      k++;
      switch (kase) {
        case 1:
          {
            var f = e[p - 2];
            e[p - 2] = 0.0;
            for (var j = p - 2; j >= k; j--) {
              var t = hypot(this.s[j], f);
              var cs = this.s[j] / t;
              var sn = f / t;
              this.s[j] = t;
              if (j !== k) {
                f = -sn * e[j - 1];
                e[j - 1] = cs * e[j - 1];
              }
              if (wantv) {
                for (var i = 0; i < this.n; i++) {
                  t = cs * this.V[i][j] + sn * this.V[i][p - 1];
                  this.V[i][p - 1] = -sn * this.V[i][j] + cs * this.V[i][p - 1];
                  this.V[i][j] = t;
                }
              }
            }
          }
          break;
        case 2:
          {
            var f = e[k - 1];
            e[k - 1] = 0.0;
            for (var j = k; j < p; j++) {
              var t = hypot(this.s[j], f);
              var cs = this.s[j] / t;
              var sn = f / t;
              this.s[j] = t;
              f = -sn * e[j];
              e[j] = cs * e[j];
              if (wantu) {
                for (var i = 0; i < this.m; i++) {
                  t = cs * this.U[i][j] + sn * this.U[i][k - 1];
                  this.U[i][k - 1] = -sn * this.U[i][j] + cs * this.U[i][k - 1];
                  this.U[i][j] = t;
                }
              }
            }
          }
          break;
        case 3:
          {
            var scale = Math.max(
              Math.max(
                Math.max(
                  Math.max(Math.abs(this.s[p - 1]), Math.abs(this.s[p - 2])),
                  Math.abs(e[p - 2]),
                ),
                Math.abs(this.s[k]),
              ),
              Math.abs(e[k]),
            );
            var sp = this.s[p - 1] / scale;
            var spm1 = this.s[p - 2] / scale;
            var epm1 = e[p - 2] / scale;
            var sk = this.s[k] / scale;
            var ek = e[k] / scale;
            var b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2.0;
            var c = sp * epm1 * (sp * epm1);
            var shift = 0.0;
            if (
              (function (lhs, rhs) {
                return lhs || rhs;
              })(b !== 0.0, c !== 0.0)
            ) {
              shift = Math.sqrt(b * b + c);
              if (b < 0.0) {
                shift = -shift;
              }
              shift = c / (b + shift);
            }
            var f = (sk + sp) * (sk - sp) + shift;
            var g = sk * ek;
            for (var j = k; j < p - 1; j++) {
              var t = hypot(f, g);
              var cs = f / t;
              var sn = g / t;
              if (j !== k) {
                e[j - 1] = t;
              }
              f = cs * this.s[j] + sn * e[j];
              e[j] = cs * e[j] - sn * this.s[j];
              g = sn * this.s[j + 1];
              this.s[j + 1] = cs * this.s[j + 1];
              if (wantv) {
                for (var i = 0; i < this.n; i++) {
                  t = cs * this.V[i][j] + sn * this.V[i][j + 1];
                  this.V[i][j + 1] = -sn * this.V[i][j] + cs * this.V[i][j + 1];
                  this.V[i][j] = t;
                }
              }
              t = hypot(f, g);
              cs = f / t;
              sn = g / t;
              this.s[j] = t;
              f = cs * e[j] + sn * this.s[j + 1];
              this.s[j + 1] = -sn * e[j] + cs * this.s[j + 1];
              g = sn * e[j + 1];
              e[j + 1] = cs * e[j + 1];
              if (wantu && j < this.m - 1) {
                for (var i = 0; i < this.m; i++) {
                  t = cs * this.U[i][j] + sn * this.U[i][j + 1];
                  this.U[i][j + 1] = -sn * this.U[i][j] + cs * this.U[i][j + 1];
                  this.U[i][j] = t;
                }
              }
            }
            e[p - 2] = f;
            iter = iter + 1;
          }
          break;
        case 4:
          {
            if (this.s[k] <= 0.0) {
              this.s[k] = this.s[k] < 0.0 ? -this.s[k] : 0.0;
              if (wantv) {
                for (var i = 0; i <= pp; i++) {
                  this.V[i][k] = -this.V[i][k];
                }
              }
            }
            while (k < pp) {
              if (this.s[k] >= this.s[k + 1]) {
                break;
              }
              var t = this.s[k];
              this.s[k] = this.s[k + 1];
              this.s[k + 1] = t;
              if (wantv && k < this.n - 1) {
                for (var i = 0; i < this.n; i++) {
                  t = this.V[i][k + 1];
                  this.V[i][k + 1] = this.V[i][k];
                  this.V[i][k] = t;
                }
              }
              if (wantu && k < this.m - 1) {
                for (var i = 0; i < this.m; i++) {
                  t = this.U[i][k + 1];
                  this.U[i][k + 1] = this.U[i][k];
                  this.U[i][k] = t;
                }
              }
              k++;
            }
            iter = 0;
            p--;
          }
          break;
      }
    }
  }

  /**
   * Return the left singular vectors
   *
   * @return U
   */
  getU(): number[][] {
    return this.U;
  }

  /**
   * Return the right singular vectors
   *
   * @return V
   */
  getV(): number[][] {
    return this.V;
  }

  /**
   * Return the one-dimensional array of singular values
   *
   * @return diagonal of S.
   */
  getSingularValues(): number[] {
    return this.s;
  }

  /**
   * Return the diagonal matrix of singular values
   *
   * @return S
   */
  getS(): number[][] {
    var S = zeroMatrix(this.n, this.n);
    for (var i = 0; i < this.n; i++) {
      S[i][i] = this.s[i];
    }
    return S;
  }

  /**
   * Two norm
   *
   * @return max(S)
   */
  norm2(): number {
    return this.s[0];
  }

  /**
   * Two norm condition number
   *
   * @return max(S)/min(S)
   */
  cond(): number {
    return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
  }

  /**
   * Effective numerical matrix rank
   *
   * @return Number of nonnegligible singular values.
   */
  rank(): number {
    var eps = Math.pow(2.0, -52.0);
    var tol = Math.max(this.m, this.n) * this.s[0] * eps;
    var r = 0;
    for (var i = 0; i < this.s.length; i++) {
      if (this.s[i] > tol) {
        r++;
      }
    }
    return r;
  }
}

// "use strict";
// /* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
// var Maths_1 = require("./util/Maths");
// var Matrix_1 = require("./Matrix");
// /**
//  * Construct the singular value decomposition
//  * Structure to access U, S and V.
//  * @param {Matrix} Arg    Rectangular matrix
//  * @class
//  */
// var SingularValueDecomposition = (function () {
//     function SingularValueDecomposition(Arg) {
//         this.U = null;
//         this.V = null;
//         this.s = null;
//         this.m = 0;
//         this.n = 0;
//         var A = Arg.getArrayCopy();
//         this.m = Arg.getRowDimension();
//         this.n = Arg.getColumnDimension();
//         var nu = Math.min(this.m, this.n);
//         this.s = (function (s) { var a = []; while (s-- > 0)
//             a.push(0); return a; })(Math.min(this.m + 1, this.n));
//         this.U = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
//             return 0;
//         }
//         else {
//             var array = [];
//             for (var i = 0; i < dims[0]; i++) {
//                 array.push(allocate(dims.slice(1)));
//             }
//             return array;
//         } }; return allocate(dims); })([this.m, nu]);
//         this.V = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
//             return 0;
//         }
//         else {
//             var array = [];
//             for (var i = 0; i < dims[0]; i++) {
//                 array.push(allocate(dims.slice(1)));
//             }
//             return array;
//         } }; return allocate(dims); })([this.n, this.n]);
//         var e = (function (s) { var a = []; while (s-- > 0)
//             a.push(0); return a; })(this.n);
//         var work = (function (s) { var a = []; while (s-- > 0)
//             a.push(0); return a; })(this.m);
//         var wantu = true;
//         var wantv = true;
//         var nct = Math.min(this.m - 1, this.n);
//         var nrt = Math.max(0, Math.min(this.n - 2, this.m));
//         for (var k = 0; k < Math.max(nct, nrt); k++) {
//             if (k < nct) {
//                 this.s[k] = 0;
//                 for (var i = k; i < this.m; i++) {
//                     this.s[k] = Maths_1.Maths.hypot(this.s[k], A[i][k]);
//                 }
//                 ;
//                 if (this.s[k] !== 0.0) {
//                     if (A[k][k] < 0.0) {
//                         this.s[k] = -this.s[k];
//                     }
//                     for (var i = k; i < this.m; i++) {
//                         A[i][k] /= this.s[k];
//                     }
//                     ;
//                     A[k][k] += 1.0;
//                 }
//                 this.s[k] = -this.s[k];
//             }
//             for (var j = k + 1; j < this.n; j++) {
//                 if ((function (lhs, rhs) { return lhs && rhs; })((k < nct), (this.s[k] !== 0.0))) {
//                     var t = 0;
//                     for (var i = k; i < this.m; i++) {
//                         t += A[i][k] * A[i][j];
//                     }
//                     ;
//                     t = -t / A[k][k];
//                     for (var i = k; i < this.m; i++) {
//                         A[i][j] += t * A[i][k];
//                     }
//                     ;
//                 }
//                 e[j] = A[k][j];
//             }
//             ;
//             if ((function (lhs, rhs) { return lhs && rhs; })(wantu, (k < nct))) {
//                 for (var i = k; i < this.m; i++) {
//                     this.U[i][k] = A[i][k];
//                 }
//                 ;
//             }
//             if (k < nrt) {
//                 e[k] = 0;
//                 for (var i = k + 1; i < this.n; i++) {
//                     e[k] = Maths_1.Maths.hypot(e[k], e[i]);
//                 }
//                 ;
//                 if (e[k] !== 0.0) {
//                     if (e[k + 1] < 0.0) {
//                         e[k] = -e[k];
//                     }
//                     for (var i = k + 1; i < this.n; i++) {
//                         e[i] /= e[k];
//                     }
//                     ;
//                     e[k + 1] += 1.0;
//                 }
//                 e[k] = -e[k];
//                 if ((function (lhs, rhs) { return lhs && rhs; })((k + 1 < this.m), (e[k] !== 0.0))) {
//                     for (var i = k + 1; i < this.m; i++) {
//                         work[i] = 0.0;
//                     }
//                     ;
//                     for (var j = k + 1; j < this.n; j++) {
//                         for (var i = k + 1; i < this.m; i++) {
//                             work[i] += e[j] * A[i][j];
//                         }
//                         ;
//                     }
//                     ;
//                     for (var j = k + 1; j < this.n; j++) {
//                         var t = -e[j] / e[k + 1];
//                         for (var i = k + 1; i < this.m; i++) {
//                             A[i][j] += t * work[i];
//                         }
//                         ;
//                     }
//                     ;
//                 }
//                 if (wantv) {
//                     for (var i = k + 1; i < this.n; i++) {
//                         this.V[i][k] = e[i];
//                     }
//                     ;
//                 }
//             }
//         }
//         ;
//         var p = Math.min(this.n, this.m + 1);
//         if (nct < this.n) {
//             this.s[nct] = A[nct][nct];
//         }
//         if (this.m < p) {
//             this.s[p - 1] = 0.0;
//         }
//         if (nrt + 1 < p) {
//             e[nrt] = A[nrt][p - 1];
//         }
//         e[p - 1] = 0.0;
//         if (wantu) {
//             for (var j = nct; j < nu; j++) {
//                 for (var i = 0; i < this.m; i++) {
//                     this.U[i][j] = 0.0;
//                 }
//                 ;
//                 this.U[j][j] = 1.0;
//             }
//             ;
//             for (var k = nct - 1; k >= 0; k--) {
//                 if (this.s[k] !== 0.0) {
//                     for (var j = k + 1; j < nu; j++) {
//                         var t = 0;
//                         for (var i = k; i < this.m; i++) {
//                             t += this.U[i][k] * this.U[i][j];
//                         }
//                         ;
//                         t = -t / this.U[k][k];
//                         for (var i = k; i < this.m; i++) {
//                             this.U[i][j] += t * this.U[i][k];
//                         }
//                         ;
//                     }
//                     ;
//                     for (var i = k; i < this.m; i++) {
//                         this.U[i][k] = -this.U[i][k];
//                     }
//                     ;
//                     this.U[k][k] = 1.0 + this.U[k][k];
//                     for (var i = 0; i < k - 1; i++) {
//                         this.U[i][k] = 0.0;
//                     }
//                     ;
//                 }
//                 else {
//                     for (var i = 0; i < this.m; i++) {
//                         this.U[i][k] = 0.0;
//                     }
//                     ;
//                     this.U[k][k] = 1.0;
//                 }
//             }
//             ;
//         }
//         if (wantv) {
//             for (var k = this.n - 1; k >= 0; k--) {
//                 if ((function (lhs, rhs) { return lhs && rhs; })((k < nrt), (e[k] !== 0.0))) {
//                     for (var j = k + 1; j < nu; j++) {
//                         var t = 0;
//                         for (var i = k + 1; i < this.n; i++) {
//                             t += this.V[i][k] * this.V[i][j];
//                         }
//                         ;
//                         t = -t / this.V[k + 1][k];
//                         for (var i = k + 1; i < this.n; i++) {
//                             this.V[i][j] += t * this.V[i][k];
//                         }
//                         ;
//                     }
//                     ;
//                 }
//                 for (var i = 0; i < this.n; i++) {
//                     this.V[i][k] = 0.0;
//                 }
//                 ;
//                 this.V[k][k] = 1.0;
//             }
//             ;
//         }
//         var pp = p - 1;
//         var iter = 0;
//         var eps = Math.pow(2.0, -52.0);
//         var tiny = Math.pow(2.0, -966.0);
//         while ((p > 0)) {
//             var k = void 0;
//             var kase = void 0;
//             for (k = p - 2; k >= -1; k--) {
//                 if (k === -1) {
//                     break;
//                 }
//                 if (Math.abs(e[k]) <= tiny + eps * (Math.abs(this.s[k]) + Math.abs(this.s[k + 1]))) {
//                     e[k] = 0.0;
//                     break;
//                 }
//             }
//             ;
//             if (k === p - 2) {
//                 kase = 4;
//             }
//             else {
//                 var ks = void 0;
//                 for (ks = p - 1; ks >= k; ks--) {
//                     if (ks === k) {
//                         break;
//                     }
//                     var t = (ks !== p ? Math.abs(e[ks]) : 0.0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0.0);
//                     if (Math.abs(this.s[ks]) <= tiny + eps * t) {
//                         this.s[ks] = 0.0;
//                         break;
//                     }
//                 }
//                 ;
//                 if (ks === k) {
//                     kase = 3;
//                 }
//                 else if (ks === p - 1) {
//                     kase = 1;
//                 }
//                 else {
//                     kase = 2;
//                     k = ks;
//                 }
//             }
//             k++;
//             switch ((kase)) {
//                 case 1:
//                     {
//                         var f = e[p - 2];
//                         e[p - 2] = 0.0;
//                         for (var j = p - 2; j >= k; j--) {
//                             var t = Maths_1.Maths.hypot(this.s[j], f);
//                             var cs = this.s[j] / t;
//                             var sn = f / t;
//                             this.s[j] = t;
//                             if (j !== k) {
//                                 f = -sn * e[j - 1];
//                                 e[j - 1] = cs * e[j - 1];
//                             }
//                             if (wantv) {
//                                 for (var i = 0; i < this.n; i++) {
//                                     t = cs * this.V[i][j] + sn * this.V[i][p - 1];
//                                     this.V[i][p - 1] = -sn * this.V[i][j] + cs * this.V[i][p - 1];
//                                     this.V[i][j] = t;
//                                 }
//                                 ;
//                             }
//                         }
//                         ;
//                     }
//                     ;
//                     break;
//                 case 2:
//                     {
//                         var f = e[k - 1];
//                         e[k - 1] = 0.0;
//                         for (var j = k; j < p; j++) {
//                             var t = Maths_1.Maths.hypot(this.s[j], f);
//                             var cs = this.s[j] / t;
//                             var sn = f / t;
//                             this.s[j] = t;
//                             f = -sn * e[j];
//                             e[j] = cs * e[j];
//                             if (wantu) {
//                                 for (var i = 0; i < this.m; i++) {
//                                     t = cs * this.U[i][j] + sn * this.U[i][k - 1];
//                                     this.U[i][k - 1] = -sn * this.U[i][j] + cs * this.U[i][k - 1];
//                                     this.U[i][j] = t;
//                                 }
//                                 ;
//                             }
//                         }
//                         ;
//                     }
//                     ;
//                     break;
//                 case 3:
//                     {
//                         var scale = Math.max(Math.max(Math.max(Math.max(Math.abs(this.s[p - 1]), Math.abs(this.s[p - 2])), Math.abs(e[p - 2])), Math.abs(this.s[k])), Math.abs(e[k]));
//                         var sp = this.s[p - 1] / scale;
//                         var spm1 = this.s[p - 2] / scale;
//                         var epm1 = e[p - 2] / scale;
//                         var sk = this.s[k] / scale;
//                         var ek = e[k] / scale;
//                         var b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2.0;
//                         var c = (sp * epm1) * (sp * epm1);
//                         var shift = 0.0;
//                         if ((function (lhs, rhs) { return lhs || rhs; })((b !== 0.0), (c !== 0.0))) {
//                             shift = Math.sqrt(b * b + c);
//                             if (b < 0.0) {
//                                 shift = -shift;
//                             }
//                             shift = c / (b + shift);
//                         }
//                         var f = (sk + sp) * (sk - sp) + shift;
//                         var g = sk * ek;
//                         for (var j = k; j < p - 1; j++) {
//                             var t = Maths_1.Maths.hypot(f, g);
//                             var cs = f / t;
//                             var sn = g / t;
//                             if (j !== k) {
//                                 e[j - 1] = t;
//                             }
//                             f = cs * this.s[j] + sn * e[j];
//                             e[j] = cs * e[j] - sn * this.s[j];
//                             g = sn * this.s[j + 1];
//                             this.s[j + 1] = cs * this.s[j + 1];
//                             if (wantv) {
//                                 for (var i = 0; i < this.n; i++) {
//                                     t = cs * this.V[i][j] + sn * this.V[i][j + 1];
//                                     this.V[i][j + 1] = -sn * this.V[i][j] + cs * this.V[i][j + 1];
//                                     this.V[i][j] = t;
//                                 }
//                                 ;
//                             }
//                             t = Maths_1.Maths.hypot(f, g);
//                             cs = f / t;
//                             sn = g / t;
//                             this.s[j] = t;
//                             f = cs * e[j] + sn * this.s[j + 1];
//                             this.s[j + 1] = -sn * e[j] + cs * this.s[j + 1];
//                             g = sn * e[j + 1];
//                             e[j + 1] = cs * e[j + 1];
//                             if (wantu && (j < this.m - 1)) {
//                                 for (var i = 0; i < this.m; i++) {
//                                     t = cs * this.U[i][j] + sn * this.U[i][j + 1];
//                                     this.U[i][j + 1] = -sn * this.U[i][j] + cs * this.U[i][j + 1];
//                                     this.U[i][j] = t;
//                                 }
//                                 ;
//                             }
//                         }
//                         ;
//                         e[p - 2] = f;
//                         iter = iter + 1;
//                     }
//                     ;
//                     break;
//                 case 4:
//                     {
//                         if (this.s[k] <= 0.0) {
//                             this.s[k] = (this.s[k] < 0.0 ? -this.s[k] : 0.0);
//                             if (wantv) {
//                                 for (var i = 0; i <= pp; i++) {
//                                     this.V[i][k] = -this.V[i][k];
//                                 }
//                                 ;
//                             }
//                         }
//                         while ((k < pp)) {
//                             if (this.s[k] >= this.s[k + 1]) {
//                                 break;
//                             }
//                             var t = this.s[k];
//                             this.s[k] = this.s[k + 1];
//                             this.s[k + 1] = t;
//                             if (wantv && (k < this.n - 1)) {
//                                 for (var i = 0; i < this.n; i++) {
//                                     t = this.V[i][k + 1];
//                                     this.V[i][k + 1] = this.V[i][k];
//                                     this.V[i][k] = t;
//                                 }
//                                 ;
//                             }
//                             if (wantu && (k < this.m - 1)) {
//                                 for (var i = 0; i < this.m; i++) {
//                                     t = this.U[i][k + 1];
//                                     this.U[i][k + 1] = this.U[i][k];
//                                     this.U[i][k] = t;
//                                 }
//                                 ;
//                             }
//                             k++;
//                         }
//                         ;
//                         iter = 0;
//                         p--;
//                     }
//                     ;
//                     break;
//             }
//         }
//         ;
//     }
//     /**
//      * Return the left singular vectors
//      * @return     {Matrix} U
//      */
//     SingularValueDecomposition.prototype.getU = function () {
//         return new Matrix_1.Matrix(this.U, this.m, Math.min(this.m + 1, this.n));
//     };
//     /**
//      * Return the right singular vectors
//      * @return     {Matrix} V
//      */
//     SingularValueDecomposition.prototype.getV = function () {
//         return new Matrix_1.Matrix(this.V, this.n, this.n);
//     };
//     /**
//      * Return the one-dimensional array of singular values
//      * @return     {Array} diagonal of S.
//      */
//     SingularValueDecomposition.prototype.getSingularValues = function () {
//         return this.s;
//     };
//     /**
//      * Return the diagonal matrix of singular values
//      * @return     {Matrix} S
//      */
//     SingularValueDecomposition.prototype.getS = function () {
//         var X = new Matrix_1.Matrix(this.n, this.n);
//         var S = X.getArray();
//         for (var i = 0; i < this.n; i++) {
//             for (var j = 0; j < this.n; j++) {
//                 S[i][j] = 0.0;
//             }
//             ;
//             S[i][i] = this.s[i];
//         }
//         ;
//         return X;
//     };
//     /**
//      * Two norm
//      * @return     {number} max(S)
//      */
//     SingularValueDecomposition.prototype.norm2 = function () {
//         return this.s[0];
//     };
//     /**
//      * Two norm condition number
//      * @return     {number} max(S)/min(S)
//      */
//     SingularValueDecomposition.prototype.cond = function () {
//         return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
//     };
//     /**
//      * Effective numerical matrix rank
//      * @return     {number} Number of nonnegligible singular values.
//      */
//     SingularValueDecomposition.prototype.rank = function () {
//         var eps = Math.pow(2.0, -52.0);
//         var tol = Math.max(this.m, this.n) * this.s[0] * eps;
//         var r = 0;
//         for (var i = 0; i < this.s.length; i++) {
//             if (this.s[i] > tol) {
//                 r++;
//             }
//         }
//         ;
//         return r;
//     };
//     return SingularValueDecomposition;
// }());
// SingularValueDecomposition.serialVersionUID = 1;
// exports.SingularValueDecomposition = SingularValueDecomposition;
// SingularValueDecomposition["__class"] = "Jama.SingularValueDecomposition";
// SingularValueDecomposition["__interfaces"] = ["java.io.Serializable"];
