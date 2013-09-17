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

package pacioli;

import mvm.Machine;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.types.PacioliType;
import pacioli.types.matrix.BangBase;
import pacioli.types.matrix.DimensionType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.Matrix;
import mvm.values.matrix.MatrixBase;
import mvm.values.matrix.MatrixDimension;
import mvm.values.matrix.MatrixShape;
import mvm.values.matrix.UnitVector;
import uom.Base;
import uom.NamedUnit;
import uom.Unit;
import uom.UnitMap;
import uom.UnitSystem;

public class Dictionary extends AbstractPrintable {

    private final Map<String, IndexSetDefinition> indexSetDefinitions;
    private final Map<String, UnitVector> unitVectors;
    private final UnitSystem unitSystem;
    private final Map<String, TypeDefinition> typeDefinitions;
    private final Set<String> knownTypes;
    private final Map<String, Unit> aliases;
    private final Map<String, PacioliType> types;

    public Dictionary() {
        indexSetDefinitions = new HashMap<String, IndexSetDefinition>();
        unitVectors = new HashMap<String, UnitVector>();
        unitSystem = Machine.makeSI();
        typeDefinitions = new HashMap<String, TypeDefinition>();
        knownTypes = new HashSet<String>();
        aliases = new HashMap<String, Unit>();
        types = new HashMap<String, PacioliType>();
        knownTypes.add("Boole");
        knownTypes.add("Tuple");
        knownTypes.add("List");
        knownTypes.add("Set");
        knownTypes.add("Ref");
        knownTypes.add("Void");
    }

    @Override
    public void printText(PrintWriter out) {
        for (String name : indexSetDefinitions.keySet()) {
            out.format("\nindex = %s", indexSetDefinitions.get(name).toText());
        }
        for (String name : typeDefinitions.keySet()) {
            out.format("\ntypedef = %s", typeDefinitions.get(name).toText());
        }
        for (String name : knownTypes) {
            out.format("\nknown = %s", name);
        }
        for (String name : unitVectors.keySet()) {
            out.format("\nunitvector = %s", name);
        }
        for (String name : aliases.keySet()) {
            out.format("\nalias = %s", name);
        }
        for (String name : types.keySet()) {
            out.format("\ntype = %s :: %s", name, types.get(name).unfresh().toText());
        }
    }

    public void include(Dictionary other) {
        indexSetDefinitions.putAll(other.indexSetDefinitions);
        unitVectors.putAll(other.unitVectors);
        unitSystem.importSystem(other.unitSystem);
        typeDefinitions.putAll(other.typeDefinitions);
        knownTypes.addAll(other.knownTypes);
        aliases.putAll(other.aliases);
        types.putAll(other.types);
    }

    public void putIndexSetDefinition(String key, IndexSetDefinition indexSet) {
        indexSetDefinitions.put(key, indexSet);
    }

    public boolean containsIndexSetDefinition(String name) {
        return indexSetDefinitions.containsKey(name);
    }

    public IndexSetDefinition getIndexSetDefinition(String name) {
        return indexSetDefinitions.get(name);
    }

    public void putAlias(String name, Unit unit) {
        aliases.put(name, unit);
    }

    public boolean containsAlias(String name) {
        return aliases.containsKey(name);
    }

    public Unit getAlias(String name) {
        return aliases.get(name);
    }

    public void addTypeDefinition(TypeDefinition typeDef) {
        typeDefinitions.put(typeDef.localName(), typeDef);
    }

    public TypeDefinition getTypeDefinition(String name) {
        return typeDefinitions.get(name);
    }

    public boolean containsTypeDefinition(String name) {
        return typeDefinitions.containsKey(name);
    }

    public void putType(String name, PacioliType type) {
        types.put(name, type);
    }

    public PacioliType getType(String name) {
        return types.get(name);
    }

    public boolean containsType(String name) {
        return types.containsKey(name);
    }

    public void writeMVMPrelude(PrintWriter out) {
    }

    public void addUnit(String name, NamedUnit unit) {
        unitSystem.addUnit(name, unit);
    }

    public boolean congtainsUnit(String name) {
        return unitSystem.congtainsUnit(name);
    }

    public Unit getUnit(String name) {
        return unitSystem.lookupUnit(name);
    }

    public void putUnitVector(String name, UnitVector vector) {
        unitVectors.put(name, vector);
    }

    public boolean containsUnitVector(String name) {
        return unitVectors.containsKey(name);
    }

    public UnitVector getUnitVector(String name) {
        return unitVectors.get(name);
    }

    public boolean containsKnownType(String name) {
        return knownTypes.contains(name);
    }

    public void putKnownType(String name) {
        knownTypes.add(name);
    }

    public Unit translateUnit(Unit unit) {
        return unit.map(new UnitMap() {
            public Unit map(Base base) {
                if (base instanceof StringBase) {
                    if (congtainsUnit(base.toText())) {
                        return getUnit(base.toText());
                    } else {
                        throw new RuntimeException(String.format("Unit '%s' unknown", base.toText()));
                    }
                } else if (base instanceof BangBase) {
                    BangBase bangBase = (BangBase) base;
                    String bangName = bangBase.toText();
                    if (containsUnitVector(bangName)) {
                        return new MatrixBase(getUnitVector(bangName), bangBase.position);
                    } else {
                        throw new RuntimeException(String.format("Unit vector '%s' unknown", bangName));
                    }
                } else {
                    throw new RuntimeException(String.format("unknown base type: %s", base.getClass()));
                }
            }
        });
    }

    public Matrix instantiateMatrixType(MatrixType type) throws PacioliException {
        assert (type.rowDimension instanceof DimensionType);
        assert (type.columnDimension instanceof DimensionType);
        DimensionType rowDimType = (DimensionType) type.rowDimension;
        DimensionType columnDimType = (DimensionType) type.columnDimension;

        List<IndexSet> rowSets = new ArrayList<IndexSet>();
        for (String set : rowDimType.getIndexSets()) {
            if (containsIndexSetDefinition(set)) {
                rowSets.add(getIndexSetDefinition(set).getIndexSet());
            } else {
                throw new PacioliException("Index set '%s' unknown when creating conversion", set);
            }
        }
        List<IndexSet> columnSets = new ArrayList<IndexSet>();
        for (String set : columnDimType.getIndexSets()) {
            if (containsIndexSetDefinition(set)) {
                columnSets.add(getIndexSetDefinition(set).getIndexSet());
            } else {
                throw new PacioliException("Index set '%s' unknown when creating conversion", set);
            }
        }

        MatrixDimension rowDim = new MatrixDimension(rowSets);
        MatrixDimension columnDim = new MatrixDimension(columnSets);
        MatrixShape shape = new MatrixShape(
                translateUnit(type.factor),
                rowDim, translateUnit(type.rowUnit),
                columnDim, translateUnit(type.columnUnit));
        return new Matrix(shape);
    }
}
