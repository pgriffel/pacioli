package pacioli.transpilers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.Pacioli;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.visitors.MVMGenerator;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.Printer;
import pacioli.compiler.Utils;
import pacioli.ast.definition.ValueDefinition;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.info.AliasInfo;
import pacioli.symboltable.info.ClassInfo;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.symboltable.info.TypeVarInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.symboltable.info.VectorBaseInfo;
import pacioli.types.TypeBase;
import uom.DimensionedNumber;

public class MVMTranspiler implements SymbolTableVisitor {

    CompilationSettings settings;
    Printer out;

    public MVMTranspiler(Printer printWriter, CompilationSettings settings) {
        this.out = printWriter;
        this.settings = settings;
    }

    @Override
    public void visit(ValueInfo info) {

        // Infos without definition are filtered by the caller
        assert (info.definition().isPresent());

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling value %s", info.globalName());

        out.format("store \"%s\" ", info.globalName());
        out.newlineUp();
        ValueDefinition def = info.definition().get();
        def.body.accept(new MVMGenerator(out, settings));
        out.print(";");
        out.newlineDown();
        out.newline();
    }

    @Override
    public void visit(IndexSetInfo info) {

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling index set %s", info.globalName());

        assert (info.definition().isPresent());

        IndexSetDefinition definition = info.definition().get();

        if (definition.isDynamic()) {
            out.format("indexset \"%s\" \"%s\" ", info.globalName(), info.definition().get().name());
            info.definition().get().body().accept(new MVMGenerator(out, settings));
            out.format(";\n");
        } else {
            List<String> quotedItems = new ArrayList<String>();
            for (String item : definition.items()) {
                quotedItems.add(String.format("\"%s\"", item));
            }
            out.format("indexset \"%s\" \"%s\" list(%s);\n", info.globalName(), info.definition().get().name(),
                    Utils.intercalate(",", quotedItems));
        }

    }

    @Override
    public void visit(ParametricInfo info) {
        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling type %s", info.globalName());
    }

    @Override
    public void visit(ScalarBaseInfo info) {

        Optional<UnitDefinition> definition = info.definition();

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling unit %s", info.globalName());

        if (definition.isPresent()) {

            if (!definition.get().body.isPresent()) {
                out.format("baseunit \"%s\" \"%s\";\n", info.name(), info.symbol());
            } else {
                DimensionedNumber<TypeBase> number = definition.get().body.get().evalUnit();
                number = number.flat();
                out.format("unit \"%s\" \"%s\" %s %s;\n", info.name(), info.symbol(), number.factor(),
                        MVMGenerator.compileUnitToMVM(number.unit()));
            }
        } else {
            throw new RuntimeException("Definition missing in ScalarUnitInfo");
        }
    }

    @Override
    public void visit(VectorBaseInfo info) {

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling vector unit %s", info.globalName());

        assert (info.definition().isPresent());

        IndexSetInfo setInfo = (IndexSetInfo) info.definition().get().indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();
        // for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
        for (UnitDecl entry : info.items()) {
            DimensionedNumber<TypeBase> number = entry.value.evalUnit();
            // todo: take number.factor() into account!?
            unitTexts.add("\"" + entry.key.name() + "\": " + MVMGenerator.compileUnitToMVM(number.unit()));
        }
        String globalName = setInfo.globalName();
        String name = info.name();
        String args = Utils.intercalate(", ", unitTexts);
        out.print(String.format("unitvector \"%s\" \"%s\" list(%s);\n", globalName, name, args));
    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

    @Override
    public void visit(TypeVarInfo info) {
        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling type %s", info.globalName());
    }

    @Override
    public void visit(ClassInfo classInfo) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

}
