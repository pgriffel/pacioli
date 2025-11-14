

Pacioli.compute_u_$graphics_parametric_plots_make_parametric_plot_options = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_parametric_plots_make_parametric_plot_options = function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) {
return Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_delta, 
lcl_scale_factor, 
lcl_show_parts, 
lcl_show_total, 
lcl_show_normals, 
lcl_wireframe, 
lcl_material, 
lcl_color, 
lcl_delta_color, 
lcl_normal_color);
}


Pacioli.compute_u_$graphics_parametric_plots_interval_lower = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_interval_lower = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_lower, lcl_upper) { return lcl_lower;}, 
lcl_record);
}


Pacioli.compute_u_$geometry_geometry_vector3d = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_vector3d = function (lcl_a, lcl_b, lcl_c) {
return Pacioli.$base_matrix_make_matrix(
[Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['x','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_'), 
lcl_a), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['y','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_'), 
lcl_b), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['z','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_'), 
lcl_c)]);
}


Pacioli.compute_u_$graphics_mesh_with_mesh_material = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_with_mesh_material = function (lcl_material, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_vertices, lcl_faces, lcl_optional_position, lcl_rotation, lcl_name, lcl_wireframe, lcl__) { return Pacioli.$base_base_tuple(
lcl_vertices, 
lcl_faces, 
lcl_optional_position, 
lcl_rotation, 
lcl_name, 
lcl_wireframe, 
lcl_material);}, 
lcl_record);
}


Pacioli.compute_u_$standard_matrix_inner = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(-1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$standard_matrix_inner = function (lcl_x, lcl_y) {
return Pacioli.$base_matrix_mmult(
Pacioli.$base_matrix_transpose(
lcl_x), 
lcl_y);
}


Pacioli.compute_u_$graphics_parametric_plots_interval_length = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_interval_length = function (lcl_interval) {
return Pacioli.$base_matrix_minus(
Pacioli.$graphics_parametric_plots_interval_upper(
lcl_interval), 
Pacioli.$graphics_parametric_plots_interval_lower(
lcl_interval));
}


Pacioli.compute_u_surfaces_make_center_spot_light = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.surfaces_make_center_spot_light = function (lcl_position, lcl_intensity) {
return Pacioli.$graphics_light_make_spotlight(
lcl_position, 
Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_position), 
Pacioli.$graphics_color_make_color(
"white"), 
lcl_intensity);
}


Pacioli.compute_u_$graphics_parametric_plots_surface_lines = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.typeFromVarName('_c_')), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.typeFromVarName('_c_')])]));
}

Pacioli.$graphics_parametric_plots_surface_lines = function (lcl_fun, lcl_range, lcl_n) {
return (function (lcl_u) { return (function (lcl_v) { return (function (lcl_du) { return (function (lcl_dv) { return (function (lcl_indices) { return Pacioli.$base_list_append(
(function (lcl__c_accu42) { return Pacioli.$base_list_loop_list(
lcl__c_accu42, 
function (lcl__c_accu42, lcl_i) { return (function (lcl_uu) { return Pacioli.$base_system__add_mut(
lcl__c_accu42, 
Pacioli.$graphics_parametric_plots_path(
lcl_fun, 
lcl_uu, 
lcl_v, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_du), 
lcl_dv, 
lcl_n));})(
Pacioli.$base_matrix_sum(
lcl_u, 
Pacioli.$base_matrix_multiply(
lcl_du, 
lcl_i)));}, 
lcl_indices);})(
Pacioli.$base_list_empty_list(
)), 
(function (lcl__c_accu44) { return Pacioli.$base_list_loop_list(
lcl__c_accu44, 
function (lcl__c_accu44, lcl_i) { return (function (lcl_vv) { return Pacioli.$base_system__add_mut(
lcl__c_accu44, 
Pacioli.$graphics_parametric_plots_path(
lcl_fun, 
lcl_u, 
lcl_vv, 
lcl_du, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_dv), 
lcl_n));})(
Pacioli.$base_matrix_sum(
lcl_v, 
Pacioli.$base_matrix_multiply(
lcl_dv, 
lcl_i)));}, 
lcl_indices);})(
Pacioli.$base_list_empty_list(
)));})(
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_height(
lcl_range), 
lcl_n));})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_width(
lcl_range), 
lcl_n));})(
Pacioli.$graphics_parametric_plots_range_vstart(
lcl_range));})(
Pacioli.$graphics_parametric_plots_range_ustart(
lcl_range));
}


Pacioli.compute_u_$graphics_mesh_default_mesh = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_default_mesh = function (lcl_vertices, lcl_faces) {
return Pacioli.$base_base_tuple(
lcl_vertices, 
lcl_faces, 
Pacioli.$base_base_nothing(
), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
"", 
false, 
"none");
}


Pacioli.compute_u_$graphics_parametric_plots_compute_deltas = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1))), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_h_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1))])]));
}

Pacioli.$graphics_parametric_plots_compute_deltas = function (lcl_fun, lcl_range, lcl_n, lcl_m, lcl_delta) {
return (function (lcl_u_start) { return (function (lcl_v_start) { return (function (lcl_u_step) { return (function (lcl_v_step) { return (function (lcl__c_accu48) { return (function (lcl_indices) { return Pacioli.$base_list_loop_list(
lcl__c_accu48, 
function (lcl__c_accu48, lcl_i) { return Pacioli.$base_list_loop_list(
lcl__c_accu48, 
function (lcl__c_accu48, lcl_j) { return ((Pacioli.$base_base_equal(
Pacioli.$base_matrix_mod(
lcl_i, 
lcl_m), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.$base_base_equal(
Pacioli.$base_matrix_mod(
lcl_j, 
lcl_m), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) : false ) ? (function (lcl_u) { return (function (lcl_v) { return (function (lcl_pos) { return (function (lcl_vu) { return (function (lcl_vv) { return Pacioli.$base_system__add_mut(
lcl__c_accu48, 
Pacioli.$base_base_tuple(
lcl_pos, 
lcl_vu, 
lcl_vv));})(
Pacioli.$base_matrix_minus(
(lcl_fun)(
lcl_u, 
Pacioli.$base_matrix_sum(
lcl_v, 
Pacioli.$base_matrix_multiply(
lcl_delta, 
Pacioli.$standard_matrix_unit(
lcl_v)))), 
lcl_pos));})(
Pacioli.$base_matrix_minus(
(lcl_fun)(
Pacioli.$base_matrix_sum(
lcl_u, 
Pacioli.$base_matrix_multiply(
lcl_delta, 
Pacioli.$standard_matrix_unit(
lcl_u))), 
lcl_v), 
lcl_pos));})(
(lcl_fun)(
lcl_u, 
lcl_v));})(
Pacioli.$base_matrix_sum(
lcl_v_start, 
Pacioli.$base_matrix_multiply(
lcl_v_step, 
lcl_j)));})(
Pacioli.$base_matrix_sum(
lcl_u_start, 
Pacioli.$base_matrix_multiply(
lcl_u_step, 
lcl_i))) : lcl__c_accu48 );}, 
lcl_indices);}, 
lcl_indices);})(
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_list_empty_list(
));})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_height(
lcl_range), 
lcl_n));})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_width(
lcl_range), 
lcl_n));})(
Pacioli.$graphics_parametric_plots_range_vstart(
lcl_range));})(
Pacioli.$graphics_parametric_plots_range_ustart(
lcl_range));
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_delta = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_delta = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_delta;}, 
lcl_record);
}


