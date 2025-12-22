

Pacioli.compute_u_net_behavior_run_petri_net_trace_aux = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_trace_aux = function (lcl_net, lcl_trace, lcl_verbose) {
return function (sym_452, lcl_fired, lcl_valid, lcl_net, lcl_not_fired, lcl_valid, lcl_count, lcl_fired, lcl_not_fired, lcl_count) {
return Pacioli.$base_base__catch_result(
function () {
return Pacioli.$base_base__seq(
(lcl_verbose ? Pacioli.$standard_standard_printf(
"Running Petri net with initial state\n%d", 
Pacioli.$petri_net_petri_net_petri_net_marking(
Pacioli.$base_base__ref_get(lcl_net))) : Pacioli.$base_system__skip(
) ), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_valid, true), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_count, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_fired, Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$petri_net_petri_net_transition_unit(
Pacioli.$base_base__ref_get(lcl_net)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_not_fired, Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$petri_net_petri_net_transition_unit(
Pacioli.$base_base__ref_get(lcl_net)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__for(lcl_trace,function (lcl_v) { return Pacioli.$base_base__seq(
(lcl_verbose ? Pacioli.$standard_standard_printf(
"\n--- Step %d ---\n", 
Pacioli.$base_base__ref_get(lcl_count)) : Pacioli.$base_system__skip(
) ), 
((Pacioli.$base_base__ref_get(lcl_valid) ? Pacioli.$petri_net_petri_net_petri_net_enabled(
Pacioli.$base_base__ref_get(lcl_net), 
lcl_v) : false ) ? Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_net, Pacioli.$petri_net_petri_net_fire_petri_net(
Pacioli.$base_base__ref_get(lcl_net), 
lcl_v)), 
Pacioli.$base_base__seq(
(lcl_verbose ? Pacioli.net_behavior_print_firing(
Pacioli.$base_base__ref_get(lcl_net), 
lcl_v, 
Pacioli.$base_base__ref_get(lcl_count)) : Pacioli.$base_system__skip(
) ), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_fired, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_fired), 
lcl_v)), 
Pacioli.$base_base__ref_set(lcl_count, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_count), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))))) : Pacioli.$base_base__seq(
((lcl_verbose ? Pacioli.$base_base__ref_get(lcl_valid) : false ) ? Pacioli.$standard_standard_printf(
"HALT!") : Pacioli.$base_system__skip(
) ), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_valid, false), 
Pacioli.$base_base__ref_set(lcl_not_fired, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_not_fired), 
lcl_v)))) ));}), 
Pacioli.$base_base__throw_result(sym_452, Pacioli.$base_base_tuple(
Pacioli.$base_base__ref_get(lcl_net), 
Pacioli.$base_base__ref_get(lcl_valid), 
Pacioli.$base_base__ref_get(lcl_count), 
Pacioli.$base_base__ref_get(lcl_fired), 
Pacioli.$base_base__ref_get(lcl_not_fired))))))))); } ,
sym_452); }( 
Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__new_ref(lcl_net), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref());
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_post = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_petri_net_post = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_pre, lcl_post, lcl_marking) { return lcl_post;}, 
lcl_record);
}


Pacioli.compute_u_$petri_net_petri_net_transition_unit = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_transition_unit = function (lcl_net) {
return Pacioli.$base_matrix_column_unit(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_$standard_standard__list_sum = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1))])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1)));
}

Pacioli.$standard_standard__list_sum = function (lcl_x) {
return Pacioli.$base_list_fold_list(
Pacioli.fetchValue('$base_matrix', 'sum'), 
lcl_x);
}


Pacioli.compute_u_net_behavior_trace = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_A_', Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_A_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_trace = function (lcl_events) {
return (function (lcl__c_accu66) { return Pacioli.$base_list_loop_list(
lcl__c_accu66, 
function (lcl__c_accu66, lcl__c_tup67) { return Pacioli.$base_base_apply(
function (lcl_transition, lcl_amount) { return Pacioli.$base_system__add_mut(
lcl__c_accu66, 
Pacioli.$base_matrix_scale(
lcl_amount, 
Pacioli.$standard_matrix_delta(
lcl_transition)));}, 
lcl__c_tup67);}, 
lcl_events);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_marking = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_petri_net_marking = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_pre, lcl_post, lcl_marking) { return lcl_marking;}, 
lcl_record);
}


