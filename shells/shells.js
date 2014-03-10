
function compute_index_Geometry_Space () {return Pacioli.makeIndexSet('Space', ["x","y","z"])}

function compute_unit_metre () {return {symbol: 'm'}}
function compute_unit_second () {return {symbol: 's'}}
function compute_unit_ampere () {return {symbol: 'A'}}
function compute_unit_gram () {return {symbol: 'g'}}
function compute_unit_newton () {return {definition: Pacioli.unit('kilo', 'gram').mult(Pacioli.unit('metre')).div(Pacioli.unit('second').expt(Pacioli.unit(2))), symbol: 'N'}}
function compute_unit_joule () {return {definition: Pacioli.unit('newton').mult(Pacioli.unit('metre')), symbol: 'J'}}
function compute_unit_watt () {return {definition: Pacioli.unit('joule').div(Pacioli.unit('second')), symbol: 'W'}}
function compute_unit_volt () {return {definition: Pacioli.unit('watt').div(Pacioli.unit('ampere')), symbol: 'V'}}
function compute_unit_weber () {return {definition: Pacioli.unit('volt').mult(Pacioli.unit('second')), symbol: 'Wb'}}
function compute_unit_tesla () {return {definition: Pacioli.unit('weber').div(Pacioli.unit('metre').expt(Pacioli.unit(2))), symbol: 'T'}}
function compute_unit_candela () {return {symbol: 'cd'}}
function compute_unit_steradian () {return {definition: Pacioli.unit('metre').expt(Pacioli.unit(2)).div(Pacioli.unit('metre').expt(Pacioli.unit(2))), symbol: 'sr'}}
function compute_unit_lumen () {return {definition: Pacioli.unit('candela').div(Pacioli.unit('steradian')), symbol: 'lm'}}
function compute_unit_lux () {return {definition: Pacioli.unit('lumen').div(Pacioli.unit('metre').expt(Pacioli.unit(2))), symbol: 'lx'}}
function compute_unit_siemens () {return {definition: Pacioli.unit('ampere').div(Pacioli.unit('volt')), symbol: 'S'}}
function compute_unit_pi () {return {definition: Pacioli.unit(3.141592653589793), symbol: 'pi'}}
function compute_unit_degree () {return {definition: Pacioli.unit('pi').div(Pacioli.unit(180)), symbol: 'deg'}}
function compute_unit_mole () {return {symbol: 'mol'}}
function compute_unit_katal () {return {definition: Pacioli.unit('mole').div(Pacioli.unit('second')), symbol: 'kat'}}
function compute_unit_millimetre () {return {definition: Pacioli.unit('milli', 'metre'), symbol: 'mm'}}
function compute_unit_litre () {return {definition: Pacioli.unit('deci', 'metre').expt(Pacioli.unit(3)), symbol: 'l'}}
function compute_unit_gray () {return {definition: Pacioli.unit('joule').div(Pacioli.unit('kilo', 'gram')), symbol: 'Gy'}}
function compute_unit_hertz () {return {definition: Pacioli.unit(1).div(Pacioli.unit('second')), symbol: 'Hz'}}
function compute_unit_pascal () {return {definition: Pacioli.unit('newton').div(Pacioli.unit('metre').expt(Pacioli.unit(2))), symbol: 'Pa'}}
function compute_unit_percent () {return {definition: Pacioli.unit(0.01), symbol: '%'}}
function compute_unit_dollar () {return {symbol: '$'}}
function compute_unit_coulomb () {return {definition: Pacioli.unit('second').mult(Pacioli.unit('ampere')), symbol: 'C'}}
function compute_unit_kelvin () {return {symbol: 'K'}}
function compute_unit_degree_celcius () {return {definition: Pacioli.unit('kelvin'), symbol: '°C'}}
function compute_unit_radian () {return {definition: Pacioli.unit(1), symbol: 'rad'}}
function compute_unit_minute () {return {definition: Pacioli.unit(60).mult(Pacioli.unit('second')), symbol: 'min'}}
function compute_unit_hour () {return {definition: Pacioli.unit(60).mult(Pacioli.unit('minute')), symbol: 'hr'}}
function compute_unit_sievert () {return {definition: Pacioli.unit('joule').div(Pacioli.unit('kilo', 'gram')), symbol: 'Sv'}}
function compute_unit_farad () {return {definition: Pacioli.unit('coulomb').div(Pacioli.unit('volt')), symbol: 'F'}}
function compute_unit_henry () {return {definition: Pacioli.unit('weber').div(Pacioli.unit('ampere')), symbol: 'H'}}
function compute_unit_ohm () {return {definition: Pacioli.unit('volt').div(Pacioli.unit('ampere')), symbol: 'Ω'}}
function compute_unit_day () {return {definition: Pacioli.unit(24).mult(Pacioli.unit('hour')), symbol: 'd'}}
function compute_unit_becquerel () {return {definition: Pacioli.unit(1).div(Pacioli.unit('second')), symbol: 'Bq'}}

u_global_Model_get_meshes = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", ['_a_', '_b_', '_c_'])]), '_c_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_get_meshes (shell) {
    return global_Primitives_apply(function (_5,_6,x) { return x; }, shell);
}


u_global_Model_shell_unit = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_shell_unit (shell) {
    return global_Matrix_unit_factor(global_Model_curve_nth(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Model_shell_initial_curve(shell)));
}


u_global_Model_curve_surface = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", new Pacioli.Type("tuple", ['_a_', '_a_', '_a_']))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_curve_surface (curve) {
    return function (n) { return (global_Matrix_less(n, Pacioli.initialNumbers(1, 1, [[0, 0, 3]])) ? global_List_empty_list() : function (first) { return function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(first, global_List_nth(global_Matrix_sum(i, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), curve), global_List_nth(global_Matrix_sum(i, Pacioli.initialNumbers(1, 1, [[0, 0, 2]])), curve))); }, global_List_naturals(global_Matrix_minus(n, Pacioli.initialNumbers(1, 1, [[0, 0, 2]])))); }(global_List_empty_list()); }(global_List_nth(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), curve))); }(global_Matrix_minus(global_List_list_size(curve), Pacioli.initialNumbers(1, 1, [[0, 0, 1]])));
}


u_global_Standard_is_zero_column = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), '_E_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_is_zero_column (x,j) {
    return global_Matrix_is_zero(global_Matrix_column(global_Matrix_magnitude(x), j));
}


u_global_Model_axis_point = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_axis_point (shell) {
    return function (body) { return (global_Primitives_equal(body, global_List_empty_list()) ? global_Matrix_scale(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Model_shell_unit(shell)), Pacioli.oneNumbers(3, 1)) : global_Matrix_scale_down(global_Standard_list_sum(function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Model_curve_nth(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), x)); }, body); }(global_List_empty_list())), global_List_list_size(body))); }(global_Model_get_body(shell));
}


u_global_Geometry_triangle_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_triangle_area (x,y,z) {
    return global_Matrix_divide(global_Geometry_norm(global_Geometry_cross(global_Matrix_minus(y, x), global_Matrix_minus(z, x))), Pacioli.initialNumbers(1, 1, [[0, 0, 2]]));
}


u_global_Geometry_z_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_z_rotation (angle) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_dot(global_Geometry_space_vec(global_Matrix_cos(angle), global_Matrix_sin(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_x'))), global_Matrix_dot(global_Geometry_space_vec(global_Matrix_negative(global_Matrix_sin(angle)), global_Matrix_cos(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_y')))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_z'))));
}


