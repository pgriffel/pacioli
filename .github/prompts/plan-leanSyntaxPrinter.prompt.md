## Plan: Lean syntax printer variant

The goal is to add a Lean-oriented printing variant that is structurally similar to the existing pretty printer but emits Lean-style syntax placeholders, with type printing deferred for later.

### Scope

- Add a new visitor class for Lean syntax output, keeping the existing PrintVisitor behavior unchanged.
- Reuse the existing visitor/Printer infrastructure so the new printer can be invoked from the same AST pipeline.
- Provide explicit placeholders for constructs whose Lean syntax is still ambiguous, and capture those as review questions.

### Proposed implementation steps

1. Inspect the existing visitor and generator classes to identify the best integration point.
   - Reuse the current visitor pattern in [src/pacioli/src/main/java/pacioli/ast/visitors/PrintVisitor.java](src/pacioli/src/main/java/pacioli/ast/visitors/PrintVisitor.java).
   - Follow the style of [src/pacioli/src/main/java/pacioli/ast/visitors/LeanGenerator.java](src/pacioli/src/main/java/pacioli/ast/visitors/LeanGenerator.java) for naming and structure.

2. Create a new visitor class, likely named LeanPrintVisitor or LeanSyntaxPrinter, in the same package.
   - Extend or mirror the existing PrintVisitor API.
   - Keep the constructor compatible with the existing Printer abstraction.
   - Default to printing expressions and declarations in a Lean-like style while leaving type rendering as a placeholder.

3. Implement the initial pass for core AST nodes.
   - Cover program-level structure, definitions, imports/includes, basic expressions, control flow, and literals.
   - For each unsupported or ambiguous construct, emit a clear placeholder such as `-- TODO: ...` or a neutral Lean-like stub rather than silently producing incorrect syntax.

4. Add a dedicated type-printing hook.
   - Introduce a small helper method or protected method such as `writeTypePlaceholder(...)` so that later work can replace the stub with real Lean type rendering.
   - Keep the placeholder output obvious and easy to find in generated code.

5. Add a short list of review questions for uncertain syntax mappings.
   - Capture cases where the Pacioli AST semantics do not have a direct Lean equivalent, such as matrix literals, unit/quantity constructs, type classes, and module/import semantics.

6. Verify the change by compiling the Java project and inspecting the generated output for a sample AST or existing compiler path.
   - Run the relevant Maven build for the compiler module and confirm the new class compiles cleanly.

### Files likely to touch

- [src/pacioli/src/main/java/pacioli/ast/visitors/PrintVisitor.java](src/pacioli/src/main/java/pacioli/ast/visitors/PrintVisitor.java)
- [src/pacioli/src/main/java/pacioli/ast/visitors/LeanGenerator.java](src/pacioli/src/main/java/pacioli/ast/visitors/LeanGenerator.java)
- [src/pacioli/src/main/java/pacioli/ast/Node.java](src/pacioli/src/main/java/pacioli/ast/Node.java)

### Questions to resolve during implementation

1. Should the first Lean printer model Pacioli modules as Lean namespaces, or should it use a simpler placeholder-based approach for modules, imports, and exports?
   - Suggested answer: use Lean namespaces as the closest structural match for modules, and render imports/exports as lightweight `import`/`open`-style placeholders in the first pass. Keep module boundaries explicit, but use comments or TODO placeholders where full semantic fidelity is not yet available.
2. How should Pacioli’s matrix, tuple, and list literals map to Lean syntax without losing meaning?

- Add placeholders if uncertain

3. What is the preferred Lean representation for Pacioli’s unit/type-level constructs such as `for_unit`, `for_index`, and `BangTypeNode`?

- Suggested: use implicits

4. Should function definitions use `def`, `let`, or a more explicit theorem/proof style in the first pass?

- Suggested answer: use def for top-level and local function-like definitions in the first pass, and keep let for local bindings; avoid theorem/proof syntax until the type and semantics mapping is more mature.

5. How should control-flow constructs like `while`, `for`, and statement blocks be represented in Lean syntax?

- For statements the printer should throw an error that says 'Statements are not supported (yet)'

### Notes

- The first implementation should prioritize correctness of structure and readability over full semantic fidelity.
- The placeholder for types should be explicit and isolated so it can be replaced later without changing unrelated syntax generation.
