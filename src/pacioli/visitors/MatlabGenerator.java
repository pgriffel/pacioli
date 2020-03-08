package pacioli.visitors;

import java.io.PrintWriter;

import pacioli.CompilationSettings;
import pacioli.Printer;
import pacioli.ast.IdentityVisitor;
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

    private void na() {
        throw new RuntimeException("Cannot call this");
    }

    @Override
    public void visit(ApplicationNode node) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(AssignmentNode assignmentNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(BranchNode branchNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(ConstNode constNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(ConversionNode conversionNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(IdentifierNode identifierNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(IfStatementNode ifStatementNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(KeyNode keyNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(LambdaNode lambdaNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(MatrixLiteralNode matrixLiteralNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(MatrixTypeNode matrixTypeNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(ProjectionNode projectionNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(ReturnNode returnNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(SequenceNode sequenceNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(StatementNode statementNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(StringNode stringNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TupleAssignmentNode tupleAssignmentNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(WhileNode whileNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(BangTypeNode bangTypeNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(FunctionTypeNode functionTypeNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(NumberTypeNode numberTypeNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(SchemaNode schemaNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TypeApplicationNode typeApplicationNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TypeIdentifierNode typeIdentifierNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TypePowerNode typePowerNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(PrefixUnitTypeNode prefixUnitTypeNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TypeMultiplyNode typeMultiplyNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TypeDivideNode typeDivideNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TypeKroneckerNode typeKroneckerNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(TypePerNode typePerNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(NumberUnitNode numberUnitNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(UnitIdentifierNode unitIdentifierNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(UnitOperationNode unitOperationNode) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void visit(UnitPowerNode unitOperationNode) {
        // TODO Auto-generated method stub
        
    }

}
