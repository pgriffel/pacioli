Pacioli.compute_unit_percent = function () {
    return {definition: new Pacioli.DimensionedNumber(0.01, Pacioli.ONE), symbol: '%'}
}
Pacioli.compute_unit_radian = function () {
    return {definition: new Pacioli.DimensionedNumber(1, Pacioli.ONE), symbol: 'rad'}
}

Pacioli.u_glbl_standard_left_division = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(-1)), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_left_division = function (lcl_x,lcl_y) {
    return Pacioli.b_glbl_base_mmult(
        Pacioli.b_glbl_standard_inverse(
            lcl_x), 
        lcl_y);
}
Pacioli.glbl_standard_left_division = function (lcl_x,lcl_y) {
    return Pacioli.glbl_base_mmult(
        Pacioli.glbl_standard_inverse(
            lcl_x), 
        lcl_y);
}

Pacioli.u_glbl_testing_test_description = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_C_')])]), Pacioli.typeFromVarName('_A_'));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_test_description = function (lcl_test) {
    return Pacioli.glbl_base_apply(
        function (lcl_description, lcl__118, lcl__119) { return lcl_description;}, 
        lcl_test);
}
Pacioli.glbl_testing_test_description = function (lcl_test) {
    return Pacioli.glbl_base_apply(
        function (lcl_description, lcl__118, lcl__119) { return lcl_description;}, 
        lcl_test);
}

Pacioli.u_glbl_standard_delta = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", ['_A_']), Pacioli.createMatrixType(Pacioli.ONE, '_A_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_delta = function (lcl_x) {
    return Pacioli.b_glbl_base_make_matrix(
        Pacioli.glbl_base_add_mut(
            Pacioli.glbl_base_empty_list(
                ), 
            Pacioli.glbl_base_tuple(
                lcl_x, 
                Pacioli.bfetchValue('base', '_'), 
                Pacioli.num(1))));
}
Pacioli.glbl_standard_delta = function (lcl_x) {
    return Pacioli.glbl_base_make_matrix(
        Pacioli.glbl_base_add_mut(
            Pacioli.glbl_base_empty_list(
                ), 
            Pacioli.glbl_base_tuple(
                lcl_x, 
                Pacioli.fetchValue('base', '_'), 
                Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));
}

Pacioli.u_glbl_testing_skipped_message = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType('String', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_skipped_message = function (lcl_nr_skipped) {
    return (Pacioli.b_glbl_base_equal(
         lcl_nr_skipped, 
         Pacioli.num(0)) ? "\
" : Pacioli.b_glbl_base_format(
                        ", %s skipped\
", 
                        Pacioli.b_glbl_base_num2string(
                            lcl_nr_skipped, 
                            Pacioli.num(0))) );
}
Pacioli.glbl_testing_skipped_message = function (lcl_nr_skipped) {
    return (Pacioli.glbl_base_equal(
         lcl_nr_skipped, 
         Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? "\
" : Pacioli.glbl_base_format(
                        ", %s skipped\
", 
                        Pacioli.glbl_base_num2string(
                            lcl_nr_skipped, 
                            Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))) );
}

Pacioli.u_glbl_standard_cube = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(3), '_D_', new Pacioli.PowerProduct('_D!b_').expt(3), '_E_', new Pacioli.PowerProduct('_E!c_').expt(3)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_cube = function (lcl_x) {
    return Pacioli.b_glbl_base_multiply(
        Pacioli.b_glbl_base_multiply(
            lcl_x, 
            lcl_x), 
        lcl_x);
}
Pacioli.glbl_standard_cube = function (lcl_x) {
    return Pacioli.glbl_base_multiply(
        Pacioli.glbl_base_multiply(
            lcl_x, 
            lcl_x), 
        lcl_x);
}

Pacioli.u_glbl_standard_is_zero_row = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), '_D_']), new Pacioli.GenericType('Boole', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_is_zero_row = function (lcl_x,lcl_i) {
    return Pacioli.b_glbl_base_is_zero(
        Pacioli.b_glbl_base_row(
            Pacioli.b_glbl_base_magnitude(
                lcl_x), 
            lcl_i));
}
Pacioli.glbl_standard_is_zero_row = function (lcl_x,lcl_i) {
    return Pacioli.glbl_base_is_zero(
        Pacioli.glbl_base_row(
            Pacioli.glbl_base_magnitude(
                lcl_x), 
            lcl_i));
}

Pacioli.u_glbl_standard_outer = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(-1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(-1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_outer = function (lcl_x,lcl_y) {
    return Pacioli.b_glbl_base_mmult(
        lcl_x, 
        Pacioli.b_glbl_base_transpose(
            lcl_y));
}
Pacioli.glbl_standard_outer = function (lcl_x,lcl_y) {
    return Pacioli.glbl_base_mmult(
        lcl_x, 
        Pacioli.glbl_base_transpose(
            lcl_y));
}

Pacioli.u_glbl_standard_left_inverse = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_left_inverse = function (lcl_x) {
    return Pacioli.b_glbl_base_transpose(
        Pacioli.b_glbl_standard_right_inverse(
            Pacioli.b_glbl_base_transpose(
                lcl_x)));
}
Pacioli.glbl_standard_left_inverse = function (lcl_x) {
    return Pacioli.glbl_base_transpose(
        Pacioli.glbl_standard_right_inverse(
            Pacioli.glbl_base_transpose(
                lcl_x)));
}

Pacioli.u_glbl_standard_compare = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_compare = function (lcl_x,lcl_y) {
    return (Pacioli.b_glbl_base_less(
         lcl_x, 
         lcl_y) ? Pacioli.b_glbl_base_negative(
                 Pacioli.num(1)) : (Pacioli.b_glbl_base_greater(
                          lcl_x, 
                          lcl_y) ? Pacioli.num(1) : Pacioli.num(0) ) );
}
Pacioli.glbl_standard_compare = function (lcl_x,lcl_y) {
    return (Pacioli.glbl_base_less(
         lcl_x, 
         lcl_y) ? Pacioli.glbl_base_negative(
                 Pacioli.initialNumbers(1, 1, [[0, 0, 1]])) : (Pacioli.glbl_base_greater(
                          lcl_x, 
                          lcl_y) ? Pacioli.initialNumbers(1, 1, [[0, 0, 1]]) : Pacioli.initialNumbers(1, 1, [[0, 0, 0]]) ) );
}

Pacioli.u_glbl_base_thousands_separator_io = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_C_')])]), new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_A_')]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_base_thousands_separator_io = function (lcl_boole,lcl_settings) {
    return Pacioli.glbl_base_apply(
        function (lcl_decs, lcl__31) { return Pacioli.glbl_base_tuple(
                                                  lcl_decs, 
                                                  lcl_boole);}, 
        lcl_settings);
}
Pacioli.glbl_base_thousands_separator_io = function (lcl_boole,lcl_settings) {
    return Pacioli.glbl_base_apply(
        function (lcl_decs, lcl__31) { return Pacioli.glbl_base_tuple(
                                                  lcl_decs, 
                                                  lcl_boole);}, 
        lcl_settings);
}

Pacioli.u_glbl_standard_remove_nth = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')])]), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_remove_nth = function (lcl_n,lcl_list) {
    return function (sym_2, lcl_i, lcl_size, lcl_i, lcl_result, lcl_result) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_empty_list(
                                           )), 
                           Pacioli.glbl_base_seq(
                               Pacioli.glbl_base_ref_set(lcl_i, Pacioli.num(0)), 
                               Pacioli.glbl_base_seq(
                                   Pacioli.glbl_base_ref_set(lcl_size, Pacioli.b_glbl_base_list_size(
                                                 lcl_list)), 
                                   Pacioli.glbl_base_seq(
                                       Pacioli.glbl_base_while_function(
                                           function () {
                                               return Pacioli.b_glbl_base_not_equal(
                                                          Pacioli.glbl_base_ref_get(lcl_i), 
                                                          Pacioli.glbl_base_ref_get(lcl_size));} ,
                                           function () {
                                               return Pacioli.glbl_base_seq(
                                                          (Pacioli.b_glbl_base_not_equal(
                                                               Pacioli.glbl_base_ref_get(lcl_i), 
                                                               lcl_n) ? Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_add_mut(
                                                                                   Pacioli.glbl_base_ref_get(lcl_result), 
                                                                                   Pacioli.b_glbl_base_nth(
                                                                                       Pacioli.glbl_base_ref_get(lcl_i), 
                                                                                       lcl_list))) : Pacioli.b_glbl_base_skip(
                                                                                                 ) ), 
                                                          Pacioli.glbl_base_ref_set(lcl_i, Pacioli.b_glbl_base_sum(
                                                                     Pacioli.glbl_base_ref_get(lcl_i), 
                                                                     Pacioli.num(1))));}), 
                                       Pacioli.glbl_base_throw_result(sym_2, Pacioli.glbl_base_ref_get(lcl_result)))))); } ,
                sym_2); }( 
            Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref());
}
Pacioli.glbl_standard_remove_nth = function (lcl_n,lcl_list) {
    return function (sym_2, lcl_i, lcl_size, lcl_i, lcl_result, lcl_result) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_empty_list(
                                           )), 
                           Pacioli.glbl_base_seq(
                               Pacioli.glbl_base_ref_set(lcl_i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                               Pacioli.glbl_base_seq(
                                   Pacioli.glbl_base_ref_set(lcl_size, Pacioli.glbl_base_list_size(
                                                 lcl_list)), 
                                   Pacioli.glbl_base_seq(
                                       Pacioli.glbl_base_while_function(
                                           function () {
                                               return Pacioli.glbl_base_not_equal(
                                                          Pacioli.glbl_base_ref_get(lcl_i), 
                                                          Pacioli.glbl_base_ref_get(lcl_size));} ,
                                           function () {
                                               return Pacioli.glbl_base_seq(
                                                          (Pacioli.glbl_base_not_equal(
                                                               Pacioli.glbl_base_ref_get(lcl_i), 
                                                               lcl_n) ? Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_add_mut(
                                                                                   Pacioli.glbl_base_ref_get(lcl_result), 
                                                                                   Pacioli.glbl_base_nth(
                                                                                       Pacioli.glbl_base_ref_get(lcl_i), 
                                                                                       lcl_list))) : Pacioli.glbl_base_skip(
                                                                                                 ) ), 
                                                          Pacioli.glbl_base_ref_set(lcl_i, Pacioli.glbl_base_sum(
                                                                     Pacioli.glbl_base_ref_get(lcl_i), 
                                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));}), 
                                       Pacioli.glbl_base_throw_result(sym_2, Pacioli.glbl_base_ref_get(lcl_result)))))); } ,
                sym_2); }( 
            Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref());
}

Pacioli.u_glbl_standard_positives = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_positives = function (lcl_x) {
    return Pacioli.b_glbl_base_multiply(
        lcl_x, 
        Pacioli.b_glbl_base_positive_support(
            lcl_x));
}
Pacioli.glbl_standard_positives = function (lcl_x) {
    return Pacioli.glbl_base_multiply(
        lcl_x, 
        Pacioli.glbl_base_positive_support(
            lcl_x));
}

Pacioli.u_glbl_testing_test_suite = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', [])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_test_suite = function (lcl_description,lcl_tests) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_tests, 
        false);
}
Pacioli.glbl_testing_test_suite = function (lcl_description,lcl_tests) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_tests, 
        false);
}

