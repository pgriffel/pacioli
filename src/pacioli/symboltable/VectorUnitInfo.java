package pacioli.symboltable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import pacioli.Location;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.types.TypeBase;
import uom.DimensionedNumber;
import uom.Unit;

public class VectorUnitInfo extends UnitInfo implements SymbolInfo {

    private Optional<UnitVectorDefinition> definition = Optional.empty();
    private List<UnitDecl> items;
    private Map<String, DimensionedNumber<TypeBase>> units;

    public VectorUnitInfo(String name, String module, Boolean isGlobal, Location location) {
        super(new GenericInfo(name, module, isGlobal, location));
    }
    
    public VectorUnitInfo(GenericInfo generic) {
        super(generic);
    }

    public void setItems(List<UnitDecl> items) {
        this.items = items;
        units = new HashMap<String, DimensionedNumber<TypeBase>>();
        for (UnitDecl decl: items) {
            units.put(decl.key.getName(), decl.value.evalUnit());
        }
    }
    
    public List<UnitDecl> getItems() {
        return items;
    }
    
    public Unit<TypeBase> getUnit(String name) {
        // todo: handle ignored factor!!!
        DimensionedNumber<TypeBase> stored = units.get(name);
        Unit<TypeBase> val = (stored == null) ? TypeBase.ONE : stored.unit();
        return val;
    }
    
    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }

    @Override
    public Optional<UnitVectorDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(UnitVectorDefinition definition) {
        this.definition = Optional.of(definition);
    }
    
    public VectorUnitInfo includeOther(VectorUnitInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

}
