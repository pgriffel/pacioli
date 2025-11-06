

Pacioli.compute_u_$standard_matrix_kleene = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1))]), Pacioli.createMatrixType(Pacioli.ONE, '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1)));
}

Pacioli.$standard_matrix_kleene = function (lcl_x) {
return Pacioli.$standard_matrix_inverse(
Pacioli.$base_matrix_minus(
Pacioli.$base_matrix_left_identity(
lcl_x), 
lcl_x));
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


Pacioli.compute_u_$standard_matrix_closure = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1))]), Pacioli.createMatrixType(Pacioli.ONE, '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1)));
}

Pacioli.$standard_matrix_closure = function (lcl_x) {
return Pacioli.$base_matrix_minus(
Pacioli.$standard_matrix_kleene(
lcl_x), 
Pacioli.$base_matrix_left_identity(
lcl_x));
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


Pacioli.compute_u_$standard_matrix_set_precision = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitType('decimals').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE)]), new Pacioli.GenericType("Void", []));
}

Pacioli.$standard_matrix_set_precision = function (lcl_n) {
return Pacioli.$base_system__set_precision(
Pacioli.$base_matrix_magnitude(
lcl_n));
}


Pacioli.compute_u_$standard_matrix_inverse = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1))]), Pacioli.createMatrixType(Pacioli.unitFromVarName('_a_').expt(-1), '_Q_', new Pacioli.PowerProduct('_Q!v_').expt(1), '_P_', new Pacioli.PowerProduct('_P!u_').expt(1)));
}

Pacioli.$standard_matrix_inverse = function (lcl_x) {
return Pacioli.$standard_matrix_right_inverse(
lcl_x);
}


Pacioli.compute_u_$standard_standard_to_percentage = function () {
    return new Pacioli.FunctionType(new Pacioli.GenericType("Tuple", [Pacioli.createMatrixType(Pacioli.ONE, '_D_', Pacioli.ONE, '_E_', Pacioli.ONE)]), Pacioli.createMatrixType(Pacioli.unitType('percent').expt(1), '_D_', Pacioli.ONE, '_E_', Pacioli.ONE));
}

Pacioli.$standard_standard_to_percentage = function (lcl_x) {
return Pacioli.$base_matrix_scale(
Pacioli.fetchValue('$standard_standard', 'percent_conv'), 
lcl_x);
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
Pacioli.compute_sbase_mole = function () { return {symbol: 'mol'}};
Pacioli.compute_sbase_metre = function () { return {symbol: 'm'}};
Pacioli.compute_sbase_crate = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.025, Pacioli.unitType('metre').expt(3)), symbol: 'crt'}
}
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
Pacioli.compute_sbase_piece = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: 'pc'}
}
Pacioli.compute_sbase_becquerel = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('second').expt(-1)), symbol: 'Bq'}
}
Pacioli.compute_sbase_gram = function () { return {symbol: 'g'}};

Pacioli.compute_index_bom_Product = function () {return Pacioli.makeIndexSet('index_bom_Product', 'Product', [ "Butter","Flour","Pastry","Apples","Sugar","ApplePie","PieceOfPie","CrateOfApples" ])}
Pacioli.compute_sbase_pie = function () {
    return {definition: Pacioli.DimNum.fromNumber(1, Pacioli.ONE), symbol: 'pie'}
}
Pacioli.compute_vbase_bom_Product_unit = function () { return {units: { 'ApplePie': Pacioli.unitType('pie').expt(1), 'PieceOfPie': Pacioli.unitType('piece').expt(1), 'Butter': Pacioli.unitType('gram').expt(1), 'Flour': Pacioli.unitType('gram').expt(1), 'Pastry': Pacioli.unitType('kilo', 'gram').expt(1), 'Apples': Pacioli.unitType('gram').expt(1), 'CrateOfApples': Pacioli.unitType('crate').expt(1), 'Sugar': Pacioli.unitType('gram').expt(1) }}};
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

Pacioli.compute_index_$base_matrix_One = function () {return Pacioli.makeIndexSet('index_$base_matrix_One', 'One', [ "_" ])}
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
Pacioli.compute_sbase_siemens = function () {
    return {definition: Pacioli.DimNum.fromNumber(1.00000000000000000000000000000000000000000000000000, Pacioli.unitType('ampere').expt(2).mult(Pacioli.unitType('watt').expt(-1))), symbol: 'S'}
}
Pacioli.compute_sbase_hertz = function () { return {symbol: 'Hz'}};
Pacioli.compute_vbase_bom_Product_trade_unit = function () { return {units: { 'ApplePie': Pacioli.unitType('pie').expt(1), 'PieceOfPie': Pacioli.unitType('piece').expt(1), 'Butter': Pacioli.unitType('kilo', 'gram').expt(1), 'Flour': Pacioli.unitType('kilo', 'gram').expt(1), 'Pastry': Pacioli.unitType('kilo', 'gram').expt(1), 'Apples': Pacioli.unitType('kilo', 'gram').expt(1), 'CrateOfApples': Pacioli.unitType('crate').expt(1), 'Sugar': Pacioli.unitType('kilo', 'gram').expt(1) }}};
Pacioli.compute_sbase_sievert = function () {
    return {definition: Pacioli.DimNum.fromNumber(0.00100000000000000000000000000000000000000000000000, Pacioli.unitType('newton').expt(1).mult(Pacioli.unitType('gram').expt(-1).mult(Pacioli.unitType('metre').expt(1)))), symbol: 'Sv'}
}