u_global_Geometry_cross_sqrt = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_b_').expt(2)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_cross_sqrt (v,w) {
    return function (vx) { return function (vy) { return function (vz) { return function (wx) { return function (wy) { return function (wz) { return function (sx) { return function (sy) { return function (sz) { return function (sq) { return global_Matrix_scale_down(global_Matrix_sum(global_Matrix_sum(global_Matrix_scale(sx, Pacioli.fetchValue('Geometry', 'd_x')), global_Matrix_scale(sy, Pacioli.fetchValue('Geometry', 'd_y'))), global_Matrix_scale(sz, Pacioli.fetchValue('Geometry', 'd_z'))), global_Matrix_sqrt(sq)); }(global_Matrix_sqrt(global_Matrix_sum(global_Matrix_sum(global_Matrix_multiply(sx, sx), global_Matrix_multiply(sy, sy)), global_Matrix_multiply(sz, sz)))); }(global_Matrix_minus(global_Matrix_multiply(vx, wy), global_Matrix_multiply(vy, wx))); }(global_Matrix_minus(global_Matrix_multiply(vz, wx), global_Matrix_multiply(vx, wz))); }(global_Matrix_minus(global_Matrix_multiply(vy, wz), global_Matrix_multiply(vz, wy))); }(global_Matrix_get(w, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_')));
}


u_global_Standard_closure = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_closure (x) {
    return global_Matrix_minus(global_Standard_kleene(x), global_Matrix_left_identity(x));
}


u_global_Standard_to_percentage = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(Pacioli.unit('percent').expt(1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_to_percentage (x) {
    return global_Matrix_scale(Pacioli.fetchValue('Standard', 'percent_conv'), x);
}


u_global_Standard_combis = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", new Pacioli.Type("tuple", ['_a_', '_a_']))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_combis (list) {
    return function (accumulator) { return global_Primitives_apply(function (result,_0) { return result; }, global_List_loop_list(global_Primitives_tuple(global_List_empty_list(), list), accumulator, list)); }(function (accu,x) { return global_Primitives_apply(function (result,tails) { return global_Primitives_tuple(global_List_append(function (accu) { return global_List_loop_list(accu, function (accu,y) { return global_List_add_mut(accu, global_Primitives_tuple(x, y)); }, global_List_tail(tails)); }(global_List_empty_list()), result), global_List_tail(tails)); }, accu); });
}


u_global_Geometry_polar2cartesian = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_polar2cartesian (radius,inclination,azimuth) {
    return global_Matrix_scale(radius, global_Geometry_space_vec(global_Matrix_multiply(global_Matrix_sin(inclination), global_Matrix_cos(azimuth)), global_Matrix_multiply(global_Matrix_sin(inclination), global_Matrix_sin(azimuth)), global_Matrix_cos(inclination)));
}


u_global_Standard_list_gcd = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), '_A_', Pacioli.unit(1), '_B_', Pacioli.unit(1)))]), Pacioli.createMatrixType(Pacioli.unit(1), '_A_', Pacioli.unit(1), '_B_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_list_gcd (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'gcd'), x);
}


u_global_Shells_my_path_a = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", []), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_my_path_a () {
    return global_Shells_circle_path(Pacioli.initialNumbers(1, 1, [[0, 0, 17]]), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.2]]), Pacioli.oneNumbers(1, 1)));
}


u_global_Standard_right_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_right_inverse (x) {
    return global_Matrix_solve(x, global_Matrix_left_identity(x));
}


u_global_Shells_my_path_b = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", []), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_my_path_b () {
    return global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_empty_list(), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.6]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(global_Matrix_negative(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]])), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.6]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 1.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(global_Matrix_negative(Pacioli.initialNumbers(1, 1, [[0, 0, 0.6]])), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), Pacioli.oneNumbers(1, 1))));
}


u_global_Shells_my_path_c = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", []), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_my_path_c () {
    return global_Shells_rectangle_path(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.5]]), Pacioli.oneNumbers(1, 1)), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0.5]]), Pacioli.oneNumbers(1, 1)));
}


function compute_u_global_Geometry_d_y() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}
function compute_global_Geometry_d_y() {
  return global_Standard_delta(Pacioli.createCoordinates([['y','index_Geometry_Space']]));
}


function compute_u_global_Geometry_d_x() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}
function compute_global_Geometry_d_x() {
  return global_Standard_delta(Pacioli.createCoordinates([['x','index_Geometry_Space']]));
}


u_global_Model_grow = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_grow (shell,n) {
    return global_Primitives_apply(function (settings,body,meshes) { return global_Primitives_apply(function (initial,gvm,factor,nr_ticks,landmarks) { return function (m) { return function (t) { return function (i) { return function (s) { return function (me) { return function (b) { return function (result) { return global_Primitives_catch_result(function () { return global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_ref_set(b, function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, x); }, body); }(global_List_empty_list())), global_Primitives_ref_set(me, function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, x); }, meshes); }(global_List_empty_list()))), global_Primitives_ref_set(s, (global_Primitives_equal(m, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? initial : global_Model_last(body)))), global_Primitives_ref_set(i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))), global_Primitives_while_function(function () { return global_Primitives_not_equal(global_Primitives_ref_get(i), n); }, function () { return global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_ref_set(t, global_Model_step(global_Primitives_ref_get(s), gvm, global_Model_growth_factor(global_Matrix_sum(m, global_Primitives_ref_get(i)), factor, nr_ticks), landmarks)), global_Primitives_ref_set(me, global_List_add_mut(global_Primitives_ref_get(me), global_Model_segment_mesh(global_Primitives_ref_get(s), global_Primitives_ref_get(t))))), global_Primitives_ref_set(b, global_List_add_mut(global_Primitives_ref_get(b), global_Primitives_ref_get(t)))), global_Primitives_ref_set(s, global_Primitives_ref_get(t))), global_Primitives_ref_set(i, global_Matrix_sum(global_Primitives_ref_get(i), Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))); })), global_Primitives_throw_result(result, global_Primitives_tuple(settings, global_Primitives_ref_get(b), global_Primitives_ref_get(me)))); }, result); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_List_list_size(body)); }, settings); }, shell);
}


u_global_Model_segment_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_segment_area (curve,next) {
    return global_Geometry_surface_area(global_Model_segment_surface(curve, next));
}


function compute_u_global_Geometry_d_z() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}
function compute_global_Geometry_d_z() {
  return global_Standard_delta(Pacioli.createCoordinates([['z','index_Geometry_Space']]));
}


u_global_Shells_make_shell = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))])), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_make_shell (aperture,offset,displacement,roz,mu,growth_constant,theta_x,theta_y,theta_z,segments,fudge) {
    return function (coords) { return global_Model_initial_shell(coords, offset, displacement, roz, mu, growth_constant, theta_x, theta_y, theta_z, segments, fudge); }(global_Shells_path_coords(aperture, Pacioli.oneNumbers(1, 1)));
}


u_global_Standard_delta = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_A_']), Pacioli.createMatrixType(Pacioli.unit(1), '_A_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_delta (x) {
    return global_Matrix_make_matrix(global_List_add_mut(global_List_empty_list(), global_Primitives_tuple(x, Pacioli.fetchValue('Matrix', '_'), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));
}


u_global_Geometry_norm = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_B_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_norm (x) {
    return global_Matrix_sqrt(global_Standard_inner(x, x));
}


u_global_Standard_fraction = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_fraction (x,y) {
    return global_Standard_to_percentage(global_Matrix_divide(x, y));
}


u_global_Model_make_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_make_curve (vs) {
    return global_List_append(vs, global_List_add_mut(global_List_empty_list(), global_List_head(vs)));
}


u_global_Model_get_body = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", ['_a_', '_b_', '_c_'])]), '_b_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_get_body (shell) {
    return global_Primitives_apply(function (_3,x,_4) { return x; }, shell);
}


