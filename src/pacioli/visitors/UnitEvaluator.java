package pacioli.visitors;

import java.math.BigDecimal;
import java.util.Stack;

import pacioli.ast.Visitor;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.types.TypeBase;
import pacioli.types.matrix.StringBase;
import uom.DimensionedNumber;
import uom.Fraction;
import uom.Unit;

public class UnitEvaluator extends IdentityVisitor implements Visitor {

    private Stack<DimensionedNumber> dimNumStack = new Stack<DimensionedNumber>();

    // -------------------------------------------------------------------------
    // Accept and return methods
    // -------------------------------------------------------------------------

    public DimensionedNumber unitAccept(UnitNode node) {
        // Pacioli.logln("accept: %s", node.getClass());
        node.accept(this);
        return dimNumStack.pop();
    }

    private void returnNode(DimensionedNumber value) {
        // Pacioli.logln("return: %s", value.getClass());
        dimNumStack.push(value);
    }

    // -------------------------------------------------------------------------
    // Visit methods
    // -------------------------------------------------------------------------

    @Override
    public void visit(NumberUnitNode node) {
        returnNode(TypeBase.ONE.multiply(new BigDecimal(node.number)));
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        if (node.prefix == null) {
            returnNode(new DimensionedNumber(new StringBase(node.name)));
        } else {
            returnNode(new DimensionedNumber(new StringBase(node.prefix, node.name)));
        }
    }

    @Override
    public void visit(UnitOperationNode node) {

        DimensionedNumber left = unitAccept(node.left);
        DimensionedNumber right = unitAccept(node.right);

        if ("*".equals(node.operator)) {
            returnNode(left.multiply(right));
        } else if ("/".equals(node.operator)) {
            returnNode(left.multiply(right.reciprocal()));
        } else {
            visitorThrow(node.getLocation(), "Unit operator %s unknown", node.operator);
        }
    }

    @Override
    public void visit(UnitPowerNode node) {
        returnNode(unitAccept(node.base).raise(new Fraction(Integer.parseInt(node.power.toText()))));
    }
}
