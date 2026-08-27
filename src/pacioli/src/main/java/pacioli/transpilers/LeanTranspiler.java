/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software are
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.transpilers;

import pacioli.Pacioli;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.Printer;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.info.AliasInfo;
import pacioli.symboltable.info.ClassInfo;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.symboltable.info.TypeVarInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.symboltable.info.VectorBaseInfo;

public class LeanTranspiler implements SymbolTableVisitor {

    CompilationSettings settings;

    Printer out;

    public LeanTranspiler(Printer printWriter, CompilationSettings settings) {
        this.out = printWriter;
        this.settings = settings;
    }

    public static void writePrelude(Printer out) {
        out.print(GENERAL_IMPORTS);
        out.print("-- START LEAN PRELUDE");
        out.newline();
        out.print(PRIMITIVES_LEAN);
        out.print("-- END LEAN PRELUDE");
        out.newline();
        out.newline();
    }

    public static void writePreludeLeaner(Printer out) {
        out.print(GENERAL_IMPORTS);
        out.print("-- START LEANER PRELUDE");
        out.newline();
        out.print(PRELUDE_COMPREHENSIONS);
        out.print(PRIMITIVES_LEANER);
        out.print(PRELUDE_FORMATTING);
        out.print("-- END LEANER PRELUDE");
        out.newline();
        out.newline();
    }

    public static void writePreludeLeanest(Printer out) {
        out.print(GENERAL_IMPORTS);
        out.print("-- START LEANEST PRELUDE");
        out.newline();
        out.print(PRELUDE_COMPREHENSIONS);
        out.print(PRIMITIVES_LEANEST);
        out.print("-- END LEANEST PRELUDE");
        out.newline();
        out.newline();
    }

    private static String GENERAL_IMPORTS = """
            import Mathlib
            import Mathlib.Data.Matrix.Basic
            import Mathlib.Data.Real.Basic

            open scoped BigOperators
            open scoped Matrix
            open Std

            namespace Pacioli

            """;

    private static String PRELUDE_COMPREHENSIONS = """

            -- Comprehensions
            declare_syntax_cat compClause
            syntax "for " term " in " term : compClause
            syntax "if " term : compClause

            syntax "[" term " | " compClause,* "]" : term

            macro_rules
            | `([$t:term | ]) => `([$t])
            | `([$t:term | for $x in $xs]) => `(List.map (λ $x => $t) $xs)
            | `([$t:term | if $x]) => `(if $x then [$t] else [])
            | `([$t:term | $c, $cs,*]) => `(List.flatten [[$t | $cs,*] | $c])

            """;

    private static String PRELUDE_FORMATTING = """

            -- Formatting

            inductive FrmtPart where
                | dec -- %d
                | str -- %s
                | lit (txt : String) -- normal text

            class Frmt (α : Type) where
                frmt : List FrmtPart -> α → String

            class FrmtElt (α : Type) where
                frmtElt : FrmtPart -> α → String

            -- Recursion over vararg tuple

            instance [FrmtElt α] [Frmt β] : Frmt (α × β) where
                frmt formats args :=
                    match formats with
                    | [] => "Too few format slots"
                    | FrmtPart.lit str :: f :: fs =>
                        let (a, as) := args
                        str ++ FrmtElt.frmtElt f a ++ Frmt.frmt fs as
                        -- str ++ Frmt.frmt rest args
                    | f :: fs =>
                        let (a, as) := args
                        FrmtElt.frmtElt f a ++ Frmt.frmt fs as

            instance [FrmtElt α] : Frmt α where
                frmt formats arg :=
                    match formats with
                    | FrmtPart.lit str :: r :: [] => str ++ FrmtElt.frmtElt r arg
                    | FrmtPart.lit str :: r :: [FrmtPart.lit str2] => str ++ FrmtElt.frmtElt r arg ++ str2
                    | p :: _ => FrmtElt.frmtElt p arg
                    | _ => "Trash left!!"


            -- instance : Frmt Unit where
            --     frmt formats arg :=
            --         match formats with
            --         | FrmtPart.lit str ::  _ => str
            --         | _ => "Trash left!!"

            -- Formatting for all primitive data types

            instance : FrmtElt Nat where
                frmtElt _ n := toString n

            instance : FrmtElt String where
                frmtElt _ n := n

            instance {α : Type} [Repr α] : FrmtElt (List α) where
                frmtElt _ n :=
                    let a := n.map (fun x => (Repr.reprPrec x 0))
                    toString a

            instance {m n : Nat} : FrmtElt (Mat m n) where
                frmtElt _ x := toString (Repr.reprPrec x 1)

            def format {t : Type} [Frmt t] (ps : List FrmtPart) (args : t) : String :=
                (Frmt.frmt ps args)

            def splitFrmt : List Char -> List FrmtPart
            | [] => []
            | '%' :: 's' :: cs => FrmtPart.str :: splitFrmt cs
            | c :: cs =>
                let ch := toString c
                match splitFrmt cs with
                | FrmtPart.lit a :: rs => FrmtPart.lit (ch ++ a) :: rs
                | other => FrmtPart.lit ch :: other

            def printf {t : Type} [Frmt t] : String × t -> IO Unit :=
                fun args =>
                    let (first, rest) := args
                    let frm := splitFrmt first.toList
                    do
                        IO.print (format frm rest)

            """;

