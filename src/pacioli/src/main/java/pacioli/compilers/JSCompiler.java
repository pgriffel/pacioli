package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.CompilationSettings;
import pacioli.Pacioli;
import pacioli.Printer;
import pacioli.Utils;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarBaseInfo;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorBaseInfo;
import pacioli.types.TypeBase;
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

        // Infos without definition are filtered by the caller
        assert (info.getDefinition().isPresent());

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling value %s", info.globalName());

        ValueDefinition definition = info.getDefinition().get();
        ExpressionNode transformedBody = definition.body;
        if (false && transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            out.newline();
            out.format("Pacioli.u_%s = function () {", info.globalName());
            out.newlineUp();
            out.format("var args = new Pacioli.GenericType('Tuple', Array.prototype.slice.call(arguments));");
            out.format("var type = %s;", info.inferredType().reduce(i -> true).compileToJS());
            out.format("return Pacioli.subs(type.to, Pacioli.matchTypes(type.from, args));");
            out.newlineDown();
            out.write("}");
            out.newline();
            out.format("Pacioli.b_%s = function (%s) {", info.globalName(), code.argsString("lcl_"));
            out.newlineUp();
            out.format("return ");
            code.expression.compileToJS(out, settings, true);
            out.format(";");
            out.newlineDown();
            out.format("}");
            out.newline();
            out.format("Pacioli.%s = function (%s) {", info.globalName(), code.argsString("lcl_"));
            out.newlineUp();
            out.format("return ");
            code.expression.compileToJS(out, settings, false);
            out.format(";");
            out.newlineDown();
            out.format("}");
            out.newline();
        } else if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            out.newline();

            out.format("\n"
                    + "Pacioli.compute_u_%s = function () {\n"
                    + "    return %s;\n"
                    + "}\n",
                    info.globalName(),
                    info.getType().reduce(i -> true).compileToJS());

            // out.newline();
            // out.format("Pacioli.b_%s = function (%s) {", info.globalName(),
            // code.argsString());
            // out.newlineUp();
            // out.format("return ");
            // code.expression.compileToJS(out, settings, true);
            // out.format(";");
            // out.newlineDown();
            // out.format("}");
            out.newline();
            out.format("Pacioli.%s = function (%s) {", info.globalName(), code.argsString("lcl_"));
            out.newlineUp();
            out.format("return ");
            code.expression.compileToJS(out, settings, false);
            out.format(";");
            out.newlineDown();
            out.format("}");
            out.newline();
        } else {
            out.format("\n"
                    + "Pacioli.compute_u_%s = function () {\n"
                    + "    return %s;\n"
                    + "}\n"
                    + "Pacioli.compute_%s = function () {\n  return ",
                    info.globalName(),
                    info.inferredType().reduce(i -> true).compileToJS(),
                    info.globalName());
            transformedBody.compileToJS(out, settings, false);
            out.format(";\n}\n");
            // out.format("Pacioli.compute_b_%s = function () {\n return ",
            // info.globalName());
            // transformedBody.compileToJS(out, settings, true);
            // out.format(";\n}\n");
        }
    }

    @Override
    public void visit(IndexSetInfo info) {

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling index set %s", info.globalName());

        assert (info.getDefinition().isPresent());

        IndexSetDefinition definition = info.getDefinition().get();

        if (definition.isDynamic()) {
            out.format("\nPacioli.compute_%s = function () {return Pacioli.makeIndexSet('%s', '%s', ",
                    info.globalName(),
                    info.globalName(),
                    definition.localName());
            definition.getBody().compileToJS(out, settings, false);
            out.format(")}\n");
        } else {

            List<String> quotedItems = new ArrayList<String>();
            for (String item : definition.getItems()) {
                quotedItems.add(String.format("\"%s\"", item));
            }
            out.format("\nPacioli.compute_%s = function () {return Pacioli.makeIndexSet('%s', '%s', [ %s ])}\n",
                    info.globalName(),
                    info.globalName(),
                    definition.localName(),
                    Utils.intercalate(",", quotedItems));
        }

    }

    @Override
    public void visit(TypeInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ScalarBaseInfo info) {

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling unit %s", info.globalName());

        Optional<UnitDefinition> optionalDefinition = info.getDefinition();

        if (optionalDefinition.isPresent()) {
            Optional<UnitNode> optionalBody = optionalDefinition.get().body;
            if (optionalBody.isPresent()) {
                UnitNode body = optionalBody.get();
                DimensionedNumber<TypeBase> number = body.evalUnit();
                number = number.flat();
                out.format("Pacioli.compute_%s = function () {\n", info.globalName());
                out.format("    return {definition: new Pacioli.DimNum(%s, %s), symbol: '%s'}\n",
                        number.factor(), TypeBase.compileUnitToJS(number.unit()), info.symbol);
                out.format("}\n");
            } else {
                out.format("Pacioli.compute_%s = function () { return {symbol: '%s'}};\n",
                        info.globalName(), info.symbol);
            }
        } else {
            throw new RuntimeException("ScalarUnitInfo misses definition");
        }
    }

    @Override
    public void visit(VectorBaseInfo info) {

        assert (info.getDefinition().isPresent());

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling vector unit %s", info.globalName());

        IndexSetInfo setInfo = (IndexSetInfo) info.getDefinition().get().indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();

        for (UnitDecl entry : info.getItems()) {
            DimensionedNumber<TypeBase> number = entry.value.evalUnit();
            // todo: take number.factor() into account!?
            unitTexts.add("'" + entry.key.getName() + "': " + TypeBase.compileUnitToJS(number.unit()));
        }

        String globalName = // info.globalName();//setInfo.globalName();
                String.format("vbase_%s_%s", setInfo.generic().getModule(), info.name().replace("!", "_"));
        String args = Utils.intercalate(", ", unitTexts);

        out.format("Pacioli.compute_%s = function () { return {units: { %s }}};\n", globalName, args);
    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

}
