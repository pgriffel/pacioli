/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
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

package pacioli.ast.visitors;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import pacioli.ast.Node;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.ForNode;
import pacioli.ast.expression.ForTupleNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.ListLiteralNode;
import pacioli.ast.expression.SetLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.ReturnVoidNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.ast.sugar.ComprehensionNode;
import pacioli.ast.sugar.ComprehensionNode.AssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.FilterClause;
import pacioli.ast.sugar.ComprehensionNode.GeneratorClause;
import pacioli.ast.sugar.ComprehensionNode.TupleAssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.TupleGeneratorClause;
import pacioli.ast.sugar.LetTupleBindingNode;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.CompilationSettings.Target;
import pacioli.compiler.PacioliException;
import pacioli.compiler.Printer;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.TypeApplicationNode;

public class LeanGenerator extends PrintVisitor implements CodeGenerator {

    CompilationSettings settings;

    /**
     * The LEANER target instead of the LEAN target. No desugaring and lean
     * operators if applicable.
     */
    private boolean longNames;
    private boolean desugared;
    private boolean preferNative;
    private boolean noncomputable;

    String prefix = "";
    // private String prefix = "lcl_";

    public LeanGenerator(Printer printWriter, CompilationSettings settings) {
        super(printWriter);

        this.settings = settings;

        Target target = settings.target();

        this.longNames = target.equals(Target.LEAN);
        this.desugared = target.equals(Target.LEAN);
        this.preferNative = !target.equals(Target.LEAN);
        this.noncomputable = target.equals(Target.LEANEST);
    }

    protected void writeTodo(String feature) {
        out.write("-- TODO: ");
        out.write(feature);
    }

    @Override
    public void visit(IndexSetDefinition node) {

        if (!node.isDynamic()) {
            out.format("def %s := %s", node.name(), node.items().size());
        } else {
            out.format("def %s := length %s -- TODO: proper Lean length function",
                    node.name(),
                    node.body().asLean(settings));
        }

        out.newline();
    }

    @Override
    public void visit(ValueDefinition node) {

        // This info should always be present, even if leaner is true. We always
        // get called with an analyzed (resolved, desugared, etc.) definition.
        // In the leaner case we recurse here on the ast instead of the body. This
        // means the rest of the code cannot assume that infos are present in the
        // leaner case.
        ValueInfo info = node.getInfo();

        if (this.noncomputable) {
            write("noncomputable def ");
        } else {
            write("def ");
        }

        node.id.accept(this);

        write(" ");

        // The type schema prints the ':'
        write(info.inferredType().get().printAsLean());

        write(" := ");

        out.newlineUp();

        // Recurse on the AST for the leaner case, recurse on the desugared and resolved
        // body otherwise
        if (this.desugared || node.body instanceof MatrixLiteralNode) {
            node.body.lower().accept(this);
        } else {
            node.body.accept(this);
        }

        out.newlineDown();
    }

    @Override
    public void visit(ApplicationNode node) {
        if (this.preferNative) {
            String fun = node.function.asLean(settings);
            switch (fun) {
                case "mmult": {
                    writeSeparated(node.arguments, " * ");
                    break;
                }
                case "sum": {
                    writeSeparated(node.arguments, " + ");
                    break;
                }
                case "minus": {
                    writeSeparated(node.arguments, " - ");
                    break;
                }
                case "multiply": {
                    writeSeparated(node.arguments, " ⊙ ");
                    break;
                }
                case "equal": {
                    writeSeparated(node.arguments, " = ");
                    break;
                }
                // case "norm": {
                // write("‖");
                // writeSeparated(node.arguments, "");
                // write("‖");
                // break;
                // }
                default: {
                    this.printApplication(node);
                }
            }
        } else {
            this.printApplication(node);
        }
    }

    private void printApplication(ApplicationNode node) {
        mark();

        if (node.function instanceof IdentifierNode funId) {
            out.format("%s", this.longNames ? funId.info().globalName() : funId.name());
        } else {
            out.print("(");
            node.function.accept(this);
            out.print(")");
        }

        out.write(" (");
        Boolean sep = false;
        boolean allIdents = true;
        for (Node arg : node.arguments) {
            if (!(arg instanceof IdentifierNode || arg instanceof KeyNode || arg instanceof ConstNode)) {
                allIdents = false;
            }
        }
        boolean wrap = !allIdents && node.arguments.size() > 1;
        for (Node arg : node.arguments) {
            if (sep) {
                out.write(", ");
                if (wrap) {
                    out.newline();
                }
            } else {
                if (wrap) {
                    out.newlineUp();
                }
                sep = true;
            }
            arg.accept(this);
        }
        out.write(")");
        unmark();
    }

