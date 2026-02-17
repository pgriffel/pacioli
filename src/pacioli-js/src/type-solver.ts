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

import { UOM } from "uom-ts";
import type {
  PacioliType,
  PacioliUnit,
  PacioliVector,
} from "./types/pacioli-type";
import type { IndexType, PacioliIndex } from "./types/matrix";
import { MatrixType } from "./types/matrix";
import { GenericType } from "./types/generic";
import { FunctionType } from "./types/function";
import type { IndexVar, PacioliVar } from "./types/variables";
import type { PacioliBase } from "./types/bases";
import { PacioliError } from "./pacioli-error";

type PacioliEquation =
  | TypeEquation
  | UnitEquation
  | VectorEquation
  | IndexEquation;

class TypeEquation {
  readonly kind = "typeeq";
  constructor(
    public lhs: PacioliType,
    public rhs: PacioliType,
  ) {}
}

class UnitEquation {
  readonly kind = "uniteq";
  constructor(
    public lhs: PacioliUnit,
    public rhs: PacioliUnit,
  ) {}
}

class VectorEquation {
  readonly kind = "vectoreq";
  constructor(
    public lhs: PacioliVector,
    public rhs: PacioliVector,
  ) {}
}

class IndexEquation {
  readonly kind = "indexeq";
  constructor(
    public lhs: PacioliIndex,
    public rhs: PacioliIndex,
  ) {}
}

export function matchTypes(x: PacioliType, y: PacioliType) {
  return solveEquations(collectTypeEquations(x, y));
}

/**
 * Assumes the rhs of an equations does not contain variables!?
 *
 * @param eqs
 * @returns
 */
function solveEquations(eqs: PacioliEquation[]) {
  let map = new Binding();
  for (const eq of eqs) {
    switch (eq.kind) {
      case "typeeq": {
        const lhs = subs(eq.lhs, map);
        if (lhs.kind === "typevar") {
          map = Binding.fromType(lhs, subs(eq.rhs, map)).compose(map);
        }
        break;
      }
      case "indexeq": {
        const lhs = subsIndex(eq.lhs, map.indexMap);
        if (lhs.kind === "indexvar") {
          map = Binding.fromIndex(lhs, subsIndex(eq.rhs, map.indexMap)).compose(
            map,
          );
        }
        break;
      }
      case "uniteq": {
        const binding = new Binding();
        binding.unitMap = matchUnits(
          subsUnit(eq.lhs, map.unitMap),
          subsUnit(eq.rhs, map.unitMap),
        );
        map = binding.compose(map);
        break;
      }
      case "vectoreq": {
        const binding = new Binding();
        binding.vectorMap = matchUnits(
          subsUnit(eq.lhs, map.vectorMap),
          subsUnit(eq.rhs, map.vectorMap),
        );
        map = binding.compose(map);
        break;
      }
    }
  }
  return map;
}

class Binding {
  constructor(
    public typeMap: Map<string, PacioliType> = new Map(),
    public indexMap: Map<string, IndexType | IndexVar> = new Map(),
    public unitMap: Map<string, PacioliUnit> = new Map(),
    public vectorMap: Map<string, PacioliVector> = new Map(),
  ) {}

  static fromType(variable: PacioliVar, type: PacioliType): Binding {
    const binding = new Binding();
    binding.typeMap.set(variable.name, type);
    return binding;
  }

  static fromIndex(variable: IndexVar, index: IndexType | IndexVar): Binding {
    const binding = new Binding();
    binding.indexMap.set(variable.name, index);
    return binding;
  }

  // Is this okay????
  compose(other: Binding): Binding {
    const unitBinding = mapCompose(this.unitMap, other.unitMap, subsUnit);
    const vectorBinding = mapCompose(this.vectorMap, other.vectorMap, subsUnit);
    const indexBinding = mapCompose(this.indexMap, other.indexMap, subsIndex);
    const typeSubs = (value: PacioliType, binding: Map<string, PacioliType>) =>
      subs(
        value,
        new Binding(binding, indexBinding, unitBinding, vectorBinding),
      );
    const typeBinding = mapCompose(this.typeMap, other.typeMap, typeSubs);
    return new Binding(typeBinding, indexBinding, unitBinding, vectorBinding);
  }
}

function mapCompose<T>(
  x: Map<string, T>,
  y: Map<string, T>,
  subs: (value: T, binding: Map<string, T>) => T,
): Map<string, T> {
  const newMap = new Map<string, T>();
  for (const [key, value] of x.entries()) {
    newMap.set(key, value);
  }
  for (const [key, value] of y.entries()) {
    newMap.set(key, subs(value, x));
  }
  return newMap;
}

function matchUnits<T extends PacioliBase>(
  x: UOM<T>,
  y: UOM<T>,
): Map<string, UOM<T>> {
  return x.equals(y) ? new Map<string, UOM<T>>() : unitMatch(x.div(y));
}

