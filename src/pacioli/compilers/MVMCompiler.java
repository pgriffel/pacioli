package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;

import pacioli.CompilationSettings;
import pacioli.Pacioli;
import pacioli.Utils;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarUnitInfo;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorUnitInfo;
import pacioli.types.TypeBase;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.Printer;
import uom.DimensionedNumber;

public class MVMCompiler implements SymbolTableVisitor {

    //CodeGenerator generator;
    //PrintWriter out;
    CompilationSettings settings;
    Printer out;
    
    public MVMCompiler(Printer printWriter, CompilationSettings settings) {
        //super(printWriter);
        //generator = new MVMGenerator(printWriter, settings);
        this.out = printWriter;
        this.settings = settings;
    }
    
    @Override
    public void visit(ValueInfo info) {
        
        Pacioli.logln2("Compiling value %s", info.globalName());
        
        out.format("store \"%s\" ", info.globalName());
        out.newlineUp();
        ValueDefinition def = info.definition;
        def.body.accept(new MVMGenerator(out, settings));
        out.print(";");
        out.newlineDown();
        out.newline();
    }

    @Override
    public void visit(IndexSetInfo info) {
     
        Pacioli.logln2("Compiling index set %s", info.globalName());
        
        List<String> quotedItems = new ArrayList<String>();
        for (String item : info.definition.items) {
            quotedItems.add(String.format("\"%s\"", item));
        }
        out.format("indexset \"%s\" \"%s\" list(%s);\n", info.globalName(), info.definition.localName(),
                Utils.intercalate(",", quotedItems));
    }

    @Override
    public void visit(TypeInfo info) {
        //Pacioli.logln("Compiling type %s", info.globalName());
    }

    @Override
    public void visit(ScalarUnitInfo info) {
        
        Pacioli.logln("Compiling unit %s", info.globalName());

        if (info.definition.body == null) {
            out.format("baseunit \"%s\" \"%s\";\n", info.name(), info.symbol);
        } else {
            //DimensionedNumber<TypeBase> number = (scalarInfo.baseDefinition.evalUnit();
            DimensionedNumber<TypeBase> number = info.definition.body.evalUnit();
            number = number.flat();
            out.format("unit \"%s\" \"%s\" %s %s;\n", info.name(), info.symbol, number.factor(),
                    MVMGenerator.compileUnitToMVM(number.unit()));
        }
    }
    
    @Override
    public void visit(VectorUnitInfo info) {
        
        Pacioli.logln("Compiling vector unit %s", info.globalName());
        
        IndexSetInfo setInfo = (IndexSetInfo) ((UnitVectorDefinition) info.definition).indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();
        // for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
        for (UnitDecl entry : info.items) {
            DimensionedNumber<TypeBase> number = entry.value.evalUnit();
            // todo: take number.factor() into account!? 
            unitTexts.add("\"" + entry.key.getName() + "\": " + MVMGenerator.compileUnitToMVM(number.unit()));
        }
        String globalName = setInfo.definition.globalName();
        String name = info.name();
        String args = Utils.intercalate(", ", unitTexts); 
        out.print(String.format("unitvector \"%s\" \"%s\" list(%s);\n", globalName, name, args));
    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

}
