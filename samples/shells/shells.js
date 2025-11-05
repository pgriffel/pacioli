

Pacioli.compute_u_info_extend_shell_info = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_extend_shell_info = function (lcl_shell, lcl_info, lcl_n) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return (function (lcl_body) { return function (sym_1220, lcl_body_area, lcl_body_volume, lcl_vss, lcl_aperture_area, lcl_ss, lcl_area, lcl_body_volume_growth, lcl_volume, lcl_start, lcl_i, lcl_cb, lcl_b, lcl_sass, lcl_area, lcl_a, lcl_body_area_growth, lcl_i, lcl_volume) {
return Pacioli.$base_base__catch_result(
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_start, Pacioli.$base_matrix_minus(
Pacioli.$base_list_list_size(
Pacioli.$base_base__ref_get(lcl_aperture_area)), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_area, Pacioli.model_last(
Pacioli.$base_base__ref_get(lcl_body_area))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_volume, Pacioli.model_last(
Pacioli.$base_base__ref_get(lcl_body_volume))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
Pacioli.$base_base__seq(
Pacioli.$base_base__while(
function () {
return Pacioli.$base_base_not_equal(
Pacioli.$base_base__ref_get(lcl_i), 
lcl_n);} ,
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_a, Pacioli.$base_list_nth(
Pacioli.$base_matrix_max(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_minus(
Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_start), 
Pacioli.$base_base__ref_get(lcl_i)), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), 
lcl_body)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_b, Pacioli.$base_list_nth(
Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_start), 
Pacioli.$base_base__ref_get(lcl_i)), 
lcl_body)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_cb, Pacioli.curve_curve_surface(
Pacioli.curve_curve_reverse(
Pacioli.$base_base__ref_get(lcl_b)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_ss, Pacioli.curve_segment_surface(
Pacioli.$base_base__ref_get(lcl_a), 
Pacioli.$base_base__ref_get(lcl_b))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_sass, Pacioli.$geometry_geometry_surface_area(
Pacioli.$base_base__ref_get(lcl_ss))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_vss, Pacioli.$geometry_geometry_surface_volume(
Pacioli.$base_list_append(
Pacioli.$base_base__ref_get(lcl_ss), 
Pacioli.$base_list_append(
Pacioli.curve_curve_surface(
Pacioli.$base_base__ref_get(lcl_a)), 
Pacioli.$base_base__ref_get(lcl_cb))))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_area, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_area), 
Pacioli.$base_base__ref_get(lcl_sass))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_volume, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_volume), 
Pacioli.$base_base__ref_get(lcl_vss))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_aperture_area, Pacioli.$base_system__add_mut(
Pacioli.$base_base__ref_get(lcl_aperture_area), 
Pacioli.$geometry_geometry_surface_area(
Pacioli.$base_base__ref_get(lcl_cb)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_body_area_growth, Pacioli.$base_system__add_mut(
Pacioli.$base_base__ref_get(lcl_body_area_growth), 
Pacioli.$base_base__ref_get(lcl_sass))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_body_area, Pacioli.$base_system__add_mut(
Pacioli.$base_base__ref_get(lcl_body_area), 
Pacioli.$base_base__ref_get(lcl_area))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_body_volume_growth, Pacioli.$base_system__add_mut(
Pacioli.$base_base__ref_get(lcl_body_volume_growth), 
Pacioli.$base_base__ref_get(lcl_vss))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_body_volume, Pacioli.$base_system__add_mut(
Pacioli.$base_base__ref_get(lcl_body_volume), 
Pacioli.$base_base__ref_get(lcl_volume))), 
Pacioli.$base_base__ref_set(lcl_i, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_i), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))))))))))))))));}), 
Pacioli.$base_base__throw_result(sym_1220, Pacioli.info_make_info(
Pacioli.$base_base__ref_get(lcl_aperture_area), 
Pacioli.$base_base__ref_get(lcl_body_area_growth), 
Pacioli.$base_base__ref_get(lcl_body_area), 
Pacioli.$base_base__ref_get(lcl_body_volume_growth), 
Pacioli.$base_base__ref_get(lcl_body_volume)))))))); } ,
sym_1220); }( 
Pacioli.$base_base__empty_ref(), Pacioli.$base_base__new_ref(lcl_body_area), Pacioli.$base_base__new_ref(lcl_body_volume), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__new_ref(lcl_aperture_area), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__new_ref(lcl_body_volume_growth), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__new_ref(lcl_body_area_growth), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref());})(
Pacioli.model_shell_body(
lcl_shell));}, 
lcl_info);
}


Pacioli.compute_u_model_last = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.typeFromVarName('_a_')])]), Pacioli.typeFromVarName('_a_'));
}

Pacioli.model_last = function (lcl_x) {
return Pacioli.$base_list_nth(
Pacioli.$base_matrix_minus(
Pacioli.$base_list_list_size(
lcl_x), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_x);
}


Pacioli.compute_u_model_grow = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.model_grow = function (lcl_shell, lcl_n) {
return (function (lcl_body) { return (function (lcl_meshes) { return (function (lcl_settings) { return (function (lcl_initial) { return (function (lcl_gvm) { return (function (lcl_factor) { return (function (lcl_nr_ticks) { return (function (lcl_landmarks) { return (function (lcl_m) { return function (sym_1028, lcl_i, lcl_i, lcl_s, lcl_b, lcl_s, lcl_b, lcl_me, lcl_me, lcl_t) {
return Pacioli.$base_base__catch_result(
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_b, (function (lcl__c_accu86) { return Pacioli.$base_list_loop_list(
lcl__c_accu86, 
function (lcl__c_accu86, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu86, 
lcl_x);}, 
lcl_body);})(
Pacioli.$base_list_empty_list(
))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_me, (function (lcl__c_accu88) { return Pacioli.$base_list_loop_list(
lcl__c_accu88, 
function (lcl__c_accu88, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu88, 
lcl_x);}, 
lcl_meshes);})(
Pacioli.$base_list_empty_list(
))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_s, (Pacioli.$base_base_equal(
lcl_m, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? lcl_initial : Pacioli.model_last(
lcl_body) )), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
Pacioli.$base_base__seq(
Pacioli.$base_base__while(
function () {
return Pacioli.$base_base_not_equal(
Pacioli.$base_base__ref_get(lcl_i), 
lcl_n);} ,
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_t, Pacioli.model_step(
Pacioli.$base_base__ref_get(lcl_s), 
lcl_gvm, 
Pacioli.model_growth_factor(
Pacioli.$base_matrix_sum(
lcl_m, 
Pacioli.$base_base__ref_get(lcl_i)), 
lcl_factor, 
lcl_nr_ticks), 
lcl_landmarks)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_me, Pacioli.$base_system__add_mut(
Pacioli.$base_base__ref_get(lcl_me), 
Pacioli.curve_segment_mesh(
Pacioli.$base_base__ref_get(lcl_s), 
Pacioli.$base_base__ref_get(lcl_t)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_b, Pacioli.$base_system__add_mut(
Pacioli.$base_base__ref_get(lcl_b), 
Pacioli.$base_base__ref_get(lcl_t))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_s, Pacioli.$base_base__ref_get(lcl_t)), 
Pacioli.$base_base__ref_set(lcl_i, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_i), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))))));}), 
Pacioli.$base_base__throw_result(sym_1028, Pacioli.model_make_shell(
lcl_settings, 
Pacioli.$base_base__ref_get(lcl_b), 
Pacioli.$base_base__ref_get(lcl_me)))))))); } ,
sym_1028); }( 
Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref());})(
Pacioli.$base_list_list_size(
lcl_body));})(
Pacioli.model_settings_landmarks(
lcl_settings));})(
Pacioli.model_settings_nr_ticks(
lcl_settings));})(
Pacioli.model_settings_factor(
lcl_settings));})(
Pacioli.model_settings_gvm(
lcl_settings));})(
Pacioli.model_settings_initial(
lcl_settings));})(
Pacioli.model_shell_settings(
lcl_shell));})(
Pacioli.model_shell_meshes(
lcl_shell));})(
Pacioli.model_shell_body(
lcl_shell));
}


