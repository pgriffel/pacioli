package pacioli.ast.visitors;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import pacioli.ast.Node;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.PacioliException;
import pacioli.compiler.Printer;
import pacioli.compiler.Utils;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.matrix.MatrixType;

public class JSGenerator extends PrintVisitor implements CodeGenerator {

    // Members
    CompilationSettings settings;
    Boolean boxed;

    // Constructor
    public JSGenerator(Printer printWriter, CompilationSettings settings, boolean boxed) {
        super(printWriter);
        this.settings = settings;
        this.boxed = boxed;
    }

    // Visitors

    @Override
    public void visit(ApplicationNode node) {
        // if (settings.debug() && node.function instanceof IdentifierNode) {
        mark();
        if (false && node.function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) node.function;
            String stackText = id.name();
            String fullText = node.location().description();
            boolean traceOn = settings.isTracing(id.name());
            out.format("application_debug(\"%s\", \"%s\", \"%s\", ", escapeString(stackText), escapeString(fullText),
                    traceOn);
            id.accept(this);
            // boolean traceOn = settings.trace(id.fullName());
            // out.format("application_debug(\"%s\", \"%s\", \"%s\", %s%s)",
            // escapeString(stackText), escapeString(fullText), traceOn, code, args);
        } else {

            if (node.function instanceof IdentifierNode && ((IdentifierNode) node.function).isGlobal()) {
                String fullName = ((IdentifierNode) node.function).info().globalName();
                if (!boxed ||
                        fullName.equals(ValueInfo.global("base_base", "empty_list")) ||
                        fullName.equals(ValueInfo.global("base_base", "loop_list")) ||
                        fullName.equals(ValueInfo.global("base_base", "fold_list")) ||
                        fullName.equals(ValueInfo.global("base_base", "cons")) ||
                        fullName.equals(ValueInfo.global("base_base", "zip")) ||
                        fullName.equals(ValueInfo.global("base_base", "tail")) ||
                        fullName.equals(ValueInfo.global("base_base", "head")) ||
                        fullName.equals(ValueInfo.global("base_base", "_add_mut")) ||
                        fullName.equals(ValueInfo.global("base_base", "append")) ||
                        fullName.equals(ValueInfo.global("base_base", "reverse")) ||
                        fullName.equals(ValueInfo.global("base_base", "tuple")) ||
                        fullName.equals(ValueInfo.global("base_base", "new_ref")) ||
                        fullName.equals(ValueInfo.global("base_base", "empty_ref")) ||
                        fullName.equals(ValueInfo.global("base_base", "throw_result")) ||
                        fullName.equals(ValueInfo.global("base_base", "catch_result")) ||
                        fullName.equals(ValueInfo.global("base_base", "seq")) ||
                        fullName.equals(ValueInfo.global("base_base", "ref_set")) ||
                        fullName.equals(ValueInfo.global("base_base", "ref_get")) ||
                        fullName.equals(ValueInfo.global("base_base", "while_function")) ||
                        fullName.equals(ValueInfo.global("base_base", "apply"))) {
                    out.format("Pacioli.%s", fullName);
                } else {
                    out.format("Pacioli.b_%s", fullName);
                }
            } else {
                out.print("(");
                node.function.accept(this);
                out.print(")");
            }
            out.write("(");
        }
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
    private String escapeString(String in) {
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
        out.format("Pacioli.%s(", ValueInfo.global("lib_base_base", "_ref_set"));
        out.print("lcl_" + node.var.name());
        out.print(", ");
        node.value.accept(this);
        out.print(")");
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
            if (boxed) {
                out.format("Pacioli.num(%s)", value);
            } else {
                out.format("Pacioli.initialNumbers(1, 1, [[0, 0, %s]])", value);
            }
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
        // String prefix = settings.debug() && node.debugable() ? "debug_" : "global_";
        String fun = boxed ? "bfetchValue" : "fetchValue";
        String full = info.isGlobal()
                ? "Pacioli." + fun + "('" + info.generalInfo().module() + "', '" + node.name() + "')"
                : "lcl_" + node.name();

        if (node.info().isRef()) {
            out.format("Pacioli.%s(%s)", ValueInfo.global("lib_base_base", "_ref_get"), full);
        } else {
            out.format("%s", full);
        }
    }

    @Override
    public void visit(IfStatementNode node) {
        out.write("(");
        node.test.accept(this);
        out.write(" ? ");
        node.positive.accept(this);
        out.write(" : ");
        node.negative.accept(this);
        out.write(" )");
    }

    @Override
    public void visit(KeyNode node) {
        StringBuilder builder = new StringBuilder();
        builder.append("Pacioli.createCoordinates([");
        for (int i = 0; i < node.keys.size(); i++) {
            if (0 < i)
                builder.append(",");
            builder.append("['");
            builder.append(node.keys.get(i));
            builder.append("','");
            // builder.append(node.info.get(i).definition.globalName());
            builder.append(node.getInfo(i).globalName());
            builder.append("']");
        }
        builder.append("])");
        out.print(builder.toString());
    }

