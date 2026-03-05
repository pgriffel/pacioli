

Pacioli.compute_u_$petri_net_petri_net_petri_net_marking = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_petri_net_marking = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_pre, lcl_post, lcl_marking) { return lcl_marking;}, 
lcl_record);
}


Pacioli.compute_u_net_behavior_print_firing = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_e_').expt(1), '_D_', Pacioli.unitFromVarName('_D!f_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.typeFromVarName('_g_')]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_firing = function (lcl_net, lcl_firing, lcl_count) {
return (function (lcl_enabled) { return (() => {
Pacioli.$standard_misc_printf(
"Firing %s\nleads to state", 
Pacioli.$standard_string_join_strings(
lcl_enabled, 
", and "))
Pacioli.$standard_misc_printf(
"%d", 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net))

})();})(
(function (lcl__c_accu84) { return Pacioli.$base_list_loop_list(
lcl__c_accu84, 
function (lcl__c_accu84, lcl_t) { return (function (lcl_val) { return (Pacioli.$base_matrix_greater(
lcl_val, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.$base_system__add_mut(
lcl__c_accu84, 
Pacioli.$base_string_format(
"\n  transition %s %d times", 
lcl_t, 
lcl_val)) : lcl__c_accu84 );})(
Pacioli.$base_matrix_get_num(
lcl_firing, 
lcl_t, 
Pacioli.fetchValue('$base_matrix', '_')));}, 
Pacioli.$petri_net_petri_net_petri_net_transitions(
lcl_net));})(
Pacioli.$base_list_empty_list(
)));
}


Pacioli.compute_u_subtraction_game_run_examples = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("Void", []));
}

Pacioli.subtraction_game_run_examples = function () {
return (() => {
Pacioli.$base_io_print(
"\nRunning example 1")
Pacioli.$base_io_print(
"=================")
Pacioli.subtraction_game_run_subtraction_game(
Pacioli.subtraction_game_subtraction_game(
Pacioli.initialNumbers(1, 1, [[0, 0, 10]])), 
Pacioli.fetchValue('subtraction_game', 'valid_game_moves'))
Pacioli.$base_io_print(
"\nRunning example 2")
Pacioli.$base_io_print(
"=================")
Pacioli.subtraction_game_run_subtraction_game(
Pacioli.subtraction_game_subtraction_game(
Pacioli.initialNumbers(1, 1, [[0, 0, 10]])), 
Pacioli.fetchValue('subtraction_game', 'invalid_game_moves'))

})();
}


Pacioli.compute_u_subtraction_game_run_subtraction_game_mini_max = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("String", []));
}

Pacioli.subtraction_game_run_subtraction_game_mini_max = function (lcl_n) {
return (function (lcl_evaluation) { return Pacioli.$base_base_apply(
function (lcl_score, lcl_trace) { return (Pacioli.$base_matrix_greater(
lcl_score, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? "player 1" : "player 2" );}, 
Pacioli.net_behavior_run_petri_net_mini_max(
Pacioli.subtraction_game_subtraction_game(
lcl_n), 
true, 
lcl_evaluation));})(
function (lcl_marking, lcl_maximizing) { return (lcl_maximizing ? Pacioli.initialNumbers(1, 1, [[0, 0, 1]]) : Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])) );});
}


Pacioli.compute_u_net_behavior_enabled_transitions = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", ['_D_']));
}

Pacioli.net_behavior_enabled_transitions = function (lcl_net) {
return (function (lcl__c_accu82) { return Pacioli.$base_list_loop_list(
lcl__c_accu82, 
function (lcl__c_accu82, lcl_t) { return (function (lcl_vec) { return (Pacioli.$petri_net_petri_net_petri_net_enabled(
lcl_net, 
lcl_vec) ? Pacioli.$base_system__add_mut(
lcl__c_accu82, 
lcl_t) : lcl__c_accu82 );})(
Pacioli.$standard_matrix_delta(
lcl_t));}, 
Pacioli.$petri_net_petri_net_petri_net_transitions(
lcl_net));})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$standard_misc__list_gcd = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, '_Q_', Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, '_Q_', Pacioli.ONE));
}

Pacioli.$standard_misc__list_gcd = function (lcl_x) {
return Pacioli.$base_list_fold_list(
Pacioli.fetchValue('$base_matrix', 'gcd'), 
lcl_x);
}


Pacioli.compute_u_$standard_misc_printf = function () {
    return new Pacioli.FunctionType(Pacioli.typeFromVarName('_t_'), new Pacioli.GenericType("Void", []));
}

Pacioli.$standard_misc_printf = function (...lcl_args) {
return Pacioli.$base_io_print(
Pacioli.$base_base_apply(
Pacioli.fetchValue('$base_string', 'format'), 
lcl_args));
}


