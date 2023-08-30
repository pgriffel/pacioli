package pacioli.symboltable;

import pacioli.symboltable.info.AliasInfo;
import pacioli.symboltable.info.ClassInfo;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.symboltable.info.TypeVarInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.symboltable.info.VectorBaseInfo;

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
