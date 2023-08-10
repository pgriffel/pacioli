package pacioli.symboltable.info;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.InstanceDefinition;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class ClassInfo extends AbstractSymbolInfo implements TypeSymbolInfo {

    public final ClassDefinition definition;
    public final PacioliFile file;
    public final List<InstanceInfo> instances;

    public ClassInfo(
            ClassDefinition definition,
            PacioliFile file,
            List<InstanceInfo> instances) {
        super(new GeneralInfo(definition.getName(), file, true, definition.getLocation()));
        this.definition = definition;
        this.file = file;
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
    public Optional<ClassDefinition> getDefinition() {
        return Optional.of(definition);
    }

    public void addMember(InstanceDefinition instanceDefinition) {
        System.out.println("Adding MEMBEr");
    }

    public static class Builder {
        private ClassDefinition definition;
        private PacioliFile file;
        public List<InstanceInfo> instances = new ArrayList<>();

        public Builder definition(ClassDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder file(PacioliFile file) {
            this.file = file;
            return this;
        }

        public Builder instance(InstanceInfo def) {
            this.instances.add(def);
            return this;
        }

        public ClassInfo build() {
            if (definition == null || file == null || instances == null) {
                throw new RuntimeException("Class info incomplete");
            }
            return new ClassInfo(definition, file, instances);
        }

    }

    public static Builder builder() {
        return new Builder();
    }

}
