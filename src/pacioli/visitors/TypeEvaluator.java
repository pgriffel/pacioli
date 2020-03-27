package pacioli.visitors;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Stack;

import pacioli.PacioliException;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Visitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarUnitInfo;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.VectorUnitInfo;
import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeBase;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.VectorUnitVar;
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
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.ScalarBase;
import pacioli.types.matrix.VectorBase;
import uom.Fraction;
import uom.Unit;

public class TypeEvaluator extends IdentityVisitor implements Visitor {

    private Stack<PacioliType> typeStack;
    private Boolean reduce;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    public TypeEvaluator(Boolean reduce) {
        typeStack = new Stack<PacioliType>();
        this.reduce = reduce;
    }

    // -------------------------------------------------------------------------
    // Accept and return methods
    // -------------------------------------------------------------------------

    public PacioliType typeAccept(TypeNode child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return typeStack.pop();
    }

    public MatrixType matrixTypeAccept(TypeNode child) {
        // Pacioli.logln("matrix accept: %s", child.getClass());
        child.accept(this);
        PacioliType type = typeStack.pop();
        assert (type instanceof MatrixType);
        return (MatrixType) type;
    }

    public void returnType(PacioliType value) {
        // Pacioli.logln("return: %s", value.getClass());
        typeStack.push(value);
    }

    // -------------------------------------------------------------------------
    // Visit methods
    // -------------------------------------------------------------------------

    @Override
    public void visit(BangTypeNode node) {

        // The index type and row unit for the to be created matrix type
        IndexType indexType;
        Unit<TypeBase> rowUnit;

        // Find index set info. The node must have been resolved.
        IndexSetInfo indexInfo = (IndexSetInfo) node.indexSet.info;
        assert (indexInfo != null);

        // Create the index type. If it is a local it is a variable.
        String indexSetName = node.indexSetName();
        if (!indexInfo.isGlobal()) {    
            indexType = new IndexType(new IndexSetVar(indexInfo));
        } else {
            indexType = new IndexType(new TypeIdentifier(indexInfo.generic().getModule(), indexSetName), indexInfo);
        }

        // Create the row unit if it exists, otherwise the unit is 1.
        if (!node.unit.isPresent()) {
            rowUnit = TypeBase.ONE;
        } else {

            // Find the unit info. The node must have been resolved.
            VectorUnitInfo unitInfo = (VectorUnitInfo) node.unit.get().info;
            assert (unitInfo != null);

            // Create the unit. If it is a local then it is a variable.
            if (!unitInfo.isGlobal()) {
                rowUnit = new VectorUnitVar(unitInfo);
            } else {
                String unitName = node.unitVecName();
                rowUnit = new VectorBase(new TypeIdentifier(indexInfo.generic().getModule(), indexSetName),
                                         new TypeIdentifier(unitInfo.generic().getModule(), unitName), 0, unitInfo);
            }
        }

        returnType(new MatrixType(indexType, rowUnit));
    }

    @Override
    public void visit(FunctionTypeNode node) {
        returnType(new FunctionType(typeAccept(node.domain), typeAccept(node.range)));
    }

    @Override
    public void visit(NumberTypeNode node) {
        if (!new BigDecimal(node.number).equals(BigDecimal.ONE)) {
            visitorThrow(node.getLocation(), "Didn't expect number, just a 1");
        }
        returnType(new MatrixType(TypeBase.ONE));
    }

    @Override
    public void visit(SchemaNode node) {
        returnType(new Schema(node.context.typeVars(), typeAccept(node.type)));
    }

