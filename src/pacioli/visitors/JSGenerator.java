package pacioli.visitors;

import java.io.PrintWriter;
import java.io.StringWriter;
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
import pacioli.Utils;
import pacioli.ast.Node;
import pacioli.ast.ProgramNode;
import pacioli.ast.Visitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.ExpressionNode;
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
import pacioli.ast.expression.MatrixLiteralNode.ValueDecl;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.PacioliType;
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
import pacioli.types.matrix.MatrixType;
import uom.DimensionedNumber;

public class JSGenerator extends PrintVisitor implements CodeGenerator {

    CompilationSettings settings;
    Boolean boxed = true;

    public JSGenerator(PrintWriter printWriter, CompilationSettings settings, boolean boxed) {
        super(printWriter);
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
        out.format("\\nPacioli.compute_%s = function () {return Pacioli.makeIndexSet('%s', [ %s ])}\n", 
                node.globalName(), 
                node.localName(),
                Utils.intercalate(",", quotedItems));
    }

    @Override
    public void visit(MultiDeclaration multiDeclaration) {
        na();
    }

    @Override
    public void visit(Toplevel node) {
        //out.print("print ");
//        node.body.accept(this);
        //out.print(";\n");
        newline();
    }

    @Override
    public void visit(TypeDefinition typeDefinition) {
        na();
    }

    @Override
    public void visit(UnitDefinition node) {
        na();
    }

    @Override
    public void visit(UnitVectorDefinition node) {
        na();
    }

