/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

export { DimNum } from "uom-ts";

export { tagKind } from "./value";

export {
  initialNumbers,
  unit,
  unitType,
  unitVectorType,
  value,
  fun,
  num,
  lookupItem,
  createMatrixType,
  fetchIndex,
  makeIndexSet,
  oneNumbers,
  oneNumbersFromShape,
  fetchValue,
  createCoordinates,
  unitFromBase,
  unitFromVarName,
  typeFromVarName,
  list,
} from "./api";

export { findNonZero } from "./values/numbers";

export { Space } from "./space";

export { PacioliContext } from "./context";

export { DOM } from "./dom";

export { IndexSet } from "./values/index-set";

export { Matrix } from "./values/matrix";

export { MatrixShape as Shape } from "./values/matrix-shape";

export { MatrixType, IndexType } from "./types/matrix";

export { PacioliType, PacioliUnit, PacioliVector } from "./type";

export { SIBaseType, VectorBaseType } from "./types/bases";

export { FunctionType } from "./types/function";

export { GenericType } from "./types/generic";

export { matchTypes, subs } from "./type-solver";

export { BarChart } from "./charts/d3-bar-chart";

export { LineChart } from "./charts/d3-line-chart";

export { PieChart } from "./charts/d3-pie-chart";

export { ScatterPlot } from "./charts/d3-scatter-plot";

export { Histogram } from "./charts/d3-histogram";

export { WordCloud } from "./charts/d3-wordcloud";

export {
  lib_base_system__acos,
  lib_base_system__asin,
  lib_base_system__atan,
  lib_base_system__atan2,
  lib_base_system__system_time,
  lib_base_matrix_abs,
  lib_base_system__add_mut,
  lib_base_list_append,
  lib_base_base_apply,
  lib_base_array_array_get,
  lib_base_array_array_put,
  lib_base_array_array_size,
  lib_base_matrix_bottom,
  lib_base_base_maybe_get,
  lib_base_base__catch_result,
  lib_base_base_is_nothing,
  lib_base_base_just,
  lib_base_matrix_column,
  lib_base_matrix_column_domain,
  lib_base_matrix_column_unit,
  lib_base_base_nothing,
  lib_base_string_concatenate,
  lib_base_list_cons,
  lib_base_matrix_cos,
  lib_base_matrix_dim_div,
  lib_base_matrix_dim_inv,
  lib_base_matrix_div,
  lib_base_matrix_divide,
  lib_base_list_empty_list,
  lib_base_base__empty_ref,
  lib_base_base_equal,
  lib_base_matrix_exp,
  lib_base_matrix_expt,
  lib_base_list_fold_list,
  lib_base_string_format,
  lib_base_matrix_gcd,
  lib_base_matrix_get,
  lib_base_matrix_get_num,
  lib_base_matrix_greater,
  lib_base_matrix_greater_eq,
  lib_base_list_head,
  lib_base_matrix_index_less,
  lib_base_matrix_is_zero,
  lib_base_matrix_left_identity,
  lib_base_matrix_less,
  lib_base_matrix_less_eq,
  lib_base_list_list_size,
  lib_base_matrix_ln,
  lib_base_matrix_log,
  lib_base_list_loop_list,
  lib_base_matrix_magnitude,
  lib_base_array_make_array,
  lib_base_matrix_make_matrix,
  lib_base_list_map_list,
  lib_base_list_mapnz,
  lib_base_matrix_max,
  lib_base_matrix_mexpt,
  lib_base_matrix_min,
  lib_base_matrix_mmult,
  lib_base_matrix_mod,
  lib_base_matrix_minus,
  lib_base_matrix_multiply,
  lib_base_list_naturals,
  lib_base_matrix_negative,
  lib_base_matrix_negative_support,
  lib_base_base__new_ref,
  lib_base_base_not,
  lib_base_base_not_equal,
  lib_base_io_nr_decimals,
  lib_base_list_nth,
  lib_base_string_num2str,
  lib_base_string_num2string,
  lib_base_string_pad_left,
  lib_base_string_pad_right,
  lib_base_string_parse_num,
  lib_base_matrix_positive_support,
  lib_base_io_print,
  lib_base_matrix_random,
  lib_base_matrix_ranking,
  lib_base_base__ref_get,
  lib_base_base__ref_set,
  lib_base_matrix_reciprocal,
  lib_base_list_reverse,
  lib_base_matrix_right_identity,
  lib_base_matrix_row,
  lib_base_matrix_row_domain,
  lib_base_matrix_row_unit,
  lib_base_matrix_rscale,
  lib_base_matrix_scale,
  lib_base_matrix_scale_down,
  lib_base_base__seq,
  lib_base_io_set_nr_decimals,
  lib_base_matrix_sin,
  lib_base_system__skip,
  lib_base_matrix_solve,
  lib_base_list_sort_list,
  lib_base_string_split_string,
  lib_base_matrix_sqrt,
  lib_base_matrix_sum,
  lib_base_matrix_support,
  lib_base_list_tail,
  lib_base_matrix_tan,
  lib_base_matrix_top,
  lib_base_matrix_total,
  lib_base_matrix_transpose,
  lib_base_string_trim,
  lib_base_base__throw_result,
  lib_base_base_tuple,
  lib_base_matrix_unit_factor,
  lib_base_base__while,
  lib_base_list_zip,
  compute_lib_base_matrix__,
  ONE,
} from "./primitives";