Pacioli.compute_u_$petri_net_petri_net_transition_unit = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_transition_unit = function (lcl_net) {
return Pacioli.$base_matrix_column_unit(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_net_behavior_graph = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_D_', new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_C_', Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_C_', Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])])]));
}

Pacioli.net_behavior_graph = function (lcl_net) {
return (function (lcl_C) { return (function (lcl_P) { return (function (lcl_arrows) { return (function (lcl__c_accu78) { return Pacioli.$base_list_loop_list(
lcl__c_accu78, 
function (lcl__c_accu78, lcl_t) { return (function (lcl_cons) { return (function (lcl_prod) { return ((Pacioli.$base_base_not_equal(
lcl_cons, 
Pacioli.$base_list_empty_list(
)) ? true : Pacioli.$base_base_not_equal(
lcl_prod, 
Pacioli.$base_list_empty_list(
)) ) ? Pacioli.$base_system__add_mut(
lcl__c_accu78, 
Pacioli.$base_base_tuple(
lcl_t, 
lcl_cons, 
lcl_prod)) : lcl__c_accu78 );})(
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
function (lcl_A, lcl_t) { return (function (lcl__c_accu76) { return Pacioli.$base_list_loop_list(
lcl__c_accu76, 
function (lcl__c_accu76, lcl_p) { return (function (lcl_val) { return (Pacioli.$base_matrix_greater(
lcl_val, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.$base_system__add_mut(
lcl__c_accu76, 
Pacioli.$base_base_tuple(
lcl_p, 
lcl_val)) : lcl__c_accu76 );})(
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


Pacioli.compute_u_net_behavior_print_transition = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_a_'), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_b_'), Pacioli.typeFromVarName('_c_')])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_d_'), Pacioli.typeFromVarName('_e_')])])]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_transition = function (lcl_t, lcl_cons, lcl_prod) {
return (function (lcl_text) { return (() => {
Pacioli.$standard_misc_printf(
"Transition %s consumes", 
lcl_t)
Pacioli.$base_io_print(
(lcl_text)(
lcl_cons))
Pacioli.$base_io_print(
"and produces")
Pacioli.$base_io_print(
(lcl_text)(
lcl_prod))

})();})(
function (lcl_x) { return (Pacioli.$base_base_equal(
lcl_x, 
Pacioli.$base_list_empty_list(
)) ? "  nothing" : Pacioli.$standard_string_join_strings(
(function (lcl__c_accu80) { return Pacioli.$base_list_loop_list(
lcl__c_accu80, 
function (lcl__c_accu80, lcl__c_tup81) { return Pacioli.$base_base_apply(
function (lcl_p, lcl_v) { return (function (lcl_txt) { return Pacioli.$base_system__add_mut(
lcl__c_accu80, 
lcl_txt);})(
Pacioli.$base_string_format(
"  %d from %s", 
lcl_v, 
lcl_p));}, 
lcl__c_tup81);}, 
lcl_x);})(
Pacioli.$base_list_empty_list(
)), 
"\n") );});
}


Pacioli.compute_u_net_behavior_run_petri_net_random = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_random = function (lcl_net, lcl_n) {
return ((lcl_net) => {
let lcl_todo;
let lcl_total;
let lcl_available;
let lcl_firing;
let lcl_i;
let lcl_m;
lcl_m = Pacioli.$base_matrix_expt(
Pacioli.initialNumbers(1, 1, [[0, 0, 10]]), 
Pacioli.$base_matrix_minus(
Pacioli.$base_matrix_ceiling(
Pacioli.$base_matrix_log(
lcl_n, 
Pacioli.initialNumbers(1, 1, [[0, 0, 10]]))), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])));
lcl_todo = Pacioli.net_behavior_simple_trace(
Pacioli.net_behavior_enabled_transitions(
lcl_net));
lcl_i = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
lcl_available = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
lcl_total = Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$petri_net_petri_net_transition_unit(
lcl_net));
while ((Pacioli.$base_base_not_equal(
lcl_todo, 
Pacioli.$base_list_empty_list(
)) ? Pacioli.$base_matrix_less(
lcl_i, 
lcl_n) : false )) {
Pacioli.$standard_misc_printf(
"\n--- Step %d ---\n", 
lcl_i)
lcl_available = Pacioli.$base_matrix_sum(
lcl_available, 
Pacioli.$base_list_list_size(
lcl_todo));
lcl_firing = Pacioli.$random_random_pick(
lcl_todo);
if (Pacioli.$petri_net_petri_net_petri_net_enabled(
lcl_net, 
lcl_firing)) {
lcl_total = Pacioli.$base_matrix_sum(
lcl_total, 
lcl_firing);
lcl_net = Pacioli.$petri_net_petri_net_fire_petri_net(
lcl_net, 
lcl_firing);
if ((Pacioli.$base_base_equal(
Pacioli.$base_matrix_mod(
lcl_i, 
lcl_m), 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? true : true )) {
Pacioli.net_behavior_print_firing(
lcl_net, 
lcl_total, 
lcl_i)

} else {
Pacioli.$base_system__skip(
)
}

lcl_todo = Pacioli.net_behavior_simple_trace(
Pacioli.net_behavior_enabled_transitions(
lcl_net));

} else {
Pacioli.$standard_misc_printf(
"HALT!")
lcl_todo = Pacioli.$base_list_empty_list(
);

}

lcl_i = Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

Pacioli.$standard_misc_printf(
"\nAverage available transitions per step: %.1f", 
Pacioli.$base_matrix_divide(
lcl_available, 
lcl_n))
return Pacioli.$base_base_tuple(
false, 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net), 
lcl_i, 
lcl_total);


})(lcl_net);
}


Pacioli.compute_u_subtraction_game_example_random_run = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("Void", []));
}

Pacioli.subtraction_game_example_random_run = function () {
return (() => {
let lcl__;
Pacioli.$base_io_print(
"\nRunning random transitions")
Pacioli.$base_io_print(
"==========================")
lcl__ = Pacioli.net_behavior_run_petri_net_random(
Pacioli.subtraction_game_subtraction_game(
Pacioli.initialNumbers(1, 1, [[0, 0, 10]])), 
Pacioli.initialNumbers(1, 1, [[0, 0, 10]]));

})();
}


Pacioli.compute_u_$fourier_motzkin_quad_quad_neg_count = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$fourier_motzkin_quad_quad_neg_count = function (lcl_quad) {
return Pacioli.$base_base_apply(
function (lcl_v, lcl__15, lcl__16, lcl__17) { return Pacioli.$base_matrix_negative_support(
lcl_v);}, 
lcl_quad);
}


Pacioli.compute_u_$fourier_motzkin_fourier_motzkin_fourier_motzkin_fast = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$fourier_motzkin_fourier_motzkin_fourier_motzkin_fast = function (lcl_matrix) {
return (() => {
let lcl_quads;
let lcl_prod;
let lcl_optimal;
let lcl_best_prod;
let lcl_nu;
let lcl_i;
let lcl_nu_0;
let lcl_nu_p;
let lcl_rows;
let lcl_chosen;
let lcl_p;
let lcl_size;
let lcl_pi;
let lcl_choice;
let lcl_pi_0;
let lcl_pi_p;
lcl_rows = Pacioli.$base_matrix_row_domain(
lcl_matrix);
lcl_quads = (function (lcl__c_accu54) { return Pacioli.$base_list_loop_list(
lcl__c_accu54, 
function (lcl__c_accu54, lcl__c_tup55) { return Pacioli.$base_base_apply(
function (lcl_v, lcl_w) { return Pacioli.$base_system__add_mut(
lcl__c_accu54, 
Pacioli.$fourier_motzkin_quad_initial_quad(
lcl_v, 
lcl_w));}, 
lcl__c_tup55);}, 
Pacioli.$base_list_zip(
Pacioli.$standard_matrix_columns(
lcl_matrix), 
Pacioli.$standard_matrix_columns(
Pacioli.$base_matrix_right_identity(
lcl_matrix))));})(
Pacioli.$base_list_empty_list(
));
lcl_i = Pacioli.$fourier_motzkin_fourier_motzkin_find_seq(
lcl_quads, 
lcl_rows);
while (Pacioli.$base_matrix_less_eq(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_i)) {
lcl_quads = Pacioli.$fourier_motzkin_fourier_motzkin_eliminate_fast(
lcl_quads, 
Pacioli.$base_list_nth(
lcl_i, 
lcl_rows));
lcl_rows = Pacioli.$standard_list_remove_nth(
lcl_i, 
lcl_rows);
lcl_i = Pacioli.$fourier_motzkin_fourier_motzkin_find_seq(
lcl_quads, 
lcl_rows);

}

while ((Pacioli.$base_base_not_equal(
lcl_rows, 
Pacioli.$base_list_empty_list(
)) ? Pacioli.$base_base_not_equal(
lcl_quads, 
Pacioli.$base_list_empty_list(
)) : false )) {
lcl_pi = Pacioli.$standard_misc__list_sum(
(function (lcl__c_accu56) { return Pacioli.$base_list_loop_list(
lcl__c_accu56, 
function (lcl__c_accu56, lcl_q) { return Pacioli.$base_system__add_mut(
lcl__c_accu56, 
Pacioli.$fourier_motzkin_quad_quad_pos_count(
lcl_q));}, 
lcl_quads);})(
Pacioli.$base_list_empty_list(
)));
lcl_nu = Pacioli.$standard_misc__list_sum(
(function (lcl__c_accu58) { return Pacioli.$base_list_loop_list(
lcl__c_accu58, 
function (lcl__c_accu58, lcl_q) { return Pacioli.$base_system__add_mut(
lcl__c_accu58, 
Pacioli.$fourier_motzkin_quad_quad_neg_count(
lcl_q));}, 
lcl_quads);})(
Pacioli.$base_list_empty_list(
)));
lcl_choice = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
lcl_chosen = Pacioli.$base_list_nth(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_rows);
lcl_pi_0 = Pacioli.$base_matrix_get(
lcl_pi, 
lcl_chosen, 
Pacioli.fetchValue('$base_matrix', '_'));
lcl_nu_0 = Pacioli.$base_matrix_get(
lcl_nu, 
lcl_chosen, 
Pacioli.fetchValue('$base_matrix', '_'));
lcl_best_prod = Pacioli.$base_matrix_multiply(
lcl_pi_0, 
lcl_nu_0);
lcl_optimal = Pacioli.$base_matrix_less(
lcl_best_prod, 
Pacioli.$base_matrix_sum(
lcl_pi_0, 
lcl_nu_0));
lcl_size = Pacioli.$base_list_list_size(
lcl_rows);
lcl_i = Pacioli.initialNumbers(1, 1, [[0, 0, 1]]);
while ((Pacioli.$base_base_not_equal(
lcl_i, 
lcl_size) ? Pacioli.$base_base_not(
lcl_optimal) : false )) {
lcl_p = Pacioli.$base_list_nth(
lcl_i, 
lcl_rows);
lcl_pi_p = Pacioli.$base_matrix_get(
lcl_pi, 
lcl_p, 
Pacioli.fetchValue('$base_matrix', '_'));
lcl_nu_p = Pacioli.$base_matrix_get(
lcl_nu, 
lcl_p, 
Pacioli.fetchValue('$base_matrix', '_'));
lcl_prod = Pacioli.$base_matrix_multiply(
lcl_pi_p, 
lcl_nu_p);
if (Pacioli.$base_matrix_less(
lcl_prod, 
Pacioli.$base_matrix_sum(
lcl_pi_p, 
lcl_nu_p))) {
lcl_choice = lcl_i;
lcl_chosen = lcl_p;
lcl_optimal = true;

} else {
if (Pacioli.$base_matrix_less(
lcl_prod, 
lcl_best_prod)) {
lcl_choice = lcl_i;
lcl_chosen = lcl_p;
lcl_best_prod = lcl_prod;

} else {
Pacioli.$base_system__skip(
)
}

}

lcl_i = Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

lcl_quads = Pacioli.$fourier_motzkin_fourier_motzkin_eliminate_fast(
lcl_quads, 
lcl_chosen);
lcl_rows = Pacioli.$standard_list_remove_nth(
lcl_choice, 
lcl_rows);

}

return (function (lcl__c_accu60) { return Pacioli.$base_list_loop_list(
lcl__c_accu60, 
function (lcl__c_accu60, lcl_q) { return Pacioli.$base_system__add_mut(
lcl__c_accu60, 
Pacioli.$fourier_motzkin_quad_quad_right(
lcl_q));}, 
lcl_quads);})(
Pacioli.$base_list_empty_list(
));


})();
}


Pacioli.compute_u_$petri_net_petri_net_fire_petri_net = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]));
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


Pacioli.compute_u_$petri_net_petri_net_petri_net_flow = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_petri_net_flow = function (lcl_net) {
return Pacioli.$base_matrix_minus(
Pacioli.$petri_net_petri_net_petri_net_post(
lcl_net), 
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_subtraction_game_subtraction_game = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.subtraction_game_subtraction_game = function (lcl_n) {
return (function (lcl_initial_marking) { return (function (lcl_pile_consume) { return (function (lcl_token_produce) { return (function (lcl_token_consume) { return Pacioli.$petri_net_petri_net_make_petri_net(
Pacioli.$base_matrix_sum(
lcl_pile_consume, 
lcl_token_consume), 
lcl_token_produce, 
Pacioli.$base_matrix_multiply(
lcl_initial_marking, 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE))));})(
Pacioli.$base_matrix_sum(
Pacioli.fetchValue('subtraction_game', 'claim_token_player_one'), 
Pacioli.fetchValue('subtraction_game', 'claim_token_player_two')));})(
Pacioli.$base_matrix_sum(
Pacioli.fetchValue('subtraction_game', 'release_token_player_one'), 
Pacioli.fetchValue('subtraction_game', 'release_token_player_two')));})(
Pacioli.$base_matrix_sum(
Pacioli.fetchValue('subtraction_game', 'take_from_pile_player_one'), 
Pacioli.fetchValue('subtraction_game', 'take_from_pile_player_two')));})(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_scale(
lcl_n, 
Pacioli.$standard_matrix_delta(
Pacioli.createCoordinates([['pile','index_subtraction_game_GameState']]))), 
Pacioli.$standard_matrix_delta(
Pacioli.createCoordinates([['player_one_to_play','index_subtraction_game_GameState']]))));
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_transitions = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", ['_T_']));
}

Pacioli.$petri_net_petri_net_petri_net_transitions = function (lcl_net) {
return Pacioli.$base_matrix_column_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_net_behavior_print_net_structure = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_net_structure = function (lcl_net) {
return (() => {
Pacioli.$base_io_print(
"Petri net with places")
Pacioli.$standard_misc_printf(
"  %s", 
Pacioli.$base_matrix_row_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net)))
Pacioli.$base_io_print(
"and transitions")
Pacioli.$standard_misc_printf(
"  %s", 
Pacioli.$base_matrix_column_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net)))
for (let lcl_transition of Pacioli.net_behavior_graph(
lcl_net)) {
Pacioli.$base_base_apply(
Pacioli.fetchValue('net_behavior', 'print_transition'), 
lcl_transition)

}

})();
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


Pacioli.compute_u_$standard_list_remove_nth = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.typeFromVarName('_t_')])]), new Pacioli.GenericType("List", [Pacioli.typeFromVarName('_t_')]));
}

Pacioli.$standard_list_remove_nth = function (lcl_n, lcl_list) {
return (() => {
let lcl_result;
let lcl_size;
let lcl_i;
lcl_result = Pacioli.$base_list_empty_list(
);
lcl_i = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
lcl_size = Pacioli.$base_list_list_size(
lcl_list);
while (Pacioli.$base_base_not_equal(
lcl_i, 
lcl_size)) {
if (Pacioli.$base_base_not_equal(
lcl_i, 
lcl_n)) {
lcl_result = Pacioli.$base_system__add_mut(
lcl_result, 
Pacioli.$base_list_nth(
lcl_i, 
lcl_list));

} else {
Pacioli.$base_system__skip(
)
}

lcl_i = Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

return lcl_result;


})();
}


Pacioli.compute_u_$fourier_motzkin_fourier_motzkin_eliminate_fast = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_d_').expt(1), '_F_', Pacioli.unitFromVarName('_F!e_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_C_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_F_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), '_C_']), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_d_').expt(1), '_F_', Pacioli.unitFromVarName('_F!e_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_C_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_F_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.$fourier_motzkin_fourier_motzkin_eliminate_fast = function (lcl_quads, lcl_row) {
return (() => {
let lcl_i;
let lcl_pos_size;
let lcl_j;
let lcl_k;
let lcl_l;
let lcl_m;
let lcl_n;
let lcl_neg;
let lcl_q;
let lcl_r;
let lcl_minimal;
let lcl_pos;
let lcl_tmp;
let lcl_alpha;
let lcl_neg_size;
let lcl_beta;
lcl_n = Pacioli.$base_list_list_size(
lcl_quads);
lcl_i = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
lcl_pos = Pacioli.$base_list_empty_list(
);
lcl_neg = Pacioli.$base_list_empty_list(
);
lcl_minimal = Pacioli.$base_list_empty_list(
);
while (Pacioli.$base_base_not_equal(
lcl_i, 
lcl_n)) {
lcl_q = Pacioli.$base_list_nth(
lcl_i, 
lcl_quads);
lcl_m = Pacioli.$fourier_motzkin_quad_quad_magnitude(
lcl_q, 
lcl_row);
if (Pacioli.$base_matrix_less(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
lcl_m)) {
lcl_pos = Pacioli.$base_system__add_mut(
lcl_pos, 
lcl_i);

} else {
if (Pacioli.$base_matrix_less(
lcl_m, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))) {
lcl_neg = Pacioli.$base_system__add_mut(
lcl_neg, 
lcl_i);

} else {
lcl_minimal = Pacioli.$base_system__add_mut(
lcl_minimal, 
lcl_q);

}

}

lcl_i = Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

lcl_pos_size = Pacioli.$base_list_list_size(
lcl_pos);
lcl_neg_size = Pacioli.$base_list_list_size(
lcl_neg);
lcl_k = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
while (Pacioli.$base_base_not_equal(
lcl_k, 
lcl_pos_size)) {
lcl_i = Pacioli.$base_list_nth(
lcl_k, 
lcl_pos);
lcl_q = Pacioli.$base_list_nth(
lcl_i, 
lcl_quads);
lcl_alpha = Pacioli.$fourier_motzkin_quad_quad_magnitude(
lcl_q, 
lcl_row);
lcl_l = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
while (Pacioli.$base_base_not_equal(
lcl_l, 
lcl_neg_size)) {
lcl_j = Pacioli.$base_list_nth(
lcl_l, 
lcl_neg);
lcl_r = Pacioli.$base_list_nth(
lcl_j, 
lcl_quads);
lcl_beta = Pacioli.$fourier_motzkin_quad_quad_magnitude(
lcl_r, 
lcl_row);
lcl_tmp = Pacioli.$fourier_motzkin_quad_canonical(
Pacioli.$fourier_motzkin_quad_combine_quads(
Pacioli.$base_matrix_abs(
lcl_beta), 
lcl_q, 
Pacioli.$base_matrix_abs(
lcl_alpha), 
lcl_r));
lcl_minimal = Pacioli.$fourier_motzkin_fourier_motzkin_insert_if_minimal(
lcl_tmp, 
lcl_minimal);
lcl_l = Pacioli.$base_matrix_sum(
lcl_l, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

lcl_k = Pacioli.$base_matrix_sum(
lcl_k, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

return lcl_minimal;


})();
}


Pacioli.compute_u_$fourier_motzkin_quad_initial_quad = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$fourier_motzkin_quad_initial_quad = function (lcl_v, lcl_w) {
return Pacioli.$base_base_tuple(
lcl_v, 
lcl_w, 
Pacioli.$base_matrix_support(
lcl_v), 
Pacioli.$base_matrix_support(
lcl_w));
}


Pacioli.compute_u_net_behavior_simple_trace = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", ['_A_'])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_A_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_simple_trace = function (lcl_events) {
return (function (lcl__c_accu66) { return Pacioli.$base_list_loop_list(
lcl__c_accu66, 
function (lcl__c_accu66, lcl_transition) { return Pacioli.$base_system__add_mut(
lcl__c_accu66, 
Pacioli.$standard_matrix_delta(
lcl_transition));}, 
lcl_events);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$fourier_motzkin_fourier_motzkin_insert_if_minimal = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_d_').expt(1), '_F_', Pacioli.unitFromVarName('_F!e_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_C_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_F_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_d_').expt(1), '_F_', Pacioli.unitFromVarName('_F!e_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_C_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_F_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_d_').expt(1), '_F_', Pacioli.unitFromVarName('_F!e_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_C_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_F_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.$fourier_motzkin_fourier_motzkin_insert_if_minimal = function (lcl_candidate, lcl_quads) {
return (() => {
let lcl_x;
let lcl_i;
let lcl_sub_found;
let lcl_n;
lcl_sub_found = false;
lcl_n = Pacioli.$base_list_list_size(
lcl_quads);
lcl_i = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
while ((Pacioli.$base_base_not_equal(
lcl_i, 
lcl_n) ? Pacioli.$base_base_not(
lcl_sub_found) : false )) {
lcl_x = Pacioli.$base_list_nth(
lcl_i, 
lcl_quads);
if (Pacioli.$fourier_motzkin_quad_support_sub(
lcl_x, 
lcl_candidate)) {
lcl_sub_found = true;

} else {
Pacioli.$base_system__skip(
)
}

lcl_i = Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

return (lcl_sub_found ? lcl_quads : Pacioli.$base_system__add_mut(
lcl_quads, 
lcl_candidate) );


})();
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_enabled = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []));
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


Pacioli.compute_u_$standard_misc__list_sum = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1))])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1)));
}

