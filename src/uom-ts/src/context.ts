/* Units of measurement for the Pacioli language
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

import BigNumber from "bignumber.js";
import { DimNum } from "./dim-num";
import { unitFromJSON } from "./json";
import { parseDimNum } from "./parser";
import { Prefix } from "./prefix";
import { UOM } from "./uom";
import { SIBase } from "./si-base";

/**
 * Syntax to define a SI units of measurement system
 */
export interface Definition {
  prefixes: {
    name: string;
    power: number;
    symbol: string;
  }[];

  bases: {
    name: string;
    symbol: string;
  }[];

  equations: {
    lhs: string;
    rhs: {
      factor?: BigNumber;
      powers: {
        base: {
          name: string;
          prefix?: string;
        };
        power?: number;
      }[];
    };
  }[];
}

/**
 * An SI unit of measurement.
 */
export class SIUnit extends UOM<SIBase> {
  public static ONE: SIUnit = new UOM(new Map());
}

/**
 * Context for the SI
 *
 * The SI is a units of measurement system that requires an environment that is populated with
 * prefixes, base units, principle units, and definitions for derived units.
 *
 * The Context class provides all this static information. It is for example used to
 * compute converson factors.
 */
export class Context {
  private prefixes: Map<string, Prefix> = new Map();
  private bases: Map<string, SIBase> = new Map();
  private equations: Map<string, DimNum> = new Map();

  /**
   * Cache with units that are created from the context's bases. Maps
   * base names to units. The names can include a prefix.
   */
  private unitCache: Map<string, SIUnit> = new Map();

  /**
   * Creates a new empty context. The context contains the identity prefix.
   *
   * @returns A fresh empty context.
   */
  static empty() {
    return new Context([Prefix.empty], [], []);
  }

  /**
   * Creates a unit of measurement context from a definition object.
   *
   * Shorthand for Context.empty().loadDef(def)
   *
   * @param def A proper unit of measurement context definition
   * @returns A fresh context with the definitions loaded
   */
  static fromDef(def: Definition): Context {
    return Context.empty().loadDef(def);
  }

  constructor(
    prefixes: Prefix[],
    bases: SIBase[],
    equations: [string, DimNum][]
  ) {
    // Set the prefixes
    for (const prefix of prefixes) {
      this.prefixes.set(prefix.name, prefix);
    }

    // Set the bases
    for (const base of bases.values()) {
      this.bases.set(base.name, base);
    }

    // Set the equations
    for (const [lhs, rhs] of equations) {
      this.equations.set(lhs, rhs);
    }
  }

  /**
   * Interprets the definition and adds the prefixes, bases, basis and
   * equations to the context. Returns the updated context to allow
   * chaining.
   *
   * This method mutates the context. It is idempotent.
   *
   * @param def The definition
   * @returns The mutated object
   */
  public loadDef(def: Definition): Context {
    // Load the prefixes.
    for (const record of def.prefixes) {
      this.prefixes.set(
        record.name,
        new Prefix(record.power, record.name, record.symbol)
      );
    }

    // Load the bases
    for (const record of def.bases) {
      this.addSIBase(SIBase.from(record.name, record.symbol));
    }

    // Load the equations
    for (const record of def.equations) {
      // Parse the unit in the rhs of this equation
      const unit = this.parseSIUnit(record.rhs);

      // Create and store a definition
      const def = new DimNum(new BigNumber(record.rhs.factor || 1), unit);
      this.equations.set(record.lhs, def);
    }

    // Return this to allow chaining
    return this;
  }

  public parseSIUnit(json: {
    powers: {
      base: {
        prefix?: string;
        name: string;
      };
      power?: number;
    }[];
  }): SIUnit {
    return unitFromJSON(json, (prefixName, baseName) => {
      const prefix = this.prefixes.get(prefixName);
      if (prefix) {
        return this.getScaledUnit(prefixName, baseName);
      } else {
        throw new Error(
          "Cannot create unit from json. Invalid prefix: " + prefixName
        );
      }
    });
  }

  public addBase(name: string, symbol: string, def?: DimNum) {
    this.addSIBase(SIBase.from(name, symbol), def);
  }