u_global_Standard_list_max = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_list_max (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'max'), x);
}


u_global_Model_logistic = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_D_', new Pacioli.PowerProduct('_b_').expt(-1), '_E_', new Pacioli.PowerProduct('_c_').expt(-1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_h_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_h_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_h_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_logistic (r,t,k,y) {
    return global_Matrix_divide(global_Matrix_multiply(k, y), global_Matrix_sum(global_Matrix_multiply(global_Matrix_minus(k, y), global_Matrix_exp(global_Matrix_multiply(global_Matrix_negative(r), t))), y));
}


u_global_Model_segment_mesh = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_'), new Pacioli.Type("list", '_a_')]), new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_'), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_segment_mesh (curveA,curveB) {
    return function (n) { return global_Primitives_tuple(global_List_append(curveA, curveB), function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(i, global_Matrix_mod(global_Matrix_sum(i, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), n), global_Matrix_sum(n, global_Matrix_mod(global_Matrix_sum(i, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), n)), global_Matrix_sum(n, global_Matrix_mod(i, n)))); }, global_List_naturals(n)); }(global_List_empty_list())); }(global_List_list_size(curveA));
}


u_global_Geometry_signed_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(2)), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_signed_volume (x,y,z) {
    return global_Matrix_divide(global_Standard_inner(x, global_Geometry_cross(y, z)), Pacioli.initialNumbers(1, 1, [[0, 0, 6]]));
}


u_global_Geometry_cross = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_cross (v,w) {
    return function (vx) { return function (vy) { return function (vz) { return function (wx) { return function (wy) { return function (wz) { return global_Matrix_sum(global_Matrix_sum(global_Matrix_scale(global_Matrix_minus(global_Matrix_multiply(vy, wz), global_Matrix_multiply(vz, wy)), Pacioli.fetchValue('Geometry', 'd_x')), global_Matrix_scale(global_Matrix_minus(global_Matrix_multiply(vz, wx), global_Matrix_multiply(vx, wz)), Pacioli.fetchValue('Geometry', 'd_y'))), global_Matrix_scale(global_Matrix_minus(global_Matrix_multiply(vx, wy), global_Matrix_multiply(vy, wx)), Pacioli.fetchValue('Geometry', 'd_z'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_')));
}


u_global_Model_curve_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_curve_rotation (curve,landmarks) {
    return global_Model_compute_rotation(global_List_nth(global_List_nth(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), landmarks), curve), global_List_nth(global_List_nth(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), landmarks), curve), global_List_nth(global_List_nth(Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), landmarks), curve), global_List_nth(global_List_nth(Pacioli.initialNumbers(1, 1, [[0, 0, 3]]), landmarks), curve));
}


u_global_Geometry_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_rotation (x_angle,y_angle,z_angle) {
    return global_Matrix_dot(global_Matrix_dot(global_Geometry_z_rotation(z_angle), global_Geometry_y_rotation(y_angle)), global_Geometry_x_rotation(x_angle));
}


u_global_Model_translate_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_translate_curve (curve,offset) {
    return function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Matrix_sum(x, offset)); }, curve); }(global_List_empty_list());
}


u_global_Geometry_inclination = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_inclination (vec) {
    return global_Matrix_acos(global_Matrix_divide(global_Standard_inner(vec, Pacioli.fetchValue('Geometry', 'd_z')), global_Geometry_norm(vec)));
}


u_global_Model_shell_current_size = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_shell_current_size (shell) {
    return global_List_list_size(global_Model_get_body(shell));
}


u_global_Standard_left_division = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_left_division (x,y) {
    return global_Matrix_dot(global_Standard_inverse(x), y);
}


u_global_Model_compute_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_compute_rotation (left,top,right,bottom) {
    return function (width) { return function (height) { return global_Matrix_magnitude(global_Matrix_sum(global_Matrix_sum(global_Matrix_dot(global_Geometry_normalized(width), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_x'))), global_Matrix_dot(global_Geometry_normalized(global_Geometry_cross_sqrt(width, height)), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_y')))), global_Matrix_dot(global_Geometry_normalized(height), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_z'))))); }(global_Matrix_minus(top, bottom)); }(global_Matrix_minus(right, left));
}


u_global_Geometry_surface_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_surface_volume (surface) {
    return global_Matrix_abs(global_Standard_list_sum(function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Primitives_apply(Pacioli.fetchValue('Geometry', 'signed_volume'), x)); }, surface); }(global_List_empty_list())));
}


u_global_Standard_positives = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_positives (x) {
    return global_Matrix_multiply(x, global_Matrix_positive_support(x));
}


u_global_Model_step = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1)), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_step (curve,gvm,growth_factor,landmarks) {
    return function (r) { return function (s) { return global_Model_sum_curves(curve, global_Model_transform_curve(s, r)); }(global_Model_scale_curve(gvm, growth_factor)); }(global_Model_curve_rotation(curve, landmarks));
}


u_global_Model_curve_nth = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", '_a_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_curve_nth (i,curve) {
    return global_List_nth(i, curve);
}


u_global_Shells_shell_body = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))])), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_shell_body (aperture,offset,displacement,roz,mu,growth_constant,theta_x,theta_y,theta_z,segments,fudge) {
    return global_Model_grow(global_Shells_make_shell(aperture, offset, displacement, roz, mu, growth_constant, theta_x, theta_y, theta_z, segments, fudge), segments);
}


u_global_Standard_from_percentage = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(Pacioli.unit('percent').expt(-1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_from_percentage (x) {
    return global_Matrix_scale_down(x, Pacioli.fetchValue('Standard', 'percent_conv'));
}


u_global_Geometry_azimuth = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_azimuth (vec) {
    return global_Matrix_atan2(global_Standard_inner(vec, Pacioli.fetchValue('Geometry', 'd_y')), global_Standard_inner(vec, Pacioli.fetchValue('Geometry', 'd_x')));
}


u_global_Standard_unit = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_unit (mat) {
    return global_Matrix_scale(global_Matrix_unit_factor(mat), global_Matrix_dim_div(global_Matrix_row_units(mat), global_Matrix_column_units(mat)));
}


u_global_Model_shell_initial_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", ['_a_', '_b_', '_c_', '_d_', '_e_']), '_f_', '_g_'])]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_shell_initial_curve (shell) {
    return global_Primitives_apply(function (x,_7,_8,_9,_10) { return x; }, global_Model_get_settings(shell));
}


u_global_Standard_right_division = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(-1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_right_division (x,y) {
    return global_Matrix_dot(x, global_Standard_inverse(y));
}


u_global_Model_segment_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_segment_volume (curve,next) {
    return global_Geometry_surface_volume(global_Model_segment_closed_surface(curve, next));
}


u_global_Shells_path_coords = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))])), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_path_coords (path,unit) {
    return function (path) { return function (distance) { return function (angle) { return function (coords) { return function (direction) { return function (y) { return function (x) { return function (result) { return global_Primitives_catch_result(function () { return global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_ref_set(x, global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), unit)), global_Primitives_ref_set(y, global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), unit))), global_Primitives_ref_set(direction, global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.oneNumbers(1, 1)))), global_Primitives_ref_set(coords, global_List_add_mut(global_List_empty_list(), global_Primitives_tuple(global_Primitives_ref_get(x), global_Primitives_ref_get(y))))), global_Primitives_while_function(function () { return global_Primitives_not_equal(global_Primitives_ref_get(path), global_List_empty_list()); }, function () { return global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_apply(function (fresh_angle0,fresh_distance0) { return global_Primitives_seq(global_Primitives_ref_set(angle, fresh_angle0), global_Primitives_ref_set(distance, fresh_distance0)); }, global_List_head(global_Primitives_ref_get(path))), global_Primitives_ref_set(direction, global_Matrix_sum(global_Primitives_ref_get(direction), global_Primitives_ref_get(angle)))), global_Primitives_ref_set(x, global_Matrix_sum(global_Primitives_ref_get(x), global_Matrix_multiply(global_Primitives_ref_get(distance), global_Matrix_sin(global_Primitives_ref_get(direction)))))), global_Primitives_ref_set(y, global_Matrix_sum(global_Primitives_ref_get(y), global_Matrix_multiply(global_Primitives_ref_get(distance), global_Matrix_cos(global_Primitives_ref_get(direction)))))), global_Primitives_ref_set(coords, global_List_cons(global_Primitives_tuple(global_Primitives_ref_get(x), global_Primitives_ref_get(y)), global_Primitives_ref_get(coords)))), global_Primitives_ref_set(path, global_List_tail(global_Primitives_ref_get(path)))); })), global_Primitives_throw_result(result, global_Primitives_ref_get(coords))); }, result); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_new_ref(path));
}


