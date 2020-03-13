package pacioli.ast;

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

public interface Visitor {

    void visit(ProgramNode program);
    
    void visit(IncludeNode program);
    
    void visit(ImportNode program);

    void visit(AliasDefinition aliasDefinition);

    void visit(Declaration declaration);

    void visit(IndexSetDefinition indexSetDefinition);

    void visit(MultiDeclaration multiDeclaration);

    void visit(Toplevel toplevel);

    void visit(TypeDefinition typeDefinition);

    void visit(UnitDefinition unitDefinition);

    void visit(UnitVectorDefinition unitVectorDefinition);

    void visit(ValueDefinition valueDefinition);

    void visit(ApplicationNode node);

    void visit(AssignmentNode assignmentNode);

    void visit(BranchNode branchNode);

    void visit(ConstNode constNode);

    void visit(ConversionNode conversionNode);

    void visit(IdentifierNode identifierNode);

    void visit(IfStatementNode ifStatementNode);

    void visit(KeyNode keyNode);

    void visit(LambdaNode lambdaNode);

    void visit(MatrixLiteralNode matrixLiteralNode);

    void visit(MatrixTypeNode matrixTypeNode);

    void visit(ProjectionNode projectionNode);

    void visit(ReturnNode returnNode);

    void visit(SequenceNode sequenceNode);

    void visit(StatementNode statementNode);

    void visit(StringNode stringNode);

    void visit(TupleAssignmentNode tupleAssignmentNode);

    void visit(WhileNode whileNode);

    void visit(BangTypeNode bangTypeNode);

    void visit(FunctionTypeNode functionTypeNode);

    void visit(NumberTypeNode numberTypeNode);

    void visit(SchemaNode schemaNode);

    void visit(TypeApplicationNode typeApplicationNode);

    void visit(TypeIdentifierNode typeIdentifierNode);

    void visit(TypePowerNode typePowerNode);

    void visit(PrefixUnitTypeNode prefixUnitTypeNode);

    void visit(TypeMultiplyNode typeMultiplyNode);

    void visit(TypeDivideNode typeDivideNode);

    void visit(TypeKroneckerNode typeKroneckerNode);

    void visit(TypePerNode typePerNode);

    void visit(NumberUnitNode numberUnitNode);

    void visit(UnitIdentifierNode unitIdentifierNode);

    void visit(UnitOperationNode unitOperationNode);

    void visit(UnitPowerNode unitOperationNode);
}
