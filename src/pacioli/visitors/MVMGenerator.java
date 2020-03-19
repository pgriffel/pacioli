package pacioli.visitors;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.MatrixDimension;
import pacioli.CompilationSettings;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Printer;
import pacioli.Utils;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.definition.Toplevel;
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
import pacioli.ast.expression.MatrixLiteralNode.ValueDecl;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.TypeBase;
import pacioli.types.matrix.MatrixType;
import uom.Fraction;
import uom.Unit;
import uom.UnitFold;

public class MVMGenerator extends IdentityVisitor implements CodeGenerator {

    // Members
    CompilationSettings settings;
    Printer out;

    // Constructor
    public MVMGenerator(Printer printWriter, CompilationSettings settings) {
        out = printWriter;
        this.settings = settings;
    }
    
    // Unit compilation
    public static String compileUnitToMVM(Unit<TypeBase> unit) {
        return unit.fold(new UnitMVMCompiler());
    }
    
    
    static class UnitMVMCompiler implements UnitFold<TypeBase, String> {

        @Override
        public String map(TypeBase base) {    
            return base.compileToMVM();
        }

        @Override
        public String mult(String x, String y) {
            return String.format("unit_mult(%s, %s)", x, y);
        }

        @Override
        public String expt(String x, Fraction n) {
            return String.format("unit_expt(%s, %s)", x, n);
        }

        @Override
        public String one() {
            return "unit(\"\")";
        }
    }
    
    // Visitors

    @Override
    public void visit(Toplevel node) {
        out.print("print ");
        node.body.accept(this);
        out.print(";\n");
        out.newline();
    }

