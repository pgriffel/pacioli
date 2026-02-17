# Library pacioli-ts

A runtime system for the Pacioli language.

## Summary

- `npm run test` tests the library
- `npm run lint` lints the library
- `npm run package` packages (= build and pack) the library (.tgz)
- `npm run bundle` bundles the library (.bundle.js)
- `npm run bundle:dev` builds a dev version of the bundle and copies it to the `/js` directory
- `npm run bundle:win` is the same as bundle:dev, but for Windows

Requires Node.js 18 or above.

## Testing and linting the library

The tests run on the generated JavaScript code in directory test.
The test code has its own configuration in `tsconfig.test.json`.
This builds the test code to the separate test directory to avoid interfering with the normal build in directory dist.

To run the tests:

```
npm run test
```

This builds the code and runs the test. It should produce a jasmine-spec-reporter report.

Adjust the configuration in the `fc.configureGlobal` call.

To run linting do:

```
npm run lint
```

Linting errors are displayed on screen.

## Build the library

On the command line run

```
npm run package
```

This builds the library and packs it. It should produce a file `pacioli-test-x.x.x.tgz`.

Update the version in `package.json` if necessary.

## Bundling the library

The library is written in TypeScript and ES6 but uses CommonJS to bundle the code with webpack.

On the command line run

```
npm run bundle
```

This should produce a file `pacioli-x.x.x.bundle.js` in the dist directory.

Update the version in `webpack.config.json` if necessary.

## Building a development bundle

On the command line run

```
npm run bundle:dev
```

This produces a development version of the bundle in the `dist` directory and copies
it to the `/js` directory.

Replace with `bundle:win` on a Windows machine.

## Exports

All exports have to be put in `src/index.ts`

## Updating uom-ts

Library uom-ts is included as a file. Build and package the uom-ts library and replace the .tgz file in this
library's directory.
