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

import pacioli.types.TypeObject;
import pacioli.types.TypeBase;
import pacioli.types.Unifiable;
import pacioli.types.Var;
import uom.PowerProduct;
import uom.Unit;
import uom.UnitMap;

public class Substitution extends AbstractPrintable {

    // Map van strings van maken. Dan is geen equality op Vars nodig en kun je ze
    // collecten in een set etc.
    private final Map<Var, Object> map;

    public Substitution() {
        map = new HashMap<Var, Object>();
    }

    public Substitution(Var var, TypeObject type) {
        map = new HashMap<Var, Object>();
        this.map.put(var, type);
    }

    public Substitution(Var var, Unit<TypeBase> unit) {
        map = new HashMap<Var, Object>();
        this.map.put(var, unit);
    }

    public Substitution(Var var, Var other) {
        map = new HashMap<Var, Object>();
        this.map.put(var, other);
    }

    public Substitution(Substitution other) {
        map = new HashMap<Var, Object>(other.map);
    }

    Substitution(Map<Var, Object> map) {
        this.map = map;
    }

    public Boolean contains(Var var) {
        return map.containsKey(var);
    }
    /*
     * public Unit<TypeBase> apply(Unit<TypeBase> unit) {
     * return unit.map(new UnitMap<TypeBase>() {
     * public Unit<TypeBase> map(TypeBase base) {
     * if (base instanceof Var && map.containsKey((Var) base)) {
     * Object obj = map.get((Var) base);
     * assert (obj instanceof Unit);
     * return (Unit<TypeBase>) obj;
     * } else {
     * return (Unit<TypeBase>) base;
     * }
     * }
     * });
     * }
     */

    // public <B> Unit<B> apply(Var var) {
    // if (map.containsKey(var)) {
    // Object obj = map.get(var);
    // assert (obj instanceof TypeObject);
    // return (TypeObject) obj;
    // } else {
    // return type;
    // }
    // }

    public <B> Unit<B> apply(Unit<B> unit) {
        return unit.map(new UnitMap<B>() {
            public Unit<B> map(B base) {
                if (base instanceof Var && map.containsKey((Var) base)) {
                    Object obj = map.get((Var) base);
                    assert (obj instanceof Unit);
                    return (Unit<B>) obj;
                } else {
                    return ((Unit<B>) base);
                }
            }
        });
    }

    public TypeObject apply(TypeObject type) {
        if (type instanceof Var) {
            if (map.containsKey((Var) type)) {
                Object obj = map.get((Var) type);
                assert (obj instanceof TypeObject);
                return (TypeObject) obj;
            } else {
                return type;
            }
        } else {
            return type.applySubstitution(this);
        }
    }

    public Unifiable apply(Unifiable type) {
        if (type instanceof Var) {
            if (map.containsKey((Var) type)) {
                Object obj = map.get((Var) type);
                assert (obj instanceof TypeObject);
                return (Unifiable) obj;
            } else {
                return type;
            }
        } else {
            return type.applySubstitution(this);
        }
    }

    public void removeAll(Set<Var> vars) {
        for (Var var : vars) {
            map.remove(var);
        }
    }

    public Substitution compose(Substitution other) {

        Map<Var, Object> tmp = new HashMap<Var, Object>();

        for (Var var : map.keySet()) {
            if (!other.map.containsKey(var)) {
                tmp.put(var, map.get(var));
            }
        }
        for (Var var : other.map.keySet()) {
            Object obj = other.map.get(var);
            if (obj instanceof TypeObject) {
                tmp.put(var, apply((TypeObject) obj));
            } else {
                tmp.put(var, apply((Unit) obj));
            }
        }
        return new Substitution(tmp);
    }

    public boolean isInjective() {

        Set<Var> check = new HashSet<Var>();

        for (Var var : map.keySet()) {
            Object obj = map.get(var);
            if (obj instanceof Unit) {
                obj = PowerProduct.normal((Unit) obj);
            }
            if (!(obj instanceof Var)) {
                return false;
            } else {
                Var objVar = (Var) obj;
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
    public void printPretty(PrintWriter out) {
        List<String> elements = new ArrayList<String>();
        for (Var var : map.keySet()) {
            Object obj = map.get(var);
            String text;
            if (obj instanceof Unit) {
                text = ((Unit) obj).pretty();
            } else {
                text = ((Printable) obj).pretty();
            }
            elements.add(String.format("\n%s=%s", var.pretty(), text));

        }
        out.print("subs{");
        out.print(Utils.intercalate(", ", elements));
        out.print("}");
    }
}
