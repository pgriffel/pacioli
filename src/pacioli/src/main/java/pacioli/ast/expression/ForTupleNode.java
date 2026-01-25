/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.ast.expression;

import java.util.Arrays;
import java.util.List;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.parser.Parser;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;

public class ForTupleNode extends AbstractNode implements ExpressionNode {

    public final List<IdentifierNode> vars;
    public final ExpressionNode items;
    public final ExpressionNode body;

    public ExpressionNode lambdaBody;

    public SymbolTable<ValueInfo> table;

    public ForTupleNode(Location location, List<IdentifierNode> vars, ExpressionNode items, ExpressionNode body) {
        super(location);
        this.vars = vars;
        this.items = items;
        this.body = body;

        this.lambdaBody = this.bodyAsLambda();
    }

    public ForTupleNode transform(List<IdentifierNode> vars, ExpressionNode items, ExpressionNode body) {
        return new ForTupleNode(location(), vars, items, body);
    }

    static LambdaNode forLambda(IdentifierNode id, ExpressionNode items, ExpressionNode body) {
        return new LambdaNode(List.of(id.name()), body, body.location());
    }

    private ExpressionNode bodyAsLambda() {

        Location loc = this.location();

        ExpressionNode function = new LambdaNode(Parser.freshUnderscores(Parser.idNames(this.vars)), this.body, loc);

        String tupName = Parser.freshName("_f_tup");

        ExpressionNode tup = new IdentifierNode(tupName, loc.collapse());
        ExpressionNode apply = new IdentifierNode("apply", loc.collapse());
        ExpressionNode app = new ApplicationNode(apply, Arrays.asList(function, tup), loc.collapse());
        ExpressionNode body = new LambdaNode(List.of(tupName), app, loc);
        return body;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
