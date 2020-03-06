package pacioli.visitors;

import java.io.PrintWriter;
import java.util.Stack;

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
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
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

public class PrintVisitor implements Visitor {

    PrintWriter out;
    private Stack<Integer> indentationStack;
    Integer indentation = 0;
    Integer offset = 0;
    final Integer delta = 4;
    
    protected void write(String text) {
        out.print(text);
        offset += text.length();
    }
    
    protected void mark() {
        indentationStack.push(indentation);
        indentation = offset;
        //offset = 
    }
    
    protected void unmark() {
        indentation = indentationStack.pop();
        //offset = 
    }
    
    protected void newline() {
        out.format("\n");
        for (int i = 0; i < indentation; i++) {
            out.print(" ");
        }
        offset = indentation; 
    }
    
    protected void newlineUp() {
        indentation += delta;
        newline();
    }
    
    protected void newlineDown() {
        indentation -= delta;
        newline();
    }

    public PrintVisitor(PrintWriter printWriter) {
        indentationStack = new Stack<Integer>();
        out = printWriter;
    }

    @Override
    public void visit(ProgramNode program) {
        write("Prog");
    }

    @Override
    public void visit(AliasDefinition aliasDefinition) {
        write("Alias");
    }

    @Override
    public void visit(Declaration declaration) {
        write("Decl\n");
    }

    @Override
    public void visit(IndexSetDefinition indexSetDefinition) {
        write("Ind");
    }

    @Override
    public void visit(MultiDeclaration multiDeclaration) {
        write("Multidc");
    }

    @Override
    public void visit(Toplevel node) {
        node.body.accept(this);
    }

    @Override
    public void visit(TypeDefinition typeDefinition) {
        write("TYpeD");
    }

    @Override
    public void visit(UnitDefinition unitDefinition) {
        write("Unitdef\n");
    }

    @Override
    public void visit(UnitVectorDefinition unitVectorDefinition) {
        write("Unitfecog\n");
    }

    @Override
    public void visit(ValueDefinition node) {
        write("define ");
        node.id.accept(this);
        write(" =");
        newlineUp();
        node.body.accept(this);
        write(";");
        newlineDown();
    }

    @Override
    public void visit(ApplicationNode node) {
        node.function.accept(this);
        write("(");
        mark();
        Boolean first = true;
        for (ExpressionNode argument : node.arguments) {
            if (!first) {
                write(", ");
                newline();
            }
            argument.accept(this);
            first = false;
        }
        write(")");
        unmark();
    }

    @Override
    public void visit(AssignmentNode node) {
        node.var.accept(this);
        write(" := ");
        node.value.accept(this);
    }

    @Override
    public void visit(BranchNode node) {
        write("if ");
        node.test.accept(this);
        write(" then ");
        node.positive.accept(this);
        write(" else ");
        node.negative.accept(this);
        write(" end");
    }

    @Override
    public void visit(ConstNode node) {
        out.format("const(\"%s\")", node.valueString());
    }

    @Override
    public void visit(ConversionNode conversionNode) {
        write("conv");
    }

    @Override
    public void visit(IdentifierNode identifierNode) {
        write(identifierNode.getName());
    }

    @Override
    public void visit(IfStatementNode ifStatementNode) {
        write("if");
    }

    @Override
    public void visit(KeyNode keyNode) {
        write("key");
    }

    @Override
    public void visit(LambdaNode node) {
        write("lambda (");
        Boolean first = true;
        for (String arg : node.arguments) {
            if (!first)
                out.format(", ");
            out.format(arg);
            first = false;
        }
        out.format(") ");
        newlineUp();
        node.expression.accept(this);
        newlineDown();
        out.format("end");
    }

    @Override
    public void visit(MatrixLiteralNode matrixLiteralNode) {
        write("matrix");
    }

    @Override
    public void visit(MatrixTypeNode matrixTypeNode) {
        write("mattype");
    }

    @Override
    public void visit(ProjectionNode projectionNode) {
        write("projd");
    }

    @Override
    public void visit(ReturnNode returnNode) {
        write("ret");
    }

    @Override
    public void visit(SequenceNode node) {
        mark();
        Boolean first = true;
        for (ExpressionNode item : node.items) {
            if (!first) newline();
            first = false;
            item.accept(this);
            
        }
        unmark();
    }

    @Override
    public void visit(StatementNode node) {
        write("begin ");
        newlineUp();
        node.body.accept(this);
        newlineDown();
        write("end");
    }

    @Override
    public void visit(StringNode node) {
        //out.format("\"%s\"", node.valueString());
        write("\"" + node.valueString() + "\"");
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        write("(");
        Boolean first = true; 
        for (IdentifierNode var: node.vars) {
            if (!first) write(",");
            first = false;
            var.accept(this);
        }
        write(") := ");
        node.tuple.accept(this);
        write(";");
    }

    @Override
    public void visit(WhileNode node) {
        write("while ");
        node.test.accept(this);
        write(" do");
        newlineUp();
        node.body.accept(this);
        newlineDown();
    }

    @Override
    public void visit(BangTypeNode node) {
        //write("bang");
        out.format("%s!%s", node.indexSet.getName(), node.unit == null ? "" : node.unit.getName());
    }

    @Override
    public void visit(FunctionTypeNode functionTypeNode) {
        write("funty");
    }

    @Override
    public void visit(NumberTypeNode numberTypeNode) {
        write("numytpe");
    }

    @Override
    public void visit(SchemaNode schemaNode) {
        write("sschema");
    }

    @Override
    public void visit(TypeApplicationNode typeApplicationNode) {
        write("typepapp");
    }

    @Override
    public void visit(TypeIdentifierNode typeIdentifierNode) {
        write("typeident");
        throw new RuntimeException("Cannot print (visit) TypeIdentifierNode");
    }

    @Override
    public void visit(TypePowerNode typePowerNode) {
        write("typepow");
    }

    @Override
    public void visit(PrefixUnitTypeNode prefixUnitTypeNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

    @Override
    public void visit(TypeMultiplyNode typeMultiplyNode) {
        // TODO Auto-generated method stub
        write("todo2");
    }

    @Override
    public void visit(TypeDivideNode typeDivideNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

    @Override
    public void visit(TypeKroneckerNode typeKroneckerNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

    @Override
    public void visit(TypePerNode typePerNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

    @Override
    public void visit(NumberUnitNode numberUnitNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

    @Override
    public void visit(UnitIdentifierNode unitIdentifierNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

    @Override
    public void visit(UnitOperationNode unitOperationNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

    @Override
    public void visit(UnitPowerNode unitOperationNode) {
        // TODO Auto-generated method stub
        write("todo1");
    }

}