    private static String PRIMITIVES_LEAN = """

            -- Lean representation of Pacioli's matrix type
            abbrev Mat (m n : Nat) :=
                Matrix (Fin m) (Fin n) Float

            -- Constructor for coordinates. Used by generated code.
            def coord (n : Nat) (i : Fin n) : Fin n := i

            -- Allow scalars as one by one matrices
            instance (x : Nat) : OfNat (Mat 1 1) x where
                ofNat := fun _ _ => (OfNat.ofNat x : Float)

            instance : OfScientific (Mat 1 1) where
                ofScientific mantissa exponentSign exponent :=
                    fun _ _ => OfScientific.ofScientific mantissa exponentSign exponent

            instance : Repr (Matrix (Fin 1) (Fin 1) Float) :=
            {
                reprPrec := fun x => fun i => (reprPrec (x 0 0) i)
            }

            -- Primitives

            def _base_matrix_sum {m n : Nat} := fun (args : (Mat m n) × (Mat m n)) =>
                let (x, y) := args
                x + y

            def _base_matrix_minus {m n : Nat} := fun (args : (Mat m n) × (Mat m n)) =>
                let (x, y) := args
                x - y

            def floatDotProduct {n : Nat} (v1 : Fin n → Float) (v2 : Fin n → Float) : Float :=
                (List.finRange n).map (fun i => v1 i * v2 i) |>.foldl (· + ·) 0.0

            def _base_matrix_mmult {m k n : Nat} := fun (args : (Mat m k) × (Mat k n)) =>
                let (A, B) := args
                fun i j => floatDotProduct (fun x => A i x) (fun x => B x j)

            def _base_matrix_multiply {m n : Nat} := fun (args : (Mat m n) × (Mat m n)) =>
                let (x, y) := args
                fun i j => (x i j) * (y i j)

            def _base_matrix_scale {m n : Nat} (args : (Mat 1 1) × (Mat m n)) : (Mat m n) :=
                let (x, y) := args
                fun i j => (x 1 1) * (y i j)

            def _base_matrix_scale_down {m n : Nat} (args : (Mat m n) × (Mat 1 1)) : (Mat m n) :=
                let (x, y) := args
                fun i j => (x i j) / (y 1 1)

            def _base_matrix_neg {m n : Nat} (args : (Mat m n)) : (Mat m n) :=
                let (x) := args
                _base_matrix_scale (-1, x)

            def _base_matrix_sqrt {m n : Nat} (args : (Mat m n)) : (Mat m n) :=
                let (x) := args
                fun i j => Float.sqrt (x i j)

            def _base_matrix_transpose {m n : Nat} (args : (Mat m n)) : (Mat n m) :=
                let (x) := args
                x.transpose

            def _base_matrix_make_matrix (triples : List ((Fin m) × (Fin n) × (Mat 1 1))) : (Mat m n) :=
                fun i j =>
                    match triples.find? (fun (r, c, _) => r == i && c == j) with
                    | some (_, _, v) => (v 0) 0
                    | none => 0

            def _base_base_tuple {a : Type} (x : a) : a := x

            def _base_base_apply {a b : Type} (args : (a -> b) × a) : b :=
                let (f, x) := args
                f x

            def _base_matrix_get (args : (Mat m n) × (Fin m) × (Fin n)) : Mat 1 1 :=
                let (A, i, j) := args
                Matrix.of (fun _ _ => (A i j))

            def naturals (n : Mat 1 1) : List (Mat 1 1) :=
                let m : Nat := (n 0 0).toUInt64.toNat
                (List.finRange m).map fun i : Nat => OfNat.ofNat i

            def greater {m n : Nat} (args : (Mat m n) × (Mat m n)) : Bool :=
                let (x, y) := args
                (List.finRange m).all fun i =>
                    (List.finRange n).all fun j =>
                        x i j < y i j

            """;