function compute_u_global_Standard_pi() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}
function compute_global_Standard_pi() {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 3.141592653589793]]);
}


u_global_Geometry_space_vec = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_space_vec (a,b,c) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_scale(a, Pacioli.fetchValue('Geometry', 'd_x')), global_Matrix_scale(b, Pacioli.fetchValue('Geometry', 'd_y'))), global_Matrix_scale(c, Pacioli.fetchValue('Geometry', 'd_z')));
}


u_global_Model_get_settings = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", ['_a_', '_b_', '_c_'])]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_get_settings (shell) {
    return global_Primitives_apply(function (x,_1,_2) { return x; }, shell);
}


u_global_Standard_kleene = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_kleene (x) {
    return global_Standard_inverse(global_Matrix_minus(global_Matrix_left_identity(x), x));
}


function compute_u_global_Standard_percent_conv() {
    return Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}
function compute_global_Standard_percent_conv() {
  return Pacioli.conversionNumbers(Pacioli.scalarShape(Pacioli.unit('percent')));
}


u_global_Standard_list_sum = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_list_sum (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'sum'), x);
}


u_global_Standard_map_matrix = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', Pacioli.unit(1), '_D_', Pacioli.unit(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_C_', Pacioli.unit(1), '_D_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_map_matrix (fun,mat) {
    return global_Matrix_make_matrix(function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_loop_list(accu, function (accu,j) { return global_List_add_mut(accu, global_Primitives_tuple(i, j, fun(global_Matrix_get(mat, i, j)))); }, global_Matrix_column_domain(mat)); }, global_Matrix_row_domain(mat)); }(global_List_empty_list()));
}


u_global_Geometry_surface_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_surface_area (surface) {
    return global_Standard_list_sum(function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Primitives_apply(Pacioli.fetchValue('Geometry', 'triangle_area'), x)); }, surface); }(global_List_empty_list()));
}


u_global_Model_last_segment_info = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_'), new Pacioli.Type("list", '_b_'), new Pacioli.Type("list", '_c_'), new Pacioli.Type("list", '_d_'), new Pacioli.Type("list", '_e_')])]), new Pacioli.Type("tuple", ['_a_', '_b_', '_c_', '_d_', '_e_'])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_last_segment_info (info) {
    return global_Primitives_apply(function (aperture_area,body_area_growth,body_area,body_volume_growth,body_volume) { return global_Primitives_tuple(global_Model_last(aperture_area), global_Model_last(body_area_growth), global_Model_last(body_area), global_Model_last(body_volume_growth), global_Model_last(body_volume)); }, info);
}


u_global_Standard_diagonal2 = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), '_C_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_diagonal2 (x) {
    return function (u) { return function (units) { return global_Matrix_multiply(global_Matrix_make_matrix(function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(i, i, global_Matrix_get_num(x, i, Pacioli.fetchValue('Matrix', '_')))); }, global_Matrix_row_domain(x)); }(global_List_empty_list())), units); }(global_Matrix_dim_div(u, global_Matrix_magnitude(u))); }(global_Standard_unit(x));
}


u_global_Model_shell_full_size = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", ['_a_', '_b_', '_c_', '_d_', '_e_']), '_f_', '_g_'])]), '_d_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_shell_full_size (shell) {
    return global_Primitives_apply(function (_11,_12,_13,x,_14) { return x; }, global_Model_get_settings(shell));
}


u_global_Standard_outer = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(-1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(-1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_outer (x,y) {
    return global_Matrix_dot(x, global_Matrix_transpose(y));
}


u_global_Model_segment_closed_surface = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_segment_closed_surface (curve,next) {
    return global_List_append(global_Model_segment_surface(curve, next), global_List_append(global_Model_curve_surface(curve), global_Model_curve_surface(global_List_reverse(next))));
}


u_global_Model_segment_surface = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_'), new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", new Pacioli.Type("tuple", ['_a_', '_a_', '_a_']))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_segment_surface (curve,next) {
    return function (n) { return (global_Matrix_less(n, Pacioli.initialNumbers(1, 1, [[0, 0, 2]])) ? global_List_empty_list() : global_List_append(function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(global_List_nth(i, curve), global_List_nth(i, next), global_List_nth(global_Matrix_sum(i, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), curve))); }, global_List_naturals(global_Matrix_minus(n, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))); }(global_List_empty_list()), function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(global_List_nth(i, next), global_List_nth(global_Matrix_sum(i, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), next), global_List_nth(global_Matrix_sum(i, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), curve))); }, global_List_naturals(global_Matrix_minus(n, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))); }(global_List_empty_list()))); }(global_List_list_size(curve));
}


u_global_Standard_log_not = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_log_not (x) {
    return global_Matrix_minus(global_Standard_unit(x), x);
}


