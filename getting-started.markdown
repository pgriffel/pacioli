---
title: Getting Started
---

# Getting Started

Install Pacioli with the Visual Studio Code extension or as command line application as describe in
the [GitHub project][home].

[home]: https://github.com/pgriffel/pacioli

## Creating a .pacioli file

Create a file, say foo.pacioli, and add the following code

    define sum_first_n(n) =
        n * (n + 1) / 2;

    sum_first_n(100);

A Pacioli file contains definitions and top-level expressions, terminated by a semi-colon. After
reading the definitions, all expressions in the file are evaluated sequentially.

If you work with the Visual Studio Code extension you must open a directory or workspace that contains the file.
VS Code requires an open workspace to run compiler tasks. After opening a workspace it should recognize
.pacioli files when you view them.

Now run the file. In vs-code you can choose `Pacioli run` in the popup menu or press `ctrl-F9`. On the
command line you can run `pacioli run foo.pacioli`.

You should see something like the following with the answer 5050.

    Running file '/home/paul/code/pacioli/samples/shells/shells.pacioli'
    Compiling file '/home/paul/code/pacioli/samples/shells/shells.pacioli'
    Running mvm file '/home/paul/code/pacioli/samples/shells/shells.mvm'

    5050

The compiler generates file foo.mvm and runs that file. You can also just generate the .mvm file
with popup menu "Generate mvm code".

## Viewing types

You can print the types of all definitions in the current file.

Choose the right-mouse menu `Pacioli types` or use command `pacioli type foo.pacioli` to infer the
types.

Typing is optional. Add declaration

    declare sum_first_n ::
        (1) -> 1;

If you run type inference again you will see that the compiler picks up the declared type.

## Using libraries

Libraries can be imported with the `import` statements.

Add the following import statement to the beginning of the file.

    import geometry;

This makes the geometry library available. Add the following definition:

    define my_vector =
        vector3d(5*|metre|, 5*|metre|, 0*|metre|);

This defines a vector with unit metre.

See the [Pacioli Library Documentation](/doc/index) for an overview of the available libraries.

## Using include files

You can split your code. Use an `include` to include code from other files in the same directory or
a subdirectory.

Create file "my_lib.pacioli" and move the definition to it, including the declaration.

The original file now becomes

    include my_lib;

    sum_first_n(100);

Only values and functions with a type declaration are included.

## Next steps

From here you can continue with the [Examples, Tutorials and Guides](examples-tutorials-guides),
or go back to the [Start Page](index) and look at the manual or libraries documentation.
