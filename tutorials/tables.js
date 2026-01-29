

Pacioli.compute_u_tables_relative_day_columns = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('day').expt(-1).mult(Pacioli.unitType('hour').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1))), new Pacioli.IndexType(['tables_Planet']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), new Pacioli.IndexType(['tables_Planet']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.createMatrixType(Pacioli.unitType('day').expt(-1).mult(Pacioli.unitType('sidereal_day').expt(1).mult(Pacioli.unitFromVarName('_a_').expt(1))), new Pacioli.IndexType(['tables_Planet']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])])]));
}

Pacioli.tables_relative_day_columns = function (lcl_earth_days) {
return (function (lcl_hours) { return (function (lcl_solar_days) { return (function (lcl_sidereal_days) { return Pacioli.$base_base_tuple(
Pacioli.$standard_column_default_column(
"Hours", 
lcl_hours), 
Pacioli.$standard_column_default_column(
"Solar Days", 
lcl_solar_days), 
Pacioli.$standard_column_default_column(
"Sidereal Days", 
lcl_sidereal_days));})(
Pacioli.$base_matrix_scale(
Pacioli.fetchValue('tables', 'sidereal_day_per_day'), 
lcl_solar_days));})(
Pacioli.$base_matrix_scale_down(
lcl_hours, 
Pacioli.fetchValue('tables', 'hour_per_day')));})(
Pacioli.$base_matrix_scale(
lcl_earth_days, 
Pacioli.fetchValue('tables', 'day_length')));
}


Pacioli.compute_u_tables_total_hours = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('day').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitType('hour').expt(1), new Pacioli.IndexType(['tables_Planet']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE));
}

Pacioli.tables_total_hours = function (lcl_days) {
return Pacioli.$base_matrix_scale(
lcl_days, 
Pacioli.fetchValue('tables', 'day_length'));
}


Pacioli.compute_u_$standard_column_make_column = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.typeFromVarName('_t_'), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.typeFromVarName('_t_'), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])]));
}

Pacioli.$standard_column_make_column = function (lcl_header, lcl_value, lcl_decimals, lcl_show_total) {
return Pacioli.$base_base_tuple(
lcl_header, 
lcl_value, 
lcl_decimals, 
lcl_show_total);
}


Pacioli.compute_u_$standard_column_default_column = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.typeFromVarName('_t_')]), new Pacioli.GenericType("Tuple", [new Pacioli.GenericType("String", []), Pacioli.typeFromVarName('_t_'), new Pacioli.GenericType("Maybe", [Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Boole", [])]));
}

Pacioli.$standard_column_default_column = function (lcl_header, lcl_value) {
return Pacioli.$standard_column_make_column(
lcl_header, 
lcl_value, 
Pacioli.$base_base_nothing(
), 
true);
}
Pacioli.compute_sbase_mole = function () { return {symbol: "mol"}};
Pacioli.compute_sbase_ampere = function () { return {symbol: "A"}};
Pacioli.compute_sbase_second = function () { return {symbol: "s"}};
Pacioli.compute_sbase_minute = function () {
    return {definition: Pacioli.DimNum.fromNumber(60, Pacioli.unit('second').expt(1)), symbol: "min"}
}
Pacioli.compute_sbase_hour = function () {
    return {definition: Pacioli.DimNum.fromNumber(60, Pacioli.unit('minute').expt(1)), symbol: "hr"}
}
Pacioli.compute_sbase_day = function () {
    return {definition: Pacioli.DimNum.fromNumber(24, Pacioli.unit('hour').expt(1)), symbol: "d"}
}
Pacioli.compute_sbase_pi = function () {
    return {definition: Pacioli.DimNum.fromNumber(3.141592653589793, Pacioli.ONE), symbol: "pi"}
}
Pacioli.compute_sbase_becquerel = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('second').expt(-1)), symbol: "Bq"}
}
Pacioli.compute_sbase_coulomb = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.unit('second').expt(1).mult(Pacioli.unit('ampere').expt(1))), symbol: "C"}
}
Pacioli.compute_sbase_metre = function () { return {symbol: "m"}};
Pacioli.compute_sbase_gram = function () { return {symbol: "g"}};
Pacioli.compute_sbase_newton = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('second').expt(-2).mult(Pacioli.unit('kilo:gram').expt(1).mult(Pacioli.unit('metre').expt(1)))), symbol: "N"}
}
Pacioli.compute_sbase_joule = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.unit('newton').expt(1).mult(Pacioli.unit('metre').expt(1))), symbol: "J"}
}
Pacioli.compute_sbase_watt = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('second').expt(-1).mult(Pacioli.unit('joule').expt(1))), symbol: "W"}
}
Pacioli.compute_sbase_volt = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('ampere').expt(-1).mult(Pacioli.unit('watt').expt(1))), symbol: "V"}
}
Pacioli.compute_sbase_farad = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('coulomb').expt(1).mult(Pacioli.unit('volt').expt(-1))), symbol: "F"}
}
Pacioli.compute_sbase_weber = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.unit('second').expt(1).mult(Pacioli.unit('volt').expt(1))), symbol: "Wb"}
}
Pacioli.compute_sbase_henry = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('ampere').expt(-1).mult(Pacioli.unit('weber').expt(1))), symbol: "H"}
}
Pacioli.compute_sbase_pascal = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('newton').expt(1).mult(Pacioli.unit('metre').expt(-2))), symbol: "Pa"}
}
Pacioli.compute_sbase_kelvin = function () { return {symbol: "K"}};
Pacioli.compute_sbase_degree_celcius = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.unit('kelvin').expt(1)), symbol: "°C"}
}
Pacioli.compute_sbase_steradian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.ONE), symbol: "sr"}
}
Pacioli.compute_sbase_earthmass = function () {
    return {definition: Pacioli.DimNum.fromNumber(5972, Pacioli.unit('yotta:gram').expt(1)), symbol: "earth"}
}