    @Override
    public void visit(LambdaNode node) {
        List<String> quoted = new ArrayList<String>();
        for (String arg : node.arguments) {
            quoted.add("lcl_" + arg + "");
        }
        String args = Utils.intercalate(", ", quoted);
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
        // for (int i = 0; i < node.values.size(); i++) {
        for (MatrixLiteralNode.PositionedValueDecl decl : node.positionedValueDecls()) {
            builder.append(sep);
            builder.append("[");
            builder.append(decl.row);
            // builder.append(node.rowIndices.get(i));
            builder.append(",");
            builder.append(decl.column);
            // builder.append(node.columnIndices.get(i));
            builder.append(",");
            builder.append(decl.valueDecl.value);
            // builder.append(node.values.get(i));
            builder.append("]");
            sep = ",";
        }
        if (boxed) {
            // TODO: should this type be reduced?
            out.print(
                    "Pacioli.initialMatrix(" + node.typeNode.evalType().compileToJS() + "," + builder.toString() + ")");
        } else {
            out.format("Pacioli.initialNumbers(%s, %s, [%s])",
                    node.rowDim.size(), node.columnDim.size(),
                    builder.toString());
        }
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

        if (boxed) {
            out.print("Pacioli.oneMatrix(" + type.compileToJS() + ")");

        } else {
            out.print("Pacioli.oneNumbersFromShape(" + type.compileToJS() + ")");

            // // Obsolete code
            // // throw new PacioliException(node.getLocation(), " huh %s", type.pretty());
            // out.print("Pacioli.oneNumbers(" + node.rowDim.size() + ", " +
            // node.columnDim.size() + ")");
        }
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
        format("Pacioli.%s(%s, ", ValueInfo.global("lib_base_base", "_throw_result"), node.resultInfo.name());
        node.value.accept(this);
        write(")");
    }

    @Override
    public void visit(SequenceNode node) {

        if (node.items.isEmpty()) {
            throw new RuntimeException("todo: MVM generator for empty sequence");
        } else {
            Integer n = node.items.size();
            mark();
            for (int i = 0; i < n - 1; i++) {
                format("Pacioli.%s(", ValueInfo.global("lib_base_base", "_seq"));
                newlineUp();
                node.items.get(i).accept(this);
                write(", ");
                newline();

            }
            node.items.get(n - 1).accept(this);
            for (int i = 0; i < n - 1; i++) {
                out.print(")");
            }
            unmark();
        }
    }

    @Override
    public void visit(StatementNode node) {

        mark();

        // Find all assigned variables
        Set<IdentifierNode> assignedVariables = node.body.locallyAssignedVariables();

        // A lambda to bind the result place and the assigned variables places
        write("function (");

        // Write the result lambda param
        write(node.resultInfo.name());

        // Write the other lambda params
        for (IdentifierNode id : assignedVariables) {
            write(", ");
            write("lcl_" + id.name());
        }
        write(") {");

        newlineUp();
        write("return ");

        // A catch to get the result
        format("Pacioli.%s(", ValueInfo.global("lib_base_base", "_catch_result"));

        newlineUp();

        // Catch expect a lambda
        write("function () {");

        newlineUp();
        write("return ");
        // The body
        node.body.accept(this);
        write("; } ,");

        newline();

        // Catch's second argument is the place name
        write(node.resultInfo.name());

        // Close the catch application
        write("); }( ");

        newlineDown();

        // The initial result place
        format("Pacioli.%s()", ValueInfo.global("lib_base_base", "_empty_ref"));

        for (IdentifierNode id : assignedVariables) {
            write(", ");

            if (node.shadowed.contains(id.name())) {
                if (node.shadowed.lookup(id.name()).isRef()) {
                    format("Pacioli.%s(Pacioli.%s(",
                            ValueInfo.global("lib_base_base", "_new_ref"),
                            ValueInfo.global("lib_base_base", "_ref_get"));
                    write("lcl_" + id.name());
                    // id.accept(this);
                    write("))");
                } else {
                    format("Pacioli.%s(", ValueInfo.global("lib_base_base", "_new_ref"));
                    write("lcl_" + id.name());
                    // id.accept(this);
                    write(")");
                }
            } else {
                format("Pacioli.%s()", ValueInfo.global("lib_base_base", "_empty_ref"));
            }
        }

        // Close the lambda application
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

        // Some tuple properties
        List<IdentifierNode> vars = node.vars;
        Integer size = vars.size();

        assert (0 < size); // het 'skip' statement als 0

        // Create a list of fresh names for the assigned names
        final List<String> names = new ArrayList<String>();
        for (IdentifierNode id : vars) {
            names.add(id.name());
        }
        final List<String> freshNames = SymbolTable.freshNames(names);

        // Create an application of apply to a lambda with two arguments:
        // the fresh names and the tuple. The freshnames get bound to the
        // tuple elements and are used in the lambda body to assign the
        // variables. The lambda body is a sequence of these assignments.
        mark();
        format("Pacioli.%s(function (", ValueInfo.global("lib_base_base", "apply"));

        // The lambda arguments
        Boolean first = true;
        for (String name : freshNames) {
            if (!first)
                out.print(", ");
            out.print(name);
            first = false;
        }
        out.print(") {");

        newlineUp();
        out.print("return ");

        // The sequence of assignments
        for (int i = 0; i < size; i++) {
            if (i < size - 1)
                format("Pacioli.%s(", ValueInfo.global("lib_base_base", "_seq"));
            format("Pacioli.%s(", ValueInfo.global("lib_base_base", "_ref_set"));
            write("lcl_" + names.get(i));
            write(", ");
            write(freshNames.get(i));
            write(")");
            if (i < size - 1)
                write(",");
            newline();
        }

        // Close the sequences
        for (int i = 0; i < size - 1; i++) {
            out.print(")");
        }

        write("; }, ");
        node.tuple.accept(this);

        // Close the apply
        write(")");

        unmark();

    }

    @Override
    public void visit(WhileNode node) {
        mark();
        format("Pacioli.%s(", ValueInfo.global("lib_base_base", "_while"));
        newlineUp();
        write("function () {");
        newlineUp();
        write("return ");
        node.test.accept(this);
        write(";} ,");
        newlineDown();
        write("function () {");
        newlineUp();
        write("return ");
        node.body.accept(this);
        write(";})");
        unmark();
    }

    @Override
    public void visit(LetNode node) {
        node.asApplication().accept(this);
    }
}
