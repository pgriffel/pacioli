package pacioli.visitors;

import java.util.ArrayList;
import java.util.List;

import javax.sql.rowset.RowSetMetaDataImpl;

import mvm.values.matrix.MatrixBase;
import pacioli.Location;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode.ValueDecl;
import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.VectorBase;
import uom.DimensionedNumber;
import uom.Unit;
import uom.UnitMap;

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
        
        //node.rowDim = compileTimeMatrixDimension(type.rowDimension);
        //node.columnDim = compileTimeMatrixDimension(matrixType.columnDimension);
        
        Unit<MatrixBase> matrixUnit;
        
        Pacioli.logln("conv type: %s", type.pretty());
        
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
                //final int[] positions = node.rowDim.individualPositions(i);
                assert(items.size() == width);
                //for (int d = 0; d < width; d++) {
                    UnitMap<TypeBase> mapper = new UnitMap<TypeBase>() {
                        @Override
                        public Unit<TypeBase> map(TypeBase base) {
                            VectorBase vbase = (VectorBase) base;
                            String itemName = items.get(vbase.position);
                             Unit<TypeBase> unit = vbase.vectorUnitInfo.getUnit(itemName);
                            return unit;
                        }
                    };
                    Unit<TypeBase> rowUnit = type.rowUnit.map(mapper);
                    Unit<TypeBase> columnsUnit = type.columnUnit.map(mapper);
                    
                    Unit<TypeBase> div = rowUnit.multiply(columnsUnit.reciprocal());
                    DimensionedNumber<TypeBase> flat = div.flat();
                    Pacioli.logln("CONV %s -> %s  = %s", rowUnit.pretty(), columnsUnit.pretty(),
                            flat.factor().toPlainString());
                
                    List<IdentifierNode> key = new ArrayList<IdentifierNode>();
                    for (String item: items) {
                        key.add(new IdentifierNode(item, node.getLocation()));    
                    }
                    for (String item: items) {
                        key.add(new IdentifierNode(item, node.getLocation()));    
                    }
                
                    String value = flat.factor().toPlainString();
                    
                    conversionFactors.add(new ValueDecl(key, value));
                //}
            }
            
            // Create a literal node of the same type with the conversion factors.
            returnNode(new MatrixLiteralNode(location, node.typeNode, conversionFactors));
        } else {
            returnNode(node);
        }
    }
}