Pacioli.$standard_misc__list_sum = function (lcl_x) {
return Pacioli.$base_list_fold_list(
Pacioli.fetchValue('$base_matrix', 'sum'), 
lcl_x);
}


Pacioli.compute_u_$fourier_motzkin_quad_support_sub = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Boole", []));
}

Pacioli.$fourier_motzkin_quad_support_sub = function (lcl_q, lcl_r) {
return Pacioli.$base_base_apply(
function (lcl__25, lcl__26, lcl__27, lcl_q4) { return Pacioli.$base_base_apply(
function (lcl__22, lcl__23, lcl__24, lcl_r4) { return Pacioli.$base_matrix_less_eq(
lcl_q4, 
lcl_r4);}, 
lcl_r);}, 
lcl_q);
}


Pacioli.compute_u_net_behavior_run_petri_net_mini_max = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Boole", [])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_T_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.net_behavior_run_petri_net_mini_max = function (lcl_net, lcl_maximizing, lcl_evaluation) {
return (() => {
let lcl_best_trace;
let lcl_best_score;
let lcl_score;
let lcl_trace;
let lcl_marking;
let lcl_enabled;
lcl_marking = Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net);
lcl_enabled = Pacioli.net_behavior_simple_trace(
Pacioli.net_behavior_enabled_transitions(
lcl_net));
if (Pacioli.$base_base_equal(
lcl_enabled, 
Pacioli.$base_list_empty_list(
))) {
return Pacioli.$base_base_tuple(
(lcl_evaluation)(
lcl_marking, 
lcl_maximizing), 
Pacioli.$base_list_empty_list(
));


} else {
[lcl_best_score,lcl_best_trace] = Pacioli.net_behavior_run_petri_net_mini_max(
Pacioli.$petri_net_petri_net_fire_petri_net(
lcl_net, 
Pacioli.$base_list_head(
lcl_enabled)), 
Pacioli.$base_base_not(
lcl_maximizing), 
lcl_evaluation);

for (let lcl_firing of Pacioli.$base_list_tail(
lcl_enabled)) {
[lcl_score,lcl_trace] = Pacioli.net_behavior_run_petri_net_mini_max(
Pacioli.$petri_net_petri_net_fire_petri_net(
lcl_net, 
lcl_firing), 
Pacioli.$base_base_not(
lcl_maximizing), 
lcl_evaluation);

if (((lcl_maximizing ? Pacioli.$base_matrix_greater(
lcl_score, 
lcl_best_score) : false ) ? true : (Pacioli.$base_base_not(
lcl_maximizing) ? Pacioli.$base_matrix_less(
lcl_score, 
lcl_best_score) : false ) )) {
lcl_best_score = lcl_score;
lcl_best_trace = lcl_trace;

} else {
Pacioli.$base_system__skip(
)
}


}
return Pacioli.$base_base_tuple(
lcl_best_score, 
lcl_best_trace);


}


})();
}