Pacioli.compute_u_surfaces_moebius_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1).mult(Pacioli.unitType('metre').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_moebius_scene = function (lcl_a, lcl_c, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return (function (lcl_u) { return (function (lcl_v) { return (function (lcl_du) { return (function (lcl_dv) { return (function (lcl_plot_path) { return (() => {
let lcl_scene;
lcl_scene = Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);
lcl_scene = (lcl_plot_path)(
lcl_u, 
lcl_v, 
lcl_du, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_dv), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
lcl_n), 
"orange", 
lcl_scene);
lcl_scene = (lcl_plot_path)(
lcl_u, 
Pacioli.$base_matrix_sum(
lcl_v, 
Pacioli.$base_matrix_multiply(
lcl_n, 
lcl_dv)), 
lcl_du, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_dv), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
lcl_n), 
"orange", 
lcl_scene);
lcl_scene = (lcl_plot_path)(
lcl_u, 
lcl_v, 
lcl_du, 
lcl_dv, 
lcl_n, 
"purple", 
lcl_scene);
lcl_scene = (lcl_plot_path)(
lcl_u, 
Pacioli.$base_matrix_sum(
lcl_v, 
Pacioli.$base_matrix_multiply(
lcl_n, 
lcl_dv)), 
lcl_du, 
Pacioli.$base_matrix_negative(
lcl_dv), 
lcl_n, 
"blue", 
lcl_scene);
return lcl_scene;


})();})(
function (lcl_u0, lcl_v0, lcl_du, lcl_dv, lcl_n, lcl_color, lcl_scene) { return (function (lcl_path_options) { return Pacioli.$graphics_parametric_plots_plot_parametric_path(
lcl_f, 
lcl_u0, 
lcl_v0, 
lcl_du, 
lcl_dv, 
lcl_path_options, 
lcl_scene);})(
Pacioli.$graphics_parametric_plots_make_parametric_plot_options(
lcl_n, 
lcl_m, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0.01]]), 
lcl_d, 
lcl_parts, 
lcl_total, 
lcl_normals, 
lcl_wireframe, 
Pacioli.fetchValue('surfaces', 'MATERIAL'), 
Pacioli.$graphics_color_make_color(
lcl_color), 
Pacioli.fetchValue('surfaces', 'DELTA_COLOR'), 
Pacioli.fetchValue('surfaces', 'NORMAL_COLOR')));});})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_height(
lcl_range), 
lcl_n));})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_width(
lcl_range), 
lcl_n));})(
Pacioli.$graphics_parametric_plots_range_vstart(
lcl_range));})(
Pacioli.$graphics_parametric_plots_range_ustart(
lcl_range));})(
(function (lcl_arrows) { return Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
(lcl_arrows ? lcl_parts : false ), 
(lcl_arrows ? lcl_total : false ), 
(lcl_arrows ? lcl_normals : false ));})(
(lcl_surface ? true : lcl_grid )));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.fetchValue('$standard_standard', 'pi'), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.fetchValue('$standard_standard', 'pi'), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_u, lcl_v) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_cos(
lcl_u)), 
Pacioli.$base_matrix_sum(
lcl_c, 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_divide(
lcl_u, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]))), 
lcl_v))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_sin(
lcl_u)), 
Pacioli.$base_matrix_sum(
lcl_c, 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_divide(
lcl_u, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]))), 
lcl_v))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_sin(
Pacioli.$base_matrix_divide(
lcl_u, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])))), 
lcl_v));});
}


Pacioli.compute_u_$graphics_scene_with_scene_lights = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_with_scene_lights = function (lcl_lights, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl_paths, lcl__, lcl_ambient_light, lcl_labels) { return Pacioli.$base_base_tuple(
lcl_description, 
lcl_arrows, 
lcl_meshes, 
lcl_paths, 
lcl_lights, 
lcl_ambient_light, 
lcl_labels);}, 
lcl_record);
}


Pacioli.compute_u_surfaces_circular_wave_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1).mult(Pacioli.unitType('metre').expt(-1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_circular_wave_scene = function (lcl_a, lcl_c, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_x, lcl_y) { return (function (lcl_r) { return Pacioli.$geometry_geometry_vector3d(
lcl_x, 
lcl_y, 
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_r, 
lcl_c))));})(
Pacioli.$base_matrix_sqrt(
Pacioli.$base_matrix_sum(
(function (lcl_multiply2) { return Pacioli.$base_matrix_multiply(
lcl_multiply2, 
lcl_multiply2);})(
lcl_x), 
(function (lcl_multiply3) { return Pacioli.$base_matrix_multiply(
lcl_multiply3, 
lcl_multiply3);})(
lcl_y))));});
}


Pacioli.compute_u_$graphics_mesh_set_wireframe = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_set_wireframe = function (lcl_mesh, lcl_status) {
return Pacioli.$graphics_mesh_with_mesh_wireframe(
lcl_status, 
lcl_mesh);
}


Pacioli.compute_u_surfaces_flower_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_flower_scene = function (lcl_a, lcl_b, lcl_c, lcl_k, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_u, lcl_v) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_b, 
lcl_v))), 
Pacioli.$base_matrix_expt(
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_c, 
lcl_u)), 
lcl_k)), 
Pacioli.$base_matrix_cos(
lcl_v)), 
Pacioli.$base_matrix_cos(
lcl_u)), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_b, 
lcl_v))), 
Pacioli.$base_matrix_expt(
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_c, 
lcl_u)), 
lcl_k)), 
Pacioli.$base_matrix_sin(
lcl_v)), 
Pacioli.$base_matrix_cos(
lcl_u)), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_b, 
lcl_v))), 
Pacioli.$base_matrix_expt(
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_c, 
lcl_u)), 
lcl_k)), 
Pacioli.$base_matrix_sin(
lcl_u)));});
}


Pacioli.compute_u_surfaces_alternative_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(-1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_alternative_scene = function (lcl_fun, lcl_a, lcl_b, lcl_c, lcl_options) {
return (function (lcl_f) { return (function (lcl_range) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 5]])));})(
function (lcl_u, lcl_v) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_sin(
Pacioli.$base_matrix_multiply(
lcl_u, 
Pacioli.$standard_matrix_atan(
Pacioli.$base_matrix_divide(
lcl_v, 
lcl_u))))), 
Pacioli.$base_matrix_sin(
Pacioli.$base_matrix_multiply(
lcl_v, 
Pacioli.$standard_matrix_atan(
Pacioli.$base_matrix_divide(
lcl_v, 
lcl_u))))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_b, 
Pacioli.$base_matrix_sin(
Pacioli.$base_matrix_multiply(
lcl_u, 
Pacioli.$standard_matrix_atan(
Pacioli.$base_matrix_divide(
lcl_v, 
lcl_u))))), 
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_v, 
Pacioli.$standard_matrix_atan(
Pacioli.$base_matrix_divide(
lcl_v, 
lcl_u))))), 
Pacioli.$base_matrix_multiply(
lcl_c, 
(lcl_fun)(
Pacioli.$base_matrix_multiply(
lcl_u, 
Pacioli.$standard_matrix_atan(
Pacioli.$base_matrix_divide(
lcl_v, 
lcl_u))))));});
}


