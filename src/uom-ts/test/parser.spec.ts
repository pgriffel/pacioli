import { expect } from 'chai';
import * as fc from 'fast-check';
import { si } from '../src/si';
import { arbitraryBase } from './base.spec';



describe('parser', () => {

  describe('parse', () => {
    it('should create a unit ', () => {
      fc.assert(fc.property(arbitraryBase(),
        (_) => {

          // console.log(parseUnit("euro * kilo:gram ^ 2 / (litre)"))

          expect(true).to.equal(true);

        }));
    });

    describe('parse', () => {
      it('should parse a unit ', () => {

        const output = si.parseDimNum("12.3 * second * 10 ^ 1  *  kilo:gram ^ 2 / (kelvin)  * 14 ^5 ").toText()

        expect(output).to.equal("66152352*s*kg^2/K");

      });
    });

  });
});