Pacioli.compute_u_curve_curves_equal = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []));
}

Pacioli.curve_curves_equal = function (lcl_x, lcl_y, lcl_decimals) {
return (Pacioli.$base_base_equal(
Pacioli.$base_list_list_size(
lcl_x), 
Pacioli.$base_list_list_size(
lcl_y)) ? Pacioli.$standard_standard__list_all(
(function (lcl__c_accu80) { return Pacioli.$base_list_loop_list(
lcl__c_accu80, 
function (lcl__c_accu80, lcl__c_tup81) { return Pacioli.$base_base_apply(
function (lcl_a, lcl_b) { return Pacioli.$base_system__add_mut(
lcl__c_accu80, 
Pacioli.$standard_standard_approximates(
lcl_a, 
lcl_b, 
lcl_decimals));}, 
lcl__c_tup81);}, 
Pacioli.$base_list_zip(
lcl_x, 
lcl_y));})(
Pacioli.$base_list_empty_list(
))) : false );
}


Pacioli.compute_u_curve_scale_curve = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.curve_scale_curve = function (lcl_curve, lcl_factor) {
return (function (lcl__c_accu68) { return Pacioli.$base_list_loop_list(
lcl__c_accu68, 
function (lcl__c_accu68, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu68, 
Pacioli.$base_matrix_scale(
lcl_factor, 
lcl_x));}, 
lcl_curve);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$standard_standard__list_all = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Boole", [])])]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$standard_standard__list_all = function (lcl_x) {
return (Pacioli.$base_base_equal(
lcl_x, 
Pacioli.$base_list_empty_list(
)) ? true : Pacioli.$base_list_fold_list(
function (lcl_a, lcl_b) { return (lcl_a ? lcl_b : false );}, 
lcl_x) );
}


Pacioli.compute_u_curve_segment_mesh = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.curve_segment_mesh = function (lcl_curvea, lcl_curveb) {
return (function (lcl_n) { return Pacioli.$graphics_mesh_with_material(
Pacioli.$graphics_mesh_make_mesh(
(function (lcl__c_accu76) { return Pacioli.$base_list_loop_list(
lcl__c_accu76, 
function (lcl__c_accu76, lcl_v) { return Pacioli.$base_system__add_mut(
lcl__c_accu76, 
Pacioli.$graphics_mesh_vertex(
lcl_v, 
Pacioli.fetchValue('curve', 'SEGMENT_VERTEX_COLOR')));}, 
Pacioli.$base_list_append(
lcl_curvea, 
lcl_curveb));})(
Pacioli.$base_list_empty_list(
)), 
(function (lcl__c_accu78) { return Pacioli.$base_list_loop_list(
lcl__c_accu78, 
function (lcl__c_accu78, lcl_i) { return (function (lcl_a) { return (function (lcl_b) { return (function (lcl_c) { return (function (lcl_d) { return Pacioli.$base_list_loop_list(
lcl__c_accu78, 
function (lcl__c_accu78, lcl_f) { return Pacioli.$base_system__add_mut(
lcl__c_accu78, 
lcl_f);}, 
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$graphics_mesh_face(
lcl_a, 
lcl_b, 
lcl_c)), 
Pacioli.$graphics_mesh_face(
lcl_a, 
lcl_c, 
lcl_d)));})(
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.$base_matrix_mod(
lcl_i, 
lcl_n)));})(
Pacioli.$base_matrix_sum(
lcl_n, 
Pacioli.$base_matrix_mod(
Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_n)));})(
Pacioli.$base_matrix_mod(
Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_n));})(
lcl_i);}, 
Pacioli.$base_list_naturals(
lcl_n));})(
Pacioli.$base_list_empty_list(
))), 
"Normal");})(
Pacioli.$base_list_list_size(
lcl_curvea));
}


Pacioli.compute_u_model_make_shell = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.model_make_shell = function (lcl_settings, lcl_body, lcl_meshes) {
return Pacioli.$base_base_tuple(
lcl_settings, 
lcl_body, 
lcl_meshes);
}


Pacioli.compute_u_model_shell_meshes = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]));
}

Pacioli.model_shell_meshes = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_settings, lcl_body, lcl_meshes) { return lcl_meshes;}, 
lcl_record);
}


Pacioli.compute_u_$graphics_path_make_path = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_path_make_path = function (lcl_vecs) {
return Pacioli.$base_base_tuple(
lcl_vecs, 
Pacioli.$graphics_color_make_color(
"blue"));
}


Pacioli.compute_u_$graphics_mesh_vertex = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_vertex = function (lcl_vec, lcl_color) {
return Pacioli.$base_base_tuple(
lcl_vec, 
lcl_color);
}


Pacioli.compute_u_curve_segment_closed_surface = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.curve_segment_closed_surface = function (lcl_curve, lcl_next) {
return Pacioli.$base_list_append(
Pacioli.curve_segment_surface(
lcl_curve, 
lcl_next), 
Pacioli.$base_list_append(
Pacioli.curve_curve_surface(
lcl_curve), 
Pacioli.curve_curve_surface(
Pacioli.$base_list_reverse(
lcl_next))));
}


Pacioli.compute_u_shells_my_path_b = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.shells_my_path_b = function () {
return Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.6]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.6]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 1.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.6]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.3]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.25]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));
}


Pacioli.compute_u_info_info_body_volume = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.info_info_body_volume = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return lcl_body_volume;}, 
lcl_record);
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


Pacioli.compute_u_model_logistic = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(-1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(-1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(-1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_D!g_').expt(1), '_E_', new Pacioli.PowerProduct('_E!h_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_D!g_').expt(1), '_E_', new Pacioli.PowerProduct('_E!h_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_D!g_').expt(1), '_E_', new Pacioli.PowerProduct('_E!h_').expt(1)));
}

Pacioli.model_logistic = function (lcl_r, lcl_t, lcl_k, lcl_y) {
return Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_multiply(
lcl_k, 
lcl_y), 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_minus(
lcl_k, 
lcl_y), 
Pacioli.$base_matrix_exp(
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_multiply(
lcl_r, 
lcl_t)))), 
lcl_y));
}


Pacioli.compute_u_info_info_body_area = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.info_info_body_area = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return lcl_body_area;}, 
lcl_record);
}


Pacioli.compute_u_model_with_shell_meshes = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.model_with_shell_meshes = function (lcl_meshes, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_settings, lcl_body, lcl__) { return Pacioli.$base_base_tuple(
lcl_settings, 
lcl_body, 
lcl_meshes);}, 
lcl_record);
}


Pacioli.compute_u_shells_my_path_c = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.shells_my_path_c = function () {
return Pacioli.shells_rectangle_path(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.5]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))));
}


Pacioli.compute_u_model_create_shell = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.model_create_shell = function (lcl_aperture, lcl_offset, lcl_outward, lcl_upward, lcl_growth_scale, lcl_growth_orientation, lcl_growth_constant, lcl_rotation_x, lcl_rotation_y, lcl_rotation_z, lcl_segments, lcl_unit) {
return Pacioli.model_initial_shell(
Pacioli.model_absolute_aperture_coords(
lcl_aperture, 
lcl_unit), 
Pacioli.$geometry_geometry_vector3d(
lcl_offset, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_unit), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_unit)), 
Pacioli.$geometry_geometry_vector3d(
lcl_outward, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_unit), 
lcl_upward), 
lcl_growth_scale, 
lcl_growth_orientation, 
lcl_growth_constant, 
lcl_rotation_x, 
lcl_rotation_y, 
lcl_rotation_z, 
lcl_segments, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));
}


