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

This produces the .jar file in the src/pacioli/target directory.

### Building the javascript runtime

See the readme in the src/pacioli-js directory.

### Building the extension

This requires Node.js version 18 or above.

1. Clone the sources

2. Build the .jar file and copy it to the vscode/pacioli/ directory as 'pacioli.jar'

3. Copy the lib directory to the vscode/pacioli/ directory

4. cd vscode/pacioli/

5. npm install

6. npm run package

This produces the .vsix file in the vscode/pacioli/ directory
