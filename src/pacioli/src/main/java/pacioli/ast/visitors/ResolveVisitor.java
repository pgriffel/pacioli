/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli.ast.visitors;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Stack;

import mvm.values.matrix.IndexSet;
import mvm.values.matrix.MatrixDimension;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.InstanceDefinition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.DataDefinitionNode;
import pacioli.ast.expression.DataQueryNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.ForNode;
import pacioli.ast.expression.ForTupleNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.sugar.LetFunctionBindingNode;
import pacioli.ast.sugar.LetTupleBindingNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.ReturnVoidNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.TypeInfo;
import pacioli.symboltable.info.TypeVarInfo;
import pacioli.symboltable.info.UnitInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.symboltable.info.VectorBaseInfo;
import pacioli.symboltable.info.ValueInfo.Builder;
import pacioli.types.TypeContext;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.QuantNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.TypeIdentifier;

public class ResolveVisitor extends IdentityVisitor {

    private PacioliFile file;

    private Deque<SymbolTable<TypeInfo>> typeTables = new ArrayDeque<>();
    private Deque<SymbolTable<ValueInfo>> valueTables = new ArrayDeque<>();

    private Stack<String> statementResult;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    public ResolveVisitor(PacioliFile file, PacioliTable env) {
        statementResult = new Stack<String>();
        typeTables.push(env.types());
        valueTables.push(env.values());
        this.file = file;
    }

    // -------------------------------------------------------------------------
    // Visitors
    // -------------------------------------------------------------------------

    @Override
    public void visit(AliasDefinition node) {
        node.id.accept(this);
        node.unit.accept(this);
    }

    @Override
    public void visit(Declaration node) {
        node.id.accept(this);
        node.typeNode.accept(this);
    }

    @Override
    public void visit(IndexSetDefinition node) {
        node.id.accept(this);
        if (node.isDynamic()) {
            node.body().accept(this);
        }
    }

    @Override
    public void visit(Toplevel node) {
        node.body.accept(this);
    }

    @Override
    public void visit(TypeDefinition node) {
        pushTypeContext(node.createContext(), node.location());
        node.lhs.accept(this);
        node.rhs.accept(this);
        typeTables.pop();
    }

    @Override
    public void visit(UnitDefinition node) {
        if (node.body.isPresent()) {
            node.body.get().accept(this);
        }
    }

    @Override
    public void visit(UnitVectorDefinition node) {
        node.indexSetNode.accept(this);
        for (UnitDecl entry : node.items) {
            entry.value.accept(this);
        }
    }

    @Override
    public void visit(ValueDefinition node) {
        node.id.accept(this);
        node.body.accept(this);
    }

    @Override
    public void visit(ClassDefinition node) {
        for (String memberName : node.memberNames()) {
            SchemaNode schemaNode = node.memberSchemaNode(memberName);
            pushTypeContext(schemaNode.createContext(), node.location());
            schemaNode.table = typeTables.peek();
            schemaNode.type.accept(this);
            typeTables.pop();
        }
    }

    @Override
    public void visit(InstanceDefinition node) {
        throw new UnsupportedOperationException(
                "Resolving class instances is part of type class resolving. This should not be called.");
    }

    public void visit(LambdaNode node) {

        // Create the node's symbol table
        node.table = new SymbolTable<ValueInfo>(valueTables.peek());

        // Create a symbol info record for each lambda parameter and store it in the
        // table
        for (String arg : node.arguments) {
            // TODO: check that definition is left empty is okay
            Builder builder = ValueInfo.builder()
                    .name(arg)
                    .file(file)
                    .isGlobal(false)
                    .isMonomorphic(true)
                    .location(node.location())
                    .isPublic(false);
            node.table.put(arg, builder.build());
        }

        // Push the symboltable on the stack and resolve the body
        valueTables.push(node.table);
        node.expression.accept(this);
        valueTables.pop();
    }