Pacioli.compute_u_model_shell_body = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_shell_body = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_settings, lcl_body, lcl_meshes) { return lcl_body;}, 
lcl_record);
}


Pacioli.compute_u_shells_circle_path = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.shells_circle_path = function (lcl_n, lcl_d) {
return (function (lcl_angle) { return (function (lcl__c_accu92) { return Pacioli.$base_list_loop_list(
lcl__c_accu92, 
function (lcl__c_accu92, lcl_i) { return (function (lcl_a) { return Pacioli.$base_system__add_mut(
lcl__c_accu92, 
Pacioli.$base_base_tuple(
lcl_a, 
lcl_d));})(
(Pacioli.$base_base_equal(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.$base_matrix_divide(
lcl_angle, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])) : lcl_angle ));}, 
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_minus(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_list_empty_list(
));})(
Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
lcl_n));
}


Pacioli.compute_u_model_growth_factor = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.model_growth_factor = function (lcl_t, lcl_growth_constant, lcl_nr_ticks) {
return (function (lcl_r) { return (function (lcl_k) { return (Pacioli.$base_base_equal(
lcl_r, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.initialNumbers(1, 1, [[0, 0, 1]]) : Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_minus(
Pacioli.model_logistic(
lcl_r, 
Pacioli.$base_matrix_sum(
lcl_t, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_k, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
Pacioli.model_logistic(
lcl_r, 
lcl_t, 
lcl_k, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), 
Pacioli.$base_matrix_minus(
Pacioli.model_logistic(
lcl_r, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
lcl_k, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
Pacioli.model_logistic(
lcl_r, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_k, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))) );})(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.$base_matrix_exp(
Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_multiply(
lcl_r, 
lcl_nr_ticks), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])))));})(
Pacioli.$base_matrix_ln(
lcl_growth_constant));
}


Pacioli.compute_u_model_make_settings = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_make_settings = function (lcl_initial, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl_landmarks) {
return Pacioli.$base_base_tuple(
lcl_initial, 
lcl_gvm, 
lcl_factor, 
lcl_nr_ticks, 
lcl_landmarks);
}


Pacioli.compute_u_curve_transform_curve = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.curve_transform_curve = function (lcl_curve, lcl_matrix) {
return (function (lcl__c_accu64) { return Pacioli.$base_list_loop_list(
lcl__c_accu64, 
function (lcl__c_accu64, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu64, 
Pacioli.$base_matrix_mmult(
lcl_matrix, 
lcl_x));}, 
lcl_curve);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_info_empty_shell_info = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_empty_shell_info = function (lcl_shell) {
return (function (lcl_u) { return Pacioli.info_make_info(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
(function (lcl_multiply0) { return Pacioli.$base_matrix_multiply(
lcl_multiply0, 
lcl_multiply0);})(
lcl_u))), 
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
(function (lcl_multiply1) { return Pacioli.$base_matrix_multiply(
lcl_multiply1, 
lcl_multiply1);})(
lcl_u))), 
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
(function (lcl_multiply2) { return Pacioli.$base_matrix_multiply(
lcl_multiply2, 
lcl_multiply2);})(
lcl_u))), 
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
(function (lcl_multiply3) { return Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_multiply3, 
lcl_multiply3), 
lcl_multiply3);})(
lcl_u))), 
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
(function (lcl_multiply4) { return Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_multiply4, 
lcl_multiply4), 
lcl_multiply4);})(
lcl_u))));})(
Pacioli.model_shell_unit(
lcl_shell));
}


Pacioli.compute_u_model_growth_factors = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.model_growth_factors = function (lcl_growth_constant, lcl_n) {
return (function (lcl__c_accu82) { return Pacioli.$base_list_loop_list(
lcl__c_accu82, 
function (lcl__c_accu82, lcl_t) { return Pacioli.$base_system__add_mut(
lcl__c_accu82, 
Pacioli.model_growth_factor(
lcl_t, 
lcl_growth_constant, 
lcl_n));}, 
Pacioli.$base_list_naturals(
lcl_n));})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_model_axis_point = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.model_axis_point = function (lcl_shell) {
return (function (lcl_body) { return (Pacioli.$base_base_equal(
lcl_body, 
Pacioli.$base_list_empty_list(
)) ? Pacioli.$base_matrix_scale(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.model_shell_unit(
lcl_shell)), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))) : Pacioli.$base_matrix_scale_down(
Pacioli.$standard_standard__list_sum(
(function (lcl__c_accu90) { return Pacioli.$base_list_loop_list(
lcl__c_accu90, 
function (lcl__c_accu90, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu90, 
Pacioli.curve_curve_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_x));}, 
lcl_body);})(
Pacioli.$base_list_empty_list(
))), 
Pacioli.$base_list_list_size(
lcl_body)) );})(
Pacioli.model_shell_body(
lcl_shell));
}


Pacioli.compute_u_model_settings_landmarks = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.model_settings_landmarks = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl_landmarks) { return lcl_landmarks;}, 
lcl_record);
}


Pacioli.compute_u_curve_make_curve = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.curve_make_curve = function (lcl_vs) {
return Pacioli.$base_list_append(
lcl_vs, 
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_list_head(
lcl_vs)));
}


Pacioli.compute_u_model_shell_unit = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.model_shell_unit = function (lcl_shell) {
return Pacioli.$base_matrix_scalar_unit(
Pacioli.curve_curve_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.model_settings_initial(
Pacioli.model_shell_settings(
lcl_shell))));
}


Pacioli.compute_u_info_with_info_body_area = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_with_info_body_area = function (lcl_body_area, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl__, lcl_body_volume_growth, lcl_body_volume) { return Pacioli.$base_base_tuple(
lcl_aperture_area, 
lcl_body_area_growth, 
lcl_body_area, 
lcl_body_volume_growth, 
lcl_body_volume);}, 
lcl_record);
}


Pacioli.compute_u_model_shell_full_size = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.model_shell_full_size = function (lcl_shell) {
return Pacioli.model_settings_nr_ticks(
Pacioli.model_shell_settings(
lcl_shell));
}


Pacioli.compute_u_model_step = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.model_step = function (lcl_curve, lcl_gvm, lcl_growth_factor, lcl_landmarks) {
return (function (lcl_r) { return (function (lcl_s) { return Pacioli.curve_sum_curves(
lcl_curve, 
Pacioli.curve_transform_curve(
lcl_s, 
lcl_r));})(
Pacioli.curve_scale_curve(
lcl_gvm, 
lcl_growth_factor));})(
Pacioli.curve_curve_rotation(
lcl_curve, 
lcl_landmarks));
}


Pacioli.compute_u_$geometry_geometry_vector3d = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_vector3d = function (lcl_a, lcl_b, lcl_c) {
return Pacioli.$base_matrix_make_matrix(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['x','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_'), 
lcl_a)), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['y','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_'), 
lcl_b)), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['z','index_$geometry_geometry_Geom3']]), 
Pacioli.fetchValue('$base_matrix', '_'), 
lcl_c)));
}


Pacioli.compute_u_curve_segment_area = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.curve_segment_area = function (lcl_curve, lcl_next) {
return Pacioli.$geometry_geometry_surface_area(
Pacioli.curve_segment_surface(
lcl_curve, 
lcl_next));
}


Pacioli.compute_u_$geometry_geometry_matrix3d = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE));
}

