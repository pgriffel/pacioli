package pacioli.visitors;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.MatrixDimension;
import pacioli.CompilationSettings;
import pacioli.Pacioli;
import pacioli.Utils;
import pacioli.ast.Node;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
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
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
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
import pacioli.types.ast.TypePerNode;
import pacioli.types.ast.TypePowerNode;
import uom.DimensionedNumber;

public class MVMGenerator extends PrintVisitor implements CodeGenerator {

//    PrintWriter out;
    CompilationSettings settings;

    public MVMGenerator(PrintWriter printWriter, CompilationSettings settings) {
        super(printWriter);
//        out = printWriter;
        this.settings = settings;
    }

    private void na() {
        throw new RuntimeException("Cannot call this");
    }

    @Override
    public void visit(ProgramNode program) {
        na();
    }

    @Override
    public void visit(AliasDefinition aliasDefinition) {
        na();
    }

    @Override
    public void visit(Declaration declaration) {
        na();
    }

    @Override
    public void visit(IndexSetDefinition node) {
        List<String> quotedItems = new ArrayList<String>();
        for (String item : node.items) {
            quotedItems.add(String.format("\"%s\"", item));
        }
        out.format("indexset \"%s\" \"%s\" list(%s);\n", node.globalName(), node.localName(),
                Utils.intercalate(",", quotedItems));
    }

    @Override
    public void visit(MultiDeclaration multiDeclaration) {
        na();
    }

    @Override
    public void visit(Toplevel node) {
        // na();
        // out.format("\nprint %s;", definition.compileToMVM(settings));
        out.print("print ");
        node.body.accept(this);
        out.print(";\n");
        newline();
    }

    @Override
    public void visit(TypeDefinition typeDefinition) {
        na();
    }

    @Override
    public void visit(UnitDefinition node) {
        DimensionedNumber number = node.evalBody();
        if (number == null) {
            out.format("baseunit \"%s\" \"%s\";\n", node.getName(), node.getSymbol());
        } else {
            number = number.flat();
            out.format("unit \"%s\" \"%s\" %s %s;\n", node.getName(), node.getSymbol(), number.factor(),
                    Utils.compileUnitToMVM(number.unit()));
        }
    }

    @Override
    public void visit(UnitVectorDefinition node) {
        IndexSetInfo setInfo = (IndexSetInfo) node.indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();
        // for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
        for (UnitDecl entry : node.items) {
            DimensionedNumber number = entry.value.evalUnit();
            unitTexts.add("\"" + entry.key.getName() + "\": " + Utils.compileUnitToMVM(number.unit()));
        }
        out.print(String.format("unitvector \"%s\" \"%s\" list(%s);\n",
                // String.format("index_%s_%s", node.getModule().getName(), node.localName()),
                setInfo.definition.globalName(),
                // resolvedIndexSet.getDefinition().globalName(),
                node.localName(), Utils.intercalate(", ", unitTexts)));
    }

    @Override
    public void visit(ValueDefinition node) {
        out.format("store \"%s\" ", node.globalName());
        newlineUp();
        // node.resolvedBody.desugar().accept(this);
        node.body.accept(this);
        out.write(";");
        newlineDown();
        newline();
    }

    @Override
    public void visit(ApplicationNode node) {
        //if (settings.debug() && node.function instanceof IdentifierNode) {
        mark();
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
            newlineUp();
            node.function.accept(this);
            // return String.format("application(%s%s)",
            // node.function.compileToMVM(settings), args);
        }
        for (Node arg : node.arguments) {
            out.write(", ");
            newline();
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
        // node.desugar().accept(this);
        //na();
        out.print("application(var(\"global_Primitives_ref_set\"), var(\"");
        out.print(node.var.name);
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
        // todo: switch to new compile
        node.typeNode.accept(this);
        //out.print(node.typeNode.evalType(true).compileToMVM());
        out.write(")");
    }

