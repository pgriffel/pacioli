package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.PacioliException;
import pacioli.compiler.Printer;
import pacioli.compiler.Utils;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.NumberTypeNode;
import pacioli.types.ast.PrefixUnitTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeDivideNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeKroneckerNode;
import pacioli.types.ast.TypeMultiplyNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypePerNode;
import pacioli.types.ast.TypePowerNode;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.TypeBase;
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

    // UNITTODO
    static class UnitMVMCompiler implements UnitFold<TypeBase, String> {

        @Override
        public String map(TypeBase base) {
            return base.asMVMUnit(null);
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
        if (settings.isDebugOn() && node.function instanceof IdentifierNode) {
            // if (false && node.function instanceof IdentifierNode) {
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
        out.format("application(var(\"%s\"), var(\"", ValueInfo.global("lib_base_base", "_ref_set"));
        out.print(node.var.name());
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
        out.print(node.typeNode.evalType().compileToMVM(settings));
        out.write(")");
    }

    @Override
    public void visit(IdentifierNode node) {

        ValueInfo info = node.info();

        String full = info.isGlobal() ? ValueInfo.global(info.generalInfo().module(), node.name())
                : node.name();

        if (node.info().isRef()) {
            out.format("application(var(\"%s\"), var(\"%s\"))", ValueInfo.global("lib_base_base", "_ref_get"), full);
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
            // out.write("\"" + info.definition.globalName() + "\"");
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

        // Write the opening of the literal
        out.write("literal_matrix(");
        out.print(node.typeNode.evalType().compileToMVM(settings));
        out.write(", ");

        // Write the elements.
        for (MatrixLiteralNode.PositionedValueDecl decl : node.positionedValueDecls()) {
            out.format(" %s %s \"%s\",", decl.row, decl.column, decl.valueDecl.value);
        }

        // Write the closing of the literal
        out.format(")");
    }

    @Override
    public void visit(MatrixTypeNode node) {
        try {
            MatrixType type = node.evalType();
            out.write("matrix_constructor(\"ones\", ");
            out.print(type.compileToMVM(settings));
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
        out.format("application(var(\"%s\"), var(\"result\"), ", ValueInfo.global("lib_base_base", "_throw_result"));
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
            for (int i = 0; i < n - 1; i++) {
                out.format("application(var(\"%s\"), ", ValueInfo.global("lib_base_base", "_seq"));
                out.newlineUp();
                node.items.get(i).accept(this);
                out.print(", ");
                out.newline();

            }
            node.items.get(n - 1).accept(this);
            for (int i = 0; i < n - 1; i++) {
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

        List<String> args = new ArrayList<String>();
        List<IdentifierNode> ids = new ArrayList<IdentifierNode>();
        for (IdentifierNode id : assignedVariables) {
            String name = id.name();
            if (!args.contains(name)) {
                args.add(name);
                ids.add(id);
            }
        }

        // A lambda to bind the result place and the assigned variables places
        out.print("application(lambda (");

        // Write the result lambda param
        out.print("\"result\"");

        // Write the other lambda params
        for (IdentifierNode id : ids) {
            assert (id.info() != null);
            out.print(", ");
            out.print("\"");
            out.print(id.name());
            out.print("\"");
        }
        out.print(")");

        out.newlineUp();

        // A catch to get the result
        out.format("application(var(\"%s\"),", ValueInfo.global("lib_base_base", "_catch_result"));

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
        out.format("application(var(\"%s\"))", ValueInfo.global("lib_base_base", "_empty_ref"));

        for (IdentifierNode id : ids) {
            out.print(", ");
            if (node.shadowed.contains(id.name())) {
                if (node.shadowed.lookup(id.name()).isRef()) {
                    out.format("application(var(\"%s\"), application(var(\"%s\"), var(\"",
                            ValueInfo.global("lib_base_base", "_new_ref"),
                            ValueInfo.global("lib_base_base", "_ref_get"));
                    out.print(id.name());
                    out.print("\")))");
                } else {
                    out.format("application(var(\"%s\"), var(\"", ValueInfo.global("lib_base_base", "_new_ref"));
                    out.print(id.name());
                    out.print("\"))");
                }
            } else {
                out.format("application(var(\"%s\"))", ValueInfo.global("lib_base_base", "_empty_ref"));
            }
        }

        // Close the lambda application
        out.print(")");

        out.unmark();
    }

    @Override
    public void visit(StringNode node) {
        out.format("string(\"%s\")", escapeString(node.valueString()));
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
        out.mark();
        out.format("application(var(\"%s\"), lambda (", ValueInfo.global("lib_base_base", "apply"));

        // The lambda arguments
        Boolean first = true;
        for (String name : freshNames) {
            if (!first)
                out.print(", ");
            out.print("\"");
            out.print(name);
            out.print("\"");
            first = false;
        }
        out.print(")");

        out.newlineUp();

        // The sequence of assignments
        for (int i = 0; i < size; i++) {
            if (i < size - 1)
                out.format("application(var(\"%s\"), ", ValueInfo.global("lib_base_base", "_seq"));
            out.format("application(var(\"%s\"), var(\"", ValueInfo.global("lib_base_base", "_ref_set"));
            out.print(names.get(i));
            out.print("\"), var(\"");
            out.print(freshNames.get(i));
            out.print("\"))");
            if (i < size - 1)
                out.print(",");
            out.newline();
        }

        // Close the sequences
        for (int i = 0; i < size - 1; i++) {
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
        out.format("application(var(\"%s\"),", ValueInfo.global("lib_base_base", "_while"));
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

    @Override
    public void visit(BangTypeNode node) {
        out.write("bang_shape(\"");
        // node.indexSet.accept(this);
        out.write(node.indexSet().info.globalName());
        out.write("\", \"");
        if (node.unit().isPresent()) {
            // out.write(node.indexSet.info.name());
            // out.write("!");
            out.write(node.unit().get().info.name());
            // node.unit.get().accept(this);
        }
        out.write("\")");
    }

    @Override
    public void visit(FunctionTypeNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
        node.domain.accept(this);
        node.range.accept(this);
    }

    @Override
    public void visit(NumberTypeNode node) {
        // if (true) throw new RuntimeException(String.format("to mvm generate: %s",
        // node.getClass()));
        // out.write(node.number);
        out.write("scalar_shape(unit(\"\"))");
    }

    @Override
    public void visit(SchemaNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
    }

    @Override
    public void visit(TypeApplicationNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
        node.op.accept(this);
        for (TypeNode arg : node.args) {
            arg.accept(this);
        }
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        out.write("scalar_shape(unit(\"");
        // out.write("\"");
        out.write(node.name());
        out.write("\"))");
        // out.write("\"");
    }

    @Override
    public void visit(TypePowerNode node) {
        // if (true) throw new RuntimeException(String.format("to mvm generate: %s",
        // node.getClass()));
        out.format("shape_expt(");
        node.base.accept(this);
        out.format(", ");
        out.write(node.power.number);
        out.format(")");
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        out.write("shape_binop(\"multiply\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
    }

    @Override
    public void visit(TypeDivideNode node) {
        out.write("shape_binop(\"divide\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
        /*
         * if (true) throw new RuntimeException(String.format("to mvm generate: %s",
         * node.getClass()));
         * node.left.accept(this);
         * node.right.accept(this);
         */
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        out.write("shape_binop(\"kronecker\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
    }

    @Override
    public void visit(TypePerNode node) {
        out.write("shape_binop(\"per\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
    }

    @Override
    public void visit(NumberUnitNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
    }

    @Override
    public void visit(UnitOperationNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
        node.left.accept(this);
        node.right.accept(this);
    }

    @Override
    public void visit(UnitPowerNode node) {
        if (true)
            throw new RuntimeException(String.format("to mvm generate: %s", node.getClass()));
        node.base.accept(this);
    }

    @Override
    public void visit(LetNode node) {
        node.asApplication().accept(this);
    }
}