Pacioli.compute_u_surfaces_alternative_cone_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_alternative_cone_scene = function (lcl_a, lcl_b, lcl_c, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return Pacioli.surfaces_alternative_scene(
Pacioli.fetchValue('$base_matrix', 'sin'), 
lcl_a, 
lcl_b, 
lcl_c, 
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));
}


Pacioli.compute_u_$graphics_parametric_plots_make_range2d = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.$graphics_parametric_plots_make_range2d = function (lcl_u, lcl_v) {
return Pacioli.$base_base_tuple(
lcl_u, 
lcl_v);
}


Pacioli.compute_u_$graphics_parametric_plots_interval_upper = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_interval_upper = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_lower, lcl_upper) { return lcl_upper;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_scene_scene_meshes = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_scene_scene_meshes = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl_paths, lcl_lights, lcl_ambient_light, lcl_labels) { return lcl_meshes;}, 
lcl_record);
}


Pacioli.compute_u_surfaces_simple_wave_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1).mult(Pacioli.unitType('metre').expt(-1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_simple_wave_scene = function (lcl_a, lcl_c, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_x, lcl_y) { return (function (lcl_r) { return Pacioli.$geometry_geometry_vector3d(
lcl_x, 
lcl_y, 
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_cos(
Pacioli.$base_matrix_multiply(
lcl_y, 
lcl_c))));})(
Pacioli.$base_matrix_sqrt(
Pacioli.$base_matrix_sum(
(function (lcl_multiply0) { return Pacioli.$base_matrix_multiply(
lcl_multiply0, 
lcl_multiply0);})(
lcl_x), 
(function (lcl_multiply1) { return Pacioli.$base_matrix_multiply(
lcl_multiply1, 
lcl_multiply1);})(
lcl_y))));});
}


Pacioli.compute_u_$graphics_parametric_plots_path_deltas = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1))), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_h_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), '_F_', Pacioli.unitFromVarName('_F!d_').expt(1), '_G_', Pacioli.unitFromVarName('_G!e_').expt(1))])]));
}

