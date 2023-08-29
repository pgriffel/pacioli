package pacioli.ast;

import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Documentation;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.InstanceDefinition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeAssertion;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.definition.ValueEquation;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.IdListNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetFunctionBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetTupleBindingNode;
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
import pacioli.types.ast.QuantNode;
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

    void visit(ProgramNode node);

    void visit(IncludeNode node);

    void visit(ImportNode node);

    void visit(ExportNode node);

    void visit(AliasDefinition node);

    void visit(Declaration node);

    void visit(IndexSetDefinition node);

    void visit(MultiDeclaration node);

    void visit(Toplevel node);

    void visit(TypeDefinition node);

    void visit(UnitDefinition node);

    void visit(UnitVectorDefinition node);

    void visit(ValueDefinition node);

    void visit(ApplicationNode node);

    void visit(AssignmentNode node);

    void visit(BranchNode node);

    void visit(ConstNode node);

    void visit(ConversionNode node);

    void visit(IdentifierNode node);

    void visit(IfStatementNode node);

    void visit(KeyNode node);

    void visit(LambdaNode node);

    void visit(MatrixLiteralNode node);

    void visit(MatrixTypeNode node);

    void visit(ProjectionNode node);

    void visit(ReturnNode node);

    void visit(SequenceNode node);

    void visit(StatementNode node);

    void visit(StringNode node);

    void visit(TupleAssignmentNode node);

    void visit(WhileNode node);

    void visit(BangTypeNode node);

    void visit(FunctionTypeNode node);

    void visit(NumberTypeNode node);

    void visit(SchemaNode node);

    void visit(TypeApplicationNode node);

    void visit(TypeIdentifierNode node);

    void visit(TypePowerNode node);

    void visit(PrefixUnitTypeNode node);

    void visit(TypeMultiplyNode node);

    void visit(TypeDivideNode node);

    void visit(TypeKroneckerNode node);

    void visit(TypePerNode node);

    void visit(NumberUnitNode node);

    void visit(UnitIdentifierNode node);

    void visit(UnitOperationNode node);

    void visit(UnitPowerNode node);

    void visit(LetNode letNode);

    void visit(LetBindingNode node);

    void visit(LetTupleBindingNode node);

    void visit(LetFunctionBindingNode node);

    void visit(IdListNode node);

    void visit(Documentation docu);

    void visit(ClassDefinition classDefinition);

    void accept(ValueEquation valueEquation);

    void visit(InstanceDefinition instanceDefinition);

    void accept(TypeAssertion typeAssertion);

    void accept(QuantNode quantNode);
}
