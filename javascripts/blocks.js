
function compute_index_Geometry_Space () {return Pacioli.makeIndexSet('Space', ["x","y","z"])}

function compute_unit_radian () {return {definition: Pacioli.unit(1), symbol: 'rad'}}
function compute_unit_percent () {return {definition: Pacioli.unit(0.01), symbol: '%'}}
function compute_unit_metre () {return {symbol: 'm'}}

// for_index D,E: for_unit a,b,c: (a*D!b per E!c, E) -> Boole()

u_global_Standard_is_zero_column = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), '_E_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_is_zero_column (x,j) {
    return global_Matrix_is_zero(global_Matrix_column(global_Matrix_magnitude(x), j));
}


// for_index C: for_unit a,b: (a*C!b) -> a*C!b per C!

u_global_Standard_diagonal2 = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), '_C_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_diagonal2 (x) {
    return function (u) { return function (units) { return global_Matrix_multiply(global_Matrix_make_matrix(function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(i, i, global_Matrix_get_num(x, i, Pacioli.fetchValue('Matrix', '_')))); }, global_Matrix_row_domain(x)); }(global_List_empty_list())), units); }(global_Matrix_dim_div(u, global_Matrix_magnitude(u))); }(global_Standard_unit(x));
}


// for_unit a: (a*Space!, a*Space!, a*Space!) -> a^2

u_global_Geometry_triangle_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_triangle_area (x,y,z) {
    return global_Matrix_divide(global_Geometry_norm(global_Geometry_cross(global_Matrix_minus(y, x), global_Matrix_minus(z, x))), Pacioli.initialNumbers(1, 1, [[0, 0, 2]]));
}


// for_index D,E,H: for_unit a,b,c,f,g: (a*D!b per E!c, f*H!g per 1/E!c) -> a*f*D!b per 1/H!g

u_global_Standard_outer = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(-1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(-1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_outer (x,y) {
    return global_Matrix_dot(x, global_Matrix_transpose(y));
}


// (radian) -> Space! per Space!

u_global_Geometry_z_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_z_rotation (angle) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_dot(global_Geometry_space_vec(global_Matrix_cos(angle), global_Matrix_sin(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_x'))), global_Matrix_dot(global_Geometry_space_vec(global_Matrix_negative(global_Matrix_sin(angle)), global_Matrix_cos(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_y')))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_z'))));
}


// for_unit a,b: (a*Space!, b^2*Space!/a) -> b*Space!

u_global_Geometry_cross_sqrt = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_b_').expt(2)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_cross_sqrt (v,w) {
    return function (vx) { return function (vy) { return function (vz) { return function (wx) { return function (wy) { return function (wz) { return function (sx) { return function (sy) { return function (sz) { return function (sq) { return global_Matrix_scale_down(global_Matrix_sum(global_Matrix_sum(global_Matrix_scale(sx, Pacioli.fetchValue('Geometry', 'd_x')), global_Matrix_scale(sy, Pacioli.fetchValue('Geometry', 'd_y'))), global_Matrix_scale(sz, Pacioli.fetchValue('Geometry', 'd_z'))), global_Matrix_sqrt(sq)); }(global_Matrix_sqrt(global_Matrix_sum(global_Matrix_sum(global_Matrix_multiply(sx, sx), global_Matrix_multiply(sy, sy)), global_Matrix_multiply(sz, sz)))); }(global_Matrix_minus(global_Matrix_multiply(vx, wy), global_Matrix_multiply(vy, wx))); }(global_Matrix_minus(global_Matrix_multiply(vz, wx), global_Matrix_multiply(vx, wz))); }(global_Matrix_minus(global_Matrix_multiply(vy, wz), global_Matrix_multiply(vz, wy))); }(global_Matrix_get(w, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_')));
}


// for_unit a: (a) -> Tuple(List(a*Space!), List(Tuple(1, 1, 1, 1)))

u_global_Blocks_cube_mesh = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Blocks_cube_mesh (size) {
    return function (vertices) { return function (faces) { return global_Primitives_tuple(function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Matrix_scale(size, x)); }, vertices); }(global_List_empty_list()), faces); }(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_empty_list(), global_Primitives_tuple(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), Pacioli.initialNumbers(1, 1, [[0, 0, 3]]))), global_Primitives_tuple(Pacioli.initialNumbers(1, 1, [[0, 0, 4]]), Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), Pacioli.initialNumbers(1, 1, [[0, 0, 6]]), Pacioli.initialNumbers(1, 1, [[0, 0, 7]]))), global_Primitives_tuple(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 4]]), Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), global_Primitives_tuple(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), Pacioli.initialNumbers(1, 1, [[0, 0, 6]]), Pacioli.initialNumbers(1, 1, [[0, 0, 2]]))), global_Primitives_tuple(Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), Pacioli.initialNumbers(1, 1, [[0, 0, 6]]), Pacioli.initialNumbers(1, 1, [[0, 0, 7]]), Pacioli.initialNumbers(1, 1, [[0, 0, 3]]))), global_Primitives_tuple(Pacioli.initialNumbers(1, 1, [[0, 0, 3]]), Pacioli.initialNumbers(1, 1, [[0, 0, 7]]), Pacioli.initialNumbers(1, 1, [[0, 0, 4]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])))); }(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_add_mut(global_List_empty_list(), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));
}