    @Override
    public void visit(IdentifierNode node) {
        ValueInfo info = node.info;
        String prefix = settings.debug() && node.debugable() ? "debug_" : "global_";
        // String full = node.isLocal() ? node.name : node.compiledName(prefix);
        // String full = info.generic.global ? node.compiledName(prefix) : node.name;
        String full = info.isGlobal() ? prefix + info.generic().module + "_" + node.name : node.name;

        if (node.info.isRef) {
            out.format("application(var(\"global_Primitives_ref_get\"), var(\"%s\"))", full);
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
            IndexSetInfo info = node.info.get(i);
            // out.write("\"" + node.indexSetDefinitions.get(i).globalName() + "\"");
            out.write("\"" + info.definition.globalName() + "\"");
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
        write("lambda (");
        write(args);
        write(")");
        newlineUp();
        node.expression.accept(this);
        newlineDown();
    }

    @Override
    public void visit(MatrixLiteralNode node) {

        /*
         * // Evaluate the matrix type MatrixType matrixType; try { PacioliType type =
         * node.typeNode.evalType(false); if (type instanceof MatrixType) { matrixType =
         * (MatrixType) type; } else { throw new
         * PacioliException(node.typeNode.getLocation(), "Expected a matrix type"); } }
         * catch (PacioliException e) { throw new RuntimeException(e); }
         */

        // Find the matrix type's row and column dimension. They should have been set
        // during resolving
        /*
         * MatrixDimension rowDim = compileTimeMatrixDimension(matrixType.rowDimension);
         * MatrixDimension columnDim =
         * compileTimeMatrixDimension(matrixType.columnDimension);
         */
        MatrixDimension rowDim = node.rowDim;
        MatrixDimension columnDim = node.columnDim;
        assert (rowDim != null && columnDim != null);

        // Write the opening of the literal
        out.write("literal_matrix(");
        // Todo: switch to new compiler
        node.typeNode.accept(this);
        //out.print(node.typeNode.evalType(true).compileToMVM());
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
        out.write("matrix_constructor(\"ones\", ");
        node.typeNode.accept(this);
        out.write(")");
    }

    @Override
    public void visit(ProjectionNode node) {
        // out.write(node.MVMcode(settings));
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(ReturnNode node) {
        write("application(var(\"global_Primitives_throw_result\"), var(\"result\"), ");
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
                write("application(var(\"global_Primitives_seq\"), ");
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
        
        //throw new RuntimeException("todo MVM for SequenceNode");
        //node.desugar().accept(this);
    }

    @Override
    public void visit(StatementNode node) {
        
        mark();
        
        // Find all assigned variables
        Set<IdentifierNode> assignedVariables = node.body.locallyAssignedVariables();

        // A lambda to bind the result place and the assigned variables places
        write("application(lambda (");
        
        // Write the result lambda param
        write("\"result\"");
        
        // Write the other lambda params
        for (IdentifierNode id : assignedVariables) {
            write(", ");
            write("\"");
            write(id.getName());
            write("\"");
        }
        write(")");
        
        newlineUp();
        
        // A catch to get the result
        write("application(var(\"global_Primitives_catch_result\"),");
        
        newlineUp();
        
        // Catch expect a lambda
        write("lambda ()");
        
        newlineUp();
        
        // The body
        node.body.accept(this);
        write(",");
        
        newline();

        // Catch's second argument is the place name
        write("var(\"result\")");
        
        // Close the catch application
        write("), ");
        
        newlineDown();
        
        // The initial result place
        write("application(var(\"global_Primitives_empty_ref\"))");

        //first = true;
        for (IdentifierNode id : assignedVariables) {
            //if (!first) 
            write(", ");
            //first = false;
            
            if (id.info.initialRefInfo != null) {
                // todo: handle the case the id exists in this scope.
                if (id.info.initialRefInfo.isRef) {
                    write("application(var(\"global_Primitives_new_ref\"), application(var(\"global_Primitives_ref_get\"), var(\"");
                    write(id.getName());
                    write("\")))");
                } else {
                    write("application(var(\"global_Primitives_new_ref\"), var(\"");
                    write(id.getName());
                    write("\"))");
                }
            } else {
                write("application(var(\"global_Primitives_empty_ref\"))");
            }
        }        
        
        // The result place for catch
        //write("var(\"result\")");
        
        
        // Close the lambda application
        write(")");
        
        unmark();
        //out.format("application(global_Primitives_ref_set, ");
        //node.body.accept(this);
        //out.format(")");
    }

    @Override
    public void visit(StringNode node) {
        out.format("string(%s)", node.toText());
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        //node.desugar().accept(this);
        
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
        write("application(var(\"global_Primitives_apply\"), lambda (");
        
        // The lambda arguments
        Boolean first = true;
        for (String name: freshNames) {
            if (!first) out.print(", ");
            write("\"");
            out.print(name);
            write("\"");
            first = false;
        }
        out.print(")");
        
        newlineUp();
        
        // The sequence of assignments
        for (int i = 0; i < size; i++) {
            if (i < size-1) write("application(var(\"global_Primitives_seq\"), ");
            write("application(var(\"global_Primitives_ref_set\"), var(\"");
            write(names.get(i));
            write("\"), var(\"");
            write(freshNames.get(i));
            write("\"))");
            if (i < size-1) write(",");
            newline();
        }
        
        // Close the sequences
        for (int i = 0; i < size-1; i++) {
            out.print(")");
        }
        
        write(", ");
        node.tuple.accept(this);
        
        // Close the apply
        write(")");
        
        unmark();
        
    }

    @Override
    public void visit(WhileNode node) {
        //node.desugar().accept(this);
        mark();
        write("application(var(\"global_Primitives_while_function\"),");
        newlineUp();
        write("lambda () ");
        newlineUp();
        node.test.accept(this);
        write(",");
        newlineDown();
        write("lambda ()");
        newlineUp();
        node.body.accept(this);
        write(")");
        unmark();
    }

    @Override
    public void visit(BangTypeNode node) {
        //na();
        IndexSetInfo info = (IndexSetInfo) node.indexSet.info;
        UnitInfo unitInfo = node.unit == null ? null : (UnitInfo) node.unit.info;
        out.format("bang_shape(\"%s\", \"%s\")",
                // node.indexSet.getDefinition().globalName(),
                // node.indexSetInfo.definition.globalName(),
                // node.indexSet.info.generic().module,
                info.definition.globalName(), node.unit == null ? "" :
                // node.unit.getDefinition().localName()
                // node.unit.getName()
                        unitInfo.definition.localName());
    }

    @Override
    public void visit(FunctionTypeNode functionTypeNode) {
        // TODO Auto-generated method stub
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(NumberTypeNode numberTypeNode) {
        // TODO Auto-generated method stub
        //throw new RuntimeException("todo ");
        out.print("scalar_shape(unit(\"\"))");
    }

    @Override
    public void visit(SchemaNode schemaNode) {
        // TODO Auto-generated method stub
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(TypeApplicationNode typeApplicationNode) {
        // TODO Auto-generated method stub
        //na();
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        //na();
        out.write(node.MVMCode(settings));
    }

    @Override
    public void visit(TypePowerNode node) {
        //na();
        out.write("shape_expt(");
        node.base.accept(this);
        out.write(", ");
        out.write(node.power.number);
        out.write(")");
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        //na();
        out.write(node.MVMCode(settings));
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        //na();
        out.write("shape_binop(\"multiply\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
    }

    @Override
    public void visit(TypeDivideNode node) {
        //na();
        out.write("shape_binop(\"divide\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        //na();
        out.write("shape_binop(\"kronecker\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
    }

    @Override
    public void visit(TypePerNode node) {
        //na();
        out.write("shape_binop(\"per\", ");
        node.left.accept(this);
        out.write(", ");
        node.right.accept(this);
        out.write(")");
    }

    @Override
    public void visit(NumberUnitNode numberUnitNode) {
        na();
    }

    @Override
    public void visit(UnitIdentifierNode unitIdentifierNode) {
        na();
    }

    @Override
    public void visit(UnitOperationNode unitOperationNode) {
        na();
    }

    @Override
    public void visit(UnitPowerNode unitOperationNode) {
        na();
    }

    @Override
    public void compileValueDefinition(ValueDefinition def, ValueInfo info) {
        def.accept(this);
    }
}
