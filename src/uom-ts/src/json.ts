import { UOM } from "./uom";
import { UOMBase } from "./uom-base";



export function unitFromJSON<T extends UOMBase>(
  json: any,
  // prefixCallback: (name: string) => Prefix | undefined,
  baseCallback: (prefix: string, name: string) => UOM<T> | undefined
): UOM<T> {

  // Check that the powers field is present
  if (!json.powers) {
    throw new Error('expected powers in unit json ' + json)
  }

  // Create a unit for each individual term in the powers field
  const unit: UOM<T>[] = json.powers.map((term: any) => {

    // Check that a base field exists
    if (!term.base) {
      throw new Error('expected base in the powers of unit json ' + json)
    }
    if (!term.base.name) {
      throw new Error('expected name in the base of the powers of unit json ' + json)
    }

    // Call the callbacks to get the prefix and base
    // const prefix = prefixCallback(term.base.prefix || "");
    const unit = baseCallback(term.base.prefix || "", term.base.name);

    // Check the callback results
    // if (!prefix) {
    //   throw new Error("Cannot create unit from json. Prefix callback returned invalid prefix for " + term.base.prefix);
    // }
    if (!unit) {
      throw new Error("Cannot create unit from json. Base callback returned invalid base for " + term.base.name);
    }

    // Create a unit from the prefix and the base and raise it to the proper power
    return unit.expt(term.power || 1);
  });

  // Multiply the units of the individual terms
  return unit.reduce((x, y) => x.mult(y), UOM.ONE);
}