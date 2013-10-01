// Pacioli primitives
// Paul Griffioen 2013

function g_radian() { return [[1]]; }

function g_pi() { return [[Math.PI]]; }

function g_millimetre() { return [[0.001]]; }

function g_cubic_centimetre() { return [[0.000001]]; }

function g_degree(){ return [[Math.PI/180]]; }

function g_metre(){ return [[1]]; }

function g_delta_x() { return [[1],[0],[0]]; }

function g_delta_y() { return [[0],[1],[0]]; }

function g_delta_z() { return [[0],[0],[1]]; }

function g_Space_bang() { return [[1],[1],[1]]; }

function g_space_conv() {
  var a = num2pacioli(1, 'millimetre', 'metre');
  var b = num2pacioli(1, 'millimetre', 'metre');
  var c = num2pacioli(1, 'millimetre', 'metre');
  return [[a,0,0],
          [0,b,0],
          [0,0,c]];
}

function g__() { return 0; }

function num2pacioli(magnitude, from, to) {
    return [[magnitude * ((from == 1) ? 1 : fetch_global(from)) / ((to == 1) ? 1 : fetch_global(to))]];
}

function pacioli2num(number, from, to) {
    return number[0][0] * ((to == 1 ) ? 1 : fetch_global(to)) / ((from == 1 ) ? 1 : fetch_global(from));
}

function fetch_global(name) {
  if (window["_"+name] == undefined) {
    window["_"+name] = window["g_"+name]();
  }
  return window["_"+name];
}

function _abs(x) {
  return [[Math.abs(x[0][0])]];
}

function _add_mut(list,item) {
  list.push(item);
  return list;
}

function _append(x,y) {
  return x.concat(y);
}

function _apply(fun,arg) {
  return fun.apply(this, arg);
}

function _column(x, j) {
  var m = x.length;
  var matrix = new Array(m);
  for (var i = 0; i < m; i++) {
    matrix[i] = [x[i][j]];
  }
  return matrix;
}

function _cons(item,list) {
  return _append(_singleton_list(item), list);
}

function _cos(x) {
  return [[Math.cos(x[0][0])]];
}

function _acos(x) {
  return [[Math.acos(x[0][0])]];
}

function _atan2(x, y) {
  return [[Math.atan2(x[0][0], y[0][0])]];
}

function _empty_list() {
  return [];
}