Pacioli.u_glbl_testing_sym_340 = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', [])])])]), Pacioli.typeFromVarName('_A_'));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_sym_340 = function (lcl_suites) {
    return function (sym_342, lcl_total_nr_skipped, lcl_total_nr_tests, lcl_nr_errors, lcl_suites_with_only, lcl_result, lcl_total_nr_successes, lcl_description, lcl_nr_tests, lcl_to_test, lcl_results, lcl_to_print, lcl_total_nr_successes, lcl_to_print, lcl_nr_skipped, lcl_nr_successes, lcl_total_nr_tests, lcl_nr_skipped_suites) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.b_glbl_base_print(
                               "\nRuning test suites\n\
"), 
                           Pacioli.glbl_base_seq(
                               Pacioli.glbl_base_ref_set(lcl_suites_with_only, (function (lcl__c_accu130) { return Pacioli.glbl_base_loop_list(
                                                                                             lcl__c_accu130, 
                                                                                             function (lcl__c_accu130, lcl_s) { return (Pacioli.b_glbl_testing_suite_is_only(
                                                                                                                                            lcl_s) ? Pacioli.glbl_base_add_mut(
                                                                                                                                                    lcl__c_accu130, 
                                                                                                                                                    lcl_s) : lcl__c_accu130 );}, 
                                                                                             lcl_suites);})(
                                                         Pacioli.glbl_base_empty_list(
                                                             ))), 
                               Pacioli.glbl_base_seq(
                                   Pacioli.glbl_base_ref_set(lcl_to_test, (Pacioli.b_glbl_base_equal(
                                                     Pacioli.glbl_base_ref_get(lcl_suites_with_only), 
                                                     Pacioli.glbl_base_empty_list(
                                                         )) ? lcl_suites : Pacioli.glbl_base_ref_get(lcl_suites_with_only) )), 
                                   Pacioli.glbl_base_seq(
                                       Pacioli.glbl_base_ref_set(lcl_nr_skipped_suites, Pacioli.b_glbl_base_minus(
                                                                  Pacioli.b_glbl_base_list_size(
                                                                      lcl_suites), 
                                                                  Pacioli.b_glbl_base_list_size(
                                                                      Pacioli.glbl_base_ref_get(lcl_to_test)))), 
                                       Pacioli.glbl_base_seq(
                                           Pacioli.glbl_base_ref_set(lcl_results, (function (lcl__c_accu132) { return Pacioli.glbl_base_loop_list(
                                                                                                lcl__c_accu132, 
                                                                                                function (lcl__c_accu132, lcl_s) { return Pacioli.glbl_base_add_mut(
                                                                                                                                              lcl__c_accu132, 
                                                                                                                                              Pacioli.glbl_base_tuple(
                                                                                                                                                  Pacioli.b_glbl_testing_suite_description(
                                                                                                                                                      lcl_s), 
                                                                                                                                                  Pacioli.b_glbl_testing_run_test_suite(
                                                                                                                                                      lcl_s)));}, 
                                                                                                Pacioli.glbl_base_ref_get(lcl_to_test));})(
                                                            Pacioli.glbl_base_empty_list(
                                                                ))), 
                                           Pacioli.glbl_base_seq(
                                               Pacioli.b_glbl_base_print(
                                                   Pacioli.b_glbl_base_format(
                                                       "Tests finished, %s suites tested%s\n\
", 
                                                       Pacioli.b_glbl_base_num2string(
                                                           Pacioli.b_glbl_base_list_size(
                                                               Pacioli.glbl_base_ref_get(lcl_to_test)), 
                                                           Pacioli.num(0)), 
                                                       Pacioli.b_glbl_testing_skipped_message(
                                                           Pacioli.glbl_base_ref_get(lcl_nr_skipped_suites)))), 
                                               Pacioli.glbl_base_seq(
                                                   Pacioli.glbl_base_ref_set(lcl_to_print, Pacioli.glbl_base_ref_get(lcl_results)), 
                                                   Pacioli.glbl_base_seq(
                                                       Pacioli.glbl_base_ref_set(lcl_total_nr_tests, Pacioli.num(0)), 
                                                       Pacioli.glbl_base_seq(
                                                           Pacioli.glbl_base_ref_set(lcl_total_nr_successes, Pacioli.num(0)), 
                                                           Pacioli.glbl_base_seq(
                                                               Pacioli.glbl_base_while_function(
                                                                   function () {
                                                                       return Pacioli.b_glbl_base_not_equal(
                                                                                  Pacioli.glbl_base_ref_get(lcl_to_print), 
                                                                                  Pacioli.glbl_base_empty_list(
                                                                                      ));} ,
                                                                   function () {
                                                                       return Pacioli.glbl_base_seq(
                                                                                  Pacioli.glbl_base_apply(function (fresh_description0, fresh_result0) {
                                                                                      return Pacioli.glbl_base_seq(Pacioli.glbl_base_ref_set(lcl_description, fresh_description0),
                                                                                      Pacioli.glbl_base_ref_set(lcl_result, fresh_result0)
                                                                                      ); }, Pacioli.glbl_base_head(
                                                                                                Pacioli.glbl_base_ref_get(lcl_to_print))), 
                                                                                  Pacioli.glbl_base_seq(
                                                                                      Pacioli.glbl_base_apply(function (fresh_nr_tests0, fresh_nr_errors0, fresh_nr_skipped0) {
                                                                                          return Pacioli.glbl_base_seq(Pacioli.glbl_base_ref_set(lcl_nr_tests, fresh_nr_tests0),
                                                                                          Pacioli.glbl_base_seq(Pacioli.glbl_base_ref_set(lcl_nr_errors, fresh_nr_errors0),
                                                                                          Pacioli.glbl_base_ref_set(lcl_nr_skipped, fresh_nr_skipped0)
                                                                                          )); }, Pacioli.glbl_base_ref_get(lcl_result)), 
                                                                                      Pacioli.glbl_base_seq(
                                                                                          Pacioli.glbl_base_ref_set(lcl_nr_successes, Pacioli.b_glbl_base_minus(
                                                                                                                Pacioli.glbl_base_ref_get(lcl_nr_tests), 
                                                                                                                Pacioli.glbl_base_ref_get(lcl_nr_errors))), 
                                                                                          Pacioli.glbl_base_seq(
                                                                                              Pacioli.b_glbl_base_print(
                                                                                                  Pacioli.b_glbl_base_format(
                                                                                                      "  %s -> %s/%s success%s\
", 
                                                                                                      Pacioli.glbl_base_ref_get(lcl_description), 
                                                                                                      Pacioli.b_glbl_base_num2string(
                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_successes), 
                                                                                                          Pacioli.num(0)), 
                                                                                                      Pacioli.b_glbl_base_num2string(
                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_tests), 
                                                                                                          Pacioli.num(0)), 
                                                                                                      Pacioli.b_glbl_testing_skipped_message(
                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_skipped)))), 
                                                                                              Pacioli.glbl_base_seq(
                                                                                                  Pacioli.glbl_base_ref_set(lcl_total_nr_tests, Pacioli.b_glbl_base_sum(
                                                                                                                          Pacioli.glbl_base_ref_get(lcl_total_nr_tests), 
                                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_tests))), 
                                                                                                  Pacioli.glbl_base_seq(
                                                                                                      Pacioli.glbl_base_ref_set(lcl_total_nr_successes, Pacioli.b_glbl_base_sum(
                                                                                                                                  Pacioli.glbl_base_ref_get(lcl_total_nr_successes), 
                                                                                                                                  Pacioli.glbl_base_ref_get(lcl_nr_successes))), 
                                                                                                      Pacioli.glbl_base_ref_set(lcl_to_print, Pacioli.glbl_base_tail(
                                                                                                                        Pacioli.glbl_base_ref_get(lcl_to_print)))))))));}), 
                                                               Pacioli.glbl_base_seq(
                                                                   Pacioli.glbl_base_ref_set(lcl_total_nr_skipped, Pacioli.b_glbl_base_minus(
                                                                                             Pacioli.b_glbl_standard_list_count(
                                                                                                 (function (lcl__c_accu134) { return Pacioli.glbl_base_loop_list(
                                                                                                                                         lcl__c_accu134, 
                                                                                                                                         function (lcl__c_accu134, lcl_s) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                       lcl__c_accu134, 
                                                                                                                                                                                       function (lcl__c_accu134, lcl_t) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                     lcl__c_accu134, 
                                                                                                                                                                                                                                     true);}, 
                                                                                                                                                                                       Pacioli.b_glbl_testing_suite_tests(
                                                                                                                                                                                           lcl_s));}, 
                                                                                                                                         lcl_suites);})(
                                                                                                     Pacioli.glbl_base_empty_list(
                                                                                                         ))), 
                                                                                             Pacioli.glbl_base_ref_get(lcl_total_nr_tests))), 
                                                                   Pacioli.b_glbl_base_print(
                                                                       Pacioli.b_glbl_base_format(
                                                                           "\nTotal tests -> %s/%s success%s\
", 
                                                                           Pacioli.b_glbl_base_num2string(
                                                                               Pacioli.glbl_base_ref_get(lcl_total_nr_successes), 
                                                                               Pacioli.num(0)), 
                                                                           Pacioli.b_glbl_base_num2string(
                                                                               Pacioli.glbl_base_ref_get(lcl_total_nr_tests), 
                                                                               Pacioli.num(0)), 
                                                                           Pacioli.b_glbl_testing_skipped_message(
                                                                               Pacioli.glbl_base_ref_get(lcl_total_nr_skipped))))))))))))))); } ,
                sym_342); }( 
            Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref());
}
Pacioli.glbl_testing_sym_340 = function (lcl_suites) {
    return function (sym_342, lcl_total_nr_skipped, lcl_total_nr_tests, lcl_nr_errors, lcl_suites_with_only, lcl_result, lcl_total_nr_successes, lcl_description, lcl_nr_tests, lcl_to_test, lcl_results, lcl_to_print, lcl_total_nr_successes, lcl_to_print, lcl_nr_skipped, lcl_nr_successes, lcl_total_nr_tests, lcl_nr_skipped_suites) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.glbl_base_print(
                               "\nRuning test suites\n\
"), 
                           Pacioli.glbl_base_seq(
                               Pacioli.glbl_base_ref_set(lcl_suites_with_only, (function (lcl__c_accu130) { return Pacioli.glbl_base_loop_list(
                                                                                             lcl__c_accu130, 
                                                                                             function (lcl__c_accu130, lcl_s) { return (Pacioli.glbl_testing_suite_is_only(
                                                                                                                                            lcl_s) ? Pacioli.glbl_base_add_mut(
                                                                                                                                                    lcl__c_accu130, 
                                                                                                                                                    lcl_s) : lcl__c_accu130 );}, 
                                                                                             lcl_suites);})(
                                                         Pacioli.glbl_base_empty_list(
                                                             ))), 
                               Pacioli.glbl_base_seq(
                                   Pacioli.glbl_base_ref_set(lcl_to_test, (Pacioli.glbl_base_equal(
                                                     Pacioli.glbl_base_ref_get(lcl_suites_with_only), 
                                                     Pacioli.glbl_base_empty_list(
                                                         )) ? lcl_suites : Pacioli.glbl_base_ref_get(lcl_suites_with_only) )), 
                                   Pacioli.glbl_base_seq(
                                       Pacioli.glbl_base_ref_set(lcl_nr_skipped_suites, Pacioli.glbl_base_minus(
                                                                  Pacioli.glbl_base_list_size(
                                                                      lcl_suites), 
                                                                  Pacioli.glbl_base_list_size(
                                                                      Pacioli.glbl_base_ref_get(lcl_to_test)))), 
                                       Pacioli.glbl_base_seq(
                                           Pacioli.glbl_base_ref_set(lcl_results, (function (lcl__c_accu132) { return Pacioli.glbl_base_loop_list(
                                                                                                lcl__c_accu132, 
                                                                                                function (lcl__c_accu132, lcl_s) { return Pacioli.glbl_base_add_mut(
                                                                                                                                              lcl__c_accu132, 
                                                                                                                                              Pacioli.glbl_base_tuple(
                                                                                                                                                  Pacioli.glbl_testing_suite_description(
                                                                                                                                                      lcl_s), 
                                                                                                                                                  Pacioli.glbl_testing_run_test_suite(
                                                                                                                                                      lcl_s)));}, 
                                                                                                Pacioli.glbl_base_ref_get(lcl_to_test));})(
                                                            Pacioli.glbl_base_empty_list(
                                                                ))), 
                                           Pacioli.glbl_base_seq(
                                               Pacioli.glbl_base_print(
                                                   Pacioli.glbl_base_format(
                                                       "Tests finished, %s suites tested%s\n\
", 
                                                       Pacioli.glbl_base_num2string(
                                                           Pacioli.glbl_base_list_size(
                                                               Pacioli.glbl_base_ref_get(lcl_to_test)), 
                                                           Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                       Pacioli.glbl_testing_skipped_message(
                                                           Pacioli.glbl_base_ref_get(lcl_nr_skipped_suites)))), 
                                               Pacioli.glbl_base_seq(
                                                   Pacioli.glbl_base_ref_set(lcl_to_print, Pacioli.glbl_base_ref_get(lcl_results)), 
                                                   Pacioli.glbl_base_seq(
                                                       Pacioli.glbl_base_ref_set(lcl_total_nr_tests, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                       Pacioli.glbl_base_seq(
                                                           Pacioli.glbl_base_ref_set(lcl_total_nr_successes, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                           Pacioli.glbl_base_seq(
                                                               Pacioli.glbl_base_while_function(
                                                                   function () {
                                                                       return Pacioli.glbl_base_not_equal(
                                                                                  Pacioli.glbl_base_ref_get(lcl_to_print), 
                                                                                  Pacioli.glbl_base_empty_list(
                                                                                      ));} ,
                                                                   function () {
                                                                       return Pacioli.glbl_base_seq(
                                                                                  Pacioli.glbl_base_apply(function (fresh_description0, fresh_result0) {
                                                                                      return Pacioli.glbl_base_seq(Pacioli.glbl_base_ref_set(lcl_description, fresh_description0),
                                                                                      Pacioli.glbl_base_ref_set(lcl_result, fresh_result0)
                                                                                      ); }, Pacioli.glbl_base_head(
                                                                                                Pacioli.glbl_base_ref_get(lcl_to_print))), 
                                                                                  Pacioli.glbl_base_seq(
                                                                                      Pacioli.glbl_base_apply(function (fresh_nr_tests0, fresh_nr_errors0, fresh_nr_skipped0) {
                                                                                          return Pacioli.glbl_base_seq(Pacioli.glbl_base_ref_set(lcl_nr_tests, fresh_nr_tests0),
                                                                                          Pacioli.glbl_base_seq(Pacioli.glbl_base_ref_set(lcl_nr_errors, fresh_nr_errors0),
                                                                                          Pacioli.glbl_base_ref_set(lcl_nr_skipped, fresh_nr_skipped0)
                                                                                          )); }, Pacioli.glbl_base_ref_get(lcl_result)), 
                                                                                      Pacioli.glbl_base_seq(
                                                                                          Pacioli.glbl_base_ref_set(lcl_nr_successes, Pacioli.glbl_base_minus(
                                                                                                                Pacioli.glbl_base_ref_get(lcl_nr_tests), 
                                                                                                                Pacioli.glbl_base_ref_get(lcl_nr_errors))), 
                                                                                          Pacioli.glbl_base_seq(
                                                                                              Pacioli.glbl_base_print(
                                                                                                  Pacioli.glbl_base_format(
                                                                                                      "  %s -> %s/%s success%s\
", 
                                                                                                      Pacioli.glbl_base_ref_get(lcl_description), 
                                                                                                      Pacioli.glbl_base_num2string(
                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_successes), 
                                                                                                          Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                                                                      Pacioli.glbl_base_num2string(
                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_tests), 
                                                                                                          Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                                                                      Pacioli.glbl_testing_skipped_message(
                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_skipped)))), 
                                                                                              Pacioli.glbl_base_seq(
                                                                                                  Pacioli.glbl_base_ref_set(lcl_total_nr_tests, Pacioli.glbl_base_sum(
                                                                                                                          Pacioli.glbl_base_ref_get(lcl_total_nr_tests), 
                                                                                                                          Pacioli.glbl_base_ref_get(lcl_nr_tests))), 
                                                                                                  Pacioli.glbl_base_seq(
                                                                                                      Pacioli.glbl_base_ref_set(lcl_total_nr_successes, Pacioli.glbl_base_sum(
                                                                                                                                  Pacioli.glbl_base_ref_get(lcl_total_nr_successes), 
                                                                                                                                  Pacioli.glbl_base_ref_get(lcl_nr_successes))), 
                                                                                                      Pacioli.glbl_base_ref_set(lcl_to_print, Pacioli.glbl_base_tail(
                                                                                                                        Pacioli.glbl_base_ref_get(lcl_to_print)))))))));}), 
                                                               Pacioli.glbl_base_seq(
                                                                   Pacioli.glbl_base_ref_set(lcl_total_nr_skipped, Pacioli.glbl_base_minus(
                                                                                             Pacioli.glbl_standard_list_count(
                                                                                                 (function (lcl__c_accu134) { return Pacioli.glbl_base_loop_list(
                                                                                                                                         lcl__c_accu134, 
                                                                                                                                         function (lcl__c_accu134, lcl_s) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                       lcl__c_accu134, 
                                                                                                                                                                                       function (lcl__c_accu134, lcl_t) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                     lcl__c_accu134, 
                                                                                                                                                                                                                                     true);}, 
                                                                                                                                                                                       Pacioli.glbl_testing_suite_tests(
                                                                                                                                                                                           lcl_s));}, 
                                                                                                                                         lcl_suites);})(
                                                                                                     Pacioli.glbl_base_empty_list(
                                                                                                         ))), 
                                                                                             Pacioli.glbl_base_ref_get(lcl_total_nr_tests))), 
                                                                   Pacioli.glbl_base_print(
                                                                       Pacioli.glbl_base_format(
                                                                           "\nTotal tests -> %s/%s success%s\
", 
                                                                           Pacioli.glbl_base_num2string(
                                                                               Pacioli.glbl_base_ref_get(lcl_total_nr_successes), 
                                                                               Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                                           Pacioli.glbl_base_num2string(
                                                                               Pacioli.glbl_base_ref_get(lcl_total_nr_tests), 
                                                                               Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                                           Pacioli.glbl_testing_skipped_message(
                                                                               Pacioli.glbl_base_ref_get(lcl_total_nr_skipped))))))))))))))); } ,
                sym_342); }( 
            Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref());
}