Pacioli.compute_u_net_behavior_graph = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_D_', new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_C_', Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_C_', Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]));
}

Pacioli.net_behavior_graph = function (lcl_net) {
return (function (lcl_C) { return (function (lcl_P) { return (function (lcl_arrows) { return (function (lcl__c_accu76) { return Pacioli.$base_list_loop_list(
lcl__c_accu76, 
function (lcl__c_accu76, lcl_t) { return (function (lcl_cons) { return (function (lcl_prod) { return ((Pacioli.$base_base_not_equal(
lcl_cons, 
Pacioli.$base_list_empty_list(
)) ? true : Pacioli.$base_base_not_equal(
lcl_prod, 
Pacioli.$base_list_empty_list(
)) ) ? Pacioli.$base_system__add_mut(
lcl__c_accu76, 
Pacioli.$base_base_tuple(
lcl_t, 
lcl_cons, 
lcl_prod)) : lcl__c_accu76 );})(
(lcl_arrows)(
lcl_P, 
lcl_t));})(
(lcl_arrows)(
lcl_C, 
lcl_t));}, 
Pacioli.$petri_net_petri_net_petri_net_transitions(
lcl_net));})(
Pacioli.$base_list_empty_list(
));})(
function (lcl_A, lcl_t) { return (function (lcl__c_accu74) { return Pacioli.$base_list_loop_list(
lcl__c_accu74, 
function (lcl__c_accu74, lcl_p) { return (function (lcl_val) { return (Pacioli.$base_matrix_greater(
lcl_val, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.$base_system__add_mut(
lcl__c_accu74, 
Pacioli.$base_base_tuple(
lcl_p, 
lcl_val)) : lcl__c_accu74 );})(
Pacioli.$base_matrix_get_num(
lcl_A, 
lcl_p, 
lcl_t));}, 
Pacioli.$petri_net_petri_net_petri_net_places(
lcl_net));})(
Pacioli.$base_list_empty_list(
));});})(
Pacioli.$petri_net_petri_net_petri_net_post(
lcl_net));})(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_$standard_string_join_strings = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("String", [])]), new Pacioli.GenericType("String", []));
}

Pacioli.$standard_string_join_strings = function (lcl_items, lcl_seperator) {
return (Pacioli.$base_base_equal(
lcl_items, 
Pacioli.$base_list_empty_list(
)) ? "" : Pacioli.$base_list_fold_list(
function (lcl_x, lcl_y) { return Pacioli.$base_string_concatenate(
lcl_x, 
Pacioli.$base_string_concatenate(
lcl_seperator, 
lcl_y));}, 
lcl_items) );
}


Pacioli.compute_u_net_behavior_enabled_transitions = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", ['_D_']));
}

Pacioli.net_behavior_enabled_transitions = function (lcl_net) {
return (function (lcl__c_accu80) { return Pacioli.$base_list_loop_list(
lcl__c_accu80, 
function (lcl__c_accu80, lcl_t) { return (function (lcl_vec) { return (Pacioli.$petri_net_petri_net_petri_net_enabled(
lcl_net, 
lcl_vec) ? Pacioli.$base_system__add_mut(
lcl__c_accu80, 
lcl_t) : lcl__c_accu80 );})(
Pacioli.$standard_matrix_delta(
lcl_t));}, 
Pacioli.$petri_net_petri_net_petri_net_transitions(
lcl_net));})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_enabled = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$petri_net_petri_net_petri_net_enabled = function (lcl_net, lcl_amount) {
return Pacioli.$base_matrix_less_eq(
Pacioli.$base_matrix_mmult(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net), 
lcl_amount), 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net));
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_transitions = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", ['_T_']));
}