    private static String PRIMITIVES_LEANER = """

            -- Lean representation of Pacioli's matrix type
            abbrev Mat (m n : Nat) :=
                Matrix (Fin m) (Fin n) Float

            -- Constructor for coordinates. Used by generated code.
            def coord (n : Nat) (i : Fin n) : Fin n := i

            -- Allow scalars as one by one matrices
            instance (x : Nat) : OfNat (Mat 1 1) x where
                ofNat := fun _ _ => (OfNat.ofNat x : Float)

            instance : OfScientific (Mat 1 1) where
                ofScientific mantissa exponentSign exponent :=
                    fun _ _ => OfScientific.ofScientific mantissa exponentSign exponent

            instance : Repr (Matrix (Fin 1) (Fin 1) Float) :=
            {
                reprPrec := fun x => fun i => (reprPrec (x 0 0) i)
            }

            -- Primitives

            def scale {m n : Nat} (args : (Mat 1 1) × (Mat m n)) : (Mat m n) :=
                let (x, y) := args
                fun i j => (x 1 1) * (y i j)

            def scale_down {m n : Nat} (args : (Mat m n) × (Mat 1 1)) : (Mat m n) :=
                let (x, y) := args
                fun i j => (x i j) / (y 1 1)

            def neg {m n : Nat} (args : (Mat m n)) : (Mat m n) :=
                let (x) := args
                scale (-1, x)

            def sqrt {m n : Nat} (args : (Mat m n)) : (Mat m n) :=
                let (x) := args
                fun i j => Float.sqrt (x i j)

            def transpose {m n : Nat} (args : (Mat m n)) : (Mat n m) :=
                let (x) := args
                x.transpose

            def make_matrix (triples : List ((Fin m) × (Fin n) × (Mat 1 1))) : (Mat m n) :=
                fun i j =>
                    match triples.find? (fun (r, c, _) => r == i && c == j) with
                    | some (_, _, v) => (v 0) 0
                    | none => 0

            def tuple {a : Type} (x : a) : a := x

            def apply {a b : Type} (args : (a -> b) × a) : b :=
                let (f, x) := args
                f x

            def get (args : (Mat m n) × (Fin m) × (Fin n)) : Mat 1 1 :=
                let (A, i, j) := args
                Matrix.of (fun _ _ => (A i j))

            def naturals (n : Mat 1 1) : List (Mat 1 1) :=
                let m : Nat := (n 0 0).toUInt64.toNat
                (List.finRange m).map fun i : Nat => OfNat.ofNat i

            def greater {m n : Nat} (args : (Mat m n) × (Mat m n)) : Bool :=
                let (x, y) := args
                (List.finRange m).all fun i =>
                    (List.finRange n).all fun j =>
                        x i j < y i j

            """;