Pacioli.$graphics_parametric_plots_path_deltas = function (lcl_fun, lcl_u0, lcl_v0, lcl_du, lcl_dv, lcl_n, lcl_m, lcl_d) {
return (function (lcl__c_accu56) { return Pacioli.$base_list_loop_list(
lcl__c_accu56, 
function (lcl__c_accu56, lcl_i) { return (Pacioli.$base_base_equal(
Pacioli.$base_matrix_mod(
lcl_i, 
lcl_m), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? (function (lcl_u) { return (function (lcl_v) { return (function (lcl_pos) { return (function (lcl_vv) { return (function (lcl_vu) { return Pacioli.$base_system__add_mut(
lcl__c_accu56, 
Pacioli.$base_base_tuple(
lcl_pos, 
lcl_vv, 
lcl_vu));})(
Pacioli.$base_matrix_minus(
(lcl_fun)(
lcl_u, 
Pacioli.$base_matrix_sum(
lcl_v, 
Pacioli.$base_matrix_multiply(
lcl_d, 
Pacioli.$standard_matrix_unit(
lcl_v)))), 
lcl_pos));})(
Pacioli.$base_matrix_minus(
(lcl_fun)(
Pacioli.$base_matrix_sum(
lcl_u, 
Pacioli.$base_matrix_multiply(
lcl_d, 
Pacioli.$standard_matrix_unit(
lcl_u))), 
lcl_v), 
lcl_pos));})(
(lcl_fun)(
lcl_u, 
lcl_v));})(
Pacioli.$base_matrix_sum(
lcl_v0, 
Pacioli.$base_matrix_multiply(
lcl_dv, 
lcl_i)));})(
Pacioli.$base_matrix_sum(
lcl_u0, 
Pacioli.$base_matrix_multiply(
lcl_du, 
lcl_i))) : lcl__c_accu56 );}, 
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_show_total = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_show_total = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_show_total;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_path_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_parametric_plots_path_arrows = function (lcl_positions, lcl_color) {
return (function (lcl__c_accu54) { return Pacioli.$base_list_loop_list(
lcl__c_accu54, 
function (lcl__c_accu54, lcl__c_tup55) { return Pacioli.$base_base_apply(
function (lcl_pos, lcl_du) { return Pacioli.$base_system__add_mut(
lcl__c_accu54, 
Pacioli.$graphics_arrow_with_arrow_color(
lcl_color, 
Pacioli.$graphics_arrow_default_arrow(
lcl_pos, 
Pacioli.$base_matrix_minus(
lcl_du, 
lcl_pos))));}, 
lcl__c_tup55);}, 
Pacioli.$base_list_zip(
lcl_positions, 
Pacioli.$base_list_tail(
lcl_positions)));})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$graphics_scene_with_ambient_light = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_with_ambient_light = function (lcl_color, lcl_intensity, lcl_scene) {
return Pacioli.$graphics_scene_with_scene_ambient_light(
Pacioli.$base_base_tuple(
lcl_color, 
lcl_intensity), 
lcl_scene);
}


Pacioli.compute_u_$graphics_parametric_plots_range_width = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_range_width = function (lcl_range) {
return Pacioli.$graphics_parametric_plots_interval_length(
Pacioli.$graphics_parametric_plots_range2d_u(
lcl_range));
}


Pacioli.compute_u_$graphics_parametric_plots_total_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(-1).mult(Pacioli.unitFromVarName('_a_').expt(1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_parametric_plots_total_arrows = function (lcl_deltas, lcl_color, lcl_d) {
return (function (lcl__c_accu58) { return Pacioli.$base_list_loop_list(
lcl__c_accu58, 
function (lcl__c_accu58, lcl__c_tup59) { return Pacioli.$base_base_apply(
function (lcl_pos, lcl_du, lcl_dv) { return (function (lcl_arrow) { return Pacioli.$base_system__add_mut(
lcl__c_accu58, 
Pacioli.$graphics_arrow_with_arrow_color(
lcl_color, 
lcl_arrow));})(
Pacioli.$graphics_arrow_default_arrow(
lcl_pos, 
Pacioli.$base_matrix_scale(
lcl_d, 
Pacioli.$base_matrix_sum(
lcl_du, 
lcl_dv))));}, 
lcl__c_tup59);}, 
lcl_deltas);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$graphics_parametric_plots_range_vstart = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_range_vstart = function (lcl_range) {
return Pacioli.$graphics_parametric_plots_interval_lower(
Pacioli.$graphics_parametric_plots_range2d_v(
lcl_range));
}


Pacioli.compute_u_surfaces_make_zsquared = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.surfaces_make_zsquared = function (lcl_a, lcl_b, lcl_c) {
return Pacioli.$base_matrix_multiply(
Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_magnitude(
lcl_a), 
Pacioli.$base_matrix_magnitude(
lcl_b), 
Pacioli.$base_matrix_magnitude(
lcl_c)), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE)));
}


Pacioli.compute_u_surfaces_saddle_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_saddle_scene = function (lcl_a, lcl_b, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_u, lcl_v) { return Pacioli.surfaces_make_zsquared(
lcl_u, 
lcl_v, 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_multiply(
lcl_a, 
(function (lcl_multiply5) { return Pacioli.$base_matrix_multiply(
lcl_multiply5, 
lcl_multiply5);})(
lcl_u)), 
Pacioli.$base_matrix_multiply(
lcl_b, 
(function (lcl_multiply6) { return Pacioli.$base_matrix_multiply(
lcl_multiply6, 
lcl_multiply6);})(
lcl_v))));});
}


Pacioli.compute_u_$graphics_parametric_plots_plot_parametric_surface = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_parametric_plots_plot_parametric_surface = function (lcl_fun, lcl_range, lcl_options, lcl_scene) {
return (() => {
let lcl_mesh;
lcl_mesh = Pacioli.$graphics_parametric_plots_compute_surface_mesh(
lcl_fun, 
lcl_range, 
lcl_options);
lcl_mesh = Pacioli.$graphics_mesh_set_wireframe(
lcl_mesh, 
Pacioli.$graphics_parametric_plots_parametric_plot_options_wireframe(
lcl_options));
lcl_mesh = Pacioli.$graphics_mesh_with_mesh_material(
Pacioli.$graphics_parametric_plots_parametric_plot_options_material(
lcl_options), 
lcl_mesh);
return Pacioli.$graphics_scene_add_meshes(
[lcl_mesh], 
lcl_scene);


})();
}


Pacioli.compute_u_$graphics_parametric_plots_compute_surface_mesh = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_parametric_plots_compute_surface_mesh = function (lcl_fun, lcl_range, lcl_options) {
return (function (lcl_n) { return (function (lcl_color) { return (function (lcl_u0) { return (function (lcl_v0) { return (function (lcl_du) { return (function (lcl_dv) { return (function (lcl_indices) { return (function (lcl_vertices) { return (function (lcl_faces) { return Pacioli.$graphics_mesh_default_mesh(
lcl_vertices, 
lcl_faces);})(
(function (lcl__c_accu36) { return Pacioli.$base_list_loop_list(
lcl__c_accu36, 
function (lcl__c_accu36, lcl_i) { return Pacioli.$base_list_loop_list(
lcl__c_accu36, 
function (lcl__c_accu36, lcl_j) { return (function (lcl_k) { return Pacioli.$base_list_loop_list(
lcl__c_accu36, 
function (lcl__c_accu36, lcl_f) { return Pacioli.$base_system__add_mut(
lcl__c_accu36, 
lcl_f);}, 
[Pacioli.$graphics_mesh_face(
Pacioli.$base_matrix_sum(
lcl_k, 
lcl_i), 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
lcl_k, 
lcl_i), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
lcl_k, 
lcl_n), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_i)), 
Pacioli.$graphics_mesh_face(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
lcl_k, 
lcl_i), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
lcl_k, 
lcl_n), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_i), 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
lcl_k, 
lcl_n), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])), 
lcl_i))]);})(
Pacioli.$base_matrix_multiply(
lcl_j, 
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));}, 
Pacioli.$base_list_naturals(
lcl_n));}, 
Pacioli.$base_list_naturals(
lcl_n));})(
Pacioli.$base_list_empty_list(
)));})(
(function (lcl__c_accu38) { return Pacioli.$base_list_loop_list(
lcl__c_accu38, 
function (lcl__c_accu38, lcl_i) { return Pacioli.$base_list_loop_list(
lcl__c_accu38, 
function (lcl__c_accu38, lcl_j) { return (function (lcl_u) { return (function (lcl_v) { return Pacioli.$base_system__add_mut(
lcl__c_accu38, 
Pacioli.$graphics_mesh_vertex(
(lcl_fun)(
lcl_u, 
lcl_v), 
lcl_color));})(
Pacioli.$base_matrix_sum(
lcl_v0, 
Pacioli.$base_matrix_multiply(
lcl_j, 
lcl_dv)));})(
Pacioli.$base_matrix_sum(
lcl_u0, 
Pacioli.$base_matrix_multiply(
lcl_i, 
lcl_du)));}, 
lcl_indices);}, 
lcl_indices);})(
Pacioli.$base_list_empty_list(
)));})(
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_height(
lcl_range), 
lcl_n));})(
Pacioli.$base_matrix_divide(
Pacioli.$graphics_parametric_plots_range_width(
lcl_range), 
lcl_n));})(
Pacioli.$graphics_parametric_plots_range_vstart(
lcl_range));})(
Pacioli.$graphics_parametric_plots_range_ustart(
lcl_range));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_color(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_n(
lcl_options));
}