Pacioli.$petri_net_petri_net_petri_net_transitions = function (lcl_net) {
return Pacioli.$base_matrix_column_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_$standard_standard_printf = function () {
    return new Pacioli.FunctionType(Pacioli.typeFromVarName('_t_'), new Pacioli.GenericType("Void", []));
}

Pacioli.$standard_standard_printf = function (...lcl_args) {
return Pacioli.$base_io_print(
Pacioli.$base_base_apply(
Pacioli.fetchValue('$base_string', 'format'), 
lcl_args));
}


Pacioli.compute_u_net_behavior_print_firing = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_e_').expt(1), '_D_', new Pacioli.PowerProduct('_D!f_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.typeFromVarName('_g_')]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_firing = function (lcl_net, lcl_firing, lcl_count) {
return (function (lcl_enabled) { return function (sym_456) {
return Pacioli.$base_base__catch_void(
function () {
return Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"Firing %s\nleads to state", 
Pacioli.$standard_string_join_strings(
lcl_enabled, 
", and ")), 
Pacioli.$standard_standard_printf(
"%d", 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net))); } ,
sym_456); }( 
Pacioli.$base_base__empty_ref());})(
(function (lcl__c_accu82) { return Pacioli.$base_list_loop_list(
lcl__c_accu82, 
function (lcl__c_accu82, lcl_t) { return (function (lcl_val) { return (Pacioli.$base_matrix_greater(
lcl_val, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.$base_system__add_mut(
lcl__c_accu82, 
Pacioli.$base_string_format(
"\n  transition %s %d times", 
lcl_t, 
lcl_val)) : lcl__c_accu82 );})(
Pacioli.$base_matrix_get_num(
lcl_firing, 
lcl_t, 
Pacioli.fetchValue('$base_matrix', '_')));}, 
Pacioli.$petri_net_petri_net_petri_net_transitions(
lcl_net));})(
Pacioli.$base_list_empty_list(
)));
}


Pacioli.compute_u_net_behavior_run_petri_net_trace_verbose = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_trace_verbose = function (lcl_net, lcl_trace) {
return Pacioli.net_behavior_run_petri_net_trace_aux(
lcl_net, 
lcl_trace, 
true);
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_pre = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_petri_net_pre = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_pre, lcl_post, lcl_marking) { return lcl_pre;}, 
lcl_record);
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


Pacioli.compute_u_net_behavior_print_transition = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_a_'), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_b_'), Pacioli.typeFromVarName('_c_')])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_d_'), Pacioli.typeFromVarName('_e_')])])]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_transition = function (lcl_t, lcl_cons, lcl_prod) {
return (function (lcl_text) { return function (sym_450) {
return Pacioli.$base_base__catch_void(
function () {
return Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"Transition %s consumes", 
lcl_t), 
Pacioli.$base_base__seq(
Pacioli.$base_io_print(
(lcl_text)(
lcl_cons)), 
Pacioli.$base_base__seq(
Pacioli.$base_io_print(
"and produces"), 
Pacioli.$base_io_print(
(lcl_text)(
lcl_prod))))); } ,
sym_450); }( 
Pacioli.$base_base__empty_ref());})(
function (lcl_x) { return (Pacioli.$base_base_equal(
lcl_x, 
Pacioli.$base_list_empty_list(
)) ? "  nothing" : Pacioli.$standard_string_join_strings(
(function (lcl__c_accu78) { return Pacioli.$base_list_loop_list(
lcl__c_accu78, 
function (lcl__c_accu78, lcl__c_tup79) { return Pacioli.$base_base_apply(
function (lcl_p, lcl_v) { return (function (lcl_txt) { return Pacioli.$base_system__add_mut(
lcl__c_accu78, 
lcl_txt);})(
Pacioli.$base_string_format(
"  %d from %s", 
lcl_v, 
lcl_p));}, 
lcl__c_tup79);}, 
lcl_x);})(
Pacioli.$base_list_empty_list(
)), 
"\n") );});
}


Pacioli.compute_u_$random_random_pick = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.typeFromVarName('_t_')])]), Pacioli.typeFromVarName('_t_'));
}

Pacioli.$random_random_pick = function (lcl_xs) {
return Pacioli.$base_list_nth(
Pacioli.$random_random_random_nat(
Pacioli.$base_list_list_size(
lcl_xs)), 
lcl_xs);
}