function unitMatch<T extends PacioliBase>(unit: UOM<T>): Map<string, UOM<T>> {
  // The map that will be returned. Initially empty.
  const map = new Map<string, UOM<T>>();

  // Split the bases into variables and non-variables
  const varBases: T[] = [];
  const fixedBases: T[] = [];
  for (const base of unit.bases()) {
    if (base.isVar) {
      varBases.push(base);
    } else {
      fixedBases.push(base);
    }
  }

  // If there are no more variables, then we are done. Either
  // fail or return the empty map
  if (varBases.length === 0) {
    if (fixedBases.length > 0) {
      throw new PacioliError(
        "Contradiction while matching units. Expected equal units, but after simplifying the following remains: 1 = " +
          unit.toText(),
      );
    }
    return map;
  }

  // Look at the first variable and its power
  const firstVar = varBases[0];
  const power = unit.power(firstVar);

  // If it's the only one, then we are done. Either fail, or bind the var
  // to the proper unit and return the map.
  if (varBases.length === 1) {
    let rest = UOM.ONE as UOM<T>;
    for (const base of fixedBases) {
      const fixedPower = unit.power(base);
      if (fixedPower % power !== 0)
        throw new Error("unit error in unit " + unit.toText());
      rest = rest.mult(UOM.fromBase(base).expt(-fixedPower / power));
    }

    map.set(firstVar.name, rest);
    return map;
  }

  // See if there is a variable with a smaller power
  let minVar = firstVar;
  for (const base of varBases) {
    if (Math.abs(unit.power(base)) < Math.abs(unit.power(minVar))) {
      minVar = base;
    }
  }

  // Recurse on the unit variable with the smallest power
  let rest = UOM.ONE as UOM<T>;
  const minPower = unit.power(minVar);
  for (const base of unit.bases()) {
    if (base !== minVar) {
      rest = rest
        .mult(UOM.fromBase(base))
        .expt(-Math.floor(unit.power(base) / minPower));
    }
  }
  map.set(minVar.name, UOM.fromBase(minVar).mult(rest));
  return mapCompose(unitMatch(subsUnit(unit, map)), map, subsUnit);
}

/**
 * A set of type equations that match two types. Input for the type solver.
 *
 * @param x
 * @param y
 * @returns
 */
export function collectTypeEquations(
  x: PacioliType,
  y: PacioliType,
): PacioliEquation[] {
  if (x.kind === "typevar") {
    return [new TypeEquation(x, y)];
  } else if (y.kind === "typevar") {
    return [new TypeEquation(y, x)]; // or x, y?
  } else if (x.kind === "matrix" && y.kind === "matrix") {
    const eqs: PacioliEquation[] = [
      new UnitEquation(x.multiplier, y.multiplier),
      new IndexEquation(x.rowIndex, y.rowIndex),
      new IndexEquation(x.columnIndex, y.columnIndex),
    ];

    if (x.rowIndex.kind === "indexvar" || x.rowIndex.sets.length > 0) {
      eqs.push(new VectorEquation(x.rowUnit, y.rowUnit));
    }

    if (x.columnIndex.kind === "indexvar" || x.columnIndex.sets.length > 0) {
      eqs.push(new VectorEquation(x.columnUnit, y.columnUnit));
    }

    return eqs;
  } else if (x.kind === "generic" && y.kind === "generic") {
    if (x.name !== y.name) {
      throw new Error(`Mixup of types ${x.name} and ${y.name}`);
    }
    let eqs: PacioliEquation[] = [];
    for (let i = 0; i < x.items.length; i++) {
      eqs = [...eqs, ...collectTypeEquations(x.items[i], y.items[i])];
    }
    return eqs;
  } else if (x.kind === "function" && y.kind === "function") {
    return [new TypeEquation(x.from, y.from), new TypeEquation(x.to, y.to)];
    // const eqs: PacioliEquation[] = [];
    // eqs.push(new TypeEquation(x.from, y.from), new TypeEquation(x.to, y.to));
    // return eqs;
  }
  throw new PacioliError(
    `cannot match a type of kind '${x.kind}' with a type of kind '${y.kind}'`,
  );
}

function subsIndex(
  index: PacioliIndex,
  bindings: Map<string, PacioliIndex>,
): PacioliIndex {
  switch (index.kind) {
    case "index": {
      return index;
    }
    case "indexvar": {
      return bindings.get(index.name) || index;
    }
  }
}

/**
 * To generalize this to a generic would require a generic way to test if a base is a variable.
 *
 * @param unit
 * @param bindings
 * @returns
 */
function subsUnit<T extends PacioliBase>(
  unit: UOM<T>,
  bindings: Map<string, UOM<T>>,
): UOM<T> {
  return unit.map((base) => {
    if (base.isVar) {
      return bindings.get(base.name) || UOM.fromBase(base);
    } else {
      return UOM.fromBase(base);
    }
  });
}

export function subs(type: PacioliType, bindings: Binding): PacioliType {
  switch (type.kind) {
    case "typevar": {
      return bindings.typeMap.get(type.name) || type;
    }
    case "matrix": {
      return new MatrixType(
        subsUnit(type.multiplier, bindings.unitMap),
        subsIndex(type.rowIndex, bindings.indexMap),
        subsUnit(type.rowUnit, bindings.vectorMap),
        subsIndex(type.columnIndex, bindings.indexMap),
        subsUnit(type.columnUnit, bindings.vectorMap),
      );
    }
    case "generic": {
      return new GenericType(
        type.name,
        type.items.map((x) => subs(x, bindings)),
      );
    }
    case "function": {
      return new FunctionType(
        subs(type.from, bindings),
        subs(type.to, bindings),
      );
    }
    case "index": {
      return type; // Is this okay?
    }

    // default: {
    //   throw new Error(`Kind ${type.kind} unexpected when solving type`);
    // }
  }
}