function _equal(x,y) {
    // Source: http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
    var i;

    // null and undefined won't have this function in their prototype
    // so it's safe to conclude that any other object is not equal to them
    if (x === undefined || x === null) {
        return false;
    }
    if (y === undefined || y === null) {
        return false;
    }
    if (typeof(x) !== 'object' && y !== x) {
        return false;
    }
    // if objects are of different types or lengths they can't be equal
    if (y.constructor !== x.constructor || y.length !== x.length) {
        return false;
    }
    for (i in y) {
        if (y.propertyIsEnumerable(i) && x.propertyIsEnumerable(i)) {
            try {
                // in case object is not null is has equals in it's prototype
                if (! _equal(y[i], x[i])) {
                    return false;
                }
            }
            catch (e) {
                // you're here if 'y' is null or undefined
                if (y[i] !== x[i]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function _expt(x,y) {
  return x.map(function (row) { return row.map(function (val) { return Math.pow(val,y[0][0]); }); });
}

function _fold_list(fun, list) {
  var accu = list[0];
  for (var i = 1; i < list.length; i++) {
    accu = _apply(fun, [accu, list[i]]);
  }
  return accu;
}

function _space_vec(x,y,z) {
  return [[x[0][0]],
          [y[0][0]],
          [z[0][0]]];
}

function _geom_vec(x,y,z) {
  return _join(_reciprocal(fetch_global('space_conv')), _space_vec(x, y, z));
}

function _head(x) {
  return x[0];
}

function _inverse(x) {
  // Overwrites the non-working inverse from the standard lib. Works
  // only for 3x3 matrices. This is sufficient for the Geometry
  // library. Source:
  // http://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_3.C3.973_matrices
  var a = x[0][0];
  var b = x[0][1];
  var c = x[0][2];
  var d = x[1][0];
  var e = x[1][1];
  var f = x[1][2];
  var g = x[2][0];
  var h = x[2][1];
  var k = x[2][2];

  var det = a*(e*k + f*h) - b*(k*d - f*g) + c*(d*h - e*g);

  if ( det === 0 ) {
    console.warn("Matrix is singular!!!");
  }

  var matrix = [[e*k-f*h, c*h-b*k, b*f-c*e],
                [f*g-d*k, a*k-c*g, c*d-a*f],
                [d*h-e*g, g*b-a*h, a*e-b*d]];

  return _scale([[1/det]], matrix);
}

function _join(x,y) {
  var m = x.length;
  var n = y[0].length;
  var l = x[0].length;
  var matrix = new Array(m);
  for (var i = 0; i < m; i++) {
    var row = new Array(n);
    for (var j = 0; j < n; j++) {
      row[j] = 0;
      for (var k = 0; k < l; k++) {
        row[j] = row[j] + x[i][k]*y[k][j];
      }
    }
    matrix[i] = row;
  }
  return matrix;
}

function _list_size(x) {
  return [[x.length]];
}

function _log(x, y) {
  return [[Math.log(x[0][0])/Math.log(y[0][0])]];
}

function _exp(x) {
  return [[Math.exp(x[0][0])]];
}

function _less(x,y) {
  var m = x.length;
  var n = x[0].length;
  for (var i = 0; i < m; i++) {
    for (var j = 0; j < n; j++) {
        if (x[i][j] >= y[i][j]) {
            return false;
        }
    }
  }
  return true;
}

function _ln(x) {
  return [[Math.log(x[0][0])]];
}

function _loop_list(init, fun, list) {
  var accu = init;
  for (var i = 0; i < list.length; i++) {
    accu = _apply(fun, [accu, list[i]]);
  }
  return accu;
}

function _unit_factor(x) {
  return [[1]];
}

function _magnitude(x) {
  return x;
}

function _multiply(x,y) {
  var m = x.length;
  var n = x[0].length;
  var matrix = new Array(m);
  for (var i = 0; i < m; i++) {
    var row = new Array(n);
    for (var j = 0; j < n; j++) {
      row[j] = x[i][j] * y[i][j];
    }
    matrix[i] = row;
  }
  return matrix;
}

function _naturals(n) {
  list = new Array(n[0][0]);
  for (var i = 0; i < n[0][0]; i++) {
    list[i] = [[i]];
  }
  return list;
}

function _negative(x) {
  var m = x.length;
  var n = x[0].length;
  var matrix = new Array(m);
  for (var i = 0; i < m; i++) {
    var row = new Array(n);
    for (var j = 0; j < n; j++) {
      row[j] = - x[i][j];
    }
    matrix[i] = row;
  }
  return matrix;
}

function _nth(x,y) {
  return y[x];
}

function _print(x) {
  alert(x);
  return x;
}

function _reciprocal(x) {
  var m = x.length;
  var n = x[0].length;
  var matrix = new Array(m);
  for (var i = 0; i < m; i++) {
    var row = new Array(n);
    for (var j = 0; j < n; j++) {
      var val = x[i][j];
      row[j] = val == 0 ? 0 : 1 / val;
    }
    matrix[i] = row;
  }
  return matrix;
}

function _row(x, i) {
  return [x[i]];
}

function _scale(x,y) {
  var m = y.length;
  var n = y[0].length;
  var matrix = new Array(m);
  for (var i = 0; i < m; i++) {
    var row = new Array(n);
    for (var j = 0; j < n; j++) {
      row[j] = x * y[i][j];
    }
    matrix[i] = row;
  }
  return matrix;
}

function _sin(x) {
  return [[Math.sin(x[0][0])]];
}

function _singleton_list(x) {
  return [x];
}

function _sqrt(x) {
  return [[Math.sqrt(x[0][0])]];
}

function _sum(x,y) {
  var m = x.length;
  var n = x[0].length;
  var matrix = new Array(m);
  for (var i = 0; i < m; i++) {
    var row = new Array(n);
    for (var j = 0; j < n; j++) {
      row[j] = x[i][j] + y[i][j];
    }
    matrix[i] = row;
  }
  return matrix;
}

function _surf(x) {
  return x;
}

function _tail(x) {
  var array = new Array(x.length-1);
  for (var i = 0; i < array.length; i++) {
    array[i] = x[i+1];
  }
  return array;
}

function _transpose(x) {
  var m = x.length;
  var n = x[0].length;
  var matrix = new Array(n);
  for (var i = 0; i < n; i++) {
    var row = new Array(m);
    for (var j = 0; j < m; j++) {
      row[j] = x[j][i];
    }
    matrix[i] = row;
  }
  return matrix;
}

function _tuple() {
  return Array.prototype.slice.call(arguments);
}

function _zip(x,y) {
  var list = new Array(x.length);
  for (var i = 0; i < list.length; i++) {
    list[i] = [x[i], y[i]];
  }
  return list;
}
