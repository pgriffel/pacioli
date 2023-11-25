# Library uom-ts

A typescript library for units of measurement.

Uses bignumber.js to implement dimensioned numbers.

# Testing the library

To run the fast check tests:

```
npm run test
```

or on Windows command:

```
for ($i=1; $i -le 10; $i++) {echo $i; npm run test}
```

Adjust the configuration in the `fc.configureGlobal` call.

# Build the library

```
npm run build
npm pack
```

Update the version in `package.json` if necessary.
