package pacioli.visitors;

import java.util.ArrayList;
import java.util.List;

import pacioli.Location;
import pacioli.Pacioli;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode.ValueDecl;
import pacioli.types.PacioliType;

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
        
        PacioliType type = node.typeNode.evalType(true);
        
        Pacioli.logln("conv type: %s", type.pretty());
        
        Boolean closedType = false;
        
        if (closedType) {
            // Compute the conversion factors
            List<ValueDecl> conversionFactors = new ArrayList<ValueDecl>();
            
            // Create a literal node of the same type with the conversion factors.
            returnNode(new MatrixLiteralNode(location, node.typeNode, conversionFactors));
        } else {
            returnNode(node);
        }
    }
}
