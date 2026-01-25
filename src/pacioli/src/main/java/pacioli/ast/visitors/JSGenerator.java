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

import pacioli.ast.Node;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.ForNode;
import pacioli.ast.expression.ForTupleNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.ListLiteralNode;
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
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.PacioliException;
import pacioli.compiler.Printer;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.matrix.MatrixType;

public class JSGenerator extends PrintVisitor implements CodeGenerator {

    CompilationSettings settings;

    public JSGenerator(Printer printWriter, CompilationSettings settings) {
        super(printWriter);
        this.settings = settings;
    }

    // Visitors

    @Override
    public void visit(ApplicationNode node) {

        mark();

        if (node.function instanceof IdentifierNode funId && funId.isGlobal()) {
            out.format("Pacioli.%s", funId.info().globalName());
        } else {
            out.print("(");
            node.function.accept(this);
            out.print(")");
        }

        out.write("(");
        newlineUp();
        Boolean sep = false;
        for (Node arg : node.arguments) {
            if (sep) {
                out.write(", ");
                newline();
            } else {
                sep = true;
            }
            arg.accept(this);
        }
        out.write(")");
        unmark();
    }

    // private String escapeString(String in) {
    // // Quick fix for the debug option for string literals
    // return in.replaceAll("\"", "\\\\\"");
    // }
    public static String escapeString(String in) {
        // Quick fix for the debug option for string literals
        // return in.replaceAll("\"", "\\\\\"");

        return in.replace("\\", "\\\\")
                .replace("\t", "\\t")
                .replace("\b", "\\b")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\f", "\\f")
                // .replace("\'", "\\'")
                .replace("\"", "\\\"");
    }

    @Override
    public void visit(AssignmentNode node) {
        out.print("lcl_" + node.var.name());
        out.print(" = ");
        node.value.accept(this);
        out.print(";");
    }

    @Override
    public void visit(BranchNode node) {
        out.write("(");
        node.test.accept(this);
        out.write(" ? ");
        node.positive.accept(this);
        out.write(" : ");
        node.negative.accept(this);
        out.write(" )");
    }

    @Override
    public void visit(ConstNode node) {
        String value = node.valueString();
        if (value.equals("true") || value.equals("false")) {
            out.format("%s", value);
        } else {
            out.format("Pacioli.initialNumbers(1, 1, [[0, 0, %s]])", value);
        }
    }

    @Override
    public void visit(ConversionNode node) {
        // TODO: should this type be reduced?
        out.format("Pacioli.conversionNumbers(%s)", node.typeNode.evalType().compileToJS());
    }

    @Override
    public void visit(IdentifierNode node) {
        ValueInfo info = node.info();

        String full = info.isGlobal()
                ? "Pacioli.fetchValue('" + info.generalInfo().module() + "', '" + node.name() + "')"
                : "lcl_" + node.name();

        if (node.info().isRef() && false) {
            out.format("Pacioli.%s(%s)", ValueInfo.global("$base_base", "_ref_get"), full);
        } else {
            out.format("%s", full);
        }
    }

    @Override
    public void visit(IfStatementNode node) {
        mark();
        out.write("if (");
        node.test.accept(this);
        out.write(") {");
        newlineUp();
        node.positive.accept(this);
        newlineDown();
        out.write("} else {");
        newlineUp();
        node.negative.accept(this);
        newlineDown();
        out.write("}");
        newline();
        unmark();
    }

    @Override
    public void visit(KeyNode node) {
        StringBuilder builder = new StringBuilder();

        builder.append("Pacioli.createCoordinates([");

        for (int i = 0; i < node.keys.size(); i++) {
            if (0 < i) {
                builder.append(",");
            }
            builder.append("['");
            builder.append(node.keys.get(i).name());
            builder.append("','");
            builder.append(node.getInfo(i).globalName());
            builder.append("']");
        }

        builder.append("])");

        out.print(builder.toString());
    }

    @Override
    public void visit(LambdaNode node) {
        List<String> quoted = new ArrayList<String>();
        if (node.varArgs) {
            if (node.arguments.size() == 1) {
                quoted.add("...lcl_" + node.arguments.get(0) + "");
            } else {
                throw new PacioliException(node.location(), "Varargs lambda must have 1 argument");
            }
        } else {
            for (String arg : node.arguments) {
                quoted.add("lcl_" + arg + "");
            }
        }
        String args = String.join(", ", quoted);
        write("function (");
        write(args);
        write(") { return ");
        node.expression.accept(this);
        write(";");
        write("}");
    }