    private static String PRIMITIVES_LEANEST = """

            -- Lean representation of Pacioli's matrix type
            abbrev Mat (m n : Nat) :=
                -- (EuclideanSpace ℝ (Fin n)) →L[ℝ] (EuclideanSpace ℝ (Fin m))
                (EuclideanSpace ℝ (Fin n)) →ₗ[ℝ] (EuclideanSpace ℝ (Fin m))

            -- Constructor for coordinates. Used by generated code.
            def coord (n : Nat) (i : Fin n) : Fin n := i

            -- Primitives

            noncomputable def scale {m n : Nat} (args : (Mat 1 1) × (Mat m n)) : (Mat m n) :=
                let (x, y) := args
                fun i j => (x 1 1) * (y i j)

            noncomputable def scale_down {m n : Nat} (args : (Mat m n) × (Mat 1 1)) : (Mat m n) :=
                let (x, y) := args
                fun i j => (x i j) / (y 1 1)

            noncomputable def neg {m n : Nat} (args : (Mat m n)) : (Mat m n) :=
                let (x) := args
                scale (-1, x)

            noncomputable def sqrt {m n : Nat} (args : (Mat m n)) : (Mat m n) :=
                let (x) := args
                fun i j => Real.sqrt (x i j)

            noncomputable def transpose {m n : Nat} (args : (Mat m n)) : (Mat n m) :=
                let (x) := args
                -- x.adjoint
                x.transpose

            noncomputable def make_matrix (triples : List ((Fin m) × (Fin n) × (Mat 1 1))) : (Mat m n) :=
                sorry

            noncomputable def tuple {a : Type} (x : a) : a := x

            noncomputable def apply {a b : Type} (args : (a -> b) × a) : b :=
                let (f, x) := args
                f x

            noncomputable def get (args : (Mat m n) × (Fin m) × (Fin n)) : Mat 1 1 :=
                let (A, i, j) := args
                Matrix.of (fun _ _ => (A i j))

            noncomputable def naturals (n : Mat 1 1) : List (Mat 1 1) :=
                []

            noncomputable def greater {m n : Nat} (args : (Mat m n) × (Mat m n)) : Bool :=
                let (x, y) := args
                (List.finRange m).all fun i =>
                    (List.finRange n).all fun j =>
                        x i j < y i j

            """;

    @Override
    public void visit(ValueInfo info) {
        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling value %s", info.globalName());
        }

        ValueDefinition definition = info.definition().orElseThrow();

        definition.compileToLean(out, settings);

        out.newline();
    }

    @Override
    public void visit(IndexSetInfo info) {
        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling index set %s", info.globalName());
        }

        IndexSetDefinition def = info.definition().orElseThrow();

        def.compileToLean(out, settings);

        out.newline();
    }

    @Override
    public void visit(ParametricInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ScalarBaseInfo info) {
        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling unit %s", info.globalName());
        }

        // Optional<UnitDefinition> optionalDefinition = info.definition();

        // if (optionalDefinition.isPresent()) {
        // Optional<UnitNode> optionalBody = optionalDefinition.get().body;
        // if (optionalBody.isPresent()) {
        // UnitNode body = optionalBody.get();
        // DimensionedNumber<ScalarBase> number = body.evalUnit();
        // out.format("-- TODO: scalar unit %s = %s %s\n", info.globalName(),
        // number.factor(),
        // MatrixBase.compileUnitToJS(number.unit()));
        // } else {
        // out.format("-- TODO: scalar unit %s with no body\n", info.globalName());
        // }
        // } else {
        // throw new RuntimeException("ScalarUnitInfo misses definition");
        // }
    }

    @Override
    public void visit(VectorBaseInfo info) {
        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling vector unit %s", info.globalName());
        }

        assert (info.definition().isPresent());

        out.format("-- TODO: vector unit %s\n", info.globalName());
    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

    @Override
    public void visit(TypeVarInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ClassInfo classInfo) {
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }
}