    public void visit(ForTupleNode node) {

        node.items.accept(this);
        node.lambdaBody.accept(this);

        // Create the node's symbol table
        node.table = new SymbolTable<ValueInfo>(valueTables.peek());

        // Create a symbol info record for each lambda parameter and store it in the
        // table
        for (IdentifierNode arg : node.vars) {
            // TODO: check that definition is left empty is okay
            Builder builder = ValueInfo.builder()
                    .name(arg.name())
                    .file(file)
                    .isGlobal(false)
                    .isMonomorphic(true)
                    .location(node.location())
                    .isPublic(false);
            node.table.put(arg.name(), builder.build());
        }

        // Push the symboltable on the stack and resolve the body
        valueTables.push(node.table);
        node.body.accept(this);
        valueTables.pop();
    }

    public void visit(ForNode node) {

        node.items.accept(this);
        node.lambdaBody.accept(this);

        // Create the node's symbol table
        node.table = new SymbolTable<ValueInfo>(valueTables.peek());

        // Create a symbol info record for each lambda parameter and store it in the
        // table
        String arg = node.var.name();
        // TODO: check that definition is left empty is okay
        Builder builder = ValueInfo.builder()
                .name(arg)
                .file(file)
                .isGlobal(false)
                .isMonomorphic(true)
                .location(node.location())
                .isPublic(false);
        node.table.put(arg, builder.build());

        // Push the symboltable on the stack and resolve the body
        valueTables.push(node.table);
        node.body.accept(this);
        valueTables.pop();
    }

    @Override
    public void visit(IdentifierNode node) {

        // Lookup the info record
        ValueInfo info = valueTables.peek().lookup(node.name());

        // Check that it exists
        if (info == null) {
            if (!node.isResolved()) {
                visitorThrow(node.location(), "Identifier '%s' unknown", node.name());
            }
        } else {
            // Store the record in the identifier
            node.setInfo(info);
        }

    }

    @Override
    public void visit(ApplicationNode node) {
        node.function.accept(this);

        if (node.function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) node.function;
            if (id.info().definition().isPresent()) {
                ValueDefinition def = (ValueDefinition) id.info().definition().get();
                if (def.body instanceof LambdaNode) {
                    LambdaNode lambda = (LambdaNode) def.body;
                    if (lambda.arguments.size() != node.arguments.size() && !lambda.varArgs) {
                        throw new RuntimeException("Cannot resolve",
                                new PacioliException(node.location(),
                                        "Number of arguments %s do not match required %s",
                                        node.arguments.size(),
                                        lambda.arguments.size()));
                    }
                }
            }
        }