Pacioli.$geometry_geometry_matrix3d = function (lcl_a, lcl_b, lcl_c, lcl_d, lcl_e, lcl_f, lcl_g, lcl_h, lcl_i) {
return (function (lcl_x) { return (function (lcl_y) { return (function (lcl_z) { return Pacioli.$base_matrix_make_matrix(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
lcl_x, 
lcl_x, 
lcl_a)), 
Pacioli.$base_base_tuple(
lcl_x, 
lcl_y, 
lcl_b)), 
Pacioli.$base_base_tuple(
lcl_x, 
lcl_z, 
lcl_c)), 
Pacioli.$base_base_tuple(
lcl_y, 
lcl_x, 
lcl_d)), 
Pacioli.$base_base_tuple(
lcl_y, 
lcl_y, 
lcl_e)), 
Pacioli.$base_base_tuple(
lcl_y, 
lcl_z, 
lcl_f)), 
Pacioli.$base_base_tuple(
lcl_z, 
lcl_x, 
lcl_g)), 
Pacioli.$base_base_tuple(
lcl_z, 
lcl_y, 
lcl_h)), 
Pacioli.$base_base_tuple(
lcl_z, 
lcl_z, 
lcl_i)));})(
Pacioli.createCoordinates([['z','index_$geometry_geometry_Geom3']]));})(
Pacioli.createCoordinates([['y','index_$geometry_geometry_Geom3']]));})(
Pacioli.createCoordinates([['x','index_$geometry_geometry_Geom3']]));
}


Pacioli.compute_u_model_borders = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.model_borders = function (lcl_coords) {
return (function (lcl_indices) { return (function (lcl_x_less) { return (function (lcl_y_less) { return (function (lcl_left) { return (function (lcl_top) { return (function (lcl_right) { return (function (lcl_bottom) { return Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
lcl_left), 
lcl_top), 
lcl_right), 
lcl_bottom);})(
Pacioli.$base_list_fold_list(
function (lcl_i, lcl_j) { return ((lcl_y_less)(
Pacioli.$base_list_nth(
lcl_i, 
lcl_coords), 
Pacioli.$base_list_nth(
lcl_j, 
lcl_coords)) ? lcl_j : lcl_i );}, 
lcl_indices));})(
Pacioli.$base_list_fold_list(
function (lcl_i, lcl_j) { return ((lcl_x_less)(
Pacioli.$base_list_nth(
lcl_i, 
lcl_coords), 
Pacioli.$base_list_nth(
lcl_j, 
lcl_coords)) ? lcl_j : lcl_i );}, 
lcl_indices));})(
Pacioli.$base_list_fold_list(
function (lcl_i, lcl_j) { return ((lcl_y_less)(
Pacioli.$base_list_nth(
lcl_i, 
lcl_coords), 
Pacioli.$base_list_nth(
lcl_j, 
lcl_coords)) ? lcl_i : lcl_j );}, 
lcl_indices));})(
Pacioli.$base_list_fold_list(
function (lcl_i, lcl_j) { return ((lcl_x_less)(
Pacioli.$base_list_nth(
lcl_i, 
lcl_coords), 
Pacioli.$base_list_nth(
lcl_j, 
lcl_coords)) ? lcl_i : lcl_j );}, 
lcl_indices));})(
function (lcl_a, lcl_b) { return Pacioli.$base_base_apply(
function (lcl__97, lcl_ay) { return Pacioli.$base_base_apply(
function (lcl__96, lcl_by) { return Pacioli.$base_matrix_less(
lcl_ay, 
lcl_by);}, 
lcl_b);}, 
lcl_a);});})(
function (lcl_a, lcl_b) { return Pacioli.$base_base_apply(
function (lcl_ax, lcl__95) { return Pacioli.$base_base_apply(
function (lcl_bx, lcl__94) { return Pacioli.$base_matrix_less(
lcl_ax, 
lcl_bx);}, 
lcl_b);}, 
lcl_a);});})(
Pacioli.$base_list_naturals(
Pacioli.$base_list_list_size(
lcl_coords)));
}


Pacioli.compute_u_curve_curve_surface = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.curve_curve_surface = function (lcl_curve) {
return (function (lcl_n) { return (Pacioli.$base_matrix_less(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 3]])) ? Pacioli.$base_list_empty_list(
) : (function (lcl_first) { return (function (lcl__c_accu70) { return Pacioli.$base_list_loop_list(
lcl__c_accu70, 
function (lcl__c_accu70, lcl_i) { return Pacioli.$base_system__add_mut(
lcl__c_accu70, 
Pacioli.$base_base_tuple(
lcl_first, 
Pacioli.$base_list_nth(
Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_curve), 
Pacioli.$base_list_nth(
Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])), 
lcl_curve)));}, 
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_minus(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]))));})(
Pacioli.$base_list_empty_list(
));})(
Pacioli.$base_list_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_curve)) );})(
Pacioli.$base_matrix_minus(
Pacioli.$base_list_list_size(
lcl_curve), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])));
}


Pacioli.compute_u_curve_curve_path = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])]));
}

Pacioli.curve_curve_path = function (lcl_curve) {
return Pacioli.$graphics_path_make_path(
lcl_curve);
}


Pacioli.compute_u_model_settings_nr_ticks = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.model_settings_nr_ticks = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl_landmarks) { return lcl_nr_ticks;}, 
lcl_record);
}


Pacioli.compute_u_curve_sum_curves = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.curve_sum_curves = function (lcl_x, lcl_y) {
return (function (lcl__c_accu66) { return Pacioli.$base_list_loop_list(
lcl__c_accu66, 
function (lcl__c_accu66, lcl__c_tup67) { return Pacioli.$base_base_apply(
function (lcl_a, lcl_b) { return Pacioli.$base_system__add_mut(
lcl__c_accu66, 
Pacioli.$base_matrix_sum(
lcl_a, 
lcl_b));}, 
lcl__c_tup67);}, 
Pacioli.$base_list_zip(
lcl_x, 
lcl_y));})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$geometry_geometry_euler_rotation = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE));
}

Pacioli.$geometry_geometry_euler_rotation = function (lcl_x_angle, lcl_y_angle, lcl_z_angle) {
return Pacioli.$base_matrix_mmult(
Pacioli.$base_matrix_mmult(
Pacioli.$geometry_geometry_z_rotation(
lcl_z_angle), 
Pacioli.$geometry_geometry_y_rotation(
lcl_y_angle)), 
Pacioli.$geometry_geometry_x_rotation(
lcl_x_angle));
}


Pacioli.compute_u_model_shell_current_size = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.model_shell_current_size = function (lcl_shell) {
return Pacioli.$base_list_list_size(
Pacioli.model_shell_body(
lcl_shell));
}


Pacioli.compute_u_info_info_body_volume_growth = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.info_info_body_volume_growth = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return lcl_body_volume_growth;}, 
lcl_record);
}


Pacioli.compute_u_info_with_info_aperture_area = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_with_info_aperture_area = function (lcl_aperture_area, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl__, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return Pacioli.$base_base_tuple(
lcl_aperture_area, 
lcl_body_area_growth, 
lcl_body_area, 
lcl_body_volume_growth, 
lcl_body_volume);}, 
lcl_record);
}


Pacioli.compute_u_info_with_info_body_volume_growth = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_with_info_body_volume_growth = function (lcl_body_volume_growth, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl__, lcl_body_volume) { return Pacioli.$base_base_tuple(
lcl_aperture_area, 
lcl_body_area_growth, 
lcl_body_area, 
lcl_body_volume_growth, 
lcl_body_volume);}, 
lcl_record);
}


