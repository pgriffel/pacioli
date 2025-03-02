# Pacioli

A Java implementation of the Pacioli programming language.

---

## Introduction

The matrix language Pacioli adds type safety and dimensional analysis
to mathematical software. Its parametric type system infers vector and
matrix types based on dimensioned vector spaces.

Pacioli is available as a Visual Studio Code extension. In other environments
the command line can be used after a manual installation.

The Pacioli language is described in the [documentation][doc] pages.

[doc]: http://pgriffel.github.io/pacioli/

## Visual Studio Code

Pacioli is available as a Visual Studio Code extension. Lookup the Pacioli extension and install it. Alternatively you can download the [vsix][vsix] file and run the 'Install from VSIX' command in the command palette.

After the extension is installed VS Code will recognize .pacioli files. No other installation is required. See the extension readme and the Pacioli documentation for further information.

[vsix]: http://pgriffel.github.io/pacioli/

## Command line

This implementation is a Java application that compiles and runs Pacioli programs.
The compiler is completely written in Java and compiled to a single jar file.

### Running the compiler

Assuming Pacioli is installed and available as command `pacioli` you
can run a file like:

    pacioli run samples/kirchhof.pacioli

To infer the types without running the file:

    pacioli types samples/kirchhof.pacioli

To translate a file to JavaScript:

    pacioli compile -target javascript samples/kirchhof.pacioli

To get help type:

    pacioli help

This displays all compiler command and options.

### Running the jar file without installation

To run Pacioli directly without installation you need the
`pacioli.jar` file and the `lib` directory. Use the -lib option to
tell the jar file the location of the libraries.

    java -jar pacioli.jar -lib lib ...

Replace the dots with your compiler command.

### Installation

Some suggestions to create a `pacioli` command are given. No build on
install scripts or detailed procedures are available. Some manual work
and knowledge of the Java environment is required.

It is assumed that the `pacioli.jar` file and the `lib` directory are
in some directory `pacioli`.

#### Windows

1. Place the `pacioli` directory in `program files`

2. Add this directory to the PATH variable

3. Create a file `pacioli.bat` in this directory with the following content:

<code>
@ECHO OFF  
java -jar "%~dp0\pacioli.jar" -lib "%~dp0\lib" %*
</code>

The command `pacioli` should now be available in a command
prompt. Adjust the bat file to add extra library directories or
override default compiler settings.

#### Linux alias

To create a `pacioli` command locally you can add a shell alias like:

    alias pacioli='java -jar ~/pacioli/pacioli.jar -lib ~/pacioli/lib'

Adjust the paths to your own situation.

#### Linux /usr/local

1. Copy the `pacioli` directory to /usr/local/lib/

2. Create file pacioli in /usr/local/bin with content

<code>
\#!/bin/sh  
exec java -jar /usr/local/lib/pacioli/pacioli.jar -lib /usr/local/lib/pacioli/lib "$@"
</code>

To add extra library paths or override default compiler settings per
user you can create an alias like:

    alias pacioli='pacioli -lib my_pacioli_lib -warnings'

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

## Download

Binaries are included in zip file `pacioli.zip` for the current
release. Extract the zip file to get a directory `pacioli` containing
`pacioli.jar` and directory `lib` with the necessary Pacioli
libraries.

To get the latest sources:

    git clone https://github.com/pgriffel/pacioli.git

Or download a zip file from the [GitHub repository][gh].

Runtime support for deployment via the web requires
[pacioli-0.5.0.js][pacioli_js].

[gh]: https://github.com/pgriffel/pacioli
[pacioli_js]: http://pgriffel.github.io/pacioli/javascripts/pacioli-0.5.0.js
[pacioli_min_js]: http://pgriffel.github.io/pacioli/javascripts/pacioli-0.5.0.min.js
[pacioli_css]: http://pgriffel.github.io/pacioli/stylesheets/pacioli.css
[uglify]: https://github.com/mishoo/UglifyJS

## License

Pacioli is released under an MIT license. See the file LICENSE in the
root directory of the sources.

## Status

Pacioli is still an experimental language. It focuses on the core concepts of matrix programming and is pretty bare bones.

This implementation does however have some nice features

- It runs in the browser
- It provides web components for easy publishing
- It supports the Language Server Protocol (LSP) and provides a VS Code extension with autocomplete, syntax highlighting, error diagnostics, etc.
- It has some basic 3D programming features via three.js

Notable missing features that are on the roadmap

- Multilinear algebra and data-frames
- Ad-hoc polymorphism (typeclasses/traits/implicits)
- Some data abstraction mechanisme
- Support for writing libraries
- Better integration with other tools and libraries

2013-2025 Paul Griffioen (pgriffel@gmail)
