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

package mvm.ast;

import java.io.PrintWriter;
import java.math.BigDecimal;

import mvm.MVMException;
import mvm.Machine;
import mvm.ast.unit.UnitNode;
import mvm.values.matrix.MatrixBase;
import uom.DimensionedNumber;
import uom.NamedUnit;

public class StoreUnit implements Instruction {

    private String name;
    private String symbol;
    private String definitionNumber;
    private UnitNode definitionUnit;

    public StoreUnit(String name, String symbol) {
        this.name = name;
        this.symbol = symbol;
    }

    public StoreUnit(String name, String symbol, String num, UnitNode unit) {
        this.name = name;
        this.symbol = symbol;
        this.definitionNumber = num;
        this.definitionUnit = unit;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo: print storeunti");
    }

    @Override
    public void eval(Machine machine) throws MVMException {
        if (definitionUnit == null) {
            machine.storeUnit(name, new NamedUnit<MatrixBase>(symbol));
        } else {
            machine.storeUnit(name, new NamedUnit<MatrixBase>(symbol,
                    new DimensionedNumber<MatrixBase>(new BigDecimal(definitionNumber), definitionUnit.eval(machine))));
        }
    }

}