Pacioli.compute_u_curve_segment_surface = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.curve_segment_surface = function (lcl_curve, lcl_next) {
return (function (lcl_n) { return (Pacioli.$base_matrix_less(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])) ? Pacioli.$base_list_empty_list(
) : Pacioli.$base_list_append(
(function (lcl__c_accu72) { return Pacioli.$base_list_loop_list(
lcl__c_accu72, 
function (lcl__c_accu72, lcl_i) { return Pacioli.$base_system__add_mut(
lcl__c_accu72, 
Pacioli.$base_base_tuple(
Pacioli.$base_list_nth(
lcl_i, 
lcl_curve), 
Pacioli.$base_list_nth(
lcl_i, 
lcl_next), 
Pacioli.$base_list_nth(
Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_curve)));}, 
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_minus(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_list_empty_list(
)), 
(function (lcl__c_accu74) { return Pacioli.$base_list_loop_list(
lcl__c_accu74, 
function (lcl__c_accu74, lcl_i) { return Pacioli.$base_system__add_mut(
lcl__c_accu74, 
Pacioli.$base_base_tuple(
Pacioli.$base_list_nth(
lcl_i, 
lcl_next), 
Pacioli.$base_list_nth(
Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_next), 
Pacioli.$base_list_nth(
Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
lcl_curve)));}, 
Pacioli.$base_list_naturals(
Pacioli.$base_matrix_minus(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));})(
Pacioli.$base_list_empty_list(
))) );})(
Pacioli.$base_list_list_size(
lcl_curve));
}


Pacioli.compute_u_model_with_settings_nr_ticks = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_with_settings_nr_ticks = function (lcl_nr_ticks, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl_factor, lcl__, lcl_landmarks) { return Pacioli.$base_base_tuple(
lcl_initial, 
lcl_gvm, 
lcl_factor, 
lcl_nr_ticks, 
lcl_landmarks);}, 
lcl_record);
}


Pacioli.compute_u_model_shell_initial_curve = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", [])]));
}

Pacioli.model_shell_initial_curve = function (lcl_shell) {
return Pacioli.curve_curve_path(
Pacioli.model_settings_initial(
Pacioli.model_shell_settings(
lcl_shell)));
}


Pacioli.compute_u_model_shell_settings = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_shell_settings = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_settings, lcl_body, lcl_meshes) { return lcl_settings;}, 
lcl_record);
}


Pacioli.compute_u_$geometry_geometry_signed_volume = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_signed_volume = function (lcl_x, lcl_y, lcl_z) {
return Pacioli.$base_matrix_divide(
Pacioli.$standard_matrix_inner(
lcl_x, 
Pacioli.$geometry_geometry_cross(
lcl_y, 
lcl_z)), 
Pacioli.initialNumbers(1, 1, [[0, 0, 6]]));
}


Pacioli.compute_u_info_last_segment_info = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.info_last_segment_info = function (lcl_info) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return Pacioli.$base_base_tuple(
Pacioli.model_last(
lcl_aperture_area), 
Pacioli.model_last(
lcl_body_area_growth), 
Pacioli.model_last(
lcl_body_area), 
Pacioli.model_last(
lcl_body_volume_growth), 
Pacioli.model_last(
lcl_body_volume));}, 
lcl_info);
}


Pacioli.compute_u_$geometry_geometry_x_rotation = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE));
}

Pacioli.$geometry_geometry_x_rotation = function (lcl_angle) {
return Pacioli.$geometry_geometry_matrix3d(
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_cos(
lcl_angle), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_sin(
lcl_angle)), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_sin(
lcl_angle), 
Pacioli.$base_matrix_cos(
lcl_angle));
}


Pacioli.compute_u_model_with_settings_initial = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_with_settings_initial = function (lcl_initial, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl__, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl_landmarks) { return Pacioli.$base_base_tuple(
lcl_initial, 
lcl_gvm, 
lcl_factor, 
lcl_nr_ticks, 
lcl_landmarks);}, 
lcl_record);
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


Pacioli.compute_u_$geometry_geometry_y_rotation = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE));
}

Pacioli.$geometry_geometry_y_rotation = function (lcl_angle) {
return Pacioli.$geometry_geometry_matrix3d(
Pacioli.$base_matrix_cos(
lcl_angle), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_sin(
lcl_angle), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_sin(
lcl_angle)), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_cos(
lcl_angle));
}


Pacioli.compute_u_model_with_shell_body = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.model_with_shell_body = function (lcl_body, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_settings, lcl__, lcl_meshes) { return Pacioli.$base_base_tuple(
lcl_settings, 
lcl_body, 
lcl_meshes);}, 
lcl_record);
}


Pacioli.compute_u_$geometry_geometry_triangle_area = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_triangle_area = function (lcl_x, lcl_y, lcl_z) {
return Pacioli.$base_matrix_divide(
Pacioli.$standard_matrix_norm(
Pacioli.$geometry_geometry_cross(
Pacioli.$base_matrix_minus(
lcl_y, 
lcl_x), 
Pacioli.$base_matrix_minus(
lcl_z, 
lcl_x))), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]));
}


Pacioli.compute_u_model_with_settings_factor = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_with_settings_factor = function (lcl_factor, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl__, lcl_nr_ticks, lcl_landmarks) { return Pacioli.$base_base_tuple(
lcl_initial, 
lcl_gvm, 
lcl_factor, 
lcl_nr_ticks, 
lcl_landmarks);}, 
lcl_record);
}


Pacioli.compute_u_$geometry_geometry_surface_volume = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_surface_volume = function (lcl_surface) {
return Pacioli.$base_matrix_abs(
Pacioli.$standard_standard__list_sum(
(function (lcl__c_accu30) { return Pacioli.$base_list_loop_list(
lcl__c_accu30, 
function (lcl__c_accu30, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu30, 
Pacioli.$base_base_apply(
Pacioli.fetchValue('$geometry_geometry', 'signed_volume'), 
lcl_x));}, 
lcl_surface);})(
Pacioli.$base_list_empty_list(
))));
}


Pacioli.compute_u_shells_my_path_a = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.shells_my_path_a = function () {
return Pacioli.shells_circle_path(
Pacioli.initialNumbers(1, 1, [[0, 0, 17]]), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.2]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))));
}


Pacioli.compute_u_info_info_body_area_growth = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.info_info_body_area_growth = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return lcl_body_area_growth;}, 
lcl_record);
}


Pacioli.compute_u_model_settings_gvm = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.model_settings_gvm = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl_landmarks) { return lcl_gvm;}, 
lcl_record);
}


Pacioli.compute_u_model_settings_factor = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.model_settings_factor = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl_landmarks) { return lcl_factor;}, 
lcl_record);
}


Pacioli.compute_u_$standard_standard__list_sum = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1))])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1)));
}

Pacioli.$standard_standard__list_sum = function (lcl_x) {
return Pacioli.$base_list_fold_list(
Pacioli.fetchValue('$base_matrix', 'sum'), 
lcl_x);
}


Pacioli.compute_u_$graphics_mesh_make_mesh = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_make_mesh = function (lcl_vertices, lcl_faces) {
return Pacioli.$base_base_tuple(
lcl_vertices, 
lcl_faces, 
Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_base_apply(
function (lcl_v, lcl__67) { return lcl_v;}, 
Pacioli.$base_list_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_vertices))), 
Pacioli.$base_base_nothing(
), 
false, 
"none");
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


Pacioli.compute_u_model_with_shell_settings = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.model_with_shell_settings = function (lcl_settings, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl__, lcl_body, lcl_meshes) { return Pacioli.$base_base_tuple(
lcl_settings, 
lcl_body, 
lcl_meshes);}, 
lcl_record);
}


Pacioli.compute_u_info_make_info = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_make_info = function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) {
return Pacioli.$base_base_tuple(
lcl_aperture_area, 
lcl_body_area_growth, 
lcl_body_area, 
lcl_body_volume_growth, 
lcl_body_volume);
}


