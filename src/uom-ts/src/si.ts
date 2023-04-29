/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2022 Paul Griffioen
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

import { Context, Definition } from "./context";

/**
 * Definition of the well-known SI unit system. Defines
 * the prefixes and the seven base units.
 */
export const siDef: Definition = {

  prefixes: [
    {name: "yocto", power: -24, symbol: "y"},
    {name: "zepto", power: -21, symbol: "z"},
    {name: "atto", power: -18, symbol: "a"},
    {name: "femto", power: -15, symbol: "f"},
    {name: "pico", power: -12, symbol: "p"},
    {name: "nano", power: -9, symbol: "n"},
    {name: "micro", power: -6, symbol: "µ"},
    {name: "milli", power: -3, symbol: "m"},
    {name: "centi", power: -2, symbol: "c"},
    {name: "deci", power: -1, symbol: "d"},
    {name: "kilo", power: 3, symbol: "k"},
    {name: "mega", power: 6, symbol: "M"},
    {name: "giga", power: 9, symbol: "G"},
    {name: "tera", power: 12, symbol: "T"},
    {name: "peta", power: 15, symbol: "P"},
    {name: "exa", power: 18, symbol: "E"},
    {name: "zetta", power: 21, symbol: "Z"},
    {name: "yotta", power: 24, symbol: "Y"},
  ],
  
  bases: [
    {name: "gram", symbol: "g"},
    {name: "ampere", symbol: "A"},
    {name: "kelvin", symbol: "K"},
    {name: "mole", symbol: "mol"},
    {name: "candela", symbol: "cd"},
    {name: "second", symbol: "s"},
    {name: "metre", symbol: "m"}
  ],

  equations: []
}

/**
 * A context filled with the SI units.
 * 
 * You can recreate it with siDef definition. This is useful if you want 
 * to extend the si context with your own definitions without mutating it. 
 * 
 * For example Context.fromDef(siDef).loadDef(myOwnDefinition)
 */
export const si = Context.fromDef(siDef);
