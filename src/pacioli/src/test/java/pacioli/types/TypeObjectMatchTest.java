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

package pacioli.types;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import pacioli.compiler.PacioliException;
import pacioli.types.Substitution;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypeVar;
import pacioli.types.type.Var;

public class TypeObjectMatchTest {

    @Test
    public void shouldGroundTypeVarImmutably() {
        TypeVar original = new TypeVar("a");
        TypeObject grounded = (original).setGround(true);

        assertFalse(original.isGround());
        assertTrue(((Var) grounded).isGround());
    }

    @Test
    public void shouldMatchUngroundedTypeVar() {
        TypeObject subject = new TypeVar("a");
        IndexSetVar target = new IndexSetVar("I");

        Substitution substitution = subject.match(target);
        assertEquals(target, substitution.apply(subject));
    }

    @Test
    public void shouldFailMatchGroundedTypeVarAgainstOtherTypeVar() {
        TypeObject grounded = (new TypeVar("a")).setGround(true);
        TypeObject other = new TypeVar("b");

        assertThrows(PacioliException.class, () -> grounded.match(other));
    }

    @Test
    public void shouldMatchGroundedTypeVarToItself() {
        TypeObject grounded = (new TypeVar("a")).setGround(true);
        assertEquals(grounded, grounded.match(grounded).apply(grounded));
    }

    @Test
    public void shouldGroundAllTypeVariables() {
        TypeObject original = new TypeVar("a");
        TypeObject grounded = original.groundAll();

        assertFalse(((Var) original).isGround());
        assertTrue(((Var) grounded).isGround());
    }
}