Pacioli.compute_u_$standard_standard_approximates = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_I_', new Pacioli.PowerProduct('_I!u_').expt(1), '_J_', new Pacioli.PowerProduct('_J!v_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_I_', new Pacioli.PowerProduct('_I!u_').expt(1), '_J_', new Pacioli.PowerProduct('_J!v_').expt(1)), Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$standard_standard_approximates = function (lcl_x, lcl_y, lcl_decs) {
return (function (lcl_diff) { return Pacioli.$base_matrix_less_eq(
Pacioli.$base_matrix_magnitude(
lcl_diff), 
Pacioli.$base_matrix_scale_down(
Pacioli.$base_matrix_support(
lcl_diff), 
Pacioli.$base_matrix_expt(
Pacioli.initialNumbers(1, 1, [[0, 0, 10]]), 
Pacioli.$base_matrix_magnitude(
lcl_decs))));})(
Pacioli.$base_matrix_abs(
Pacioli.$base_matrix_minus(
lcl_x, 
lcl_y)));
}


Pacioli.compute_u_info_info_aperture_area = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.info_info_aperture_area = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return lcl_aperture_area;}, 
lcl_record);
}


Pacioli.compute_u_$standard_matrix_inverse = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(-1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1)));
}

Pacioli.$standard_matrix_inverse = function (lcl_x) {
return Pacioli.$standard_matrix_right_inverse(
lcl_x);
}


Pacioli.compute_u_curve_curve_nth = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.curve_curve_nth = function (lcl_i, lcl_curve) {
return Pacioli.$base_list_nth(
lcl_i, 
lcl_curve);
}


Pacioli.compute_u_$standard_matrix_right_inverse = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(-1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1)));
}

Pacioli.$standard_matrix_right_inverse = function (lcl_A) {
return Pacioli.$base_matrix_solve(
lcl_A, 
Pacioli.$base_matrix_left_identity(
lcl_A));
}


Pacioli.compute_u_shells_test_shell = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.shells_test_shell = function () {
return (function (lcl_deg) { return (function (lcl_shell_vec) { return (function (lcl_aperture_coords) { return Pacioli.model_grow(
Pacioli.model_initial_shell(
lcl_aperture_coords, 
(lcl_shell_vec)(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
(lcl_shell_vec)(
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.05]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.02]]))), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_deg), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1.02]]), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_deg), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_deg), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 10]]), 
lcl_deg), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]));})(
Pacioli.model_absolute_aperture_coords(
Pacioli.shells_my_path_a(
), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))));})(
function (lcl_x, lcl_y, lcl_z) { return Pacioli.$geometry_geometry_vector3d(
Pacioli.$base_matrix_multiply(
lcl_x, 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
lcl_y, 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
lcl_z, 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('milli', 'metre').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))));});})(
Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.initialNumbers(1, 1, [[0, 0, 360]])));
}


Pacioli.compute_u_model_initial_shell = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])])])]));
}

Pacioli.model_initial_shell = function (lcl_coords, lcl_offset, lcl_displacement, lcl_roz, lcl_mu, lcl_growth_constant, lcl_theta_x, lcl_theta_y, lcl_theta_z, lcl_segments, lcl_fudge) {
return (function (lcl_curve) { return (function (lcl_landmarks) { return (function (lcl_s) { return (function (lcl_t) { return (function (lcl_u) { return (function (lcl_r) { return (function (lcl_gvm) { return Pacioli.model_make_shell(
Pacioli.model_make_settings(
lcl_u, 
lcl_gvm, 
lcl_growth_constant, 
lcl_segments, 
lcl_landmarks), 
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_list_empty_list(
));})(
Pacioli.model_growth_vector_map(
lcl_u, 
lcl_displacement, 
lcl_growth_constant, 
lcl_r, 
lcl_landmarks));})(
Pacioli.$geometry_geometry_euler_rotation(
lcl_theta_x, 
lcl_theta_y, 
lcl_theta_z));})(
Pacioli.curve_transform_curve(
lcl_t, 
Pacioli.$geometry_geometry_euler_rotation(
lcl_mu, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))))));})(
Pacioli.curve_translate_curve(
lcl_s, 
lcl_offset));})(
Pacioli.curve_scale_curve(
lcl_curve, 
lcl_roz));})(
Pacioli.model_borders(
lcl_coords));})(
Pacioli.curve_make_curve(
(function (lcl__c_accu84) { return Pacioli.$base_list_loop_list(
lcl__c_accu84, 
function (lcl__c_accu84, lcl__c_tup85) { return Pacioli.$base_base_apply(
function (lcl_x, lcl_z) { return Pacioli.$base_system__add_mut(
lcl__c_accu84, 
Pacioli.$geometry_geometry_vector3d(
lcl_x, 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_x), 
lcl_z));}, 
lcl__c_tup85);}, 
lcl_coords);})(
Pacioli.$base_list_empty_list(
))));
}


Pacioli.compute_u_model_with_settings_gvm = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_with_settings_gvm = function (lcl_gvm, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl__, lcl_factor, lcl_nr_ticks, lcl_landmarks) { return Pacioli.$base_base_tuple(
lcl_initial, 
lcl_gvm, 
lcl_factor, 
lcl_nr_ticks, 
lcl_landmarks);}, 
lcl_record);
}


Pacioli.compute_u_model_absolute_aperture_coords = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_absolute_aperture_coords = function (lcl_path, lcl_unit) {
return function (sym_1029, lcl_coords, lcl_x, lcl_x, lcl_y, lcl_angle, lcl_path, lcl_y, lcl_direction, lcl_direction, lcl_distance, lcl_coords) {
return Pacioli.$base_base__catch_result(
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_direction, Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_x, Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_unit)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_y, Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_unit)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_coords, Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
Pacioli.$base_base__ref_get(lcl_x), 
Pacioli.$base_base__ref_get(lcl_y)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__while(
function () {
return Pacioli.$base_base_not_equal(
Pacioli.$base_base__ref_get(lcl_path), 
Pacioli.$base_list_empty_list(
));} ,
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base_apply(function (fresh_angle0, fresh_distance0) {
return Pacioli.$base_base__seq(Pacioli.$base_base__ref_set(lcl_angle, fresh_angle0),
Pacioli.$base_base__ref_set(lcl_distance, fresh_distance0)
); }, Pacioli.$base_list_head(
Pacioli.$base_base__ref_get(lcl_path))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_direction, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_direction), 
Pacioli.$base_base__ref_get(lcl_angle))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_x, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_x), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_base__ref_get(lcl_distance), 
Pacioli.$base_matrix_sin(
Pacioli.$base_base__ref_get(lcl_direction))))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_y, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_y), 
Pacioli.$base_matrix_multiply(
Pacioli.$base_base__ref_get(lcl_distance), 
Pacioli.$base_matrix_cos(
Pacioli.$base_base__ref_get(lcl_direction))))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_coords, Pacioli.$base_list_cons(
Pacioli.$base_base_tuple(
Pacioli.$base_base__ref_get(lcl_x), 
Pacioli.$base_base__ref_get(lcl_y)), 
Pacioli.$base_base__ref_get(lcl_coords))), 
Pacioli.$base_base__ref_set(lcl_path, Pacioli.$base_list_tail(
Pacioli.$base_base__ref_get(lcl_path))))))));}), 
Pacioli.$base_base__throw_result(sym_1029, Pacioli.$base_base__ref_get(lcl_coords))))))); } ,
sym_1029); }( 
Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__new_ref(lcl_path), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref());
}


Pacioli.compute_u_$geometry_geometry_surface_area = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$geometry_geometry_surface_area = function (lcl_surface) {
return Pacioli.$standard_standard__list_sum(
(function (lcl__c_accu28) { return Pacioli.$base_list_loop_list(
lcl__c_accu28, 
function (lcl__c_accu28, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu28, 
Pacioli.$base_base_apply(
Pacioli.fetchValue('$geometry_geometry', 'triangle_area'), 
lcl_x));}, 
lcl_surface);})(
Pacioli.$base_list_empty_list(
)));
}