Pacioli.u_glbl_testing_sym_338 = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), new Pacioli.GenericType('List', [new Pacioli.GenericType('String', [])]), Pacioli.typeFromVarName('_C_'), Pacioli.typeFromVarName('_D_'), Pacioli.typeFromVarName('_E_'), Pacioli.typeFromVarName('_F_'), Pacioli.typeFromVarName('_G_'), Pacioli.typeFromVarName('_H_'), Pacioli.typeFromVarName('_I_'), Pacioli.typeFromVarName('_J_'), Pacioli.typeFromVarName('_K_')]), new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_E_'), Pacioli.typeFromVarName('_I_'), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_sym_338 = function (lcl_nr_skipped,lcl_all_tests,lcl__147,lcl_messages,lcl_tests,lcl_description,lcl_nr_tests,lcl_nr_onlys,lcl_tests_with_only,lcl_summary,lcl_nr_failures,lcl_results,lcl_suite) {
    return function (sym_343) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.b_glbl_base_print(
                               Pacioli.b_glbl_base_format(
                                   "%s\n%s\n%s%s\n\
", 
                                   lcl_description, 
                                   Pacioli.b_glbl_standard_intercalate(
                                       lcl_messages, 
                                       "\n\
"), 
                                   lcl_summary, 
                                   Pacioli.b_glbl_testing_skipped_message(
                                       lcl_nr_skipped))), 
                           Pacioli.glbl_base_throw_result(sym_343, Pacioli.glbl_base_tuple(
                               lcl_nr_tests, 
                               lcl_nr_failures, 
                               lcl_nr_skipped))); } ,
                sym_343); }( 
            Pacioli.glbl_base_empty_ref());
}
Pacioli.glbl_testing_sym_338 = function (lcl_nr_skipped,lcl_all_tests,lcl__147,lcl_messages,lcl_tests,lcl_description,lcl_nr_tests,lcl_nr_onlys,lcl_tests_with_only,lcl_summary,lcl_nr_failures,lcl_results,lcl_suite) {
    return function (sym_343) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.glbl_base_print(
                               Pacioli.glbl_base_format(
                                   "%s\n%s\n%s%s\n\
", 
                                   lcl_description, 
                                   Pacioli.glbl_standard_intercalate(
                                       lcl_messages, 
                                       "\n\
"), 
                                   lcl_summary, 
                                   Pacioli.glbl_testing_skipped_message(
                                       lcl_nr_skipped))), 
                           Pacioli.glbl_base_throw_result(sym_343, Pacioli.glbl_base_tuple(
                               lcl_nr_tests, 
                               lcl_nr_failures, 
                               lcl_nr_skipped))); } ,
                sym_343); }( 
            Pacioli.glbl_base_empty_ref());
}

Pacioli.u_glbl_standard_list_max = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_max = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.bfetchValue('base', 'max'), 
        lcl_x);
}
Pacioli.glbl_standard_list_max = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.fetchValue('base', 'max'), 
        lcl_x);
}

Pacioli.u_glbl_standard_right_inverse = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_right_inverse = function (lcl_x) {
    return Pacioli.b_glbl_base_solve(
        lcl_x, 
        Pacioli.b_glbl_base_left_identity(
            lcl_x));
}
Pacioli.glbl_standard_right_inverse = function (lcl_x) {
    return Pacioli.glbl_base_solve(
        lcl_x, 
        Pacioli.glbl_base_left_identity(
            lcl_x));
}

Pacioli.u_glbl_testing_run_test_suite = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), Pacioli.typeFromVarName('_B_')])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_run_test_suite = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl_description, lcl_all_tests, lcl__147) { return (function (lcl_nr_onlys) { return (function (lcl_tests_with_only) { return (function (lcl_tests) { return (function (lcl_results) { return (function (lcl_nr_tests) { return (function (lcl_nr_failures) { return (function (lcl_nr_skipped) { return (function (lcl_messages) { return (function (lcl_summary) { return Pacioli.b_glbl_testing_sym_338(
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_skipped, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_all_tests, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl__147, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_messages, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_tests, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_description, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_tests, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_onlys, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_tests_with_only, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_summary, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_failures, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_results, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_suite);})(
                                                                                                                                                                                                                                                                                                                                                                 (Pacioli.b_glbl_base_equal(
                                                                                                                                                                                                                                                                                                                                                                      lcl_nr_failures, 
                                                                                                                                                                                                                                                                                                                                                                      Pacioli.num(0)) ? Pacioli.b_glbl_base_format(
                                                                                                                                                                                                                                                                                                                                                                              "All %s tests succeeded\
", 
                                                                                                                                                                                                                                                                                                                                                                              Pacioli.b_glbl_base_num2string(
                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_tests, 
                                                                                                                                                                                                                                                                                                                                                                                  Pacioli.num(0))) : Pacioli.b_glbl_base_format(
                                                                                                                                                                                                                                                                                                                                                                                           "\nTEST FAILURES!!!!!\n\n  %s of %s tests failed\
", 
                                                                                                                                                                                                                                                                                                                                                                                           Pacioli.b_glbl_base_num2string(
                                                                                                                                                                                                                                                                                                                                                                                               lcl_nr_failures, 
                                                                                                                                                                                                                                                                                                                                                                                               Pacioli.num(0)), 
                                                                                                                                                                                                                                                                                                                                                                                           Pacioli.b_glbl_base_num2string(
                                                                                                                                                                                                                                                                                                                                                                                               lcl_nr_tests, 
                                                                                                                                                                                                                                                                                                                                                                                               Pacioli.num(0))) ));})(
                                                                                                                                                                                                                                                                                                                               (function (lcl__c_accu145) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                                                                                                                                                                                                       lcl__c_accu145, 
                                                                                                                                                                                                                                                                                                                                                                       function (lcl__c_accu145, lcl__c_tup146) { return Pacioli.glbl_base_apply(
                                                                                                                                                                                                                                                                                                                                                                                                                             function (lcl_description, lcl_okay) { return (function (lcl_result) { return (function (lcl_message) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                lcl__c_accu145, 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                lcl_message);})(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Pacioli.b_glbl_base_format(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   "  %s -> %s\
", 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   lcl_description, 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   lcl_result));})(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               (lcl_okay ? "ok\
" : "FAIL!\
" ));}, 
                                                                                                                                                                                                                                                                                                                                                                                                                             lcl__c_tup146);}, 
                                                                                                                                                                                                                                                                                                                                                                       lcl_results);})(
                                                                                                                                                                                                                                                                                                                                   Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                                                       )));})(
                                                                                                                                                                                                                                                                                           Pacioli.b_glbl_base_minus(
                                                                                                                                                                                                                                                                                               Pacioli.b_glbl_base_list_size(
                                                                                                                                                                                                                                                                                                   lcl_all_tests), 
                                                                                                                                                                                                                                                                                               lcl_nr_tests));})(
                                                                                                                                                                                                                                                      Pacioli.b_glbl_standard_list_count(
                                                                                                                                                                                                                                                          (function (lcl__c_accu142) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                                                                                                                                  lcl__c_accu142, 
                                                                                                                                                                                                                                                                                                  function (lcl__c_accu142, lcl__c_tup143) { return Pacioli.glbl_base_apply(
                                                                                                                                                                                                                                                                                                                                                        function (lcl__144, lcl_okay) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                                                                                                                   lcl__c_accu142, 
                                                                                                                                                                                                                                                                                                                                                                                                   Pacioli.b_glbl_base_not(
                                                                                                                                                                                                                                                                                                                                                                                                       lcl_okay));}, 
                                                                                                                                                                                                                                                                                                                                                        lcl__c_tup143);}, 
                                                                                                                                                                                                                                                                                                  lcl_results);})(
                                                                                                                                                                                                                                                              Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                  ))));})(
                                                                                                                                                                                                                    Pacioli.b_glbl_base_list_size(
                                                                                                                                                                                                                        lcl_tests));})(
                                                                                                                                                                                   (function (lcl__c_accu140) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                                                           lcl__c_accu140, 
                                                                                                                                                                                                                           function (lcl__c_accu140, lcl_test) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                            lcl__c_accu140, 
                                                                                                                                                                                                                                                                            Pacioli.glbl_base_tuple(
                                                                                                                                                                                                                                                                                Pacioli.b_glbl_testing_test_description(
                                                                                                                                                                                                                                                                                    lcl_test), 
                                                                                                                                                                                                                                                                                Pacioli.b_glbl_testing_run_test(
                                                                                                                                                                                                                                                                                    lcl_test)));}, 
                                                                                                                                                                                                                           lcl_tests);})(
                                                                                                                                                                                       Pacioli.glbl_base_empty_list(
                                                                                                                                                                                           )));})(
                                                                                                                                                    (Pacioli.b_glbl_base_equal(
                                                                                                                                                         lcl_tests_with_only, 
                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                             )) ? lcl_all_tests : lcl_tests_with_only ));})(
                                                                                                           (function (lcl__c_accu138) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                   lcl__c_accu138, 
                                                                                                                                                   function (lcl__c_accu138, lcl_t) { return (Pacioli.b_glbl_testing_test_is_only(
                                                                                                                                                                                                  lcl_t) ? Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                          lcl__c_accu138, 
                                                                                                                                                                                                          lcl_t) : lcl__c_accu138 );}, 
                                                                                                                                                   lcl_all_tests);})(
                                                                                                               Pacioli.glbl_base_empty_list(
                                                                                                                   )));})(
                                                                         Pacioli.b_glbl_standard_list_count(
                                                                             (function (lcl__c_accu136) { return Pacioli.glbl_base_loop_list(
                                                                                                                     lcl__c_accu136, 
                                                                                                                     function (lcl__c_accu136, lcl_t) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                   lcl__c_accu136, 
                                                                                                                                                                   Pacioli.b_glbl_testing_test_is_only(
                                                                                                                                                                       lcl_t));}, 
                                                                                                                     lcl_all_tests);})(
                                                                                 Pacioli.glbl_base_empty_list(
                                                                                     ))));}, 
        lcl_suite);
}
Pacioli.glbl_testing_run_test_suite = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl_description, lcl_all_tests, lcl__147) { return (function (lcl_nr_onlys) { return (function (lcl_tests_with_only) { return (function (lcl_tests) { return (function (lcl_results) { return (function (lcl_nr_tests) { return (function (lcl_nr_failures) { return (function (lcl_nr_skipped) { return (function (lcl_messages) { return (function (lcl_summary) { return Pacioli.glbl_testing_sym_338(
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_skipped, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_all_tests, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl__147, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_messages, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_tests, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_description, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_tests, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_onlys, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_tests_with_only, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_summary, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_failures, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_results, 
                                                                                                                                                                                                                                                                                                                                                                                                  lcl_suite);})(
                                                                                                                                                                                                                                                                                                                                                                 (Pacioli.glbl_base_equal(
                                                                                                                                                                                                                                                                                                                                                                      lcl_nr_failures, 
                                                                                                                                                                                                                                                                                                                                                                      Pacioli.initialNumbers(1, 1, [[0, 0, 0]])) ? Pacioli.glbl_base_format(
                                                                                                                                                                                                                                                                                                                                                                              "All %s tests succeeded\
", 
                                                                                                                                                                                                                                                                                                                                                                              Pacioli.glbl_base_num2string(
                                                                                                                                                                                                                                                                                                                                                                                  lcl_nr_tests, 
                                                                                                                                                                                                                                                                                                                                                                                  Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))) : Pacioli.glbl_base_format(
                                                                                                                                                                                                                                                                                                                                                                                           "\nTEST FAILURES!!!!!\n\n  %s of %s tests failed\
", 
                                                                                                                                                                                                                                                                                                                                                                                           Pacioli.glbl_base_num2string(
                                                                                                                                                                                                                                                                                                                                                                                               lcl_nr_failures, 
                                                                                                                                                                                                                                                                                                                                                                                               Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                                                                                                                                                                                                                                                                                                                                                                                           Pacioli.glbl_base_num2string(
                                                                                                                                                                                                                                                                                                                                                                                               lcl_nr_tests, 
                                                                                                                                                                                                                                                                                                                                                                                               Pacioli.initialNumbers(1, 1, [[0, 0, 0]]))) ));})(
                                                                                                                                                                                                                                                                                                                               (function (lcl__c_accu145) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                                                                                                                                                                                                       lcl__c_accu145, 
                                                                                                                                                                                                                                                                                                                                                                       function (lcl__c_accu145, lcl__c_tup146) { return Pacioli.glbl_base_apply(
                                                                                                                                                                                                                                                                                                                                                                                                                             function (lcl_description, lcl_okay) { return (function (lcl_result) { return (function (lcl_message) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                lcl__c_accu145, 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                lcl_message);})(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Pacioli.glbl_base_format(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   "  %s -> %s\
", 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   lcl_description, 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   lcl_result));})(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               (lcl_okay ? "ok\
" : "FAIL!\
" ));}, 
                                                                                                                                                                                                                                                                                                                                                                                                                             lcl__c_tup146);}, 
                                                                                                                                                                                                                                                                                                                                                                       lcl_results);})(
                                                                                                                                                                                                                                                                                                                                   Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                                                       )));})(
                                                                                                                                                                                                                                                                                           Pacioli.glbl_base_minus(
                                                                                                                                                                                                                                                                                               Pacioli.glbl_base_list_size(
                                                                                                                                                                                                                                                                                                   lcl_all_tests), 
                                                                                                                                                                                                                                                                                               lcl_nr_tests));})(
                                                                                                                                                                                                                                                      Pacioli.glbl_standard_list_count(
                                                                                                                                                                                                                                                          (function (lcl__c_accu142) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                                                                                                                                  lcl__c_accu142, 
                                                                                                                                                                                                                                                                                                  function (lcl__c_accu142, lcl__c_tup143) { return Pacioli.glbl_base_apply(
                                                                                                                                                                                                                                                                                                                                                        function (lcl__144, lcl_okay) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                                                                                                                   lcl__c_accu142, 
                                                                                                                                                                                                                                                                                                                                                                                                   Pacioli.glbl_base_not(
                                                                                                                                                                                                                                                                                                                                                                                                       lcl_okay));}, 
                                                                                                                                                                                                                                                                                                                                                        lcl__c_tup143);}, 
                                                                                                                                                                                                                                                                                                  lcl_results);})(
                                                                                                                                                                                                                                                              Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                  ))));})(
                                                                                                                                                                                                                    Pacioli.glbl_base_list_size(
                                                                                                                                                                                                                        lcl_tests));})(
                                                                                                                                                                                   (function (lcl__c_accu140) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                                                                                           lcl__c_accu140, 
                                                                                                                                                                                                                           function (lcl__c_accu140, lcl_test) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                            lcl__c_accu140, 
                                                                                                                                                                                                                                                                            Pacioli.glbl_base_tuple(
                                                                                                                                                                                                                                                                                Pacioli.glbl_testing_test_description(
                                                                                                                                                                                                                                                                                    lcl_test), 
                                                                                                                                                                                                                                                                                Pacioli.glbl_testing_run_test(
                                                                                                                                                                                                                                                                                    lcl_test)));}, 
                                                                                                                                                                                                                           lcl_tests);})(
                                                                                                                                                                                       Pacioli.glbl_base_empty_list(
                                                                                                                                                                                           )));})(
                                                                                                                                                    (Pacioli.glbl_base_equal(
                                                                                                                                                         lcl_tests_with_only, 
                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                             )) ? lcl_all_tests : lcl_tests_with_only ));})(
                                                                                                           (function (lcl__c_accu138) { return Pacioli.glbl_base_loop_list(
                                                                                                                                                   lcl__c_accu138, 
                                                                                                                                                   function (lcl__c_accu138, lcl_t) { return (Pacioli.glbl_testing_test_is_only(
                                                                                                                                                                                                  lcl_t) ? Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                          lcl__c_accu138, 
                                                                                                                                                                                                          lcl_t) : lcl__c_accu138 );}, 
                                                                                                                                                   lcl_all_tests);})(
                                                                                                               Pacioli.glbl_base_empty_list(
                                                                                                                   )));})(
                                                                         Pacioli.glbl_standard_list_count(
                                                                             (function (lcl__c_accu136) { return Pacioli.glbl_base_loop_list(
                                                                                                                     lcl__c_accu136, 
                                                                                                                     function (lcl__c_accu136, lcl_t) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                   lcl__c_accu136, 
                                                                                                                                                                   Pacioli.glbl_testing_test_is_only(
                                                                                                                                                                       lcl_t));}, 
                                                                                                                     lcl_all_tests);})(
                                                                                 Pacioli.glbl_base_empty_list(
                                                                                     ))));}, 
        lcl_suite);
}

