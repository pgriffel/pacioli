// Javascript code generated from Pacioli file 'standard'

function _convert (value, from, to) {
  return _multiply(_multiply(value, _unit_factor(_multiply(to, _reciprocal(from)))), _magnitude(_multiply(from, _reciprocal(to))));
}

function _inner (x, y) {
  return _join(_transpose(_column(x, fetch_global('_'))), _column(y, fetch_global('_')));
}

function _outer (x, y) {
  return _join(_column(x, fetch_global('_')), _transpose(_column(y, fetch_global('_'))));
}

function _dual (x) {
  return _transpose(_reciprocal(x));
}

function _total (x) {
  return _loop_list(_scale([[0]], _unit_factor(x)), fetch_global('sum'), _loop_list(_empty_list(), function (accu, r) { return _loop_list(accu, function (accu, v) { return _add_mut(accu, v); }, _columns(r)); }, _rows(x)));
}

function _rows (matrix) {
  return _loop_list(_empty_list(), function (accu, i) { return _add_mut(accu, _row(matrix, i)); }, _row_domain(matrix));
}

function _columns (matrix) {
  return _loop_list(_empty_list(), function (accu, j) { return _add_mut(accu, _column(matrix, j)); }, _column_domain(matrix));
}

function _unit (mat) {
  return _scale(_unit_factor(mat), _join(_row_units(mat), _transpose(_reciprocal(_column_units(mat)))));
}

function _log_not (x) {
  return _sum(_unit(x), _negative(x));
}

function _support (x) {
  return _map_matrix(function (x) { return _equal(x, [[0]]) ? [[0]] : [[1]]; }, _magnitude(x));
}

function _positive_support (x) {
  return _map_matrix(function (x) { return _less([[0]], x) ? [[1]] : [[0]]; }, _magnitude(x));
}

function _negative_support (x) {
  return _map_matrix(function (x) { return _less(x, [[0]]) ? [[1]] : [[0]]; }, _magnitude(x));
}

function _positives (x) {
  return _multiply(x, _positive_support(x));
}

function _negatives (x) {
  return _multiply(x, _negative_support(x));
}

function _diagonal (x) {
  return function (u) { return function (units) { return _multiply(_matrix_from_tuples(_loop_list(_empty_set(), function (accu, i) { return _adjoin_mut(accu, _tuple(i, i, _get_num(x, i, fetch_global('_')))); }, _row_domain(x))), units); }.apply(this, _tuple(_scale(_unit_factor(x), _join(u, _transpose(_reciprocal(u)))))); }.apply(this, _tuple(_unit(x)));
}

function _left_identity (x) {
  return _diagonal(_row_units(x));
}

function _right_identity (x) {
  return _diagonal(_column_units(x));
}

function _closure_alt (x) {
  return _sum(_kleene_alt(x), _negative(_left_identity(x)));
}

function _right_inverse (x) {
  return _solve(x, _left_identity(x));
}

function _left_inverse (x) {
  return _transpose(_right_inverse(_transpose(x)));
}

function _kleene (x) {
  return _inverse(_sum(_left_identity(x), _negative(x)));
}

function _closure (x) {
  return _sum(_kleene(x), _negative(_left_identity(x)));
}

function _map_list (f, x) {
  return _loop_list(_empty_list(), function (a, b) { return _append(a, _singleton_list(_apply(f, _tuple(b)))); }, x);
}

function _reverse (x) {
  return _loop_list(_empty_list(), function (a, b) { return _append(_singleton_list(b), a); }, x);
}

function _combis (list) {
  return function (accumulator) { return _apply(function (result, _8300) { return result; }, _loop_list(_tuple(_empty_list(), list), accumulator, list)); }.apply(this, _tuple(function (accu, x) { return _apply(function (result, tails) { return _tuple(_append(_loop_list(_empty_list(), function (accu, y) { return _add_mut(accu, _tuple(x, y)); }, _tail(tails)), result), _tail(tails)); }, accu); }));
}

function _list_sum (x) {
  return _fold_list(fetch_global('sum'), x);
}

function _list_min (x) {
  return _fold_list(fetch_global('min'), x);
}

function _list_max (x) {
  return _fold_list(fetch_global('max'), x);
}

function _set_sum (x) {
  return _fold_set(fetch_global('sum'), x);
}

function _set_min (x) {
  return _fold_set(fetch_global('min'), x);
}

function _set_max (x) {
  return _fold_set(fetch_global('max'), x);
}

function g_inverse() { return fetch_global('right_inverse'); }