    public void compileValueDefinition(ValueDefinition node, ValueInfo info) {
        ExpressionNode transformedBody = node.body;
        if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            out.format("\n" 
                    + "Pacioli.u_%s = function () {\n"
                    + "    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));\n"
                    + "    var type = %s;\n"
                    + "    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));\n"
                    + "}\n"
                    + "Pacioli.b_%s = function (%s) {\n"
                    + "    return %s;\n" 
                    + "}\n"
                    + "Pacioli.%s = function (%s) {\n"
                    + "    return %s;\n" 
                    + "}\n",
                    node.globalName(),
                    info.inferredType.reduce().compileToJS(),
                    //info.inferredType.compileToJS(),
                    node.globalName(),
                    code.argsString(),
                    code.expression.compileToJSNew(settings, true),
                    node.globalName(),
                    code.argsString(),
                    code.expression.compileToJSNew(settings, false));
        } else {
            out.format("\n"
                    + "Pacioli.compute_u_%s = function () {\n"
                    + "    return %s;\n"
                    + "}\n"
                        + "Pacioli.compute_%s = function () {\n  return %s;\n}\n"
                    + "Pacioli.compute_b_%s = function () {\n  return %s;\n}\n",
                    node.globalName(),
                    info.inferredType.reduce().compileToJS(), //transformedBody.compileToJSShape(),
                    //info.inferredType.compileToJS(), //transformedBody.compileToJSShape(),
                    node.globalName(),
                    transformedBody.compileToJSNew(settings, false),
                    node.globalName(),
                    transformedBody.compileToJSNew(settings, true));
        }
                
    }
    
    @Override
    public void visit(ValueDefinition node) {
        na();
        node.body.accept(this);    
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
            
            //newlineUp();
            if (node.function instanceof IdentifierNode && ((IdentifierNode)node.function).info.generic.isGlobal()) {
                out.format("Pacioli.%s", ((IdentifierNode) node.function).info.globalName()); // is globalName() correct?
            } else {
                node.function.accept(this);
            }
            out.write("(");
            // return String.format("application(%s%s)",
            // node.function.compileToMVM(settings), args);
        }
        Boolean sep = false;
        for (Node arg : node.arguments) {
            if (sep) out.write(", "); else sep = true;
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
        out.print("Pacioli.global_Primitives_ref_set(");
        out.print(node.var.name);
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
        out.format("Pacioli.conversionNumbers(%s)", node.typeNode.compileToJS(false));
    }

    @Override
    public void visit(IdentifierNode node) {
        ValueInfo info = node.info;
        //String prefix = settings.debug() && node.debugable() ? "debug_" : "global_";
        // String full = node.isLocal() ? node.name : node.compiledName(prefix);
        // String full = info.generic.global ? node.compiledName(prefix) : node.name;
        String full = info.generic.isGlobal() ? "Pacioli.fetchValue('" + info.generic.module + "', '" + node.name + "')" 
                                          : node.name;

        if (node.info.isRef) {
            out.format("Pacioli.ref_get(%s)", full);
        } else {
            out.format("%s", full);
        }
    }

    @Override
    public void visit(IfStatementNode node) {
        out.write("if (");
        node.test.accept(this);
        out.write(") { ");
        node.positive.accept(this);
        out.write(" } else { ");
        node.negative.accept(this);
        out.write(" }");
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
            builder.append(node.info.get(i).definition.globalName());
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
        //newlineUp();
        node.expression.accept(this);
        write(";");
        //newlineDown();
        write("}");
    }

    @Override
    public void visit(MatrixLiteralNode node) {

        // see mvm generator!!!
        StringBuilder builder = new StringBuilder();
        String sep = "";
        for (int i = 0; i < node.values.size(); i++) {
            builder.append(sep);
            builder.append("[");
            builder.append(node.rowIndices.get(i));
            builder.append(",");
            builder.append(node.columnIndices.get(i));
            builder.append(",");
            builder.append(node.values.get(i));
            builder.append("]");
            sep = ",";
        }
        if (boxed) {
            out.print("Pacioli.initialMatrix(" + node.typeNode.compileToJS(false) + "," + builder.toString() + ")");
            // throw new RuntimeException("matrix literal node ");
        }
        out.format("Pacioli.initialNumbers(%s, %s, [%s])", 
                node.rowDim.size(), node.columnDim.size(),
                builder.toString());

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
            // throw new RuntimeException("matrix type node ");
            //out.print("Pacioli.oneMatrix(" + node.typeNode.compileToJS(boxed) + ")");
            out.print("Pacioli.oneMatrix(" + type.compileToJS() + ")");
            
        } else {
            // Obsolete code
            //out.print("Pacioli.oneNumbers(" +  node.rowDim.size() + ", " + node.columnDim.size() + ")");
        }
    }

    @Override
    public void visit(ProjectionNode node) {
        assert (node.type != null);
        out.format("Pacioli.projectNumbers(%s, %s.param, [%s])", 
                node.body.compileToJS(boxed), 
                node.type.compileToJS(),
                node.numString());
    }

    @Override
    public void visit(ReturnNode node) {
        write("Pacioli.global_Primitives_throw_result(result, ");
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
                write("Pacioli.global_Primitives_seq(");
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
        write("function (");
        
        // Write the result lambda param
        write("result");
        
        // Write the other lambda params
        for (IdentifierNode id : assignedVariables) {
            write(", ");
            //write("\"");
            write(id.getName());
            //write("\"");
        }
        write(") { return ");
        
        newlineUp();
        
        // A catch to get the result
        write("Pacioli.global_Primitives_catch_result(");
        
        newlineUp();
        
        // Catch expect a lambda
        write("function () { return ");
        
        newlineUp();
        
        // The body
        node.body.accept(this);
        write("; } ,");
        
        newline();

        // Catch's second argument is the place name
        write("result");
        
        // Close the catch application
        write(")( ");
        
        newlineDown();
        
        // The initial result place
        write("Pacioli.global_Primitives_empty_ref()");

        //first = true;
        for (IdentifierNode id : assignedVariables) {
            //if (!first) 
            write(", ");
            //first = false;
            
            if (id.info.initialRefInfo != null) {
                // todo: handle the case the id exists in this scope.
                if (id.info.initialRefInfo.isRef) {
                    write("Pacioli.global_Primitives_new_ref(Pacioli.global_Primitives_ref_get(");
                    write(id.getName());
                    write("))");
                } else {
                    write("Pacioli.global_Primitives_new_ref(");
                    write(id.getName());
                    write(")");
                }
            } else {
                write("Pacioli.global_Primitives_empty_ref()");
            }
        }        
        
        // The result place for catch
        //write("var(\"result\")");
        
        
        // Close the lambda application
        write("); }");
        
        unmark();
        //out.format("application(global_Primitives_ref_set, ");
        //node.body.accept(this);
        //out.format(")");
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
        write("Pacioli.global_Primitives_apply(function (");
        
        // The lambda arguments
        Boolean first = true;
        for (String name: freshNames) {
            if (!first) out.print(", ");
            //write("\"");
            out.print(name);
            //write("\"");
            first = false;
        }
        out.print(") {");
        
        newlineUp();
        out.print("return ");
        
        // The sequence of assignments
        for (int i = 0; i < size; i++) {
            if (i < size-1) write("Pacioli.global_Primitives_seq(");
            write("Pacioli.global_Primitives_ref_set(");
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
        //node.desugar().accept(this);
        mark();
        write("Pacioli.global_Primitives_while_function(");
        newlineUp();
        write("function () {");
        newlineUp();
        write("return ");
        node.test.accept(this);
        write(";} ,");
        newlineDown();
        write("function () {");
        newlineUp();
        write("return");
        node.body.accept(this);
        write(";})");
        unmark();
    }

    @Override
    public void visit(BangTypeNode node) {
        out.format("Pacioli.bangShape('%s', '%s', '%s', '%s')",
                node.indexSet.getDefinition().getModule().getName(), 
                node.indexSet.getName(),
                node.unit == null ? "" : node.unit.getDefinition().getModule().getName(), 
                node.unit == null ? "" : node.unit.getName());
    }

    @Override
    public void visit(FunctionTypeNode functionTypeNode) {
        // TODO Auto-generated method stub
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(NumberTypeNode numberTypeNode) {
        // TODO Auto-generated method stub
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(SchemaNode schemaNode) {
        // TODO Auto-generated method stub
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(TypeApplicationNode typeApplicationNode) {
        // TODO Auto-generated method stub
        throw new RuntimeException("todo ");
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        out.write(node.MVMCode(settings));
    }

    @Override
    public void visit(TypePowerNode node) {
        na();
        out.write("shape_expt(");
        node.base.accept(this);
        out.write(", ");
        out.write(node.power.number);
        out.write(")");
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        out.write(node.MVMCode(settings));
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        na();
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

}