Pacioli.compute_u_info_with_info_body_area_growth = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_with_info_body_area_growth = function (lcl_body_area_growth, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl__, lcl_body_area, lcl_body_volume_growth, lcl_body_volume) { return Pacioli.$base_base_tuple(
lcl_aperture_area, 
lcl_body_area_growth, 
lcl_body_area, 
lcl_body_volume_growth, 
lcl_body_volume);}, 
lcl_record);
}


Pacioli.compute_u_curve_curve_reverse = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.curve_curve_reverse = function (lcl_curve) {
return Pacioli.$base_list_reverse(
lcl_curve);
}


Pacioli.compute_u_curve_as_curve = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.curve_as_curve = function (lcl_vs) {
return lcl_vs;
}


Pacioli.compute_u_curve_segment_volume = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.curve_segment_volume = function (lcl_curve, lcl_next) {
return Pacioli.$geometry_geometry_surface_volume(
Pacioli.curve_segment_closed_surface(
lcl_curve, 
lcl_next));
}


Pacioli.compute_u_curve_curve_rotation = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE));
}

Pacioli.curve_curve_rotation = function (lcl_curve, lcl_landmarks) {
return Pacioli.curve_compute_rotation(
Pacioli.$base_list_nth(
Pacioli.$base_list_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_landmarks), 
lcl_curve), 
Pacioli.$base_list_nth(
Pacioli.$base_list_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
lcl_landmarks), 
lcl_curve), 
Pacioli.$base_list_nth(
Pacioli.$base_list_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
lcl_landmarks), 
lcl_curve), 
Pacioli.$base_list_nth(
Pacioli.$base_list_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 3]]), 
lcl_landmarks), 
lcl_curve));
}


Pacioli.compute_u_model_with_settings_landmarks = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.model_with_settings_landmarks = function (lcl_landmarks, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl__) { return Pacioli.$base_base_tuple(
lcl_initial, 
lcl_gvm, 
lcl_factor, 
lcl_nr_ticks, 
lcl_landmarks);}, 
lcl_record);
}


Pacioli.compute_u_$graphics_color_make_color = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("String", []));
}

Pacioli.$graphics_color_make_color = function (lcl_color) {
return lcl_color;
}


Pacioli.compute_u_model_settings_initial = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.model_settings_initial = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_initial, lcl_gvm, lcl_factor, lcl_nr_ticks, lcl_landmarks) { return lcl_initial;}, 
lcl_record);
}


Pacioli.compute_u_$geometry_geometry_z_rotation = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE));
}

Pacioli.$geometry_geometry_z_rotation = function (lcl_angle) {
return Pacioli.$geometry_geometry_matrix3d(
Pacioli.$base_matrix_cos(
lcl_angle), 
Pacioli.$base_matrix_negative(
Pacioli.$base_matrix_sin(
lcl_angle)), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$base_matrix_sin(
lcl_angle), 
Pacioli.$base_matrix_cos(
lcl_angle), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));
}


Pacioli.compute_u_info_with_info_body_volume = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.info_with_info_body_volume = function (lcl_body_volume, lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_aperture_area, lcl_body_area_growth, lcl_body_area, lcl_body_volume_growth, lcl__) { return Pacioli.$base_base_tuple(
lcl_aperture_area, 
lcl_body_area_growth, 
lcl_body_area, 
lcl_body_volume_growth, 
lcl_body_volume);}, 
lcl_record);
}


Pacioli.compute_u_shells_rectangle_path = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.shells_rectangle_path = function (lcl_w, lcl_h) {
return (function (lcl_turn) { return Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_divide(
lcl_h, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])))), 
Pacioli.$base_base_tuple(
lcl_turn, 
lcl_w)), 
Pacioli.$base_base_tuple(
lcl_turn, 
lcl_h)), 
Pacioli.$base_base_tuple(
lcl_turn, 
lcl_w));})(
Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_multiply(
Pacioli.fetchValue('$standard_standard', 'pi'), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])));
}


Pacioli.compute_u_model_growth_vector_map = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.model_growth_vector_map = function (lcl_curve, lcl_translation, lcl_growth_constant, lcl_rotation, lcl_landmarks) {
return (function (lcl_inv_rot) { return (function (lcl_s) { return (function (lcl_t) { return (function (lcl_u) { return (function (lcl_diff) { return Pacioli.curve_transform_curve(
lcl_diff, 
lcl_inv_rot);})(
Pacioli.curve_sum_curves(
lcl_u, 
Pacioli.curve_scale_curve(
lcl_curve, 
Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))));})(
Pacioli.curve_translate_curve(
lcl_t, 
lcl_translation));})(
Pacioli.curve_transform_curve(
lcl_s, 
lcl_rotation));})(
Pacioli.curve_scale_curve(
lcl_curve, 
lcl_growth_constant));})(
Pacioli.$standard_matrix_inverse(
Pacioli.curve_curve_rotation(
lcl_curve, 
lcl_landmarks)));
}


Pacioli.compute_u_$standard_matrix_inner = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$standard_matrix_inner = function (lcl_x, lcl_y) {
return Pacioli.$base_matrix_mmult(
Pacioli.$base_matrix_transpose(
lcl_x), 
lcl_y);
}


Pacioli.compute_u_curve_compute_rotation = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE));
}

Pacioli.curve_compute_rotation = function (lcl_left, lcl_top, lcl_right, lcl_bottom) {
return Pacioli.$base_base_apply(
function (lcl_ex, lcl_ey, lcl_ez) { return (function (lcl_width) { return (function (lcl_height) { return Pacioli.$base_matrix_magnitude(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_mmult(
Pacioli.$standard_matrix_normalized(
lcl_width), 
Pacioli.$base_matrix_transpose(
lcl_ex)), 
Pacioli.$base_matrix_mmult(
Pacioli.$standard_matrix_normalized(
Pacioli.$geometry_geometry_cross_sqrt(
lcl_width, 
lcl_height)), 
Pacioli.$base_matrix_transpose(
lcl_ey))), 
Pacioli.$base_matrix_mmult(
Pacioli.$standard_matrix_normalized(
lcl_height), 
Pacioli.$base_matrix_transpose(
lcl_ez))));})(
Pacioli.$base_matrix_minus(
lcl_top, 
lcl_bottom));})(
Pacioli.$base_matrix_minus(
lcl_right, 
lcl_left));}, 
Pacioli.fetchValue('$geometry_geometry', 'basis3d'));
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


Pacioli.compute_u_$standard_matrix_delta = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", ['_P_']), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$standard_matrix_delta = function (lcl_p) {
return Pacioli.$base_matrix_make_matrix(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
lcl_p, 
Pacioli.fetchValue('$base_matrix', '_'), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));
}


Pacioli.compute_u_$standard_matrix_normalized = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$standard_matrix_normalized = function (lcl_x) {
return Pacioli.$base_matrix_scale_down(
lcl_x, 
Pacioli.$base_matrix_magnitude(
Pacioli.$standard_matrix_norm(
lcl_x)));
}


Pacioli.compute_u_$graphics_mesh_with_material = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("String", [])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), new Pacioli.PowerProduct('_Geom3!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("Boole", []), new Pacioli.GenericType("String", [])]));
}

Pacioli.$graphics_mesh_with_material = function (lcl_mesh, lcl_material) {
return Pacioli.$base_base_apply(
function (lcl_vs, lcl_fs, lcl_pos, lcl_name, lcl_wireframe, lcl__69) { return Pacioli.$base_base_tuple(
lcl_vs, 
lcl_fs, 
lcl_pos, 
lcl_name, 
lcl_wireframe, 
lcl_material);}, 
lcl_mesh);
}


