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

import { dimlessScalar } from "./cache";
import { RawMap } from "./raw-values/raw-value";
import type { RawBigNum, RawList, RawString } from "./raw-values/raw-value";
import type { PacioliVoid } from "./values/void";
import { VOID } from "./values/void";
import type { RawMatrix } from "./raw-values/raw-matrix";
import { getNumber } from "./raw-values/raw-matrix";
import { PacioliBigNum } from "./values/bignum";
import { BigNumber } from "bignumber.js";

// -----------------------------------------------------------------------------
// 1. Primitive Units Unit Prefixes
// -----------------------------------------------------------------------------

// export const ONE = SIUnit.ONE;

// export let NR_DECIMALS = 2;

let BIGNUM_PRECISION = initializeBigNum(14);

function initializeBigNum(precision: number) {
  BigNumber.config({ DECIMAL_PLACES: precision });
  return precision;
}

export function _base_map_keys(map: RawMap): RawList {
  return map.keys();
}

export function _bignum_bignum_make_bignum(x: RawString): RawBigNum {
  return new PacioliBigNum(new BigNumber(x));
}

export function _bignum_bignum_bignum_add(
  x: RawBigNum,
  y: RawBigNum,
): RawBigNum {
  return new PacioliBigNum(new BigNumber(x.value.plus(y.value)));
}

export function _bignum_bignum_bignum_subtract(
  x: RawBigNum,
  y: RawBigNum,
): RawBigNum {
  return new PacioliBigNum(new BigNumber(x.value.minus(y.value)));
}

export function _bignum_bignum_bignum_multiply(
  x: RawBigNum,
  y: RawBigNum,
): RawBigNum {
  return new PacioliBigNum(new BigNumber(x.value.multipliedBy(y.value)));
}

export function _bignum_bignum_bignum_divide(
  x: RawBigNum,
  y: RawBigNum,
): RawBigNum {
  return new PacioliBigNum(new BigNumber(x.value.dividedBy(y.value)));
}

export function _bignum_bignum_bignum_sqrt(x: RawBigNum): RawBigNum {
  return new PacioliBigNum(new BigNumber(x.value.sqrt()));
}

export function _bignum_bignum_bignum_power(
  x: RawBigNum,
  p: RawMatrix,
): RawBigNum {
  // BigNumber.config({ DECIMAL_PLACES: getNumber(dp, 0, 0) });
  return new PacioliBigNum(
    new BigNumber(x.value.exponentiatedBy(getNumber(p, 0, 0))),
  );
}

export function _bignum_bignum_bignum_compare(
  x: RawBigNum,
  y: RawBigNum,
): RawMatrix {
  const comparison = x.value.comparedTo(y.value) as number;
  return dimlessScalar(comparison);
}

export function _bignum_bignum__bignum_precision(): RawMatrix {
  return dimlessScalar(BIGNUM_PRECISION);
}

export function _bignum_bignum__set_bignum_precision(
  precision: RawMatrix,
): PacioliVoid {
  BIGNUM_PRECISION = getNumber(precision, 0, 0);
  BigNumber.config({ DECIMAL_PLACES: BIGNUM_PRECISION });
  return VOID;
}
