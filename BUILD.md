# Building Pacioli from source

The compiler is completely written in Java and compiled to a single jar file.

## Building from source

Three artifacts are build from the sources, a .jar file for the compiler, a JavaScript bundle
for running in the browser, and a .vsix extension installation file.

### Building the compiler

This requires Java version 17 or above. To build the .jar file do the following:

1. Clone the sources

2. cd src

3. ./mvnw install

This produces the .jar file in the src/pacioli/target directory and the .vsix file
in the src/vscode/pacioli/ directory

### Building the javascript runtime

See the readme in the src/pacioli-js directory.
