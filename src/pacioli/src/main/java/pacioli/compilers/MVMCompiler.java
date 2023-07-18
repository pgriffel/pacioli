package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.Pacioli;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.visitors.MVMGenerator;
import pacioli.misc.CompilationSettings;
import pacioli.misc.Printer;
import pacioli.misc.Utils;
import pacioli.ast.definition.ValueDefinition;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.ClassInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarBaseInfo;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeVarInfo;
import pacioli.symboltable.ParametricInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorBaseInfo;
import pacioli.types.TypeBase;
import uom.DimensionedNumber;

public class MVMCompiler implements SymbolTableVisitor {

    CompilationSettings settings;
    Printer out;

    public MVMCompiler(Printer printWriter, CompilationSettings settings) {
        this.out = printWriter;
        this.settings = settings;
    }

    @Override
    public void visit(ValueInfo info) {

        // Infos without definition are filtered by the caller
        assert (info.getDefinition().isPresent());

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling value %s", info.globalName());

        out.format("store \"%s\" ", info.globalName());
        out.newlineUp();
        ValueDefinition def = info.getDefinition().get();
        def.body.accept(new MVMGenerator(out, settings));
        out.print(";");
        out.newlineDown();
        out.newline();
    }

    @Override
    public void visit(IndexSetInfo info) {

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling index set %s", info.globalName());

        assert (info.getDefinition().isPresent());

        IndexSetDefinition definition = info.getDefinition().get();

        if (definition.isDynamic()) {
            out.format("indexset \"%s\" \"%s\" ", info.globalName(), info.getDefinition().get().getName());
            info.getDefinition().get().getBody().accept(new MVMGenerator(out, settings));
            out.format(";\n");
        } else {
            List<String> quotedItems = new ArrayList<String>();
            for (String item : definition.getItems()) {
                quotedItems.add(String.format("\"%s\"", item));
            }
            out.format("indexset \"%s\" \"%s\" list(%s);\n", info.globalName(), info.getDefinition().get().getName(),
                    Utils.intercalate(",", quotedItems));
        }

    }

    @Override
    public void visit(ParametricInfo info) {
        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling type %s", info.globalName());
    }

    @Override
    public void visit(ScalarBaseInfo info) {

        Optional<UnitDefinition> definition = info.getDefinition();

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling unit %s", info.globalName());

        if (definition.isPresent()) {

            if (!definition.get().body.isPresent()) {
                out.format("baseunit \"%s\" \"%s\";\n", info.name(), info.symbol);
            } else {
                DimensionedNumber<TypeBase> number = definition.get().body.get().evalUnit();
                number = number.flat();
                out.format("unit \"%s\" \"%s\" %s %s;\n", info.name(), info.symbol, number.factor(),
                        MVMGenerator.compileUnitToMVM(number.unit()));
            }
        } else {
            throw new RuntimeException("Definition missing in ScalarUnitInfo");
        }
    }

    @Override
    public void visit(VectorBaseInfo info) {

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling vector unit %s", info.globalName());

        assert (info.getDefinition().isPresent());

        IndexSetInfo setInfo = (IndexSetInfo) info.getDefinition().get().indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();
        // for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
        for (UnitDecl entry : info.getItems()) {
            DimensionedNumber<TypeBase> number = entry.value.evalUnit();
            // todo: take number.factor() into account!?
            unitTexts.add("\"" + entry.key.getName() + "\": " + MVMGenerator.compileUnitToMVM(number.unit()));
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