        for (ExpressionNode argument : node.arguments) {
            argument.accept(this);
        }
    }

    @Override
    public void visit(AssignmentNode node) {

        // Find the info. It should have been created in a statement node.
        ValueInfo info = valueTables.peek().lookup(node.var.name());
        assert (info != null);

        // Store the info in the variable and resolve the value
        node.var.setInfo(info);
        node.value.accept(this);
    }

    @Override
    public void visit(KeyNode node) {

        List<IndexSetInfo> infoList = new ArrayList<IndexSetInfo>();
        for (String name : node.indexSets) {
            TypeInfo symbolInfo = typeTables.peek().lookup(name);
            if (symbolInfo instanceof IndexSetInfo) {
                IndexSetInfo info = (IndexSetInfo) symbolInfo;
                infoList.add(info);
            } else {
                throw new RuntimeException(String.format("%s", name));
            }
        }

        node.setInfos(infoList);
    }

    public MatrixDimension compileTimeMatrixDimension(IndexType dimType) {
        if (dimType.isVar()) {
            return null;
        } else {
            List<IndexSet> sets = new ArrayList<IndexSet>();
            for (TypeIdentifier id : dimType.getIndexSets()) {
                TypeInfo symbolInfo = typeTables.peek().lookup(id.name());
                if (symbolInfo instanceof IndexSetInfo) {
                    IndexSetInfo indexSetInfo = (IndexSetInfo) symbolInfo;
                    assert (indexSetInfo != null); // exception throwen
                    assert (indexSetInfo.definition().isPresent());
                    if (indexSetInfo.definition().get().isDynamic()) {
                        // Hack to handle dynamic index sets
                        return null;
                    }
                    sets.add(indexSetInfo.definition().get().indexSet());
                } else {
                    throw new RuntimeException(String.format("%s", id.name()));
                }
            }
            return new MatrixDimension(sets);
        }
    }

    @Override
    public void visit(MatrixTypeNode node) {

        // Resolve the matrix type
        node.typeNode.accept(this);

        // // Evaluate the matrix type
        MatrixType matrixType;
        try {
            matrixType = node.evalType();
        } catch (PacioliException e) {
            throw new RuntimeException("Type error", e);
        }

        // Store the matrix type's row and column dimension
        node.rowDim = compileTimeMatrixDimension(matrixType.rowDimension());
        node.columnDim = compileTimeMatrixDimension(matrixType.columnDimension());
        // node.rowDim = matrixType.rowDimension;
        // node.columnDim = matrixType.columnDimension;

        // Check that the dimensions exist
        // if (node.rowDim == null || node.columnDim == null) {
        // visitorThrow(node.typeNode.getLocation(), "Expected a closed matrix type");
        // }
    }

    @Override
    public void visit(ConversionNode node) {

        // Resolve the matrix type
        node.typeNode.accept(this);

        // Evaluate the matrix type
        MatrixType matrixType;
        try {
            matrixType = node.evalType();
        } catch (PacioliException e) {
            throw new RuntimeException("Type error", e);
        }

        // Store the matrix type's row and column dimension
        node.rowDim = compileTimeMatrixDimension(matrixType.rowDimension());
        node.columnDim = compileTimeMatrixDimension(matrixType.columnDimension());

        // Check that the dimensions exist
        if (node.rowDim == null || node.columnDim == null) {
            visitorThrow(node.typeNode.location(), "Expected a closed matrix type");
        }
    }

    @Override
    public void visit(MatrixLiteralNode node) {

        // Resolve the matrix type
        node.typeNode.accept(this);

        // Evaluate the matrix type
        MatrixType matrixType;
        try {
            matrixType = node.evalType();
        } catch (PacioliException e) {
            throw new RuntimeException("Type error", e);
        }

        // Store the matrix type's row and column dimension
        node.rowDim = compileTimeMatrixDimension(matrixType.rowDimension());
        node.columnDim = compileTimeMatrixDimension(matrixType.columnDimension());

        // Check that the dimensions exist
        if (node.rowDim == null || node.columnDim == null) {
            visitorThrow(node.typeNode.location(), "Expected a closed matrix type");
        }
    }

    @Override
    public void visit(ReturnNode node) {
        if (statementResult.isEmpty()) {
            throw new RuntimeException("No result place for return");
        } else {
            // Pick up the name for the result place that was set by the StatementNode
            // visit.
            String resultName = statementResult.peek();
            assert (resultName != null);

            // Find the info for the result place
            SymbolTable<ValueInfo> table = new SymbolTable<ValueInfo>(valueTables.peek());
            ValueInfo info = table.lookup(resultName);
            assert (info != null);

            // Store the info for later use.
            node.resultInfo = info;

            // Recur
            node.value.accept(this);
        }
    }

    @Override
    public void visit(ReturnVoidNode node) {
        if (statementResult.isEmpty()) {
            throw new RuntimeException("No result place for return");
        } else {

            // Pick up the name for the result place that was set by the StatementNode
            // visit.
            String resultName = statementResult.peek();
            assert (resultName != null);

            // Find the info for the result place
            SymbolTable<ValueInfo> table = new SymbolTable<ValueInfo>(valueTables.peek());
            ValueInfo info = table.lookup(resultName);
            assert (info != null);

            // Store the info for later use.
            node.resultInfo = info;
        }
    }

    @Override
    public void visit(StatementNode node) {

        ReturnNode returnsValueWitness = null;
        ReturnVoidNode returnsVoiditness = null;

        // TODO: locallyAssignedVariables can be solved with this loop.
        for (Node nd : node.body.mutatingStatements()) {
            if (nd instanceof AssignmentNode as) {
            } else if (nd instanceof ReturnNode as) {
                returnsValueWitness = as;
            } else if (nd instanceof ReturnVoidNode as) {
                returnsVoiditness = as;
            } else if (nd instanceof TupleAssignmentNode as) {
            } else {
            }
        }

        if (returnsValueWitness != null && returnsVoiditness != null) {
            throw new PacioliException(returnsValueWitness.location(),
                    "Cannot return a value while there is an empty return in %s",
                    returnsVoiditness.location().description());
        }

        node.isVoid = returnsValueWitness == null;

        // Create a symbol table for all assigned variables in scope and the result
        // place, and a table for the shadowed variables
        node.table = new SymbolTable<ValueInfo>(valueTables.peek());
        node.shadowed = new SymbolTable<ValueInfo>();

        // Find all assigned variables
        for (IdentifierNode id : node.body.locallyAssignedVariables()) {

            ValueInfo info = node.table.lookupLocally(id.name());

            // Create a value info record for the mutable (IsRef == true) variable
            if (info == null) { // Equality in the set is not on names. The set does not make sense.
                info = ValueInfo.builder()
                        .name(id.name())
                        .file(file)
                        .isGlobal(false)
                        .isMonomorphic(false)
                        .location(id.location())
                        .isPublic(false)
                        .isRef(true)
                        .build();

                // If it shadows another value then remember that for initialization in
                // generated code
                ValueInfo shadowedInfo = valueTables.peek().lookup(id.name());
                if (shadowedInfo != null) {

                    if (!shadowedInfo.isGlobal()) {
                        node.shadowed.put(id.name(), shadowedInfo);
                    }

                }

                // Put the info in the symbol table
                node.table.put(id.name(), info);
            }
        }

        // Create a place for the statement result
        String resultName = node.table.freshSymbolName();

        // Create an info record for the result and put it in the symbol table
        ValueInfo info = ValueInfo.builder()
                .name(resultName)
                .file(file)
                .isGlobal(false)
                .isMonomorphic(false)
                .location(node.location())
                .isPublic(false)
                .build();
        node.table.put(resultName, info);
        node.resultInfo = info;

        // Resolve the body
        statementResult.push(resultName);
        valueTables.push(node.table);
        node.body.accept(this);
        valueTables.pop();
        statementResult.pop();
    }

    @Override
    public void visit(TupleAssignmentNode node) {

        // Guessed fixme based on assignment above:

        // Find the info. It should have been created in a statement node.
        for (IdentifierNode var : node.vars) {
            ValueInfo info = valueTables.peek().lookup(var.name());
            assert (info != null);

            // Store the info in the variable and resolve the value
            var.setInfo(info);

        }
        node.tuple.accept(this);

        /*
         * // Fixme (fixed above?)
         * List<IdentifierNode> resolvedVars = new ArrayList<IdentifierNode>();
         * for (IdentifierNode var : node.vars) {
         * IdentifierNode resolved = IdentifierNode.newLocalMutableVar(var.getName(),
         * var.getLocation());
         * resolvedVars.add(resolved);
         * }
         * // ExpressionNode resolvedTuple = expAccept(node.tuple);
         * node.tuple.accept(this);
         * // returnNode(new TupleAssignmentNode(node.getLocation(), resolvedVars,
         * // resolvedTuple));
         * 
         */
    }

    @Override
    public void visit(BangTypeNode node) {

        Info indexSetInfo = typeTables.peek().lookup(node.indexSetName());
        if (indexSetInfo == null) {
            throw new RuntimeException("Name error",
                    new PacioliException(node.location(), "Index set %s unknown", node.indexSetName()));
        }
        node.indexSet().info = indexSetInfo;

        if (node.unit().isPresent()) {
            String fullName = node.indexSetName() + "!" + node.unitVecName();

            Info unitInfo = typeTables.peek().lookup(fullName);
            if (unitInfo == null) {
                throw new RuntimeException("Name error",
                        new PacioliException(node.location(), "Vector unit %s unknown", fullName));
            }
            node.unit().get().info = unitInfo;
        }
    }

    @Override
    public void visit(SchemaNode node) {

        pushTypeContext(node.createContext(), node.location());
        node.table = typeTables.peek();
        for (QuantNode quantNode : node.quantNodes) {
            quantNode.accept(this);
        }
        node.type.accept(this);
        typeTables.pop();
    }

    private void pushTypeContext(TypeContext context, Location location) {

        // Create the node's symbol table
        SymbolTable<TypeInfo> table = new SymbolTable<TypeInfo>(typeTables.peek());

        // Add info records for all variables
        for (String arg : context.typeVars()) {
            table.put(arg, new TypeVarInfo(arg, file, false, false, location));
        }
        for (String arg : context.opVars()) {
            table.put(arg, new ParametricInfo(arg, file, false, false, location));
        }
        for (String arg : context.indexVars()) {
            table.put(arg, new IndexSetInfo(arg, file, false, false, location));
        }
        for (String arg : context.unitVars()) {
            if (arg.contains("!")) {
                table.put(arg, new VectorBaseInfo(arg, file, false, false, location));
            } else {
                table.put(arg, new ScalarBaseInfo(arg, file, false, false, location, ""));
            }

        }

        // Store the table
        typeTables.push(table);

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

        // Find the node's name
        String name = node.name();

        // Lookup the name in the symbol table stack and check it's existence
        Info typeInfo = typeTables.peek().lookup(name);
        if (typeInfo == null) {
            visitorThrow(node.location(), "Type identifier %s unknown", name);
        }

        node.info = typeInfo;
    }

    /*
     * @Override public void visit(TypePowerNode typePowerNode) throws
     * PacioliException { // TODO Auto-generated method stub throw new
     * RuntimeException("todo bangtype"); }
     * 
     * @Override public void visit(PrefixUnitTypeNode prefixUnitTypeNode) throws
     * PacioliException { // TODO Auto-generated method stub throw new
     * RuntimeException("todo bangtype"); }
     * 
     * @Override public void visit(TypeMultiplyNode typeMultiplyNode) throws
     * PacioliException { // TODO Auto-generated method stub throw new
     * RuntimeException("todo bangtype"); }
     * 
     * @Override public void visit(TypeDivideNode typeDivideNode) throws
     * PacioliException { // TODO Auto-generated method stub throw new
     * RuntimeException("todo bangtype"); }
     * 
     * @Override public void visit(TypeKroneckerNode typeKroneckerNode) throws
     * PacioliException { // TODO Auto-generated method stub throw new
     * RuntimeException("todo bangtype"); }
     * 
     * @Override public void visit(TypePerNode typePerNode) throws PacioliException
     * { // TODO Auto-generated method stub throw new
     * RuntimeException("todo bangtype"); }
     */

    @Override
    public void visit(UnitIdentifierNode node) {
        TypeInfo symbolInfo = typeTables.peek().lookup(node.name());
        UnitInfo unitInfo = (UnitInfo) symbolInfo;
        if (unitInfo == null) {
            throw new RuntimeException("Name error",
                    new PacioliException(node.location(), "unit %s unknown", node.name()));
        }
        node.info = unitInfo;
    }

    @Override
    public void visit(LetNode node) {

        // Create the node's symbol table
        node.table = new SymbolTable<ValueInfo>(valueTables.peek());

        // Create a symbol info record for each lambda parameter and store it in the
        // table
        node.binding.accept(this);
        assert (node.binding instanceof LetBindingNode);
        LetBindingNode functionBinding = (LetBindingNode) node.binding;
        String arg = functionBinding.var;

        ValueInfo info = ValueInfo.builder()
                .name(arg)
                .file(file)
                .isGlobal(false)
                .isMonomorphic(false)
                .location(node.location())
                .isPublic(false)
                .build();

        // todo: set the definition!!!!!!!
        // Pacioli.logln("SKIPPING definitions in LetNode resolve!!!!!!!!");

        node.table.put(arg, info);

        // Push the symboltable on the stack and resolve the body
        valueTables.push(node.table);
        node.body.accept(this);
        valueTables.pop();
    }

    @Override
    public void visit(LetBindingNode node) {
        node.value.accept(this);
    }

    @Override
    public void visit(LetTupleBindingNode node) {
        node.value.accept(this);
        throw new RuntimeException("todo");
    }

    @Override
    public void visit(LetFunctionBindingNode node) {
        throw new PacioliException(node.location(), "obsolete");
    }

    @Override
    public void visit(DataDefinitionNode node) {
        node.declaredType.accept(this);
    }

    @Override
    public void visit(DataQueryNode node) {
        node.source.accept(this);
        // for (ExpressionNode expr : node.contraDims) {
        // expr.accept(this);
        // }
        // for (ExpressionNode expr : node.coDims) {
        // expr.accept(this);
        // }
        // node.condition.accept(this);
    }
}