  public addSIBase(base: SIBase, def?: DimNum) {
    this.bases.set(base.name, base);
    if (def !== undefined) {
      this.equations.set(base.name, def);
    }
  }

  /**
   * Returns all bases in the context.
   *
   * @returns An array with bases
   */
  public getBases(): SIBase[] {
    return Array.from(this.bases.values());
  }

  /**
   * All prefixes in the context.
   *
   * @returns An array of prefixes
   */
  public getPrefixes(): Prefix[] {
    return Array.from(this.prefixes.values());
  }

  /**
   * Finds the prefix with the given name. Throws
   * an error if it does not exist.
   *
   * @param name The prefix name
   * @returns The prefix
   */
  public getPrefix(name: string): Prefix {
    const prefix = this.prefixes.get(name);
    if (!prefix) {
      throw new Error("Prefix " + name + " unknown");
    }
    return prefix;
  }

  /**
   * Returns a unit with the given base name and give prefix. Throws
   * an error if it does not exist.
   *
   * The prefix overrides a possible prefix in the name.
   *
   * @param name A base name, or a prefix and base name separated by a colon
   * @returns The unit
   */
  public getScaledUnit(prefix: string, name: string): UOM<SIBase> {
    const unit = this.lookupScaledUnit(prefix, name);
    if (unit === undefined) {
      throw new Error(`Base '${name}' unknown (prefix override = ${prefix})`);
    }
    return unit;
  }

  public lookupScaledUnit(
    prefix: string,
    name: string
  ): UOM<SIBase> | undefined {
    const parts = name.split(":");
    const baseName = parts.length === 2 ? parts[1] : name;
    const fullName = prefix.length > 0 ? prefix + ":" + baseName : baseName;
    const cached = this.unitCache.get(fullName);
    if (cached) {
      return cached;
    } else {
      return this.getUnitFromBase(prefix, baseName, fullName);
    }
  }

  /**
   * Returns a unit with the given base name. Throws
   * an error if it does not exist.
   *
   * @param name A base name, or a prefix and base name separated by a colon
   * @returns The unit
   */
  public getUnit(name: string): UOM<SIBase> {
    const unit = this.lookupUnit(name);
    if (unit === undefined) {
      throw new Error("Base '" + name + "' unknown");
    }
    return unit;
  }

  public lookupUnit(name: string): UOM<SIBase> | undefined {
    const cached = this.unitCache.get(name);
    if (cached) {
      return cached;
    } else {
      const parts = name.split(":");
      if (parts.length === 2) {
        return this.getUnitFromBase(parts[0], parts[1], name);
      } else {
        return this.getUnitFromBase("", name, name);
      }
    }
  }

  private getUnitFromBase(
    prefixName: string,
    baseName: string,
    fullName: string
  ): UOM<SIBase> | undefined {
    const prefix = this.prefixes.get(prefixName);
    const base = this.bases.get(baseName);

    if (!base) {
      return undefined;
    }
    if (!prefix) {
      throw new Error(
        "Prefix '" + prefixName + "' unknown in unit " + fullName
      );
    }

    const unit = UOM.fromBase(base.withPrefix(prefix));
    this.unitCache.set(fullName, unit);
    return unit;
  }

  /**
   * An equivalent unit of the given one that only uses
   * base units.
   *
   * Creates a unit with each derived unit replaced by its definition and
   * flattened recursively.
   *
   * @param unit Any unit
   * @returns The new flattened unit
   */
  public flatten(unit: UOM<SIBase>): DimNum {
    let num = DimNum.ONE;

    for (const term of unit.termMap.values()) {
      const prefixFactor = new BigNumber(10)
        .exponentiatedBy(term.base.prefix.power)
        .exponentiatedBy(term.power);
      const definition: DimNum | undefined = this.equations.get(term.base.base);

      if (definition) {
        num = num
          .mult(this.flattenDimNum(definition.expt(term.power)))
          .scale(prefixFactor);
      } else {
        const unit = UOM.fromBase(term.base.withPrefix(Prefix.empty)).expt(
          term.power
        );
        num = num.mult(new DimNum(prefixFactor, unit));
      }
    }

    return num;
  }

