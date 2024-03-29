package pacioli.ast.visitors;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Stack;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ClassInfo;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.TypeVarInfo;
import pacioli.symboltable.info.VectorBaseInfo;
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
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypePerNode;
import pacioli.types.ast.TypePowerNode;
import pacioli.types.ast.TypePredicateNode;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.ScalarBase;
import pacioli.types.matrix.VectorBase;
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.Operator;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeBase;
import pacioli.types.type.TypeIdentifier;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;
import uom.Fraction;
import uom.Unit;

public class TypeEvaluator extends IdentityVisitor {

    private Stack<TypeObject> typeStack;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    public TypeEvaluator() {
        typeStack = new Stack<TypeObject>();
    }

    // -------------------------------------------------------------------------
    // Accept and return methods
    // -------------------------------------------------------------------------

    public TypeObject typeAccept(TypeNode child) {
        child.accept(this);
        return typeStack.pop();
    }

    public MatrixType matrixTypeAccept(TypeNode child) {
        child.accept(this);
        TypeObject type = typeStack.pop();
        assert (type instanceof MatrixType);
        return (MatrixType) type;
    }

    public void returnType(TypeObject value) {
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
        IndexSetInfo indexInfo = (IndexSetInfo) node.indexSet().info;
        assert (indexInfo != null);

        // Create the index type. If it is a local it is a variable.
        String indexSetName = node.indexSetName();
        if (!indexInfo.isGlobal()) {
            indexType = new IndexType(new IndexSetVar(indexInfo));
        } else {
            indexType = new IndexType(new TypeIdentifier(indexInfo.generalInfo().module(), indexSetName), indexInfo);
        }

        // Create the row unit if it exists, otherwise the unit is 1.
        if (!node.unit().isPresent()) {
            rowUnit = TypeBase.ONE;
        } else {

            // Find the unit info. The node must have been resolved.
            VectorBaseInfo unitInfo = (VectorBaseInfo) node.unit().get().info;
            assert (unitInfo != null);

            // Create the unit. If it is a local then it is a variable.
            if (!unitInfo.isGlobal()) {
                rowUnit = new VectorUnitVar(unitInfo);
            } else {
                String unitName = node.unitVecName();
                rowUnit = new VectorBase(new TypeIdentifier(indexInfo.generalInfo().module(), indexSetName),
                        new TypeIdentifier(unitInfo.generalInfo().module(), unitName), 0, unitInfo);
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
            visitorThrow(node.location(), "Didn't expect number, just a 1");
        }
        returnType(new MatrixType(TypeBase.ONE));
    }

    @Override
    public void visit(SchemaNode node) {
        List<TypePredicate> predicates = new ArrayList<>();
        for (QuantNode quantNode : node.quantNodes) {
            for (TypePredicateNode condition : quantNode.conditions) {
                List<TypeObject> argTypes = new ArrayList<>();
                for (TypeNode arg : condition.args) {
                    argTypes.add(typeAccept(arg));
                }
                TypePredicate predicate = new TypePredicate((ClassInfo) condition.id.info, argTypes);
                predicates.add(predicate);
            }
        }
        returnType(new Schema(node.createContext().variables(), typeAccept(node.type), predicates));
    }

    @Override
    public void visit(TypeApplicationNode node) {

        // Evaluate the arguments
        List<TypeObject> types = new ArrayList<TypeObject>();
        for (TypeNode arg : node.args) {
            types.add(typeAccept(arg));
        }

        // The Index type is special
        if (node.name().equals("Index")) {
            if (types.size() == 0) {
                List<TypeIdentifier> names = new ArrayList<TypeIdentifier>();
                List<IndexSetInfo> infos = new ArrayList<IndexSetInfo>();
                returnType(new IndexType(names, infos));
            } else if (true || types.size() == 1 && types.get(0) instanceof TypeVar) {

                if (types.size() != 1) {
                    throw new RuntimeException("Invalid index type",
                            new PacioliException(node.location(), "Invalid nr arguments: %s", types.size()));
                }

                // It is an index variable. Just return the var.
                returnType(types.get(0));
            } else {

                // It is a list of TypeIdentifierNode. Create a list of
                // type identifiers from it and create an IndexType from them.

                // Todo: Test this code. Was rewritten without test coverage.

                List<TypeIdentifier> names = new ArrayList<TypeIdentifier>();
                List<IndexSetInfo> infos = new ArrayList<IndexSetInfo>();
                for (int i = 0; i < types.size(); i++) {
                    TypeObject type = types.get(i);
                    assert (type instanceof TypeVar || type instanceof MatrixType);
                    if (type instanceof MatrixType) {
                        assert (node.args.get(i) instanceof TypeIdentifierNode);
                        TypeIdentifierNode idNode = (TypeIdentifierNode) node.args.get(i);
                        IndexSetInfo info = (IndexSetInfo) idNode.info;
                        TypeIdentifier id = new TypeIdentifier(info.generalInfo().module(), idNode.name());
                        names.add(id);
                        infos.add(info);
                    } else {
                        throw new RuntimeException(new PacioliException(node.location(),
                                "Index set expected but found '%s'", type.pretty()));
                    }
                }
                returnType(new IndexType(names, infos));
            }
        } else {
            this.handleParametric(node, types);
        }
    }

    private void handleParametric(TypeApplicationNode node, List<TypeObject> types) {

        Optional<? extends Definition> definition = node.op.info.definition();
        TypeObject opObject = typeAccept(node.op);
        if (!(opObject instanceof ParametricType || opObject instanceof OperatorVar)) {
            throw new PacioliException(node.location(), "Oeps");
        }
        Operator opType = opObject instanceof OperatorVar ? (OperatorVar) opObject : (((ParametricType) opObject).op());
        if (!definition.isPresent()) {
            if (!(node.op.info instanceof ParametricInfo)) {
                throw new RuntimeException("Expected type info",
                        new PacioliException(node.location(), "Invalid info"));
            }
            returnType(new ParametricType(node.location(), opType, types));
        } else {
            assert (definition.get() instanceof TypeDefinition);
            TypeDefinition typeDefinition = (TypeDefinition) definition.get();
            // TypeInfo typeInfo = (TypeInfo) node.op.info;
            // TypeInfo info = new TypeInfo(typeInfo.name(), null, typeInfo.isGlobal(),
            // node.getLocation());
            returnType(
                    new ParametricType(node.location(), typeDefinition, opType, types));
        }
    }

    @Override
    public void visit(TypeIdentifierNode node) {

        // Find identifier info. The node must have been resolved.
        Info info = node.info;
        assert (info != null);

        // If it is local then it is a variable.
        Optional<? extends Definition> definition = info.definition();
        if (!info.isGlobal()) {

            // Create a type for each different kind of type variable
            if (info instanceof TypeVarInfo) {
                returnType(new TypeVar((TypeVarInfo) info));
            } else if (info instanceof ParametricInfo) {
                returnType(new OperatorVar((ParametricInfo) info));
            } else if (info instanceof ScalarBaseInfo) {
                returnType(new MatrixType(new ScalarUnitVar((ScalarBaseInfo) info)));
            } else if (info instanceof VectorBaseInfo) {
                throw new RuntimeException(
                        "A unit vector should be a BangTypeNode, not a TypeIdentifier. That is for scalars");
            } else if (info instanceof IndexSetInfo) {
                returnType(new IndexSetVar((IndexSetInfo) info));
            } else {
                throw new RuntimeException("Unknown kind");
            }
        } else if (definition.isPresent() && definition.get() instanceof AliasDefinition) {
            // todo: rewrite evalBody
            returnType(new MatrixType(((AliasDefinition) definition.get()).evalBody()));
            // throw new RuntimeException("fixme");
        } else if (info instanceof IndexSetInfo) {
            IndexSetInfo indexSetInfo = (IndexSetInfo) info;
            TypeIdentifier id = new TypeIdentifier(indexSetInfo.generalInfo().module(), node.name());
            returnType(new IndexType(id, indexSetInfo));
        } else if (info instanceof ParametricInfo) {
            // TypeApplicationNode app = new TypeApplicationNode(node.getLocation(), node,
            // new LinkedList<TypeNode>());
            // this.handleParametric(app, new ArrayList<TypeObject>());
            // TypeApplicationNode app = new TypeApplicationNode(node.location(), node, new
            // LinkedList<TypeNode>());
            TypeIdentifier typeId = new TypeIdentifier(info.generalInfo().module(), node.name());
            OperatorConst id = new OperatorConst(typeId, (ParametricInfo) info);
            // this.handleParametric(app, new ArrayList<PacioliType>());
            returnType(new ParametricType(node.location(),
                    ((ParametricInfo) info).definition().orElse(null), // TODO: check orElse
                    id, new ArrayList<TypeObject>()));
        } else {
            assert (info instanceof ScalarBaseInfo);
            returnType(new MatrixType(new ScalarBase((ScalarBaseInfo) info)));
        }
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        // Todo: check this cast. Better let recursive visitor handle this: call
        // something like unitAccept(node.unit)
        returnType(new MatrixType(new ScalarBase(node.prefix.name(), (ScalarBaseInfo) node.unit.info)));
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
                throw new RuntimeException(new PacioliException(node.location(),
                        "Cannot divide %s by %s", left.pretty(), right.pretty()));
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
            throw new RuntimeException("Type error", e);
        }
    }

    @Override
    public void visit(TypePerNode node) {
        returnType(matrixTypeAccept(node.left).join(matrixTypeAccept(node.right).transpose().reciprocal()));
    }
}