Pacioli.compute_u_net_behavior_run_petri_net_random = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_random = function (lcl_net, lcl_n) {
return function (sym_454, lcl_total, lcl_available, lcl_firing, lcl_available, lcl_todo, lcl_todo, lcl_i, lcl_total, lcl_todo, lcl_m, lcl_net, lcl_i) {
return Pacioli.$base_base__catch_result(
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_m, Pacioli.$base_matrix_expt(
Pacioli.initialNumbers(1, 1, [[0, 0, 10]]), 
Pacioli.$base_matrix_minus(
Pacioli.$base_matrix_ceiling(
Pacioli.$base_matrix_log(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 10]]))), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_todo, Pacioli.net_behavior_simple_trace(
Pacioli.net_behavior_enabled_transitions(
Pacioli.$base_base__ref_get(lcl_net)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_available, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_total, Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$petri_net_petri_net_transition_unit(
Pacioli.$base_base__ref_get(lcl_net)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__while(
function () {
return (Pacioli.$base_base_not_equal(
Pacioli.$base_base__ref_get(lcl_todo), 
Pacioli.$base_list_empty_list(
)) ? Pacioli.$base_matrix_less(
Pacioli.$base_base__ref_get(lcl_i), 
lcl_n) : false );} ,
function () {
return Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"\n--- Step %d ---\n", 
Pacioli.$base_base__ref_get(lcl_i)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_available, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_available), 
Pacioli.$base_list_list_size(
Pacioli.$base_base__ref_get(lcl_todo)))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_firing, Pacioli.$random_random_pick(
Pacioli.$base_base__ref_get(lcl_todo))), 
Pacioli.$base_base__seq(
(Pacioli.$petri_net_petri_net_petri_net_enabled(
Pacioli.$base_base__ref_get(lcl_net), 
Pacioli.$base_base__ref_get(lcl_firing)) ? Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_total, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_total), 
Pacioli.$base_base__ref_get(lcl_firing))), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_net, Pacioli.$petri_net_petri_net_fire_petri_net(
Pacioli.$base_base__ref_get(lcl_net), 
Pacioli.$base_base__ref_get(lcl_firing))), 
Pacioli.$base_base__seq(
((Pacioli.$base_base_equal(
Pacioli.$base_matrix_mod(
Pacioli.$base_base__ref_get(lcl_i), 
Pacioli.$base_base__ref_get(lcl_m)), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? true : true ) ? Pacioli.net_behavior_print_firing(
Pacioli.$base_base__ref_get(lcl_net), 
Pacioli.$base_base__ref_get(lcl_total), 
Pacioli.$base_base__ref_get(lcl_i)) : Pacioli.$base_system__skip(
) ), 
Pacioli.$base_base__ref_set(lcl_todo, Pacioli.net_behavior_simple_trace(
Pacioli.net_behavior_enabled_transitions(
Pacioli.$base_base__ref_get(lcl_net))))))) : Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"HALT!"), 
Pacioli.$base_base__ref_set(lcl_todo, Pacioli.$base_list_empty_list(
))) ), 
Pacioli.$base_base__ref_set(lcl_i, Pacioli.$base_matrix_sum(
Pacioli.$base_base__ref_get(lcl_i), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))))));}), 
Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"\nAverage available transitions per step: %.1f", 
Pacioli.$base_matrix_divide(
Pacioli.$base_base__ref_get(lcl_available), 
lcl_n)), 
Pacioli.$base_base__throw_result(sym_454, Pacioli.$base_base_tuple(
false, 
Pacioli.$petri_net_petri_net_petri_net_marking(
Pacioli.$base_base__ref_get(lcl_net)), 
Pacioli.$base_base__ref_get(lcl_i), 
Pacioli.$base_base__ref_get(lcl_total)))))))))); } ,
sym_454); }( 
Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__new_ref(lcl_net), Pacioli.$base_base__empty_ref());
}