u_global_Model_extend_shell_info = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_extend_shell_info (shell,info,n) {
    return global_Primitives_apply(function (aperture_area,body_area_growth,body_area,body_volume_growth,body_volume) { return function (body) { return function (body_volume) { return function (body_volume_growth) { return function (body_area) { return function (body_area_growth) { return function (aperture_area) { return function (vss) { return function (sass) { return function (ss) { return function (cb) { return function (b) { return function (a) { return function (volume) { return function (area) { return function (i) { return function (start) { return function (result) { return global_Primitives_catch_result(function () { return global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_ref_set(start, global_Matrix_minus(global_List_list_size(global_Primitives_ref_get(aperture_area)), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), global_Primitives_ref_set(i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))), global_Primitives_ref_set(area, global_Model_last(global_Primitives_ref_get(body_area)))), global_Primitives_ref_set(volume, global_Model_last(global_Primitives_ref_get(body_volume)))), global_Primitives_while_function(function () { return global_Primitives_not_equal(global_Primitives_ref_get(i), n); }, function () { return global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_seq(global_Primitives_ref_set(a, global_List_nth(global_Matrix_max(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_minus(global_Matrix_sum(global_Primitives_ref_get(start), global_Primitives_ref_get(i)), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), body)), global_Primitives_ref_set(b, global_List_nth(global_Matrix_sum(global_Primitives_ref_get(start), global_Primitives_ref_get(i)), body))), global_Primitives_ref_set(cb, global_Model_curve_surface(global_Model_curve_reverse(global_Primitives_ref_get(b))))), global_Primitives_ref_set(ss, global_Model_segment_surface(global_Primitives_ref_get(a), global_Primitives_ref_get(b)))), global_Primitives_ref_set(sass, global_Geometry_surface_area(global_Primitives_ref_get(ss)))), global_Primitives_ref_set(area, global_Matrix_sum(global_Primitives_ref_get(area), global_Primitives_ref_get(sass)))), global_Primitives_ref_set(vss, global_Geometry_surface_volume(global_List_append(global_Primitives_ref_get(ss), global_List_append(global_Model_curve_surface(global_Primitives_ref_get(a)), global_Primitives_ref_get(cb)))))), global_Primitives_ref_set(volume, global_Matrix_sum(global_Primitives_ref_get(volume), global_Primitives_ref_get(vss)))), global_Primitives_ref_set(aperture_area, global_List_add_mut(global_Primitives_ref_get(aperture_area), global_Geometry_surface_area(global_Primitives_ref_get(cb))))), global_Primitives_ref_set(body_area_growth, global_List_add_mut(global_Primitives_ref_get(body_area_growth), global_Primitives_ref_get(sass)))), global_Primitives_ref_set(body_area, global_List_add_mut(global_Primitives_ref_get(body_area), global_Primitives_ref_get(area)))), global_Primitives_ref_set(body_volume_growth, global_List_add_mut(global_Primitives_ref_get(body_volume_growth), global_Primitives_ref_get(vss)))), global_Primitives_ref_set(body_volume, global_List_add_mut(global_Primitives_ref_get(body_volume), global_Primitives_ref_get(volume)))), global_Primitives_ref_set(i, global_Matrix_sum(global_Primitives_ref_get(i), Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))); })), global_Primitives_throw_result(result, global_Primitives_tuple(global_Primitives_ref_get(aperture_area), global_Primitives_ref_get(body_area_growth), global_Primitives_ref_get(body_area), global_Primitives_ref_get(body_volume_growth), global_Primitives_ref_get(body_volume)))); }, result); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_empty_ref()); }(global_Primitives_new_ref(aperture_area)); }(global_Primitives_new_ref(body_area_growth)); }(global_Primitives_new_ref(body_area)); }(global_Primitives_new_ref(body_volume_growth)); }(global_Primitives_new_ref(body_volume)); }(global_Model_get_body(shell)); }, info);
}


u_global_Standard_cube = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), '_D_', new Pacioli.PowerProduct('_b_').expt(3), '_E_', new Pacioli.PowerProduct('_c_').expt(3))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_cube (x) {
    return global_Matrix_multiply(global_Matrix_multiply(x, x), x);
}


u_global_Standard_is_zero_row = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), '_D_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_is_zero_row (x,i) {
    return global_Matrix_is_zero(global_Matrix_row(global_Matrix_magnitude(x), i));
}


u_global_Geometry_y_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_y_rotation (angle) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_dot(global_Geometry_space_vec(global_Matrix_cos(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_negative(global_Matrix_sin(angle))), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_x'))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_y')))), global_Matrix_dot(global_Geometry_space_vec(global_Matrix_sin(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_cos(angle)), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_z'))));
}


u_global_Geometry_x_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_x_rotation (angle) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_x'))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_cos(angle), global_Matrix_sin(angle)), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_y')))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_negative(global_Matrix_sin(angle)), global_Matrix_cos(angle)), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_z'))));
}


u_global_Standard_list_min = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_list_min (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'min'), x);
}


u_global_Shells_rectangle_path = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_rectangle_path (w,h) {
    return function (turn) { return global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_empty_list(), global_Primitives_tuple(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.oneNumbers(1, 1)), global_Matrix_divide(h, Pacioli.initialNumbers(1, 1, [[0, 0, 2]])))), global_Primitives_tuple(turn, w)), global_Primitives_tuple(turn, h)), global_Primitives_tuple(turn, w)); }(global_Matrix_divide(global_Matrix_multiply(Pacioli.fetchValue('Standard', 'pi'), Pacioli.oneNumbers(1, 1)), Pacioli.initialNumbers(1, 1, [[0, 0, 2]])));
}


u_global_Standard_sqr = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), '_D_', new Pacioli.PowerProduct('_b_').expt(2), '_E_', new Pacioli.PowerProduct('_c_').expt(2))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_sqr (x) {
    return global_Matrix_multiply(x, x);
}


u_global_Standard_rows = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', Pacioli.unit(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_rows (matrix) {
    return function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Matrix_row(matrix, i)); }, global_Matrix_row_domain(matrix)); }(global_List_empty_list());
}


u_global_Model_growth_vector_map = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(-1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_growth_vector_map (curve,translation,growth_constant,rotation,landmarks) {
    return function (inv_rot) { return function (s) { return function (t) { return function (u) { return function (diff) { return global_Model_transform_curve(diff, inv_rot); }(global_Model_sum_curves(u, global_Model_scale_curve(curve, global_Matrix_negative(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))))); }(global_Model_translate_curve(t, translation)); }(global_Model_transform_curve(s, rotation)); }(global_Model_scale_curve(curve, growth_constant)); }(global_Standard_inverse(global_Model_curve_rotation(curve, landmarks)));
}


u_global_Model_borders = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_I_', new Pacioli.PowerProduct('_g_').expt(1), '_J_', new Pacioli.PowerProduct('_h_').expt(1))]))]), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_borders (coords) {
    return function (indices) { return function (x_less) { return function (y_less) { return function (left) { return function (top) { return function (right) { return function (bottom) { return global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_empty_list(), left), top), right), bottom); }(global_List_fold_list(function (i,j) { return (y_less(global_List_nth(i, coords), global_List_nth(j, coords)) ? j : i); }, indices)); }(global_List_fold_list(function (i,j) { return (x_less(global_List_nth(i, coords), global_List_nth(j, coords)) ? j : i); }, indices)); }(global_List_fold_list(function (i,j) { return (y_less(global_List_nth(i, coords), global_List_nth(j, coords)) ? i : j); }, indices)); }(global_List_fold_list(function (i,j) { return (x_less(global_List_nth(i, coords), global_List_nth(j, coords)) ? i : j); }, indices)); }(function (a,b) { return global_Primitives_apply(function (_18,ay) { return global_Primitives_apply(function (_17,by) { return global_Matrix_less(ay, by); }, b); }, a); }); }(function (a,b) { return global_Primitives_apply(function (ax,_16) { return global_Primitives_apply(function (bx,_15) { return global_Matrix_less(ax, bx); }, b); }, a); }); }(global_List_naturals(global_List_list_size(coords)));
}


u_global_Standard_columns = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), '_D_', Pacioli.unit(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_columns (matrix) {
    return function (accu) { return global_List_loop_list(accu, function (accu,j) { return global_List_add_mut(accu, global_Matrix_column(matrix, j)); }, global_Matrix_column_domain(matrix)); }(global_List_empty_list());
}


u_global_Model_growth_factor = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_growth_factor (t,growth_constant,nr_ticks) {
    return function (r) { return function (k) { return (global_Primitives_equal(r, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.initialNumbers(1, 1, [[0, 0, 1]]) : global_Matrix_divide(global_Matrix_minus(global_Model_logistic(r, global_Matrix_sum(t, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), k, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), global_Model_logistic(r, t, k, Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), global_Matrix_minus(global_Model_logistic(r, Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), k, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), global_Model_logistic(r, Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), k, Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))))); }(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), global_Matrix_exp(global_Matrix_divide(global_Matrix_multiply(r, nr_ticks), Pacioli.initialNumbers(1, 1, [[0, 0, 2]]))))); }(global_Matrix_ln(growth_constant));
}


