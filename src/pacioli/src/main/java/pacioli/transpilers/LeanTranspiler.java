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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.Pacioli;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.unit.UnitNode;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.PacioliException;
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
import pacioli.types.type.matrix.MatrixBase;
import pacioli.types.type.matrix.ScalarBase;
import uom.DimensionedNumber;

public class LeanTranspiler implements SymbolTableVisitor {

    CompilationSettings settings;
    Printer out;

    public LeanTranspiler(Printer printWriter, CompilationSettings settings) {
        this.out = printWriter;
        this.settings = settings;
    }

    public static void writePrelude(Printer out) {
        out.format("import Mathlib\n");
        out.format("import Mathlib.Data.Matrix.Basic\n");
        out.format("import Mathlib.Data.Real.Basic\n\n");
        out.format("open scoped BigOperators\n");
        out.format("open scoped Matrix\n");
        out.format("open Std\n\n");
        out.format("namespace Pacioli\n\n");
        out.format(PRIMITIVES);
    }

    private static String PRIMITIVES = """

            -- START GENERATED CODE

            -- Preliminary definitions

            -- Lean representation of Pacioli's matrix type
            abbrev Mat (m n : Nat) :=
                -- (EuclideanSpace ℝ (Fin n)) →L[ℝ] (EuclideanSpace ℝ (Fin m))
                (EuclideanSpace ℝ (Fin n)) →ₗ[ℝ] (EuclideanSpace ℝ (Fin m))

            noncomputable def as_scalar (x : (Mat 1 1)) := x (EuclideanSpace.single 0 1) 0

            -- Constructor for coordinates. Used by generated code.
            def coord (n : Nat) (i : Fin n) : Fin n := i

            -- Begin primitives

            def _base_matrix_sum {m n : Nat} := fun (args : (Mat m n) × (Mat m n)) =>
                let (x, y) := args
                x + y

            def _base_matrix_minus {m n : Nat} := fun (args : (Mat m n) × (Mat m n)) =>
                let (x, y) := args
                x - y

            def _base_matrix_mmult {m k n : Nat} := fun (args : (Mat m k) × (Mat k n)) =>
                let (x, y) := args
                x.comp y

            def _base_matrix_multiply {m n : Nat} := fun (args : (Mat m n) × (Mat m n)) =>
                let (x, y) := args
                x + y

            noncomputable def _base_matrix_scale {m n : Nat} (args : (Mat 1 1) × (Mat m n)): (Mat m n) :=
                let (x, y) := args
                (as_scalar x) • y

            noncomputable def _base_matrix_scale_down {m n : Nat} (args : (Mat m n) × (Mat 1 1)): (Mat m n) :=
                let (x, y) := args
                (1/(as_scalar y)) • x

            noncomputable def _base_matrix_neg {m n : Nat} (args : (Mat m n)): (Mat m n) :=
                let (x) := args
                _base_matrix_scale (-1, x)

            def _base_matrix_sqrt {m n : Nat} (args : (Mat m n)) : (Mat m n) :=
                let (x) := args
                x

            noncomputable def _base_matrix_transpose {m n : Nat} (args : (Mat m n)) : (Mat n m) :=
                let (x) := args
                x.adjoint

            def _base_matrix_make_matrix (triples : List ((Fin m) × (Fin n) × (Mat 1 1))) : (Mat m n) :=
                sorry

            def _base_base_tuple {a : Type} (x : a) : a := x

            -- def _base_base_apply (f : a -> b) (x : a): b := f x

            def _base_base_apply {a b : Type} (args : (a -> b) × a): b :=
                let (f, x) := args
                f x

            def _base_matrix_get (args : (Mat m n) × (Fin m) × (Fin n)): Mat 1 1 :=
                let (A, i, j) := args
                Matrix.of (fun _ _ => (A i j))

            -- End primitives

            -- Temprary overwrites to fix shortcomings of the current translation from Pacioli to Lean

            def _base_matrix__  := -- TODO: expression
                coord 1 0

            noncomputable def _standard_matrix_inner {m : Nat} (args : (Mat m 1) × (Mat m 1)) : (Mat 1 1) :=
                let ( lcl_x, lcl_y ) := args
                _base_matrix_mmult (_base_matrix_transpose (lcl_x), lcl_y)

            noncomputable def _standard_matrix_norm {m : Nat} := fun args : (Mat m 1) =>
                let ( lcl_x ) := args
                _base_matrix_sqrt (_standard_matrix_inner (lcl_x, lcl_x))

            -- END GENERATED CODE
                                                                            """;;

    @Override
    public void visit(ValueInfo info) {
        assert (info.definition().isPresent());

        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling value %s", info.globalName());
        }

        ValueDefinition definition = info.definition().get();
        ExpressionNode transformedBody = definition.body;

        if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            out.newline();
            out.format("def %s := fun args => \n  let ( %s ) := args\n", info.globalName(), argsString(code, "lcl_"));
            out.format("  ");
            code.expression.compileToLean(out, settings);
            out.format("  \n");
        } else {
            out.newline();
            out.format("def %s : Real := -- TODO: expression\n", info.globalName());
            out.format("  ");
            transformedBody.compileToJS(out, settings);
            out.format("\n");
        }
    }

    private static String argsString(LambdaNode node, String prefix) {
        if (node.varArgs) {
            if (node.arguments.size() == 1) {
                return prefix + node.arguments.get(0);
            } else {
                throw new PacioliException(node.location(), "Varargs lambda must have 1 argument");
            }
        }
        List<String> args = new ArrayList<String>();
        for (String arg : node.arguments) {
            args.add(prefix + arg);
        }
        return String.join(", ", args);
    }

    @Override
    public void visit(IndexSetInfo info) {
        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling index set %s", info.globalName());
        }

        assert (info.definition().isPresent());
        out.format("-- TODO: index set %s\n", info.globalName());
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

        Optional<UnitDefinition> optionalDefinition = info.definition();

        if (optionalDefinition.isPresent()) {
            Optional<UnitNode> optionalBody = optionalDefinition.get().body;
            if (optionalBody.isPresent()) {
                UnitNode body = optionalBody.get();
                DimensionedNumber<ScalarBase> number = body.evalUnit();
                out.format("-- TODO: scalar unit %s = %s %s\n", info.globalName(), number.factor(),
                        MatrixBase.compileUnitToJS(number.unit()));
            } else {
                out.format("-- TODO: scalar unit %s with no body\n", info.globalName());
            }
        } else {
            throw new RuntimeException("ScalarUnitInfo misses definition");
        }
    }

    @Override
    public void visit(VectorBaseInfo info) {
        assert (info.definition().isPresent());

        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling vector unit %s", info.globalName());
        }

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