Pacioli.compute_u_subtraction_game_mini_max_test = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType("Void", []));
}

Pacioli.subtraction_game_mini_max_test = function () {
return (() => {
Pacioli.$base_io_print(
"\nSubtraction game test")
Pacioli.$base_io_print(
"=====================\n")
Pacioli.$base_io_print(
"Pile   Winner")
Pacioli.$base_io_print(
"---------------")
for (let lcl_i of Pacioli.$base_list_naturals(
Pacioli.initialNumbers(1, 1, [[0, 0, 15]]))) {
Pacioli.$standard_misc_printf(
"%4d   %s", 
lcl_i, 
Pacioli.subtraction_game_run_subtraction_game_mini_max(
lcl_i))

}

})();
}


Pacioli.compute_u_net_behavior_trace = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", ['_A_', Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])])]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_A_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_trace = function (lcl_events) {
return (function (lcl__c_accu68) { return Pacioli.$base_list_loop_list(
lcl__c_accu68, 
function (lcl__c_accu68, lcl__c_tup69) { return Pacioli.$base_base_apply(
function (lcl_transition, lcl_amount) { return Pacioli.$base_system__add_mut(
lcl__c_accu68, 
Pacioli.$base_matrix_scale(
lcl_amount, 
Pacioli.$standard_matrix_delta(
lcl_transition)));}, 
lcl__c_tup69);}, 
lcl_events);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$fourier_motzkin_quad_quad_gcd = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$fourier_motzkin_quad_quad_gcd = function (lcl_quad) {
return Pacioli.$base_base_apply(
function (lcl_v, lcl_w, lcl__10, lcl__11) { return Pacioli.$base_matrix_gcd(
Pacioli.$standard_misc__list_gcd(
(function (lcl__c_accu38) { return Pacioli.$base_list_loop_list(
lcl__c_accu38, 
function (lcl__c_accu38, lcl_i) { return Pacioli.$base_system__add_mut(
lcl__c_accu38, 
Pacioli.$base_matrix_get_num(
lcl_v, 
lcl_i, 
Pacioli.fetchValue('$base_matrix', '_')));}, 
Pacioli.$base_matrix_row_domain(
lcl_v));})(
Pacioli.$base_list_empty_list(
))), 
Pacioli.$standard_misc__list_gcd(
(function (lcl__c_accu40) { return Pacioli.$base_list_loop_list(
lcl__c_accu40, 
function (lcl__c_accu40, lcl_i) { return Pacioli.$base_system__add_mut(
lcl__c_accu40, 
Pacioli.$base_matrix_get_num(
lcl_w, 
lcl_i, 
Pacioli.fetchValue('$base_matrix', '_')));}, 
Pacioli.$base_matrix_row_domain(
lcl_w));})(
Pacioli.$base_list_empty_list(
))));}, 
lcl_quad);
}


Pacioli.compute_u_$fourier_motzkin_quad_canonical = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$fourier_motzkin_quad_canonical = function (lcl_quad) {
return Pacioli.$fourier_motzkin_quad_scale_quad_down(
lcl_quad, 
Pacioli.$fourier_motzkin_quad_quad_gcd(
lcl_quad));
}


Pacioli.compute_u_$fourier_motzkin_quad_scale_quad_down = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', Pacioli.unitFromVarName('_D!b_').expt(1), '_E_', Pacioli.unitFromVarName('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_I_', Pacioli.unitFromVarName('_I!g_').expt(1), '_J_', Pacioli.unitFromVarName('_J!h_').expt(1)), Pacioli.typeFromVarName('_k_'), Pacioli.typeFromVarName('_l_')]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_m_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_m_').expt(-1).mult(Pacioli.unitFromVarName('_a_').expt(1)), '_D_', Pacioli.unitFromVarName('_D!b_').expt(1), '_E_', Pacioli.unitFromVarName('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_m_').expt(-1).mult(Pacioli.unitFromVarName('_f_').expt(1)), '_I_', Pacioli.unitFromVarName('_I!g_').expt(1), '_J_', Pacioli.unitFromVarName('_J!h_').expt(1)), Pacioli.typeFromVarName('_k_'), Pacioli.typeFromVarName('_l_')]));
}

