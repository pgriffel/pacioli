/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
import pacioli.types.type.matrix.MatrixBase;
import pacioli.types.type.matrix.ScalarBase;
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

        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling value %s", info.globalName());
        }

        ValueDefinition definition = info.definition().get();

        out.newline();

        if (definition.body instanceof LambdaNode code) {
            out.format("Pacioli.%s = function (%s) {", info.globalName(), argsString(code, "lcl_"));
            out.newlineUp();
            if (code.varArgs) {
                out.write("const " + "lcl_" + code.arguments.get(0) + " = Pacioli.tagList(varargs);");
            }
            out.format("return ");
            code.expression.lower().compileToJS(out, settings);
        } else {
            out.format("Pacioli.compute_%s = function () {", info.globalName());
            out.newlineUp();
            out.write("return ");
            definition.body.lower().compileToJS(out, settings);
        }

        out.format(";");
        out.newlineDown();
        out.format("}");
        out.newline();

    }

    private static String argsString(LambdaNode node, String prefix) {
        if (node.varArgs) {
            if (node.arguments.size() == 1) {
                return "...varargs";
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

        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling index set %s", info.globalName());
        }

        assert (info.definition().isPresent());

        IndexSetDefinition definition = info.definition().get();

        String id = info.globalName();
        String name = definition.name();

        out.newline();
        out.format("Pacioli.compute_%s = function () {", id);
        out.newlineUp();

        out.format("return Pacioli._index('%s', '%s', ", id, name);

        if (definition.isDynamic()) {
            definition.body().lower().compileToJS(out, settings);
        } else {
            List<String> quotedItems = new ArrayList<String>();

            for (String item : definition.items()) {
                quotedItems.add(String.format("\"%s\"", item));
            }

            out.format("Pacioli.tagList([ %s ])", String.join(",", quotedItems));
        }

        out.format(")");

        out.newlineDown();
        out.write("}");
        out.newline();

    }

    @Override
    public void visit(ParametricInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ScalarBaseInfo info) {

        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling unit %s", info.globalName());
        }

        UnitDefinition definition = info.definition()
                .orElseThrow(() -> new RuntimeException("ScalarUnitInfo misses definition"));

        String symbol = JSGenerator.escapeString(info.symbol());

        out.format("Pacioli.compute_%s = function () {", info.globalName());
        out.newlineUp();

        if (definition.body.isPresent()) {
            UnitNode body = definition.body.get();

            DimensionedNumber<ScalarBase> number = body.evalUnit();

            out.format("return {definition: Pacioli._dimnum(%s, %s), symbol: \"%s\"}\n",
                    number.factor(),
                    MatrixBase.compileUnitToJS(number.unit()),
                    symbol);

        } else {
            out.format("return {symbol: \"%s\"}", symbol);
        }

        out.newlineDown();
        out.print("}");
        out.newline();
    }

    @Override
    public void visit(VectorBaseInfo info) {

        assert (info.definition().isPresent());

        if (Pacioli.Options.showGeneratingCode) {
            Pacioli.log("Compiling vector unit %s", info.globalName());
        }

        IndexSetInfo setInfo = (IndexSetInfo) info.definition().get().indexSetNode.info;
        List<String> unitTexts = new ArrayList<String>();

        for (UnitDecl entry : info.items()) {
            DimensionedNumber<ScalarBase> number = entry.value.evalUnit();
            // todo: take number.factor() into account!?
            unitTexts.add("['" + entry.key.name() + "', " + MatrixBase.compileUnitToJS(number.unit()) + "]");
        }

        String vectorId = info.globalName();
        String args = String.join(", ", unitTexts);

        out.format("Pacioli.compute_%s = function() { return Pacioli._uvec('%s','%s',[%s]); };\n",
                vectorId, vectorId, setInfo.globalName(), args);
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
