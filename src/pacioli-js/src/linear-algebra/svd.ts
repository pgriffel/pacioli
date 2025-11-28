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
 * Singular Value Decomposition (SVD) of a matrix.
 *
 * Requires that the number of rows is at least the number of columns (m >= n).
 *
 * Ported from the NIST JAMA library.
 *
 * @param A
 * @param m
 * @param n
 * @returns
 */
export function singularValueDecomposition(
  A: number[][],
  m: number,
  n: number
): {
  U: number[][];
  S: number[];
  V: number[][];
} {
  // The code below handles the m < n case, but it is not clear if that works. Better
  // safe than sorry, so we throw an error for now.
  if (m < n) {
    throw new Error(
      "SVD Error: number of rows must be at least number of columns (m >= n)"
    );
  }

  const U: number[][] = [];
  const V: number[][] = [];
  const s: number[] = [];

  var nu = Math.min(m, n);

  for (var i = 0; i < Math.min(m + 1, n); i++) {
    s.push(0);
  }

  for (var i = 0; i < m; i++) {
    var array = [];
    for (var j = 0; j < nu; j++) {
      array.push(0);
    }
    U.push(array);
  }

  for (var i = 0; i < n; i++) {
    var array = [];
    for (var j = 0; j < n; j++) {
      array.push(0);
    }
    V.push(array);
  }

  const e: number[] = [];
  for (var i = 0; i < n; i++) {
    e.push(0);
  }

  const work: number[] = [];
  for (var i = 0; i < m; i++) {
    work.push(0);
  }

  const wantu = true;
  const wantv = true;

  const nct = Math.min(m - 1, n);
  const nrt = Math.max(0, Math.min(n - 2, m));

  for (var k = 0; k < Math.max(nct, nrt); k++) {
    if (k < nct) {
      s[k] = 0;
      for (var i = k; i < m; i++) {
        s[k] = hypot(s[k], A[i][k]);
      }
      if (s[k] !== 0.0) {
        if (A[k][k] < 0.0) {
          s[k] = -s[k];
        }
        for (var i = k; i < m; i++) {
          A[i][k] /= s[k];
        }
        A[k][k] += 1.0;
      }
      s[k] = -s[k];
    }
    for (var j = k + 1; j < n; j++) {
      if (k < nct && s[k] !== 0.0) {
        var t = 0;
        for (var i = k; i < m; i++) {
          t += A[i][k] * A[i][j];
        }
        t = -t / A[k][k];
        for (var i = k; i < m; i++) {
          A[i][j] += t * A[i][k];
        }
      }
      e[j] = A[k][j];
    }
    if (wantu && k < nct) {
      for (var i = k; i < m; i++) {
        U[i][k] = A[i][k];
      }
    }
    if (k < nrt) {
      e[k] = 0;
      for (var i = k + 1; i < n; i++) {
        e[k] = hypot(e[k], e[i]);
      }
      if (e[k] !== 0.0) {
        if (e[k + 1] < 0.0) {
          e[k] = -e[k];
        }
        for (var i = k + 1; i < n; i++) {
          e[i] /= e[k];
        }
        e[k + 1] += 1.0;
      }
      e[k] = -e[k];
      if (k + 1 < m && e[k] !== 0.0) {
        for (var i = k + 1; i < m; i++) {
          work[i] = 0.0;
        }
        for (var j = k + 1; j < n; j++) {
          for (var i = k + 1; i < m; i++) {
            work[i] += e[j] * A[i][j];
          }
        }
        for (var j = k + 1; j < n; j++) {
          var t = -e[j] / e[k + 1];
          for (var i = k + 1; i < m; i++) {
            A[i][j] += t * work[i];
          }
        }
      }
      if (wantv) {
        for (var i = k + 1; i < n; i++) {
          V[i][k] = e[i];
        }
      }
    }
  }

  var p = Math.min(n, m + 1);

  if (nct < n) {
    s[nct] = A[nct][nct];
  }

  if (m < p) {
    s[p - 1] = 0.0;
  }

  if (nrt + 1 < p) {
    e[nrt] = A[nrt][p - 1];
  }

  e[p - 1] = 0.0;

  if (wantu) {
    for (var j = nct; j < nu; j++) {
      for (var i = 0; i < m; i++) {
        U[i][j] = 0.0;
      }
      U[j][j] = 1.0;
    }

    for (var k = nct - 1; k >= 0; k--) {
      if (s[k] !== 0.0) {
        for (var j = k + 1; j < nu; j++) {
          var t = 0;
          for (var i = k; i < m; i++) {
            t += U[i][k] * U[i][j];
          }
          t = -t / U[k][k];
          for (var i = k; i < m; i++) {
            U[i][j] += t * U[i][k];
          }
        }
        for (var i = k; i < m; i++) {
          U[i][k] = -U[i][k];
        }
        U[k][k] = 1.0 + U[k][k];
        for (var i = 0; i < k - 1; i++) {
          U[i][k] = 0.0;
        }
      } else {
        for (var i = 0; i < m; i++) {
          U[i][k] = 0.0;
        }
        U[k][k] = 1.0;
      }
    }
  }
  if (wantv) {
    for (var k = n - 1; k >= 0; k--) {
      if (k < nrt && e[k] !== 0.0) {
        for (var j = k + 1; j < nu; j++) {
          var t = 0;
          for (var i = k + 1; i < n; i++) {
            t += V[i][k] * V[i][j];
          }
          t = -t / V[k + 1][k];
          for (var i = k + 1; i < n; i++) {
            V[i][j] += t * V[i][k];
          }
        }
      }
      for (var i = 0; i < n; i++) {
        V[i][k] = 0.0;
      }
      V[k][k] = 1.0;
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
        tiny + eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))
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
        if (Math.abs(s[ks]) <= tiny + eps * t) {
          s[ks] = 0.0;
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
            var t = hypot(s[j], f);
            var cs = s[j] / t;
            var sn = f / t;
            s[j] = t;
            if (j !== k) {
              f = -sn * e[j - 1];
              e[j - 1] = cs * e[j - 1];
            }
            if (wantv) {
              for (var i = 0; i < n; i++) {
                t = cs * V[i][j] + sn * V[i][p - 1];
                V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
                V[i][j] = t;
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
            var t = hypot(s[j], f);
            var cs = s[j] / t;
            var sn = f / t;
            s[j] = t;
            f = -sn * e[j];
            e[j] = cs * e[j];
            if (wantu) {
              for (var i = 0; i < m; i++) {
                t = cs * U[i][j] + sn * U[i][k - 1];
                U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
                U[i][j] = t;
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
                Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])),
                Math.abs(e[p - 2])
              ),
              Math.abs(s[k])
            ),
            Math.abs(e[k])
          );
          var sp = s[p - 1] / scale;
          var spm1 = s[p - 2] / scale;
          var epm1 = e[p - 2] / scale;
          var sk = s[k] / scale;
          var ek = e[k] / scale;
          var b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2.0;
          var c = sp * epm1 * (sp * epm1);
          var shift = 0.0;

          if (b !== 0.0 || c !== 0.0) {
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
            f = cs * s[j] + sn * e[j];
            e[j] = cs * e[j] - sn * s[j];
            g = sn * s[j + 1];
            s[j + 1] = cs * s[j + 1];
            if (wantv) {
              for (var i = 0; i < n; i++) {
                t = cs * V[i][j] + sn * V[i][j + 1];
                V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
                V[i][j] = t;
              }
            }
            t = hypot(f, g);
            cs = f / t;
            sn = g / t;
            s[j] = t;
            f = cs * e[j] + sn * s[j + 1];
            s[j + 1] = -sn * e[j] + cs * s[j + 1];
            g = sn * e[j + 1];
            e[j + 1] = cs * e[j + 1];
            if (wantu && j < m - 1) {
              for (var i = 0; i < m; i++) {
                t = cs * U[i][j] + sn * U[i][j + 1];
                U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
                U[i][j] = t;
              }
            }
          }

          e[p - 2] = f;
          iter = iter + 1;
        }
        break;
      case 4:
        {
          if (s[k] <= 0.0) {
            s[k] = s[k] < 0.0 ? -s[k] : 0.0;
            if (wantv) {
              for (var i = 0; i <= pp; i++) {
                V[i][k] = -V[i][k];
              }
            }
          }
          while (k < pp) {
            if (s[k] >= s[k + 1]) {
              break;
            }
            var t = s[k];
            s[k] = s[k + 1];
            s[k + 1] = t;
            if (wantv && k < n - 1) {
              for (var i = 0; i < n; i++) {
                t = V[i][k + 1];
                V[i][k + 1] = V[i][k];
                V[i][k] = t;
              }
            }
            if (wantu && k < m - 1) {
              for (var i = 0; i < m; i++) {
                t = U[i][k + 1];
                U[i][k + 1] = U[i][k];
                U[i][k] = t;
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

  return { U: U, S: s, V: V };
}

function hypot(a: number, b: number) {
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