Pacioli.$fourier_motzkin_quad_scale_quad_down = function (lcl_quad, lcl_c) {
return Pacioli.$base_base_apply(
function (lcl_v, lcl_w, lcl_sv, lcl_sw) { return Pacioli.$base_base_tuple(
Pacioli.$base_matrix_scale_down(
lcl_v, 
lcl_c), 
Pacioli.$base_matrix_scale_down(
lcl_w, 
lcl_c), 
lcl_sv, 
lcl_sw);}, 
lcl_quad);
}


Pacioli.compute_u_$fourier_motzkin_quad_quad_magnitude = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), '_P_']), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$fourier_motzkin_quad_quad_magnitude = function (lcl_quad, lcl_row) {
return Pacioli.$base_base_apply(
function (lcl_v, lcl__7, lcl__8, lcl__9) { return Pacioli.$base_matrix_get_num(
lcl_v, 
lcl_row, 
Pacioli.fetchValue('$base_matrix', '_'));}, 
lcl_quad);
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


Pacioli.compute_u_$petri_net_petri_net_petri_net_post = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE));
}

Pacioli.$petri_net_petri_net_petri_net_post = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_pre, lcl_post, lcl_marking) { return lcl_post;}, 
lcl_record);
}


Pacioli.compute_u_$petri_net_petri_net_make_petri_net = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]));
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
return (function (lcl__c_accu72) { return Pacioli.$base_list_loop_list(
lcl__c_accu72, 
function (lcl__c_accu72, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu72, 
Pacioli.$standard_misc__list_sum(
(function (lcl__c_accu70) { return Pacioli.$base_list_loop_list(
lcl__c_accu70, 
function (lcl__c_accu70, lcl_f) { return Pacioli.$base_system__add_mut(
lcl__c_accu70, 
lcl_f);}, 
Pacioli.net_behavior_trace(
lcl_x));})(
Pacioli.$base_list_empty_list(
))));}, 
lcl_xs);})(
Pacioli.$base_list_empty_list(
));
}


