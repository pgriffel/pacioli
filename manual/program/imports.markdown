---
title: Imports and Includes
---

# Imports and Includes

An import statement makes a library available.

An include makes the definitions in a local file available. It can be used to split up a
program into multiple files.

Imports and include appear at the beginning of a Pacioli program.

```
# A program starts with imports and includes

import si;
import geometry;

include some_dir/some_file;

# After that the definitions and top-level expressions appear.
...
```