Pacioli.u_glbl_testing_suite_description = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_C_')])]), Pacioli.typeFromVarName('_A_'));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_suite_description = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl_description, lcl__124, lcl__125) { return lcl_description;}, 
        lcl_suite);
}
Pacioli.glbl_testing_suite_description = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl_description, lcl__124, lcl__125) { return lcl_description;}, 
        lcl_suite);
}

Pacioli.u_glbl_base_decs_io = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_C_')])]), new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_C_')]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_base_decs_io = function (lcl_n,lcl_settings) {
    return Pacioli.glbl_base_apply(
        function (lcl__30, lcl_thousands_separator) { return Pacioli.glbl_base_tuple(
                                                                 lcl_n, 
                                                                 lcl_thousands_separator);}, 
        lcl_settings);
}
Pacioli.glbl_base_decs_io = function (lcl_n,lcl_settings) {
    return Pacioli.glbl_base_apply(
        function (lcl__30, lcl_thousands_separator) { return Pacioli.glbl_base_tuple(
                                                                 lcl_n, 
                                                                 lcl_thousands_separator);}, 
        lcl_settings);
}

Pacioli.u_glbl_base_int2str_io = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('String', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_base_int2str_io = function (lcl_x,lcl_settings) {
    return Pacioli.b_glbl_base_num2str_io(
        lcl_x, 
        Pacioli.b_glbl_base_decs_io(
            Pacioli.num(0), 
            lcl_settings));
}
Pacioli.glbl_base_int2str_io = function (lcl_x,lcl_settings) {
    return Pacioli.glbl_base_num2str_io(
        lcl_x, 
        Pacioli.glbl_base_decs_io(
            Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
            lcl_settings));
}

Pacioli.u_glbl_testing_suite_is_only = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_C_')])]), Pacioli.typeFromVarName('_C_'));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_suite_is_only = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl__128, lcl__129, lcl_is_only) { return lcl_is_only;}, 
        lcl_suite);
}
Pacioli.glbl_testing_suite_is_only = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl__128, lcl__129, lcl_is_only) { return lcl_is_only;}, 
        lcl_suite);
}

Pacioli.u_glbl_base_decs = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType('Boole', [])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_base_decs = function (lcl_n) {
    return Pacioli.b_glbl_base_decs_io(
        lcl_n, 
        Pacioli.bfetchValue('base', 'io_settings'));
}
Pacioli.glbl_base_decs = function (lcl_n) {
    return Pacioli.glbl_base_decs_io(
        lcl_n, 
        Pacioli.fetchValue('base', 'io_settings'));
}

Pacioli.u_glbl_testing_test_only = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_')]), new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), new Pacioli.GenericType('Boole', [])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_test_only = function (lcl_description,lcl_body) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_body, 
        true);
}
Pacioli.glbl_testing_test_only = function (lcl_description,lcl_body) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_body, 
        true);
}

Pacioli.u_glbl_testing_test = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', []))]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_test = function (lcl_description,lcl_body) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_body, 
        false);
}
Pacioli.glbl_testing_test = function (lcl_description,lcl_body) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_body, 
        false);
}

Pacioli.u_glbl_standard_map_matrix = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.ONE, '_D_', Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_b_').expt(1), '_C_', Pacioli.ONE, '_D_', Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_map_matrix = function (lcl_fun,lcl_mat) {
    return Pacioli.b_glbl_base_make_matrix(
        (function (lcl__c_accu44) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu44, 
                                               function (lcl__c_accu44, lcl_i) { return Pacioli.glbl_base_loop_list(
                                                                                            lcl__c_accu44, 
                                                                                            function (lcl__c_accu44, lcl_j) { return Pacioli.glbl_base_add_mut(
                                                                                                                                         lcl__c_accu44, 
                                                                                                                                         Pacioli.glbl_base_tuple(
                                                                                                                                             lcl_i, 
                                                                                                                                             lcl_j, 
                                                                                                                                             (lcl_fun)(
                                                                                                                                                 Pacioli.b_glbl_base_get(
                                                                                                                                                     lcl_mat, 
                                                                                                                                                     lcl_i, 
                                                                                                                                                     lcl_j))));}, 
                                                                                            Pacioli.b_glbl_base_column_domain(
                                                                                                lcl_mat));}, 
                                               Pacioli.b_glbl_base_row_domain(
                                                   lcl_mat));})(
            Pacioli.glbl_base_empty_list(
                )));
}
Pacioli.glbl_standard_map_matrix = function (lcl_fun,lcl_mat) {
    return Pacioli.glbl_base_make_matrix(
        (function (lcl__c_accu44) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu44, 
                                               function (lcl__c_accu44, lcl_i) { return Pacioli.glbl_base_loop_list(
                                                                                            lcl__c_accu44, 
                                                                                            function (lcl__c_accu44, lcl_j) { return Pacioli.glbl_base_add_mut(
                                                                                                                                         lcl__c_accu44, 
                                                                                                                                         Pacioli.glbl_base_tuple(
                                                                                                                                             lcl_i, 
                                                                                                                                             lcl_j, 
                                                                                                                                             (lcl_fun)(
                                                                                                                                                 Pacioli.glbl_base_get(
                                                                                                                                                     lcl_mat, 
                                                                                                                                                     lcl_i, 
                                                                                                                                                     lcl_j))));}, 
                                                                                            Pacioli.glbl_base_column_domain(
                                                                                                lcl_mat));}, 
                                               Pacioli.glbl_base_row_domain(
                                                   lcl_mat));})(
            Pacioli.glbl_base_empty_list(
                )));
}