Pacioli.compute_u_$petri_net_petri_net_fire_petri_net = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$petri_net_petri_net_fire_petri_net = function (lcl_net, lcl_amount) {
return Pacioli.$petri_net_petri_net_make_petri_net(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net), 
Pacioli.$petri_net_petri_net_petri_net_post(
lcl_net), 
Pacioli.$base_matrix_sum(
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net), 
Pacioli.$base_matrix_mmult(
Pacioli.$petri_net_petri_net_petri_net_flow(
lcl_net), 
lcl_amount)));
}


Pacioli.compute_u_net_behavior_print_summary = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_summary = function (lcl_outcome) {
return Pacioli.$base_base_apply(
function (lcl_final_net, lcl_valid, lcl_count, lcl_fired, lcl_not_fired) { return function (sym_455) {
return Pacioli.$base_base__catch_void(
function () {
return Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"\nTrace is %s. Steps performed is %d. Final marking is%d", 
(lcl_valid ? "valid" : "invalid" ), 
lcl_count, 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_final_net)), 
Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"\nFired transitions%d", 
lcl_fired), 
Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"\nNot fired transitions%d", 
lcl_not_fired), 
Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"\nConsumed%d", 
Pacioli.$base_matrix_mmult(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_final_net), 
lcl_fired)), 
Pacioli.$standard_standard_printf(
"\nProduced%d", 
Pacioli.$base_matrix_mmult(
Pacioli.$petri_net_petri_net_petri_net_post(
lcl_final_net), 
lcl_fired)))))); } ,
sym_455); }( 
Pacioli.$base_base__empty_ref());}, 
lcl_outcome);
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_flow = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_petri_net_flow = function (lcl_net) {
return Pacioli.$base_matrix_minus(
Pacioli.$petri_net_petri_net_petri_net_post(
lcl_net), 
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_$petri_net_petri_net_make_petri_net = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$petri_net_petri_net_make_petri_net = function (lcl_pre, lcl_post, lcl_marking) {
return Pacioli.$base_base_tuple(
lcl_pre, 
lcl_post, 
lcl_marking);
}


Pacioli.compute_u_net_behavior_parallel_trace = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_A_', Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_A_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_parallel_trace = function (lcl_xs) {
return (function (lcl__c_accu70) { return Pacioli.$base_list_loop_list(
lcl__c_accu70, 
function (lcl__c_accu70, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu70, 
Pacioli.$standard_standard__list_sum(
(function (lcl__c_accu68) { return Pacioli.$base_list_loop_list(
lcl__c_accu68, 
function (lcl__c_accu68, lcl_f) { return Pacioli.$base_system__add_mut(
lcl__c_accu68, 
lcl_f);}, 
Pacioli.net_behavior_trace(
lcl_x));})(
Pacioli.$base_list_empty_list(
))));}, 
lcl_xs);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_net_behavior_simple_trace = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", ['_A_'])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_A_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_simple_trace = function (lcl_events) {
return (function (lcl__c_accu64) { return Pacioli.$base_list_loop_list(
lcl__c_accu64, 
function (lcl__c_accu64, lcl_transition) { return Pacioli.$base_system__add_mut(
lcl__c_accu64, 
Pacioli.$standard_matrix_delta(
lcl_transition));}, 
lcl_events);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$random_random_random_nat = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$random_random_random_nat = function (lcl_n) {
return Pacioli.$base_matrix_floor(
Pacioli.$base_matrix_multiply(
lcl_n, 
Pacioli.$base_matrix_random(
)));
}


Pacioli.compute_u_net_behavior_run_petri_net_trace = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_trace = function (lcl_net, lcl_trace) {
return Pacioli.net_behavior_run_petri_net_trace_aux(
lcl_net, 
lcl_trace, 
false);
}


Pacioli.compute_u_net_behavior_print_net_structure = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_net_structure = function (lcl_net) {
return function (sym_451) {
return Pacioli.$base_base__catch_void(
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_io_print(
"Petri net with places"), 
Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"  %s", 
Pacioli.$base_matrix_row_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net))), 
Pacioli.$base_base__seq(
Pacioli.$base_io_print(
"and transitions"), 
Pacioli.$base_base__seq(
Pacioli.$standard_standard_printf(
"  %s", 
Pacioli.$base_matrix_column_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net))), 
Pacioli.$base_base__for(Pacioli.net_behavior_graph(
lcl_net),function (lcl_transition) { return Pacioli.$base_base_apply(
Pacioli.fetchValue('net_behavior', 'print_transition'), 
lcl_transition);}))))); } ,
sym_451); }( 
Pacioli.$base_base__empty_ref());
}