Pacioli.compute_u_curve_translate_curve = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.curve_translate_curve = function (lcl_curve, lcl_offset) {
return (function (lcl__c_accu62) { return Pacioli.$base_list_loop_list(
lcl__c_accu62, 
function (lcl__c_accu62, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu62, 
Pacioli.$base_matrix_sum(
lcl_x, 
lcl_offset));}, 
lcl_curve);})(
Pacioli.$base_list_empty_list(
));
}
Pacioli.compute_sbase_mole = function () { return {symbol: 'mol'}};
Pacioli.compute_sbase_ampere = function () { return {symbol: 'A'}};
Pacioli.compute_sbase_second = function () { return {symbol: 's'}};
Pacioli.compute_sbase_minute = function () {
    return {definition: Pacioli.DimNum.fromNumber(60, Pacioli.unitType('second').expt(1)), symbol: 'min'}
}
Pacioli.compute_sbase_hour = function () {
    return {definition: Pacioli.DimNum.fromNumber(3600, Pacioli.unitType('second').expt(1)), symbol: 'hr'}
}
Pacioli.compute_sbase_day = function () {
    return {definition: Pacioli.DimNum.fromNumber(1440, Pacioli.unitType('minute').expt(1)), symbol: 'd'}
}
Pacioli.compute_sbase_pi = function () {
    return {definition: Pacioli.DimNum.fromNumber(3.141592653589793, Pacioli.ONE), symbol: 'pi'}
}
Pacioli.compute_sbase_becquerel = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(-1)), symbol: 'Bq'}
}
Pacioli.compute_sbase_gram = function () { return {symbol: 'g'}};
Pacioli.compute_sbase_metre = function () { return {symbol: 'm'}};
Pacioli.compute_sbase_newton = function () {
    return {definition: Pacioli.DimNum.fromNumber(1000.00000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(-2).mult(Pacioli.unitType('gram').expt(1).mult(Pacioli.unitType('metre').expt(1)))), symbol: 'N'}
}
Pacioli.compute_sbase_joule = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unitType('second').expt(-2).mult(Pacioli.unitType('kilo', 'gram').expt(1).mult(Pacioli.unitType('metre').expt(2)))), symbol: 'J'}
}
Pacioli.compute_sbase_watt = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('newton').expt(1).mult(Pacioli.unitType('second').expt(-1).mult(Pacioli.unitType('metre').expt(1)))), symbol: 'W'}
}
Pacioli.compute_sbase_volt = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.000000000000000000000000000000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(-1).mult(Pacioli.unitType('ampere').expt(-1).mult(Pacioli.unitType('joule').expt(1)))), symbol: 'V'}
}
Pacioli.compute_sbase_coulomb = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.unitType('second').expt(1).mult(Pacioli.unitType('ampere').expt(1))), symbol: 'C'}
}
Pacioli.compute_sbase_farad = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(1).mult(Pacioli.unitType('ampere').expt(2).mult(Pacioli.unitType('watt').expt(-1)))), symbol: 'F'}
}
Pacioli.compute_sbase_weber = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unitType('second').expt(1).mult(Pacioli.unitType('ampere').expt(-1).mult(Pacioli.unitType('watt').expt(1)))), symbol: 'Wb'}
}
Pacioli.compute_sbase_henry = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(1).mult(Pacioli.unitType('ampere').expt(-1).mult(Pacioli.unitType('volt').expt(1)))), symbol: 'H'}
}
Pacioli.compute_sbase_pascal = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.000000000000000000000000000000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(-2).mult(Pacioli.unitType('kilo', 'gram').expt(1).mult(Pacioli.unitType('metre').expt(-1)))), symbol: 'Pa'}
}
Pacioli.compute_sbase_kelvin = function () { return {symbol: 'K'}};
Pacioli.compute_sbase_degree_celcius = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.unitType('kelvin').expt(1)), symbol: '°C'}
}
Pacioli.compute_sbase_steradian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.ONE), symbol: 'sr'}
}
Pacioli.compute_sbase_ohm = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.000000000000000000000000000000000000000000000000000000000000000000000000000, Pacioli.unitType('ampere').expt(-2).mult(Pacioli.unitType('watt').expt(1))), symbol: 'Ω'}
}
Pacioli.compute_sbase_tesla = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(1).mult(Pacioli.unitType('volt').expt(1).mult(Pacioli.unitType('metre').expt(-2)))), symbol: 'T'}
}
Pacioli.compute_sbase_radian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: 'rad'}
}
Pacioli.compute_sbase_degree = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.0174532925199432944444445840707846039908, Pacioli.ONE), symbol: '°'}
}
Pacioli.compute_sbase_candela = function () { return {symbol: 'cd'}};
Pacioli.compute_sbase_lumen = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('candela').expt(1)), symbol: 'lm'}
}
Pacioli.compute_sbase_lux = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.000000000000000000000000000000000000000000000000000000000000000000000000000, Pacioli.unitType('steradian').expt(-1).mult(Pacioli.unitType('candela').expt(1).mult(Pacioli.unitType('metre').expt(-2)))), symbol: 'lx'}
}
Pacioli.compute_sbase_dollar = function () { return {symbol: '$'}};
Pacioli.compute_sbase_decimals = function () { return {symbol: 'decs'}};
Pacioli.compute_sbase_katal = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(-1).mult(Pacioli.unitType('mole').expt(1))), symbol: 'kat'}
}
Pacioli.compute_sbase_litre = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.001, Pacioli.unitType('metre').expt(3)), symbol: 'l'}
}
Pacioli.compute_sbase_gray = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.00100000000000000000000000000000000000000000000000, Pacioli.unitType('newton').expt(1).mult(Pacioli.unitType('gram').expt(-1).mult(Pacioli.unitType('metre').expt(1)))), symbol: 'Gy'}
}
Pacioli.compute_sbase_percent = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.01, Pacioli.ONE), symbol: '%'}
}

Pacioli.compute_index_$geometry_geometry_Geom3 = function () {return Pacioli.makeIndexSet('index_$geometry_geometry_Geom3', 'Geom3', [ "x","y","z" ])}
Pacioli.compute_sbase_siemens = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('ampere').expt(2).mult(Pacioli.unitType('watt').expt(-1))), symbol: 'S'}
}
Pacioli.compute_sbase_hertz = function () { return {symbol: 'Hz'}};

Pacioli.compute_index_$geometry_geometry_Geom2 = function () {return Pacioli.makeIndexSet('index_$geometry_geometry_Geom2', 'Geom2', [ "x","y" ])}
Pacioli.compute_sbase_sievert = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.00100000000000000000000000000000000000000000000000, Pacioli.unitType('newton').expt(1).mult(Pacioli.unitType('gram').expt(-1).mult(Pacioli.unitType('metre').expt(1)))), symbol: 'Sv'}
}

Pacioli.compute_u_$standard_standard_pi = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_$standard_standard_pi = function () {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 3.141592653589793]]);
}

Pacioli.compute_u_curve_SEGMENT_VERTEX_COLOR = function () {
    return new Pacioli.GenericType("String", []);
}
Pacioli.compute_curve_SEGMENT_VERTEX_COLOR = function () {
  return Pacioli.$graphics_color_make_color(
"steelblue");
}

Pacioli.compute_u_$geometry_geometry_basis3d = function () {
    return new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['$geometry_geometry_Geom3']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_$geometry_geometry_basis3d = function () {
  return Pacioli.$base_base_tuple(
Pacioli.$standard_matrix_delta(
Pacioli.createCoordinates([['x','index_$geometry_geometry_Geom3']])), 
Pacioli.$standard_matrix_delta(
Pacioli.createCoordinates([['y','index_$geometry_geometry_Geom3']])), 
Pacioli.$standard_matrix_delta(
Pacioli.createCoordinates([['z','index_$geometry_geometry_Geom3']])));
}