Pacioli.compute_u_$fourier_motzkin_fourier_motzkin_find_seq = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_d_').expt(1), '_F_', Pacioli.unitFromVarName('_F!e_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_C_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_F_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", ['_C_'])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$fourier_motzkin_fourier_motzkin_find_seq = function (lcl_quads, lcl_rows) {
return (() => {
let lcl_p;
let lcl_nu;
let lcl_pi;
let lcl_i;
let lcl_j;
let lcl_n;
lcl_pi = Pacioli.$standard_misc__list_sum(
(function (lcl__c_accu62) { return Pacioli.$base_list_loop_list(
lcl__c_accu62, 
function (lcl__c_accu62, lcl_q) { return Pacioli.$base_system__add_mut(
lcl__c_accu62, 
Pacioli.$fourier_motzkin_quad_quad_pos_count(
lcl_q));}, 
lcl_quads);})(
Pacioli.$base_list_empty_list(
)));
lcl_nu = Pacioli.$standard_misc__list_sum(
(function (lcl__c_accu64) { return Pacioli.$base_list_loop_list(
lcl__c_accu64, 
function (lcl__c_accu64, lcl_q) { return Pacioli.$base_system__add_mut(
lcl__c_accu64, 
Pacioli.$fourier_motzkin_quad_quad_neg_count(
lcl_q));}, 
lcl_quads);})(
Pacioli.$base_list_empty_list(
)));
lcl_i = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
lcl_n = Pacioli.$base_list_list_size(
lcl_rows);
lcl_j = Pacioli.$base_matrix_negative(
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));
while ((Pacioli.$base_base_not_equal(
lcl_i, 
lcl_n) ? Pacioli.$base_matrix_less(
lcl_j, 
Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) : false )) {
lcl_p = Pacioli.$base_list_nth(
lcl_i, 
lcl_rows);
if ((Pacioli.$base_base_equal(
Pacioli.$base_matrix_get(
lcl_pi, 
lcl_p, 
Pacioli.fetchValue('$base_matrix', '_')), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])) ? Pacioli.$base_base_equal(
Pacioli.$base_matrix_get(
lcl_nu, 
lcl_p, 
Pacioli.fetchValue('$base_matrix', '_')), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])) : false )) {
lcl_j = lcl_i;

} else {
Pacioli.$base_system__skip(
)
}

lcl_i = Pacioli.$base_matrix_sum(
lcl_i, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

}

return lcl_j;


})();
}


