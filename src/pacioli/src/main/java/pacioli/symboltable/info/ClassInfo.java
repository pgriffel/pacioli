package pacioli.symboltable.info;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.InstanceDefinition;
import pacioli.symboltable.SymbolTableVisitor;

public final class ClassInfo extends AbstractInfo implements TypeInfo {

    private final ClassDefinition definition;
    private final List<InstanceInfo> instances;

    public ClassInfo(
            GeneralInfo info,
            ClassDefinition definition,
            List<InstanceInfo> instances) {
        super(info);
        this.definition = definition;
        this.instances = instances;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("%s_%s", generalInfo().getModule(), name());
    }

    @Override
    public Optional<ClassDefinition> definition() {
        return Optional.of(definition);
    }

    public List<InstanceInfo> instances() {
        return this.instances;
    }

    public void addMember(InstanceDefinition instanceDefinition) {
        System.out.println("Adding MEMBEr");
    }

    public static class Builder extends GeneralBuilder<Builder, ClassInfo> {

        private ClassDefinition definition;
        public List<InstanceInfo> instances = new ArrayList<>();

        @Override
        protected Builder self() {
            return this;
        }

        public Builder definition(ClassDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder instance(InstanceInfo def) {
            this.instances.add(def);
            return this;
        }

        public ClassInfo build() {
            if (definition == null || instances == null) {
                throw new RuntimeException("Class info incomplete");
            }
            return new ClassInfo(buildGeneralInfo(), definition, instances);
        }

    }

    public static Builder builder() {
        return new Builder();
    }

}
