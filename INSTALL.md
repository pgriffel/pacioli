# Pacioli installation

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