Pacioli.compute_u_$graphics_parametric_plots_make_interval = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$graphics_parametric_plots_make_interval = function (lcl_lower, lcl_upper) {
return Pacioli.$base_base_tuple(
lcl_lower, 
lcl_upper);
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_scale_factor = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_scale_factor = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_scale_factor;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_partial_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(-1).mult(Pacioli.unitFromVarName('_a_').expt(1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_parametric_plots_partial_arrows = function (lcl_deltas, lcl_color, lcl_d) {
return (function (lcl__c_accu60) { return Pacioli.$base_list_loop_list(
lcl__c_accu60, 
function (lcl__c_accu60, lcl__c_tup61) { return Pacioli.$base_base_apply(
function (lcl_pos, lcl_du, lcl_dv) { return Pacioli.$base_list_loop_list(
lcl__c_accu60, 
function (lcl__c_accu60, lcl_arrow) { return Pacioli.$base_system__add_mut(
lcl__c_accu60, 
Pacioli.$graphics_arrow_with_arrow_color(
lcl_color, 
lcl_arrow));}, 
[Pacioli.$graphics_arrow_default_arrow(
lcl_pos, 
Pacioli.$base_matrix_scale(
lcl_d, 
lcl_du)), 
Pacioli.$graphics_arrow_default_arrow(
lcl_pos, 
Pacioli.$base_matrix_scale(
lcl_d, 
lcl_dv))]);}, 
lcl__c_tup61);}, 
lcl_deltas);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$graphics_mesh_vertex = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_vertex = function (lcl_vec, lcl_color) {
return Pacioli.$base_base_tuple(
lcl_vec, 
lcl_color);
}


Pacioli.compute_u_$graphics_mesh_face = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$graphics_mesh_face = function (lcl_i, lcl_j, lcl_k) {
return Pacioli.$base_base_tuple(
lcl_i, 
lcl_j, 
lcl_k);
}


Pacioli.compute_u_$graphics_parametric_plots_plot_parametric_surface_deltas = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_parametric_plots_plot_parametric_surface_deltas = function (lcl_fun, lcl_range, lcl_options, lcl_scene) {
return (function (lcl_n) { return (function (lcl_m) { return (function (lcl_d) { return (function (lcl_delta) { return (function (lcl_deltas) { return (() => {
let lcl_new_scene;
lcl_new_scene = lcl_scene;
lcl_new_scene = Pacioli.$graphics_parametric_plots_plot_delta_arrows(
lcl_deltas, 
lcl_options, 
lcl_new_scene);
return lcl_new_scene;


})();})(
Pacioli.$graphics_parametric_plots_compute_deltas(
lcl_fun, 
lcl_range, 
lcl_n, 
lcl_m, 
lcl_delta));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_delta(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_scale_factor(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_m(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_n(
lcl_options));
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_wireframe = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_wireframe = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_wireframe;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_mesh_with_mesh_wireframe = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_with_mesh_wireframe = function (lcl_wireframe, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_vertices, lcl_faces, lcl_optional_position, lcl_rotation, lcl_name, lcl__, lcl_material) { return Pacioli.$base_base_tuple(
lcl_vertices, 
lcl_faces, 
lcl_optional_position, 
lcl_rotation, 
lcl_name, 
lcl_wireframe, 
lcl_material);}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_range_height = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_range_height = function (lcl_range) {
return Pacioli.$graphics_parametric_plots_interval_length(
Pacioli.$graphics_parametric_plots_range2d_v(
lcl_range));
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_material = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("String", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_material = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_material;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_delta_color = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("String", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_delta_color = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_delta_color;}, 
lcl_record);
}


Pacioli.compute_u_surfaces_plane_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_plane_scene = function (lcl_a, lcl_b, lcl_c, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_x, lcl_y) { return Pacioli.$geometry_geometry_vector3d(
lcl_x, 
lcl_y, 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
lcl_a, 
Pacioli.$base_matrix_multiply(
lcl_b, 
lcl_x)), 
Pacioli.$base_matrix_multiply(
lcl_c, 
lcl_y)));});
}


Pacioli.compute_u_$graphics_arrow_with_arrow_color = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_arrow_with_arrow_color = function (lcl_color, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_src, lcl_dst, lcl_name, lcl_label, lcl__) { return Pacioli.$base_base_tuple(
lcl_src, 
lcl_dst, 
lcl_name, 
lcl_label, 
lcl_color);}, 
lcl_record);
}


Pacioli.compute_u_$graphics_scene_with_scene_meshes = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_with_scene_meshes = function (lcl_meshes, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl__, lcl_paths, lcl_lights, lcl_ambient_light, lcl_labels) { return Pacioli.$base_base_tuple(
lcl_description, 
lcl_arrows, 
lcl_meshes, 
lcl_paths, 
lcl_lights, 
lcl_ambient_light, 
lcl_labels);}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_range_ustart = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_range_ustart = function (lcl_range) {
return Pacioli.$graphics_parametric_plots_interval_lower(
Pacioli.$graphics_parametric_plots_range2d_u(
lcl_range));
}


Pacioli.compute_u_$graphics_scene_with_scene_ambient_light = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_with_scene_ambient_light = function (lcl_ambient_light, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl_paths, lcl_lights, lcl__, lcl_labels) { return Pacioli.$base_base_tuple(
lcl_description, 
lcl_arrows, 
lcl_meshes, 
lcl_paths, 
lcl_lights, 
lcl_ambient_light, 
lcl_labels);}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_normal_color = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("String", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_normal_color = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_normal_color;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_range2d_v = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$graphics_parametric_plots_range2d_v = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_u, lcl_v) { return lcl_v;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_scene_add_paths = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_add_paths = function (lcl_ps, lcl_scene) {
return Pacioli.$graphics_scene_with_scene_paths(
Pacioli.$base_list_append(
lcl_ps, 
Pacioli.$graphics_scene_scene_paths(
lcl_scene)), 
lcl_scene);
}


Pacioli.compute_u_$geometry_geometry_cross = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_cross = function (lcl_v, lcl_w) {
return (function (lcl_vx) { return (function (lcl_vy) { return (function (lcl_vz) { return (function (lcl_wx) { return (function (lcl_wy) { return (function (lcl_wz) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_minus(
Pacioli.$base_matrix_multiply(
lcl_vy, 
lcl_wz), 
Pacioli.$base_matrix_multiply(
lcl_vz, 
lcl_wy)), 
Pacioli.$base_matrix_minus(
Pacioli.$base_matrix_multiply(
lcl_vz, 
lcl_wx), 
Pacioli.$base_matrix_multiply(
lcl_vx, 
lcl_wz)), 
Pacioli.$base_matrix_minus(
Pacioli.$base_matrix_multiply(
lcl_vx, 
lcl_wy), 
Pacioli.$base_matrix_multiply(
lcl_vy, 
lcl_wx)));})(
Pacioli.$base_matrix_get(
lcl_w, 
Pacioli.createCoordinates([['z','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_')));})(
Pacioli.$base_matrix_get(
lcl_w, 
Pacioli.createCoordinates([['y','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_')));})(
Pacioli.$base_matrix_get(
lcl_w, 
Pacioli.createCoordinates([['x','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_')));})(
Pacioli.$base_matrix_get(
lcl_v, 
Pacioli.createCoordinates([['z','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_')));})(
Pacioli.$base_matrix_get(
lcl_v, 
Pacioli.createCoordinates([['y','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_')));})(
Pacioli.$base_matrix_get(
lcl_v, 
Pacioli.createCoordinates([['x','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_')));
}


Pacioli.compute_u_$graphics_parametric_plots_plot_parametric_path = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_parametric_plots_plot_parametric_path = function (lcl_fun, lcl_u0, lcl_v0, lcl_du, lcl_dv, lcl_options, lcl_scene) {
return (function (lcl_n) { return (function (lcl_m) { return (function (lcl_delta) { return (function (lcl_color) { return (function (lcl_deltas) { return (() => {
let lcl_new_scene;
lcl_new_scene = Pacioli.$graphics_scene_add_arrows(
Pacioli.$graphics_parametric_plots_path_arrows(
(function (lcl__c_accu50) { return Pacioli.$base_list_loop_list(
lcl__c_accu50, 
function (lcl__c_accu50, lcl__c_tup51) { return Pacioli.$base_base_apply(
function (lcl_pos, lcl__52, lcl__53) { return Pacioli.$base_system__add_mut(
lcl__c_accu50, 
lcl_pos);}, 
lcl__c_tup51);}, 
lcl_deltas);})(
Pacioli.$base_list_empty_list(
)), 
lcl_color), 
lcl_scene);
lcl_new_scene = (function (lcl_deltas2) { return Pacioli.$graphics_parametric_plots_plot_delta_arrows(
lcl_deltas2, 
lcl_options, 
lcl_new_scene);})(
(Pacioli.$base_base_equal(
lcl_m, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])) ? lcl_deltas : Pacioli.$graphics_parametric_plots_path_deltas(
lcl_fun, 
lcl_u0, 
lcl_v0, 
lcl_du, 
lcl_dv, 
lcl_n, 
lcl_m, 
lcl_delta) ));
return lcl_new_scene;


})();})(
Pacioli.$graphics_parametric_plots_path_deltas(
lcl_fun, 
lcl_u0, 
lcl_v0, 
lcl_du, 
lcl_dv, 
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
lcl_delta));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_color(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_delta(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_m(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_n(
lcl_options));
}


Pacioli.compute_u_$graphics_scene_scene_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_scene_scene_arrows = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl_paths, lcl_lights, lcl_ambient_light, lcl_labels) { return lcl_arrows;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_scene_add_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_add_arrows = function (lcl_vs, lcl_scene) {
return Pacioli.$graphics_scene_with_scene_arrows(
Pacioli.$base_list_append(
lcl_vs, 
Pacioli.$graphics_scene_scene_arrows(
lcl_scene)), 
lcl_scene);
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_show_normals = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_show_normals = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_show_normals;}, 
lcl_record);
}


Pacioli.compute_u_$standard_matrix_unit = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1)));
}

Pacioli.$standard_matrix_unit = function (lcl_A) {
return Pacioli.$base_matrix_scale(
Pacioli.$base_matrix_scalar_unit(
lcl_A), 
Pacioli.$base_matrix_dim_div(
Pacioli.$base_matrix_row_unit(
lcl_A), 
Pacioli.$base_matrix_column_unit(
lcl_A)));
}


Pacioli.compute_u_surfaces_paraboloid_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitVectorType('$geometry_geometry', 'Geom3_zsquared', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_paraboloid_scene = function (lcl_a, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_u, lcl_v) { return Pacioli.surfaces_make_zsquared(
Pacioli.$base_matrix_multiply(
lcl_u, 
Pacioli.$base_matrix_cos(
lcl_v)), 
Pacioli.$base_matrix_multiply(
lcl_u, 
Pacioli.$base_matrix_sin(
lcl_v)), 
Pacioli.$base_matrix_multiply(
lcl_a, 
(function (lcl_multiply4) { return Pacioli.$base_matrix_multiply(
lcl_multiply4, 
lcl_multiply4);})(
lcl_u)));});
}


Pacioli.compute_u_$geometry_geometry_cross_sqrt = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_cross_sqrt = function (lcl_v, lcl_w) {
return Pacioli.$base_matrix_scale_down(
Pacioli.$geometry_geometry_cross(
lcl_v, 
lcl_w), 
Pacioli.$base_matrix_sqrt(
Pacioli.$base_matrix_multiply(
Pacioli.$standard_matrix_norm(
lcl_v), 
Pacioli.$standard_matrix_norm(
lcl_w))));
}


Pacioli.compute_u_$graphics_color_make_color = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("String", []));
}

Pacioli.$graphics_color_make_color = function (lcl_color) {
return lcl_color;
}


Pacioli.compute_u_surfaces_build_example_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_build_example_scene = function (lcl_fun, lcl_range, lcl_options) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) { return (function (lcl_plot_options) { return (function (lcl_light_sources) { return (function (lcl_uom) { return (function (lcl_lights) { return (() => {
let lcl_scene;
lcl_scene = Pacioli.$graphics_scene_empty_scene(
"surface parametrization");
lcl_scene = Pacioli.$graphics_scene_with_ambient_light(
"white", 
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
lcl_scene);
lcl_scene = Pacioli.$graphics_scene_add_spotlights(
lcl_lights, 
lcl_scene);
if (lcl_surface) {
lcl_scene = Pacioli.$graphics_parametric_plots_plot_parametric_surface(
lcl_fun, 
lcl_range, 
lcl_plot_options, 
lcl_scene);

} else {
Pacioli.$base_system__skip(
)
}

if (lcl_grid) {
lcl_scene = Pacioli.$graphics_parametric_plots_plot_parametric_surface_grid(
lcl_fun, 
lcl_range, 
lcl_plot_options, 
lcl_scene);

} else {
Pacioli.$base_system__skip(
)
}

if (((lcl_parts ? true : lcl_total ) ? true : lcl_normals )) {
lcl_scene = Pacioli.$graphics_parametric_plots_plot_parametric_surface_deltas(
lcl_fun, 
lcl_range, 
lcl_plot_options, 
lcl_scene);

} else {
Pacioli.$base_system__skip(
)
}

return lcl_scene;


})();})(
(function (lcl__c_accu64) { return Pacioli.$base_list_loop_list(
lcl__c_accu64, 
function (lcl__c_accu64, lcl_vec) { return Pacioli.$base_system__add_mut(
lcl__c_accu64, 
Pacioli.surfaces_make_center_spot_light(
Pacioli.$base_matrix_multiply(
lcl_vec, 
lcl_uom), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 1000]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));}, 
lcl_light_sources);})(
Pacioli.$base_list_empty_list(
)));})(
Pacioli.$standard_matrix_unit(
(lcl_fun)(
Pacioli.$graphics_parametric_plots_range_ustart(
lcl_range), 
Pacioli.$graphics_parametric_plots_range_vstart(
lcl_range))));})(
[Pacioli.$geometry_geometry_vector3d(
Pacioli.initialNumbers(1, 1, [[0, 0, 50]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 50]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 50]])), 
Pacioli.$geometry_geometry_vector3d(
Pacioli.initialNumbers(1, 1, [[0, 0, 50]]), 
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 50]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 50]])), 
Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 50]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 50]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 50]])), 
Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 50]])), 
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 50]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 50]]))]);})(
Pacioli.$graphics_parametric_plots_make_parametric_plot_options(
lcl_n, 
lcl_m, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0.01]]), 
lcl_d, 
lcl_parts, 
lcl_total, 
lcl_normals, 
lcl_wireframe, 
Pacioli.fetchValue('surfaces', 'MATERIAL'), 
Pacioli.fetchValue('surfaces', 'LINE_COLOR'), 
Pacioli.fetchValue('surfaces', 'DELTA_COLOR'), 
Pacioli.fetchValue('surfaces', 'NORMAL_COLOR')));}, 
lcl_options);
}


