package pacioli.visitors;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Stack;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.PacioliFile;
import pacioli.Typing;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.definition.IndexSetDefinition;
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
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetFunctionBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetNode.BindingNode;
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
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ParametricInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.FunctionType;
import pacioli.types.OperatorConst;
import pacioli.types.TypeObject;
import pacioli.types.ParametricType;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.Var;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.MatrixType;

public class TypeInference extends IdentityVisitor {

    private Stack<Typing> typingStack = new Stack<Typing>();
    private HashMap<String, ParametricInfo> defaultTypes;
    private PacioliFile file;

    public TypeInference(HashMap<String, ParametricInfo> defaultTypes, PacioliFile file) {
        this.defaultTypes = defaultTypes;
        this.file = file;
    }

    private ParametricInfo findInfo(String name) {
        ParametricInfo type = defaultTypes.get(name);
        if (type == null) {
            throw new RuntimeException("Unknown type: " + name);
        }
        return type;
    }

    private ParametricType newVoidType() {
        return new ParametricType(null, new OperatorConst(new TypeIdentifier("base", "Void"), findInfo("Void")),
                new ArrayList<TypeObject>());
    }

    private ParametricType newBooleType() {
        return new ParametricType(null, new OperatorConst(new TypeIdentifier("base", "Boole"), findInfo("Boole")),
                new ArrayList<TypeObject>());
    }

    private ParametricType newStringType() {
        return new ParametricType(null, new OperatorConst(new TypeIdentifier("base", "String"), findInfo("String")),
                new ArrayList<TypeObject>());
    }

    private ParametricType newTupleType(List<TypeObject> args) {
        return new ParametricType(null, new OperatorConst(new TypeIdentifier("base", "Tuple"), findInfo("Tuple")),
                args);
    }

    public Typing typingAccept(Node node) {
        node.accept(this);
        return typingStack.pop();
    }

    private void returnNode(Typing value) {
        typingStack.push(value);
    }

    private void na() {
        throw new RuntimeException("N/A. Todo: statements");
    }

