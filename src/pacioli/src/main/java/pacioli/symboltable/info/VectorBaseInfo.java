package pacioli.symboltable.info;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.types.TypeBase;
import uom.DimensionedNumber;

public final class VectorBaseInfo extends UnitInfo {

    private Optional<UnitVectorDefinition> definition = Optional.empty();
    private List<UnitDecl> items;
    private Map<String, UnitDecl> units;

    public VectorBaseInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        super(new GeneralInfo(name, file, isGlobal, location));
        assert (name.contains("!"));
    }

    public VectorBaseInfo(GeneralInfo info) {
        super(info);
    }

    public void setItems(List<UnitDecl> items) {
        this.items = items;
        // units = new HashMap<String, DimensionedNumber<TypeBase>>();
        units = new HashMap<String, UnitDecl>();
        for (UnitDecl decl : items) {
            // units.put(decl.key.getName(), decl.value.evalUnit());
            units.put(decl.key.getName(), decl);
        }
    }

    public List<UnitDecl> getItems() {
        return items;
    }

    public DimensionedNumber<TypeBase> getUnit(String name) {
        // todo: handle ignored factor!!!
        // DimensionedNumber<TypeBase> stored = units.get(name);
        // DimensionedNumber<TypeBase> stored = units.get(name).value.evalUnit();
        UnitDecl stored = units.get(name);
        return (stored == null) ? new DimensionedNumber<TypeBase>() : stored.value.evalUnit();
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("vbase_%s", name().replace("!", "_"));
    }

    @Override
    public Optional<UnitVectorDefinition> getDefinition() {
        return definition;
    }

    public void setDefinition(UnitVectorDefinition definition) {
        this.definition = Optional.of(definition);
    }

    public static class Builder extends GeneralBuilder<Builder, VectorBaseInfo> {

        private UnitVectorDefinition definition;
        private List<UnitDecl> items;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder definition(UnitVectorDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder items(List<UnitDecl> items) {
            this.items = items;
            return this;
        }

        @Override
        public VectorBaseInfo build() {
            // if (definition == null || file == null || instances == null) {
            // throw new RuntimeException("Class info incomplete");
            // }
            VectorBaseInfo info = new VectorBaseInfo(this.buildGeneralInfo());
            info.definition = Optional.ofNullable(this.definition);
            info.setItems(this.items);
            return info;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
