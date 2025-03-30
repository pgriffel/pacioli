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

package pacioli.ast.sugar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetNode.BindingNode;
import pacioli.compiler.Location;

public class ExponentNode extends AbstractNode implements ExpressionNode {

    public final String op;
    public final ExpressionNode base;
    public final String power;

    public ExponentNode(String op, ExpressionNode base, String power, Location location) {
        super(location);
        this.op = op;
        this.base = base;
        this.power = power;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public ExponentNode transform(ExpressionNode transformedBase) {
        return new ExponentNode(this.op, transformedBase, this.power, this.location());
    }

    public ExpressionNode asProducts() {
        return desugarExp(this.op, this.base, this.power, this.location());
    }

    private static ExpressionNode desugarExp(String op, ExpressionNode base, String power,
            pacioli.compiler.Location loc) {

        ExpressionNode bas;

        int pow = Integer.parseInt(power);

        if (pow < 0) {
            bas = new ApplicationNode(
                    new IdentifierNode(op.equals("multiply") ? "reciprocal" : "inverse", loc.collapse()),
                    Arrays.asList(base), loc);
        } else {
            bas = base;
        }
        return desugarExpHelper(op, bas, (pow < 0) ? -pow : pow, loc);
    }

    private static ExpressionNode desugarExpHelper(String op, ExpressionNode base, int power,
            pacioli.compiler.Location loc) {

        if (power == 0) {
            List<ExpressionNode> args = new ArrayList<ExpressionNode>();
            args.add(base);
            return new ApplicationNode(
                    new IdentifierNode(op.equals("multiply") ? "unit" : "left_identity", loc.collapse()), args, loc);
        } else if (power == 1) {
            return base;
        } else {
            String fresh = freshName(op);

            ExpressionNode exp = new IdentifierNode(fresh, loc.collapse());

            for (int i = 1; i < power; i++) {
                List<ExpressionNode> args = new ArrayList<ExpressionNode>();
                args.add(exp);
                args.add(new IdentifierNode(fresh, loc.collapse()));
                exp = new ApplicationNode(new IdentifierNode(op, loc.collapse()), args, loc);
            }

            BindingNode binding = new LetBindingNode(loc, fresh, base);
            return new LetNode(binding, exp, loc);
        }
    }

    private static int counter = 0;

    private static String freshName(String prefix) {
        return prefix + counter++;
    }

}