Pacioli.u_glbl_standard_is_zero_column = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), '_E_']), new Pacioli.GenericType('Boole', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_is_zero_column = function (lcl_x,lcl_j) {
    return Pacioli.b_glbl_base_is_zero(
        Pacioli.b_glbl_base_column(
            Pacioli.b_glbl_base_magnitude(
                lcl_x), 
            lcl_j));
}
Pacioli.glbl_standard_is_zero_column = function (lcl_x,lcl_j) {
    return Pacioli.glbl_base_is_zero(
        Pacioli.glbl_base_column(
            Pacioli.glbl_base_magnitude(
                lcl_x), 
            lcl_j));
}

Pacioli.u_glbl_standard_list_all = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_all = function (lcl_x) {
    return (Pacioli.b_glbl_base_equal(
         lcl_x, 
         Pacioli.glbl_base_empty_list(
             )) ? true : Pacioli.glbl_base_fold_list(
                         function (lcl_a, lcl_b) { return (lcl_a ? lcl_b : false );}, 
                         lcl_x) );
}
Pacioli.glbl_standard_list_all = function (lcl_x) {
    return (Pacioli.glbl_base_equal(
         lcl_x, 
         Pacioli.glbl_base_empty_list(
             )) ? true : Pacioli.glbl_base_fold_list(
                         function (lcl_a, lcl_b) { return (lcl_a ? lcl_b : false );}, 
                         lcl_x) );
}

Pacioli.u_glbl_standard_intercalate = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType('String', [])]), new Pacioli.GenericType('String', [])]), new Pacioli.GenericType('String', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_intercalate = function (lcl_items,lcl_seperator) {
    return (Pacioli.b_glbl_base_equal(
         lcl_items, 
         Pacioli.glbl_base_empty_list(
             )) ? "\
" : Pacioli.glbl_base_fold_list(
                             function (lcl_x, lcl_y) { return Pacioli.b_glbl_base_concatenate(
                                                                  lcl_x, 
                                                                  Pacioli.b_glbl_base_concatenate(
                                                                      lcl_seperator, 
                                                                      lcl_y));}, 
                             lcl_items) );
}
Pacioli.glbl_standard_intercalate = function (lcl_items,lcl_seperator) {
    return (Pacioli.glbl_base_equal(
         lcl_items, 
         Pacioli.glbl_base_empty_list(
             )) ? "\
" : Pacioli.glbl_base_fold_list(
                             function (lcl_x, lcl_y) { return Pacioli.glbl_base_concatenate(
                                                                  lcl_x, 
                                                                  Pacioli.glbl_base_concatenate(
                                                                      lcl_seperator, 
                                                                      lcl_y));}, 
                             lcl_items) );
}

Pacioli.u_glbl_standard_combis = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')])]), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_A_')])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_combis = function (lcl_list) {
    return (function (lcl_accumulator) { return Pacioli.glbl_base_apply(
                                             function (lcl_result, lcl__54) { return lcl_result;}, 
                                             Pacioli.glbl_base_loop_list(
                                                 Pacioli.glbl_base_tuple(
                                                     Pacioli.glbl_base_empty_list(
                                                         ), 
                                                     lcl_list), 
                                                 lcl_accumulator, 
                                                 lcl_list));})(
        function (lcl_accu, lcl_x) { return Pacioli.glbl_base_apply(
                                                function (lcl_result, lcl_tails) { return Pacioli.glbl_base_tuple(
                                                                                              Pacioli.glbl_base_append(
                                                                                                  (function (lcl__c_accu52) { return Pacioli.glbl_base_loop_list(
                                                                                                                                         lcl__c_accu52, 
                                                                                                                                         function (lcl__c_accu52, lcl_y) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                      lcl__c_accu52, 
                                                                                                                                                                                      Pacioli.glbl_base_tuple(
                                                                                                                                                                                          lcl_x, 
                                                                                                                                                                                          lcl_y));}, 
                                                                                                                                         Pacioli.glbl_base_tail(
                                                                                                                                             lcl_tails));})(
                                                                                                      Pacioli.glbl_base_empty_list(
                                                                                                          )), 
                                                                                                  lcl_result), 
                                                                                              Pacioli.glbl_base_tail(
                                                                                                  lcl_tails));}, 
                                                lcl_accu);});
}
Pacioli.glbl_standard_combis = function (lcl_list) {
    return (function (lcl_accumulator) { return Pacioli.glbl_base_apply(
                                             function (lcl_result, lcl__54) { return lcl_result;}, 
                                             Pacioli.glbl_base_loop_list(
                                                 Pacioli.glbl_base_tuple(
                                                     Pacioli.glbl_base_empty_list(
                                                         ), 
                                                     lcl_list), 
                                                 lcl_accumulator, 
                                                 lcl_list));})(
        function (lcl_accu, lcl_x) { return Pacioli.glbl_base_apply(
                                                function (lcl_result, lcl_tails) { return Pacioli.glbl_base_tuple(
                                                                                              Pacioli.glbl_base_append(
                                                                                                  (function (lcl__c_accu52) { return Pacioli.glbl_base_loop_list(
                                                                                                                                         lcl__c_accu52, 
                                                                                                                                         function (lcl__c_accu52, lcl_y) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                      lcl__c_accu52, 
                                                                                                                                                                                      Pacioli.glbl_base_tuple(
                                                                                                                                                                                          lcl_x, 
                                                                                                                                                                                          lcl_y));}, 
                                                                                                                                         Pacioli.glbl_base_tail(
                                                                                                                                             lcl_tails));})(
                                                                                                      Pacioli.glbl_base_empty_list(
                                                                                                          )), 
                                                                                                  lcl_result), 
                                                                                              Pacioli.glbl_base_tail(
                                                                                                  lcl_tails));}, 
                                                lcl_accu);});
}

Pacioli.u_glbl_standard_sym_146 = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_sym_146 = function (lcl_list,lcl_n) {
    return function (sym_147, lcl_i, lcl_size, lcl_result, lcl_result, lcl_i) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_empty_list(
                                           )), 
                           Pacioli.glbl_base_seq(
                               Pacioli.glbl_base_ref_set(lcl_i, Pacioli.num(0)), 
                               Pacioli.glbl_base_seq(
                                   Pacioli.glbl_base_ref_set(lcl_size, Pacioli.b_glbl_base_list_size(
                                                 lcl_list)), 
                                   Pacioli.glbl_base_seq(
                                       Pacioli.glbl_base_while_function(
                                           function () {
                                               return Pacioli.b_glbl_base_not_equal(
                                                          Pacioli.glbl_base_ref_get(lcl_i), 
                                                          Pacioli.glbl_base_ref_get(lcl_size));} ,
                                           function () {
                                               return Pacioli.glbl_base_seq(
                                                          (Pacioli.b_glbl_base_not_equal(
                                                               Pacioli.glbl_base_ref_get(lcl_i), 
                                                               lcl_n) ? Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_add_mut(
                                                                                   Pacioli.glbl_base_ref_get(lcl_result), 
                                                                                   Pacioli.b_glbl_base_nth(
                                                                                       Pacioli.glbl_base_ref_get(lcl_i), 
                                                                                       lcl_list))) : Pacioli.b_glbl_base_skip(
                                                                                                 ) ), 
                                                          Pacioli.glbl_base_ref_set(lcl_i, Pacioli.b_glbl_base_sum(
                                                                     Pacioli.glbl_base_ref_get(lcl_i), 
                                                                     Pacioli.num(1))));}), 
                                       Pacioli.glbl_base_throw_result(sym_147, Pacioli.glbl_base_ref_get(lcl_result)))))); } ,
                sym_147); }( 
            Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref());
}
Pacioli.glbl_standard_sym_146 = function (lcl_list,lcl_n) {
    return function (sym_147, lcl_i, lcl_size, lcl_result, lcl_result, lcl_i) {
        return Pacioli.glbl_base_catch_result(
            function () {
                return Pacioli.glbl_base_seq(
                           Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_empty_list(
                                           )), 
                           Pacioli.glbl_base_seq(
                               Pacioli.glbl_base_ref_set(lcl_i, Pacioli.initialNumbers(1, 1, [[0, 0, 0]])), 
                               Pacioli.glbl_base_seq(
                                   Pacioli.glbl_base_ref_set(lcl_size, Pacioli.glbl_base_list_size(
                                                 lcl_list)), 
                                   Pacioli.glbl_base_seq(
                                       Pacioli.glbl_base_while_function(
                                           function () {
                                               return Pacioli.glbl_base_not_equal(
                                                          Pacioli.glbl_base_ref_get(lcl_i), 
                                                          Pacioli.glbl_base_ref_get(lcl_size));} ,
                                           function () {
                                               return Pacioli.glbl_base_seq(
                                                          (Pacioli.glbl_base_not_equal(
                                                               Pacioli.glbl_base_ref_get(lcl_i), 
                                                               lcl_n) ? Pacioli.glbl_base_ref_set(lcl_result, Pacioli.glbl_base_add_mut(
                                                                                   Pacioli.glbl_base_ref_get(lcl_result), 
                                                                                   Pacioli.glbl_base_nth(
                                                                                       Pacioli.glbl_base_ref_get(lcl_i), 
                                                                                       lcl_list))) : Pacioli.glbl_base_skip(
                                                                                                 ) ), 
                                                          Pacioli.glbl_base_ref_set(lcl_i, Pacioli.glbl_base_sum(
                                                                     Pacioli.glbl_base_ref_get(lcl_i), 
                                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 1]]))));}), 
                                       Pacioli.glbl_base_throw_result(sym_147, Pacioli.glbl_base_ref_get(lcl_result)))))); } ,
                sym_147); }( 
            Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref(), Pacioli.glbl_base_empty_ref());
}

Pacioli.u_glbl_standard_list_some = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_some = function (lcl_x) {
    return (Pacioli.b_glbl_base_equal(
         lcl_x, 
         Pacioli.glbl_base_empty_list(
             )) ? false : Pacioli.glbl_base_fold_list(
                         function (lcl_a, lcl_b) { return (lcl_a ? true : lcl_b );}, 
                         lcl_x) );
}
Pacioli.glbl_standard_list_some = function (lcl_x) {
    return (Pacioli.glbl_base_equal(
         lcl_x, 
         Pacioli.glbl_base_empty_list(
             )) ? false : Pacioli.glbl_base_fold_list(
                         function (lcl_a, lcl_b) { return (lcl_a ? true : lcl_b );}, 
                         lcl_x) );
}

Pacioli.u_glbl_standard_list_min = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_min = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.bfetchValue('base', 'min'), 
        lcl_x);
}
Pacioli.glbl_standard_list_min = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.fetchValue('base', 'min'), 
        lcl_x);
}

Pacioli.u_glbl_standard_scanl = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_A_')]), Pacioli.typeFromVarName('_B_')), Pacioli.typeFromVarName('_B_'), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')])]), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_B_')]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_scanl = function (lcl_f,lcl_x,lcl_acc) {
    return (Pacioli.b_glbl_base_equal(
         lcl_acc, 
         Pacioli.glbl_base_empty_list(
             )) ? Pacioli.glbl_base_add_mut(
                      Pacioli.glbl_base_empty_list(
                          ), 
                      lcl_x) : Pacioli.glbl_base_cons(
                              lcl_x, 
                              Pacioli.b_glbl_standard_scanl(
                                  lcl_f, 
                                  (lcl_f)(
                                      lcl_x, 
                                      Pacioli.glbl_base_head(
                                          lcl_acc)), 
                                  Pacioli.glbl_base_tail(
                                      lcl_acc))) );
}
Pacioli.glbl_standard_scanl = function (lcl_f,lcl_x,lcl_acc) {
    return (Pacioli.glbl_base_equal(
         lcl_acc, 
         Pacioli.glbl_base_empty_list(
             )) ? Pacioli.glbl_base_add_mut(
                      Pacioli.glbl_base_empty_list(
                          ), 
                      lcl_x) : Pacioli.glbl_base_cons(
                              lcl_x, 
                              Pacioli.glbl_standard_scanl(
                                  lcl_f, 
                                  (lcl_f)(
                                      lcl_x, 
                                      Pacioli.glbl_base_head(
                                          lcl_acc)), 
                                  Pacioli.glbl_base_tail(
                                      lcl_acc))) );
}

Pacioli.u_glbl_standard_list_sum = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_sum = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.bfetchValue('base', 'sum'), 
        lcl_x);
}
Pacioli.glbl_standard_list_sum = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.fetchValue('base', 'sum'), 
        lcl_x);
}

Pacioli.u_glbl_base_thousands_separator = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('Boole', [])]), new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType('Boole', [])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_base_thousands_separator = function (lcl_boole) {
    return Pacioli.b_glbl_base_thousands_separator_io(
        lcl_boole, 
        Pacioli.bfetchValue('base', 'io_settings'));
}
Pacioli.glbl_base_thousands_separator = function (lcl_boole) {
    return Pacioli.glbl_base_thousands_separator_io(
        lcl_boole, 
        Pacioli.fetchValue('base', 'io_settings'));
}

Pacioli.u_glbl_standard_negatives = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_negatives = function (lcl_x) {
    return Pacioli.b_glbl_base_multiply(
        lcl_x, 
        Pacioli.b_glbl_base_negative_support(
            lcl_x));
}
Pacioli.glbl_standard_negatives = function (lcl_x) {
    return Pacioli.glbl_base_multiply(
        lcl_x, 
        Pacioli.glbl_base_negative_support(
            lcl_x));
}

Pacioli.u_glbl_standard_right_division = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(-1).mult(Pacioli.unitFromVarName('_a_').expt(1)), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_right_division = function (lcl_x,lcl_y) {
    return Pacioli.b_glbl_base_mmult(
        lcl_x, 
        Pacioli.b_glbl_standard_inverse(
            lcl_y));
}
Pacioli.glbl_standard_right_division = function (lcl_x,lcl_y) {
    return Pacioli.glbl_base_mmult(
        lcl_x, 
        Pacioli.glbl_standard_inverse(
            lcl_y));
}

Pacioli.u_glbl_standard_columns = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_D_', Pacioli.ONE)]), new Pacioli.GenericType('List', [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_columns = function (lcl_matrix) {
    return (function (lcl__c_accu40) { return Pacioli.glbl_base_loop_list(
                                           lcl__c_accu40, 
                                           function (lcl__c_accu40, lcl_j) { return Pacioli.glbl_base_add_mut(
                                                                                        lcl__c_accu40, 
                                                                                        Pacioli.b_glbl_base_column(
                                                                                            lcl_matrix, 
                                                                                            lcl_j));}, 
                                           Pacioli.b_glbl_base_column_domain(
                                               lcl_matrix));})(
        Pacioli.glbl_base_empty_list(
            ));
}
Pacioli.glbl_standard_columns = function (lcl_matrix) {
    return (function (lcl__c_accu40) { return Pacioli.glbl_base_loop_list(
                                           lcl__c_accu40, 
                                           function (lcl__c_accu40, lcl_j) { return Pacioli.glbl_base_add_mut(
                                                                                        lcl__c_accu40, 
                                                                                        Pacioli.glbl_base_column(
                                                                                            lcl_matrix, 
                                                                                            lcl_j));}, 
                                           Pacioli.glbl_base_column_domain(
                                               lcl_matrix));})(
        Pacioli.glbl_base_empty_list(
            ));
}

