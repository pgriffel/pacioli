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

package pacioli;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.types.PacioliType;
import pacioli.types.TypeVar;
import uom.Base;
import uom.PowerProduct;
import uom.Unit;
import uom.UnitMap;

public class Substitution extends AbstractPrintable {

    private final Map<TypeVar, Object> map;

    public Substitution() {
        map = new HashMap<TypeVar, Object>();
    }

    public Substitution(TypeVar var, PacioliType type) {
        map = new HashMap<TypeVar, Object>();
        this.map.put(var, type);
    }

    public Substitution(TypeVar var, Unit unit) {
        map = new HashMap<TypeVar, Object>();
        this.map.put(var, unit);
    }

    public Substitution(TypeVar var, TypeVar other) {
        map = new HashMap<TypeVar, Object>();
        this.map.put(var, other);
    }
    
    public Substitution(Substitution other) {
        map = new HashMap<TypeVar, Object>(other.map);
    }

    Substitution(Map<TypeVar, Object> map) {
        this.map = map;
    }

    public Unit apply(Unit unit) {
        return unit.map(new UnitMap() {
            public Unit map(Base base) {
                if (base instanceof TypeVar && map.containsKey((TypeVar) base)) {
                    Object obj = map.get((TypeVar) base);
                    assert (obj instanceof Unit);
                    return (Unit) obj;
                } else {
                    return base;
                }
            }
        });
    }

    public PacioliType apply(PacioliType type) {
        if (type instanceof TypeVar) {
            if (map.containsKey((TypeVar) type)) {
                Object obj = map.get((TypeVar) type);
                assert (obj instanceof PacioliType);
                return (PacioliType) obj;
            } else {
                return type;
            }
        } else {
            return type.applySubstitution(this);
        }
    }

    public void removeAll(Set<TypeVar> vars) {
        for (TypeVar var : vars) {
            map.remove(var);
        }
    }

    public Substitution compose(Substitution other) {

        Map<TypeVar, Object> tmp = new HashMap<TypeVar, Object>();

        for (TypeVar var : map.keySet()) {
            if (!other.map.containsKey(var)) {
                tmp.put(var, map.get(var));
            }
        }
        for (TypeVar var : other.map.keySet()) {
            Object obj = other.map.get(var);
            if (obj instanceof PacioliType) {
                tmp.put(var, apply((PacioliType) obj));
            } else {
                tmp.put(var, apply((Unit) obj));
            }
        }
        return new Substitution(tmp);
    }

    public boolean isInjective() {

        Set<TypeVar> check = new HashSet<TypeVar>();

        for (TypeVar var : map.keySet()) {
            Object obj = map.get(var);
            if (obj instanceof Unit) {
                obj = PowerProduct.normal((Unit) obj);
            }
            if (!(obj instanceof TypeVar)) {
                return false;
            } else {
                TypeVar objVar = (TypeVar) obj;
                if (check.contains(objVar)) {
                    return false;
                } else {
                    check.add(objVar);
                }
            }
        }
        return true;
    }

    @Override
    public void printText(PrintWriter out) {
        List<String> elements = new ArrayList<String>();
        for (TypeVar var : map.keySet()) {
            Object obj = map.get(var);
            String text;
            if (obj instanceof Unit) {
                text = ((Unit) obj).toText();
            } else {
                text = ((Printable) obj).toText();
            }
            elements.add(String.format("%s=%s", var.toText(), text));

        }
        out.print("subs{");
        out.print(Utils.intercalate(", ", elements));
        out.print("}");
    }
}
