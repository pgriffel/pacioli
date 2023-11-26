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

To create a launch command in vs-code:

1. Open launch.json
2. Place the cursor somewhere in the configurations list and press ctrl-space
3. Choose Node.js: Mocha Tests

# Build the library

```
npm run build
npm pack
```

Update the version in `package.json` if necessary.
