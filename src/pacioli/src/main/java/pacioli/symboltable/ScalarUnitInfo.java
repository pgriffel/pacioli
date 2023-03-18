package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.ast.definition.UnitDefinition;

public class ScalarUnitInfo extends UnitInfo implements SymbolInfo {

    public String symbol;
    private Optional<UnitDefinition> definition = Optional.empty();
    
    public ScalarUnitInfo(String name, String module, Boolean isGlobal, Location location, Boolean fromProgram) {
        super(new GenericInfo(name, module, isGlobal, location, fromProgram));
    }
    
    public ScalarUnitInfo(GenericInfo generic) {
        super(generic);
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
    public Optional<UnitDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(UnitDefinition definition) {
        this.definition = Optional.of(definition);
    }
    
    public Boolean isAlias() {
        return false;
    }

    public ScalarUnitInfo includeOther(ScalarUnitInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }
    
    public UnitInfo withFromProgram(boolean fromProgram) {
        ScalarUnitInfo info = new ScalarUnitInfo(generic().withFromProgram(fromProgram));
        info.symbol = symbol;
        info.definition = definition;
        return info;
    }
}
