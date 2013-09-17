/*
 * Copyright (c) 2013 Paul Griffioen
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

package pacioli.types.ast;

import java.io.PrintWriter;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.types.PacioliType;
import pacioli.types.Schema;

public class SchemaNode extends AbstractTypeNode {

    private final TypeContext context;
    private final TypeNode type;

    public SchemaNode(Location location, TypeContext context, TypeNode type) {
        super(location);
        this.context = context;
        this.type = type;
    }

    @Override
    public void printText(PrintWriter out) {
        context.printText(out);
        type.printText(out);
    }

    @Override
    public PacioliType eval(Dictionary dictionary, TypeContext context, boolean reduce) throws PacioliException {
        TypeContext newContext = new TypeContext();
        newContext.addAll(context);
        newContext.addAll(this.context);
        return new Schema(this.context.typeVars(), type.eval(dictionary, newContext, reduce));
    }
}