Pacioli.compute_index_$base_matrix_One = function () {return Pacioli.makeIndexSet('index_$base_matrix_One', 'One', [ "_" ])}
Pacioli.compute_sbase_ohm = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('ampere').expt(-1).mult(Pacioli.unit('volt').expt(1))), symbol: "Ω"}
}
Pacioli.compute_sbase_tesla = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('weber').expt(1).mult(Pacioli.unit('metre').expt(-2))), symbol: "T"}
}
Pacioli.compute_sbase_radian = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: "rad"}
}
Pacioli.compute_sbase_degree = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.0055555555555555555555556, Pacioli.unit('radian').expt(1).mult(Pacioli.unit('pi').expt(1))), symbol: "°"}
}
Pacioli.compute_sbase_candela = function () { return {symbol: "cd"}};
Pacioli.compute_sbase_lumen = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('steradian').expt(-1).mult(Pacioli.unit('candela').expt(1))), symbol: "lm"}
}
Pacioli.compute_sbase_lux = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('lumen').expt(1).mult(Pacioli.unit('metre').expt(-2))), symbol: "lx"}
}
Pacioli.compute_sbase_dollar = function () { return {symbol: "$"}};

Pacioli.compute_index_tables_Planet = function () {return Pacioli.makeIndexSet('index_tables_Planet', 'Planet', [ "Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune" ])}
Pacioli.compute_sbase_decimals = function () { return {symbol: "decs"}};
Pacioli.compute_sbase_foot = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.3048, Pacioli.unit('metre').expt(1)), symbol: "'"}
}
Pacioli.compute_sbase_katal = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('second').expt(-1).mult(Pacioli.unit('mole').expt(1))), symbol: "kat"}
}
Pacioli.compute_sbase_litre = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.unit('deci:metre').expt(3)), symbol: "l"}
}
Pacioli.compute_sbase_gray = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('kilo:gram').expt(-1).mult(Pacioli.unit('joule').expt(1))), symbol: "Gy"}
}
Pacioli.compute_sbase_percent = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.01, Pacioli.ONE), symbol: "%"}
}
Pacioli.compute_sbase_inch = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.0254, Pacioli.unit('metre').expt(1)), symbol: "\""}
}
Pacioli.compute_sbase_siemens = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('ampere').expt(1).mult(Pacioli.unit('volt').expt(-1))), symbol: "S"}
}
Pacioli.compute_sbase_sidereal_day = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.9972685185185185, Pacioli.unit('day').expt(1)), symbol: "sid"}
}
Pacioli.compute_sbase_hertz = function () { return {symbol: "Hz"}};
Pacioli.compute_sbase_sievert = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.0000000000000000000000000, Pacioli.unit('kilo:gram').expt(-1).mult(Pacioli.unit('joule').expt(1))), symbol: "Sv"}
}