// for_index B: for_unit a: (B!a per B!a) -> B!a per B!a

u_global_Standard_closure = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_closure (x) {
    return global_Matrix_minus(global_Standard_kleene(x), global_Matrix_left_identity(x));
}


// for_type a: (List(a)) -> List(Tuple(a, a))

u_global_Standard_combis = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", '_a_')]), new Pacioli.Type("list", new Pacioli.Type("tuple", ['_a_', '_a_']))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_combis (list) {
    return function (accumulator) { return global_Primitives_apply(function (result,_0) { return result; }, global_List_loop_list(global_Primitives_tuple(global_List_empty_list(), list), accumulator, list)); }(function (accu,x) { return global_Primitives_apply(function (result,tails) { return global_Primitives_tuple(global_List_append(function (accu) { return global_List_loop_list(accu, function (accu,y) { return global_List_add_mut(accu, global_Primitives_tuple(x, y)); }, global_List_tail(tails)); }(global_List_empty_list()), result), global_List_tail(tails)); }, accu); });
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*percent*D!b per E!c

u_global_Standard_to_percentage = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(Pacioli.unit('percent').expt(1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_to_percentage (x) {
    return global_Matrix_scale(Pacioli.fetchValue('Standard', 'percent_conv'), x);
}


// for_unit a: (a, radian, radian) -> a*Space!

u_global_Geometry_polar2cartesian = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_polar2cartesian (radius,inclination,azimuth) {
    return global_Matrix_scale(radius, global_Geometry_space_vec(global_Matrix_multiply(global_Matrix_sin(inclination), global_Matrix_cos(azimuth)), global_Matrix_multiply(global_Matrix_sin(inclination), global_Matrix_sin(azimuth)), global_Matrix_cos(inclination)));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c

u_global_Standard_log_not = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_log_not (x) {
    return global_Matrix_minus(global_Standard_unit(x), x);
}


// for_type f: for_index D,E: for_unit a,b,c: (Tuple(List(a*D!b per E!c), f), a*D!b per E!c) -> Tuple(List(a*D!b per E!c), f)

u_global_Blocks_mesh_move = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))), '_f_']), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))), '_f_'])]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Blocks_mesh_move (mesh,vec) {
    return global_Primitives_apply(function (vertices,faces) { return global_Primitives_tuple(function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Matrix_sum(x, vec)); }, vertices); }(global_List_empty_list()), faces); }, mesh);
}


function compute_u_global_Blocks_mesh1() {
    return new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
}

function compute_global_Blocks_mesh1() {
  return global_Blocks_cube_mesh(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 3]]), Pacioli.oneNumbers(1, 1)));
}

// for_index A,B: (List(A! per B!)) -> A! per B!

u_global_Standard_list_gcd = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), '_A_', Pacioli.unit(1), '_B_', Pacioli.unit(1)))]), Pacioli.createMatrixType(Pacioli.unit(1), '_A_', Pacioli.unit(1), '_B_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_list_gcd (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'gcd'), x);
}


function compute_u_global_Blocks_mesh2() {
    return new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))), new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]);
}

function compute_global_Blocks_mesh2() {
  return function (d) { return global_Blocks_mesh_move(global_Blocks_cube_mesh(global_Matrix_multiply(Pacioli.initialNumbers(1, 1, [[0, 0, 30]]), Pacioli.oneNumbers(1, 1))), global_Geometry_space_vec(d, d, d)); }(global_Matrix_multiply(global_Matrix_negative(Pacioli.initialNumbers(1, 1, [[0, 0, 15]])), Pacioli.oneNumbers(1, 1)));
}

// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> E!c per a*D!b

u_global_Standard_right_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_right_inverse (x) {
    return global_Matrix_solve(x, global_Matrix_left_identity(x));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c, D) -> Boole()

u_global_Standard_is_zero_row = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), '_D_']), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_is_zero_row (x,i) {
    return global_Matrix_is_zero(global_Matrix_row(global_Matrix_magnitude(x), i));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a^3*D!b^3 per E!c^3

u_global_Standard_cube = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(3), '_D_', new Pacioli.PowerProduct('_b_').expt(3), '_E_', new Pacioli.PowerProduct('_c_').expt(3))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_cube (x) {
    return global_Matrix_multiply(global_Matrix_multiply(x, x), x);
}


function compute_u_global_Geometry_d_y() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}

function compute_global_Geometry_d_y() {
  return global_Standard_delta(Pacioli.createCoordinates([['y','index_Geometry_Space']]));
}

// (radian) -> Space! per Space!

u_global_Geometry_y_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_y_rotation (angle) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_dot(global_Geometry_space_vec(global_Matrix_cos(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_negative(global_Matrix_sin(angle))), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_x'))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_y')))), global_Matrix_dot(global_Geometry_space_vec(global_Matrix_sin(angle), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_cos(angle)), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_z'))));
}


function compute_u_global_Geometry_d_x() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}

function compute_global_Geometry_d_x() {
  return global_Standard_delta(Pacioli.createCoordinates([['x','index_Geometry_Space']]));
}

// (radian) -> Space! per Space!

u_global_Geometry_x_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_x_rotation (angle) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_x'))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_cos(angle), global_Matrix_sin(angle)), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_y')))), global_Matrix_dot(global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), global_Matrix_negative(global_Matrix_sin(angle)), global_Matrix_cos(angle)), global_Matrix_transpose(Pacioli.fetchValue('Geometry', 'd_z'))));
}


// for_index D,E: for_unit a,b,c: (List(a*D!b per E!c)) -> a*D!b per E!c

u_global_Standard_list_min = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_list_min (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'min'), x);
}


function compute_u_global_Geometry_d_z() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}

function compute_global_Geometry_d_z() {
  return global_Standard_delta(Pacioli.createCoordinates([['z','index_Geometry_Space']]));
}

function compute_u_global_Blocks_vec() {
    return Pacioli.createMatrixType(Pacioli.unit('milli', 'metre').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}

function compute_global_Blocks_vec() {
  return global_Matrix_scale(Pacioli.oneNumbers(1, 1), global_Geometry_space_vec(Pacioli.initialNumbers(1, 1, [[0, 0, 100]]), Pacioli.initialNumbers(1, 1, [[0, 0, 200]]), Pacioli.initialNumbers(1, 1, [[0, 0, 300]])));
}

// for_index A: (A) -> A!

u_global_Standard_delta = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_A_']), Pacioli.createMatrixType(Pacioli.unit(1), '_A_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_delta (x) {
    return global_Matrix_make_matrix(global_List_add_mut(global_List_empty_list(), global_Primitives_tuple(x, Pacioli.fetchValue('Matrix', '_'), Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));
}


// for_index C,D: for_unit a,b: (a*C! per D!b^2) -> a/D!b per D!b

u_global_Geometry_norm = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', Pacioli.unit(1), '_D_', new Pacioli.PowerProduct('_b_').expt(2))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(-1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_norm (x) {
    return global_Matrix_sqrt(global_Standard_inner(x, x));
}


// for_index D,E: for_unit a,b,c,f,g,h: (a*D!b per E!c, f*D!g per E!h) -> a*percent*D!b/D!g per f*E!c/E!h

u_global_Standard_fraction = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_h_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(Pacioli.unit('percent').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(-1))), '_D_', new Pacioli.PowerProduct('_b_').expt(1).mult(new Pacioli.PowerProduct('_g_').expt(-1)), '_E_', new Pacioli.PowerProduct('_h_').expt(-1).mult(new Pacioli.PowerProduct('_c_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_fraction (x,y) {
    return global_Standard_to_percentage(global_Matrix_divide(x, y));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a^2*D!b^2 per E!c^2

u_global_Standard_sqr = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), '_D_', new Pacioli.PowerProduct('_b_').expt(2), '_E_', new Pacioli.PowerProduct('_c_').expt(2))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_sqr (x) {
    return global_Matrix_multiply(x, x);
}


