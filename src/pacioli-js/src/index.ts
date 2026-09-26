/**
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export { DimNum, si } from "uom-ts";

export {
  unit,
  unitType,
  unitVectorType,
  value,
  fun,
  num,
  createMatrixType,
  convertUnit,
  conversionFactor,
  unitFromVarName,
  typeFromVarName,
  list,
  tuple,
  parseDimNum,
  parseUnit,
} from "./api";

export {
  initialNumbers,
  string,
  lookupItem,
  fetchIndex,
  makeIndexSet,
  oneNumbers,
  oneNumbersFromShape,
  fetchValue,
  storePacioliValue,
  createCoordinates,
} from "./cache";

export { findNonZero } from "./raw-values/raw-matrix";

export { Space } from "./graphics/space";

export { PacioliContext } from "./context";

export { DOM, DOMTable } from "./dom/dom";

export {
  internUnit,
  matrixShapeFromType,
  PacioliValue,
} from "./values/pacioli-value";

export { IndexSet } from "./values/index-set";

// TODO: remove rename. Is not necessary!
export { PacioliMatrix as Matrix } from "./values/matrix";

export { PacioliList } from "./values/list";

export { PacioliTuple } from "./values/tuple";

export { PacioliString } from "./values/string";

export { PacioliBoole } from "./values/boole";

export { PacioliCoordinates } from "./values/coordinates";

export { RawValue, tagList, tagSet } from "./raw-values/raw-value";

export { MatrixShape as Shape } from "./values/matrix-shape";

export { MatrixType, IndexType } from "./types/matrix";

export { PacioliType, PacioliUnit, PacioliVector } from "./types/pacioli-type";

export { SIBaseType, VectorBaseType } from "./types/bases";

export { FunctionType } from "./types/function";

export { GenericType } from "./types/generic";

export { matchTypes, subs } from "./type-solver";

export { BarChart, BarChartOptions } from "./charts/d3-bar-chart";

export { LineChart, LineChartOptions } from "./charts/d3-line-chart";

export { PieChart, PieChartOptions } from "./charts/d3-pie-chart";

export { ScatterPlot, ScatterPlotOptions } from "./charts/d3-scatter-plot";

export { Histogram, HistogramOptions } from "./charts/d3-histogram";

export { WordCloud, WordCloudOptions } from "./charts/d3-wordcloud";

export { PacioliBase } from "./types/bases";

export {
  _base_system__acos,
  _base_system__asin,
  _base_system__atan,
  _base_system__atan2,
  _base_system__system_time,
  _base_matrix_abs,
  _base_system__add_mut,
  _base_list_append,
  _base_base_apply,
  _base_base_identity,
  _base_array_array_get,
  _base_array_array_put,
  _base_array_array_size,
  _base_matrix_bottom,
  _base_base_from_just,
  _base_base_is_nothing,
  _base_base_just,
  _base_base_error,
  _base_base_try_catch,
  _base_matrix_column,
  _base_matrix_column_domain,
  _base_matrix_column_unit,
  _base_base_nothing,
  _base_string_concatenate,
  _base_list_cons,
  _base_matrix_cos,
  _base_matrix_dim_div,
  _base_matrix_dim_inv,
  _base_matrix_div,
  _base_matrix_divide,
  _base_list_empty_list,
  _base_base__empty_ref,
  _base_base_equal,
  _base_matrix_exp,
  _base_matrix_expt,
  _base_matrix_floor,
  _base_matrix_ceiling,
  _base_matrix_truncate,
  _base_matrix_round,
  _base_list_fold_list,
  _base_string_format,
  _base_matrix_gcd,
  _base_matrix_get,
  _base_matrix_get_num,
  _base_matrix_greater,
  _base_matrix_greater_eq,
  _base_list_head,
  _base_matrix_index_less,
  _base_matrix_is_zero,
  _base_matrix_left_identity,
  _base_matrix_less,
  _base_matrix_less_eq,
  _base_list_list_size,
  _base_matrix_ln,
  _base_matrix_log,
  _base_list_loop_list,
  _base_matrix_magnitude,
  _base_array_make_array,
  _base_matrix_make_matrix,
  _base_list_map_list,
  _base_list_mapnz,
  _base_matrix_max,
  _base_matrix_mexpt,
  _base_matrix_min,
  _base_matrix_mmult,
  _base_matrix_mod,
  _base_matrix_rem,
  _base_matrix_abs_min,
  _base_matrix_minus,
  _base_matrix_multiply,
  _base_list_naturals,
  _base_matrix_negative,
  _base_matrix_negative_support,
  _base_base__new_ref,
  _base_base_not,
  _base_base_not_equal,
  _base_system__nr_decimals,
  _base_system__set_nr_decimals,
  _base_system__precision,
  _base_system__set_precision,
  _base_list_nth,
  _base_system__num2string,
  _base_string_char_at,
  _base_string_string_length,
  _base_string_pad,
  _base_string_parse_num,
  _base_string_compare_string,
  _base_matrix_positive_support,
  _base_io_print,
  _base_matrix_random,
  _base_matrix_ranking,
  _base_base__ref_get,
  _base_base__ref_set,
  _base_matrix_reciprocal,
  _base_list_reverse,
  _base_matrix_right_identity,
  _base_matrix_row,
  _base_matrix_row_domain,
  _base_matrix_row_unit,
  _base_matrix_rscale,
  _base_matrix_scale,
  _base_matrix_scale_down,
  _base_matrix_sin,
  _base_system__skip,
  compute__base_system__runtime_environment,
  _base_matrix_solve,
  _base_list_sort_list,
  _base_string_split_string,
  _base_matrix_sqrt,
  _base_matrix_cbrt,
  _base_matrix_sum,
  _base_matrix_signum,
  _base_matrix_support,
  _base_list_tail,
  _base_matrix_tan,
  _base_matrix_top,
  _base_matrix_total,
  _base_matrix_transpose,
  _base_string_trim,
  _base_base_tuple,
  _base_matrix_scalar_unit,
  _base_list_zip,
  _base_list_contains,
  _base_string_unit2string,
  _base_matrix_singular_value_list,
  _base_matrix_cholesky_decomposition,
  _base_matrix_plu_decomposition,
  _base_matrix_eigenvalue_decomposition,
  _base_matrix_eigenvalue_list,
  _base_matrix_qr_decomposition,
  _base_map_empty_map,
  _base_map_keys,
  _base_map_lookup,
  _base_map_store,
  _base_set_empty_set,
  _base_set_set_size,
  _base_system__adjoin_mut,
  _base_set_loop_set,
  _base_bignum_make_bignum,
  _base_bignum_bignum_add,
  _base_bignum_bignum_subtract,
  _base_bignum_bignum_multiply,
  _base_bignum_bignum_divide,
  _base_bignum_bignum_power,
  _base_bignum_bignum_sqrt,
  _base_bignum_bignum_compare,
  _base_system__bignum_precision,
  _base_system__set_bignum_precision,
  ONE,
} from "./primitives";

export { PacioliSceneComponent } from "./web-components/components/pacioli-scene";
export { PacioliControlsComponent } from "./web-components/components/pacioli-controls";
export { PacioliInputsComponent } from "./web-components/components/pacioli-inputs";
export { PacioliLineChartComponent } from "./web-components/components/pacioli-line-chart";
export { PacioliBarChartComponent } from "./web-components/components/pacioli-bar-chart";
export { PacioliHistogramComponent } from "./web-components/components/pacioli-histogram";
export { PacioliHistogramOptionsComponent } from "./web-components/components/pacioli-histogram-options";
export { PacioliPieChartComponent } from "./web-components/components/pacioli-pie-chart";
export { PacioliScatterPlotComponent } from "./web-components/components/pacioli-scatter-plot";
export { PacioliWordCloudComponent } from "./web-components/components/pacioli-wordcloud";
export { PacioliValueComponent } from "./web-components/components/pacioli-value";
export { PacioliTableComponent } from "./web-components/components/pacioli-table";
export { PacioliMatrixComponent } from "./web-components/components/pacioli-matrix";
