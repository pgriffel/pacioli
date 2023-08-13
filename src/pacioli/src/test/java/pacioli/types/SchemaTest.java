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

package pacioli.types;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import pacioli.compiler.Location;

public class SchemaTest {

    @Test
    public void shouldInstantiate() {
        // ParametricType body = new ParametricType(new Location(), // new
        // ParametricInfo("Foo", null, true, new
        // // Location()),
        // Optional.empty(), new OperatorVar("var"), List.of());
        // TypeDefinition def = new TypeDefinition(null, null, null, null)

        ParametricType parametric = new ParametricType(new Location(),
                // new ParametricInfo("Bar", null, true, new Location()), Optional.empty(),
                new OperatorVar("dummy"), List.of());
        Schema schema = new Schema(Set.of(new OperatorVar("dummy")), parametric, List.of());
        TypeObject instantiated = schema.instantiate();
        assertInstanceOf(ParametricType.class, instantiated);
        ParametricType instantiatedParametric = (ParametricType) instantiated;
        System.out.println(String.format("hi %s", instantiatedParametric.op()));
        System.out.println(String.format("hi %s", instantiatedParametric.pretty()));
        assertNotEquals(instantiatedParametric.op(), new OperatorVar("Bar"));
        assertEquals(instantiatedParametric.op(), new OperatorVar("?0"));
    }
}
