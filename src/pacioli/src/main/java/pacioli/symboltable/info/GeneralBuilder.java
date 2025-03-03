package pacioli.symboltable.info;

import pacioli.ast.definition.Documentation;
import pacioli.ast.expression.StringNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;

public abstract class GeneralBuilder<S, T> implements InfoBuilder<S, T> {

    private String name;
    private PacioliFile file;
    private Boolean isGlobal;
    private Location location;
    private Documentation documentation;
    private boolean isPublic;

    protected abstract S self();

    public S name(String name) {
        this.name = name;
        return self();
    }

    public S file(PacioliFile file) {
        this.file = file;
        return self();
    }

    public S isGlobal(Boolean isGlobal) {
        this.isGlobal = isGlobal;
        return self();
    }

    public S location(Location location) {
        this.location = location;
        return self();
    }

    public S documentation(Documentation documentation) {
        if (this.documentation != null) {
            throw new PacioliException(documentation.location(),
                    "Duplicate doc for '%s'. It is already defined in %s.",
                    documentation.name(),
                    this.documentation.location().description());
        }
        this.documentation = documentation;
        return self();
    }

    public S isPublic(boolean isPublic) {
        this.isPublic = isPublic;
        return self();
    }

    GeneralInfo buildGeneralInfo() {
        if (name == null ||
                file == null ||
                isGlobal == null ||
                location == null) {
            throw new RuntimeException("Field missing");
        }
        return new GeneralInfo(name, file, isGlobal, isPublic, location, this.documentation);
    }
}