Pacioli.u_glbl_standard_unzip = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_')])])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')]), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_B_')])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_unzip = function (lcl_xs) {
    return Pacioli.glbl_base_tuple(
        (function (lcl__c_accu32) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu32, 
                                               function (lcl__c_accu32, lcl__c_tup33) { return Pacioli.glbl_base_apply(
                                                                                                   function (lcl_a, lcl__34) { return Pacioli.glbl_base_add_mut(
                                                                                                                                          lcl__c_accu32, 
                                                                                                                                          lcl_a);}, 
                                                                                                   lcl__c_tup33);}, 
                                               lcl_xs);})(
            Pacioli.glbl_base_empty_list(
                )), 
        (function (lcl__c_accu35) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu35, 
                                               function (lcl__c_accu35, lcl__c_tup36) { return Pacioli.glbl_base_apply(
                                                                                                   function (lcl__37, lcl_b) { return Pacioli.glbl_base_add_mut(
                                                                                                                                          lcl__c_accu35, 
                                                                                                                                          lcl_b);}, 
                                                                                                   lcl__c_tup36);}, 
                                               lcl_xs);})(
            Pacioli.glbl_base_empty_list(
                )));
}
Pacioli.glbl_standard_unzip = function (lcl_xs) {
    return Pacioli.glbl_base_tuple(
        (function (lcl__c_accu32) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu32, 
                                               function (lcl__c_accu32, lcl__c_tup33) { return Pacioli.glbl_base_apply(
                                                                                                   function (lcl_a, lcl__34) { return Pacioli.glbl_base_add_mut(
                                                                                                                                          lcl__c_accu32, 
                                                                                                                                          lcl_a);}, 
                                                                                                   lcl__c_tup33);}, 
                                               lcl_xs);})(
            Pacioli.glbl_base_empty_list(
                )), 
        (function (lcl__c_accu35) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu35, 
                                               function (lcl__c_accu35, lcl__c_tup36) { return Pacioli.glbl_base_apply(
                                                                                                   function (lcl__37, lcl_b) { return Pacioli.glbl_base_add_mut(
                                                                                                                                          lcl__c_accu35, 
                                                                                                                                          lcl_b);}, 
                                                                                                   lcl__c_tup36);}, 
                                               lcl_xs);})(
            Pacioli.glbl_base_empty_list(
                )));
}

Pacioli.u_glbl_standard_scanl1 = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_A_')]), Pacioli.typeFromVarName('_A_')), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')])]), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_scanl1 = function (lcl_f,lcl_acc) {
    return Pacioli.b_glbl_standard_scanl(
        lcl_f, 
        Pacioli.glbl_base_head(
            lcl_acc), 
        Pacioli.glbl_base_tail(
            lcl_acc));
}
Pacioli.glbl_standard_scanl1 = function (lcl_f,lcl_acc) {
    return Pacioli.glbl_standard_scanl(
        lcl_f, 
        Pacioli.glbl_base_head(
            lcl_acc), 
        Pacioli.glbl_base_tail(
            lcl_acc));
}

Pacioli.u_glbl_testing_run_test = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), Pacioli.typeFromVarName('_B_')), Pacioli.typeFromVarName('_C_')])]), Pacioli.typeFromVarName('_B_'));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_run_test = function (lcl_test) {
    return Pacioli.glbl_base_apply(
        function (lcl__122, lcl_body, lcl__123) { return (lcl_body)(
                                                             );}, 
        lcl_test);
}
Pacioli.glbl_testing_run_test = function (lcl_test) {
    return Pacioli.glbl_base_apply(
        function (lcl__122, lcl_body, lcl__123) { return (lcl_body)(
                                                             );}, 
        lcl_test);
}

Pacioli.u_glbl_standard_list_count = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType('Boole', [])])]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_count = function (lcl_xs) {
    return Pacioli.b_glbl_base_list_size(
        (function (lcl__c_accu55) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu55, 
                                               function (lcl__c_accu55, lcl_x) { return (lcl_x ? Pacioli.glbl_base_add_mut(
                                                                                                lcl__c_accu55, 
                                                                                                lcl_x) : lcl__c_accu55 );}, 
                                               lcl_xs);})(
            Pacioli.glbl_base_empty_list(
                )));
}
Pacioli.glbl_standard_list_count = function (lcl_xs) {
    return Pacioli.glbl_base_list_size(
        (function (lcl__c_accu55) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu55, 
                                               function (lcl__c_accu55, lcl_x) { return (lcl_x ? Pacioli.glbl_base_add_mut(
                                                                                                lcl__c_accu55, 
                                                                                                lcl_x) : lcl__c_accu55 );}, 
                                               lcl_xs);})(
            Pacioli.glbl_base_empty_list(
                )));
}

Pacioli.u_glbl_standard_zip_with = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_')]), Pacioli.typeFromVarName('_C_')), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_A_')]), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_B_')])]), new Pacioli.GenericType('List', [Pacioli.typeFromVarName('_C_')]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_zip_with = function (lcl_f,lcl_xs,lcl_ys) {
    return Pacioli.b_glbl_base_map_list(
        function (lcl_pair) { return Pacioli.glbl_base_apply(
                                         lcl_f, 
                                         lcl_pair);}, 
        Pacioli.glbl_base_zip(
            lcl_xs, 
            lcl_ys));
}
Pacioli.glbl_standard_zip_with = function (lcl_f,lcl_xs,lcl_ys) {
    return Pacioli.glbl_base_map_list(
        function (lcl_pair) { return Pacioli.glbl_base_apply(
                                         lcl_f, 
                                         lcl_pair);}, 
        Pacioli.glbl_base_zip(
            lcl_xs, 
            lcl_ys));
}

Pacioli.u_glbl_standard_fraction = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), '_D_', Pacioli.ONE, '_E_', Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_fraction = function (lcl_x,lcl_y) {
    return Pacioli.b_glbl_standard_to_percentage(
        Pacioli.b_glbl_base_divide(
            lcl_x, 
            lcl_y));
}
Pacioli.glbl_standard_fraction = function (lcl_x,lcl_y) {
    return Pacioli.glbl_standard_to_percentage(
        Pacioli.glbl_base_divide(
            lcl_x, 
            lcl_y));
}

Pacioli.u_glbl_testing_test_suite_only = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_')]), new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), new Pacioli.GenericType('Boole', [])]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_test_suite_only = function (lcl_description,lcl_tests) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_tests, 
        true);
}
Pacioli.glbl_testing_test_suite_only = function (lcl_description,lcl_tests) {
    return Pacioli.glbl_base_tuple(
        lcl_description, 
        lcl_tests, 
        true);
}

Pacioli.u_glbl_standard_kleene = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, '_B_', new Pacioli.PowerProduct('_B!a_').expt(1), '_B_', new Pacioli.PowerProduct('_B!a_').expt(1))]), Pacioli.createMatrixType(Pacioli.ONE, '_B_', new Pacioli.PowerProduct('_B!a_').expt(1), '_B_', new Pacioli.PowerProduct('_B!a_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_kleene = function (lcl_x) {
    return Pacioli.b_glbl_standard_inverse(
        Pacioli.b_glbl_base_minus(
            Pacioli.b_glbl_base_left_identity(
                lcl_x), 
            lcl_x));
}
Pacioli.glbl_standard_kleene = function (lcl_x) {
    return Pacioli.glbl_standard_inverse(
        Pacioli.glbl_base_minus(
            Pacioli.glbl_base_left_identity(
                lcl_x), 
            lcl_x));
}

Pacioli.u_glbl_standard_to_percentage = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit('percent').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_to_percentage = function (lcl_x) {
    return Pacioli.b_glbl_base_scale(
        Pacioli.bfetchValue('standard', 'percent_conv'), 
        lcl_x);
}
Pacioli.glbl_standard_to_percentage = function (lcl_x) {
    return Pacioli.glbl_base_scale(
        Pacioli.fetchValue('standard', 'percent_conv'), 
        lcl_x);
}

Pacioli.u_glbl_standard_neg = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_neg = function (lcl_x) {
    return Pacioli.b_glbl_base_negative(
        Pacioli.b_glbl_base_scale(
            Pacioli.num(1), 
            lcl_x));
}
Pacioli.glbl_standard_neg = function (lcl_x) {
    return Pacioli.glbl_base_negative(
        Pacioli.glbl_base_scale(
            Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
            lcl_x));
}

Pacioli.u_glbl_testing_test_is_only = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_C_')])]), Pacioli.typeFromVarName('_C_'));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_test_is_only = function (lcl_test) {
    return Pacioli.glbl_base_apply(
        function (lcl__120, lcl__121, lcl_is_only) { return lcl_is_only;}, 
        lcl_test);
}
Pacioli.glbl_testing_test_is_only = function (lcl_test) {
    return Pacioli.glbl_base_apply(
        function (lcl__120, lcl__121, lcl_is_only) { return lcl_is_only;}, 
        lcl_test);
}

Pacioli.u_glbl_standard_complement = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_complement = function (lcl_x) {
    return Pacioli.b_glbl_base_minus(
        Pacioli.b_glbl_standard_unit(
            lcl_x), 
        lcl_x);
}
Pacioli.glbl_standard_complement = function (lcl_x) {
    return Pacioli.glbl_base_minus(
        Pacioli.glbl_standard_unit(
            lcl_x), 
        lcl_x);
}

Pacioli.u_glbl_standard_closure = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, '_B_', new Pacioli.PowerProduct('_B!a_').expt(1), '_B_', new Pacioli.PowerProduct('_B!a_').expt(1))]), Pacioli.createMatrixType(Pacioli.ONE, '_B_', new Pacioli.PowerProduct('_B!a_').expt(1), '_B_', new Pacioli.PowerProduct('_B!a_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_closure = function (lcl_x) {
    return Pacioli.b_glbl_base_minus(
        Pacioli.b_glbl_standard_kleene(
            lcl_x), 
        Pacioli.b_glbl_base_left_identity(
            lcl_x));
}
Pacioli.glbl_standard_closure = function (lcl_x) {
    return Pacioli.glbl_base_minus(
        Pacioli.glbl_standard_kleene(
            lcl_x), 
        Pacioli.glbl_base_left_identity(
            lcl_x));
}

Pacioli.u_glbl_standard_basis = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), new Pacioli.GenericType('List', [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_basis = function (lcl_matrix) {
    return (function (lcl__c_accu42) { return Pacioli.glbl_base_loop_list(
                                           lcl__c_accu42, 
                                           function (lcl__c_accu42, lcl_x) { return Pacioli.glbl_base_add_mut(
                                                                                        lcl__c_accu42, 
                                                                                        Pacioli.b_glbl_standard_delta(
                                                                                            lcl_x));}, 
                                           Pacioli.b_glbl_base_row_domain(
                                               lcl_matrix));})(
        Pacioli.glbl_base_empty_list(
            ));
}
Pacioli.glbl_standard_basis = function (lcl_matrix) {
    return (function (lcl__c_accu42) { return Pacioli.glbl_base_loop_list(
                                           lcl__c_accu42, 
                                           function (lcl__c_accu42, lcl_x) { return Pacioli.glbl_base_add_mut(
                                                                                        lcl__c_accu42, 
                                                                                        Pacioli.glbl_standard_delta(
                                                                                            lcl_x));}, 
                                           Pacioli.glbl_base_row_domain(
                                               lcl_matrix));})(
        Pacioli.glbl_base_empty_list(
            ));
}

Pacioli.u_glbl_standard_inner = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(-1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_f_').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1)), '_E_', new Pacioli.PowerProduct('_E!c_').expt(-1), '_H_', new Pacioli.PowerProduct('_H!g_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_inner = function (lcl_x,lcl_y) {
    return Pacioli.b_glbl_base_mmult(
        Pacioli.b_glbl_base_transpose(
            lcl_x), 
        lcl_y);
}
Pacioli.glbl_standard_inner = function (lcl_x,lcl_y) {
    return Pacioli.glbl_base_mmult(
        Pacioli.glbl_base_transpose(
            lcl_x), 
        lcl_y);
}

Pacioli.u_glbl_base_int2str = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType('String', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_base_int2str = function (lcl_x) {
    return Pacioli.b_glbl_base_int2str_io(
        lcl_x, 
        Pacioli.bfetchValue('base', 'io_settings'));
}
Pacioli.glbl_base_int2str = function (lcl_x) {
    return Pacioli.glbl_base_int2str_io(
        lcl_x, 
        Pacioli.fetchValue('base', 'io_settings'));
}

Pacioli.u_glbl_standard_unit = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_unit = function (lcl_mat) {
    return Pacioli.b_glbl_base_scale(
        Pacioli.b_glbl_base_unit_factor(
            lcl_mat), 
        Pacioli.b_glbl_base_dim_div(
            Pacioli.b_glbl_base_row_unit(
                lcl_mat), 
            Pacioli.b_glbl_base_column_unit(
                lcl_mat)));
}
Pacioli.glbl_standard_unit = function (lcl_mat) {
    return Pacioli.glbl_base_scale(
        Pacioli.glbl_base_unit_factor(
            lcl_mat), 
        Pacioli.glbl_base_dim_div(
            Pacioli.glbl_base_row_unit(
                lcl_mat), 
            Pacioli.glbl_base_column_unit(
                lcl_mat)));
}

Pacioli.u_glbl_standard_from_percentage = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unit('percent').expt(-1).mult(Pacioli.unitFromVarName('_a_').expt(1)), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_from_percentage = function (lcl_x) {
    return Pacioli.b_glbl_base_scale_down(
        lcl_x, 
        Pacioli.bfetchValue('standard', 'percent_conv'));
}
Pacioli.glbl_standard_from_percentage = function (lcl_x) {
    return Pacioli.glbl_base_scale_down(
        lcl_x, 
        Pacioli.fetchValue('standard', 'percent_conv'));
}

Pacioli.u_glbl_standard_list_concat = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType('String', [])])]), new Pacioli.GenericType('String', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_concat = function (lcl_xs) {
    return (Pacioli.b_glbl_base_equal(
         lcl_xs, 
         Pacioli.glbl_base_empty_list(
             )) ? "\
" : Pacioli.glbl_base_fold_list(
                             Pacioli.bfetchValue('base', 'concatenate'), 
                             lcl_xs) );
}
Pacioli.glbl_standard_list_concat = function (lcl_xs) {
    return (Pacioli.glbl_base_equal(
         lcl_xs, 
         Pacioli.glbl_base_empty_list(
             )) ? "\
" : Pacioli.glbl_base_fold_list(
                             Pacioli.fetchValue('base', 'concatenate'), 
                             lcl_xs) );
}

Pacioli.u_glbl_standard_sqr = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(2), '_D_', new Pacioli.PowerProduct('_D!b_').expt(2), '_E_', new Pacioli.PowerProduct('_E!c_').expt(2)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_sqr = function (lcl_x) {
    return Pacioli.b_glbl_base_multiply(
        lcl_x, 
        lcl_x);
}
Pacioli.glbl_standard_sqr = function (lcl_x) {
    return Pacioli.glbl_base_multiply(
        lcl_x, 
        lcl_x);
}

Pacioli.u_glbl_standard_list_gcd = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [Pacioli.createMatrixType(Pacioli.ONE, '_A_', Pacioli.ONE, '_B_', Pacioli.ONE)])]), Pacioli.createMatrixType(Pacioli.ONE, '_A_', Pacioli.ONE, '_B_', Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_list_gcd = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.bfetchValue('base', 'gcd'), 
        lcl_x);
}
Pacioli.glbl_standard_list_gcd = function (lcl_x) {
    return Pacioli.glbl_base_fold_list(
        Pacioli.fetchValue('base', 'gcd'), 
        lcl_x);
}

