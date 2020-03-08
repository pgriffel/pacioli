package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;

import pacioli.CompilationSettings;
import pacioli.Pacioli;
import pacioli.Utils;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarUnitInfo;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorUnitInfo;
import pacioli.types.TypeBase;
import pacioli.visitors.JSGenerator;
import pacioli.visitors.Printer;
import uom.DimensionedNumber;

public class JSCompiler implements SymbolTableVisitor {

    CompilationSettings settings;
    Printer out;
    
    public JSCompiler(Printer printWriter, CompilationSettings settings) {
        this.out = printWriter;
        this.settings = settings;
    }
    
    @Override
    public void visit(ValueInfo info) {
        
        Pacioli.logln2("Compiling value %s", info.globalName());
        
        ValueDefinition definition = (ValueDefinition) info.definition;
        assert(definition != null); // todo: refactor further!
        ExpressionNode transformedBody = definition.body;
        if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            out.format("\n" 
                    + "Pacioli.u_%s = function () {\n"
                    + "    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));\n"
                    + "    var type = %s;\n"
                    + "    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));\n"
                    + "}\n"
                    + "Pacioli.b_%s = function (%s) {\n"
                    + "    return %s;\n" 
                    + "}\n"
                    + "Pacioli.%s = function (%s) {\n"
                    + "    return %s;\n" 
                    + "}\n",
                    definition.globalName(),
                    info.inferredType.reduce().compileToJS(),
                    //info.inferredType.compileToJS(),
                    definition.globalName(),
                    code.argsString(),
                    code.expression.compileToJS(settings, true),
                    definition.globalName(),
                    code.argsString(),
                    code.expression.compileToJS(settings, false));
        } else {
            out.format("\n"
                    + "Pacioli.compute_u_%s = function () {\n"
                    + "    return %s;\n"
                    + "}\n"
                        + "Pacioli.compute_%s = function () {\n  return %s;\n}\n"
                    + "Pacioli.compute_b_%s = function () {\n  return %s;\n}\n",
                    definition.globalName(),
                    info.inferredType.reduce().compileToJS(), //transformedBody.compileToJSShape(),
                    //info.inferredType.compileToJS(), //transformedBody.compileToJSShape(),
                    definition.globalName(),
                    transformedBody.compileToJS(settings, false),
                    definition.globalName(),
                    transformedBody.compileToJS(settings, true));
        }
    }

    @Override
    public void visit(IndexSetInfo info) {
     
        Pacioli.logln2("Compiling index set %s", info.globalName());
        
        IndexSetDefinition definition = info.definition;
        
        List<String> quotedItems = new ArrayList<String>();
        for (String item : definition.items) {
            quotedItems.add(String.format("\"%s\"", item));
        }
        out.format("\nPacioli.compute_%s = function () {return Pacioli.makeIndexSet('%s', [ %s ])}\n", 
                definition.globalName(), 
                definition.localName(),
                Utils.intercalate(",", quotedItems));
    }

    @Override
    public void visit(TypeInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(UnitInfo infoToRefactor) {
        
        ScalarUnitInfo info = (ScalarUnitInfo) infoToRefactor; 
        
        Pacioli.logln("Compiling unit %s", info.globalName());
        
        if (info.baseDefinition == null) {
            out.format("Pacioli.compute_%s = function () { return {symbol: '%s'}};\n", 
                    info.globalName(), info.symbol);
        } else {
            DimensionedNumber<TypeBase> number = info.baseDefinition.evalUnit();
            number = number.flat();
            out.format("Pacioli.compute_%s = function () {\n", info.globalName());
            out.format("    return {definition: new Pacioli.DimensionedNumber(%s, %s), symbol: '%s'}\n",
                    number.factor(), JSGenerator.compileUnitToJS(number.unit()), info.symbol);   
            out.format("}\n");
        }        
    }
    
    @Override
    public void visit(VectorUnitInfo info) {
        
        Pacioli.logln("Compiling vector unit %s", info.globalName());
        
        IndexSetInfo setInfo = (IndexSetInfo) ((UnitVectorDefinition) info.getDefinition()).indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();
        
        for (UnitDecl entry : info.items) {
            DimensionedNumber<TypeBase> number = entry.value.evalUnit();
            // todo: take number.factor() into account!? 
            unitTexts.add("'" + entry.key.getName() + "': " + JSGenerator.compileUnitToJS(number.unit()));
        }
        
        String globalName = setInfo.definition.globalName();
        String name = info.name();
        String args = Utils.intercalate(", ", unitTexts);
        
        out.format("function compute_%s () { return {units: { %s }}};\n", globalName, name, args);
    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

}
