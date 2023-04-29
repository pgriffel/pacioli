// import { UOMBase } from './uom-base';
// /* Runtime Support for the Pacioli language
//  *
//  * Copyright (c) 2022 Paul Griffioen
//  *
//  * Permission is hereby granted, free of charge, to any person obtaining a copy of
//  * this software and associated documentation files (the "Software"), to deal in
//  * the Software without restriction, including without limitation the rights to
//  * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
//  * the Software, and to permit persons to whom the Software is furnished to do so,
//  * subject to the following conditions:
//  * 
//  * The above copyright notice and this permission notice shall be included in all
//  * copies or substantial portions of the Software.
//  * 
//  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
//  * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
//  * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
//  * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
//  * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//  */


// /**
//  * A base is a name/symbol pair from which a unit of measurement is created.
//  * 
//  * A list of bases together with corresponding equations forms the units in
//  * a uom system. See the Context class.
//  * 
//  * Examples are metre(m), gram(g), second(s), etc. These would be represented
//  * by Base('metre', 'm'), etc.
//  */
// export class Base implements UOMBase {

//   /**
//    * Construct a Base instance
//    * 
//    * @param name The base name. For example 'metre'.
//    * @param symbol The base symbol. For example 'm'.
//    */
//   constructor(
//     private baseName: string,
//     private baseSymbol: string
//   ) { }

//   name(): string {
//     return this.baseName;
//   }
// /**
//    * Short string that is used when a dimensioned number is printed. E.g. "m"
//    * for unit "metre" and "s" for unit "second".
//    */
//   symbol(): string {
//     return this.baseSymbol;
//   }

//   toText(): string {
//     return this.symbol();
//   }
  
//   /**
//    * Are two bases equal? Compares the bases' names.
//    * 
//    * @param other The other base to compare with 
//    * @returns True iff the bases' names are equal
//    */
//   public equals(other: Base): boolean {
//     return this.baseName === other.baseName;
//   }
// }

