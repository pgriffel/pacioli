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

package pacioli.types.matrix;

import java.math.BigDecimal;
import java.util.Optional;

import pacioli.ast.definition.UnitDefinition;
import pacioli.misc.CompilationSettings;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.types.TypeBase;
import uom.BaseUnit;
import uom.DimensionedNumber;
import uom.PowerProduct;
import uom.Unit;

public class ScalarBase extends BaseUnit<TypeBase> implements TypeBase {

    private final Optional<String> prefix;
    private final String text;

    private final ScalarBaseInfo info;

    public ScalarBase(ScalarBaseInfo info) {
        assert (info != null);
        this.prefix = Optional.empty();
        this.text = info.name();
        this.info = info;
    }

    public ScalarBase(String prefix, ScalarBaseInfo info) {
        assert (info != null);
        this.prefix = Optional.of(prefix);
        this.text = info.name();
        this.info = info;
    }

    @Override
    public int hashCode() {
        return text.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Unit)) {
            return false;
        }
        Object real = PowerProduct.normal((Unit) other);
        if (real == this) {
            return true;
        }
        if (!(real instanceof ScalarBase)) {
            return false;
        }
        ScalarBase otherUnit = (ScalarBase) real;
        return text.equals(otherUnit.text) && prefix.equals(otherUnit.prefix);
    }

    @Override
    public DimensionedNumber<TypeBase> flat() {
        BigDecimal fac = new BigDecimal(1);
        if (prefix.isPresent()) {
            if (prefix.get().equals("kilo")) {
                fac = new BigDecimal(1000);
            } else if (prefix.get().equals("milli")) {
                fac = new BigDecimal(0.001);
            } else if (prefix.get().equals("deci")) {
                fac = new BigDecimal(0.1);
            } else {
                throw new RuntimeException("todo: unit prefix" + prefix.get());
            }
            // return new ScalarBase(text).multiply(fac);
        }
        Optional<UnitDefinition> def = info.getDefinition();
        if (def.isPresent()) {
            DimensionedNumber<TypeBase> dimNum = def.get().evalBody();
            if (dimNum != null) {
                return def.get().evalBody().multiply(fac);
            }
        }
        return new ScalarBase(info).multiply(fac);
    }

    private String prefixText() {
        return (prefix.isPresent()) ? prefix.get() + ":" : "";
    }

    @Override
    public String toString() {
        return super.toString() + "{" + prefixText() + text + "}";
    }

    @Override
    public String pretty() {
        return prefixText() + text;
    }

    @Override
    public String asJS() {
        return prefix.isPresent()
                ? String.format("Pacioli.unitType('%s', '%s')", prefix.get(), text)
                : String.format("Pacioli.unitType('%s')", text);
    }

    @Override
    public String asMVMUnit(CompilationSettings settings) {
        if (prefix.isPresent()) {
            return "scaled_unit(\"" + prefix.get() + "\", \"" + text + "\")";
        } else {
            return "unit(\"" + text + "\")";
        }
    }

    @Override
    public String asMVMShape(CompilationSettings settings) {
        if (prefix.isPresent()) {
            return "scalar_shape(scaled_unit(\"" + prefix.get() + "\", \"" + text + "\"))";
        } else {
            return "scalar_shape(unit(\"" + text + "\"))";
        }
    }
}