Pacioli.compute_u_net_behavior_run_petri_net_mini_max = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", [])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.net_behavior_run_petri_net_mini_max = function (lcl_net, lcl_maximizing, lcl_evaluation) {
return function (sym_453, lcl_score, lcl_best_trace, lcl_marking, lcl_trace, lcl_best_trace, lcl_best_score, lcl_best_score, lcl_enabled) {
return Pacioli.$base_base__catch_result(
function () {
return Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_marking, Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_enabled, Pacioli.net_behavior_simple_trace(
Pacioli.net_behavior_enabled_transitions(
lcl_net))), 
(Pacioli.$base_base_equal(
Pacioli.$base_base__ref_get(lcl_enabled), 
Pacioli.$base_list_empty_list(
)) ? Pacioli.$base_base__throw_result(sym_453, Pacioli.$base_base_tuple(
(lcl_evaluation)(
Pacioli.$base_base__ref_get(lcl_marking), 
lcl_maximizing), 
Pacioli.$base_list_empty_list(
))) : Pacioli.$base_base__seq(
Pacioli.$base_base_apply(function (fresh_best_score0, fresh_best_trace0) {
return Pacioli.$base_base__seq(Pacioli.$base_base__ref_set(lcl_best_score, fresh_best_score0),
Pacioli.$base_base__ref_set(lcl_best_trace, fresh_best_trace0)
); }, Pacioli.net_behavior_run_petri_net_mini_max(
Pacioli.$petri_net_petri_net_fire_petri_net(
lcl_net, 
Pacioli.$base_list_head(
Pacioli.$base_base__ref_get(lcl_enabled))), 
Pacioli.$base_base_not(
lcl_maximizing), 
lcl_evaluation)), 
Pacioli.$base_base__seq(
Pacioli.$base_base__for(Pacioli.$base_list_tail(
Pacioli.$base_base__ref_get(lcl_enabled)),function (lcl_firing) { return Pacioli.$base_base__seq(
Pacioli.$base_base_apply(function (fresh_score0, fresh_trace0) {
return Pacioli.$base_base__seq(Pacioli.$base_base__ref_set(lcl_score, fresh_score0),
Pacioli.$base_base__ref_set(lcl_trace, fresh_trace0)
); }, Pacioli.net_behavior_run_petri_net_mini_max(
Pacioli.$petri_net_petri_net_fire_petri_net(
lcl_net, 
lcl_firing), 
Pacioli.$base_base_not(
lcl_maximizing), 
lcl_evaluation)), 
(((lcl_maximizing ? Pacioli.$base_matrix_greater(
Pacioli.$base_base__ref_get(lcl_score), 
Pacioli.$base_base__ref_get(lcl_best_score)) : false ) ? true : (Pacioli.$base_base_not(
lcl_maximizing) ? Pacioli.$base_matrix_less(
Pacioli.$base_base__ref_get(lcl_score), 
Pacioli.$base_base__ref_get(lcl_best_score)) : false ) ) ? Pacioli.$base_base__seq(
Pacioli.$base_base__ref_set(lcl_best_score, Pacioli.$base_base__ref_get(lcl_score)), 
Pacioli.$base_base__ref_set(lcl_best_trace, Pacioli.$base_base__ref_get(lcl_trace))) : Pacioli.$base_system__skip(
) ));}), 
Pacioli.$base_base__throw_result(sym_453, Pacioli.$base_base_tuple(
Pacioli.$base_base__ref_get(lcl_best_score), 
Pacioli.$base_base__ref_get(lcl_best_trace))))) ))); } ,
sym_453); }( 
Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref(), Pacioli.$base_base__empty_ref());
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_places = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", ['_P_']));
}

