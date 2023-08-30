import * as fc from 'fast-check';
import { Prefix } from '../src/prefix';
import { si } from '../src/si';


/**
 * A fast check Arbitrary for the {@link Line} class.
 *
 * @param place when provided the Line uses this place, otherwise an arbitary one
 * @returns an arbitray Line instance
 * @see arbitraryPlace
 */
export function arbitraryPrefix(): fc.Arbitrary<Prefix> {
  return fc.subarray(si.getPrefixes(), { minLength: 1, maxLength: 1 }).map(x => x[0]);
}