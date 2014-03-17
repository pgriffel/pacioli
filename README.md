Pacioli
=======

A Java implementation of the Pacioli programming language.

--------------------------------------------------------------------------------


Introduction
------------

The matrix language Pacioli adds type safety and dimensional anaylysis
to mathematical software. Its parametric type system infers vector and
matrix types based on dimensioned vector spaces.

This implementation is a command line application that compiles and
runs Pacioli programs. It is completely written in Java and compiled
to a single jar file.

The Pacioli language is described in the [documentation][doc] pages.

[doc]: http://pgriffel.github.io/pacioli/

Running the compiler
--------------------

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


Download
--------

Binaries are included in zip file `pacioli.zip` for the current
release. Extract the zip file to get a directory `pacioli` containing
`pacioli.jar` and directory `lib` with the necessary Pacioli
libraries.

To get the latest sources:

    git clone https://github.com/pgriffel/pacioli.git

Or download a zip file from the [GitHub repository][gh].

Runtime support for deployment via the web requires
[pacioli-0.2.1.js][pacioli_js]. An [uglified][uglify] version is available as
[pacioli-0.2.1.min.js][pacioli_min_js].

Finally you might want to download the [Pacioli style sheet][pacioli_css].

[gh]: https://github.com/pgriffel/pacioli
[pacioli_js]: http://pgriffel.github.io/pacioli/javascripts/pacioli-0.2.1.js
[pacioli_min_js]: http://pgriffel.github.io/pacioli/javascripts/pacioli-0.2.1.min.js
[pacioli_css]: http://pgriffel.github.io/pacioli/stylesheets/pacioli.css
[uglify]: https://github.com/mishoo/UglifyJS

Running the jar file
---------------------

To run Pacioli directly without installation you need the
`pacioli.jar` file and the `lib` directory. Use the -lib option to
tell the jar file the location of the libraries.

    java -jar pacioli.jar -lib lib ...

Replace the dots with your compiler command.


Installation
------------

Some suggestions to create a `pacioli` command are given. No build on
install scripts or detailed procedures are available. Some manual work
and knowledge of the Java environment is required.

It is assumed that the `pacioli.jar` file and the `lib` directory are
in some directory `pacioli`.

### Windows

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

### Linux alias

To create a `pacioli` command locally you can add a shell alias like:

    alias pacioli='java -jar ~/pacioli/pacioli.jar -lib ~/pacioli/lib'

Adjust the paths to your own situation.

### Linux /usr/local

1. Copy the `pacioli` directory to /usr/local/lib/

2. Create file pacioli in /usr/local/bin with content

    <code>
    \#!/bin/sh  
    exec java -jar /usr/local/lib/pacioli/pacioli.jar -lib /usr/local/lib/pacioli/lib "$@"
    </code>

To add extra library paths or override default compiler settings per
user you can create an alias like:

    alias pacioli='pacioli -lib my_pacioli_lib -warnings'


Building from source
--------------------

The Java sources are compiled into a single jar file. 

The software consists of three packages:

* pacioli - the Pacioli compiler
* mvm - the Matrix Virtual Machine runtime.
* uom - general unit of measurement library

It uses two external libraries:

* commons-math3-3.1.1.jar from [Commons Math][cm]
* jparsec-2.0.1.jar from [Jparsec][jp]

To build in an IDE like Eclipse or NetBeans do the following:

1. Import the sources into a new Pacioli project

2. Include the commons-math and jparsec jar libraries

3. Build the file `pacioli.jar` from the project

Adjust this setup according to your own environment.

[cm]: http://commons.apache.org/proper/commons-math/
[jp]: http://jparsec.codehaus.org/


License
-------

Pacioli is released under an MIT license. See the file LICENSE in the
root directory of the sources.


Status
------

This Pacioli implementation is reasonably complete. However, it
doesn't support many features for input and output yet.

--------------------------------------------------------------------------------

2013-2014 Paul Griffioen