u_global_Model_curve_reverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_curve_reverse (curve) {
    return global_List_reverse(curve);
}


u_global_Standard_list_all = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type('boole'))]), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_list_all (x) {
    return (global_Primitives_equal(x, global_List_empty_list()) ? true : global_List_fold_list(function (a,b) { return (a ? b : false); }, x));
}


u_global_Standard_basis = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_basis (matrix) {
    return function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Standard_delta(x)); }, global_Matrix_row_domain(matrix)); }(global_List_empty_list());
}


u_global_Standard_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_inverse (x) {
    return global_Standard_right_inverse(x);
}


u_global_Model_last = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_last (x) {
    return global_List_nth(global_Matrix_minus(global_List_list_size(x), Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), x);
}


u_global_Geometry_cross_sqrt_alt = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_cross_sqrt_alt (v,w) {
    return function (c) { return global_Geometry_polar2cartesian(global_Matrix_sqrt(global_Geometry_norm(c)), global_Geometry_inclination(c), global_Geometry_azimuth(c)); }(global_Geometry_cross(v, w));
}


u_global_Model_transform_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_H_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_transform_curve (curve,matrix) {
    return function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Matrix_dot(matrix, x)); }, curve); }(global_List_empty_list());
}


u_global_Standard_inner = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(-1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_E_', new Pacioli.PowerProduct('_c_').expt(-1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_inner (x,y) {
    return global_Matrix_dot(global_Matrix_transpose(x), y);
}


u_global_Geometry_normalized = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_B_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_B_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Geometry_normalized (x) {
    return global_Matrix_scale_down(x, global_Matrix_magnitude(global_Geometry_norm(x)));
}


u_global_Standard_left_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_left_inverse (x) {
    return global_Matrix_transpose(global_Standard_right_inverse(global_Matrix_transpose(x)));
}


u_global_Shells_circle_path = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), '_a_']), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), '_a_']))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Shells_circle_path (n,d) {
    return function (angle) { return function (accu) { return global_List_loop_list(accu, function (accu,i) { return function (a) { return global_List_add_mut(accu, global_Primitives_tuple(a, d)); }((global_Primitives_equal(i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? global_Matrix_divide(angle, Pacioli.initialNumbers(1, 1, [[0, 0, 2]])) : angle)); }, global_List_naturals(global_Matrix_minus(n, Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))); }(global_List_empty_list()); }(global_Matrix_divide(global_Matrix_multiply(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), Pacioli.fetchValue('Standard', 'pi')), Pacioli.oneNumbers(1, 1)), n));
}


u_global_Model_initial_shell = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))])), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_b_').expt(1)), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), '_c_', '_d_']), new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), '_c_', new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", '_e_'), new Pacioli.Type("list", '_f_')])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_initial_shell (coords,offset,displacement,roz,mu,growth_constant,theta_x,theta_y,theta_z,segments,fudge) {
    return function (curve) { return function (landmarks) { return function (s) { return function (t) { return function (u) { return function (r) { return function (gvm) { return global_Primitives_tuple(global_Primitives_tuple(u, gvm, growth_constant, segments, landmarks), global_List_empty_list(), global_List_empty_list()); }(global_Model_growth_vector_map(u, displacement, growth_constant, r, landmarks)); }(global_Geometry_rotation(theta_x, theta_y, theta_z)); }(global_Model_transform_curve(t, global_Geometry_x_rotation(mu))); }(global_Model_translate_curve(s, offset)); }(global_Model_scale_curve(curve, roz)); }(global_Model_borders(coords)); }(global_Model_make_curve(function (accu) { return global_List_loop_list(accu, function (accu,tup) { return global_Primitives_apply(function (x,z) { return global_List_add_mut(accu, global_Geometry_space_vec(x, global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), x), z)); }, tup); }, coords); }(global_List_empty_list())));
}


u_global_Standard_negatives = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_negatives (x) {
    return global_Matrix_multiply(x, global_Matrix_negative_support(x));
}


u_global_Model_growth_factors = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_growth_factors (growth_constant,n) {
    return function (accu) { return global_List_loop_list(accu, function (accu,t) { return global_List_add_mut(accu, global_Model_growth_factor(t, growth_constant, n)); }, global_List_naturals(n)); }(global_List_empty_list());
}


u_global_Model_sum_curves = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_sum_curves (x,y) {
    return function (accu) { return global_List_loop_list(accu, function (accu,tup) { return global_Primitives_apply(function (a,b) { return global_List_add_mut(accu, global_Matrix_sum(a, b)); }, tup); }, global_List_zip(x, y)); }(global_List_empty_list());
}


u_global_Model_scale_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_scale_curve (curve,factor) {
    return function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Matrix_scale(factor, x)); }, curve); }(global_List_empty_list());
}


u_global_Standard_diagonal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Standard_diagonal (x) {
    return function (u) { return function (units) { return global_Matrix_multiply(global_Matrix_make_matrix(function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(i, i, global_Matrix_get_num(x, i, Pacioli.fetchValue('Matrix', '_')))); }, global_Matrix_row_domain(x)); }(global_List_empty_list())), units); }(global_Matrix_scale(global_Matrix_unit_factor(u), global_Matrix_dim_div(u, u))); }(global_Standard_unit(x));
}


u_global_Model_empty_shell_info = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}
function global_Model_empty_shell_info (shell) {
    return function (u) { return global_Primitives_tuple(global_List_add_mut(global_List_empty_list(), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Standard_sqr(u))), global_List_add_mut(global_List_empty_list(), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Standard_sqr(u))), global_List_add_mut(global_List_empty_list(), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Standard_sqr(u))), global_List_add_mut(global_List_empty_list(), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Standard_cube(u))), global_List_add_mut(global_List_empty_list(), global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Standard_cube(u)))); }(global_Model_shell_unit(shell));
}


// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1))))


u_global_Model_get_meshes = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> Boole()


u_global_Matrix_is_zero = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (List(a), List(a)) -> List(a)


u_global_List_append = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_'), new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> a


u_global_Model_shell_unit = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!)) -> List(Tuple(a*Space!, a*Space!, a*Space!))


u_global_Model_curve_surface = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c, E) -> Boole()


u_global_Standard_is_zero_column = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), '_E_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: (P, P) -> Boole()


u_global_Matrix_index_less = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_P_', '_P_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (Boole()) -> Boole()


u_global_Primitives_not = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('boole')]), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> a*Space!


u_global_Model_axis_point = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a*Space!, a*Space!, a*Space!) -> a^2


u_global_Geometry_triangle_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (radian) -> Space! per Space!


u_global_Geometry_z_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> List(P)


u_global_Matrix_row_domain = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), new Pacioli.Type("list", '_P_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (P! per Q!) -> radian*P! per Q!


u_global_Matrix_atan = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (1) -> a


u_global_Primitives_error = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_minus = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a*Space!, a*Space!) -> a*Space!


u_global_Geometry_cross_sqrt = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit u: (P!u per P!u, 1) -> P!u per P!u


u_global_Matrix_power = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> List(Q)


u_global_Matrix_column_domain = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), new Pacioli.Type("list", '_Q_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit u: (P!u per P!u) -> P!u per P!u


u_global_Standard_closure = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v


u_global_Matrix_column_units = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> P! per Q!


u_global_Matrix_gcd = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (P! per Q!) -> P! per Q!


u_global_Matrix_ln = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: (D! per E!) -> percent*D! per E!


u_global_Standard_to_percentage = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (List(a)) -> List(Tuple(a, a))


u_global_Standard_combis = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", new Pacioli.Type("tuple", ['_a_', '_a_']))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a, radian, radian) -> a*Space!


u_global_Geometry_polar2cartesian = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u


u_global_Matrix_dim_inv = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (() -> Void(), Ref(a)) -> a


u_global_Primitives_catch_result = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', [new Pacioli.Type("tuple", []), null]), new Pacioli.Type("reference", '_a_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*P!u per R!w) -> b*Q!v per a*R!w


