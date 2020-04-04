package pacioli.visitors;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Stack;

import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
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
import pacioli.symboltable.TypeInfo;
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
    private HashMap<String, TypeInfo> defaultTypes;

    public TypeInference(HashMap<String, TypeInfo> defaultTypes) {
        this.defaultTypes = defaultTypes; 
    }
    
    private TypeInfo findInfo(String name) {
        TypeInfo type = defaultTypes.get(name);
        if (type == null) {
            throw new RuntimeException("Unknown type: " + name);
        }
        return type;
    }

    private ParametricType newVoidType() {
        return new ParametricType(findInfo("Void"), new ArrayList<PacioliType>());   
    }

    private ParametricType newBooleType() {
        return new ParametricType(findInfo("Boole"), new ArrayList<PacioliType>());   
    }
    
    private ParametricType newStringType() {
        return new ParametricType(findInfo("String"), new ArrayList<PacioliType>());   
    }
    
    private ParametricType newTupleType(List<PacioliType> args) {
        return new ParametricType(findInfo("Tuple"), args);   
    }

    
    public Typing typingAccept(Node node) {
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
        PacioliType resultType = new TypeVar();
        Typing typing = new Typing(resultType);

        // Infer the argument's typings. Keep the types and
        // add the contraints to the result typing.
        List<PacioliType> argTypes = new ArrayList<PacioliType>();
        for (ExpressionNode arg : node.arguments) {
            Typing argTyping = typingAccept(arg);
            argTypes.add(argTyping.getType());
            typing.addConstraintsAndAssumptions(argTyping);
        }
        
        // The nmode product is special. It requires that the type
        // is known (no variables) because it needs to manipulate indices.
        if (node.hasName("nmode")) {
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
                    PacioliType tensorPacioliType = tensorTyping.solve(false);
                    tensorType = (MatrixType) tensorPacioliType;
                } catch (Exception ex) {
                    throw new PacioliException(tensorNode.getLocation(), 
                            "First argument of nmode must have a valid matrix type: %s",
                            ex.getMessage());
                }
                
                // Try to get the type of the matrix parameter 
                try {
                    Typing matrixTyping = typingAccept(node.arguments.get(2));
                    PacioliType matrixPacioliType = matrixTyping.solve(false);
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
                        shape.add(def.get().items.size());   
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
        } else {
            
            // Infer the typing of the function. Add its contraints
            // to the result typing.
            Typing funTyping = typingAccept(node.function);
            typing.addConstraintsAndAssumptions(funTyping);
    
            // Create a function type from the argument types to the type variable
            // that was put in the result type.
            PacioliType funType = new FunctionType(newTupleType(argTypes), resultType);
    
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
        returnNode(new Typing(node.typeNode.evalType(true)));
    }

    @Override
    public void visit(IdentifierNode node) {

        ValueInfo info = node.getInfo();
        
        if (!info.inferredType.isPresent()) {
            // It must be a recursive function. Todo: handle properly
            if (node.getInfo().getDeclaredType().isPresent()) {
            returnNode(new Typing(node.getInfo().getDeclaredType().get().evalType(true).instantiate()));
            } else {
                throw new RuntimeException("Identifier node has no declared type", new PacioliException(node.getLocation(), "id=%s", node.getName()));
            }
        } else
            if (info.isGlobal()) {
                // Move instantiate to proper place.
                if (node.getInfo().getDeclaredType().isPresent()) {
                    returnNode(new Typing(node.getInfo().getDeclaredType().get().evalType(true).instantiate()));
                } else {
                    returnNode(new Typing(node.getInfo().inferredType().instantiate()));
                }
            }
            else {
                Pacioli.logln("IFERRING LOCAL %s type inference in identifier node.",
                        info.name());
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

        PacioliType voidType = newVoidType();

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
            typeIds.add(new TypeIdentifier(info.generic().getModule(), node.indexSets.get(i)));
            typeInfos.add(info);
        }

        // Create a typing with an index type from the type identifies.
        returnNode(new Typing(new IndexType(typeIds, typeInfos)));
    }

    @Override
    public void visit(LambdaNode node) {

        // A list for the argument types
        List<PacioliType> argTypes = new ArrayList<PacioliType>();

        for (String arg : node.arguments) {

            // Create the type variable and add it to the list
            String freshName = node.table.freshSymbolName(); 
            PacioliType freshType = new TypeVar(freshName);
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
        typing.addConstraintsAndAssumptions(bodyTyping);

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
        PacioliType voidType = newVoidType();
        Typing valueTyping = typingAccept(node.value);
        Typing typing = new Typing(voidType);
        typing.addConstraintsAndAssumptions(valueTyping);
        typing.addConstraint(node.resultInfo.inferredType(), valueTyping.getType(), "the types of returned values must agree");
        returnNode(typing);
    }

    @Override
    public void visit(SequenceNode node) {
        PacioliType voidType = newVoidType();
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

        for (String name : node.table.localNames()) {
            ValueInfo info = node.table.lookup(name);
            info.setinferredType(new TypeVar());
        }

        PacioliType resultType = new TypeVar();

        //ValueInfo resultInfo = node.table.lookup("result");
        ValueInfo resultInfo = node.resultInfo;
        resultInfo.setinferredType(resultType);

        PacioliType voidType = newVoidType();
        Typing typing = new Typing(resultType);
        Typing itemTyping = typingAccept(node.body);
        typing.addConstraint(voidType, itemTyping.getType(), "A statement must have type Void()");
        typing.addConstraintsAndAssumptions(itemTyping);
        returnNode(typing);
    }

    @Override
    public void visit(StringNode stringNode) {

        // Return a typing with type string
        returnNode(new Typing(newStringType()));
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        
        List<PacioliType> varTypes = new ArrayList<PacioliType>();
        for (IdentifierNode var : node.vars) {
            varTypes.add(var.getInfo().inferredType());
        }      
        PacioliType tupleType = newTupleType(varTypes);
        
        
        PacioliType voidType = newVoidType();
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
    
    @Override
    public void visit(LetNode node) {
        List<PacioliType> argTypes = new ArrayList<PacioliType>();

        for (BindingNode binding: node.binding) {
            assert(binding instanceof LetBindingNode);
            LetBindingNode letBinding = (LetBindingNode) binding;
            //binding.accept(this);
             Typing bindingTyping = typingAccept(letBinding);
             ValueInfo info = node.table.lookup(letBinding.var);
             // Create the type variable and add it to the list
             String freshName = node.table.freshSymbolName(); 
             PacioliType freshType = new TypeVar(freshName);
             //argTypes.add(freshType);
             info.setinferredType(freshType);
        }

        // Infer the body's typing
        Typing bodyTyping = typingAccept(node.body);

        // Create a typing for the lambda and add the constraints from the body's
        // inference
//        Typing typing = new Typing(new FunctionType(newTupleType(argTypes), bodyTyping.getType()));
  //      typing.addConstraintsAndAssumptions(bodyTyping);

        returnNode(bodyTyping);
        //throw new RuntimeException("todo");

    }

    @Override
    public void visit(LetBindingNode node) {
        returnNode(typingAccept(node.value));
        //node.value.accept(this);
        //throw new RuntimeException("todo");
    }

    @Override
    public void visit(LetTupleBindingNode node) {
        node.value.accept(this);
        throw new RuntimeException("todo");
    }
    
    @Override
    public void visit(LetFunctionBindingNode node) {
        node.body.accept(this);
        throw new RuntimeException("todo");
    }
}