    @Override
    public void visit(ApplicationNode node) {

        // Create the result typing. Its type is a variable
        // After unification the type variable will be the desired type.
        TypeObject resultType = new TypeVar();
        Typing typing = new Typing(resultType);

        // Infer the argument's typings. Keep the types and
        // add the contraints to the result typing.
        List<TypeObject> argTypes = new ArrayList<TypeObject>();
        for (ExpressionNode arg : node.arguments) {
            Typing argTyping = typingAccept(arg);
            argTypes.add(argTyping.getType());
            typing.addConstraintsAndAssumptions(argTyping);
        }

        // The nmode product is special. It requires that the type
        // is known (no variables) because it needs to manipulate indices.
        if (node.hasName("nmode")) {
            if (true) {
                if (node.arguments.size() != 3) {

                    throw new PacioliException(node.getLocation(),
                            "N-mode got %s arguments, expects 3 (a tensor, an integer and a matrix)",
                            node.arguments.size());
                }

                Integer n;

                // Try to get the n parameter
                try {
                    ConstNode nNode = (ConstNode) node.arguments.get(1);
                    n = new Integer(nNode.valueString());
                } catch (Exception ex) {
                    throw new PacioliException(node.arguments.get(1).getLocation(),
                            "Second argument of nmode must be a number");
                }

                String message = String.format("During inference %s\nthe infered type must follow the nmode rules",
                        node.sourceDescription());

                typing.addNModeConstraint(resultType,
                        argTypes.get(0),
                        n,
                        argTypes.get(2),
                        node,
                        message);
            } else {
                try {

                    // The parameters of nmode
                    MatrixType tensorType;
                    Integer n;
                    MatrixType matrixType;

                    // Try to get the n parameter
                    try {
                        ConstNode nNode = (ConstNode) node.arguments.get(1);
                        n = new Integer(nNode.valueString());
                    } catch (Exception ex) {
                        throw new PacioliException(node.arguments.get(1).getLocation(),
                                "Second argument of nmode must be a number");
                    }

                    // Try to get the type of the tensor parameter
                    ExpressionNode tensorNode = node.arguments.get(0);
                    try {
                        Typing tensorTyping = typingAccept(tensorNode);
                        TypeObject tensorPacioliType = tensorTyping.solve(false);
                        tensorType = (MatrixType) tensorPacioliType;
                    } catch (Exception ex) {
                        throw new PacioliException(tensorNode.getLocation(),
                                "First argument of nmode must have a valid matrix type: %s",
                                ex.getMessage());
                    }

                    // Try to get the type of the matrix parameter
                    try {
                        Typing matrixTyping = typingAccept(node.arguments.get(2));
                        TypeObject matrixPacioliType = matrixTyping.solve(false);
                        matrixType = (MatrixType) matrixPacioliType;
                    } catch (Exception ex) {
                        throw new PacioliException(node.arguments.get(2).getLocation(),
                                "Third argument of nmode must be a valid matrix type");
                    }

                    // Determine the shape of the row dimension
                    List<Integer> shape = new ArrayList<Integer>();
                    for (int i = 0; i < tensorType.rowDimension.width(); i++) {
                        Optional<IndexSetDefinition> def = tensorType.rowDimension.nthIndexSetInfo(i).getDefinition();
                        if (def.isPresent()) {
                            shape.add(def.get().getItems().size());
                        } else {
                            new PacioliException(node.arguments.get(0).getLocation(),
                                    "Index set %s has no known size", i);
                        }
                    }

                    // Remember the shape for the code generators
                    node.nmodeShape = shape;

                    // Call MatrixType nmode on the found types and require that the
                    // result equals the outcome
                    String message = String.format("During inference %s\nthe infered type must follow the nmode rules",
                            node.sourceDescription());
                    typing.addConstraint(tensorType.nmode(n, matrixType), resultType, message);

                } catch (PacioliException ex) {
                    throw new RuntimeException("Invalid nmode application", ex);
                } catch (Exception ex) {
                    throw new RuntimeException("Invalid nmode application",
                            new PacioliException(node.getLocation(), ex.getMessage()));
                }
            }
        } else {

            // Infer the typing of the function. Add its contraints
            // to the result typing.
            Typing funTyping = typingAccept(node.function);
            typing.addConstraintsAndAssumptions(funTyping);

            // Create a function type from the argument types to the type variable
            // that was put in the result type.
            TypeObject funType = new FunctionType(newTupleType(argTypes), resultType);

            // Add the unification contraint that function type must equal the derived
            // function type.
            String message = String.format("During inference %s\nthe infered type must match known types",
                    node.sourceDescription());
            typing.addConstraint(funType, funTyping.getType(), message);

        }

        // Return the result typing
        returnNode(typing);

    }

    @Override
    public void visit(AssignmentNode node) {
        Typing valueTyping = typingAccept(node.value);
        Typing typing = new Typing(newVoidType());
        typing.addConstraintsAndAssumptions(valueTyping);
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
        typing.addConstraintsAndAssumptions(testTyping);
        typing.addConstraintsAndAssumptions(posTyping);
        typing.addConstraintsAndAssumptions(negTyping);

        // Add the constraint that the test must be Boolean
        typing.addConstraint(testTyping.getType(), newBooleType(), String
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
            returnNode(new Typing(newBooleType()));
        } else {
            returnNode(new Typing(new MatrixType()));
        }
    }

    @Override
    public void visit(ConversionNode node) {
        // Should the true arg be based on the local property?. Remove the argument!!!!
        // Is/should be solved during resolve.
        returnNode(new Typing(node.typeNode.evalType()));
    }

    @Override
    public void visit(IdentifierNode node) {

        ValueInfo info = node.getInfo();

        if (info.isGlobal()) {
            // Move instantiate to proper place.
            if (node.getInfo().getDeclaredType().isPresent()) {
                returnNode(new Typing(
                        node.getInfo().getDeclaredType().get().evalType().instantiate()
                                .reduce(i -> i.generalInfo().getModule().equals(file.getModule()))));
            } else {
                returnNode(new Typing(node.getInfo().inferredType().instantiate()));
            }
        } else {
            TypeVar var = new TypeVar();
            Typing typing = new Typing(var);
            typing.addAssumption(node.getName(), var);
            returnNode(typing);
        }

    }