Pacioli.u_glbl_standard_inverse = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(-1), '_E_', new Pacioli.PowerProduct('_E!c_').expt(1), '_D_', new Pacioli.PowerProduct('_D!b_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_inverse = function (lcl_x) {
    return Pacioli.b_glbl_standard_right_inverse(
        lcl_x);
}
Pacioli.glbl_standard_inverse = function (lcl_x) {
    return Pacioli.glbl_standard_right_inverse(
        lcl_x);
}

Pacioli.u_glbl_base_num2str = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType('String', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_base_num2str = function (lcl_x) {
    return Pacioli.b_glbl_base_num2str_io(
        lcl_x, 
        Pacioli.bfetchValue('base', 'io_settings'));
}
Pacioli.glbl_base_num2str = function (lcl_x) {
    return Pacioli.glbl_base_num2str_io(
        lcl_x, 
        Pacioli.fetchValue('base', 'io_settings'));
}

Pacioli.u_glbl_standard_rows = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', Pacioli.ONE, '_D_', new Pacioli.PowerProduct('_D!b_').expt(1))]), new Pacioli.GenericType('List', [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, '_D_', new Pacioli.PowerProduct('_D!b_').expt(1))]));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_rows = function (lcl_matrix) {
    return (function (lcl__c_accu38) { return Pacioli.glbl_base_loop_list(
                                           lcl__c_accu38, 
                                           function (lcl__c_accu38, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                        lcl__c_accu38, 
                                                                                        Pacioli.b_glbl_base_row(
                                                                                            lcl_matrix, 
                                                                                            lcl_i));}, 
                                           Pacioli.b_glbl_base_row_domain(
                                               lcl_matrix));})(
        Pacioli.glbl_base_empty_list(
            ));
}
Pacioli.glbl_standard_rows = function (lcl_matrix) {
    return (function (lcl__c_accu38) { return Pacioli.glbl_base_loop_list(
                                           lcl__c_accu38, 
                                           function (lcl__c_accu38, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                        lcl__c_accu38, 
                                                                                        Pacioli.glbl_base_row(
                                                                                            lcl_matrix, 
                                                                                            lcl_i));}, 
                                           Pacioli.glbl_base_row_domain(
                                               lcl_matrix));})(
        Pacioli.glbl_base_empty_list(
            ));
}

Pacioli.u_glbl_testing_run_test_suites = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', [])])])]), new Pacioli.GenericType('Void', []));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_run_test_suites = function (lcl_suites) {
    return Pacioli.b_glbl_testing_sym_340(
        lcl_suites);
}
Pacioli.glbl_testing_run_test_suites = function (lcl_suites) {
    return Pacioli.glbl_testing_sym_340(
        lcl_suites);
}

Pacioli.u_glbl_testing_suite_tests = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [Pacioli.typeFromVarName('_A_'), Pacioli.typeFromVarName('_B_'), Pacioli.typeFromVarName('_C_')])]), Pacioli.typeFromVarName('_B_'));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_testing_suite_tests = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl__126, lcl_tests, lcl__127) { return lcl_tests;}, 
        lcl_suite);
}
Pacioli.glbl_testing_suite_tests = function (lcl_suite) {
    return Pacioli.glbl_base_apply(
        function (lcl__126, lcl_tests, lcl__127) { return lcl_tests;}, 
        lcl_suite);
}

Pacioli.u_glbl_standard_diagonal3 = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, '_C_', Pacioli.ONE, '_C_', Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_diagonal3 = function (lcl_x) {
    return Pacioli.b_glbl_base_make_matrix(
        (function (lcl__c_accu50) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu50, 
                                               function (lcl__c_accu50, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                            lcl__c_accu50, 
                                                                                            Pacioli.glbl_base_tuple(
                                                                                                lcl_i, 
                                                                                                lcl_i, 
                                                                                                Pacioli.b_glbl_base_get_num(
                                                                                                    lcl_x, 
                                                                                                    lcl_i, 
                                                                                                    Pacioli.bfetchValue('base', '_'))));}, 
                                               Pacioli.b_glbl_base_row_domain(
                                                   lcl_x));})(
            Pacioli.glbl_base_empty_list(
                )));
}
Pacioli.glbl_standard_diagonal3 = function (lcl_x) {
    return Pacioli.glbl_base_make_matrix(
        (function (lcl__c_accu50) { return Pacioli.glbl_base_loop_list(
                                               lcl__c_accu50, 
                                               function (lcl__c_accu50, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                            lcl__c_accu50, 
                                                                                            Pacioli.glbl_base_tuple(
                                                                                                lcl_i, 
                                                                                                lcl_i, 
                                                                                                Pacioli.glbl_base_get_num(
                                                                                                    lcl_x, 
                                                                                                    lcl_i, 
                                                                                                    Pacioli.fetchValue('base', '_'))));}, 
                                               Pacioli.glbl_base_row_domain(
                                                   lcl_x));})(
            Pacioli.glbl_base_empty_list(
                )));
}

Pacioli.u_glbl_standard_diagonal2 = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_C_', Pacioli.ONE));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_diagonal2 = function (lcl_x) {
    return (function (lcl_u) { return (function (lcl_units) { return Pacioli.b_glbl_base_multiply(
                                                                  Pacioli.b_glbl_base_make_matrix(
                                                                      (function (lcl__c_accu48) { return Pacioli.glbl_base_loop_list(
                                                                                                             lcl__c_accu48, 
                                                                                                             function (lcl__c_accu48, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                          lcl__c_accu48, 
                                                                                                                                                          Pacioli.glbl_base_tuple(
                                                                                                                                                              lcl_i, 
                                                                                                                                                              lcl_i, 
                                                                                                                                                              Pacioli.b_glbl_base_get_num(
                                                                                                                                                                  lcl_x, 
                                                                                                                                                                  lcl_i, 
                                                                                                                                                                  Pacioli.bfetchValue('base', '_'))));}, 
                                                                                                             Pacioli.b_glbl_base_row_domain(
                                                                                                                 lcl_x));})(
                                                                          Pacioli.glbl_base_empty_list(
                                                                              ))), 
                                                                  lcl_units);})(
                                   Pacioli.b_glbl_base_dim_div(
                                       lcl_u, 
                                       Pacioli.b_glbl_base_magnitude(
                                           lcl_u)));})(
        Pacioli.b_glbl_standard_unit(
            lcl_x));
}
Pacioli.glbl_standard_diagonal2 = function (lcl_x) {
    return (function (lcl_u) { return (function (lcl_units) { return Pacioli.glbl_base_multiply(
                                                                  Pacioli.glbl_base_make_matrix(
                                                                      (function (lcl__c_accu48) { return Pacioli.glbl_base_loop_list(
                                                                                                             lcl__c_accu48, 
                                                                                                             function (lcl__c_accu48, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                          lcl__c_accu48, 
                                                                                                                                                          Pacioli.glbl_base_tuple(
                                                                                                                                                              lcl_i, 
                                                                                                                                                              lcl_i, 
                                                                                                                                                              Pacioli.glbl_base_get_num(
                                                                                                                                                                  lcl_x, 
                                                                                                                                                                  lcl_i, 
                                                                                                                                                                  Pacioli.fetchValue('base', '_'))));}, 
                                                                                                             Pacioli.glbl_base_row_domain(
                                                                                                                 lcl_x));})(
                                                                          Pacioli.glbl_base_empty_list(
                                                                              ))), 
                                                                  lcl_units);})(
                                   Pacioli.glbl_base_dim_div(
                                       lcl_u, 
                                       Pacioli.glbl_base_magnitude(
                                           lcl_u)));})(
        Pacioli.glbl_standard_unit(
            lcl_x));
}

Pacioli.u_glbl_standard_diagonal = function () {
    var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));var type = new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1), '_C_', new Pacioli.PowerProduct('_C!b_').expt(1)));return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));
}
Pacioli.b_glbl_standard_diagonal = function (lcl_x) {
    return (function (lcl_u) { return (function (lcl_units) { return Pacioli.b_glbl_base_multiply(
                                                                  Pacioli.b_glbl_base_make_matrix(
                                                                      (function (lcl__c_accu46) { return Pacioli.glbl_base_loop_list(
                                                                                                             lcl__c_accu46, 
                                                                                                             function (lcl__c_accu46, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                          lcl__c_accu46, 
                                                                                                                                                          Pacioli.glbl_base_tuple(
                                                                                                                                                              lcl_i, 
                                                                                                                                                              lcl_i, 
                                                                                                                                                              Pacioli.b_glbl_base_get_num(
                                                                                                                                                                  lcl_x, 
                                                                                                                                                                  lcl_i, 
                                                                                                                                                                  Pacioli.bfetchValue('base', '_'))));}, 
                                                                                                             Pacioli.b_glbl_base_row_domain(
                                                                                                                 lcl_x));})(
                                                                          Pacioli.glbl_base_empty_list(
                                                                              ))), 
                                                                  lcl_units);})(
                                   Pacioli.b_glbl_base_scale(
                                       Pacioli.b_glbl_base_unit_factor(
                                           lcl_x), 
                                       Pacioli.b_glbl_base_dim_div(
                                           lcl_u, 
                                           lcl_u)));})(
        Pacioli.b_glbl_base_row_unit(
            lcl_x));
}
Pacioli.glbl_standard_diagonal = function (lcl_x) {
    return (function (lcl_u) { return (function (lcl_units) { return Pacioli.glbl_base_multiply(
                                                                  Pacioli.glbl_base_make_matrix(
                                                                      (function (lcl__c_accu46) { return Pacioli.glbl_base_loop_list(
                                                                                                             lcl__c_accu46, 
                                                                                                             function (lcl__c_accu46, lcl_i) { return Pacioli.glbl_base_add_mut(
                                                                                                                                                          lcl__c_accu46, 
                                                                                                                                                          Pacioli.glbl_base_tuple(
                                                                                                                                                              lcl_i, 
                                                                                                                                                              lcl_i, 
                                                                                                                                                              Pacioli.glbl_base_get_num(
                                                                                                                                                                  lcl_x, 
                                                                                                                                                                  lcl_i, 
                                                                                                                                                                  Pacioli.fetchValue('base', '_'))));}, 
                                                                                                             Pacioli.glbl_base_row_domain(
                                                                                                                 lcl_x));})(
                                                                          Pacioli.glbl_base_empty_list(
                                                                              ))), 
                                                                  lcl_units);})(
                                   Pacioli.glbl_base_scale(
                                       Pacioli.glbl_base_unit_factor(
                                           lcl_x), 
                                       Pacioli.glbl_base_dim_div(
                                           lcl_u, 
                                           lcl_u)));})(
        Pacioli.glbl_base_row_unit(
            lcl_x));
}