    @Override
    public void visit(ApplicationNode node) {
        
        out.mark();
        
        // Fixme
        //if (settings.debug() && node.function instanceof IdentifierNode) {
        if (false && node.function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) node.function;
            String stackText = id.getName();
            String fullText = node.getLocation().description();
            boolean traceOn = settings.trace(id.getName());
            out.format("application_debug(\"%s\", \"%s\", \"%s\", ", escapeString(stackText), escapeString(fullText),
                    traceOn);
            id.accept(this);
            // boolean traceOn = settings.trace(id.fullName());
            // out.format("application_debug(\"%s\", \"%s\", \"%s\", %s%s)",
            // escapeString(stackText), escapeString(fullText), traceOn, code, args);
        } else {
            out.write("application(");
            out.newlineUp();
            node.function.accept(this);
        }
        for (Node arg : node.arguments) {
            out.write(", ");
            out.newline();
            arg.accept(this);
        }
        out.write(")");
        out.unmark();
    }

    private String escapeString(String in) {
        // Quick fix for the debug option for string literals
        return in.replaceAll("\"", "\\\\\"");
    }

    @Override
    public void visit(AssignmentNode node) {
        out.format("application(var(\"%s\"), var(\"", ValueInfo.global("base", "ref_set"));
        out.print(node.var.getName());
        out.print("\"), ");
        node.value.accept(this);
        out.print(")");
    }

    @Override
    public void visit(BranchNode node) {
        out.write("if(");
        node.test.accept(this);
        out.write(", ");
        node.positive.accept(this);
        out.write(", ");
        node.negative.accept(this);
        out.write(")");
    }

    @Override
    public void visit(ConstNode node) {
        out.format("const(\"%s\")", node.valueString());
    }

    @Override
    public void visit(ConversionNode node) {
        out.write("matrix_constructor(\"conversion\", ");
        out.print(node.typeNode.evalType(true).compileToMVM());
        out.write(")");
    }

    @Override
    public void visit(IdentifierNode node) {
        
        ValueInfo info = node.getInfo();
        
        //String prefix = settings.isDebugOn() && node.debugable() ? "debug_" : "global_";
        //String full = info.isGlobal() ? prefix + info.generic().module + "_" + node.name : node.name;
        String full = info.isGlobal() ? ValueInfo.global(info.generic().getModule() , node.getName() ) : node.getName();
        
        if (node.getInfo().isRef()) {
            out.format("application(var(\"%s\"), var(\"%s\"))", ValueInfo.global("base", "ref_get"), full);
        } else {
            out.format("var(\"%s\")", full);
        }
    }

    @Override
    public void visit(IfStatementNode node) {
        out.write("if(");
        node.test.accept(this);
        out.write(", ");
        node.positive.accept(this);
        out.write(", ");
        node.negative.accept(this);
        out.write(")");
    }

    @Override
    public void visit(KeyNode node) {
        out.write("key(");
        int size = node.indexSets.size();
        for (int i = 0; i < size; i++) {
            if (0 < i) {
                out.write(", ");
            }
            IndexSetInfo info = node.getInfo(i);
            //out.write("\"" + info.definition.globalName() + "\"");
            out.write("\"" + info.globalName() + "\"");
            out.write(", ");
            out.write("\"" + node.keys.get(i) + "\"");
        }
        out.write(")");
    }

    @Override
    public void visit(LambdaNode node) {
        List<String> quoted = new ArrayList<String>();
        for (String arg : node.arguments) {
            quoted.add("\"" + arg + "\"");
        }
        String args = Utils.intercalate(", ", quoted);
        out.print("lambda (");
        out.print(args);
        out.print(")");
        out.newlineUp();
        node.expression.accept(this);
        out.newlineDown();
    }

    @Override
    public void visit(MatrixLiteralNode node) {

        // Find the matrix type's row and column dimension. They should have been set
        // during resolving
        MatrixDimension rowDim = node.rowDim;
        MatrixDimension columnDim = node.columnDim;
        assert (rowDim != null && columnDim != null);

        // Write the opening of the literal
        out.write("literal_matrix(");
        out.print(node.typeNode.evalType(true).compileToMVM());
        out.write(", ");

        // Write the elements. Table check stores all found indices to check for
        // doublures.
        Map<Integer, Set<Integer>> check = new HashMap<Integer, Set<Integer>>();
        int rowWidth = rowDim.width();
        int width = rowWidth + columnDim.width();
        boolean locationReported = false;
        for (ValueDecl pair : node.pairs) {

            // Determine the entry's position
            int rowPos = rowDim.ElementPos(pair.keys().subList(0, rowWidth));
            int columnPos = columnDim.ElementPos(pair.keys().subList(rowWidth, width));

            // Check if this entry was already found
            if (check.containsKey(rowPos)) {
                if (check.get(rowPos).contains(columnPos)) {
                    if (!locationReported) {
                        Pacioli.warn("In %s", node.getLocation().description());
                        locationReported = true;
                    }
                    Pacioli.warn("Duplicate: %s %s", rowDim.ElementAt(rowPos), columnDim.ElementAt(columnPos));
                } else {
                    check.get(rowPos).add(columnPos);
                }
            } else {
                Set<Integer> set = new HashSet<Integer>();
                set.add(columnPos);
                check.put(rowPos, set);
            }

            // Write the entry to output
            out.format(" %s %s \"%s\",", rowPos, columnPos, pair.value);
        }

        // Write the closing of the literal
        out.format(")");
    }

    @Override
    public void visit(MatrixTypeNode node) {
        try {
            MatrixType type = node.evalType(true);
            out.write("matrix_constructor(\"ones\", ");
            out.print(type.compileToMVM());
            out.write(")");
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void visit(ProjectionNode node) {
        throw new RuntimeException("todo: MVM code generation for ProjectionNode");
    }

    @Override
    public void visit(ReturnNode node) {
        out.format("application(var(\"%s\"), var(\"result\"), ", ValueInfo.global("base", "throw_result"));
        node.value.accept(this);
        out.print(")");
    }

    @Override
    public void visit(SequenceNode node) {
        
        if (node.items.isEmpty()) {
            throw new RuntimeException("todo: MVM generator for empty sequence");
        } else {
            Integer n = node.items.size();
            out.mark();
            for (int i = 0; i < n-1; i++) {
                out.format("application(var(\"%s\"), ", ValueInfo.global("base", "seq"));
                out.newlineUp();
                node.items.get(i).accept(this);
                out.print(", ");
                out.newline();
                
            }
            node.items.get(n-1).accept(this);
            for (int i = 0; i < n-1; i++) {
                out.print(")");
            }
            out.unmark();
        }
    }

    @Override
    public void visit(StatementNode node) {
        
        out.mark();
        
        // Find all assigned variables
        Set<IdentifierNode> assignedVariables = node.body.locallyAssignedVariables();

        // A lambda to bind the result place and the assigned variables places
        out.print("application(lambda (");
        
        // Write the result lambda param
        out.print("\"result\"");
        
        // Write the other lambda params
        for (IdentifierNode id : assignedVariables) {
            assert(id.getInfo() != null);
            out.print(", ");
            out.print("\"");
            out.print(id.getName());
            out.print("\"");
        }
        out.print(")");
        
        out.newlineUp();
        
        // A catch to get the result
        out.format("application(var(\"%s\"),", ValueInfo.global("base", "catch_result"));
        
        out.newlineUp();
        
        // Catch expect a lambda
        out.print("lambda ()");
        
        out.newlineUp();
        
        // The body
        node.body.accept(this);
        out.print(",");
        
        out.newline();

        // Catch's second argument is the place name
        out.print("var(\"result\")");
        
        // Close the catch application
        out.print("), ");
        
        out.newlineDown();
        
        // The initial result place
        out.format("application(var(\"%s\"))", ValueInfo.global("base", "empty_ref"));

        //first = true;
        for (IdentifierNode id : assignedVariables) {
            //if (!first) 
            out.print(", ");
            //first = false;
            //assert(node.shadowed.contains(id.getName()).equals(id.getInfo().initialRefInfo.isPresent()));
            //if (id.getInfo().initialRefInfo.isPresent()) {
            if (node.shadowed.contains(id.getName())) {
                // todo: handle the case the id exists in this scope.
                //if (id.getInfo().initialRefInfo().isRef()) {
                if (node.shadowed.lookup(id.getName()).isRef()) {
                    out.format("application(var(\"%s\"), application(var(\"%s\"), var(\"",
                            ValueInfo.global("base", "new_ref"),
                            ValueInfo.global("base", "ref_get"));
                    out.print(id.getName());
                    out.print("\")))");
                } else {
                    out.format("application(var(\"%s\"), var(\"", ValueInfo.global("base", "new_ref"));
                    out.print(id.getName());
                    out.print("\"))");
                }
            } else {
                out.format("application(var(\"%s\"))", ValueInfo.global("base", "empty_ref"));
            }
        }        
        
        // Close the lambda application
        out.print(")");
        
        out.unmark();
    }

    @Override
    public void visit(StringNode node) {
        out.format("string(%s)", node.pretty());
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
        out.mark();
        out.format("application(var(\"%s\"), lambda (", ValueInfo.global("base", "apply"));
        
        // The lambda arguments
        Boolean first = true;
        for (String name: freshNames) {
            if (!first) out.print(", ");
            out.print("\"");
            out.print(name);
            out.print("\"");
            first = false;
        }
        out.print(")");
        
        out.newlineUp();
        
        // The sequence of assignments
        for (int i = 0; i < size; i++) {
            if (i < size-1) out.format("application(var(\"%s\"), ", ValueInfo.global("base", "seq"));
            out.format("application(var(\"%s\"), var(\"", ValueInfo.global("base", "ref_set"));
            out.print(names.get(i));
            out.print("\"), var(\"");
            out.print(freshNames.get(i));
            out.print("\"))");
            if (i < size-1) out.print(",");
            out.newline();
        }
        
        // Close the sequences
        for (int i = 0; i < size-1; i++) {
            out.print(")");
        }
        
        out.print(", ");
        node.tuple.accept(this);
        
        // Close the apply
        out.print(")");
        
        out.unmark();
        
    }

    @Override
    public void visit(WhileNode node) {
        out.mark();
        out.format("application(var(\"%s\"),", ValueInfo.global("base", "while_function"));
        out.newlineUp();
        out.print("lambda () ");
        out.newlineUp();
        node.test.accept(this);
        out.print(",");
        out.newlineDown();
        out.print("lambda ()");
        out.newlineUp();
        node.body.accept(this);
        out.print(")");
        out.unmark();
    }
}
