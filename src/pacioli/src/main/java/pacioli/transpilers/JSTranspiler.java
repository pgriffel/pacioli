/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli.transpilers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.Pacioli;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.unit.UnitNode;
import pacioli.ast.visitors.JSGenerator;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.PacioliException;
import pacioli.compiler.Printer;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.info.AliasInfo;
import pacioli.symboltable.info.ClassInfo;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.symboltable.info.TypeVarInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.symboltable.info.VectorBaseInfo;
import pacioli.types.type.TypeBase;
import uom.DimensionedNumber;

public class JSTranspiler implements SymbolTableVisitor {

    CompilationSettings settings;
    Printer out;

    public JSTranspiler(Printer printWriter, CompilationSettings settings) {
        this.out = printWriter;
        this.settings = settings;
    }

    @Override
    public void visit(ValueInfo info) {

        // Infos without definition are filtered by the caller
        assert (info.definition().isPresent());

        Pacioli.logIf(Pacioli.Options.showGeneratingCode, "Compiling value %s", info.globalName());

        ValueDefinition definition = info.definition().get();
        ExpressionNode transformedBody = definition.body;
        // if (false && transformedBody instanceof LambdaNode) {
        // LambdaNode code = (LambdaNode) transformedBody;
        // out.newline();
        // out.format("Pacioli.u_%s = function () {", info.globalName());
        // out.newlineUp();
        // out.format("var args = new Pacioli.GenericType('Tuple',
        // Array.prototype.slice.call(arguments));");
        // out.format("var type = %s;", info.localType().reduce(i ->
        // true).compileToJS());
        // out.format("return Pacioli.subs(type.to, Pacioli.matchTypes(type.from,
        // args));");
        // out.newlineDown();
        // out.write("}");
        // out.newline();
        // out.format("Pacioli.b_%s = function (%s) {", info.globalName(),
        // code.argsString("lcl_"));
        // out.newlineUp();
        // out.format("return ");
        // code.expression.compileToJS(out, settings, true);
        // out.format(";");
        // out.newlineDown();
        // out.format("}");
        // out.newline();
        // out.format("Pacioli.%s = function (%s) {", info.globalName(),
        // code.argsString("lcl_"));
        // out.newlineUp();
        // out.format("return ");
        // code.expression.compileToJS(out, settings, false);
        // out.format(";");
        // out.newlineDown();
        // out.format("}");
        // out.newline();
        // } else
        if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            out.newline();

            out.format("\n"
                    + "Pacioli.compute_u_%s = function () {\n"
                    + "    return %s;\n"
                    + "}\n",
                    info.globalName(),
                    info.publicType().reduce(i -> true).compileToJS());

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
            out.format("Pacioli.%s = function (%s) {", info.globalName(), argsString(code, "lcl_"));
            out.newlineUp();
            out.format("return ");
            code.expression.compileToJS(out, settings);
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
                    info.localType().reduce(i -> true).compileToJS(),
                    info.globalName());
            transformedBody.compileToJS(out, settings);
            out.format(";\n}\n");
            // out.format("Pacioli.compute_b_%s = function () {\n return ",
            // info.globalName());
            // transformedBody.compileToJS(out, settings, true);
            // out.format(";\n}\n");
        }
    }

    private static String argsString(LambdaNode node, String prefix) {
        if (node.varArgs) {
            if (node.arguments.size() == 1) {
                // TODO: Wegwerken hier. Alleen JSTranspiler roept dit aan
                return "..." + prefix + node.arguments.get(0);
            } else {
                throw new PacioliException(node.location(), "Varargs lambda must have 1 argument");
            }
        }
        List<String> args = new ArrayList<String>();
        for (String arg : node.arguments) {
            args.add(prefix + arg + "");
        }
        return String.join(", ", args);
    }

    @Override
    public void visit(IndexSetInfo info) {

        Pacioli.logIf(Pacioli.Options.showGeneratingCode, "Compiling index set %s", info.globalName());

        assert (info.definition().isPresent());

        IndexSetDefinition definition = info.definition().get();

        if (definition.isDynamic()) {
            out.format("\nPacioli.compute_%s = function () {return Pacioli.makeIndexSet('%s', '%s', ",
                    info.globalName(),
                    info.globalName(),
                    definition.name());
            definition.body().compileToJS(out, settings);
            out.format(")}\n");
        } else {

            List<String> quotedItems = new ArrayList<String>();
            for (String item : definition.items()) {
                quotedItems.add(String.format("\"%s\"", item));
            }
            out.format("\nPacioli.compute_%s = function () {return Pacioli.makeIndexSet('%s', '%s', [ %s ])}\n",
                    info.globalName(),
                    info.globalName(),
                    definition.name(),
                    String.join(",", quotedItems));
        }

    }

    @Override
    public void visit(ParametricInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ScalarBaseInfo info) {

        Pacioli.logIf(Pacioli.Options.showGeneratingCode, "Compiling unit %s", info.globalName());

        Optional<UnitDefinition> optionalDefinition = info.definition();

        if (optionalDefinition.isPresent()) {
            Optional<UnitNode> optionalBody = optionalDefinition.get().body;
            if (optionalBody.isPresent()) {
                UnitNode body = optionalBody.get();
                DimensionedNumber<TypeBase> number = body.evalUnit();
                number = number.flat();
                out.format("Pacioli.compute_%s = function () {\n", info.globalName());
                out.format("    return {definition: Pacioli.DimNum.fromNumber(%s, %s), symbol: \"%s\"}\n",
                        number.factor(), TypeBase.compileUnitToJS(number.unit()),
                        JSGenerator.escapeString(info.symbol()));
                out.format("}\n");
            } else {
                out.format("Pacioli.compute_%s = function () { return {symbol: \"%s\"}};\n",
                        info.globalName(), JSGenerator.escapeString(info.symbol()));
            }
        } else {
            throw new RuntimeException("ScalarUnitInfo misses definition");
        }
    }

    @Override
    public void visit(VectorBaseInfo info) {

        assert (info.definition().isPresent());

        Pacioli.logIf(Pacioli.Options.showGeneratingCode, "Compiling vector unit %s", info.globalName());

        IndexSetInfo setInfo = (IndexSetInfo) info.definition().get().indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();

        for (UnitDecl entry : info.items()) {
            DimensionedNumber<TypeBase> number = entry.value.evalUnit();
            // todo: take number.factor() into account!?
            unitTexts.add("'" + entry.key.name() + "': " + TypeBase.compileUnitToJS(number.unit()));
        }

        String globalName = // info.globalName();//setInfo.globalName();
                String.format("vbase_%s_%s", setInfo.generalInfo().module(), info.name().replace("!", "_"));
        String args = String.join(", ", unitTexts);

        out.format("Pacioli.compute_%s = function () { return {units: { %s }}};\n", globalName, args);
    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

    @Override
    public void visit(TypeVarInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ClassInfo classInfo) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

}
