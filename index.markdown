---
title: Start
---

## Introduction

The matrix language Pacioli adds type safety and dimensional analysis
to mathematical software. Its parametric type system infers vector and
matrix types based on dimensioned vector spaces.

The current version is a proof of concept for type inference with dimensioned vector spaces. The
language is otherwise pretty bare bones. The implementation does however have some nice features that
make it viable for smaller projects, prototyping, education, etc.

- It runs in the browser
- It provides web components for easy publishing
- It supports the Language Server Protocol (LSP) and provides a VS Code extension with autocomplete,
  syntax highlighting, error diagnostics, etc.
- It has some basic 3D programming features via three.js

## Documentation

- [Getting Started](getting-started)
- [Examples, Tutorials and Guides](examples-tutorials-guides)
- [Pacioli Manual](manual/contents)
- [Pacioli Libraries](doc/index)

## Download and Installation

The quickest way to get started is to install the Pacioli Visual Studio Code extension.
Otherwise you have to install Pacioli manually. The [GitHub project][home] gives details
on installation.

[home]: https://github.com/pgriffel/pacioli

## License

Pacioli is released under an MIT license. See the file LICENSE in the
root directory of the sources.

## Status

Pacioli is still an experimental language. Many features are incomplete or missing.
Notable missing features that are on the roadmap are

- Multilinear algebra and data-frames
- Ad-hoc polymorphism (typeclasses/traits/implicits)
- Some data abstraction mechanism
- Error handling
- Better support for writing libraries and integration with other environments
- Support for other IDEs besides VS Code.

2013-2025 Paul Griffioen
