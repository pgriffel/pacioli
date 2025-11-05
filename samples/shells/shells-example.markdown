---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

# Shells

[<img src="shells.png"
      alt="Snapshot of a shell model"
      title="The Shells Case"
      align="left"
      style="margin: 10pt"
      width="200px">][shells]

The [shells example][shells] illustrates many aspectes of the
language. It demonstrates vectors and matrices, units of measurement,
deployment via the web, charts and other features.

The shell is computed in [Pacioli code][prog] using a seperate module
for the [model][proglib]. It is displayed on the page with library
[three.js][three].

All computations are guaranteed unit correct and derived by the
compiler. For example

    define triangle area(x, y, z) =
        norm(cross(y - x, z - x)) / 2;

has as derived type

    triangle area :: for unit a: (a*Space!, a*Space!, a*Space!) -> a^2

[shells]: /samples/shells/shells.html
[three]: http://threejs.org/
[prog]: https://raw.githubusercontent.com/pgriffel/pacioli/master/samples/shells/shells.pacioli
[proglib]: https://raw.githubusercontent.com/pgriffel/pacioli/master/samples/shells/model.pacioli
