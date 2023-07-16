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

import java.util.List;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;

public class ClassDefinition extends AbstractDefinition {

    /**
     * Contains the type class type and the quantified variables with possible
     * conditions
     */
    public final SchemaNode definedClass;

    /**
     * The overloaded functions
     */
    public final List<TypeAssertion> members;

    public ClassDefinition(Location location, SchemaNode definedClass, List<TypeAssertion> members) {
        super(location);
        this.definedClass = definedClass;
        this.members = members;
    }

    @Override
    public String localName() {
        return ((TypeApplicationNode) definedClass.type).getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program) throws PacioliException {
        throw new UnsupportedOperationException("See program");
        // program.typess.put(localName(), new ClassInfo(this, program.file,
        // getLocation()));

    }

}