    @Override
    public void visit(MatrixLiteralNode node) {

        // assert(node.values.size() > 0);

        // see mvm generator!!!
        StringBuilder builder = new StringBuilder();
        String sep = "";

        for (MatrixLiteralNode.PositionedValueDecl decl : node.positionedValueDecls()) {
            builder.append(sep);
            builder.append("[");
            builder.append(decl.row);
            builder.append(",");
            builder.append(decl.column);
            builder.append(",");
            builder.append(decl.valueDecl.value);
            builder.append("]");
            sep = ",";
        }
        out.format("Pacioli.initialNumbers(%s, %s, [%s])",
                node.rowDim.size(), node.columnDim.size(),
                builder.toString());
    }

    @Override
    public void visit(MatrixTypeNode node) {

        MatrixType type;
        try {
            // TODO: should this type be reduced?
            type = node.evalType();
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }

        out.print("Pacioli.oneNumbersFromShape(" + type.compileToJS() + ")");
    }

    @Override
    public void visit(ProjectionNode node) {
        assert (node.type != null);
        write("Pacioli.projectNumbers(");
        node.body.accept(this);
        write(", ");
        out.format("%s.param", node.type.compileToJS());
        write(", ");
        out.format("[%s]", node.numString());
        write(")");
    }

    @Override
    public void visit(ReturnNode node) {
        write("return ");
        node.value.accept(this);
        write(";");
        newline();
    }

    @Override
    public void visit(ReturnVoidNode node) {
        write("return;");
    }

    @Override
    public void visit(SequenceNode node) {

        Integer n = node.items.size();

        for (int i = 0; i < n; i++) {
            node.items.get(i).accept(this);
            newline();

        }
    }

    @Override
    public void visit(StatementNode node) {

        mark();

        // Find all assigned variables
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

        // A lambda to bind the shadowed variables
        write("((");
        write(String.join(", ", shadowed));
        write(") => {");
        newline();

        for (String id : nonShadowed) {
            write("let " + id);
            write(";");
            newline();
        }

        // The body
        node.body.accept(this);
        newline();

        // Close the lambda application
        write("})(");
        write(String.join(", ", shadowed));
        write(")");

        unmark();
    }

    @Override
    public void visit(StringNode node) {
        StringWriter writer = new StringWriter();
        writer.write("\"");
        writer.write(escapeString(node.valueString()));
        writer.write("\"");
        out.print(writer.toString());
    }

    @Override
    public void visit(TupleAssignmentNode node) {

        final List<String> names = new ArrayList<String>();
        for (IdentifierNode id : node.vars) {
            names.add("lcl_" + id.name());
        }

        write("[");
        write(String.join(",", names));
        write("] = ");
        node.tuple.accept(this);
        write(";");
        newline();
    }

    @Override
    public void visit(WhileNode node) {
        mark();
        format("while (");
        node.test.accept(this);
        write(") {");
        newlineUp();
        node.body.accept(this);
        newlineDown();
        write("}");
        newline();
        unmark();
    }

    @Override
    public void visit(ForNode node) {

        mark();
        write("for (let ");
        write("lcl_" + node.var.name());
        write(" of ");
        node.items.accept(this);
        write(") {");
        newlineUp();
        node.body.accept(this);
        newlineDown();
        write("}");
        unmark();

    }

    @Override
    public void visit(ForTupleNode node) {

        final List<String> names = new ArrayList<String>();
        for (IdentifierNode id : node.vars) {
            names.add("lcl_" + id.name());
        }

        mark();
        write("for(const [");
        write(String.join(",", names));
        write("] of ");
        node.items.accept(this);
        write(") {");
        newlineUp();
        node.body.accept(this);
        newlineDown();
        write("}");
        unmark();
    }

    @Override
    public void visit(LetNode node) {
        node.asApplication().accept(this);
    }

    @Override
    public void visit(ListLiteralNode node) {
        out.write("[");
        Boolean sep = false;
        for (Node arg : node.elements) {
            if (sep) {
                out.write(", ");
                newline();
            } else {
                sep = true;
            }
            arg.accept(this);
        }
        out.write("]");
    }
}
