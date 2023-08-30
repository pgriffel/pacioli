package pacioli.types.type;

public class TypeIdentifier {

    private final String name;
    private final String home;

    public TypeIdentifier(String home, String name) {
        assert (home != null);
        assert (name != null);
        this.home = home;
        this.name = name;
        // assert (!name.contains("!"));
    }

    public String name() {
        return name;
    }

    public String home() {
        return home;
    }

    @Override
    public String toString() {
        return String.format("'%s'", name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof TypeIdentifier)) {
            return false;
        }
        TypeIdentifier otherIdentifier = (TypeIdentifier) other;
        return name.equals(otherIdentifier.name) && home.equals(otherIdentifier.home);
    }

}
