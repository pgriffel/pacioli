

Pacioli.compute_u_$standard_standard__list_sum = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1))])]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', Pacioli.unitFromVarName('_P!u_').expt(1), '_Q_', Pacioli.unitFromVarName('_Q!v_').expt(1)));
}

Pacioli.$standard_standard__list_sum = function (lcl_x) {
return Pacioli.$base_list_fold_list(
Pacioli.fetchValue('$base_matrix', 'sum'), 
lcl_x);
}


Pacioli.compute_u_charts_random_avg = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.charts_random_avg = function (lcl_k) {
return Pacioli.$base_matrix_divide(
Pacioli.$standard_standard__list_sum(
(function (lcl__c_accu36) { return Pacioli.$base_list_loop_list(
lcl__c_accu36, 
function (lcl__c_accu36, lcl__38) { return Pacioli.$base_system__add_mut(
lcl__c_accu36, 
Pacioli.$base_matrix_random(
));}, 
Pacioli.$base_list_naturals(
lcl_k));})(
Pacioli.$base_list_empty_list(
))), 
lcl_k);
}


Pacioli.compute_u_charts_sine_wave = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('second').expt(-1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.charts_sine_wave = function (lcl_amplitude, lcl_frequency, lcl_start_time, lcl_end_time, lcl_nr_samples) {
return (function (lcl_w) { return (function (lcl_dt) { return (function (lcl__c_accu34) { return Pacioli.$base_list_loop_list(
lcl__c_accu34, 
function (lcl__c_accu34, lcl_i) { return (function (lcl_t) { return Pacioli.$base_system__add_mut(
lcl__c_accu34, 
Pacioli.$base_base_tuple(
lcl_t, 
Pacioli.$base_matrix_multiply(
lcl_amplitude, 
Pacioli.$base_matrix_sin(
Pacioli.$base_matrix_multiply(
lcl_w, 
lcl_t)))));})(
Pacioli.$base_matrix_sum(
lcl_start_time, 
Pacioli.$base_matrix_multiply(
lcl_i, 
lcl_dt)));}, 
Pacioli.$base_list_naturals(
lcl_nr_samples));})(
Pacioli.$base_list_empty_list(
));})(
Pacioli.$base_matrix_divide(
Pacioli.$base_matrix_minus(
lcl_end_time, 
lcl_start_time), 
lcl_nr_samples));})(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_frequency, 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))));
}


Pacioli.compute_u_charts_random_avg_pairs = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]));
}

Pacioli.charts_random_avg_pairs = function (lcl_k, lcl_n) {
return (function (lcl__c_accu39) { return Pacioli.$base_list_loop_list(
lcl__c_accu39, 
function (lcl__c_accu39, lcl__41) { return Pacioli.$base_system__add_mut(
lcl__c_accu39, 
Pacioli.$base_base_tuple(
Pacioli.charts_random_avg(
lcl_k), 
Pacioli.charts_random_avg(
lcl_k)));}, 
Pacioli.$base_list_naturals(
lcl_n));})(
Pacioli.$base_list_empty_list(
));
}
Pacioli.compute_sbase_mole = function () { return {symbol: "mol"}};
Pacioli.compute_sbase_gram = function () { return {symbol: "g"}};
Pacioli.compute_sbase_ampere = function () { return {symbol: "A"}};
Pacioli.compute_sbase_metre = function () { return {symbol: "m"}};

Pacioli.compute_index_charts_Continent = function () {return Pacioli.makeIndexSet('index_charts_Continent', 'Continent', [ "Asia","Africa","Americas","Europe","Oceania" ])}
Pacioli.compute_sbase_percent = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.01, Pacioli.ONE), symbol: "%"}
}
Pacioli.compute_sbase_candela = function () { return {symbol: "cd"}};

Pacioli.compute_index_$base_matrix_One = function () {return Pacioli.makeIndexSet('index_$base_matrix_One', 'One', [ "_" ])}
Pacioli.compute_sbase_second = function () { return {symbol: "s"}};
Pacioli.compute_sbase_person = function () { return {symbol: "prsn"}};
Pacioli.compute_sbase_hertz = function () { return {symbol: "Hz"}};
Pacioli.compute_sbase_kelvin = function () { return {symbol: "K"}};
Pacioli.compute_sbase_decimals = function () { return {symbol: "decs"}};
Pacioli.compute_sbase_radian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: "rad"}
}

Pacioli.compute_u_charts_example_wave = function () {
    return new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)])]);
}
Pacioli.compute_charts_example_wave = function () {
  return Pacioli.charts_sine_wave(
Pacioli.initialNumbers(1, 1, [[0, 0, 0.2]]), 
Pacioli.$base_matrix_divide(
Pacioli.initialNumbers(1, 1, [[0, 0, 1]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 0]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.$base_matrix_multiply(
Pacioli.initialNumbers(1, 1, [[0, 0, 8]]), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE))), 
Pacioli.initialNumbers(1, 1, [[0, 0, 100]]));
}

Pacioli.compute_u_charts_population = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('person').expt(1), new Pacioli.IndexType(['charts_Continent']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_charts_population = function () {
  return Pacioli.initialNumbers(5, 1, [[0,0,4298723000],[1,0,1110635000],[2,0,972005000],[3,0,742452000],[4,0,38304000]]);
}

Pacioli.compute_u_charts_random_squares = function () {
    return new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_charts_random_squares = function () {
  return (function (lcl__c_accu32) { return Pacioli.$base_list_loop_list(
lcl__c_accu32, 
function (lcl__c_accu32, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu32, 
Pacioli.$base_matrix_expt(
Pacioli.$base_matrix_random(
), 
Pacioli.initialNumbers(1, 1, [[0, 0, 2]])));}, 
Pacioli.$base_list_naturals(
Pacioli.initialNumbers(1, 1, [[0, 0, 1000]])));})(
Pacioli.$base_list_empty_list(
));
}

Pacioli.compute_u_charts_pie_chart_options = function () {
    return new Pacioli.GenericType("List", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), new Pacioli.GenericType("String", [])])]);
}
Pacioli.compute_charts_pie_chart_options = function () {
  return [Pacioli.$base_base_tuple(
"caption", 
"My Pie Chart"), 
Pacioli.$base_base_tuple(
"label", 
"Continent")];
}

Pacioli.compute_u_$standard_standard_pi = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_$standard_standard_pi = function () {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 3.141592653589793]]);
}
