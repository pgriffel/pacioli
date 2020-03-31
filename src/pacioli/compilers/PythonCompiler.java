package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;

import pacioli.CompilationSettings;
import pacioli.Printer;
import pacioli.Utils;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.StatementNode;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarUnitInfo;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorUnitInfo;
import pacioli.visitors.PythonGenerator;

public class PythonCompiler implements SymbolTableVisitor {

    CompilationSettings settings;
    Printer out;
    
    public PythonCompiler(Printer printWriter, CompilationSettings settings) {
        this.out = printWriter;
        this.settings = settings;
    }
    
    @Override
    public void visit(ValueInfo info) {
        
        assert(info.getDefinition().isPresent());  // Infos without definition are filtered by the caller 
        
        //Pacioli.logln2("Compiling value %s", info.globalName());
        
        ValueDefinition definition = info.getDefinition().get();
        ExpressionNode transformed = definition.body;
        if (transformed instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformed;
            
            List<String> usedGlobals = new ArrayList<String>();
            for (SymbolInfo usedInfo:code.uses()) {
                if (usedInfo.isGlobal() && usedInfo instanceof ValueInfo) {
                    ValueInfo vinfo = (ValueInfo) usedInfo ;
                    if (!vinfo.isFunction()) {
                        //usedGlobals.add(vinfo.globalName());
                    }
                }
            }
            List<String> args = new ArrayList<String>();
            for (String arg: code.arguments) {
                args.add(arg.toLowerCase());
            }
            if (code.expression instanceof StatementNode) {
                out.newline();
                out.format("def %s (%s):", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();
                
                if (usedGlobals.size() > 0) {
                    String pre = "global";
                    for (String gl: usedGlobals) {
                        out.format("%s %s", pre, gl);
                        pre = ",";
                    }
                    out.newline();
                }
                
                code.expression.accept(new PythonGenerator(out, settings));
                out.newlineDown();
                //out.format("endfunction;");
                out.newline();
            } else {
                out.newline();
                out.format("def %s (%s):", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();
                
                if (usedGlobals.size() > 0) {
                    String pre = "global";
                    for (String gl: usedGlobals) {
                        out.format("%s %s", pre, gl);
                        pre = ",";
                    }
                    out.newline();
                }
                
                out.format("return ");
                code.expression.accept(new PythonGenerator(out, settings));
                out.format(";");
                out.newlineDown();
                //out.format("endfunction;");
                out.newline();
            }
        } else {
            out.newline();
            out.format("def %s():", info.globalName().toLowerCase());
            out.newlineUp();
            out.write("return ");
            transformed.accept(new PythonGenerator(out, settings));
            out.format("");
            out.newlineDown();
        }
    }

    @Override
    public void visit(IndexSetInfo info) {
     
        
    }

    @Override
    public void visit(TypeInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ScalarUnitInfo info) {
        
    }
    
    @Override
    public void visit(VectorUnitInfo info) {
        
        assert(info.getDefinition().isPresent());
        
    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

}