    @Override
    public void visit(IfStatementNode node) {

        Typing testTyping = typingAccept(node.test);
        Typing posTyping = typingAccept(node.positive);
        Typing negTyping = typingAccept(node.negative);

        Typing typing = new Typing(posTyping.getType());

        typing.addConstraintsAndAssumptions(testTyping);
        typing.addConstraintsAndAssumptions(posTyping);
        typing.addConstraintsAndAssumptions(negTyping);

        TypeObject voidType = newVoidType();

        typing.addConstraint(testTyping.getType(), newBooleType(), String
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
        List<IndexSetInfo> typeInfos = new ArrayList<IndexSetInfo>();
        for (int i = 0; i < node.indexSets.size(); i++) {
            IndexSetInfo info = node.getInfo(i);
            typeIds.add(new TypeIdentifier(info.generalInfo().getModule(), node.indexSets.get(i)));
            typeInfos.add(info);
        }

        // Create a typing with an index type from the type identifies.
        returnNode(new Typing(new IndexList(typeIds, typeInfos)));
    }

    @Override
    public void visit(LambdaNode node) {

        // A list for the argument types
        List<TypeObject> argTypes = new ArrayList<TypeObject>();

        for (String arg : node.arguments) {

            // Create the type variable and add it to the list
            String freshName = node.table.freshSymbolName();
            TypeObject freshType = new TypeVar(freshName);
            argTypes.add(freshType);

            // Also store the type in the lambda's symbol table
            ValueInfo info = node.table.lookup(arg);
            info.setinferredType(freshType);

        }

        // Infer the body's typing
        Typing bodyTyping = typingAccept(node.expression);

        // Create a typing for the lambda and add the constraints from the body's
        // inference
        Typing typing = new Typing(new FunctionType(newTupleType(argTypes), bodyTyping.getType()));
        typing.addConstraints(bodyTyping);

        for (String name : bodyTyping.assumedNames()) {
            ValueInfo info = node.table.lookup(name);
            if (node.arguments.contains(name)) {
                for (TypeVar var : bodyTyping.assumptions(name)) {
                    typing.addConstraint(var, info.inferredType(),
                            String.format("During type inference in %s\nLambda var %s must have the proper type",
                                    node.sourceDescription(),
                                    name));
                }
            } else {
                for (TypeVar var : bodyTyping.assumptions(name)) {
                    typing.addAssumption(name, var);
                }
            }
        }

        returnNode(typing);
    }

    @Override
    public void visit(LetNode node) {

        Set<Var> freeVars = new HashSet<Var>();

        for (ValueInfo inf : Node.freeVars(node, node.table)) {
            if (inf.isMonomorphic) {
                TypeObject varType = inf.inferredType.get();
                assert (varType instanceof TypeVar);
                freeVars.add((TypeVar) varType);
            }
        }

        // This typing collects the constraints from the bindings
        TypeObject tmpType = new TypeVar();
        Typing tmpTyping = new Typing(tmpType);

        List<String> vars = new ArrayList<String>();

        // Fill the types in the symbol table before the body's type
        // is inferred to make the variable types available.
        for (BindingNode binding : node.binding) {
            assert (binding instanceof LetBindingNode);
            LetBindingNode letBinding = (LetBindingNode) binding;
            vars.add(letBinding.var);
            Typing bindingTyping = typingAccept(letBinding);
            tmpTyping.addConstraintsAndAssumptions(bindingTyping);
            ValueInfo info = node.table.lookup(letBinding.var);
            info.setinferredType(bindingTyping.getType());
        }

        // Infer the body's typing
        Typing bodyTyping = typingAccept(node.body);

        Typing resultTyping = new Typing(bodyTyping.getType());

        // Could also add a constraint that resultType equals bodyType. See
        // what gives better debug messages.
        resultTyping.addConstraintsAndAssumptions(tmpTyping);
        resultTyping.addConstraints(bodyTyping);

        for (String name : bodyTyping.assumedNames()) {
            ValueInfo info = node.table.lookup(name);
            if (vars.contains(name)) {
                for (TypeVar var : bodyTyping.assumptions(name)) {
                    resultTyping.addInstanceConstraint(var, info.inferredType(), freeVars,
                            String.format("During type inference in %s\nLet var %s must have the proper type",
                                    node.sourceDescription(),
                                    name));
                }
            } else {
                for (TypeVar var : bodyTyping.assumptions(name)) {
                    resultTyping.addAssumption(name, var);
                }
            }
        }

        returnNode(resultTyping);
    }

    @Override
    public void visit(LetBindingNode node) {
        returnNode(typingAccept(node.value));
    }

    @Override
    public void visit(LetTupleBindingNode node) {
        node.value.accept(this);
        throw new RuntimeException("todo");
    }

    @Override
    public void visit(LetFunctionBindingNode node) {
        node.body.accept(this);
        throw new RuntimeException("obsolete");
    }

    @Override
    public void visit(MatrixLiteralNode node) {

        // Evaluate the node's type node
        TypeObject type = node.typeNode.evalType();

        assert (type != null);

        // Create a typing from the type
        returnNode(new Typing(type));
    }

    @Override
    public void visit(MatrixTypeNode node) {

        // Evaluate the node's type node
        TypeObject type = node.typeNode.evalType();

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
        TypeObject voidType = newVoidType();
        Typing valueTyping = typingAccept(node.value);
        Typing typing = new Typing(voidType);
        typing.addConstraintsAndAssumptions(valueTyping);
        typing.addConstraint(node.resultInfo.inferredType(), valueTyping.getType(),
                "the types of returned values must agree");
        returnNode(typing);
    }

    @Override
    public void visit(SequenceNode node) {
        TypeObject voidType = newVoidType();
        Typing typing = new Typing(voidType);
        for (ExpressionNode item : node.items) {
            Typing itemTyping = typingAccept(item);
            typing.addConstraint(voidType, itemTyping.getType(), "A statement must have type Void()");
            typing.addConstraintsAndAssumptions(itemTyping);
        }
        returnNode(typing);
    }

    @Override
    public void visit(StatementNode node) {

        List<String> localNames = node.table.localNames();
        for (String name : localNames) {
            ValueInfo info = node.table.lookup(name);
            info.setinferredType(new TypeVar());
        }

        TypeObject resultType = new TypeVar();

        // ValueInfo resultInfo = node.table.lookup("result");
        ValueInfo resultInfo = node.resultInfo;
        resultInfo.setinferredType(resultType);

        TypeObject voidType = newVoidType();
        Typing typing = new Typing(resultType);

        Typing itemTyping = typingAccept(node.body);

        String stMessage = String.format("During inference %s\na statement must have type Void()",
                node.sourceDescription());
        typing.addConstraint(voidType, itemTyping.getType(), stMessage);
        // typing.addConstraintsAndAssumptions(itemTyping);
        typing.addConstraints(itemTyping);

        for (String name : itemTyping.assumedNames()) {
            ValueInfo info = node.table.lookup(name);
            if (localNames.contains(name)) {
                for (TypeVar var : itemTyping.assumptions(name)) {
                    String message = String.format(
                            "During inference %s\nthe infered parameter type must match the argument",
                            info.getLocation().description());
                    typing.addConstraint(var, info.inferredType(), message);
                }
            } else {
                for (TypeVar var : itemTyping.assumptions(name)) {
                    typing.addAssumption(name, var);
                }
            }
        }

        returnNode(typing);
    }

    @Override
    public void visit(StringNode stringNode) {

        // Return a typing with type string
        returnNode(new Typing(newStringType()));
    }

    @Override
    public void visit(TupleAssignmentNode node) {

        List<TypeObject> varTypes = new ArrayList<TypeObject>();
        for (IdentifierNode var : node.vars) {
            varTypes.add(var.getInfo().inferredType());
        }
        TypeObject tupleType = newTupleType(varTypes);

        TypeObject voidType = newVoidType();
        Typing tupleTyping = typingAccept(node.tuple);
        Typing typing = new Typing(voidType);
        typing.addConstraintsAndAssumptions(tupleTyping);
        typing.addConstraint(tupleType, tupleTyping.getType(),
                "assigned variable must have proper type");
        returnNode(typing);
    }

    @Override
    public void visit(WhileNode node) {
        Typing testTyping = typingAccept(node.test);
        Typing bodyTyping = typingAccept(node.body);

        Typing typing = new Typing(newVoidType());
        typing.addConstraintsAndAssumptions(testTyping);
        typing.addConstraintsAndAssumptions(bodyTyping);
        typing.addConstraint(testTyping.getType(), newBooleType(),
                "the test of a while must be boolean");
        typing.addConstraint(bodyTyping.getType(), newVoidType(),
                "the body of a while must be a statement");
        returnNode(typing);

    }
}
