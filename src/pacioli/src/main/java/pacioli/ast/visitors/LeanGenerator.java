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
    private boolean leaner;

    public LeanGenerator(Printer printWriter, CompilationSettings settings) {
        super(printWriter);
        this.settings = settings;
        this.leaner = settings.target().equals(Target.LEANER);
    }

    protected void writeTodo(String feature) {
        out.write("-- TODO: ");
        out.write(feature);
    }

    @Override
    public void visit(IndexSetDefinition node) {
        writeTodo("index set definition");
    }

    @Override
    public void visit(ValueDefinition node) {

        // This info should always be present, even if leaner is true. We always
        // get called with an analyzed (resolved, desugared, etc.) definition.
        // In the leaner case we recurse here on the ast instead of the body. This
        // means the rest of the code cannot assume that infos are present in the
        // leaner case.
        ValueInfo info = (ValueInfo) node.getInfo().orElseThrow();

        write("noncomputable def ");

        node.id.accept(this);

        // The type schema prints the ':'
        write(info.inferredType().get().printAsLean());

        write(" := ");

        out.newlineUp();

        // Recurse on the AST for the leaner case, recurse on the desugared and resolved
        // body otherwise
        if (this.leaner) {
            node.ast.accept(this);
        } else {
            node.body.accept(this);
        }

        out.newlineDown();
    }

    @Override
    public void visit(ApplicationNode node) {
        if (this.leaner) {
            String fun = node.function.asLeaner(settings);
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
            out.format("%s", this.leaner ? funId.name() : funId.info().globalName());
        } else {
            out.print("(");
            node.function.accept(this);
            out.print(")");
        }

        out.write(" (");
        Boolean sep = false;
        boolean allIdents = true;
        for (Node arg : node.arguments) {
            if (!(arg instanceof IdentifierNode || arg instanceof KeyNode)) {
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
            out.format("(%s : Real)", value);
        }
    }

    @Override
    public void visit(ConversionNode node) {
        out.format("-- TODO: conversion %s", node.typeNode.evalType().compileToJS());
    }

    @Override
    public void visit(IdentifierNode node) {
        if (leaner) {
            String name = node.name();
            write(name.equals("_") ? "_one_" : name);
        } else {
            String full = node.info().isGlobal()
                    ? node.info().globalName()// "Pacioli." + node.name()
                    : "lcl_" + node.name();
            out.format("%s", full);
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
        if (leaner) {
            if (node.varArgs) {
                throw new PacioliException("Var args are not implemented for Lean");
            }

            // mark();
            write("fun args =>");
            newlineUp();
            write("let (");
            out.write(String.join(", ", node.arguments));
            out.write(") := args; ");
            newline();
            node.expression.accept(this);
            newlineDown();
            // unmark();
        } else {

            List<String> quoted = new ArrayList<String>();
            if (node.varArgs) {
                if (node.arguments.size() == 1) {
                    quoted.add("...lcl_" + node.arguments.get(0));
                } else {
                    throw new PacioliException(node.location(), "Varargs lambda must have 1 argument");
                }
            } else {
                for (String arg : node.arguments) {
                    quoted.add("lcl_" + arg);
                }
            }
            String args = String.join(", ", quoted);
            write("fun args => let (" + args + ") := args; ");
            out.newline();
            node.expression.accept(this);
        }
    }

    @Override
    public void visit(LetNode node) {
        write("let ");
        if (node.binding instanceof LetBindingNode binding) {
            write(binding.var);
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
        out.write("-- TODO: matrix literal");
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
                shadowed.add("lcl_" + id);
            } else {
                nonShadowed.add("lcl_" + id);
            }
        }

        write("(fun ");
        write(String.join(" ", shadowed));
        write(" => ");
        newline();

        for (String id : nonShadowed) {
            write("let " + id + " := _\n");
        }

        node.body.accept(this);
        newline();

        write("");
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
            names.add("lcl_" + id.name());
        }

        write("(");
        write(String.join(", ", names));
        write(") := ");
        node.tuple.accept(this);
    }

    @Override
    public void visit(WhileNode node) {
        out.write("while ");
        node.test.accept(this);
        out.write(" do ");
        node.body.accept(this);
    }

    @Override
    public void visit(ForNode node) {
        out.write("-- TODO: for node");
    }

    @Override
    public void visit(ForTupleNode node) {
        out.write("-- TODO: for-tuple node");
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
        out.write("-- TODO: set literal");
    }

    @Override
    public void visit(FunctionTypeNode node) {

        if (node.domain instanceof TypeApplicationNode app && app.op.name().equals("Tuple")) {
            out.write("(");
            out.writeCommaSeparated(app.args, this);
            out.write(app.args.stream()
                    .map(x -> this.leaner ? x.asLean(settings) : x.asLeaner(settings))
                    .collect(Collectors.joining(" x ")));
            out.write(")");
        } else {
            node.domain.accept(this);
        }
        write(" -> ");
        node.range.accept(this);
    }
}
