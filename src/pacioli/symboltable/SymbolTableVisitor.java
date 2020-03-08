package pacioli.symboltable;

public interface SymbolTableVisitor {

    void visit(ValueInfo info);
    void visit(IndexSetInfo info);
    void visit(TypeInfo info);
    void visit(UnitInfo info);
    void visit(VectorUnitInfo info);
    void visit(AliasInfo info);
}
