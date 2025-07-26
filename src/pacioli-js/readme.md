# Library pacioli-ts

A runtime system for the Pacioli language.

## Summary

- `npm run package` to package (= build and pack) the library
- `npm run bundle` to bundle the library
- `npm run test` to test the library

## Including uom-ts

Library uom-ts is included as a file. Build and package the uom-ts library and add the generated .tgz file in this
library's directory.

## Testing the library

The tests run on the generated javascript code in directory test. The test code has its own configuration in tsconfig.test.json. This builds the test code to the separate test directory to avoid interfering with the normal build in directory dist.

To run the tests:

```
npm run test
```

or on Windows command:

```
for ($i=1; $i -le 10; $i++) {echo $i; npm run test}
```

This builds the code and runs the test. It should product a jasmine-spec-reporter report.

Adjust the configuration in the `fc.configureGlobal` call.

## Build the library

On the command line run

```
npm run package
```

This build the library and packs it. It should produce a file pacioli-test-x.x.x.tgz.

Update the version in `package.json` if necessary.

## Bundling the library

The library is written in TypeScript and ES6 but uses CommonJS to bundle the code with webpack.

On the command line run

```
npm run bundle
```

This should produce a file pacioli-x.x.x.bundle.js in the dist directory.

Update the version in `webpack.config.json` if necessary.

## Exports

All exports have to be put in src/index.ts