  /**
   * An equivalent dimensioned number as the given one that only uses
   * base units.
   *
   * Uses method flatten to flatten the unit.
   *
   * @param unit A dimensioned number
   * @returns The new flattened dimensioned number
   */
  public flattenDimNum(num: DimNum): DimNum {
    const flatUnit = this.flatten(num.unit);
    return new DimNum(
      num.magnitude.multipliedBy(flatUnit.magnitude),
      flatUnit.unit
    );
  }

  /**
   * The factor needed to convert a unit to another one. Throws an error if the conversion
   * is not possible.
   *
   * @param from The unit to convert
   * @param to The unit to convert to
   * @returns The conversion factor
   */
  conversionFactor(from: UOM<SIBase>, to: UOM<SIBase>): BigNumber {
    var flat = this.flatten(from.div(to));
    if (flat.isDimensionless()) {
      return flat.magnitude;
    } else {
      throw new Error(
        "cannot convert unit " + from.toText() + " to unit " + to.toText() + ""
      );
    }
  }

  /**
   * The factor needed to convert a unit to another one. Returns undefined if the conversion
   * is not possible.
   *
   * @param from The unit to convert
   * @param to The unit to convert to
   * @returns The conversion factor or undefined
   */
  conversionFactorMaybe(
    from: UOM<SIBase>,
    to: UOM<SIBase>
  ): BigNumber | undefined {
    var flat = this.flatten(from.div(to));
    if (flat.isDimensionless()) {
      return flat.magnitude;
    } else {
      return undefined;
    }
  }

  /**
   * Generate a definition for the context.
   *
   * Loading the generated definition into an empty one reconstructs
   * the context.
   *
   * @returns The generated definition
   */
  genDef(): Definition {
    return {
      prefixes: Array.from(this.prefixes.values()).map((prefix) => {
        return {
          name: prefix.name,
          power: prefix.power,
          symbol: prefix.symbol,
        };
      }),
      bases: Array.from(this.bases.values()).map((base) => {
        return {
          name: base.name,
          symbol: base.symbol,
        };
      }),
      equations: Array.from(this.equations.entries()).map(([name, def]) => {
        return {
          lhs: name,
          rhs: {
            factor: def.magnitude,
            powers: Array.from(def.unit.termMap.values()).map((term) => {
              return {
                base: {
                  name: term.base.base,
                  prefix: term.base.prefix.name,
                },
                power: term.power,
              };
            }),
          },
        };
      }),
    };
  }

  /**
   * A human readable form of the context contents. Can be useful for
   * things like debugging.
   *
   * Somewhat more readable than JSON.stringify(context.genDef(), null, 2)
   *
   * @returns A string with the printed context.
   */
  public toText(): string {
    return (
      "Prefixes:\n" +
      Array.from(this.prefixes.values())
        .filter((x) => x.power !== 0)
        .map((prefix) => {
          return (
            "  " +
            prefix.name +
            " (" +
            prefix.symbol +
            ") = " +
            "10^" +
            prefix.power
          );
        })
        .join("\n") +
      "\nBases:\n" +
      Array.from(this.bases.values())
        .map((base) => {
          return "  " + base.name + " (" + base.symbol + ")";
        })
        .join("\n") +
      "\nEquations:\n" +
      Array.from(this.equations.entries())
        .map(([name, def]) => {
          return "  " + name + " = " + def.toText();
        })
        .join("\n")
    );
  }

  /**
   * Parses a dimensioned number expression from a string. Throws an error if the string cannot
   * be interpreted as a dimensioned number, or if a base cannot be found. Multiplication and
   * division have equal precedence and are done from left to right.
   *
   * dimnum ::=
   *   term |
   *   term "*" dimnum |
   *   term "/" dimnum
   *
   * term ::=
   *   number |
   *   identifier |
   *   prefix ":" identifier |
   *   term "^" integer |
   *   "(" dimnum ")"
   *
   * prefix ::= "milli" | "centi" | "kilo" | ...
   *
   * An example expression is "9.8 * kilo:gram * metre / second^2"
   *
   * @param expr The string to parse
   * @returns A dimensioned number
   */
  parseDimNum(input: string): DimNum {
    return parseDimNum(
      input,
      this.getUnit.bind(this),
      this.getScaledUnit.bind(this)
    );
  }
}
