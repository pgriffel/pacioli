// Javascript code generated from Pacioli file 'geometry-lib'

function _norm (x) {
  return _sqrt(_inner(x, x));
}

function _normalized (x) {
  return _scale(_reciprocal(_magnitude(_norm(x))), x);
}

function _polar2cartesian (radius, inclination, azimuth) {
  return _scale(radius, _space_vec(_multiply(_sin(inclination), _cos(azimuth)), _multiply(_sin(inclination), _sin(azimuth)), _cos(inclination)));
}

function _inclination (vec) {
  return _acos(_multiply(_inner(vec, fetch_global('delta_z')), _reciprocal(_norm(vec))));
}

function _azimuth (vec) {
  return _atan2(_inner(vec, fetch_global('delta_y')), _inner(vec, fetch_global('delta_x')));
}

function _space_norm (x) {
  return _norm(_join(fetch_global('space_conv'), x));
}

function _space_normalized (x) {
  return _join(_dual(fetch_global('space_conv')), _normalized(_join(fetch_global('space_conv'), x)));
}

function _space_matrix (matrix) {
  return _join(_join(_dual(fetch_global('space_conv')), matrix), fetch_global('space_conv'));
}

function _cross (v, w) {
  return function (vx) { return function (vy) { return function (vz) { return function (wx) { return function (wy) { return function (wz) { return _sum(_sum(_scale(_sum(_multiply(vy, wz), _negative(_multiply(vz, wy))), fetch_global('delta_x')), _scale(_sum(_multiply(vz, wx), _negative(_multiply(vx, wz))), fetch_global('delta_y'))), _scale(_sum(_multiply(vx, wy), _negative(_multiply(vy, wx))), fetch_global('delta_z'))); }.apply(this, _tuple(_inner(w, fetch_global('delta_z')))); }.apply(this, _tuple(_inner(w, fetch_global('delta_y')))); }.apply(this, _tuple(_inner(w, fetch_global('delta_x')))); }.apply(this, _tuple(_inner(v, fetch_global('delta_z')))); }.apply(this, _tuple(_inner(v, fetch_global('delta_y')))); }.apply(this, _tuple(_inner(v, fetch_global('delta_x'))));
}

function _cross_sqrt (v, w) {
  return function (vx) { return function (vy) { return function (vz) { return function (wx) { return function (wy) { return function (wz) { return function (sx) { return function (sy) { return function (sz) { return function (sq) { return _scale(_reciprocal(_sqrt(sq)), _sum(_sum(_scale(sx, fetch_global('delta_x')), _scale(sy, fetch_global('delta_y'))), _scale(sz, fetch_global('delta_z')))); }.apply(this, _tuple(_sqrt(_sum(_sum(_multiply(sx, sx), _multiply(sy, sy)), _multiply(sz, sz))))); }.apply(this, _tuple(_sum(_multiply(vx, wy), _negative(_multiply(vy, wx))))); }.apply(this, _tuple(_sum(_multiply(vz, wx), _negative(_multiply(vx, wz))))); }.apply(this, _tuple(_sum(_multiply(vy, wz), _negative(_multiply(vz, wy))))); }.apply(this, _tuple(_inner(w, fetch_global('delta_z')))); }.apply(this, _tuple(_inner(w, fetch_global('delta_y')))); }.apply(this, _tuple(_inner(w, fetch_global('delta_x')))); }.apply(this, _tuple(_inner(v, fetch_global('delta_z')))); }.apply(this, _tuple(_inner(v, fetch_global('delta_y')))); }.apply(this, _tuple(_inner(v, fetch_global('delta_x'))));
}

function _cross_sqrt_alt (v, w) {
  return function (c) { return _polar2cartesian(_sqrt(_norm(c)), _inclination(c), _azimuth(c)); }.apply(this, _tuple(_cross(v, w)));
}

function _geom_cross (v, w) {
  return _join(_dual(fetch_global('space_conv')), _cross(_join(fetch_global('space_conv'), v), _join(fetch_global('space_conv'), w)));
}

function _geom_cross_sqrt (v, w) {
  return _join(_dual(fetch_global('space_conv')), _cross_sqrt(_join(fetch_global('space_conv'), v), _join(fetch_global('space_conv'), w)));
}

function _geom_cross_sqrt_alt (v, w) {
  return _join(_dual(fetch_global('space_conv')), _cross_sqrt_alt(_join(fetch_global('space_conv'), v), _join(fetch_global('space_conv'), w)));
}