// for_index C,D: for_unit a,b: (a*C! per D!b) -> List(a per D!b)

u_global_Standard_rows = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', Pacioli.unit(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_rows (matrix) {
    return function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Matrix_row(matrix, i)); }, global_Matrix_row_domain(matrix)); }(global_List_empty_list());
}


// for_index D,E: for_unit a,b,c: (List(a*D!b per E!c)) -> a*D!b per E!c

u_global_Standard_list_max = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_list_max (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'max'), x);
}


// for_index C,D: for_unit a,b: (a*C!b per D!) -> List(a*C!b)

u_global_Standard_columns = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), '_D_', Pacioli.unit(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_columns (matrix) {
    return function (accu) { return global_List_loop_list(accu, function (accu,j) { return global_List_add_mut(accu, global_Matrix_column(matrix, j)); }, global_Matrix_column_domain(matrix)); }(global_List_empty_list());
}


// for_unit a,b,c: (a*Space!, b*Space!, c*Space!/b) -> a*c

u_global_Geometry_signed_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_c_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_c_').expt(1)), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_signed_volume (x,y,z) {
    return global_Matrix_divide(global_Standard_inner(x, global_Geometry_cross(y, z)), Pacioli.initialNumbers(1, 1, [[0, 0, 6]]));
}


// for_unit a,b: (a*Space!, b*Space!/a) -> b*Space!

u_global_Geometry_cross = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_b_').expt(1)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_cross (v,w) {
    return function (vx) { return function (vy) { return function (vz) { return function (wx) { return function (wy) { return function (wz) { return global_Matrix_sum(global_Matrix_sum(global_Matrix_scale(global_Matrix_minus(global_Matrix_multiply(vy, wz), global_Matrix_multiply(vz, wy)), Pacioli.fetchValue('Geometry', 'd_x')), global_Matrix_scale(global_Matrix_minus(global_Matrix_multiply(vz, wx), global_Matrix_multiply(vx, wz)), Pacioli.fetchValue('Geometry', 'd_y'))), global_Matrix_scale(global_Matrix_minus(global_Matrix_multiply(vx, wy), global_Matrix_multiply(vy, wx)), Pacioli.fetchValue('Geometry', 'd_z'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(w, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['z','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['y','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_'))); }(global_Matrix_get(v, Pacioli.createCoordinates([['x','index_Geometry_Space']]), Pacioli.fetchValue('Matrix', '_')));
}


// (List(Boole())) -> Boole()

u_global_Standard_list_all = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type('boole'))]), new Pacioli.Type('boole')]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_list_all (x) {
    return (global_Primitives_equal(x, global_List_empty_list()) ? true : global_List_fold_list(function (a,b) { return (a ? b : false); }, x));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> List(D!)

u_global_Standard_basis = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), new Pacioli.Type("list", Pacioli.createMatrixType(Pacioli.unit(1), '_D_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_basis (matrix) {
    return function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Standard_delta(x)); }, global_Matrix_row_domain(matrix)); }(global_List_empty_list());
}


// (radian, radian, radian) -> Space! per Space!

u_global_Geometry_rotation = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_rotation (x_angle,y_angle,z_angle) {
    return global_Matrix_dot(global_Matrix_dot(global_Geometry_z_rotation(z_angle), global_Geometry_y_rotation(y_angle)), global_Geometry_x_rotation(x_angle));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> E!c per a*D!b

u_global_Standard_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_inverse (x) {
    return global_Standard_right_inverse(x);
}


// for_unit a: (a*Space!) -> radian

u_global_Geometry_inclination = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_inclination (vec) {
    return global_Matrix_acos(global_Matrix_divide(global_Standard_inner(vec, Pacioli.fetchValue('Geometry', 'd_z')), global_Geometry_norm(vec)));
}


// for_unit a,b: (a*Space!, b^2*Space!/a) -> b*Space!

u_global_Geometry_cross_sqrt_alt = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_b_').expt(2)), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_cross_sqrt_alt (v,w) {
    return function (c) { return global_Geometry_polar2cartesian(global_Matrix_sqrt(global_Geometry_norm(c)), global_Geometry_inclination(c), global_Geometry_azimuth(c)); }(global_Geometry_cross(v, w));
}


// for_index D,E,H: for_unit a,b,c,f,g: (a*D!b per E!c, f/D!b per H!g) -> a*f/E!c per H!g

u_global_Standard_inner = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(-1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_E_', new Pacioli.PowerProduct('_c_').expt(-1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_inner (x,y) {
    return global_Matrix_dot(global_Matrix_transpose(x), y);
}


// for_index B: for_unit a: (a*B!) -> a*B!

u_global_Geometry_normalized = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_B_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_B_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_normalized (x) {
    return global_Matrix_scale_down(x, global_Matrix_magnitude(global_Geometry_norm(x)));
}


// for_index D,E,H: for_unit a,b,c,f,g: (a*D!b per E!c, f*D!b per H!g) -> f*E!c per a*H!g

u_global_Standard_left_division = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_f_').expt(1)), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_left_division (x,y) {
    return global_Matrix_dot(global_Standard_inverse(x), y);
}


// for_unit a,b,c: (List(Tuple(a*Space!, b*Space!, c*Space!/a/b))) -> c

u_global_Geometry_surface_volume = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1).mult(new Pacioli.PowerProduct('_c_').expt(1).mult(new Pacioli.PowerProduct('_b_').expt(-1))), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_c_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_surface_volume (surface) {
    return global_Matrix_abs(global_Standard_list_sum(function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Primitives_apply(Pacioli.fetchValue('Geometry', 'signed_volume'), x)); }, surface); }(global_List_empty_list())));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> E!c per a*D!b

