package pacioli.ast;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
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
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypePerNode;
import pacioli.types.ast.TypePowerNode;

public class IdentityVisitor implements Visitor {

    protected void visitorThrow(Location location, String format, Object... args) {
        throw new RuntimeException(new PacioliException(location, format, args));
    }

    @Override
    public void visit(ProgramNode node) {

        for (IncludeNode includeNode: node.includes) {
            includeNode.accept(this);
        }
        for (ImportNode importNode: node.imports) {
            importNode.accept(this);
        }
        for (Definition def : node.definitions) {
            def.accept(this);
        }
    }
    
    @Override
    public void visit(IncludeNode node) {
    }
    
    @Override
    public void visit(ImportNode node) {
    }
    
    @Override
    public void visit(AliasDefinition node) {
        //Pacioli.log("Alias");
        node.id.accept(this);
        node.unit.accept(this);
    }

    @Override
    public void visit(Declaration declaration) {
        //Pacioli.log("Decl");
    }

    @Override
    public void visit(IndexSetDefinition indexSetDefinition) {
    }

    @Override
    public void visit(MultiDeclaration multiDeclaration) {
        //Pacioli.log("Multidc");
    }

    @Override
    public void visit(Toplevel node) {
        node.body.accept(this);
    }

    @Override
    public void visit(TypeDefinition typeDefinition) {
        //Pacioli.log("TYpeD");
    }

    @Override
    public void visit(UnitDefinition node) {
        // Pacioli.log("Unitdef");
        if (node.body != null) {
            node.body.accept(this);
        }
    }

    @Override
    public void visit(UnitVectorDefinition node) {
        // Pacioli.log("Unitfecog");
        for (UnitDecl decl : node.items) {
            decl.value.accept(this);
        }
    }

    @Override
    public void visit(ValueDefinition node) {
        node.body.accept(this);
    }

    @Override
    public void visit(ApplicationNode node) {
        node.function.accept(this);
        for (ExpressionNode argument : node.arguments) {
            argument.accept(this);
        }
    }

    @Override
    public void visit(AssignmentNode node) {
        node.value.accept(this);
    }

    @Override
    public void visit(BranchNode node) {
        node.test.accept(this);
        node.positive.accept(this);
        node.negative.accept(this);
    }

    @Override
    public void visit(ConstNode constNode) {
    }

    @Override
    public void visit(ConversionNode node) {
        node.typeNode.accept(this);
    }

    @Override
    public void visit(IdentifierNode identifierNode) {
        // Pacioli.log("dient");
    }

    @Override
    public void visit(IfStatementNode node) {
        node.test.accept(this);
        node.positive.accept(this);
        node.negative.accept(this);
    }

    @Override
    public void visit(KeyNode keyNode) {
    }

    @Override
    public void visit(LambdaNode node) {
        node.expression.accept(this);
    }

    @Override
    public void visit(MatrixLiteralNode matrixLiteralNode) {
        //Pacioli.log("matrix");
    }

    @Override
    public void visit(MatrixTypeNode node) {
        // Pacioli.log("mattype");
        node.typeNode.accept(this);
    }

    @Override
    public void visit(ProjectionNode projectionNode) {
        //Pacioli.log("projd");
    }

    @Override
    public void visit(ReturnNode node) {
        node.value.accept(this);
    }

    @Override
    public void visit(SequenceNode node) {
        for (ExpressionNode argument : node.items) {
            argument.accept(this);
        }
    }

    @Override
    public void visit(StatementNode node) {
        node.body.accept(this);
    }

    @Override
    public void visit(StringNode stringNode) {
    }

    @Override
    public void visit(TupleAssignmentNode tupleAssignmentNode) {
        //Pacioli.log("tup");
    }

    @Override
    public void visit(WhileNode node) {
        node.test.accept(this);
        node.body.accept(this);
    }

    @Override
    public void visit(BangTypeNode node) {
        node.indexSet.accept(this);
        if (node.unit != null) {
            node.unit.accept(this);
        }
    }

    @Override
    public void visit(FunctionTypeNode node) {
        node.domain.accept(this);
        node.range.accept(this);
    }

    @Override
    public void visit(NumberTypeNode numberTypeNode) {
    }

    @Override
    public void visit(SchemaNode schemaNode) {
        //Pacioli.log("sschema");
    }

    @Override
    public void visit(TypeApplicationNode node) {
        node.op.accept(this);
        for (TypeNode arg : node.args) {
            arg.accept(this);
        }
    }

    @Override
    public void visit(TypeIdentifierNode node) {
    }

    @Override
    public void visit(TypePowerNode node) {
        node.base.accept(this);
    }

    @Override
    public void visit(PrefixUnitTypeNode prefixUnitTypeNode) {
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        node.left.accept(this);
        node.right.accept(this);
    }

    @Override
    public void visit(TypeDivideNode node) {
        node.left.accept(this);
        node.right.accept(this);
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        node.left.accept(this);
        node.right.accept(this);
    }

    @Override
    public void visit(TypePerNode node) {
        node.left.accept(this);
        node.right.accept(this);
    }

    @Override
    public void visit(NumberUnitNode numberUnitNode) {
    }

    @Override
    public void visit(UnitIdentifierNode unitIdentifierNode) {
    }

    @Override
    public void visit(UnitOperationNode node) {
        node.left.accept(this);
        node.right.accept(this);
    }

    @Override
    public void visit(UnitPowerNode node) {
        node.base.accept(this);
    }

}