    @Override
    public void visit(BranchNode node) {
        out.write("if ");
        node.test.accept(this);
        out.write(" then ");
        node.positive.accept(this);
        out.write(" else ");
        node.negative.accept(this);
    }

    @Override
    public void visit(ConstNode node) {
        String value = node.valueString();
        if (value.equals("true") || value.equals("false")) {
            out.format("%s", value);
        } else {
            out.format("%s", value);
        }
    }

    @Override
    public void visit(ConversionNode node) {
        out.format("-- TODO: conversion %s", node.typeNode.evalType().compileToJS());
    }

    @Override
    public void visit(IdentifierNode node) {
        if (longNames) {
            String full = node.info().isGlobal()
                    ? node.info().globalName()// "Pacioli." + node.name()
                    : this.prefix + node.name();
            out.format("%s", full);
        } else {
            String name = node.name();
            write(name.equals("_") ? "_one_" : name);
        }
    }

    @Override
    public void visit(IfStatementNode node) {
        out.write("-- TODO: IfStatementNode node");
    }

    @Override
    public void visit(KeyNode node) {
        out.format("(coord %s %s)", node.size(), node.position());
    }

    @Override
    public void visit(LambdaNode node) {
        mark();
        if (!longNames) {

            String args;

            if (node.varArgs) {
                if (node.arguments.size() == 1) {
                    args = node.arguments.get(0);
                } else {
                    throw new PacioliException(node.location(), "Varargs lambda must have 1 argument");
                }
                // throw new PacioliException("Var args are not implemented for Lean");
            } else {
                args = "(" + String.join(", ", node.arguments) + ")";
            }

            // mark();
            write("fun args =>");
            newlineUp();
            write("let ");
            out.write(args);
            out.write(" := args; ");
            newline();
            node.expression.accept(this);
            // newlineDown();
            // unmark();
        } else {

            List<String> quoted = new ArrayList<String>();
            if (node.varArgs) {
                if (node.arguments.size() == 1) {
                    quoted.add("..." + this.prefix + node.arguments.get(0));
                } else {
                    throw new PacioliException(node.location(), "Varargs lambda must have 1 argument");
                }
            } else {
                for (String arg : node.arguments) {
                    quoted.add(this.prefix + arg);
                }
            }
            String args = String.join(", ", quoted);
            write("fun args => ");
            out.newlineUp();
            write("let (" + args + ") := args; ");
            out.newline();
            node.expression.accept(this);
        }
        unmark();
    }

    @Override
    public void visit(LetNode node) {
        write("let ");
        if (node.binding instanceof LetBindingNode binding) {
            write(this.prefix + binding.var);
            write(" := ");
            binding.value.accept(this);
        } else {
            node.binding.accept(this);
        }
        write("; ");
        out.newline();
        node.body.accept(this);
    }

    @Override
    public void visit(LetTupleBindingNode node) {
        write("(");
        Boolean first = true;
        for (IdentifierNode var : node.vars) {
            if (!first)
                write(",");
            first = false;
            out.write(var.name());
        }
        write(") := ");
        node.value.accept(this);
    }

    @Override
    public void visit(MatrixLiteralNode node) {
        out.write("make_matrix [");
        boolean first = true;
        for (MatrixLiteralNode.PositionedValueDecl decl : node.positionedValueDecls()) {
            if (!first) {
                out.write(", ");
            }
            first = false;
            out.write("(");
            out.write("⟨");
            out.write(Integer.toString(decl.row));
            out.write(", by decide⟩");
            out.write(", ");
            out.write("⟨");
            out.write(Integer.toString(decl.column));
            out.write(", by decide⟩");
            out.write(", ");
            out.write(decl.valueDecl.value);
            out.write(")");
        }
        out.write("]");
    }

    @Override
    public void visit(MatrixTypeNode node) {
        out.format("-- TODO: matrix type %s", node.evalType().compileToJS());
    }

    @Override
    public void visit(ProjectionNode node) {
        out.write("-- TODO: projection");
    }

    @Override
    public void visit(ReturnNode node) {
        out.write("return ");
        node.value.accept(this);
    }

    @Override
    public void visit(ReturnVoidNode node) {
        out.write("return ()");
    }

    @Override
    public void visit(SequenceNode node) {
        for (Node item : node.items) {
            item.accept(this);
            newline();
        }
    }

