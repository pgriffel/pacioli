package pacioli.symboltable;

public record PacioliTable(SymbolTable<ValueInfo> values, SymbolTable<TypeSymbolInfo> types) {

    public static PacioliTable empty() {
        return new PacioliTable( new SymbolTable<ValueInfo>(),  new SymbolTable<TypeSymbolInfo>());
    }

    public PacioliTable addAll(PacioliTable pacioliTable) {
        values.addAll(pacioliTable.values);
        types.addAll(pacioliTable.types);
        return this;
    }
};