Pacioli.compute_u_bom_BoM = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_unit', 0).expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_unit', 0).expt(1));
}
Pacioli.compute_bom_BoM = function () {
  return Pacioli.initialNumbers(8, 8, [[7,3,0.00005],[0,2,360.0],[1,2,550.0],[2,5,0.4],[3,5,750.0],[4,5,225.0],[0,5,115.0],[5,6,0.125]]);
}

Pacioli.compute_u_bom_conv = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_unit', 0).expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_trade_unit', 0).expt(1));
}
Pacioli.compute_bom_conv = function () {
  return Pacioli.initialNumbers(8, 8, [[0,0,1000.0000000000000000000000000],[1,1,1000.0000000000000000000000000],[2,2,1.0000000000000000000000000],[3,3,1000.0000000000000000000000000],[4,4,1000.0000000000000000000000000],[5,5,1.0000000000000000000000000],[6,6,1.0000000000000000000000000],[7,7,1.0000000000000000000000000]]);
}

Pacioli.compute_u_bom_trade_BoM = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_trade_unit', 0).expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_trade_unit', 0).expt(1));
}
Pacioli.compute_bom_trade_BoM = function () {
  return Pacioli.$base_matrix_mmult(
Pacioli.$base_matrix_mmult(
Pacioli.$base_matrix_dim_inv(
Pacioli.fetchValue('bom', 'conv')), 
Pacioli.fetchValue('bom', 'BoM')), 
Pacioli.fetchValue('bom', 'conv'));
}

Pacioli.compute_u_bom_ingredient_breakdown = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_trade_unit', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_bom_ingredient_breakdown = function () {
  return Pacioli.$base_matrix_mmult(
Pacioli.$standard_matrix_closure(
Pacioli.fetchValue('bom', 'trade_BoM')), 
Pacioli.$base_matrix_multiply(
Pacioli.$standard_matrix_delta(
Pacioli.createCoordinates([['PieceOfPie','index_bom_Product']])), 
Pacioli.oneNumbersFromShape(Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_trade_unit', 0).expt(1), new Pacioli.IndexType([]), Pacioli.ONE))));
}

Pacioli.compute_u_bom_price = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('dollar').expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_trade_unit', 0).expt(-1), new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_bom_price = function () {
  return Pacioli.initialNumbers(8, 1, [[7,0,100],[1,0,0.80],[0,0,2.00],[4,0,0.50]]);
}

Pacioli.compute_u_bom_cost_breakdown = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('dollar').expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_bom_cost_breakdown = function () {
  return Pacioli.$base_matrix_multiply(
Pacioli.fetchValue('bom', 'ingredient_breakdown'), 
Pacioli.fetchValue('bom', 'price'));
}

Pacioli.compute_u_$base_matrix__ = function () {
    return new Pacioli.IndexType([]);
}
Pacioli.compute_$base_matrix__ = function () {
  return Pacioli.createCoordinates([]);
}

Pacioli.compute_u_bom_product_cost = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('dollar').expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_trade_unit', 0).expt(-1), new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_bom_product_cost = function () {
  return Pacioli.$base_matrix_mmult(
Pacioli.$base_matrix_transpose(
Pacioli.$standard_matrix_closure(
Pacioli.fetchValue('bom', 'trade_BoM'))), 
Pacioli.fetchValue('bom', 'price'));
}

Pacioli.compute_u_bom_cost_breakdown_in_percentages = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('percent').expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_bom_cost_breakdown_in_percentages = function () {
  return Pacioli.$standard_standard_to_percentage(
Pacioli.$base_matrix_scale_down(
Pacioli.fetchValue('bom', 'cost_breakdown'), 
Pacioli.$base_matrix_total(
Pacioli.fetchValue('bom', 'cost_breakdown'))));
}

Pacioli.compute_u_bom_BoM_closure = function () {
    return Pacioli.createMatrixType(Pacioli.ONE, new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_unit', 0).expt(1), new Pacioli.IndexType(['bom_Product']), Pacioli.unitVectorType('bom', 'Product_unit', 0).expt(1));
}
Pacioli.compute_bom_BoM_closure = function () {
  return Pacioli.$standard_matrix_closure(
Pacioli.fetchValue('bom', 'BoM'));
}

Pacioli.compute_u_$standard_standard_percent_conv = function () {
    return Pacioli.createMatrixType(Pacioli.unitType('percent').expt(1), new Pacioli.IndexType([]), Pacioli.ONE, new Pacioli.IndexType([]), Pacioli.ONE);
}
Pacioli.compute_$standard_standard_percent_conv = function () {
  return Pacioli.initialNumbers(1, 1, [[0,0,100.0000000000000000000000000]]);
}
