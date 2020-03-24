package pacioli.visitors;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.PacioliException;
import pacioli.Printer;
import pacioli.Utils;
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
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.symboltable.ValueInfo;
import pacioli.types.TypeBase;
import pacioli.types.matrix.MatrixType;
import uom.Unit;

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
    
    // Unit compilation
    public static String compileUnitToJS(Unit<TypeBase> unit) {
        String product = "";
        int n = 0;
        for (TypeBase base : unit.bases()) {
            TypeBase typeBase = (TypeBase) base;
            String baseText = typeBase.compileToJS() + ".expt(" + unit.power(base) + ")";
            product = n == 0 ? baseText : baseText + ".mult(" + product + ")";
            n++;
        }
        if (n == 0) {
            return "Pacioli.ONE";
        } else {
            return product;
        }
    }
    
    // Visitors
 
    @Override
    public void visit(ApplicationNode node) {
        //if (settings.debug() && node.function instanceof IdentifierNode) {
        mark();
        if (false && node.function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) node.function;
            String stackText = id.getName();
            String fullText = node.getLocation().description();
            boolean traceOn = settings.isTracing(id.getName());
            out.format("application_debug(\"%s\", \"%s\", \"%s\", ", escapeString(stackText), escapeString(fullText),
                    traceOn);
            id.accept(this);
            // boolean traceOn = settings.trace(id.fullName());
            // out.format("application_debug(\"%s\", \"%s\", \"%s\", %s%s)",
            // escapeString(stackText), escapeString(fullText), traceOn, code, args);
        } else {
            
            if (node.function instanceof IdentifierNode && ((IdentifierNode)node.function).isGlobal()) {
                String fullName = ((IdentifierNode) node.function).getInfo().globalName();
                if (!boxed ||
                    fullName.equals(ValueInfo.global("base", "empty_list")) ||
                    fullName.equals(ValueInfo.global("base", "loop_list")) ||
                    fullName.equals(ValueInfo.global("base", "fold_list")) ||
                    fullName.equals(ValueInfo.global("base", "cons")) ||
                    fullName.equals(ValueInfo.global("base", "zip")) ||
                    fullName.equals(ValueInfo.global("base", "tail")) ||
                    fullName.equals(ValueInfo.global("base", "head")) ||
                    fullName.equals(ValueInfo.global("base", "add_mut")) ||
                    fullName.equals(ValueInfo.global("base", "append")) ||
                    fullName.equals(ValueInfo.global("base", "reverse")) ||
                    fullName.equals(ValueInfo.global("base", "tuple")) ||
                    fullName.equals(ValueInfo.global("base", "new_ref")) ||
                    fullName.equals(ValueInfo.global("base", "empty_ref")) ||
                    fullName.equals(ValueInfo.global("base", "throw_result")) ||
                    fullName.equals(ValueInfo.global("base", "catch_result")) ||
                    fullName.equals(ValueInfo.global("base", "seq")) ||
                    fullName.equals(ValueInfo.global("base", "ref_set")) ||
                    fullName.equals(ValueInfo.global("base", "ref_get")) ||
                    fullName.equals(ValueInfo.global("base", "while_function")) ||
                    fullName.equals(ValueInfo.global("base", "apply"))) {
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

    private String escapeString(String in) {
        // Quick fix for the debug option for string literals
        return in.replaceAll("\"", "\\\\\"");
    }

    @Override
    public void visit(AssignmentNode node) {
        out.print("Pacioli.global_base_ref_set(");
        out.print(node.var.getName());
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
        out.format("Pacioli.conversionNumbers(%s)", node.typeNode.evalType(true).compileToJS());
    }

    @Override
    public void visit(IdentifierNode node) {
        ValueInfo info = node.getInfo();
        //String prefix = settings.debug() && node.debugable() ? "debug_" : "global_";
        String fun = boxed ? "bfetchValue" : "fetchValue";
        String full = info.isGlobal() ? "Pacioli." + fun + "('" + info.generic().getModule() + "', '" + node.getName() + "')" 
                                          : node.getName();

        if (node.getInfo().isRef()) {
            out.format("Pacioli.global_base_ref_get(%s)", full);
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
            //builder.append(node.info.get(i).definition.globalName());
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
            quoted.add("" + arg + "");
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

        //assert(node.values.size() > 0);
        
        // see mvm generator!!!
        StringBuilder builder = new StringBuilder();
        String sep = "";
        //for (int i = 0; i < node.values.size(); i++) {
        for (MatrixLiteralNode.PositionedValueDecl decl: node.positionedValueDecls()) {
            builder.append(sep);
            builder.append("[");
            builder.append(decl.row);
            //builder.append(node.rowIndices.get(i));
            builder.append(",");
            builder.append(decl.column);
            //builder.append(node.columnIndices.get(i));
            builder.append(",");
            builder.append(decl.valueDecl.value);
            //builder.append(node.values.get(i));
            builder.append("]");
            sep = ",";
        }
        if (boxed) {
            out.print("Pacioli.initialMatrix(" + node.typeNode.evalType(true).compileToJS() + "," + builder.toString() + ")");
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
            type = node.evalType(true);
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }
        
        if (boxed) {
            out.print("Pacioli.oneMatrix(" + type.compileToJS() + ".param)");
            
        } else {
            // Obsolete code
            out.print("Pacioli.oneNumbers(" +  node.rowDim.size() + ", " + node.columnDim.size() + ")");
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
        out.format("[%s]",node.numString());
        write(")");
    }

    @Override
    public void visit(ReturnNode node) {
        write("Pacioli.global_base_throw_result(result, ");
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
            for (int i = 0; i < n-1; i++) {
                write("Pacioli.global_base_seq(");
                newlineUp();
                node.items.get(i).accept(this);
                write(", ");
                newline();
                
            }
            node.items.get(n-1).accept(this);
            for (int i = 0; i < n-1; i++) {
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
        write("result");
        
        // Write the other lambda params
        for (IdentifierNode id : assignedVariables) {
            write(", ");
            write(id.getName());
        }
        write(") {");
        
        newlineUp();
        write("return ");
        
        // A catch to get the result
        write("Pacioli.global_base_catch_result(");
        
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
        write("result");
        
        // Close the catch application
        write("); }( ");
        
        newlineDown();
        
        // The initial result place
        write("Pacioli.global_base_empty_ref()");

        for (IdentifierNode id : assignedVariables) {
            write(", ");
            
            if (node.shadowed.contains(id.getName())) {
                if (node.shadowed.lookup(id.getName()).isRef()) {    
                    write("Pacioli.global_base_new_ref(Pacioli.global_base_ref_get(");
                    write(id.getName());
                    write("))");
                } else {
                    write("Pacioli.global_base_new_ref(");
                    write(id.getName());
                    write(")");
                }
            } else {
                write("Pacioli.global_base_empty_ref()");
            }
        }        
        
        // Close the lambda application
        write(")");
        
        unmark();
    }

    @Override
    public void visit(StringNode node) {
        StringWriter writer = new StringWriter();
        writer.write("'");
        String[] lines = node.valueString().split("\n");
        for (String line : lines) {
            writer.write(line);
            writer.write("\\\n");
        }
        writer.write("'");
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
            names.add(id.getName());
        }
        final List<String> freshNames = Utils.freshNames(names);

        // Create an application of apply to a lambda with two arguments: 
        // the fresh names and the tuple. The freshnames get bound to the 
        // tuple elements and are used in the lambda body to assign the 
        // variables. The lambda body is a sequence of these assignments.
        mark();
        write("Pacioli.global_base_apply(function (");
        
        // The lambda arguments
        Boolean first = true;
        for (String name: freshNames) {
            if (!first) out.print(", ");
            out.print(name);
            first = false;
        }
        out.print(") {");
        
        newlineUp();
        out.print("return ");
        
        // The sequence of assignments
        for (int i = 0; i < size; i++) {
            if (i < size-1) write("Pacioli.global_base_seq(");
            write("Pacioli.global_base_ref_set(");
            write(names.get(i));
            write(", ");
            write(freshNames.get(i));
            write(")");
            if (i < size-1) write(",");
            newline();
        }
        
        // Close the sequences
        for (int i = 0; i < size-1; i++) {
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
        write("Pacioli.global_base_while_function(");
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
}