Pacioli.compute_u_$standard_matrix_atan = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, '_Q_', Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), '_P_', Pacioli.ONE, '_Q_', Pacioli.ONE));
}

Pacioli.$standard_matrix_atan = function (lcl_x) {
return Pacioli.$base_matrix_scale(
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)), 
Pacioli.$base_system__atan(
lcl_x));
}


Pacioli.compute_u_surfaces_ellipsoid_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_ellipsoid_scene = function (lcl_a, lcl_b, lcl_c, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_fun) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_fun, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.fetchValue('$standard_standard', 'pi'), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_u, lcl_v) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_a, 
Pacioli.$base_matrix_sin(
lcl_u)), 
Pacioli.$base_matrix_cos(
lcl_v)), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_b, 
Pacioli.$base_matrix_sin(
lcl_u)), 
Pacioli.$base_matrix_sin(
lcl_v)), 
Pacioli.$base_matrix_multiply(
lcl_c, 
Pacioli.$base_matrix_cos(
lcl_u)));});
}


Pacioli.compute_u_$graphics_light_make_spotlight = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$graphics_light_make_spotlight = function (lcl_position, lcl_targte, lcl_color, lcl_intensity) {
return Pacioli.$base_base_tuple(
lcl_position, 
lcl_targte, 
lcl_color, 
lcl_intensity);
}