u_global_Matrix_solve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_b_').expt(1)), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u


u_global_Standard_right_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl Space!


u_global_Geometry_d_y = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl Space!


u_global_Geometry_d_x = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Tuple(P!u per P!u, a*P!u per Q!v, 1/Q!v per 1/Q!v)


u_global_Matrix_svd = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(Pacioli.unit(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(-1), '_Q_', new Pacioli.PowerProduct('_v_').expt(-1))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1))))), 1) -> Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))


u_global_Model_grow = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl Space!


u_global_Geometry_d_z = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(a*Space!)) -> a^2


u_global_Model_segment_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a, a) -> Boole()


u_global_Primitives_equal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', '_a_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a: (a*P! per Q!, P, Q) -> a


u_global_Matrix_get = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1)), '_P_', '_Q_']), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c, D, E) -> 1


u_global_Matrix_get_num = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), '_D_', '_E_']), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*Q!v per R!w) -> a*b*P!u per R!w


u_global_Matrix_dot = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit a: (a*P!) -> a


u_global_Geometry_norm = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: (P) -> P!


u_global_Standard_delta = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_P_']), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!)) -> List(a*Space!)


u_global_Model_make_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (Ref(a), a) -> Void()


u_global_Primitives_ref_set = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("reference", '_a_'), '_a_']), null]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> List(List(a*Space!))


u_global_Model_get_body = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (P! per Q!) -> radian*P! per Q!


u_global_Matrix_asin = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (1, List(a)) -> a


u_global_List_nth = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", '_a_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (Void(), Void()) -> Void()


u_global_Primitives_seq = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [null, null]), null]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(a*Space!)) -> Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))


u_global_Model_segment_mesh = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_sum = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl () -> 1


u_global_Matrix_random = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", []), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (radian*P! per Q!) -> P! per Q!


u_global_Matrix_cos = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,v: (a*P!v per Q!, Q) -> a*P!v


u_global_Matrix_column = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_v_').expt(1), '_Q_', Pacioli.unit(1)), '_Q_']), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_v_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (() -> Boole(), () -> Void()) -> Void()


u_global_Primitives_while_function = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', [new Pacioli.Type("tuple", []), new Pacioli.Type('boole')]), new Pacioli.Type('function', [new Pacioli.Type("tuple", []), null])]), null]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a*Space!, a*Space!, a*Space!) -> a^3


u_global_Geometry_signed_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (P! per Q!) -> radian*P! per Q!


u_global_Matrix_acos = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a*Space!, a*Space!) -> a^2*Space!


u_global_Geometry_cross = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(1)) -> Space! per Space!


u_global_Model_curve_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,v: (a, b*P!u per Q!v) -> a*b*P!u per Q!v


u_global_Matrix_scale = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()


u_global_Matrix_less_eq = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (radian, radian, radian) -> Space! per Space!


u_global_Geometry_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), a*Space!) -> List(a*Space!)


u_global_Model_translate_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a*Space!) -> radian


u_global_Geometry_inclination = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P! per Q!


u_global_Matrix_magnitude = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!


u_global_Matrix_signum = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u/P!x per b/Q!v/Q!y


u_global_Matrix_div = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_x_').expt(1), '_Q_', new Pacioli.PowerProduct('_y_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1)), '_P_', new Pacioli.PowerProduct('_x_').expt(-1).mult(new Pacioli.PowerProduct('_u_').expt(1)), '_Q_', new Pacioli.PowerProduct('_y_').expt(-1).mult(new Pacioli.PowerProduct('_v_').expt(-1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: a -> a


u_global_Primitives_tuple = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', ['_a_', '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> 1


u_global_Model_shell_current_size = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a, a) -> Boole()


u_global_Primitives_not_equal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', '_a_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a*Space!, a*Space!, a*Space!, a*Space!) -> Space! per Space!


u_global_Model_compute_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*P!u per R!w) -> b*Q!v per a*R!w


u_global_Standard_left_division = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_b_').expt(1)), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: () -> Ref(a)


u_global_Primitives_empty_ref = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", []), new Pacioli.Type("reference", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(Tuple(a*Space!, a*Space!, a*Space!))) -> a^3


u_global_Geometry_surface_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a,b: ((a) -> b, List(a)) -> List(b)


u_global_List_map_list = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_']), '_b_']), new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", '_b_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (P! per Q!, 1) -> P! per Q!


u_global_Matrix_log = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> 1/P!u per a/Q!v


u_global_Matrix_reciprocal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_P_', new Pacioli.PowerProduct('_u_').expt(-1), '_Q_', new Pacioli.PowerProduct('_v_').expt(-1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(a*Space!), 1, List(1)) -> List(a*Space!)


u_global_Model_step = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (1, List(a*Space!)) -> a*Space!


u_global_Model_curve_nth = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (P! per Q!, 1) -> P! per Q!


u_global_Matrix_expt = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a/Q!v per 1/P!u


u_global_Matrix_transpose = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(-1), '_P_', new Pacioli.PowerProduct('_u_').expt(-1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_max = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a,b: (List(a), List(b)) -> List(Tuple(a, b))


u_global_List_zip = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_'), new Pacioli.Type("list", '_b_')]), new Pacioli.Type("list", new Pacioli.Type("tuple", ['_a_', '_b_']))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (P! per Q!) -> P! per Q!


u_global_Matrix_exp = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a,b: (a, (a, b) -> a, List(b)) -> a


u_global_List_loop_list = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', '_b_']), '_a_']), new Pacioli.Type("list", '_b_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: (percent*D! per E!) -> D! per E!


u_global_Standard_from_percentage = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a) -> List(a)


u_global_List_singleton_list = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_']), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a*Space!) -> radian


u_global_Geometry_azimuth = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (List(a)) -> List(a)


u_global_List_tail = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> List(a*Space!)


u_global_Model_shell_initial_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v


u_global_Standard_unit = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*R!w per Q!v) -> a*P!u per b*R!w


u_global_Standard_right_division = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1)), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_R_', new Pacioli.PowerProduct('_w_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit a,u: (a*P!u per P!u) -> Tuple(P!u per P!u, P!u per P!u, a*P!u per P!u)


u_global_Matrix_plu = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]), new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1)), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(a*Space!)) -> a^3


u_global_Model_segment_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a, List(a)) -> List(a)


u_global_List_cons = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E,H: for_unit a,b,c,f,g: (a*D!b per E!c, f*H!g per E!c) -> a*D!b per f*H!g


u_global_Matrix_dim_div = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(-1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (a, a, a) -> a*Space!


u_global_Geometry_space_vec = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_min = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit u: (P!u per P!u) -> P!u per P!u


u_global_Standard_kleene = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (1) -> List(1)


u_global_List_naturals = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per Q!v


u_global_Matrix_right_identity = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a: (List(Tuple(P, Q, a))) -> a*P! per Q!


u_global_Matrix_make_matrix = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", ['_P_', '_Q_', Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b: ((a) -> b, a*P! per Q!) -> b*P! per Q!


u_global_Standard_map_matrix = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (List(a)) -> List(a)


u_global_List_reverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(Tuple(a*Space!, a*Space!, a*Space!))) -> a^2


