# Library uom-ts

A typescript library for units of measurement. Part of [Pacioli][1].

Uses [bignumber.js][2] in the implementation of dimensioned numbers.

# Build the library

Update the version in `package.json` if necessary.

```
npm run build
npm pack
```

# Testing the library

The tests use [Mocha][3] and [fast-check][4].

## Running the tests

To run the tests:

```
npm run test
```

If you use VS Code you can create a launch command as follows:

1. Open launch.json
2. Place the cursor somewhere in the configurations list and press ctrl-space
3. Choose Node.js: Mocha Tests

You can now debug the tests, set breakpoint, etc.

A failing test can be rerun by pasting the { seed: 1442240156, path: "149448", endOnFailure: true } as second arg of the fc.assert of the failing test.

## Test configuration

Adjust the configuration in the `fc.configureGlobal` call.

The test script in package.json contains the mocha timeout: mocha --timeout 60000

# Links

- [Pacioli][1]
- [bignumber.js][2]
- [Mocha][3]
- [fast-check][4]

[1]: http://pgriffel.github.io/pacioli/
[2]: https://github.com/MikeMcl/bignumber.js/
[3]: https://mochajs.org/
[4]: https://github.com/dubzzz/fast-check
