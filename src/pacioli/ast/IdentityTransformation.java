package pacioli.ast;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
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
import pacioli.ast.unit.UnitNode;
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

public class IdentityTransformation implements Visitor {

    private Stack<Node> stack;

    public IdentityTransformation() {
        stack = new Stack<Node>();
    }

    public Node nodeAccept(Node child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return stack.pop();
    }

    public void returnNode(Node value) {
        // Pacioli.logln("return: %s", value.getClass());
        stack.push(value);
    }

    public ExpressionNode expAccept(Node child) {
        Node node = nodeAccept(child);
        assert (node instanceof ExpressionNode);
        return (ExpressionNode) node;
    }

    public TypeNode typeAccept(Node child) {
        Node node = nodeAccept(child);
        assert (node instanceof TypeNode);
        return (TypeNode) node;
    }

    public UnitNode unitAccept(Node child) {
        Node node = nodeAccept(child);
        assert (node instanceof UnitNode);
        return (UnitNode) node;
    }

    @Override
    public void visit(ProgramNode program) {
        List<Definition> defs = new ArrayList<Definition>();
        for (Definition def : program.definitions) {
            Node node = nodeAccept(def);
            assert (node instanceof Definition);
            defs.add((Definition) node);

        }
        returnNode(new ProgramNode(program.module, program.includes, defs));
    }

    @Override
    public void visit(AliasDefinition node) {
        returnNode(node);
    }

    @Override
    public void visit(Declaration node) {
        returnNode(node.transform(typeAccept(node.typeNode)));
    }

    @Override
    public void visit(IndexSetDefinition node) {
        returnNode(node);
    }

    @Override
    public void visit(MultiDeclaration node) {
        // throw new RuntimeException("todo");
        returnNode(node);
    }

    @Override
    public void visit(Toplevel node) {
        // returnNode(node);
        returnNode(new Toplevel(node.getLocation(), expAccept(node.body)));
    }

    @Override
    public void visit(TypeDefinition node) {
        returnNode(node);
    }

    @Override
    public void visit(UnitDefinition node) {
        returnNode(node);
    }

    @Override
    public void visit(UnitVectorDefinition node) {
        returnNode(node);
    }

    @Override
    public void visit(ValueDefinition node) {
        returnNode(node.transform(expAccept(node.body)));
    }

    @Override
    public void visit(ApplicationNode node) {
        List<ExpressionNode> args = new ArrayList<ExpressionNode>();
        for (ExpressionNode argument : node.arguments) {
            args.add(expAccept(argument));
        }
        returnNode(new ApplicationNode(node, expAccept(node.function), args));
    }

    @Override
    public void visit(AssignmentNode node) {
        returnNode(new AssignmentNode(node, expAccept(node.value)));
    }

    @Override
    public void visit(BranchNode node) {
        returnNode(new BranchNode(node, expAccept(node.test), expAccept(node.positive), expAccept(node.negative)));
    }

    @Override
    public void visit(ConstNode node) {
        // returnValue(new ConstNode(node));
        returnNode(node);
    }

    @Override
    public void visit(ConversionNode node) {
        // returnValue(new ConversionNode(node));
        // returnValue(node);
        returnNode(node.transform(typeAccept(node.typeNode)));
    }

    @Override
    public void visit(IdentifierNode node) {
        // returnValue(new IdentifierNode(node));
        returnNode(node);
    }

    @Override
    public void visit(IfStatementNode node) {
        returnNode(new IfStatementNode(node, expAccept(node.test), expAccept(node.positive), expAccept(node.negative)));
    }

    @Override
    public void visit(KeyNode node) {
        // returnValue(new KeyNode(node));
        returnNode(node);
    }

    @Override
    public void visit(LambdaNode node) {
        returnNode(new LambdaNode(node, expAccept(node.expression)));
    }

    @Override
    public void visit(MatrixLiteralNode node) {
        // returnValue(new MatrixLiteralNode(node));
        returnNode(node);
    }

    @Override
    public void visit(MatrixTypeNode node) {
        // throw new RuntimeException("todo");
        // returnValue(node);
        returnNode(node);
    }

    @Override
    public void visit(ProjectionNode node) {
        returnNode(node);
        throw new RuntimeException("todo");
    }

    @Override
    public void visit(ReturnNode node) {
        returnNode(node.transform(expAccept(node.value)));
    }

    @Override
    public void visit(SequenceNode node) {
        List<ExpressionNode> items = new ArrayList<ExpressionNode>();
        for (ExpressionNode item : node.items) {
            items.add(expAccept(item));
        }
        returnNode(node.transform(items));
    }

    @Override
    public void visit(StatementNode node) {
        returnNode(node);
        // throw new RuntimeException("todo");
    }

    @Override
    public void visit(StringNode node) {
        returnNode(node);
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        
        returnNode(new TupleAssignmentNode(node, expAccept(node.tuple)));
        //returnNode(node.transform(this));        
        //throw new RuntimeException("todo");
    }

    @Override
    public void visit(WhileNode node) {
        returnNode(node.transform(expAccept(node.test), expAccept(node.body)));
    }

    @Override
    public void visit(BangTypeNode node) {
        returnNode(node);
    }

    @Override
    public void visit(FunctionTypeNode node) {
        returnNode(node.transform(typeAccept(node.domain), typeAccept(node.range)));
    }

    @Override
    public void visit(NumberTypeNode node) {
        returnNode(node);
    }

    @Override
    public void visit(SchemaNode node) {
        returnNode(node.transform(typeAccept(node.type)));
    }

    @Override
    public void visit(TypeApplicationNode node) {
        List<TypeNode> args = new ArrayList<TypeNode>();
        for (TypeNode arg : node.args) {
            args.add(typeAccept(arg));
        }
        returnNode(node.transform(node.op, args));
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        returnNode(node);
    }

    @Override
    public void visit(TypePowerNode node) {
        returnNode(node.transform(typeAccept(node.base)));
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        returnNode(node);
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        returnNode(node.transform(typeAccept(node.left), typeAccept(node.right)));
    }

    @Override
    public void visit(TypeDivideNode node) {
        returnNode(node.transform(typeAccept(node.left), typeAccept(node.right)));

    }

    @Override
    public void visit(TypeKroneckerNode node) {
        returnNode(node.transform(typeAccept(node.left), typeAccept(node.right)));
    }

    @Override
    public void visit(TypePerNode node) {
        returnNode(node.transform(typeAccept(node.left), typeAccept(node.right)));
    }

    @Override
    public void visit(NumberUnitNode node) {
        returnNode(node);
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        returnNode(node);
    }

    @Override
    public void visit(UnitOperationNode node) {
        returnNode(node.transform(unitAccept(node.left), unitAccept(node.right)));
    }

    @Override
    public void visit(UnitPowerNode node) {
        returnNode(node.transform(unitAccept(node.base)));
    }

}