    @Override
    public void visit(StatementNode node) {

        mark();
        Set<String> assignedVariables = new HashSet<>();
        for (IdentifierNode id : node.body.locallyAssignedVariables()) {
            assignedVariables.add(id.name());
        }

        List<String> shadowed = new ArrayList<>();
        List<String> nonShadowed = new ArrayList<>();

        for (String id : assignedVariables) {
            if (node.shadowed.contains(id)) {
                shadowed.add(this.prefix + id);
            } else {
                nonShadowed.add(prefix + id);
            }
        }

        write("(fun ");
        write(String.join(" ", shadowed));
        write(" => ");
        newlineUp();
        write("Id.run do");
        newline();

        for (String id : nonShadowed) {
            write("let mut " + id + " := default");
            newline();
        }

        for (String id : shadowed) {
            write("let mut " + id + " := " + id);
            newline();
        }

        node.body.accept(this);
        newline();

        // Close the lambda application
        write(") (");
        write(String.join(", ", shadowed));
        write(")");

        unmark();
    }

    @Override
    public void visit(StringNode node) {
        StringWriter writer = new StringWriter();
        writer.write('"');
        writer.write(node.valueString().replace("\\", "\\\\").replace("\n", "\\n").replace("\"", "\\\""));
        writer.write('"');
        out.print(writer.toString());
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        final List<String> names = new ArrayList<String>();
        for (IdentifierNode id : node.vars) {
            names.add(this.prefix + id.name());
        }

        write("(");
        write(String.join(", ", names));
        write(") := ");
        node.tuple.accept(this);
    }

    @Override
    public void visit(WhileNode node) {
        mark();
        format("while ");
        node.test.accept(this);
        write(" do");
        newlineUp();
        node.body.accept(this);
        newlineDown();
        newline();
        unmark();
    }

    @Override
    public void visit(ForNode node) {
        mark();
        out.write("List.map (fun ");
        out.write(prefix + node.var.name());
        out.write(" => ");
        node.body.accept(this);
        out.write(") ");
        node.items.accept(this);
        unmark();
    }

    @Override
    public void visit(ForTupleNode node) {
        mark();
        out.write("TODO: AI crap. List.map (fun x => ");
        out.write("let (");
        for (int i = 0; i < node.vars.size(); i++) {
            if (i > 0) {
                out.write(", ");
            }
            out.write(node.vars.get(i).name());
        }
        out.write(") := x; ");
        node.body.accept(this);
        out.write(") ");
        node.items.accept(this);
        unmark();
    }

    // @Override
    // public void visit(LetNode node) {
    // node.asApplication().accept(this);
    // }

    @Override
    public void visit(ListLiteralNode node) {
        out.write("[");
        Boolean sep = false;
        for (Node arg : node.elements) {
            if (sep) {
                out.write(", ");
            } else {
                sep = true;
            }
            arg.accept(this);
        }
        out.write("]");
    }

    @Override
    public void visit(SetLiteralNode node) {
        out.write("{");
        boolean first = true;
        for (Node arg : node.elements) {
            if (!first) {
                out.write(", ");
            }
            first = false;
            arg.accept(this);
        }
        out.write("}");
    }

    @Override
    public void visit(FunctionTypeNode node) {

        if (node.domain instanceof TypeApplicationNode app && app.op.name().equals("Tuple")) {
            out.write("(");
            out.writeCommaSeparated(app.args, this);
            out.write(app.args.stream()
                    .map(x -> x.asLean(settings))
                    .collect(Collectors.joining(" x ")));
            out.write(")");
        } else {
            node.domain.accept(this);
        }
        write(" -> ");
        node.range.accept(this);
    }

    @Override
    public void visit(ComprehensionNode node) {
        write("[ ");
        node.expression.accept(this);
        write(" | ");
        writeSeparated(node.clauses, ", ");
        write(" ]");
    }

    @Override
    public void visit(GeneratorClause node) {
        write("for ");
        node.id.accept(this);
        write(" in ");
        node.expression.accept(this);
    }

    @Override
    public void visit(FilterClause node) {
        write("if ");
        node.expression.accept(this);
    }

    @Override
    public void visit(TupleGeneratorClause node) {
        write("for (");
        out.write(String.join(", ", node.varNames()));
        write(") in ");
        node.expression.accept(this);
    }

    @Override
    public void visit(AssignmentClause node) {
        write("let ");
        node.id.accept(this);
        write(" := ");
        node.value.accept(this);
    }

    @Override
    public void visit(TupleAssignmentClause node) {
        out.write("let (");
        out.write(String.join(", ", node.varNames()));
        out.write(") := ");
        node.value.accept(this);
    }
}
