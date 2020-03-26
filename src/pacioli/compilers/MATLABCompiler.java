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
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorUnitInfo;
import pacioli.visitors.MatlabGenerator;

public class MATLABCompiler implements SymbolTableVisitor {

    CompilationSettings settings;
    Printer out;
    
    public MATLABCompiler(Printer printWriter, CompilationSettings settings) {
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
            List<String> args = new ArrayList<String>();
            for (String arg: code.arguments) {
                args.add(arg.toLowerCase());
            }
            if (code.expression instanceof StatementNode) {
                out.newline();
                out.format("function result = %s (%s)", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();
                code.expression.accept(new MatlabGenerator(out, settings));
                out.newlineDown();
                out.format("endfunction;");
                out.newline();
            } else {
                out.newline();
                out.format("function retval = %s (%s)", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();
                out.format(" retval = ");
                code.expression.accept(new MatlabGenerator(out, settings));
                out.format(";");
                out.newlineDown();
                out.format("endfunction;");
                out.newline();
            }
        } else {
            out.newline();
            out.format("global %s = ", info.globalName().toLowerCase());
            transformed.accept(new MatlabGenerator(out, settings));
            out.format(";");
            out.newline();
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
