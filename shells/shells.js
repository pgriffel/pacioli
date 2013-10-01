// Javascript code generated from Pacioli file 'shells'

function _make_curve (vs) {
  return _append(vs, _singleton_list(_head(vs)));
}

function _curve_rotation (curve, landmarks) {
  return _compute_rotation(_nth(_nth([[0]], landmarks), curve), _nth(_nth([[1]], landmarks), curve), _nth(_nth([[2]], landmarks), curve), _nth(_nth([[3]], landmarks), curve));
}

function _translate_curve (curve, offset) {
  return _loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _sum(x, offset)); }, curve);
}

function _transform_curve (curve, matrix) {
  return _loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _join(matrix, x)); }, curve);
}

function _sum_curves (x, y) {
  return _loop_list(_empty_list(), function (accu, tup) { return _apply(function (a, b) { return _add_mut(accu, _sum(a, b)); }, tup); }, _zip(x, y));
}

function _scale_curve (curve, factor) {
  return _loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _scale(factor, x)); }, curve);
}

function _curve_surface (curve) {
  return function (n) { return _less(n, [[3]]) ? _empty_list() : function (first) { return _loop_list(_empty_list(), function (accu, i) { return _add_mut(accu, _tuple(first, _nth(_sum(i, [[1]]), curve), _nth(_sum(i, [[2]]), curve))); }, _naturals(_sum(n, _negative([[2]])))); }.apply(this, _tuple(_nth([[0]], curve))); }.apply(this, _tuple(_sum(_list_size(curve), _negative([[1]]))));
}

function _segment_surface (curve, next) {
  return function (n) { return _less(n, [[2]]) ? _empty_list() : _append(_loop_list(_empty_list(), function (accu, i) { return function (p0) { return function (p2) { return function (p1) { return _add_mut(accu, _tuple(p0, p1, p2)); }.apply(this, _tuple(_nth(i, next))); }.apply(this, _tuple(_nth(_sum(i, [[1]]), curve))); }.apply(this, _tuple(_nth(i, curve))); }, _naturals(_sum(n, _negative([[1]])))), _loop_list(_empty_list(), function (accu, i) { return function (p0) { return function (p2) { return function (p1) { return _add_mut(accu, _tuple(p0, p1, p2)); }.apply(this, _tuple(_nth(_sum(i, [[1]]), next))); }.apply(this, _tuple(_nth(_sum(i, [[1]]), curve))); }.apply(this, _tuple(_nth(i, next))); }, _naturals(_sum(n, _negative([[1]]))))); }.apply(this, _tuple(_list_size(curve)));
}

function _segment_closed_surface (curve, next) {
  return _append(_segment_surface(curve, next), _append(_curve_surface(curve), _curve_surface(_reverse(next))));
}

function _x_less (a, b) {
  return _apply(function (xa, ya) { return _apply(function (xb, yb) { return _less(xa, xb); }, b); }, a);
}

function _y_less (a, b) {
  return _apply(function (xa, ya) { return _apply(function (xb, yb) { return _less(ya, yb); }, b); }, a);
}

function _step_forward (state, angle, distance) {
  return _apply(function (x, y, direction) { return function (new_direction) { return _tuple(_sum(x, _multiply(distance, _sin(new_direction))), _sum(y, _multiply(distance, _cos(new_direction))), new_direction); }.apply(this, _tuple(_sum(direction, angle))); }, state);
}

function _extend_states (states, step) {
  return _apply(function (angle, distance) { return _cons(_step_forward(_head(states), angle, distance), states); }, step);
}

function _path_coords (path) {
  return function (states) { return _loop_list(_empty_list(), function (accu, tup) { return _apply(function (x, y, d) { return _add_mut(accu, _tuple(x, y)); }, tup); }, states); }.apply(this, _tuple(_loop_list(_singleton_list(_tuple(_multiply([[0]], fetch_global('metre')), _multiply([[0]], fetch_global('metre')), _multiply([[0]], fetch_global('radian')))), fetch_global('extend_states'), path)));
}

function _borders (coords) {
  return function (indices) { return _append(_append(_append(_singleton_list(_fold_list(function (i, j) { return _x_less(_nth(i, coords), _nth(j, coords)) ? i : j; }, indices)), _singleton_list(_fold_list(function (i, j) { return _y_less(_nth(i, coords), _nth(j, coords)) ? i : j; }, indices))), _singleton_list(_fold_list(function (i, j) { return _x_less(_nth(i, coords), _nth(j, coords)) ? j : i; }, indices))), _singleton_list(_fold_list(function (i, j) { return _y_less(_nth(i, coords), _nth(j, coords)) ? j : i; }, indices))); }.apply(this, _tuple(_naturals(_list_size(coords))));
}

function _circle_path (n, d) {
  return _loop_list(_empty_list(), function (accu, i) { return _add_mut(accu, _tuple(_equal(i, [[0]]) ? _multiply(_multiply([[180]], fetch_global('degree')), _reciprocal(n)) : _multiply(_multiply([[360]], fetch_global('degree')), _reciprocal(n)), d)); }, _naturals(_sum(n, _negative([[1]]))));
}

function _rectangle_path (w, h) {
  return _append(_append(_append(_singleton_list(_tuple(_multiply([[0]], fetch_global('degree')), _multiply(h, _reciprocal([[2]])))), _singleton_list(_tuple(_multiply([[90]], fetch_global('degree')), w))), _singleton_list(_tuple(_multiply([[90]], fetch_global('degree')), h))), _singleton_list(_tuple(_multiply([[90]], fetch_global('degree')), w)));
}

function _logistic (r, t, k, y) {
  return _multiply(_multiply(k, y), _reciprocal(_sum(_multiply(_sum(k, _negative(y)), _exp(_negative(_multiply(r, t)))), y)));
}

