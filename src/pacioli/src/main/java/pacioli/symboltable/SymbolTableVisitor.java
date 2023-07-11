package pacioli.symboltable;

public interface SymbolTableVisitor {

    void visit(ValueInfo info);

    void visit(IndexSetInfo info);

    void visit(ParametricInfo info);

    void visit(ScalarBaseInfo info);

    void visit(VectorBaseInfo info);

    void visit(AliasInfo info);

    void visit(TypeVarInfo typeVarInfo);

    void visit(ClassInfo classInfo);
}
