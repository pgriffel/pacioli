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

import { DimNum, SIUnit } from "uom-ts";
import { IndexSet } from "./values/index-set";
import { PacioliContext } from "./context";
import type { RawValue } from "./raw-values/raw-value";
import { unboxPacioliValue } from "./values/pacioli-value";
import type { PacioliValue } from "./values/pacioli-value";
import { UnitVector } from "./values/unit-vector";

declare global {
  var Pacioli: object;
}

globalThis.Pacioli = {};

export const defaultContext = PacioliContext.empty();

// -----------------------------------------------------------------------------
// 1. The Store
// -----------------------------------------------------------------------------

const cache: Map<string, RawValue> = new Map();

export function fetchValue(home: string, name: string): RawValue {
  return lookupValue(home + "_" + name);
}

export function fetchIndex(
  id: string,
  context: PacioliContext = defaultContext,
): IndexSet {
  const indexSet = context.findIndexSet(id);
  if (indexSet === undefined) {
    const computed = findFunction<IndexSet>(id)();
    context.addIndexSet(computed);
    return computed;
  } else {
    return indexSet;
  }
}

export function fetchUnit(
  prefix: string,
  base: string,
  context: PacioliContext = defaultContext,
): SIUnit {
  if (base === undefined) {
    console.log("oeps");
  }
  // const yo = base;
  // console.log(yo);
  const unit = context.lookupUnit(prefix, base);
  if (unit === undefined) {
    const parts = base.split(":");
    const baseName = parts.length === 2 ? parts[1] : base;
    // const prefix2 =
    //   prefix.length === 0 && parts.length === 2 ? parts[0] : prefix;

    const def: { definition?: DimNum; symbol: string } = computeItem(
      "sbase_" + baseName,
    );
    // TODO
    context.addBase(baseName, def.symbol, def.definition);

    return context.getUnit(prefix, base);
  } else {
    return unit;
  }
}

export function fetchUnitVector(
  vectorId: string,
  _indexId: string,
  context: PacioliContext = defaultContext,
): UnitVector {
  const candidate = context.findUnitVector(vectorId);

  if (candidate === undefined) {
    const UnitVector = findFunction<UnitVector>(vectorId)();

    context.addUnitVector(UnitVector);
    return UnitVector;
  } else {
    return candidate;
  }
}

// -----------------------------------------------------------------------------
// 1. The Store
// -----------------------------------------------------------------------------

/**
 * Gets a Pacioli item from the cache. If it is not found it computes the value
 * and puts it in the cache.
 *
 * Values can be stored as a value or as a function that computes the value. The
 * compiler generates both. Better to always generate functions instead of both
 * mechanisms at the same time?!
 *
 * The T type is a temporary hack to clarify the usage of this function.
 *
 * @param full
 * @param _context
 * @returns
 */
// TODO Remove this disable if the type of this function is fixed. Two functions? And
// two caches?
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function lookupItem<T>(
  full: string,
  _context: PacioliContext = defaultContext,
): T {
  if (cache.get(full) === undefined) {
    // @ts-expect-error The compiled code uses Pacioli as namespace. It must exist
    const asValue = window["Pacioli"][full] as RawValue | undefined;

    if (asValue === undefined) {
      cache.set(full, findFunction<T>(full)() as RawValue);
    } else {
      cache.set(full, asValue);
    }
  }

  return cache.get(full) as T;
}

export function lookupValue(full: string): RawValue {
  if (cache.get(full) === undefined) {
    // @ts-expect-error The compiled code uses Pacioli as namespace. It must exist
    const asValue = window["Pacioli"][full] as RawValue | undefined;

    if (asValue === undefined) {
      cache.set(full, findFunction<RawValue>(full)());
    } else {
      cache.set(full, asValue);
    }
  }

  return cache.get(full) as RawValue;
}

export function storePacioliValue(
  module: string,
  name: string,
  value: PacioliValue,
) {
  cache.set(module + "_" + name, unboxPacioliValue(value));
}

/**
 * Only used in fetchUnit
 */
function computeItem(full: string): { symbol: string; definition?: DimNum } {
  return findFunction<{ symbol: string; definition?: DimNum }>(full)();
}

/**
 * Finds the generated javascript code for a PacioliValue.
 *
 * Note that a PacioliValue can also be stored as value.
 *
 * The T type is a temporary hack to clarify the usage of this function.
 *
 * @param name
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function findFunction<T>(name: string): () => T {
  const nameSpace = globalThis.Pacioli;

  // @ts-expect-error The generated Pacioli code stores everything in the Pacioli namespace.
  const fun = nameSpace["compute_" + name] as (() => T) | undefined;

  if (fun === undefined) {
    throw new Error(`No function found to compute Pacioli item '${name}'`);
  }
  if (typeof fun === "function") {
    return fun;
  } else {
    throw new Error(
      `Expected a function to compute Pacioli item '${name}', but found a ${typeof fun}`,
    );
  }
}