    @Override
    public void visit(TypeApplicationNode node) {

        // Evaluate the arguments
        List<PacioliType> types = new ArrayList<PacioliType>();
        for (TypeNode arg : node.args) {
            types.add(typeAccept(arg));
        }

        // The Index type is special
        if (node.getName().equals("Index")) {
            if (types.size() == 1 && types.get(0) instanceof TypeVar) {
                
                // It is an index variable. Just return the var.
                returnType(types.get(0));
            } else {
                
                // It is a list of TypeIdentifierNode. Create a list of
                // type identifiers from it and create an IndexType from them.
                
                // Todo: Test this code. Was rewritten without test coverage.
                
                List<TypeIdentifier> names = new ArrayList<TypeIdentifier>();
                List<IndexSetInfo> infos = new ArrayList<IndexSetInfo>();
                for (int i = 0; i < types.size(); i++) {
                    PacioliType type = types.get(i);
                    assert (type instanceof TypeVar || type instanceof MatrixType);
                    if (type instanceof MatrixType) {
                        assert (node.args.get(i) instanceof TypeIdentifierNode);
                        TypeIdentifierNode idNode = (TypeIdentifierNode) node.args.get(i);
                        IndexSetInfo info = (IndexSetInfo) idNode.info;
                        TypeIdentifier id = new TypeIdentifier(info.generic().getModule(), idNode.getName());
                        names.add(id);
                        infos.add(info);
                    } else {
                        throw new RuntimeException(String.format("Index set expected but found '%s'", type.pretty()));
                    }
                }
                returnType(new IndexType(names, infos));
            }
        } else {

            // Experiment with type definitions.
            // Open the type if it is from the local module.
            // See also reduction on types.

            // Definition definition = node.op.getDefinition();
            Optional<? extends Definition> definition = node.op.info.getDefinition();

            if (!definition.isPresent()) {
                //returnType(new ParametricType(node.getName(), types));
                returnType(new ParametricType((TypeInfo) node.op.info, types));
            } else {
                Boolean doReduce = reduce || true;   
                assert (definition.get() instanceof TypeDefinition);
                TypeDefinition typeDefinition = (TypeDefinition) definition.get();
                TypeNode rhs = typeDefinition.rhs;
                if (rhs instanceof TypeApplicationNode) {
                    TypeApplicationNode app = (TypeApplicationNode) rhs;
                    if (node.op.getName().equals(app.op.getName())) {
                        doReduce = false;
                    }
                }
                // if (reduce && definition.getModule() == node.op.home()) {
                //if (reduce && !node.op.info.generic().isExternal()) {
                if (doReduce) {
                    try {
                        //returnType(typeDefinition.constaint(true).reduce(new ParametricType(typeDefinition, types)));
                        returnType(typeDefinition.constaint(true).reduce(new ParametricType((TypeInfo) node.op.info, Optional.of(typeDefinition), types)));
                    } catch (PacioliException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    // todo: add info. Not done because it is unused
                    //returnType(new ParametricType(typeDefinition, types));
                    returnType(new ParametricType((TypeInfo) node.op.info, Optional.of(typeDefinition), types));
                }
            }
        }
    }

    @Override
    public void visit(TypeIdentifierNode node) {

        // Find identifier info. The node must have been resolved.
        SymbolInfo info = node.info;
        assert (info != null);

        // If it is local then it is a variable.
        Optional<? extends Definition> definition = info.getDefinition();
        if (!info.isGlobal()) {
            
            // Create a type for each different kind of type variable
            if (info instanceof TypeInfo) {
                returnType(new TypeVar((TypeInfo) info));
            } else if (info instanceof ScalarUnitInfo) {
                returnType(new MatrixType(new ScalarUnitVar((ScalarUnitInfo) info)));
            } else if (info instanceof VectorUnitInfo) {
                throw new RuntimeException("A unit vector should be a BangTypeNode, not a TypeIdentifier. That is for scalars");
            } else if (info instanceof IndexSetInfo) {
                returnType(new IndexType(new IndexSetVar((IndexSetInfo) info)));
            } else {
                throw new RuntimeException("Unknown kind");
            }
        } else if (definition.isPresent() && definition.get() instanceof AliasDefinition) {
            // todo: rewrite evalBody
            returnType(new MatrixType(((AliasDefinition) definition.get()).evalBody()));
            //throw new RuntimeException("fixme");
        } else {
            //returnType(new MatrixType(new ScalarBase(node.getName())));
            assert(info instanceof ScalarUnitInfo);
            returnType(new MatrixType(new ScalarBase((ScalarUnitInfo) info)));
        }
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        //returnType(new MatrixType(new ScalarBase(node.prefix.getName(), node.unit.getName())));
        // Todo: check this cast. Better let recursive visitor handle this: call something like unitAccept(node.unit) 
        returnType(new MatrixType(new ScalarBase(node.prefix.getName(), (ScalarUnitInfo) node.unit.info)));
    }

    @Override
    public void visit(TypeMultiplyNode node) {

        MatrixType left = matrixTypeAccept(node.left);
        MatrixType right = matrixTypeAccept(node.right);

        if (left.singleton()) {
            returnType(left.scale(right));
        } else if (right.singleton()) {
            returnType(right.scale(left));
        } else {
            assert (left.multiplyable(right));
            returnType(left.multiply(right));
        }
    }

    @Override
    public void visit(TypeDivideNode node) {

        MatrixType left = matrixTypeAccept(node.left);
        MatrixType right = matrixTypeAccept(node.right);

        if (left.singleton()) {
            returnType(left.scale(right.reciprocal()));
        } else if (right.singleton()) {
            returnType(right.reciprocal().scale(left));
        } else {
            if (left.multiplyable(right)) {
                returnType(left.multiply(right.reciprocal()));
            } else {
                throw new RuntimeException(String.format("Cannot divide %s by %s", left.pretty(), right.pretty()));
            }
        }
    }

    @Override
    public void visit(TypePowerNode node) {
        returnType(matrixTypeAccept(node.base).raise(new Fraction(Integer.parseInt(node.power.pretty()))));
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        try {
            returnType(matrixTypeAccept(node.left).kronecker(matrixTypeAccept(node.right)));
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void visit(TypePerNode node) {
        returnType(matrixTypeAccept(node.left).join(matrixTypeAccept(node.right).transpose().reciprocal()));
    }
}
