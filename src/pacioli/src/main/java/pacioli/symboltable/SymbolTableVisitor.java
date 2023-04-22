package pacioli.symboltable;

public interface SymbolTableVisitor {

    void visit(ValueInfo info);
    void visit(IndexSetInfo info);
    void visit(TypeInfo info);
    void visit(ScalarBaseInfo info);
    void visit(VectorBaseInfo info);
    void visit(AliasInfo info);
}