function _triangle_area (x, y, z) {
  return _scale(_multiply([[1]], _reciprocal([[2]])), _norm(_cross(_sum(y, _negative(x)), _sum(z, _negative(x)))));
}

function _geom_triangle_area (x, y, z) {
  return _triangle_area(_join(fetch_global('space_conv'), x), _join(fetch_global('space_conv'), y), _join(fetch_global('space_conv'), z));
}

function _signed_volume (x, y, z) {
  return _scale(_multiply([[1]], _reciprocal([[6]])), _inner(x, _cross(y, z)));
}

function _geom_signed_volume (x, y, z) {
  return _signed_volume(_join(fetch_global('space_conv'), x), _join(fetch_global('space_conv'), y), _join(fetch_global('space_conv'), z));
}

function _surface_area (surface) {
  return _equal(surface, _empty_list()) ? _multiply(_multiply([[0]], fetch_global('metre')), fetch_global('metre')) : _list_sum(_loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _apply(fetch_global('geom_triangle_area'), x)); }, surface));
}

function _surface_volume (surface) {
  return _equal(surface, _empty_list()) ? _multiply(_multiply(_multiply([[0]], fetch_global('metre')), fetch_global('metre')), fetch_global('metre')) : _abs(_list_sum(_loop_list(_empty_list(), function (accu, x) { return _add_mut(accu, _apply(fetch_global('geom_signed_volume'), x)); }, surface)));
}

function _x_rotation_r (angle) {
  return _sum(_sum(_join(_space_vec([[1]], [[0]], [[0]]), _transpose(_reciprocal(fetch_global('delta_x')))), _join(_space_vec([[0]], _cos(angle), _sin(angle)), _transpose(_reciprocal(fetch_global('delta_y'))))), _join(_space_vec([[0]], _negative(_sin(angle)), _cos(angle)), _transpose(_reciprocal(fetch_global('delta_z')))));
}

function _y_rotation_r (angle) {
  return _sum(_sum(_join(_space_vec(_cos(angle), [[0]], _negative(_sin(angle))), _transpose(_reciprocal(fetch_global('delta_x')))), _join(_space_vec([[0]], [[1]], [[0]]), _transpose(_reciprocal(fetch_global('delta_y'))))), _join(_space_vec(_sin(angle), [[0]], _cos(angle)), _transpose(_reciprocal(fetch_global('delta_z')))));
}

function _z_rotation_r (angle) {
  return _sum(_sum(_join(_space_vec(_cos(angle), _sin(angle), [[0]]), _transpose(_reciprocal(fetch_global('delta_x')))), _join(_space_vec(_negative(_sin(angle)), _cos(angle), [[0]]), _transpose(_reciprocal(fetch_global('delta_y'))))), _join(_space_vec([[0]], [[0]], [[1]]), _transpose(_reciprocal(fetch_global('delta_z')))));
}

function _rotation_r (x_angle, y_angle, z_angle) {
  return _join(_join(_z_rotation_r(z_angle), _y_rotation_r(y_angle)), _x_rotation_r(x_angle));
}

function _x_rotation (angle) {
  return _space_matrix(_x_rotation_r(angle));
}

function _y_rotation (angle) {
  return _space_matrix(_y_rotation_r(angle));
}

function _z_rotation (angle) {
  return _space_matrix(_z_rotation_r(angle));
}

function _rotation (x_angle, y_angle, z_angle) {
  return _join(_join(_z_rotation(z_angle), _y_rotation(y_angle)), _x_rotation(x_angle));
}

function _compute_rotation (left, top, right, bottom) {
  return function (width) { return function (height) { return _sum(_sum(_join(_space_normalized(width), _transpose(_reciprocal(fetch_global('dx')))), _join(_space_normalized(_geom_cross_sqrt(width, height)), _transpose(_reciprocal(fetch_global('dy'))))), _join(_space_normalized(height), _transpose(_reciprocal(fetch_global('dz'))))); }.apply(this, _tuple(_sum(top, _negative(bottom)))); }.apply(this, _tuple(_sum(right, _negative(left))));
}

function g_dx() { return _multiply(fetch_global('delta_x'), fetch_global('Space_bang')); }

function g_dy() { return _multiply(fetch_global('delta_y'), fetch_global('Space_bang')); }

function g_dz() { return _multiply(fetch_global('delta_z'), fetch_global('Space_bang')); }