Pacioli.compute_u_$graphics_scene_scene_lights = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.$graphics_scene_scene_lights = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl_paths, lcl_lights, lcl_ambient_light, lcl_labels) { return lcl_lights;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_compute_surface_lines = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_parametric_plots_compute_surface_lines = function (lcl_fun, lcl_range, lcl_options) {
return (function (lcl_n) { return (function (lcl_color) { return (function (lcl__c_accu40) { return Pacioli.$base_list_loop_list(
lcl__c_accu40, 
function (lcl__c_accu40, lcl_lines) { return Pacioli.$base_system__add_mut(
lcl__c_accu40, 
Pacioli.$graphics_path_make_path(
lcl_lines, 
lcl_color));}, 
Pacioli.$graphics_parametric_plots_surface_lines(
lcl_fun, 
lcl_range, 
lcl_n));})(
Pacioli.$base_list_empty_list(
));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_color(
lcl_options));})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_n(
lcl_options));
}


Pacioli.compute_u_$graphics_parametric_plots_range2d_u = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$graphics_parametric_plots_range2d_u = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_u, lcl_v) { return lcl_u;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_color = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("String", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_color = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_color;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_scene_scene_paths = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_scene_scene_paths = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl_paths, lcl_lights, lcl_ambient_light, lcl_labels) { return lcl_paths;}, 
lcl_record);
}


Pacioli.compute_u_surfaces_cone_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_cone_scene = function (lcl_h, lcl_r, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_f) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_f, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_h), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
lcl_h), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_u, lcl_v) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_multiply(
lcl_r, 
Pacioli.$base_matrix_minus(
lcl_h, 
lcl_u)), 
lcl_h), 
Pacioli.$base_matrix_cos(
lcl_v)), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_multiply(
lcl_r, 
Pacioli.$base_matrix_minus(
lcl_h, 
lcl_u)), 
lcl_h), 
Pacioli.$base_matrix_sin(
lcl_v)), 
Pacioli.$base_matrix_minus(
lcl_u, 
lcl_h));});
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_n = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_n = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_n;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_scene_add_spotlights = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_add_spotlights = function (lcl_ls, lcl_scene) {
return Pacioli.$graphics_scene_with_scene_lights(
Pacioli.$base_list_append(
lcl_ls, 
Pacioli.$graphics_scene_scene_lights(
lcl_scene)), 
lcl_scene);
}


Pacioli.compute_u_$graphics_parametric_plots_plot_delta_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_parametric_plots_plot_delta_arrows = function (lcl_deltas, lcl_options, lcl_scene) {
return (function (lcl_d) { return (() => {
let lcl_new_scene;
lcl_new_scene = lcl_scene;
if (Pacioli.$graphics_parametric_plots_parametric_plot_options_show_normals(
lcl_options)) {
lcl_new_scene = Pacioli.$graphics_scene_add_arrows(
Pacioli.$graphics_parametric_plots_normal_arrows(
lcl_deltas, 
Pacioli.$graphics_parametric_plots_parametric_plot_options_normal_color(
lcl_options), 
lcl_d), 
lcl_new_scene);

} else {
Pacioli.$base_system__skip(
)
}

if (Pacioli.$graphics_parametric_plots_parametric_plot_options_show_parts(
lcl_options)) {
lcl_new_scene = Pacioli.$graphics_scene_add_arrows(
Pacioli.$graphics_parametric_plots_partial_arrows(
lcl_deltas, 
Pacioli.$graphics_parametric_plots_parametric_plot_options_delta_color(
lcl_options), 
lcl_d), 
lcl_new_scene);

} else {
Pacioli.$base_system__skip(
)
}

if (Pacioli.$graphics_parametric_plots_parametric_plot_options_show_total(
lcl_options)) {
lcl_new_scene = Pacioli.$graphics_scene_add_arrows(
Pacioli.$graphics_parametric_plots_total_arrows(
lcl_deltas, 
Pacioli.$graphics_parametric_plots_parametric_plot_options_delta_color(
lcl_options), 
lcl_d), 
lcl_new_scene);

} else {
Pacioli.$base_system__skip(
)
}

return lcl_new_scene;


})();})(
Pacioli.$graphics_parametric_plots_parametric_plot_options_scale_factor(
lcl_options));
}


Pacioli.compute_u_$graphics_path_make_path = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_path_make_path = function (lcl_points, lcl_color) {
return Pacioli.$base_base_tuple(
lcl_points, 
lcl_color);
}


Pacioli.compute_u_$graphics_parametric_plots_normal_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!d_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_e_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!f_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_parametric_plots_normal_arrows = function (lcl_deltas, lcl_color, lcl_d) {
return (function (lcl__c_accu62) { return Pacioli.$base_list_loop_list(
lcl__c_accu62, 
function (lcl__c_accu62, lcl__c_tup63) { return Pacioli.$base_base_apply(
function (lcl_pos, lcl_du, lcl_dv) { return (function (lcl_arrow) { return Pacioli.$base_system__add_mut(
lcl__c_accu62, 
Pacioli.$graphics_arrow_with_arrow_color(
lcl_color, 
lcl_arrow));})(
Pacioli.$graphics_arrow_default_arrow(
lcl_pos, 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_scale(
lcl_d, 
Pacioli.$geometry_geometry_cross_sqrt(
Pacioli.$base_matrix_magnitude(
lcl_du), 
Pacioli.$base_matrix_magnitude(
lcl_dv))), 
Pacioli.$standard_matrix_unit(
lcl_pos))));}, 
lcl__c_tup63);}, 
lcl_deltas);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_surfaces_torus_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_torus_scene = function (lcl_major, lcl_minor, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return (function (lcl_fun) { return (function (lcl_range) { return (function (lcl_options) { return Pacioli.surfaces_build_example_scene(
lcl_fun, 
lcl_range, 
lcl_options);})(
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));})(
Pacioli.$graphics_parametric_plots_make_range(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));})(
function (lcl_u, lcl_v) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_sum(
lcl_major, 
Pacioli.$base_matrix_multiply(
lcl_minor, 
Pacioli.$base_matrix_cos(
lcl_u))), 
Pacioli.$base_matrix_sin(
lcl_v)), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_sum(
lcl_major, 
Pacioli.$base_matrix_multiply(
lcl_minor, 
Pacioli.$base_matrix_cos(
lcl_u))), 
Pacioli.$base_matrix_cos(
lcl_v)), 
Pacioli.$base_matrix_multiply(
lcl_minor, 
Pacioli.$base_matrix_sin(
lcl_u)));});
}


Pacioli.compute_u_$graphics_parametric_plots_path = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.typeFromVarName('_c_')), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.typeFromVarName('_c_')]));
}