u_global_Geometry_surface_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a) -> a


u_global_Primitives_print = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_']), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a) -> Void()


u_global_Primitives_display = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_']), null]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P!u


u_global_Matrix_row_units = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(List(a^2), List(a^2), List(a^2), List(a^3), List(a^3))) -> Tuple(a^2, a^2, a^2, a^3, a^3)


u_global_Model_last_segment_info = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))])]), new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a


u_global_Matrix_unit_factor = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (radian*P! per Q!) -> P! per Q!


u_global_Matrix_tan = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> 1


u_global_Model_shell_full_size = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit a,u: (a*P!u) -> a*P!u per P!


u_global_Standard_diagonal2 = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: (radian*P! per Q!) -> P! per Q!


u_global_Matrix_sin = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,v: (a*P!u, b*Q!v) -> a*b*P!u per 1/Q!v


u_global_Standard_outer = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(-1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(a*Space!)) -> List(Tuple(a*Space!, a*Space!, a*Space!))


u_global_Model_segment_closed_surface = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(a*Space!)) -> List(Tuple(a*Space!, a*Space!, a*Space!))


u_global_Model_segment_surface = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!


u_global_Matrix_positive_support = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: ((a, a) -> a, List(a)) -> a


u_global_List_fold_list = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', '_a_']), '_a_']), new Pacioli.Type("list", '_a_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (1, a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_bottom = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u per Q!v


u_global_Matrix_mod = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_x_').expt(1), '_Q_', new Pacioli.PowerProduct('_y_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1))))), Tuple(List(a^2), List(a^2), List(a^2), List(a^3), List(a^3)), 1) -> Tuple(List(a^2), List(a^2), List(a^2), List(a^3), List(a^3))


u_global_Model_extend_shell_info = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (Ref(a)) -> a


u_global_Primitives_ref_get = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("reference", '_a_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c, D) -> Boole()


u_global_Standard_is_zero_row = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), '_D_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a^3*D!b^3 per E!c^3


u_global_Standard_cube = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), '_D_', new Pacioli.PowerProduct('_b_').expt(3), '_E_', new Pacioli.PowerProduct('_c_').expt(3))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (radian) -> Space! per Space!


u_global_Geometry_y_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (radian) -> Space! per Space!


u_global_Geometry_x_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (List(a)) -> a


u_global_List_head = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,v: (a*P! per Q!v) -> List(a per Q!v)


u_global_Standard_rows = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a^2*D!b^2 per E!c^2


u_global_Standard_sqr = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), '_D_', new Pacioli.PowerProduct('_b_').expt(2), '_E_', new Pacioli.PowerProduct('_c_').expt(2))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(Tuple(a, a))) -> List(1)


u_global_Model_borders = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), a*Space!, 1, Space! per Space!, List(1)) -> List(a*Space!)


u_global_Model_growth_vector_map = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u: (a*P!u per Q!) -> List(a*P!u)


u_global_Standard_columns = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', Pacioli.unit(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl () -> Void()


u_global_Primitives_skip = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", []), null]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a) -> a


u_global_Primitives_identity = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_']), '_a_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (1, 1, 1) -> 1


u_global_Model_growth_factor = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!)) -> List(a*Space!)


u_global_Model_curve_reverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u


u_global_Standard_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: () -> List(a)


u_global_List_empty_list = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", []), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a,b: (List(a*Space!), b*Space! per Space!) -> List(a*b*Space!)


u_global_Model_transform_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,v: (a*P!u per Q!v, b) -> a*P!u per b*Q!v


u_global_Matrix_scale_down = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1)), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!


u_global_Matrix_support = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit a,b,u: (a*P!u, b/P!u) -> a*b


u_global_Standard_inner = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(-1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl Void()


u_global_Primitives_nothing = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = null;
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit a: (a*P!) -> a*P!


u_global_Geometry_normalized = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a,b: (a -> b, a) -> b


u_global_Primitives_apply = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', ['_a_', '_b_']), '_a_']), '_b_']);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!x/P!u per b*Q!y/Q!v


u_global_Matrix_left_divide = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_x_').expt(1), '_Q_', new Pacioli.PowerProduct('_y_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1)), '_P_', new Pacioli.PowerProduct('_x_').expt(1).mult(new Pacioli.PowerProduct('_u_').expt(-1)), '_Q_', new Pacioli.PowerProduct('_y_').expt(1).mult(new Pacioli.PowerProduct('_v_').expt(-1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> radian*P! per Q!


u_global_Matrix_atan2 = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a: (a*P! per Q!) -> a


u_global_Matrix_total = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u


u_global_Standard_left_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a^2*P!u^2 per Q!v^2) -> a*P!u per Q!v


u_global_Matrix_sqrt = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), '_P_', new Pacioli.PowerProduct('_u_').expt(2), '_Q_', new Pacioli.PowerProduct('_v_').expt(2))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u/P!x per b*Q!v/Q!y


u_global_Matrix_divide = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_x_').expt(1), '_Q_', new Pacioli.PowerProduct('_y_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1)), '_P_', new Pacioli.PowerProduct('_x_').expt(-1).mult(new Pacioli.PowerProduct('_u_').expt(1)), '_Q_', new Pacioli.PowerProduct('_y_').expt(-1).mult(new Pacioli.PowerProduct('_v_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (Ref(a), a) -> Void()


u_global_Primitives_throw_result = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("reference", '_a_'), '_a_']), null]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl Index()


u_global_Matrix__ = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('coordinates', []);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (List(a)) -> 1


u_global_List_list_size = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(Tuple(a, a)), a*Space!, a*Space!, 1, radian, 1, radian, radian, radian, 1, 1) -> Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))


u_global_Model_initial_shell = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))])), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_abs = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P!u per P!u


u_global_Matrix_left_identity = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (1, a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_top = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a) -> Ref(a)


u_global_Primitives_new_ref = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_']), new Pacioli.Type("reference", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (List(a*Space!), List(a*Space!)) -> List(a*Space!)


u_global_Model_sum_curves = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl (1, 1) -> List(1)


u_global_Model_growth_factors = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,b,u,w,v,z: (a*P!u per Q!v, b*P!w per Q!z) -> a*b*P!u*P!w per Q!v*Q!z


u_global_Matrix_multiply = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_P_', new Pacioli.PowerProduct('_w_').expt(1), '_Q_', new Pacioli.PowerProduct('_z_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), '_P_', new Pacioli.PowerProduct('_u_').expt(1).mult(new Pacioli.PowerProduct('_w_').expt(1)), '_Q_', new Pacioli.PowerProduct('_z_').expt(1).mult(new Pacioli.PowerProduct('_v_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (List(a), a) -> List(a)


u_global_List_add_mut = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_'), '_a_']), new Pacioli.Type("list", '_a_')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a,b: (List(a*Space!), b) -> List(a*b*Space!)


u_global_Model_scale_curve = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(1)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()


u_global_Matrix_less = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_unit a: (Tuple(Tuple(List(a*Space!), List(a*Space!), 1, 1, List(1)), List(List(a*Space!)), List(Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))))) -> Tuple(List(a^2), List(a^2), List(a^2), List(a^3), List(a^3))


u_global_Model_empty_shell_info = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]), new Pacioli.Type("list", new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))), new Pacioli.Type("list", new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]))])]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P: for_unit a,u: (a*P!u) -> a*P!u per P!u


u_global_Standard_diagonal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!


u_global_Matrix_negative_support = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), '_E_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,v: (a*P! per Q!v, P) -> a per Q!v


u_global_Matrix_row = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), '_P_']), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_negative = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}