Pacioli.compute_u_tables_planetary_density = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('gram').expt(1).mult(Pacioli.unitType('centi', 'metre').expt(-3)), new Pacioli.IndexType(['tables_Planet']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_tables_planetary_density = function () {
  return Pacioli.initialNumbers(8, 1, [[0,0,5.43],[1,0,5.24],[2,0,5.514],[3,0,3.91],[4,0,1.24],[5,0,0.62],[6,0,1.24],[7,0,1.61]]);
}

Pacioli.compute_u_tables_N = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_tables_N = function () {
  return Pacioli.initialNumbers(1, 1, [[0, 0, 11]]);
}

Pacioli.compute_u_tables_squares = function () {
    return new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_tables_squares = function () {
  return (function (lcl__c_accu32) { return Pacioli.$base_list_loop_list(
lcl__c_accu32, 
function (lcl__c_accu32, lcl_n) { return Pacioli.$base_system__add_mut(
lcl__c_accu32, 
(function (lcl_multiply0) { return Pacioli.$base_matrix_multiply(
lcl_multiply0, 
lcl_multiply0);})(
lcl_n));}, 
Pacioli.$base_list_naturals(
Pacioli.fetchValue('tables', 'N')));})(
Pacioli.$base_list_empty_list(
));
}

Pacioli.compute_u_tables_planetary_mass = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('yotta', 'gram').expt(1), new Pacioli.IndexType(['tables_Planet']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_tables_planetary_mass = function () {
  return Pacioli.initialNumbers(8, 1, [[0,0,330.1],[1,0,4867],[2,0,5972],[3,0,641.7],[4,0,1899000],[5,0,568500],[6,0,86820],[7,0,102400]]);
}

Pacioli.compute_u_tables_exponents = function () {
    return new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_tables_exponents = function () {
  return (function (lcl__c_accu36) { return Pacioli.$base_list_loop_list(
lcl__c_accu36, 
function (lcl__c_accu36, lcl_n) { return Pacioli.$base_system__add_mut(
lcl__c_accu36, 
Pacioli.$base_matrix_expt(
Pacioli.initialNumbers(1, 1, [[0, 0, 2]]), 
lcl_n));}, 
Pacioli.$base_list_naturals(
Pacioli.fetchValue('tables', 'N')));})(
Pacioli.$base_list_empty_list(
));
}

Pacioli.compute_u_tables_sidereal_day_per_day = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('day').expt(-1).mult(Pacioli.unitType('sidereal_day').expt(1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_tables_sidereal_day_per_day = function () {
  return Pacioli.initialNumbers(1, 1, [[0,0,1.0027389629079430110508891]]);
}

Pacioli.compute_u_tables_cubes = function () {
    return new Pacioli.GenericType("List", [Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]);
}
Pacioli.compute_tables_cubes = function () {
  return (function (lcl__c_accu34) { return Pacioli.$base_list_loop_list(
lcl__c_accu34, 
function (lcl__c_accu34, lcl_n) { return Pacioli.$base_system__add_mut(
lcl__c_accu34, 
(function (lcl_multiply1) { return Pacioli.$base_matrix_multiply(
Pacioli.$base_matrix_multiply(
lcl_multiply1, 
lcl_multiply1), 
lcl_multiply1);})(
lcl_n));}, 
Pacioli.$base_list_naturals(
Pacioli.fetchValue('tables', 'N')));})(
Pacioli.$base_list_empty_list(
));
}

Pacioli.compute_u_tables_hour_per_day = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('day').expt(-1).mult(Pacioli.unitType('hour').expt(1)), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_tables_hour_per_day = function () {
  return Pacioli.initialNumbers(1, 1, [[0,0,23.9999999999999999999462400]]);
}

Pacioli.compute_u_tables_day_length = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('day').expt(-1).mult(Pacioli.unitType('hour').expt(1)), new Pacioli.IndexType(['tables_Planet']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_tables_day_length = function () {
  return Pacioli.initialNumbers(8, 1, [[0,0,1408],[1,0,5832],[2,0,24],[3,0,24.62],[4,0,9.9],[5,0,10.7],[6,0,17.2],[7,0,16.1]]);
}