Pacioli.compute_u_glbl_standard_tests_zip_with_suite = function () {
    return new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', [])]);
}
Pacioli.compute_glbl_standard_tests_zip_with_suite = function () {
  return Pacioli.glbl_testing_test_suite(
    "Function zip_with\
", 
    Pacioli.glbl_base_add_mut(
        Pacioli.glbl_base_empty_list(
            ), 
        Pacioli.glbl_testing_test(
            "should sum correctly\
", 
            function () { return Pacioli.glbl_base_equal(
                                     Pacioli.glbl_standard_zip_with(
                                         Pacioli.fetchValue('base', 'sum'), 
                                         Pacioli.glbl_base_add_mut(
                                             Pacioli.glbl_base_add_mut(
                                                 Pacioli.glbl_base_add_mut(
                                                     Pacioli.glbl_base_empty_list(
                                                         ), 
                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
                                                 Pacioli.initialNumbers(1, 1, [[0, 0, 2]])), 
                                             Pacioli.initialNumbers(1, 1, [[0, 0, 3]])), 
                                         Pacioli.glbl_base_add_mut(
                                             Pacioli.glbl_base_add_mut(
                                                 Pacioli.glbl_base_add_mut(
                                                     Pacioli.glbl_base_empty_list(
                                                         ), 
                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 4]])), 
                                                 Pacioli.initialNumbers(1, 1, [[0, 0, 5]])), 
                                             Pacioli.initialNumbers(1, 1, [[0, 0, 6]]))), 
                                     Pacioli.glbl_base_add_mut(
                                         Pacioli.glbl_base_add_mut(
                                             Pacioli.glbl_base_add_mut(
                                                 Pacioli.glbl_base_empty_list(
                                                     ), 
                                                 Pacioli.initialNumbers(1, 1, [[0, 0, 5]])), 
                                             Pacioli.initialNumbers(1, 1, [[0, 0, 7]])), 
                                         Pacioli.initialNumbers(1, 1, [[0, 0, 9]])));})));
}
Pacioli.compute_b_glbl_standard_tests_zip_with_suite = function () {
  return Pacioli.b_glbl_testing_test_suite(
                                                    "Function zip_with\
", 
                                                    Pacioli.glbl_base_add_mut(
                                                        Pacioli.glbl_base_empty_list(
                                                            ), 
                                                        Pacioli.b_glbl_testing_test(
                                                            "should sum correctly\
", 
                                                            function () { return Pacioli.b_glbl_base_equal(
                                                                                     Pacioli.b_glbl_standard_zip_with(
                                                                                         Pacioli.bfetchValue('base', 'sum'), 
                                                                                         Pacioli.glbl_base_add_mut(
                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                     Pacioli.glbl_base_empty_list(
                                                                                                         ), 
                                                                                                     Pacioli.num(1)), 
                                                                                                 Pacioli.num(2)), 
                                                                                             Pacioli.num(3)), 
                                                                                         Pacioli.glbl_base_add_mut(
                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                     Pacioli.glbl_base_empty_list(
                                                                                                         ), 
                                                                                                     Pacioli.num(4)), 
                                                                                                 Pacioli.num(5)), 
                                                                                             Pacioli.num(6))), 
                                                                                     Pacioli.glbl_base_add_mut(
                                                                                         Pacioli.glbl_base_add_mut(
                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                 Pacioli.glbl_base_empty_list(
                                                                                                     ), 
                                                                                                 Pacioli.num(5)), 
                                                                                             Pacioli.num(7)), 
                                                                                         Pacioli.num(9)));})));
}

Pacioli.compute_u_glbl_standard_tests_scanl1_suite = function () {
    return new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', [])]);
}
Pacioli.compute_glbl_standard_tests_scanl1_suite = function () {
  return Pacioli.glbl_testing_test_suite(
                                                                                                    "Function scanl1\
", 
                                                                                                    Pacioli.glbl_base_add_mut(
                                                                                                        Pacioli.glbl_base_empty_list(
                                                                                                            ), 
                                                                                                        Pacioli.glbl_testing_test(
                                                                                                            "should sum correctly\
", 
                                                                                                            function () { return Pacioli.glbl_base_equal(
                                                                                                                                     Pacioli.glbl_standard_scanl1(
                                                                                                                                         Pacioli.fetchValue('base', 'sum'), 
                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                             ), 
                                                                                                                                                         Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
                                                                                                                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 2]])), 
                                                                                                                                                 Pacioli.initialNumbers(1, 1, [[0, 0, 3]])), 
                                                                                                                                             Pacioli.initialNumbers(1, 1, [[0, 0, 5]]))), 
                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                     Pacioli.glbl_base_empty_list(
                                                                                                                                                         ), 
                                                                                                                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
                                                                                                                                                 Pacioli.initialNumbers(1, 1, [[0, 0, 3]])), 
                                                                                                                                             Pacioli.initialNumbers(1, 1, [[0, 0, 6]])), 
                                                                                                                                         Pacioli.initialNumbers(1, 1, [[0, 0, 11]])));})));
}
Pacioli.compute_b_glbl_standard_tests_scanl1_suite = function () {
  return Pacioli.b_glbl_testing_test_suite(
                                                                                                                                                    "Function scanl1\
", 
                                                                                                                                                    Pacioli.glbl_base_add_mut(
                                                                                                                                                        Pacioli.glbl_base_empty_list(
                                                                                                                                                            ), 
                                                                                                                                                        Pacioli.b_glbl_testing_test(
                                                                                                                                                            "should sum correctly\
", 
                                                                                                                                                            function () { return Pacioli.b_glbl_base_equal(
                                                                                                                                                                                     Pacioli.b_glbl_standard_scanl1(
                                                                                                                                                                                         Pacioli.bfetchValue('base', 'sum'), 
                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                             ), 
                                                                                                                                                                                                         Pacioli.num(1)), 
                                                                                                                                                                                                     Pacioli.num(2)), 
                                                                                                                                                                                                 Pacioli.num(3)), 
                                                                                                                                                                                             Pacioli.num(5))), 
                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                     Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                         ), 
                                                                                                                                                                                                     Pacioli.num(1)), 
                                                                                                                                                                                                 Pacioli.num(3)), 
                                                                                                                                                                                             Pacioli.num(6)), 
                                                                                                                                                                                         Pacioli.num(11)));})));
}

Pacioli.compute_u_glbl_standard_tests_scanl_suite = function () {
    return new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', [])]);
}
Pacioli.compute_glbl_standard_tests_scanl_suite = function () {
  return Pacioli.glbl_testing_test_suite(
                                                                                                                                                                                                    "Function scanl\
", 
                                                                                                                                                                                                    Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                        Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                            Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                ), 
                                                                                                                                                                                                            Pacioli.glbl_testing_test(
                                                                                                                                                                                                                "should handle empty list correctly\
", 
                                                                                                                                                                                                                function () { return Pacioli.glbl_base_equal(
                                                                                                                                                                                                                                         Pacioli.glbl_standard_scanl(
                                                                                                                                                                                                                                             Pacioli.fetchValue('base', 'sum'), 
                                                                                                                                                                                                                                             Pacioli.initialNumbers(1, 1, [[0, 0, 42]]), 
                                                                                                                                                                                                                                             Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                 )), 
                                                                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                             Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                 ), 
                                                                                                                                                                                                                                             Pacioli.initialNumbers(1, 1, [[0, 0, 42]])));})), 
                                                                                                                                                                                                        Pacioli.glbl_testing_test(
                                                                                                                                                                                                            "should subtract correctly\
", 
                                                                                                                                                                                                            function () { return Pacioli.glbl_base_equal(
                                                                                                                                                                                                                                     Pacioli.glbl_standard_scanl(
                                                                                                                                                                                                                                         Pacioli.fetchValue('base', 'minus'), 
                                                                                                                                                                                                                                         Pacioli.initialNumbers(1, 1, [[0, 0, 100]]), 
                                                                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                             ), 
                                                                                                                                                                                                                                                         Pacioli.initialNumbers(1, 1, [[0, 0, 1]])), 
                                                                                                                                                                                                                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 2]])), 
                                                                                                                                                                                                                                                 Pacioli.initialNumbers(1, 1, [[0, 0, 3]])), 
                                                                                                                                                                                                                                             Pacioli.initialNumbers(1, 1, [[0, 0, 4]]))), 
                                                                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                             ), 
                                                                                                                                                                                                                                                         Pacioli.initialNumbers(1, 1, [[0, 0, 100]])), 
                                                                                                                                                                                                                                                     Pacioli.initialNumbers(1, 1, [[0, 0, 99]])), 
                                                                                                                                                                                                                                                 Pacioli.initialNumbers(1, 1, [[0, 0, 97]])), 
                                                                                                                                                                                                                                             Pacioli.initialNumbers(1, 1, [[0, 0, 94]])), 
                                                                                                                                                                                                                                         Pacioli.initialNumbers(1, 1, [[0, 0, 90]])));})));
}
Pacioli.compute_b_glbl_standard_tests_scanl_suite = function () {
  return Pacioli.b_glbl_testing_test_suite(
                                                                                                                                                                                                                                                    "Function scanl\
", 
                                                                                                                                                                                                                                                    Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                        Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                            Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                ), 
                                                                                                                                                                                                                                                            Pacioli.b_glbl_testing_test(
                                                                                                                                                                                                                                                                "should handle empty list correctly\
", 
                                                                                                                                                                                                                                                                function () { return Pacioli.b_glbl_base_equal(
                                                                                                                                                                                                                                                                                         Pacioli.b_glbl_standard_scanl(
                                                                                                                                                                                                                                                                                             Pacioli.bfetchValue('base', 'sum'), 
                                                                                                                                                                                                                                                                                             Pacioli.num(42), 
                                                                                                                                                                                                                                                                                             Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                 )), 
                                                                                                                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                             Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                 ), 
                                                                                                                                                                                                                                                                                             Pacioli.num(42)));})), 
                                                                                                                                                                                                                                                        Pacioli.b_glbl_testing_test(
                                                                                                                                                                                                                                                            "should subtract correctly\
", 
                                                                                                                                                                                                                                                            function () { return Pacioli.b_glbl_base_equal(
                                                                                                                                                                                                                                                                                     Pacioli.b_glbl_standard_scanl(
                                                                                                                                                                                                                                                                                         Pacioli.bfetchValue('base', 'minus'), 
                                                                                                                                                                                                                                                                                         Pacioli.num(100), 
                                                                                                                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                             ), 
                                                                                                                                                                                                                                                                                                         Pacioli.num(1)), 
                                                                                                                                                                                                                                                                                                     Pacioli.num(2)), 
                                                                                                                                                                                                                                                                                                 Pacioli.num(3)), 
                                                                                                                                                                                                                                                                                             Pacioli.num(4))), 
                                                                                                                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                 Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                     Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                         Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                             ), 
                                                                                                                                                                                                                                                                                                         Pacioli.num(100)), 
                                                                                                                                                                                                                                                                                                     Pacioli.num(99)), 
                                                                                                                                                                                                                                                                                                 Pacioli.num(97)), 
                                                                                                                                                                                                                                                                                             Pacioli.num(94)), 
                                                                                                                                                                                                                                                                                         Pacioli.num(90)));})));
}

Pacioli.compute_u_glbl_standard_tests_all_suites = function () {
    return new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.GenericType('List', [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType('String', []), new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", []), new Pacioli.GenericType('Boole', [])), new Pacioli.GenericType('Boole', [])])]), new Pacioli.GenericType('Boole', [])])]);
}
Pacioli.compute_glbl_standard_tests_all_suites = function () {
  return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                    Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                        Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                            Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                                ), 
                                                                                                                                                                                                                                                                                                            Pacioli.fetchValue('standard_tests', 'scanl_suite')), 
                                                                                                                                                                                                                                                                                                        Pacioli.fetchValue('standard_tests', 'scanl1_suite')), 
                                                                                                                                                                                                                                                                                                    Pacioli.fetchValue('standard_tests', 'zip_with_suite'));
}
Pacioli.compute_b_glbl_standard_tests_all_suites = function () {
  return Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                         Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                             Pacioli.glbl_base_add_mut(
                                                                                                                                                                                                                                                                                                                 Pacioli.glbl_base_empty_list(
                                                                                                                                                                                                                                                                                                                     ), 
                                                                                                                                                                                                                                                                                                                 Pacioli.bfetchValue('standard_tests', 'scanl_suite')), 
                                                                                                                                                                                                                                                                                                             Pacioli.bfetchValue('standard_tests', 'scanl1_suite')), 
                                                                                                                                                                                                                                                                                                         Pacioli.bfetchValue('standard_tests', 'zip_with_suite'));
}

Pacioli.compute_u_glbl_base_io_settings = function () {
    return new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType('Boole', [])]);
}
Pacioli.compute_glbl_base_io_settings = function () {
  return Pacioli.glbl_base_tuple(
                                                                                                                                                                                                                                                                                                              Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
                                                                                                                                                                                                                                                                                                              true);
}
Pacioli.compute_b_glbl_base_io_settings = function () {
  return Pacioli.glbl_base_tuple(
                                                                                                                                                                                                                                                                                                                   Pacioli.num(2), 
                                                                                                                                                                                                                                                                                                                   true);
}

Pacioli.compute_u_glbl_standard_percent_conv = function () {
    return Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_glbl_standard_percent_conv = function () {
  return Pacioli.initialNumbers(1, 1, [[0,0,100.0000000000000000000000000]]);
}
Pacioli.compute_b_glbl_standard_percent_conv = function () {
  return Pacioli.initialMatrix(Pacioli.createMatrixType(Pacioli.unit('percent').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE),[0,0,100.0000000000000000000000000]);
}

Pacioli.compute_u_glbl_standard_pi = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_glbl_standard_pi = function () {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 3.141592653589793]]);
}
Pacioli.compute_b_glbl_standard_pi = function () {
  return Pacioli.num(3.141592653589793);
}
