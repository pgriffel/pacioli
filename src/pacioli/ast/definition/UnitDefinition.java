/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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

package pacioli.ast.definition;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.Utils;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.UnitInfo;
import uom.DimensionedNumber;

public class UnitDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final String symbol;
    public final UnitNode body;

    public UnitDefinition(Location location, IdentifierNode id, String symbol) {
        super(location);
        this.id = id;
        this.symbol = symbol;
        this.body = null;
    }

    public UnitDefinition(Location location, IdentifierNode id, String symbol, UnitNode body) {
        super(location);
        this.id = id;
        this.symbol = symbol;
        this.body = body;
    }

    public String getName() {
        return id.getName();
    }

    public String getSymbol() {
        return symbol;
    }

    public DimensionedNumber evalBody() {
        return (body == null) ? null : body.evalUnit();
    }

    @Override
    public void printText(PrintWriter out) {
        if (body == null) {
            out.format("unit definition %s\n", id.toText());
        } else {
            out.format("unit definition %s = %s\n", id.toText(), body.toText());
        }
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public String globalName() {
        return String.format("unit_%s", localName());
    }

    @Override
    public String compileToJS(boolean boxed) {
        if (body == null) {
            return String.format("Pacioli.compute_%s = function () {return {symbol: '%s'}}", globalName(), symbol);
        } else {
            DimensionedNumber number = body.evalUnit().flat();
            return String.format(
                    "Pacioli.compute_%s = function () {return {definition: new Pacioli.DimensionedNumber(%s, %s), symbol: '%s'}}",
                    globalName(), number.factor(), Utils.compileUnitToJS(number.unit()), symbol);
        }
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("Not supported yet."); // To change body of generated methods, choose
                                                                       // Tools | Templates.
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program, GenericInfo.Scope scope) throws PacioliException {
        GenericInfo generic = new GenericInfo(localName(), program.program.module.name, 
                program.file, scope, getLocation());       
        UnitInfo info = new UnitInfo(generic);
        info.definition = this;
        info.symbol = symbol;
        info.baseDefinition = body;
        program.addInfo(info);
    }
}
