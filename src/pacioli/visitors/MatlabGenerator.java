package pacioli.visitors;

import pacioli.CompilationSettings;
import pacioli.Printer;
import pacioli.ast.IdentityVisitor;
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

public class MatlabGenerator extends IdentityVisitor implements CodeGenerator {

    Printer out;
    CompilationSettings settings;

    public MatlabGenerator(Printer printWriter, CompilationSettings settings) {
        out = printWriter;
        this.settings = settings;
    }

    @Override
    public void visit(ApplicationNode node) {
/*        List<String> compiled = new ArrayList<String>();
        for (Node arg : node.arguments) {
            compiled.add(arg.compileToMATLAB());
        }
  */      
        //String argsText = "(" + Utils.intercalate(", ", compiled) + ")";
        if (node.function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) node.function;
            out.write(id.getInfo().globalName().toLowerCase());
            //out.write(argsText);
            out.write("(");
            out.writeCommaSeparated(node.arguments, this);
            out.write(")");
        } else {
            node.function.accept(this);
            //out.write(argsText);
            out.write("(");
            out.writeCommaSeparated(node.arguments, this);
            out.write(")");
        }
    }

    @Override
    public void visit(AssignmentNode node) {
        out.format("%s", node.getClass());
    }

    @Override
    public void visit(BranchNode node) {
        out.format("%s", node.getClass());
    }

    @Override
    public void visit(ConstNode node) {
        out.format("%s", node.getClass());
    }

    @Override
    public void visit(ConversionNode node) {
        out.format("%s", node.getClass());
    }

    @Override
    public void visit(IdentifierNode node) {
        out.format("%s", node.getClass());
    }

    @Override
    public void visit(IfStatementNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(KeyNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(LambdaNode node) {
        out.format("%s", node.getClass());
    }

    @Override
    public void visit(MatrixLiteralNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(MatrixTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(ProjectionNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(ReturnNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(SequenceNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(StatementNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(StringNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(WhileNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(BangTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(FunctionTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(NumberTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(SchemaNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeApplicationNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypePowerNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeDivideNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypePerNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(NumberUnitNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(UnitOperationNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(UnitPowerNode node) {
        out.format("%s", node.getClass());
        
    }

}
