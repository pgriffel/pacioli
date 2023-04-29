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

import { UOM } from "uom-ts";
import { PacioliType, PacioliUnit, PacioliVector } from "./type";
import { IndexType, MatrixType, PacioliIndex } from "./types/matrix";
import { GenericType } from "./types/generic";
import { FunctionType } from "./types/function";
import { IndexVar, PacioliVar } from "./types/variables";
import { PacioliBase } from "./types/bases";

type PacioliEquation =
  | TypeEquation
  | UnitEquation
  | VectorEquation
  | IndexEquation;

class TypeEquation {
  readonly kind = "typeeq";
  constructor(public lhs: PacioliType, public rhs: PacioliType) {
    if (!lhs || !rhs) {
      throw new Error("undefined equation parts");
    }
  }
}

class UnitEquation {
  readonly kind = "uniteq";
  constructor(public lhs: PacioliUnit, public rhs: PacioliUnit) {
    if (!lhs || !rhs) {
      throw new Error("undefined equation parts");
    }
  }
}

class VectorEquation {
  readonly kind = "vectoreq";
  constructor(public lhs: PacioliVector, public rhs: PacioliVector) {
    if (!lhs || !rhs) {
      throw new Error("undefined equation parts");
    }
  }
}

class IndexEquation {
  readonly kind = "indexeq";
  constructor(public lhs: PacioliIndex, public rhs: PacioliIndex) {
    if (!lhs || !rhs) {
      throw new Error("undefined equation parts");
    }
  }
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
  var map = new Binding();
  eqs.forEach((eq) => {
    switch (eq.kind) {
      case "typeeq": {
        var lhs = subs(eq.lhs, map);
        if (lhs.kind === "typevar") {
          map = Binding.fromType(lhs, subs(eq.rhs, map)).compose(map);
        }
        break;
      }
      case "indexeq": {
        const lhs = subsIndex(eq.lhs, map.indexMap);
        if (lhs.kind === "indexvar") {
          map = Binding.fromIndex(lhs, subsIndex(eq.rhs, map.indexMap)).compose(
            map
          );
        }
        break;
      }
      case "uniteq": {
        const binding = new Binding();
        binding.unitMap = matchUnits(eq.lhs, eq.rhs);
        map = binding.compose(map);
        break;
      }
    }
  });
  return map;
}

class Binding {
  constructor(
    public typeMap: Map<string, PacioliType> = new Map(),
    public indexMap: Map<string, IndexType | IndexVar> = new Map(),
    public unitMap: Map<string, PacioliUnit> = new Map(),
    public vectorMap: Map<string, PacioliVector> = new Map()
  ) {}

  // public bindType(key: TypeVar, value: PacioliType): Binding {
  //   return new Binding(this.addToMap(key.name, value, this.typeMap), this.indexMap, this.unitMap)
  // }

  // public bindUnit(key: UnitVar, value: UOM<UnitBase | UnitVar>): Binding {
  //   return new Binding(this.typeMap, this.indexMap, this.addToMap(key.name, value, this.unitMap))
  // }

  // public bindIndex(key: IndexVar, value: IndexType | IndexVar): Binding {
  //   return new Binding(this.typeMap, this.addToMap(key.name, value, this.indexMap), this.unitMap)
  // }

  // private addToMap<T>(key: string, value: T, map: Map<string, T>): Map<string, T> {
  //   const newMap = new Map<string, T>()
  //   map.forEach((value, key) => {
  //     newMap.set(key, value)
  //   })
  //   newMap.set(key, value)
  //   return newMap;
  // }

  static fromType(variable: PacioliVar, type: PacioliType): Binding {
    const binding = new Binding();
    binding.typeMap.set(variable.name, type);
    return binding;
  }

  // static fromUnit(variable: UnitVar, unit: PacioliUnit): Binding {
  //   const binding = new Binding()
  //   binding.unitMap.set(variable.name, unit)
  //   return binding
  // }

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
        new Binding(binding, indexBinding, unitBinding, vectorBinding)
      );
    const typeBinding = mapCompose(this.typeMap, other.typeMap, typeSubs);
    return new Binding(typeBinding, indexBinding, unitBinding, vectorBinding);
  }
}

function mapCompose<T>(
  x: Map<string, T>,
  y: Map<string, T>,
  subs: (value: T, binding: Map<string, T>) => T
): Map<string, T> {
  const newMap = new Map<string, T>();
  x.forEach((value, key) => {
    newMap.set(key, value);
  });
  y.forEach((value, key) => {
    newMap.set(key, subs(value, x));
  });
  return newMap;
}

function matchUnits<T extends PacioliBase>(
  x: UOM<T>,
  y: UOM<T>
): Map<string, UOM<T>> {
  return x.equals(y) ? new Map() : unitMatch(x.div(y));
}