Pacioli.compute_u_net_behavior_run_petri_net_trace_aux = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_trace_aux = function (lcl_net, lcl_trace, lcl_verbose) {
return ((lcl_net) => {
let lcl_valid;
let lcl_fired;
let lcl_count;
let lcl_not_fired;
if (lcl_verbose) {
Pacioli.$standard_misc_printf(
"Running Petri net with initial state\n%d", 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_net))

} else {
Pacioli.$base_system__skip(
)
}

lcl_valid = true;
lcl_count = Pacioli.initialNumbers(1, 1, [[0, 0, 0]]);
lcl_fired = Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$petri_net_petri_net_transition_unit(
lcl_net));
lcl_not_fired = Pacioli.$base_matrix_scale(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.$petri_net_petri_net_transition_unit(
lcl_net));
for (let lcl_v of lcl_trace) {
if (lcl_verbose) {
Pacioli.$standard_misc_printf(
"\n--- Step %d ---\n", 
lcl_count)

} else {
Pacioli.$base_system__skip(
)
}

if ((lcl_valid ? Pacioli.$petri_net_petri_net_petri_net_enabled(
lcl_net, 
lcl_v) : false )) {
lcl_net = Pacioli.$petri_net_petri_net_fire_petri_net(
lcl_net, 
lcl_v);
if (lcl_verbose) {
Pacioli.net_behavior_print_firing(
lcl_net, 
lcl_v, 
lcl_count)

} else {
Pacioli.$base_system__skip(
)
}

lcl_fired = Pacioli.$base_matrix_sum(
lcl_fired, 
lcl_v);
lcl_count = Pacioli.$base_matrix_sum(
lcl_count, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]));

} else {
if ((lcl_verbose ? lcl_valid : false )) {
Pacioli.$standard_misc_printf(
"HALT!")

} else {
Pacioli.$base_system__skip(
)
}

lcl_valid = false;
lcl_not_fired = Pacioli.$base_matrix_sum(
lcl_not_fired, 
lcl_v);

}


}
return Pacioli.$base_base_tuple(
lcl_net, 
lcl_valid, 
lcl_count, 
lcl_fired, 
lcl_not_fired);


})(lcl_net);
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_pre = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE));
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
[Pacioli.$base_base_tuple(
lcl_p, 
Pacioli.fetchValue('$base_matrix', '_'), 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))]);
}


Pacioli.compute_u_net_behavior_run_petri_net_trace = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_trace = function (lcl_net, lcl_trace) {
return Pacioli.net_behavior_run_petri_net_trace_aux(
lcl_net, 
lcl_trace, 
false);
}


Pacioli.compute_u_$fourier_motzkin_quad_quad_right = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$fourier_motzkin_quad_quad_right = function (lcl_record) {
return Pacioli.$base_base_apply(
function (lcl_left, lcl_right, lcl_left_support, lcl_right_support) { return lcl_right;}, 
lcl_record);
}


Pacioli.compute_u_subtraction_game_run_subtraction_game = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.IndexType(['index_subtraction_game_Move'])])]), new Pacioli.GenericType("Void", []));
}

Pacioli.subtraction_game_run_subtraction_game = function (lcl_net, lcl_moves) {
return (() => {
let lcl_valid;
let lcl_player_one_wins;
let lcl_trace;
let lcl_final_net;
let lcl_count;
let lcl__;
Pacioli.$base_io_print(
"\nRunning subtraction game\n")
lcl_trace = (function (lcl__c_accu86) { return Pacioli.$base_list_loop_list(
lcl__c_accu86, 
function (lcl__c_accu86, lcl_m) { return Pacioli.$base_system__add_mut(
lcl__c_accu86, 
Pacioli.$standard_matrix_delta(
lcl_m));}, 
lcl_moves);})(
Pacioli.$base_list_empty_list(
));
[lcl_final_net,lcl_valid,lcl_count,lcl__,lcl__] = Pacioli.net_behavior_run_petri_net_trace_verbose(
lcl_net, 
lcl_trace);

lcl_player_one_wins = Pacioli.$base_matrix_is_zero(
Pacioli.$base_matrix_multiply(
Pacioli.$standard_matrix_delta(
Pacioli.createCoordinates([['player_two_to_play','index_subtraction_game_GameState']])), 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_final_net)));
if (lcl_valid) {
Pacioli.$standard_misc_printf(
"\nThe winner is %s", 
(lcl_player_one_wins ? "player 1" : "player 2" ))

} else {
Pacioli.$standard_misc_printf(
"\nMove %d was invalid: %s", 
Pacioli.$base_matrix_sum(
lcl_count, 
Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
Pacioli.$base_list_nth(
lcl_count, 
lcl_moves))

}


})();
}


Pacioli.compute_u_$fourier_motzkin_quad_quad_pos_count = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.$fourier_motzkin_quad_quad_pos_count = function (lcl_quad) {
return Pacioli.$base_base_apply(
function (lcl_v, lcl__12, lcl__13, lcl__14) { return Pacioli.$base_matrix_positive_support(
lcl_v);}, 
lcl_quad);
}


Pacioli.compute_u_net_behavior_run_petri_net_trace_verbose = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.net_behavior_run_petri_net_trace_verbose = function (lcl_net, lcl_trace) {
return Pacioli.net_behavior_run_petri_net_trace_aux(
lcl_net, 
lcl_trace, 
true);
}


Pacioli.compute_u_net_behavior_print_summary = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), '_D_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.unitFromVarName('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", []), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Void", []));
}

Pacioli.net_behavior_print_summary = function (lcl_outcome) {
return Pacioli.$base_base_apply(
function (lcl_final_net, lcl_valid, lcl_count, lcl_fired, lcl_not_fired) { return (() => {
Pacioli.$standard_misc_printf(
"\nTrace is %s. Steps performed is %d. Final marking is%d", 
(lcl_valid ? "valid" : "invalid" ), 
lcl_count, 
Pacioli.$petri_net_petri_net_petri_net_marking(
lcl_final_net))
Pacioli.$standard_misc_printf(
"\nFired transitions%d", 
lcl_fired)
Pacioli.$standard_misc_printf(
"\nNot fired transitions%d", 
lcl_not_fired)
Pacioli.$standard_misc_printf(
"\nConsumed%d", 
Pacioli.$base_matrix_mmult(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_final_net), 
lcl_fired))
Pacioli.$standard_misc_printf(
"\nProduced%d", 
Pacioli.$base_matrix_mmult(
Pacioli.$petri_net_petri_net_petri_net_post(
lcl_final_net), 
lcl_fired))

})();}, 
lcl_outcome);
}


Pacioli.compute_u_$fourier_motzkin_fourier_motzkin_fourier_motzkin = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$fourier_motzkin_fourier_motzkin_fourier_motzkin = function (lcl_matrix) {
return Pacioli.$fourier_motzkin_fourier_motzkin_fourier_motzkin_fast(
lcl_matrix);
}


Pacioli.compute_u_$petri_net_petri_net_petri_net_places = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_T_', Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("List", ['_P_']));
}

Pacioli.$petri_net_petri_net_petri_net_places = function (lcl_net) {
return Pacioli.$base_matrix_row_domain(
Pacioli.$petri_net_petri_net_petri_net_pre(
lcl_net));
}


