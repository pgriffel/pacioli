/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
  createCoordinates,
} from "./cache";

export { findNonZero } from "./raw-values/raw-matrix";

export { Space } from "./graphics/space";

export { PacioliContext } from "./context";

export { DOM, DOMTable } from "./dom/dom";

export { IndexSet } from "./values/index-set";

export { PacioliMatrix as Matrix } from "./values/matrix";

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

export { PacioliCoordinates } from "./values/coordinates";

export { PacioliBase } from "./types/bases";

export {
  $base_system__acos,
  $base_system__asin,
  $base_system__atan,
  $base_system__atan2,
  $base_system__system_time,
  $base_matrix_abs,
  $base_system__add_mut,
  $base_list_append,
  $base_base_apply,
  $base_base_identity,
  $base_array_array_get,
  $base_array_array_put,
  $base_array_array_size,
  $base_matrix_bottom,
  $base_base_from_just,
  $base_base_is_nothing,
  $base_base_just,
  $base_base_error,
  $base_base_try_catch,
  $base_matrix_column,
  $base_matrix_column_domain,
  $base_matrix_column_unit,
  $base_base_nothing,
  $base_string_concatenate,
  $base_list_cons,
  $base_matrix_cos,
  $base_matrix_dim_div,
  $base_matrix_dim_inv,
  $base_matrix_div,
  $base_matrix_divide,
  $base_list_empty_list,
  $base_base__empty_ref,
  $base_base_equal,
  $base_matrix_exp,
  $base_matrix_expt,
  $base_matrix_floor,
  $base_matrix_ceiling,
  $base_matrix_truncate,
  $base_matrix_round,
  $base_list_fold_list,
  $base_string_format,
  $base_matrix_gcd,
  $base_matrix_get,
  $base_matrix_get_num,
  $base_matrix_greater,
  $base_matrix_greater_eq,
  $base_list_head,
  $base_matrix_index_less,
  $base_matrix_is_zero,
  $base_matrix_left_identity,
  $base_matrix_less,
  $base_matrix_less_eq,
  $base_list_list_size,
  $base_matrix_ln,
  $base_matrix_log,
  $base_list_loop_list,
  $base_matrix_magnitude,
  $base_array_make_array,
  $base_matrix_make_matrix,
  $base_list_map_list,
  $base_list_mapnz,
  $base_matrix_max,
  $base_matrix_mexpt,
  $base_matrix_min,
  $base_matrix_mmult,
  $base_matrix_mod,
  $base_matrix_rem,
  $base_matrix_abs_min,
  $base_matrix_minus,
  $base_matrix_multiply,
  $base_list_naturals,
  $base_matrix_negative,
  $base_matrix_negative_support,
  $base_base__new_ref,
  $base_base_not,
  $base_base_not_equal,
  $base_system__nr_decimals,
  $base_system__set_nr_decimals,
  $base_system__precision,
  $base_system__set_precision,
  $base_list_nth,
  $base_system__num2string,
  $base_string_char_at,
  $base_string_string_length,
  $base_string_pad,
  $base_string_parse_num,
  $base_string_compare_string,
  $base_matrix_positive_support,
  $base_io_print,
  $base_matrix_random,
  $base_matrix_ranking,
  $base_base__ref_get,
  $base_base__ref_set,
  $base_matrix_reciprocal,
  $base_list_reverse,
  $base_matrix_right_identity,
  $base_matrix_row,
  $base_matrix_row_domain,
  $base_matrix_row_unit,
  $base_matrix_rscale,
  $base_matrix_scale,
  $base_matrix_scale_down,
  $base_matrix_sin,
  $base_system__skip,
  compute_$base_system__runtime_environment,
  $base_matrix_solve,
  $base_list_sort_list,
  $base_string_split_string,
  $base_matrix_sqrt,
  $base_matrix_cbrt,
  $base_matrix_sum,
  $base_matrix_signum,
  $base_matrix_support,
  $base_list_tail,
  $base_matrix_tan,
  $base_matrix_top,
  $base_matrix_total,
  $base_matrix_transpose,
  $base_string_trim,
  $base_base_tuple,
  $base_matrix_scalar_unit,
  $base_list_zip,
  $base_list_contains,
  $base_string_unit2string,
  $base_matrix_singular_value_list,
  $base_matrix_cholesky_decomposition,
  $base_matrix_plu_decomposition,
  $base_matrix_eigenvalue_decomposition,
  $base_matrix_eigenvalue_list,
  $base_matrix_qr_decomposition,
  $base_map_empty_map,
  $base_map_keys,
  $base_map_lookup,
  $base_map_store,
  ONE,
} from "./primitives";

export { internUnit, matrixShapeFromType } from "./values/pacioli-value";

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
