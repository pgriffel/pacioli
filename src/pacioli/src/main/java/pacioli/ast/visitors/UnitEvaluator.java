/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli.ast.visitors;

import java.math.BigDecimal;
import java.util.Stack;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.symboltable.info.AliasInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.types.matrix.ScalarBase;
import pacioli.types.type.TypeBase;
import uom.DimensionedNumber;
import uom.Fraction;

public class UnitEvaluator extends IdentityVisitor {

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
            AliasDefinition def = (AliasDefinition) node.info.definition().get();
            returnNode(unitAccept(def.unit));
        } else {
            ScalarBaseInfo sinfo = (ScalarBaseInfo) node.info;
            if (!node.prefix().isPresent()) {
                returnNode(new DimensionedNumber<TypeBase>(new ScalarBase(sinfo)));
            } else {
                returnNode(new DimensionedNumber<TypeBase>(new ScalarBase(node.prefix().get(), sinfo)));
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
            returnNode(left.divide(right));
        } else {
            visitorThrow(node.location(), "Unit operator %s unknown", node.operator);
        }
    }

    @Override
    public void visit(UnitPowerNode node) {
        returnNode(unitAccept(node.base).raise(new Fraction(Integer.parseInt(node.power.pretty()))));
    }
}
