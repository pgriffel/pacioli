package pacioli.visitors;

import java.util.ArrayList;
import java.util.List;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode.ValueDecl;
import pacioli.types.TypeBase;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.VectorBase;
import uom.DimensionedNumber;
import uom.Fraction;
import uom.UnitFold;

/**
 * Transforms all conversion nodes into matrix literal nodes with the proper
 * conversion factors.
 * 
 * This is more generic than what is needed because currently conversions are
 * toplevels and cannot occur everywhere in an expression as is handled here.
 */
public class TransformConversions extends IdentityTransformation implements Visitor {

    public TransformConversions() {
    }
    
    public void visit(ConversionNode node) {

        Location location = node.getLocation();
        
        MatrixType type = (MatrixType) node.typeNode.evalType(true);
        
        DimensionedNumber<TypeBase> typeFactor = type.factor.flat();
        
        if (!type.rowDimension.equals(type.columnDimension)) {
            throw new RuntimeException("Invalid conversion", 
                    new PacioliException(node.getLocation(), "Row and column dimension not the same"));
        }
        
        Boolean closedType = true;
        
        if (closedType) {
            
            // Compute the conversion factors
            List<ValueDecl> conversionFactors = new ArrayList<ValueDecl>();
          
            int nrItems = node.rowDim.size();
            int width = node.rowDim.width();
            
            for (int i = 0; i < nrItems; i++) {
                final List<String> items = node.rowDim.ElementAt(i);
                assert(items.size() == width);
                    UnitFold<TypeBase, DimensionedNumber<TypeBase>> folder = 
                            new UnitFold<TypeBase, DimensionedNumber<TypeBase>>() {

                                @Override
                                public DimensionedNumber<TypeBase> map(TypeBase base) {
                                    VectorBase vbase = (VectorBase) base;
                                    String itemName = items.get(vbase.position);
                                    DimensionedNumber<TypeBase> unit = vbase.vectorUnitInfo.getUnit(itemName);
                                    return unit;
                                }

                                @Override
                                public DimensionedNumber<TypeBase> mult(DimensionedNumber<TypeBase> x,
                                        DimensionedNumber<TypeBase> y) {
                                    return x.multiply(y);
                                }

                                @Override
                                public DimensionedNumber<TypeBase> expt(DimensionedNumber<TypeBase> x, Fraction n) {
                                    return x.raise(n);
                                }

                                @Override
                                public DimensionedNumber<TypeBase> one() {
                                    return new DimensionedNumber<TypeBase>();
                                }
                        
                    };
                    
                    DimensionedNumber<TypeBase> rowUnit = type.rowUnit.fold(folder);
                    DimensionedNumber<TypeBase> columnsUnit = type.columnUnit.fold(folder);
                    
                    DimensionedNumber<TypeBase> div = 
                            typeFactor.multiply(rowUnit.multiply(columnsUnit.reciprocal()));
                    DimensionedNumber<TypeBase> flat = div.flat();
                
                    // todo: how to handle empty dimension?
                    
                    List<IdentifierNode> key = new ArrayList<IdentifierNode>();
                    for (String item: items) {
                        key.add(new IdentifierNode(item, node.getLocation()));    
                    }
                    for (String item: items) {
                        key.add(new IdentifierNode(item, node.getLocation()));    
                    }
                
                    String value = flat.reciprocal().factor().toPlainString();
                    
                    conversionFactors.add(new ValueDecl(key, value));
            }
            
            // Create a literal node of the same type with the conversion factors.
            returnNode(new MatrixLiteralNode(location, node.typeNode, conversionFactors));
        } else {
            returnNode(node);
        }
    }
}