Pacioli.compute_u_$fourier_motzkin_quad_combine_quads = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_P_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, '_Q_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$fourier_motzkin_quad_combine_quads = function (lcl_a, lcl_q, lcl_b, lcl_r) {
return Pacioli.$base_base_apply(
function (lcl_q1, lcl_q2, lcl__20, lcl__21) { return Pacioli.$base_base_apply(
function (lcl_r1, lcl_r2, lcl__18, lcl__19) { return Pacioli.$fourier_motzkin_quad_initial_quad(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_scale(
lcl_a, 
lcl_q1), 
Pacioli.$base_matrix_scale(
lcl_b, 
lcl_r1)), 
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_scale(
lcl_a, 
lcl_q2), 
Pacioli.$base_matrix_scale(
lcl_b, 
lcl_r2)));}, 
lcl_r);}, 
lcl_q);
}


Pacioli.compute_u_$standard_matrix_columns = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.$standard_matrix_columns = function (lcl_matrix) {
return (function (lcl__c_accu16) { return Pacioli.$base_list_loop_list(
lcl__c_accu16, 
function (lcl__c_accu16, lcl_j) { return Pacioli.$base_system__add_mut(
lcl__c_accu16, 
Pacioli.$base_matrix_column(
lcl_matrix, 
lcl_j));}, 
Pacioli.$base_matrix_column_domain(
lcl_matrix));})(
Pacioli.$base_list_empty_list(
));
}
Pacioli.compute_sbase_mole = function () { return {symbol: "mol"}};

Pacioli.compute_index_subtraction_game_Move = function () {return Pacioli.makeIndexSet('index_subtraction_game_Move', 'Move', [ "player_one_take_one","player_one_take_two","player_one_take_three","player_two_take_one","player_two_take_two","player_two_take_three" ])}
Pacioli.compute_sbase_gram = function () { return {symbol: "g"}};
Pacioli.compute_sbase_ampere = function () { return {symbol: "A"}};
Pacioli.compute_sbase_metre = function () { return {symbol: "m"}};
Pacioli.compute_sbase_token = function () { return {symbol: "tkn"}};
Pacioli.compute_sbase_percent = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.01, Pacioli.ONE), symbol: "%"}
}
Pacioli.compute_sbase_candela = function () { return {symbol: "cd"}};

Pacioli.compute_index_$base_matrix_One = function () {return Pacioli.makeIndexSet('index_$base_matrix_One', 'One', [ "_" ])}
Pacioli.compute_sbase_second = function () { return {symbol: "s"}};
Pacioli.compute_sbase_object = function () { return {symbol: "obj"}};
Pacioli.compute_sbase_hertz = function () { return {symbol: "Hz"}};
Pacioli.compute_sbase_kelvin = function () { return {symbol: "K"}};

Pacioli.compute_index_subtraction_game_GameState = function () {return Pacioli.makeIndexSet('index_subtraction_game_GameState', 'GameState', [ "pile","player_one_to_play","player_two_to_play" ])}
Pacioli.compute_vbase_subtraction_game_GameState_unit = function () { return {units: { 'pile': Pacioli.unit('object').expt(1), 'player_one_to_play': Pacioli.unit('token').expt(1), 'player_two_to_play': Pacioli.unit('token').expt(1) }}};
Pacioli.compute_sbase_decimals = function () { return {symbol: "decs"}};
Pacioli.compute_sbase_radian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: "rad"}
}

Pacioli.compute_u_subtraction_game_release_token_player_one = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE);
}
Pacioli.compute_subtraction_game_release_token_player_one = function () {
  return Pacioli.initialNumbers(3, 6, [[2,0,1],[2,1,1],[2,2,1]]);
}

Pacioli.compute_u_subtraction_game_release_token_player_two = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE);
}
Pacioli.compute_subtraction_game_release_token_player_two = function () {
  return Pacioli.initialNumbers(3, 6, [[1,3,1],[1,4,1],[1,5,1]]);
}

Pacioli.compute_u_$base_matrix__ = function () {
    return new Pacioli.IndexType([]);
}
Pacioli.compute_$base_matrix__ = function () {
  return Pacioli.createCoordinates([]);
}

Pacioli.compute_u_subtraction_game_claim_token_player_one = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE);
}
Pacioli.compute_subtraction_game_claim_token_player_one = function () {
  return Pacioli.initialNumbers(3, 6, [[1,0,1],[1,1,1],[1,2,1]]);
}

Pacioli.compute_u_subtraction_game_invalid_game_moves = function () {
    return new Pacioli.GenericType("List", [new Pacioli.IndexType(['index_subtraction_game_Move'])]);
}
Pacioli.compute_subtraction_game_invalid_game_moves = function () {
  return [Pacioli.createCoordinates([['player_one_take_one','index_subtraction_game_Move']]), 
Pacioli.createCoordinates([['player_one_take_one','index_subtraction_game_Move']])];
}

Pacioli.compute_u_subtraction_game_claim_token_player_two = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE);
}
Pacioli.compute_subtraction_game_claim_token_player_two = function () {
  return Pacioli.initialNumbers(3, 6, [[2,3,1],[2,4,1],[2,5,1]]);
}

Pacioli.compute_u_subtraction_game_take_from_pile_player_two = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE);
}
Pacioli.compute_subtraction_game_take_from_pile_player_two = function () {
  return Pacioli.initialNumbers(3, 6, [[0,3,1],[0,4,2],[0,5,3]]);
}

Pacioli.compute_u_subtraction_game_take_from_pile_player_one = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['index_subtraction_game_GameState']), Pacioli.unitVectorType('vbase_subtraction_game_GameState_unit', 0).expt(1), new Pacioli.IndexType(['index_subtraction_game_Move']), Pacioli.ONE);
}
Pacioli.compute_subtraction_game_take_from_pile_player_one = function () {
  return Pacioli.initialNumbers(3, 6, [[0,0,1],[0,1,2],[0,2,3]]);
}

Pacioli.compute_u_subtraction_game_valid_game_moves = function () {
    return new Pacioli.GenericType("List", [new Pacioli.IndexType(['index_subtraction_game_Move'])]);
}
Pacioli.compute_subtraction_game_valid_game_moves = function () {
  return [Pacioli.createCoordinates([['player_one_take_one','index_subtraction_game_Move']]), 
Pacioli.createCoordinates([['player_two_take_two','index_subtraction_game_Move']]), 
Pacioli.createCoordinates([['player_one_take_one','index_subtraction_game_Move']]), 
Pacioli.createCoordinates([['player_two_take_three','index_subtraction_game_Move']]), 
Pacioli.createCoordinates([['player_one_take_two','index_subtraction_game_Move']]), 
Pacioli.createCoordinates([['player_two_take_one','index_subtraction_game_Move']])];
}
