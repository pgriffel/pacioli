/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.ast.visitors;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Stack;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
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
import pacioli.types.matrix.IndexList;
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

        // this.handleParametric(node, types);
        Info nodeOpInfo = node.op.info;

        if (nodeOpInfo instanceof ParametricInfo opInfo) {

            TypeIdentifier typeId = new TypeIdentifier(opInfo.generalInfo().module(), node.op.name());
            Operator operator = opInfo.isGlobal() ? new OperatorConst(typeId, opInfo) : new OperatorVar(opInfo);

            var type = opInfo.definition().map(def -> {
                return new ParametricType(node.location(), def, operator, types);
            }).orElse(new ParametricType(node.location(), operator, types));

            returnType(type);

        } else {
            throw new PacioliException(node.location(), "Expected a generic");
        }
    }

    @Override
    public void visit(TypeIdentifierNode node) {

        // Find identifier info. The node must have been resolved.
        Info info = node.info;
        assert (info != null);

        Optional<? extends Definition> definition = info.definition();

        // If it is local then it is a variable.
        if (!info.isGlobal()) {

            // Create a type for each different kind of type variable
            if (info instanceof TypeVarInfo) {
                returnType(new TypeVar((TypeVarInfo) info));

            } else if (info instanceof ScalarBaseInfo) {
                returnType(new MatrixType(new ScalarUnitVar((ScalarBaseInfo) info)));

            } else if (info instanceof IndexSetInfo) {
                returnType(new IndexSetVar((IndexSetInfo) info));

            } else if (info instanceof VectorBaseInfo) {
                throw new RuntimeException(
                        "A unit vector should be a BangTypeNode, not a TypeIdentifier. That is for scalars");

            } else {
                throw new RuntimeException("Unknown kind");
            }

        } else if (definition.isPresent() && definition.get() instanceof AliasDefinition) {
            // todo: rewrite evalBody
            returnType(new MatrixType(((AliasDefinition) definition.get()).evalBody()));

        } else if (info instanceof IndexSetInfo indexSetInfo) {

            // Type of a non-compound index set element. The type of a compound index set
            // element (X % Y) is handled by TypeKroneckerNode.

            // Special case Empty. Empty % X = X % Empty = X

            if (node.name().equals("One")) {
                returnType(new IndexList());
            } else {
                TypeIdentifier id = new TypeIdentifier(indexSetInfo.generalInfo().module(), node.name());

                returnType(new IndexList(Arrays.asList(id), Arrays.asList(indexSetInfo)));
            }

        } else if (info instanceof ParametricInfo parametricInfo) {

            // This can only be a parametric type without arguments. E.g. the shorthand
            // String instead of the full String(). The latter would be a
            // TypeApplicationNode and we would not get here.

            TypeIdentifier typeId = new TypeIdentifier(parametricInfo.generalInfo().module(), node.name());
            OperatorConst operator = new OperatorConst(typeId, parametricInfo);

            var type = parametricInfo.definition()
                    .map(def -> new ParametricType(node.location(), def, operator, List.of()))
                    .orElseGet(() -> new ParametricType(node.location(), operator, List.of()));

            returnType(type);

        } else if (info instanceof ScalarBaseInfo scalarBaseInfo) {

            // A scalar unit reference, e.g. metre

            returnType(new MatrixType(new ScalarBase(scalarBaseInfo)));

        } else {
            throw new RuntimeException("Unexpected Info type");
        }
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        if (node.unit.info instanceof ScalarBaseInfo scalarBaseInfo) {
            returnType(new MatrixType(new ScalarBase(node.prefix.name(), scalarBaseInfo)));
        } else {
            throw new PacioliException(node.unit.location(), "Expected a unit");
        }
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

        // This can be a matrix type or an index set element type. The former
        // is something like X! % Y!. The latter something like X % Y. In the
        // case of index set elements the left and right must be a TypeIdentifierNode.
        // They cannot be variables.

        TypeObject leftType = typeAccept(node.left);
        TypeObject rightType = typeAccept(node.right);

        if (leftType instanceof MatrixType leftMatrixType && rightType instanceof MatrixType rightMatrixType) {
            returnType(leftMatrixType.kronecker(rightMatrixType));
        } else if (leftType instanceof IndexList leftIndexType && rightType instanceof IndexList rightIndexType) {
            returnType(leftIndexType.kronecker(rightIndexType));
        } else {
            throw new PacioliException(node.location(), "Expected two matrix types, or two index sets");
        }
    }

    @Override
    public void visit(TypePerNode node) {
        returnType(matrixTypeAccept(node.left).join(matrixTypeAccept(node.right).transpose().reciprocal()));
    }
}
