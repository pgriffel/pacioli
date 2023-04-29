import * as fc from "fast-check";
import { SIBase } from "../src/si-base";
import { arbitraryBase } from "./base.spec";
import { arbitraryPrefix } from "./prefix.spec";

export function arbitrarySIBase(): fc.Arbitrary<SIBase> {
  return fc
    .record({
      prefix: arbitraryPrefix(),
      base: arbitraryBase(),
    })
    .map((rec) =>
      SIBase.fromParts(rec.prefix, rec.base.getName(), rec.base.getSymbol())
    );
}

export function arbitraryTerm(): fc.Arbitrary<{ term: SIBase; power: number }> {
  return fc.record({
    term: arbitrarySIBase(),
    power: fc.integer({ min: -10, max: 10 }),
  });
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