Pacioli.$petri_net_petri_net_petri_net_places = function (lcl_net) {
return Pacioli.$base_matrix_row_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}
Pacioli.compute_sbase_mole = function () { return {symbol: 'mol'}};
Pacioli.compute_sbase_gram = function () { return {symbol: 'g'}};
Pacioli.compute_sbase_ampere = function () { return {symbol: 'A'}};
Pacioli.compute_sbase_metre = function () { return {symbol: 'm'}};
Pacioli.compute_sbase_token = function () { return {symbol: 'tkn'}};
Pacioli.compute_sbase_percent = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.01, Pacioli.ONE), symbol: '%'}
}

Pacioli.compute_index_net_Place = function () {return Pacioli.makeIndexSet('index_net_Place', 'Place', [ "p0","p1","p2" ])}
Pacioli.compute_sbase_candela = function () { return {symbol: 'cd'}};

Pacioli.compute_index_$base_matrix_One = function () {return Pacioli.makeIndexSet('index_$base_matrix_One', 'One', [ "_" ])}
Pacioli.compute_sbase_second = function () { return {symbol: 's'}};
Pacioli.compute_sbase_hertz = function () { return {symbol: 'Hz'}};

Pacioli.compute_index_net_Transition = function () {return Pacioli.makeIndexSet('index_net_Transition', 'Transition', [ "t0","t1","t2" ])}
Pacioli.compute_sbase_kelvin = function () { return {symbol: 'K'}};
Pacioli.compute_sbase_decimals = function () { return {symbol: 'decs'}};
Pacioli.compute_sbase_radian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: 'rad'}
}

Pacioli.compute_u_net_post = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('token').expt(1), new Pacioli.IndexType(['net_Place']), Pacioli.ONE, new Pacioli.IndexType(['net_Transition']), Pacioli.ONE);
}
Pacioli.compute_net_post = function () {
  return Pacioli.initialNumbers(3, 3, [[0,0,1],[0,1,1],[1,1,1],[0,2,1],[2,2,2]]);
}

Pacioli.compute_u_net_initial_state = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('token').expt(1), new Pacioli.IndexType(['net_Place']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_net_initial_state = function () {
  return Pacioli.initialNumbers(3, 1, [[1,0,1],[2,0,1]]);
}

Pacioli.compute_u_net_pre = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('token').expt(1), new Pacioli.IndexType(['net_Place']), Pacioli.ONE, new Pacioli.IndexType(['net_Transition']), Pacioli.ONE);
}
Pacioli.compute_net_pre = function () {
  return Pacioli.initialNumbers(3, 3, [[0,1,1],[2,1,1],[0,2,1],[1,2,1]]);
}

Pacioli.compute_u_net_test_net = function () {
    return new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('token').expt(1), new Pacioli.IndexType(['net_Place']), Pacioli.ONE, new Pacioli.IndexType(['net_Transition']), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('token').expt(1), new Pacioli.IndexType(['net_Place']), Pacioli.ONE, new Pacioli.IndexType(['net_Transition']), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('token').expt(1), new Pacioli.IndexType(['net_Place']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_net_test_net = function () {
  return Pacioli.$petri_net_petri_net_make_petri_net(
Pacioli.fetchValue('net', 'pre'), 
Pacioli.fetchValue('net', 'post'), 
Pacioli.fetchValue('net', 'initial_state'));
}

Pacioli.compute_u_$base_matrix__ = function () {
    return new Pacioli.IndexType([]);
}
Pacioli.compute_$base_matrix__ = function () {
  return Pacioli.createCoordinates([]);
}

Pacioli.compute_u_net_my_trace = function () {
    return new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['net_Transition']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_net_my_trace = function () {
  return Pacioli.net_behavior_parallel_trace(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['t0','index_net_Transition']]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])))), 
Pacioli.$base_system__add_mut(
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['t1','index_net_Transition']]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['t2','index_net_Transition']]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])))), 
Pacioli.$base_system__add_mut(
Pacioli.$base_list_empty_list(
), 
Pacioli.$base_base_tuple(
Pacioli.createCoordinates([['t1','index_net_Transition']]), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])))));
}
