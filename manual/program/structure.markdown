---
title: Program Structure
---

# Program Structure

A Pacioli program start with imports and includes, followed by definitions, type
declarations and top-level expressions. After the definitions have been processed,
the toplevel expressions in a module are evaluated in the order they appear in the
file.

```
# This is the structure of a Pacioli program

import si;
import geometry;

include some_dir/some_file;

declare foo :: ...;

define foo = ...;

declare bar :: ...;

define bar(x, y) = ...;

bar(foo, 10);
```

Pacioli only supports line comments. Anything after the `#` character until the end of the
line is ignored.

from toplevel-expressions.markdown:

# Toplevel expressions

Expressions can appear at the top leve in a Pacioli program.

All expression at the top-level are evaluated in sequence.

For example

    "1 + 1";

    "equals";

    1 + 1;

produces output

    1 + 1
    equals
    2

Evaluation takes place after all definitions have been processed.
