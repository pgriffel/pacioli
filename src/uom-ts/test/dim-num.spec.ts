import { expect } from 'chai';
import * as fc from 'fast-check';
import { UOM } from '../src/uom';
import { DimNum } from './../src/dim-num';
import { arbitraryUOM } from './uom.spec';


// const siPlus: Definition = {
//   prefixes: [],
//   bases: [
//     {name: "euro", symbol: "€"},
//     {name: "cent", symbol: "¢"},
//     {name: "millicent", symbol: "m¢"}
//   ],
//   equations: [
//     {lhs: "cent", rhs: {factor: 1/100, unit: [{base: "euro"}]}},
//     {lhs: "millicent", rhs: {unit: [{prefix: "milli", base: "cent"}]}}
//   ]
// }

// const testUOMContext = Context.empty().loadDef(siDef).loadDef(siPlus);


/**
 * A fast check Arbitrary for the {@link DimNum} class.
 *
 * @returns an arbitray DimNum instance
 * @see arbitraryBase
 */
export function arbitraryDimNum(): fc.Arbitrary<DimNum> {
  return arbitraryUOM().chain((uom) => arbitraryNum().map(factor => new DimNum(factor, uom)));
}

export function arbitraryNum(): fc.Arbitrary<number> {
  return fc.frequency(
    { arbitrary: fc.constantFrom(-2, -1, 0, 1, 2), weight: 1 },
    { arbitrary: fc.integer(), weight: 2 },
    { arbitrary: fc.float(), weight: 2 }
  )
}


describe('DimNum', () => {

  describe('dimless', () => {
    it('should create a dimensioned number with the identity unit and the given factor', () => {
      fc.assert(fc.property(fc.integer(),
        (factor) => {

          // when a dimensioned number is created with dimless
          const dimNum = DimNum.dimless(factor);

          // then the number should have the empty unit
          expect(dimNum.unit.equals(UOM.ONE)).to.equal(true);

          // and the factor should be the given factor
          expect(dimNum.factor).to.equal(factor);
        }));
    });
  });

  
  describe('fromUnit', () => {
    it('should create a dimensioned number with the given unit and factor 1', () => {
      fc.assert(fc.property(arbitraryUOM(),
        (unit) => {

          // when a dimensioned number is created with fromUnit
          const dimNum = DimNum.fromUnit(unit);

          // then the number should have the given unit
          expect(dimNum.unit.equals(unit)).to.equal(true);

          // and the factor should be 1
          expect(dimNum.factor).to.equal(1);
        }));
    });
  });

  describe('mult', () => {
    it('should correctly multiply two dimensioned numbers', () => {
      fc.assert(fc.property(arbitraryDimNum(), arbitraryDimNum(),
        (numA, numB) => {

          // When two units are multipled
          const mult = numA.mult(numB);

          // Then the factor is the product of the factors
          expect(mult.factor).to.equal(numA.factor * numB.factor);

          // And the unit is the product of the units
          expect(mult.unit.equals(numA.unit.mult(numB.unit))).to.equal(true);
        }));
    });
  });

  describe('expt', () => {
    it('should correctly compute a power', () => {
      fc.assert(fc.property(arbitraryDimNum(), fc.integer(),
        (num, power) => {

          // When the exponent of a unit is computed
          const exp = num.expt(power);

          // Then the factor is the exponent of the factor
          expect(exp.factor).to.equal(num.factor ** power);

          // And the unit is the exponent of the unit
          expect(exp.unit.equals(num.unit.expt(power))).to.equal(true);
        }));
    });
  });

  describe('reciprocal', () => {
    it('should correctly take the reciprocal', () => {
      fc.assert(fc.property(arbitraryDimNum(),
        (num) => {
          
          // When the reciprocal of a unit is taken
          const reci = num.reciprocal();

          // Then the result is the same as an exponent with power -1
          expect(reci.equals(num.expt(-1))).to.equal(true);

        }));
    });
  });

  describe('div', () => {
    it('should correctly divide two dimensioned numbers', () => {
      fc.assert(fc.property(arbitraryDimNum(), arbitraryDimNum(),
        (numA, numB) => {
          
          // When two units are divided
          const div = numA.div(numB);

          // Then the result is the same as multiplying with the reciprocal
          //
          // If numA.factor === 0 && numB.factor === 0 then the outcome is NaN (result of 0/0)
          // and NaN === NaN is false. For just numB.factor === 0 the outcome is Infinity
          // (result of e.g. 1/0) and Infinity === Infinity is true.  
          expect(div.equals(numA.mult(numB.reciprocal()))).to.equal(numA.factor !== 0 || numB.factor !== 0);

        })
        );
    });
  });

  describe('equals', () => {
    it('should correctly test equality of two dimensioned numbers', () => {
      fc.assert(fc.property(arbitraryDimNum(), arbitraryDimNum(),
        (numA, numB) => {
          expect(numA.equals(numB)).to.equal(numA.factor === numB.factor && numA.unit.equals(numB.unit));
        }));
    });
  });

  describe('isDimensionless', () => {
    it('should only be true for an empty unit', () => {
      fc.assert(fc.property(arbitraryDimNum(),
        (num) => {
          expect(num.isDimensionless()).to.equal(num.unit.isDimensionless());
        }));
    });
  });


  // describe('flatten', () => {
  //   it('should ...', () => {
  //     fc.assert(fc.property(arbitraryUOM(),
  //       (unit) => {
  //         console.log('flatten', unit.toText(), testUOMContext.flatten(unit).toText());
  //         expect(unit.isDimensionless()).to.equal(unit.isDimensionless());
  //       }));
  //   });
  // });

  // describe('flatten manual', () => {
  //   it('should ...', () => {
  //     console.log('hi');

  //     const millicent = testUOMContext.getUnit("millicent"); // UOM.fromBase(millicentBase).expt(1)
  //     const euro = testUOMContext.getUnit("euro");
  //     const cent = testUOMContext.getUnit("cent");

  //     // DimNum.fromUnit(millicent).sum(DimNum.fromUnit(euro));
      
  //     console.log('flatten', millicent.toText(), testUOMContext.flatten(millicent).toText());
  //     console.log('flatten', euro.toText(), testUOMContext.flatten(euro).toText());

  //     console.log('conv', testUOMContext.conversionFactor(millicent, euro));
  //     console.log('conv', testUOMContext.conversionFactor(euro, cent));

  //     console.log('def', JSON.stringify(testUOMContext.genDef(), null, 2))
  //     console.log('def', JSON.stringify(Context.empty().loadDef(testUOMContext.genDef()).genDef(), null, 2))

  //     const ct = Context.empty().loadDef(testUOMContext.genDef())

  //     console.log('ct', ct.conversionFactor(euro, cent))

  //     console.log(testUOMContext.toText());
  //   });
  // });

});
