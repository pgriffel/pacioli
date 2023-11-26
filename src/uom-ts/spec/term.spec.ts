import * as fc from "fast-check";
import { SIBase } from "../src/si-base";
import { UOMTerm } from "../src/uom-term";
import { arbitrarySIBase } from "./base.spec";

export function arbitrarySITerm(): fc.Arbitrary<UOMTerm<SIBase>> {
  return arbitrarySIBase().chain((base) =>
    fc
      .integer({ min: -10, max: 10 })
      .map((power) => UOMTerm.fromBase(base).withPower(power))
  );
}

// describe('Term', () => {

//   describe('incPower', () => {
//     it('should create a new term with an adjusted power', () => {
//       fc.assert(fc.property(arbitraryTerm(), fc.integer(),
//         (term, n) => {

//           // when a term's power is increased
//           const inced = term.incPower(n);

//           // then the term should have an increased power
//           expect(term.power + n).to.equal(inced.power);

//           // then the term should have the same prefix
//           expect(term.prefix).to.equal(inced.prefix);

//           // then the term should have the same base
//           expect(term.base).to.equal(inced.base);

//         }));
//     });
//   });

//   describe('multPower', () => {
//     it('should create a new term with an adjusted power', () => {
//       fc.assert(fc.property(arbitraryTerm(), fc.integer(),
//         (term, n) => {

//           // when a term's power is increased
//           const inced = term.multPower(n);

//           // then the term should have an increased power
//           expect(term.power * n).to.equal(inced.power);

//           // then the term should have the same prefix
//           expect(term.prefix).to.equal(inced.prefix);

//           // then the term should have the same base
//           expect(term.base).to.equal(inced.base);

//         }));
//     });

//   });

// });