u_global_Standard_left_inverse = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_c_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_left_inverse (x) {
    return global_Matrix_transpose(global_Standard_right_inverse(global_Matrix_transpose(x)));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c

u_global_Standard_positives = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_positives (x) {
    return global_Matrix_multiply(x, global_Matrix_positive_support(x));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per percent*E!c

u_global_Standard_from_percentage = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(Pacioli.unit('percent').expt(-1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_from_percentage (x) {
    return global_Matrix_scale_down(x, Pacioli.fetchValue('Standard', 'percent_conv'));
}


// for_index C: for_unit a,b: (a*Space! per C!b) -> radian*C!

u_global_Geometry_azimuth = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit('radian').expt(1), '_C_', Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_azimuth (vec) {
    return global_Matrix_atan2(global_Standard_inner(vec, Pacioli.fetchValue('Geometry', 'd_y')), global_Standard_inner(vec, Pacioli.fetchValue('Geometry', 'd_x')));
}


// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c

u_global_Standard_unit = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_unit (mat) {
    return global_Matrix_scale(global_Matrix_unit_factor(mat), global_Matrix_dim_div(global_Matrix_row_units(mat), global_Matrix_column_units(mat)));
}


// for_index D,E,H: for_unit a,b,c,f,g: (a*D!b per E!c, f*H!g per E!c) -> a*D!b per f*H!g

u_global_Standard_right_division = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1).mult(new Pacioli.PowerProduct('_f_').expt(-1)), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_H_', new Pacioli.PowerProduct('_g_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_right_division (x,y) {
    return global_Matrix_dot(x, global_Standard_inverse(y));
}


function compute_u_global_Blocks_vec2() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}

function compute_global_Blocks_vec2() {
  return global_Matrix_scale_down(Pacioli.fetchValue('Blocks', 'vec'), global_Matrix_total(Pacioli.fetchValue('Blocks', 'vec')));
}

// for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c

u_global_Standard_negatives = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_negatives (x) {
    return global_Matrix_multiply(x, global_Matrix_negative_support(x));
}


function compute_u_global_Standard_pi() {
    return Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}

function compute_global_Standard_pi() {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 3.141592653589793]]);
}

// for_unit a: (a, a, a) -> a*Space!

u_global_Geometry_space_vec = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_space_vec (a,b,c) {
    return global_Matrix_sum(global_Matrix_sum(global_Matrix_scale(a, Pacioli.fetchValue('Geometry', 'd_x')), global_Matrix_scale(b, Pacioli.fetchValue('Geometry', 'd_y'))), global_Matrix_scale(c, Pacioli.fetchValue('Geometry', 'd_z')));
}