Pacioli.$graphics_parametric_plots_path = function (lcl_fun, lcl_u0, lcl_v0, lcl_du, lcl_dv, lcl_n) {
return (function (lcl__c_accu46) { return Pacioli.$base_list_loop_list(
lcl__c_accu46, 
function (lcl__c_accu46, lcl_i) { return (function (lcl_u) { return (function (lcl_v) { return Pacioli.$base_system__add_mut(
lcl__c_accu46, 
(lcl_fun)(
lcl_u, 
lcl_v));})(
Pacioli.$base_matrix_sum(
lcl_v0, 
Pacioli.$base_matrix_multiply(
lcl_dv, 
lcl_i)));})(
Pacioli.$base_matrix_sum(
lcl_u0, 
Pacioli.$base_matrix_multiply(
lcl_du, 
lcl_i)));}, 
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$standard_matrix_norm = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$standard_matrix_norm = function (lcl_x) {
return Pacioli.$base_matrix_sqrt(
Pacioli.$standard_matrix_inner(
lcl_x, 
lcl_x));
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_m = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_m = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_m;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_scene_with_scene_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_with_scene_arrows = function (lcl_arrows, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl__, lcl_meshes, lcl_paths, lcl_lights, lcl_ambient_light, lcl_labels) { return Pacioli.$base_base_tuple(
lcl_description, 
lcl_arrows, 
lcl_meshes, 
lcl_paths, 
lcl_lights, 
lcl_ambient_light, 
lcl_labels);}, 
lcl_record);
}


Pacioli.compute_u_$graphics_arrow_default_arrow = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_arrow_default_arrow = function (lcl_src, lcl_dst) {
return Pacioli.$base_base_tuple(
lcl_src, 
lcl_dst, 
"", 
"", 
Pacioli.fetchValue('$graphics_arrow', 'default_arrow_color'));
}


Pacioli.compute_u_$graphics_scene_add_meshes = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_add_meshes = function (lcl_ms, lcl_scene) {
return Pacioli.$graphics_scene_with_scene_meshes(
Pacioli.$base_list_append(
lcl_ms, 
Pacioli.$graphics_scene_scene_meshes(
lcl_scene)), 
lcl_scene);
}


Pacioli.compute_u_$graphics_scene_with_scene_paths = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_with_scene_paths = function (lcl_paths, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl__, lcl_lights, lcl_ambient_light, lcl_labels) { return Pacioli.$base_base_tuple(
lcl_description, 
lcl_arrows, 
lcl_meshes, 
lcl_paths, 
lcl_lights, 
lcl_ambient_light, 
lcl_labels);}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_parametric_plot_options_show_parts = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$graphics_parametric_plots_parametric_plot_options_show_parts = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_n, lcl_m, lcl_delta, lcl_scale_factor, lcl_show_parts, lcl_show_total, lcl_show_normals, lcl_wireframe, lcl_material, lcl_color, lcl_delta_color, lcl_normal_color) { return lcl_show_parts;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_parametric_plots_make_range = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.$graphics_parametric_plots_make_range = function (lcl_a, lcl_b, lcl_c, lcl_d) {
return Pacioli.$graphics_parametric_plots_make_range2d(
Pacioli.$graphics_parametric_plots_make_interval(
lcl_a, 
lcl_b), 
Pacioli.$graphics_parametric_plots_make_interval(
lcl_c, 
lcl_d));
}


Pacioli.compute_u_surfaces_alternative_sphere_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.surfaces_alternative_sphere_scene = function (lcl_a, lcl_b, lcl_c, lcl_n, lcl_m, lcl_d, lcl_grid, lcl_surface, lcl_wireframe, lcl_parts, lcl_total, lcl_normals) {
return Pacioli.surfaces_alternative_scene(
Pacioli.fetchValue('$base_matrix', 'cos'), 
lcl_a, 
lcl_b, 
lcl_c, 
Pacioli.$base_base_tuple(
lcl_n, 
lcl_m, 
lcl_d, 
lcl_grid, 
lcl_surface, 
lcl_wireframe, 
lcl_parts, 
lcl_total, 
lcl_normals));
}


Pacioli.compute_u_$graphics_parametric_plots_plot_parametric_surface_grid = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_c_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_parametric_plots_plot_parametric_surface_grid = function (lcl_fun, lcl_range, lcl_options, lcl_scene) {
return Pacioli.$graphics_scene_add_paths(
Pacioli.$graphics_parametric_plots_compute_surface_lines(
lcl_fun, 
lcl_range, 
lcl_options), 
lcl_scene);
}


Pacioli.compute_u_$graphics_scene_empty_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.$graphics_scene_empty_scene = function (lcl_description) {
return Pacioli.$base_base_tuple(
lcl_description, 
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
"white", 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
Pacioli.$base_list_empty_list(
));
}
Pacioli.compute_sbase_mole = function () { return {symbol: "mol"}};
Pacioli.compute_sbase_gram = function () { return {symbol: "g"}};
Pacioli.compute_sbase_ampere = function () { return {symbol: "A"}};
Pacioli.compute_sbase_metre = function () { return {symbol: "m"}};
Pacioli.compute_sbase_percent = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.01, Pacioli.ONE), symbol: "%"}
}

Pacioli.compute_index_$geometry_geometry_Geom3 = function () {return Pacioli.makeIndexSet('index_$geometry_geometry_Geom3', 'Geom3', [ "x","y","z" ])}
Pacioli.compute_sbase_candela = function () { return {symbol: "cd"}};

Pacioli.compute_index_$base_matrix_One = function () {return Pacioli.makeIndexSet('index_$base_matrix_One', 'One', [ "_" ])}
Pacioli.compute_sbase_second = function () { return {symbol: "s"}};
Pacioli.compute_sbase_hertz = function () { return {symbol: "Hz"}};
Pacioli.compute_sbase_kelvin = function () { return {symbol: "K"}};

Pacioli.compute_index_$geometry_geometry_Geom2 = function () {return Pacioli.makeIndexSet('index_$geometry_geometry_Geom2', 'Geom2', [ "x","y" ])}
Pacioli.compute_sbase_decimals = function () { return {symbol: "decs"}};
Pacioli.compute_sbase_radian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: "rad"}
}
Pacioli.compute_vbase_$geometry_geometry_Geom3_zsquared = function () { return {units: { 'x': Pacioli.unitType('metre').expt(1), 'y': Pacioli.unitType('metre').expt(1), 'z': Pacioli.unitType('metre').expt(2) }}};

Pacioli.compute_u_$standard_standard_pi = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_$standard_standard_pi = function () {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 3.141592653589793]]);
}

Pacioli.compute_u_surfaces_MATERIAL = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_surfaces_MATERIAL = function () {
  return "Normal";
}

Pacioli.compute_u_surfaces_LINE_COLOR = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_surfaces_LINE_COLOR = function () {
  return Pacioli.$graphics_color_make_color(
"steelblue");
}

Pacioli.compute_u_$base_matrix__ = function () {
    return new Pacioli.IndexType([]);
}
Pacioli.compute_$base_matrix__ = function () {
  return Pacioli.createCoordinates([]);
}

Pacioli.compute_u_surfaces_NORMAL_COLOR = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_surfaces_NORMAL_COLOR = function () {
  return Pacioli.$graphics_color_make_color(
"green");
}

Pacioli.compute_u_$graphics_arrow_default_arrow_color = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_$graphics_arrow_default_arrow_color = function () {
  return Pacioli.$graphics_color_make_color(
"blue");
}

Pacioli.compute_u_surfaces_PATH_COLOR = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_surfaces_PATH_COLOR = function () {
  return Pacioli.$graphics_color_make_color(
"red");
}

Pacioli.compute_u_surfaces_DELTA_COLOR = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_surfaces_DELTA_COLOR = function () {
  return Pacioli.$graphics_color_make_color(
"red");
}
