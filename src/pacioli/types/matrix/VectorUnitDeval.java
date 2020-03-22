package pacioli.types.matrix;

import pacioli.Location;
import pacioli.symboltable.IndexSetInfo;
import pacioli.types.TypeBase;
import pacioli.types.Var;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.NumberTypeNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeMultiplyNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypePowerNode;
import uom.Fraction;
import uom.UnitFold;

public class VectorUnitDeval implements UnitFold<TypeBase, TypeNode> {

    //private final IndexSetInfo indexSet;
    private final IndexType dimension;
    private final Integer dim;

    public VectorUnitDeval(IndexType dimension, Integer dim) {
        this.dimension = dimension;
        this.dim = dim;
    }

    @Override
    public TypeNode map(TypeBase base) {
        if (dimension.isVar()) {
            Var dimVar = (Var) dimension.getIndexSet();
            Var baseVar = (Var) base;
            if (dimVar.isFresh()) {
                Location location = new Location();
                return new BangTypeNode(location, 
                        new TypeIdentifierNode(location, dimVar.pretty()),
                        new TypeIdentifierNode(location, baseVar.pretty()));
            } else {
                IndexSetInfo info = dimension.nthIndexSetInfo(dim);
                Location location = info.getLocation();
                return new BangTypeNode(location, 
                    new TypeIdentifierNode(location, info.name()),
                    // Is this the right base name!
                    new TypeIdentifierNode(location, baseVar.pretty()));
            }
        } else {
            if (base instanceof VectorBase) {
                assert(base instanceof VectorBase);
                VectorBase vectorBase = (VectorBase) base;
                
                IndexSetInfo info = dimension.nthIndexSetInfo(vectorBase.position); // should equal dim!!!
                Location location = info.getLocation();
                return new BangTypeNode(location, 
                    new TypeIdentifierNode(location, info.name(), info),
                    new TypeIdentifierNode(location, vectorBase.unitName.name, vectorBase.vectorUnitInfo));
            } else {
                Var baseVar = (Var) base;
                IndexSetInfo info = dimension.nthIndexSetInfo(dim);
                Location location = info.getLocation();
                return new BangTypeNode(location, 
                        new TypeIdentifierNode(location, info.name(), info),
                        // Is this the right base name!
                         (baseVar.isFresh()) ?
                        new TypeIdentifierNode(location, baseVar.pretty())
                        :
                            new TypeIdentifierNode(location, baseVar.pretty(), baseVar.getInfo()));
                        
            }
        }
    }

    @Override
    public TypeNode mult(TypeNode x, TypeNode y) {
        return new TypeMultiplyNode(x.getLocation().join(y.getLocation()), x, y);
    }

    @Override
    public TypeNode expt(TypeNode x, Fraction n) {
        return new TypePowerNode(x.getLocation(), x, new NumberTypeNode(x.getLocation(), n.toString()));
    }

    @Override
    public TypeNode one() {
        
        if (dimension.isVar()) {
            Var dimVar = (Var) dimension.getIndexSet();
            if (dimVar.isFresh()) {
                Location location = new Location();
                return new BangTypeNode(location, 
                        new TypeIdentifierNode(location, dimVar.pretty()));
            } else {
                IndexSetInfo info = dimension.nthIndexSetInfo(dim);
                Location location = info.getLocation();
                return new BangTypeNode(location, 
                    new TypeIdentifierNode(location, info.name(), info));
            }
        } else {
            IndexSetInfo info = dimension.nthIndexSetInfo(dim);
            Location location = info.getLocation();
            return new BangTypeNode(location, 
                new TypeIdentifierNode(location, info.name(), info));
        }
    }
}
