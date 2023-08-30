package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;

public interface InfoBuilder<S, T> {

    public S name(String name);

    public S file(PacioliFile file);

    public S location(Location location);

    public S isPublic(boolean isPublic);

    public S isGlobal(Boolean isGlobal);

    public S documentation(String docu);

    public Optional<Location> definitionLocation();

    T build();
}
