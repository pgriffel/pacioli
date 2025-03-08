# Pacioli

A Java implementation of the Pacioli programming language.

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

The compiler is a Java application that compiles and runs Pacioli programs. See also the [installation][install] and [building from source][build] pages.

[install]: install
[build]: build

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

Pacioli is still an experimental language. The current version focuses on the core concepts of matrix programming and is pretty bare bones.
It does however have some nice features

- It runs in the browser
- It provides web components for easy publishing
- It supports the Language Server Protocol (LSP) and provides a VS Code extension with autocomplete, syntax highlighting, error diagnostics, etc.
- It has some basic 3D programming features via three.js

Notable missing features that are on the roadmap

- Multilinear algebra and data-frames
- Ad-hoc polymorphism (typeclasses/traits/implicits)
- Some data abstraction mechanism
- Better support for writing libraries and integration with other environments

2013-2025 Paul Griffioen (pgriffel@gmail)
