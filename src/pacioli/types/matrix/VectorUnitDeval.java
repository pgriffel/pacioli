package pacioli.types.matrix;

import pacioli.Location;
import pacioli.symboltable.IndexSetInfo;
import pacioli.types.TypeBase;
import pacioli.types.Var;
import pacioli.types.VectorUnitVar;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.NumberTypeNode;
import pacioli.types.ast.TypeDivideNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeMultiplyNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypePowerNode;
import uom.Fraction;
import uom.UnitFold;

/**
 * Takes the kronecker-nth of a matrix dimension and creates a type node for it.
 * Used in the deval of a matrix type.
 *
 */
public class VectorUnitDeval implements UnitFold<TypeBase, TypeNode> {

    /**
     * A matrix dimension. 
     */
    private final IndexType dimension;
    
    
    /**
     * The index of dimension that is asked 
     */
    private final Integer dim;

    public VectorUnitDeval(IndexType dimension, Integer dim) {
        this.dimension = dimension;
        this.dim = dim;
    }

    @Override
    public TypeNode map(TypeBase base) {
        if (dimension.isVar()) {
            Var dimVar = (Var) dimension.getIndexSet();
            VectorUnitVar baseVar = (VectorUnitVar) base;
            if (dimVar.isFresh()) {
                Location location = new Location();
                return new BangTypeNode(location, 
                        new TypeIdentifierNode(location, dimVar.pretty()),
                        new TypeIdentifierNode(location, baseVar.unitPart()
                                //new TypeIdentifierNode(location, baseVar.pretty()
                                ));
            } else {
                IndexSetInfo info = dimension.nthIndexSetInfo(dim);
                Location location = info.getLocation();
                return new BangTypeNode(location, 
                    new TypeIdentifierNode(location, info.name()),
                    // Is this the right base name!
                    new TypeIdentifierNode(location, baseVar.unitPart()));
            }
        } else {
            if (base instanceof VectorBase) {
                assert(base instanceof VectorBase);
                VectorBase vectorBase = (VectorBase) base;
             
                Integer vecPos = vectorBase.position;
                if (vecPos.equals(dim)) {
                    IndexSetInfo info = dimension.nthIndexSetInfo(dim);
                    Location location = info.getLocation();
                    return new BangTypeNode(location, 
                        new TypeIdentifierNode(location, info.name(), info),
                        //new TypeIdentifierNode(location, vectorBase.unitName.name, vectorBase.vectorUnitInfo)
                        new TypeIdentifierNode(location, vectorBase.unitName.name, vectorBase.vectorUnitInfo));
                } else {
                    return one();
                }
            } else {
                VectorUnitVar baseVar = (VectorUnitVar) base;
                IndexSetInfo info = dimension.nthIndexSetInfo(dim);
                Location location = info.getLocation();
                return new BangTypeNode(location, 
                        new TypeIdentifierNode(location, info.name(), info),
                        // Is this the right base name!
                         (baseVar.isFresh()) ?
                        //new TypeIdentifierNode(location, baseVar.pretty())
                                 new TypeIdentifierNode(location, baseVar.unitPart())
                        :
                            new TypeIdentifierNode(location, baseVar.unitPart(), baseVar.getInfo()));
                        
            }
        }
    }

    @Override
    public TypeNode mult(TypeNode x, TypeNode y) {
        // See also scalar deval. Better make a general normalizer.
        if (y instanceof TypePowerNode) {
            TypePowerNode right = (TypePowerNode) y;
            Fraction power = new Fraction(Integer.parseInt(right.power.number));
            if (power.intValue() < 0) {
                return new TypeDivideNode(x.getLocation().join(y.getLocation()), x, 
                        new TypePowerNode(right.getLocation(), right.base, new NumberTypeNode(right.getLocation(),
                                power.negate().toString())));
            }
        }
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
