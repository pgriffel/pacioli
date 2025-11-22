

Pacioli.compute_u_charts_sine_wave = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('second').expt(-1).mult(Pacioli.unitType('radian').expt(1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('second').expt(-1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), Pacioli.createMatrixType(Pacioli.unitType('second').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]));
}

Pacioli.charts_sine_wave = function (lcl_amplitude, lcl_frequency, lcl_phase, lcl_sampling_rate, lcl_nr_seconds) {
return (function (lcl_nr_samples) { return (function (lcl_angle) { return (function (lcl__c_accu34) { return Pacioli.$base_list_loop_list(
lcl__c_accu34, 
function (lcl__c_accu34, lcl_i) { return Pacioli.$base_system__add_mut(
lcl__c_accu34, 
Pacioli.$base_matrix_multiply(
lcl_amplitude, 
Pacioli.$base_matrix_sin(
Pacioli.$base_matrix_sum(
Pacioli.$base_matrix_multiply(
lcl_i, 
lcl_angle), 
lcl_phase))));}, 
Pacioli.$base_list_naturals(
lcl_nr_samples));})(
Pacioli.$base_list_empty_list(
));})(
Pacioli.$base_matrix_divide(
lcl_frequency, 
lcl_sampling_rate));})(
Pacioli.$base_matrix_multiply(
lcl_nr_seconds, 
lcl_sampling_rate));
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
Pacioli.compute_sbase_sample = function () { return {symbol: "smpl"}};

Pacioli.compute_u_$standard_standard_pi = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_$standard_standard_pi = function () {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 3.141592653589793]]);
}

Pacioli.compute_u_charts_example_wave = function () {
    return new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_charts_example_wave = function () {
  return (function (lcl_n) { return (function (lcl__c_accu30) { return Pacioli.$base_list_loop_list(
lcl__c_accu30, 
function (lcl__c_accu30, lcl_i) { return Pacioli.$base_system__add_mut(
lcl__c_accu30, 
Pacioli.$base_matrix_sin(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_divide(
lcl_i, 
lcl_n), 
Pacioli.initialNumbers(1, 1, [[0, 0, 6]])), 
Pacioli.fetchValue('$standard_standard', 'pi')), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.unitType('radian').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)))));}, 
Pacioli.$base_list_naturals(
lcl_n));})(
Pacioli.$base_list_empty_list(
));})(
Pacioli.initialNumbers(1, 1, [[0, 0, 1000]]));
}

Pacioli.compute_u_charts_random_numbers = function () {
    return new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_charts_random_numbers = function () {
  return (function (lcl__c_accu32) { return Pacioli.$base_list_loop_list(
lcl__c_accu32, 
function (lcl__c_accu32, lcl_x) { return Pacioli.$base_system__add_mut(
lcl__c_accu32, 
Pacioli.$base_matrix_expt(
Pacioli.$base_matrix_random(
), 
Pacioli.initialNumbers(1, 1, [[0, 0, 3]])));}, 
Pacioli.$base_list_naturals(
Pacioli.initialNumbers(1, 1, [[0, 0, 1000]])));})(
Pacioli.$base_list_empty_list(
));
}

Pacioli.compute_u_charts_population = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('person').expt(1), new Pacioli.IndexType(['charts_Continent']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_charts_population = function () {
  return Pacioli.initialNumbers(5, 1, [[0,0,4298723000],[1,0,1110635000],[2,0,972005000],[3,0,742452000],[4,0,38304000]]);
}
