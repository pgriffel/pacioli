# Building Pacioli from source

The compiler is completely written in Java and compiled to a single jar file.

## Building from source

Three artifacts are build from the sources, a .jar file for the compiler, a javascript bundle for running in the browser, and a .vsix extension installation file.

### Building the compiler

To build the .jar file do the following:

1. Clone the sources

2. cd src/pacioli

3. ./mvnw install

This produces the .jar file in the src/pacioli/target directory.

### Building the javascript runtime

This requires nodejs to be installed.

1. Clone the sources

2. cd src/pacioli-js

3. npm run bundle

This produces the bundle .js file in the src/pacioli-js/dist directory

### Building the extension

This requires nodejs to be installed.

1. Clone the sources

2. Build the .jar file and copy it to the vscode/pacioli/ directory

3. Copy the lib directory to the vscode/pacioli/ directory

4. cd vscode/pacioli/

5. npm run package

This produces the .vsix file in the vscode/pacioli/ directory
