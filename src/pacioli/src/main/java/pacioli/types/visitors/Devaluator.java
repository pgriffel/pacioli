package pacioli.types.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.Location;
import pacioli.symboltable.IndexSetInfo;
import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeBase;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.TypeVisitor;
import pacioli.types.VectorUnitVar;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.NumberTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeMultiplyNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypePerNode;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.ScalarUnitDeval;

public class Devaluator implements TypeVisitor {

    private Stack<TypeNode> nodeStack = new Stack<TypeNode>();
    

    public TypeNode typeNodeAccept(PacioliType child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }
    
    public void returnTypeNode(TypeNode value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }
    
    @Override
    public void visit(FunctionType type) {
        TypeNode dom = type.domain.deval();
        TypeNode ran = type.range.deval();
        returnTypeNode(new FunctionTypeNode(dom.getLocation().join(ran.getLocation()), dom, ran));
    }

    @Override
    public void visit(Schema type) {
        returnTypeNode(new SchemaNode(new Location(), type.newContext(), typeNodeAccept(type.getType())));
    }

    @Override
    public void visit(IndexList type) {
        //throw new RuntimeException("todo: " + type.getClass());
        throw new RuntimeException("deval of index list should be handled by the matrix type");
    }

    @Override
    public void visit(IndexType type) {       
        
        // This must be an parameric "Index" type, otherwise it would be handled
        // by the deval of a matrix type.
        
        TypeIdentifierNode index = new TypeIdentifierNode(new Location(), "Index");
        List<TypeNode> ids = new ArrayList<TypeNode>();

        if (type.isVar()) {
            ids.add(typeNodeAccept(type.getVar()));
        } else {
            for (int n = 0; n < type.width(); n++) {
                TypeIdentifier id = type.nthIndexSet(n);
                IndexSetInfo info = type.nthIndexSetInfo(n);
                ids.add(new TypeIdentifierNode(new Location(), id.name, info));
            }
        }
        
        returnTypeNode(new TypeApplicationNode(new Location(), index, ids));
    }

    @Override
    public void visit(MatrixType type) {
        //throw new RuntimeException("todo: " + type.getClass());

        // Use a general rewriter to simplify. See deval van scalar and vector units
        TypeNode factorNode = type.factor.fold(new ScalarUnitDeval(new Location()));
        TypeNode left = type.devalDimensionUnitPair(type.rowDimension, type.rowUnit);
        TypeNode right = type.devalDimensionUnitPair(type.columnDimension, type.columnUnit);
        
        if (left == null && right == null) {
            returnTypeNode(factorNode);
        } else if (left == null) {
            TypeNode rightNode; 
            Location location;
            if (type.factor.equals(TypeBase.ONE)) {
                location = right.getLocation();
                rightNode = right;
            } else {
                location = factorNode.getLocation().join(right.getLocation());
                rightNode = new TypeMultiplyNode(location, factorNode, right);
            }
            returnTypeNode(new TypePerNode(location, new NumberTypeNode(location, "1"), rightNode));
        } else if (right == null) {
            if (type.factor.equals(TypeBase.ONE)) {
                returnTypeNode(left);
            } else {
                Location location = left.getLocation().join(factorNode.getLocation());
                returnTypeNode(new TypeMultiplyNode(location, factorNode, left));
            }
        } else {
            Location perLocation = left.getLocation().join(right.getLocation());
            TypePerNode perNode = new TypePerNode(perLocation, left, right);
            if (type.factor.equals(TypeBase.ONE)) {
                returnTypeNode(perNode);
            } else {
                Location location = factorNode.getLocation().join(perLocation);
                returnTypeNode(new TypeMultiplyNode(location, factorNode, perNode));
            }
        }
    }

    @Override
    public void visit(IndexSetVar type) {
        //throw new RuntimeException("todo: " + type.getClass());
        if (type.isFresh()) {
            returnTypeNode(new TypeIdentifierNode(new Location(), type.getName()));
        } else {
            returnTypeNode(new TypeIdentifierNode(new Location(), type.getInfo().name(), type.getInfo()));
        }
    }

    @Override
    public void visit(ParametricType type) {
        List<TypeNode> args = new ArrayList<TypeNode>();
        for (PacioliType x:type.args) {
            args.add(typeNodeAccept(x));
        }
        //throw new RuntimeException("todo: " + type.getClass());
        returnTypeNode(new TypeApplicationNode(new Location(), 
                new TypeIdentifierNode(type.info.getLocation(), type.info.name()),
                args));
    }

    @Override
    public void visit(ScalarUnitVar type) {
        throw new RuntimeException("todo: " + type.getClass());
    }

    @Override
    public void visit(TypeVar type) {
        //throw new RuntimeException("todo: " + type.getClass());
        if (type.isFresh()) {
            returnTypeNode(new TypeIdentifierNode(new Location(), type.getName()));
        } else {
            returnTypeNode(new TypeIdentifierNode(new Location(), type.getName(), type.getInfo()));
        }
    }

    @Override
    public void visit(VectorUnitVar type) {
        throw new RuntimeException("todo: " + type.getClass());
    }

}
