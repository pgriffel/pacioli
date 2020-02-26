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
import java.util.List;
import pacioli.Location;
import pacioli.Progam;
import pacioli.Utils;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.types.ast.TypeIdentifierNode;

public class UnitVectorDefinition extends AbstractDefinition {

    public final TypeIdentifierNode indexSetNode;
    public final TypeIdentifierNode unitNode;
    public final List<UnitDecl> items;

    public static class UnitDecl {

        public IdentifierNode key;
        public UnitNode value;

        public UnitDecl(IdentifierNode key, UnitNode value) {
            this.key = key;
            this.value = value;
        }
    }

    public UnitVectorDefinition(Location location, TypeIdentifierNode indexSet, TypeIdentifierNode unit,
            List<UnitDecl> items) {
        super(location);
        this.indexSetNode = indexSet;
        this.unitNode = unit;
        this.items = items;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("defunit ");
        out.print(localName());
        out.print(" = ");
        String sep = "{";
        for (UnitDecl entry : items) {
            out.printf("%s%s:", sep, entry.key);
            entry.value.printText(out);
            sep = ", ";
        }
        out.print("};");
    }

    @Override
    public String localName() {
        return indexSetNode.getName() + "!" + unitNode.getName();
    }

    @Override
    public String globalName() {
        return String.format("unitvec_%s_%s_%s", getModule().getName(), indexSetNode.getName(), unitNode.getName());
    }

    @Override
    public String compileToJS(boolean boxed) {
        StringBuilder builder = new StringBuilder();
        builder.append("function compute_").append(globalName()).append(" () {");
        builder.append("return {units:{");
        boolean sep = false;
        for (UnitDecl entry : items) {
            if (sep) {
                builder.append(",");
            } else {
                sep = true;
            }
            builder.append("'");
            builder.append(entry.key);
            builder.append("':");
            builder.append(Utils.compileUnitToJS(entry.value.evalUnit().unit()));
            builder.append("");
        }
        builder.append("}}}");

        return builder.toString();
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("MATLAB and Octave have no units.");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program, GenericInfo generic) {
        UnitInfo info = program.ensureUnitRecord(localName());
        info.isVector = true;
        info.generic = generic;
        info.definition = this;
        info.items = items;
    }

}
