package pacioli.visitors;

import java.math.BigDecimal;
import java.util.Stack;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.Visitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.ScalarUnitInfo;
import pacioli.types.TypeBase;
import pacioli.types.matrix.ScalarBase;
import uom.DimensionedNumber;
import uom.Fraction;

public class UnitEvaluator extends IdentityVisitor implements Visitor {

    private Stack<DimensionedNumber<TypeBase>> dimNumStack = new Stack<DimensionedNumber<TypeBase>>();

    // -------------------------------------------------------------------------
    // Accept and return methods
    // -------------------------------------------------------------------------

    public DimensionedNumber<TypeBase> unitAccept(UnitNode node) {
        // Pacioli.logln("accept: %s", node.getClass());
        node.accept(this);
        return dimNumStack.pop();
    }

    private void returnNode(DimensionedNumber<TypeBase> value) {
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
        if (node.info instanceof AliasInfo) {
            AliasDefinition def = (AliasDefinition) node.info.getDefinition().get();
            returnNode(unitAccept(def.unit));
        } else {
            ScalarUnitInfo sinfo = (ScalarUnitInfo) node.info;
            if (!node.getPrefix().isPresent()) {
                returnNode(new DimensionedNumber<TypeBase>(new ScalarBase(sinfo)));
            } else {
                returnNode(new DimensionedNumber<TypeBase>(new ScalarBase(node.getPrefix().get(), sinfo)));
            }
        }
    }

    @Override
    public void visit(UnitOperationNode node) {

        DimensionedNumber<TypeBase> left = unitAccept(node.left);
        DimensionedNumber<TypeBase> right = unitAccept(node.right);

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
        returnNode(unitAccept(node.base).raise(new Fraction(Integer.parseInt(node.power.pretty()))));
    }
}
