package pacioli.visitors;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.PacioliException;
import pacioli.ast.Visitor;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.Schema;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
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
import pacioli.types.matrix.BangBase;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;
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
        Unit rowUnit;

        // Find index set info. The node must have been resolved.
        IndexSetInfo indexInfo = (IndexSetInfo) node.indexSet.info;
        assert (indexInfo != null);

        // Create the index type. If no definition exists it is a variable.
        String indexSetName = node.indexSetName();
        if (indexInfo.definition == null) {
            indexType = new IndexType(new TypeVar("for_index", indexSetName));
        } else {
            indexType = new IndexType(new TypeIdentifier(indexInfo.generic().module, indexSetName));
        }

        // Create the row unit if it exists, otherwise the unit is 1.
        if (node.unit == null) {
            rowUnit = Unit.ONE;
        } else {

            // Find the unit info. The node must have been resolved.
            UnitInfo unitInfo = (UnitInfo) node.unit.info;
            assert (unitInfo != null);

            // Create the unit. If no definition exists it is a variable.
            String unitName = node.unitVecName();
            if (unitInfo.definition == null) {
                rowUnit = new TypeVar("for_unit", indexSetName + "!" + unitName);
            } else {
                rowUnit = new BangBase(new TypeIdentifier(indexInfo.generic().module, indexSetName),
                        new TypeIdentifier(unitInfo.generic().module, unitName), 0);
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
        returnType(new MatrixType(Unit.ONE));
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
                returnType(types.get(0));
            } else {
                List<TypeIdentifier> names = new ArrayList<TypeIdentifier>();
                for (int i = 0; i < types.size(); i++) {
                    PacioliType type = types.get(i);
                    assert (type instanceof TypeVar || type instanceof MatrixType);
                    if (type instanceof MatrixType) {
                        assert (node.args.get(i) instanceof TypeIdentifierNode);
                        TypeIdentifier id = ((TypeIdentifierNode) node.args.get(i)).typeIdentifier();
                        names.add(id);
                    } else {
                        throw new RuntimeException(String.format("Index set expected but found '%s'", type.toText()));
                    }
                }
                returnType(new IndexType(names));
            }
        } else {

            // Experiment with type definitions.
            // Open the type if it is from the local module.
            // See also reduction on types.

            // Definition definition = node.op.getDefinition();
            Definition definition = node.op.info.getDefinition();

            if (definition == null) {
                returnType(new ParametricType(node.getName(), types));
            } else {

                assert (definition instanceof TypeDefinition);
                TypeDefinition typeDefinition = (TypeDefinition) definition;

                // if (reduce && definition.getModule() == node.op.home()) {
                if (reduce && !node.op.info.generic().isExternal()) {
                    try {
                        returnType(typeDefinition.constaint(true).reduce(new ParametricType(typeDefinition, types)));
                    } catch (PacioliException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    returnType(new ParametricType(typeDefinition, types));
                }
            }
        }
    }

    @Override
    public void visit(TypeIdentifierNode node) {

        // Find identifier info. The node must have been resolved.
        SymbolInfo info = node.info;
        assert (info != null);

        // If it has no definition it is a variable.
        Definition definition = info.getDefinition();
        if (definition == null) {

            // Create a type for each different kind of type variable
            if (info instanceof TypeInfo) {
                returnType(new TypeVar("for_type", node.getName()));
            } else if (info instanceof UnitInfo) {
                returnType(new MatrixType(new TypeVar("for_unit", node.getName())));
            } else if (info instanceof IndexSetInfo) {
                returnType(new IndexType(new TypeVar("for_index", node.getName())));
            } else {
                throw new RuntimeException("Unknown kind");
            }
        } else if (definition instanceof AliasDefinition) {
            // todo: rewrite evalBody
            returnType(new MatrixType(((AliasDefinition) definition).evalBody()));
            //throw new RuntimeException("fixme");
        } else {
            returnType(new MatrixType(new StringBase(node.getName())));
        }
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        returnType(new MatrixType(new StringBase(node.prefix.getName(), node.unit.getName())));
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
                throw new RuntimeException(String.format("Cannot divide %s by %s", left.toText(), right.toText()));
            }
        }
    }

    @Override
    public void visit(TypePowerNode node) {
        returnType(matrixTypeAccept(node.base).raise(new Fraction(Integer.parseInt(node.power.toText()))));
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
