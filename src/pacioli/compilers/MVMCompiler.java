package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.CompilationSettings;
import pacioli.Printer;
import pacioli.Utils;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarUnitInfo;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorUnitInfo;
import pacioli.types.TypeBase;
import pacioli.visitors.MVMGenerator;
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
        
        assert(info.getDefinition().isPresent()); // Infos without definition are filtered by the caller
        
        //Pacioli.logln2("Compiling value %s", info.globalName());
        
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
     
        //Pacioli.logln2("Compiling index set %s", info.globalName());
        
        assert(info.getDefinition().isPresent());
        
        List<String> quotedItems = new ArrayList<String>();
        for (String item : info.getDefinition().get().items) {
            quotedItems.add(String.format("\"%s\"", item));
        }
        out.format("indexset \"%s\" \"%s\" list(%s);\n", info.globalName(), info.getDefinition().get().localName(),
                Utils.intercalate(",", quotedItems));
    }

    @Override
    public void visit(TypeInfo info) {
        //Pacioli.logln("Compiling type %s", info.globalName());
    }

    @Override
    public void visit(ScalarUnitInfo info) {
        
        Optional<UnitDefinition> definition = info.getDefinition();
        
        //Pacioli.logln("Compiling unit %s", info.globalName());

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
    public void visit(VectorUnitInfo info) {
        
        //Pacioli.logln("Compiling vector unit %s", info.globalName());
        assert(info.getDefinition().isPresent());
        
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

}
