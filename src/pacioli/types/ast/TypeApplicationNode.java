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
import java.util.ArrayList;
import java.util.List;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.Utils;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeVar;
import pacioli.types.matrix.DimensionType;
import pacioli.types.matrix.MatrixType;

public class TypeApplicationNode extends AbstractTypeNode {

    public final String name;
    public final List<TypeNode> args;

    public TypeApplicationNode(Location location, String name, List<TypeNode> args) {
        super(location);
        this.name = name;
        this.args = args;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(name);
        out.print("(");
        out.print(Utils.intercalateText(", ", args));
        out.print(")");
    }

    @Override
    public PacioliType eval(Dictionary dictionary, TypeContext context, boolean reduce) throws PacioliException {

        List<PacioliType> types = new ArrayList<PacioliType>();
        for (TypeNode arg : args) {
            types.add(arg.eval(dictionary, context, reduce));
        }

        if (name.equals("Index")) {
            if (types.size() == 1 && types.get(0) instanceof TypeVar) {
                return types.get(0);
            } else {
                List<String> names = new ArrayList<String>();
                for (int i = 0; i < types.size(); i++) {
                    PacioliType type = types.get(i);
                    assert (type instanceof TypeVar || type instanceof MatrixType);
                    if (type instanceof MatrixType) {
                        assert (args.get(i) instanceof TypeIdentifierNode);
                        String name = ((TypeIdentifierNode) args.get(i)).toText();
                        if (dictionary.containsIndexSetDefinition(name)) {
                            names.add(name);
                        } else {
                            throw new PacioliException(getLocation(), "Index set '%s' unknown", type.toText());
                        }
                    } else {
                        throw new PacioliException(getLocation(), "Index set expected but found '%s'", type.toText());
                    }
                }
                return new DimensionType(names);
            }
        } else {
            if (reduce && dictionary.containsTypeDefinition(name)) {
                return dictionary.getTypeDefinition(name).constaint(true).reduce(new ParametricType(name, types));
            } else if (dictionary.containsTypeDefinition(name) || dictionary.containsKnownType(name)) {
                return new ParametricType(name, types);
            } else {
                throw new PacioliException(getLocation(), "Type '%s' unknown", name);
            }
        }
    }
}
