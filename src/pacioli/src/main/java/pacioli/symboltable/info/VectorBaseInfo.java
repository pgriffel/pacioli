package pacioli.symboltable.info;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.types.type.TypeBase;
import uom.DimensionedNumber;

public final class VectorBaseInfo extends UnitInfo {

    private final UnitVectorDefinition definition;
    private final List<UnitDecl> items;
    private final Map<String, UnitDecl> units;

    public VectorBaseInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location) {
        super(new GeneralInfo(name, file, isGlobal, isPublic, location));
        assert (name.contains("!"));
        this.definition = null;
        this.items = null;
        this.units = null;
    }

    public VectorBaseInfo(GeneralInfo info, UnitVectorDefinition definition, List<UnitDecl> items) {
        super(info);
        this.definition = definition;
        this.items = items;
        this.units = new HashMap<String, UnitDecl>();
        for (UnitDecl decl : items) {
            units.put(decl.key.name(), decl);
        }
    }

    public List<UnitDecl> items() {
        return items;
    }

    public DimensionedNumber<TypeBase> lookupUnit(String name) {
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
    public Optional<UnitVectorDefinition> definition() {
        return Optional.ofNullable(definition);
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
            return new VectorBaseInfo(this.buildGeneralInfo(), definition, items);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
