

Pacioli.compute_u_graphics_my_scene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]));
}

Pacioli.graphics_my_scene = function () {
return (function (lcl_arrow1) { return (function (lcl_arrow2) { return Pacioli.$graphics_scene_add_arrows(
[lcl_arrow1, 
lcl_arrow2], 
Pacioli.$graphics_scene_empty_scene(
"My 3Dscene"));})(
Pacioli.$graphics_arrow_default_arrow(
Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))));})(
Pacioli.$graphics_arrow_origin_arrow(
Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))));
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


Pacioli.compute_u_$graphics_arrow_origin_arrow = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_arrow_origin_arrow = function (lcl_vector) {
return Pacioli.$graphics_arrow_default_arrow(
Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_vector), 
lcl_vector);
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


Pacioli.compute_u_$graphics_scene_scene_arrows = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('candela').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.unitFromVarName('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.$graphics_scene_scene_arrows = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_description, lcl_arrows, lcl_meshes, lcl_paths, lcl_lights, lcl_ambient_light, lcl_labels) { return lcl_arrows;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_color_make_color = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("String", []));
}

Pacioli.$graphics_color_make_color = function (lcl_color) {
return lcl_color;
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

Pacioli.compute_u_$graphics_arrow_default_arrow_color = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_$graphics_arrow_default_arrow_color = function () {
  return Pacioli.$graphics_color_make_color(
"blue");
}

Pacioli.compute_u_$base_matrix__ = function () {
    return new Pacioli.IndexType([]);
}
Pacioli.compute_$base_matrix__ = function () {
  return Pacioli.createCoordinates([]);
}