function _growth_factor (t, growth_constant, nr_ticks) {
  return function (r) { return function (k) { return _equal(r, [[0]]) ? [[1]] : _multiply(_sum(_logistic(r, _sum(t, [[1]]), k, [[1]]), _negative(_logistic(r, t, k, [[1]]))), _reciprocal(_sum(_logistic(r, [[1]], k, [[1]]), _negative(_logistic(r, [[0]], k, [[1]]))))); }.apply(this, _tuple(_multiply([[2]], _exp(_multiply(_multiply(r, nr_ticks), _reciprocal([[2]])))))); }.apply(this, _tuple(_ln(growth_constant)));
}

function _growth_vector_map (curve, translation, growth_constant, rotation, landmarks) {
  return function (inv_rotation) { return function (difference) { return _transform_curve(difference, inv_rotation); }.apply(this, _tuple(_loop_list(_empty_list(), function (accu, vector) { return function (scaled) { return function (rotated) { return function (translated) { return _add_mut(accu, _sum(translated, _negative(vector))); }.apply(this, _tuple(_sum(rotated, translation))); }.apply(this, _tuple(_join(rotation, scaled))); }.apply(this, _tuple(_scale(growth_constant, vector))); }, curve))); }.apply(this, _tuple(_inverse(_curve_rotation(curve, landmarks))));
}

function _step (curve, gvm, growth_factor, landmarks) {
  return function (rotation) { return function (scaled_map) { return _sum_curves(curve, _transform_curve(scaled_map, rotation)); }.apply(this, _tuple(_scale_curve(gvm, growth_factor))); }.apply(this, _tuple(_curve_rotation(curve, landmarks)));
}

function _grow_fun (gvm, growth_constant, nr_ticks, landmarks) {
  return function (body, tick) { return function (growth) { return _cons(_step(_head(body), gvm, growth, landmarks), body); }.apply(this, _tuple(_growth_factor(tick, growth_constant, nr_ticks))); };
}

function _curves (curve, landmarks, position, translation, roz, mu, growth_constant, theta_x, theta_y, theta_z, nr_ticks) {
  return function (positioned) { return function (transformed) { return function (rotation) { return function (gvm) { return _loop_list(_singleton_list(transformed), _grow_fun(gvm, growth_constant, nr_ticks, landmarks), _naturals(nr_ticks)); }.apply(this, _tuple(_growth_vector_map(transformed, translation, growth_constant, rotation, landmarks))); }.apply(this, _tuple(_rotation(theta_x, theta_y, theta_z))); }.apply(this, _tuple(_transform_curve(positioned, _x_rotation(mu)))); }.apply(this, _tuple(_translate_curve(_scale_curve(curve, roz), position)));
}

function _growth_factor_histogram (growth_constant, n) {
  return _loop_list(_empty_list(), function (accu, t) { return _add_mut(accu, _growth_factor(t, growth_constant, n)); }, _naturals(n));
}

function _aperture_area_histogram (body) {
  return _loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _convert(_surface_area(_curve_surface(x)), _multiply(fetch_global('metre'), fetch_global('metre')), _multiply(fetch_global('millimetre'), fetch_global('millimetre')))); }, _reverse(body));
}

function _body_area_histogram (body) {
  return function (n) { return function (rev) { return _loop_list(_empty_list(), function (accu, i) { return _add_mut(accu, _segment_area(_nth(i, rev), _nth(_sum(i, [[1]]), rev))); }, _naturals(_sum(n, _negative([[1]])))); }.apply(this, _tuple(_reverse(body))); }.apply(this, _tuple(_list_size(body)));
}

function _segment_area (curve, next) {
  return _convert(_surface_area(_segment_surface(curve, next)), _multiply(fetch_global('metre'), fetch_global('metre')), _multiply(fetch_global('millimetre'), fetch_global('millimetre')));
}

function _body_volume_histogram (body) {
  return function (n) { return function (rev) { return _loop_list(_empty_list(), function (accu, i) { return _add_mut(accu, _segment_volume(_nth(i, rev), _nth(_sum(i, [[1]]), rev))); }, _naturals(_sum(n, _negative([[1]])))); }.apply(this, _tuple(_reverse(body))); }.apply(this, _tuple(_list_size(body)));
}

function _segment_volume (curve, next) {
  return _convert(_surface_volume(_segment_closed_surface(curve, next)), _multiply(_multiply(fetch_global('metre'), fetch_global('metre')), fetch_global('metre')), _multiply(_multiply(fetch_global('millimetre'), fetch_global('millimetre')), fetch_global('millimetre')));
}

function _axisPoint (shell) {
  return _equal(shell, _empty_list()) ? _scale([[0]], fetch_global('Space_bang')) : _scale(_reciprocal(_list_size(shell)), _list_sum(_loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _nth([[0]], x)); }, shell)));
}

function _shell_curves (aperture, offset, displacement, roz, mu, growth_constant, theta_x, theta_y, theta_z, segments, fudge) {
  return function (coords) { return function (curve) { return function (curve_alt) { return function (landmarks) { return function (body) { return _loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _scale_curve(x, fudge)); }, body); }.apply(this, _tuple(_curves(curve, landmarks, offset, displacement, roz, mu, growth_constant, theta_x, theta_y, theta_z, segments))); }.apply(this, _tuple(_borders(coords))); }.apply(this, _tuple(_loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _join(fetch_global('space_conv'), x)); }, curve))); }.apply(this, _tuple(_make_curve(_loop_list(_empty_list(), function (accu, tup) { return _apply(function (x, z) { return _add_mut(accu, _geom_vec(x, _multiply([[0]], fetch_global('metre')), z)); }, tup); }, coords)))); }.apply(this, _tuple(_path_coords(aperture)));
}