// for_index B: for_unit a: (B!a per B!a) -> B!a per B!a

u_global_Standard_kleene = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1), '_B_', new Pacioli.PowerProduct('_a_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_kleene (x) {
    return global_Standard_inverse(global_Matrix_minus(global_Matrix_left_identity(x), x));
}


// for_index C: for_unit a,b: (a*C!b) -> a*C!b per C!b

u_global_Standard_diagonal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1), '_C_', new Pacioli.PowerProduct('_b_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_diagonal (x) {
    return function (u) { return function (units) { return global_Matrix_multiply(global_Matrix_make_matrix(function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_add_mut(accu, global_Primitives_tuple(i, i, global_Matrix_get_num(x, i, Pacioli.fetchValue('Matrix', '_')))); }, global_Matrix_row_domain(x)); }(global_List_empty_list())), units); }(global_Matrix_scale(global_Matrix_unit_factor(u), global_Matrix_dim_div(u, u))); }(global_Standard_unit(x));
}


function compute_u_global_Standard_percent_conv() {
    return Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
}

function compute_global_Standard_percent_conv() {
  return Pacioli.conversionNumbers(Pacioli.scalarShape(Pacioli.unit('percent')));
}

// for_index D,E: for_unit a,b,c: (List(a*D!b per E!c)) -> a*D!b per E!c

u_global_Standard_list_sum = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1)))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_b_').expt(1), '_E_', new Pacioli.PowerProduct('_c_').expt(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_list_sum (x) {
    return global_List_fold_list(Pacioli.fetchValue('Matrix', 'sum'), x);
}


// for_index C,D: for_unit a,b: ((a) -> b, a*C! per D!) -> b*C! per D!

u_global_Standard_map_matrix = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_C_', Pacioli.unit(1), '_D_', Pacioli.unit(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_b_').expt(1), '_C_', Pacioli.unit(1), '_D_', Pacioli.unit(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Standard_map_matrix (fun,mat) {
    return global_Matrix_make_matrix(function (accu) { return global_List_loop_list(accu, function (accu,i) { return global_List_loop_list(accu, function (accu,j) { return global_List_add_mut(accu, global_Primitives_tuple(i, j, fun(global_Matrix_get(mat, i, j)))); }, global_Matrix_column_domain(mat)); }, global_Matrix_row_domain(mat)); }(global_List_empty_list()));
}


// for_unit a: (List(Tuple(a*Space!, a*Space!, a*Space!))) -> a^2

u_global_Geometry_surface_area = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("list", new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(2), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}


function global_Geometry_surface_area (surface) {
    return global_Standard_list_sum(function (accu) { return global_List_loop_list(accu, function (accu,x) { return global_List_add_mut(accu, global_Primitives_apply(Pacioli.fetchValue('Geometry', 'triangle_area'), x)); }, surface); }(global_List_empty_list()));
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




// via decl Space!


u_global_Geometry_d_z = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = Pacioli.createMatrixType(Pacioli.unit(1), new Pacioli.Type('coordinates', [Pacioli.fetchIndex('Geometry', 'Space')]).param, Pacioli.unit(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1));
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_index P,Q: for_unit a: (a*P! per Q!, P, Q) -> a


u_global_Matrix_get = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', Pacioli.unit(1), '_Q_', Pacioli.unit(1)), '_P_', '_Q_']), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1), new Pacioli.Type('coordinates', []).param, new Pacioli.PowerProduct(1))]);
    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));
}




// via decl for_type a: (a, a) -> Boole()


u_global_Primitives_equal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', '_a_']), new Pacioli.Type('boole')]);
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




// via decl for_type a: (Ref(a), a) -> Void()


u_global_Primitives_ref_set = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [new Pacioli.Type("reference", '_a_'), '_a_']), null]);
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




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v


u_global_Matrix_sum = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]);
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




// via decl for_type a: (a, a) -> Boole()


u_global_Primitives_not_equal = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", ['_a_', '_a_']), new Pacioli.Type('boole')]);
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




// via decl for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()


u_global_Matrix_less = function () {
    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));
    var type = new Pacioli.Type('function', [new Pacioli.Type("tuple", [Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1)), Pacioli.createMatrixType(new Pacioli.PowerProduct('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_u_').expt(1), '_Q_', new Pacioli.PowerProduct('_v_').expt(1))]), new Pacioli.Type('boole')]);
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