function unitMatch<T extends PacioliBase>(unit: UOM<T>): Map<string, UOM<T>> {
  // The map that will be returned. Initially empty.
  const map = new Map<string, UOM<T>>();

  // Split the bases into variables and non-variables
  let varBases: T[] = [];
  let fixedBases: T[] = [];
  unit.bases().forEach((base) => {
    if (base.isVar) {
      varBases.push(base);
    } else {
      fixedBases.push(base);
    }
  });

  // If there are no more variables, then we are done. Either
  // fail or return the empty map
  if (varBases.length === 0) {
    if (fixedBases.length !== 0) {
      throw "Contradiction in unit match: 1 = " + unit.toText();
    }
    return map;
  }

  // Look at the first variable and its power
  var firstVar = varBases[0];
  var power = unit.power(firstVar);

  // If it's the only one, then we are done. Either fail, or bind the var
  // to the proper unit and return the map.
  if (varBases.length === 1) {
    var rest = UOM.ONE;
    fixedBases.forEach((base) => {
      const fixedPower = unit.power(base);
      if (fixedPower % power !== 0) throw "unit error in unit " + unit.toText();
      rest = rest.mult(UOM.fromBase(base).expt(-fixedPower / power));
    });

    map.set(firstVar.getName(), rest);
    return map;
  }

  // See if there is a variable with a smaller power
  var minVar = firstVar;
  varBases.forEach((base) => {
    if (Math.abs(unit.power(base)) < Math.abs(unit.power(minVar))) {
      minVar = base;
    }
  });

  // Recurse on the unit variable with the smallest power
  var rest = UOM.ONE;
  var minPower = unit.power(minVar);
  unit.bases().forEach((base) => {
    if (base != minVar) {
      rest = rest
        .mult(UOM.fromBase(base))
        .expt(-Math.floor(unit.power(base) / minPower));
    }
  });
  map.set(minVar.getName(), UOM.fromBase(minVar).mult(rest));
  return mapCompose(unitMatch(subsUnit(unit, map)), map, subsUnit);
}

/**
 *
 * Assumes that the types are already correctly checked. For example if type
 * x is a list, then type y is also a list.
 *
 * @param x
 * @param y
 * @returns
 */
export function collectTypeEquations(
  x: PacioliType,
  y: PacioliType
): PacioliEquation[] {
  if (x.kind === "typevar") {
    return [new TypeEquation(x, y)];
  } else if (y.kind === "typevar") {
    return [new TypeEquation(y, x)]; // or x, y?
  } else if (x.kind === "matrix" && y.kind === "matrix") {
    var eqs: PacioliEquation[] = [];
    eqs.push(new UnitEquation(x.multiplier, y.multiplier));
    eqs.push(new IndexEquation(x.rowIndex, y.rowIndex));
    const rowIndex = x.rowIndex;
    if (rowIndex.kind === "index")
      if (0 === rowIndex.sets.length)
        eqs.push(new VectorEquation(x.rowUnit, y.rowUnit));
    eqs.push(new IndexEquation(x.columnIndex, y.columnIndex));
    if (x.columnIndex.kind !== "index" || 0 < x.columnIndex.sets.length)
      eqs.push(new VectorEquation(x.columnUnit, y.columnUnit));
    return eqs;
  } else if (x.kind === "generic" && y.kind === "generic") {
    var eqs: PacioliEquation[] = [];
    for (var i = 0; i < x.items.length; i++) {
      eqs = eqs.concat(...collectTypeEquations(x.items[i], y.items[i]));
    }
    return eqs;
  } else if (x.kind === "function" && y.kind === "function") {
    var eqs: PacioliEquation[] = [];
    eqs.push(new TypeEquation(x.from, y.from));
    eqs.push(new TypeEquation(x.to, y.to));
    return eqs;
  }
  throw "cannot match: kind " + x.kind + " and " + y.kind;
}

function subsIndex(
  index: PacioliIndex,
  bindings: Map<string, PacioliIndex>
): PacioliIndex {
  switch (index.kind) {
    case "index":
      return index;
    case "indexvar":
      return bindings.get(index.name) || index;
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
  bindings: Map<string, UOM<T>>
): UOM<T> {
  return unit.map((base) => {
    if (base.isVar) {
      return bindings.get(base.getName()) || UOM.fromBase(base);
    } else {
      return UOM.fromBase(base);
    }
  });
}

// function subsVectorUnit(unit: PacioliVector, bindings: Map<string, PacioliVector>): PacioliVector {
//   return unit.map(base => {
//     switch (base.kind) {
//       case 'vectorbasetype': return UOM.fromBase(base)
//       case 'unitvar': return bindings.get(base.name) || UOM.fromBase(base)
//     }
//   })
// }

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
        subsUnit(type.columnUnit, bindings.vectorMap)
      );
    }
    case "generic": {
      return new GenericType(
        type.name,
        type.items.map((x) => subs(x, bindings))
      );
    }
    case "function": {
      return new FunctionType(
        subs(type.from, bindings),
        subs(type.to, bindings)
      );
    }

    default: {
      throw new Error("hhuh");
    }
  }
}
