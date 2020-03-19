package pacioli.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Visitor;
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
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class TypeInference extends IdentityVisitor implements Visitor {

    private Stack<Typing> typingStack = new Stack<Typing>();

    public Typing typingAccept(ExpressionNode node) {
        // Pacioli.logln("accept: %s", node.getClass());
        node.accept(this);
        return typingStack.pop();
    }

    private void returnNode(Typing value) {
        // Pacioli.logln("return: %s", value.getClass());
        typingStack.push(value);
    }

    private void na() {
        throw new RuntimeException("N/A. Todo: statements");
    }

    @Override
    public void visit(ApplicationNode node) {

        // Create the result typing. Its type is a variable
        // After unification the type variable will be the desired type.
        PacioliType resultType = new TypeVar("for_type");
        Typing typing = new Typing(resultType);

        // Infer the argument's typings. Keep the types and
        // add the contraints to the result typing.
        List<PacioliType> argTypes = new ArrayList<PacioliType>();
        for (ExpressionNode arg : node.arguments) {
            Typing argTyping = typingAccept(arg);
            argTypes.add(argTyping.getType());
            typing.addConstraints(argTyping);
        }

        // Infer the typing of the function. Add its contraints
        // to the result typing.
        Typing funTyping = typingAccept(node.function);
        typing.addConstraints(funTyping);

        // Create a function type from the argument types to the type variable
        // that was put in the result type.
        PacioliType funType = new FunctionType(new ParametricType("Tuple", argTypes), resultType);

        // Add the unification contraint that function type must equal the derived
        // function type.
        String message = String.format("During inference %s\nthe infered type must match known types",
                node.sourceDescription());
        typing.addConstraint(funType, funTyping.getType(), message);

        // Return the result typing
        returnNode(typing);
    }

    @Override
    public void visit(AssignmentNode node) {
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing valueTyping = typingAccept(node.value);
        Typing typing = new Typing(voidType);
        typing.addConstraints(valueTyping);
        typing.addConstraint(node.var.getInfo().inferredType(), valueTyping.getType(),
                "assigned variable must have proper type");
        returnNode(typing);
    }

    @Override
    public void visit(BranchNode node) {

        // Infer the part's typings
        Typing testTyping = typingAccept(node.test);
        Typing posTyping = typingAccept(node.positive);
        Typing negTyping = typingAccept(node.negative);

        // Create a typing for the branch using the positive part's type
        Typing typing = new Typing(posTyping.getType());

        // Add the contstraints from the parts to the branch's typing
        typing.addConstraints(testTyping);
        typing.addConstraints(posTyping);
        typing.addConstraints(negTyping);

        // Add the constraint that the test must be Boolean
        typing.addConstraint(testTyping.getType(), new ParametricType("Boole", new ArrayList<PacioliType>()), String
                .format("While infering the type of\n%s\nthe test of an if must be Boolean", node.sourceDescription()));

        // Add the constraint that the positive and the negative branch must have the
        // same type
        typing.addConstraint(posTyping.getType(), negTyping.getType(),
                String.format("While infering the type of\n%s\nthe branches of an if must have the same type",
                        node.sourceDescription()));

        returnNode(typing);
    }

    @Override
    public void visit(ConstNode node) {

        // Todo: handle this properly
        if (node.valueString().equals("true") || node.valueString().equals("false")) {
            returnNode(new Typing(new ParametricType("Boole")));
        } else {
            returnNode(new Typing(new MatrixType()));
        }
    }

    @Override
    public void visit(ConversionNode node) {
        // Should the true arg be based on the local property?. Remove the argument!!!!
        // Is/should be solved during resolve.
        returnNode(new Typing(node.typeNode.evalType(true)));
    }

    @Override
    public void visit(IdentifierNode node) {

        if (!node.getInfo().inferredType.isPresent()) {
            // It must be a recursive function. Todo: handle properly
            if (node.getInfo().getDeclaredType().isPresent()) {
            returnNode(new Typing(node.getInfo().getDeclaredType().get().evalType(true).instantiate()));
            } else {
                throw new RuntimeException("Identifier node has no declared type", new PacioliException(node.getLocation(), "id=%s", node.getName()));
            }
        } else
            // Move instantiate to proper place.
            returnNode(new Typing(node.getInfo().inferredType().instantiate()));
    }

    @Override
    public void visit(IfStatementNode node) {

        Typing testTyping = typingAccept(node.test);
        Typing posTyping = typingAccept(node.positive);
        Typing negTyping = typingAccept(node.negative);

        Typing typing = new Typing(posTyping.getType());

        typing.addConstraints(testTyping);
        typing.addConstraints(posTyping);
        typing.addConstraints(negTyping);

        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());

        typing.addConstraint(testTyping.getType(), new ParametricType("Boole", new ArrayList<PacioliType>()), String
                .format("While infering the type of\n%s\nthe test of an if must be Boolean", node.sourceDescription()));
        typing.addConstraint(posTyping.getType(), voidType,
                String.format("While infering the type of\n%s\nthe then branche of an if must be a statement",
                        node.sourceDescription()));
        typing.addConstraint(negTyping.getType(), voidType,
                String.format("While infering the type of\n%s\nthe else branche of an if must be a statement",
                        node.sourceDescription()));

        returnNode(typing);
    }

    @Override
    public void visit(KeyNode node) {

        // Create a list of type identifiers for all the key's dimensions
        List<TypeIdentifier> typeIds = new ArrayList<TypeIdentifier>();
        for (int i = 0; i < node.indexSets.size(); i++) {
            IndexSetInfo info = node.getInfo(i);
            typeIds.add(new TypeIdentifier(info.generic().getModule(), node.indexSets.get(i)));
        }

        // Create a typing with an index type from the type identifies.
        returnNode(new Typing(new IndexType(typeIds)));
    }

    @Override
    public void visit(LambdaNode node) {

        // A list for the argument types
        List<PacioliType> argTypes = new ArrayList<PacioliType>();

        for (String arg : node.arguments) {

            // Create the type variable and add it to the list
            PacioliType freshType = new TypeVar("for_type");
            argTypes.add(freshType);

            // Also store the type in the lambda's symbol table
            ValueInfo info = node.table.lookup(arg);
            info.setinferredType(freshType);

        }

        // Infer the body's typing
        Typing bodyTyping = typingAccept(node.expression);

        // Create a typing for the lambda and add the constraints from the body's
        // inference
        Typing typing = new Typing(new FunctionType(new ParametricType("Tuple", argTypes), bodyTyping.getType()));
        typing.addConstraints(bodyTyping);

        returnNode(typing);
    }

    @Override
    public void visit(MatrixLiteralNode node) {

        // Evaluate the node's type node
        PacioliType type = node.typeNode.evalType(true);

        assert (type != null);

        // Create a typing from the type
        returnNode(new Typing(type));
    }

    @Override
    public void visit(MatrixTypeNode node) {

        // Evaluate the node's type node
        PacioliType type = node.typeNode.evalType(true);

        assert (type != null);

        // Create a typing from the type
        returnNode(new Typing(type));
    }

    @Override
    public void visit(ProjectionNode projectionNode) {
        na();

    }

    @Override
    public void visit(ReturnNode node) {
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing valueTyping = typingAccept(node.value);
        Typing typing = new Typing(voidType);
        typing.addConstraints(valueTyping);
        typing.addConstraint(node.info.inferredType(), valueTyping.getType(), "the types of returned values must agree");
        returnNode(typing);
    }

    @Override
    public void visit(SequenceNode node) {
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing typing = new Typing(voidType);
        for (ExpressionNode item : node.items) {
            Typing itemTyping = typingAccept(item);
            typing.addConstraint(voidType, itemTyping.getType(), "A statement must have type Void()");
            typing.addConstraints(itemTyping);
        }
        returnNode(typing);
    }

    @Override
    public void visit(StatementNode node) {

        for (String name : node.table.localNames()) {
            ValueInfo info = node.table.lookup(name);
            info.setinferredType(new TypeVar("for_type"));
        }

        PacioliType resultType = new TypeVar("for_type");

        ValueInfo resultInfo = node.table.lookup("result");
        resultInfo.setinferredType(resultType);

        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing typing = new Typing(resultType);
        Typing itemTyping = typingAccept(node.body);
        typing.addConstraint(voidType, itemTyping.getType(), "A statement must have type Void()");
        typing.addConstraints(itemTyping);
        returnNode(typing);
    }

    @Override
    public void visit(StringNode stringNode) {

        // Return a typing with type string
        returnNode(new Typing(new ParametricType("String")));
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        
        List<PacioliType> varTypes = new ArrayList<PacioliType>();
        for (IdentifierNode var : node.vars) {
            varTypes.add(var.getInfo().inferredType());
        }      
        PacioliType tupleType = new ParametricType("Tuple", varTypes);
        
        
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing tupleTyping = typingAccept(node.tuple);
        Typing typing = new Typing(voidType);
        typing.addConstraints(tupleTyping);
        typing.addConstraint(tupleType, tupleTyping.getType(),
                "assigned variable must have proper type");
        returnNode(typing);
    }

    @Override
    public void visit(WhileNode node) {
        Typing testTyping = typingAccept(node.test);
        Typing bodyTyping = typingAccept(node.body);

        Typing typing = new Typing(new ParametricType("Void", new ArrayList<PacioliType>()));
        typing.addConstraints(testTyping);
        typing.addConstraints(bodyTyping);
        typing.addConstraint(testTyping.getType(), new ParametricType("Boole", new ArrayList<PacioliType>()),
                "the test of a while must be boolean");
        typing.addConstraint(bodyTyping.getType(), new ParametricType("Void", new ArrayList<PacioliType>()),
                "the body of a while must be a statement");
        returnNode(typing);

    }
}
