package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;

import pacioli.CompilationSettings;
import pacioli.Pacioli;
import pacioli.Printer;
import pacioli.Utils;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.StatementNode;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.ClassInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.ScalarBaseInfo;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeVarInfo;
import pacioli.symboltable.ParametricInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorBaseInfo;
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

        // Infos without definition are filtered by the caller
        assert (info.getDefinition().isPresent());

        Pacioli.logIf(Pacioli.Options.logGeneratingCode, "Compiling value %s", info.globalName());

        ValueDefinition definition = info.getDefinition().get();
        ExpressionNode transformed = definition.body;
        if (transformed instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformed;

            List<String> usedGlobals = new ArrayList<String>();
            for (SymbolInfo usedInfo : code.uses()) {
                if (usedInfo.isGlobal() && usedInfo instanceof ValueInfo) {
                    ValueInfo vinfo = (ValueInfo) usedInfo;
                    if (!vinfo.isFunction()) {
                        usedGlobals.add(vinfo.globalName());
                    }
                }
            }
            List<String> args = new ArrayList<String>();
            for (String arg : code.arguments) {
                args.add(arg.toLowerCase());
            }
            if (code.expression instanceof StatementNode) {
                out.newline();
                out.format("function result = %s (%s)", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();

                for (String gl : usedGlobals) {
                    out.format("global %s;", gl);
                    out.newline();
                }

                code.expression.accept(new MatlabGenerator(out, settings));
                out.newlineDown();
                out.format("endfunction;");
                out.newline();
            } else {
                out.newline();
                out.format("function retval = %s (%s)", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();

                for (String gl : usedGlobals) {
                    out.format("global %s;", gl);
                    out.newline();
                }

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
    public void visit(TypeVarInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ParametricInfo info) {
        throw new RuntimeException("Cannot compile a type definition.");
    }

    @Override
    public void visit(ScalarBaseInfo info) {

    }

    @Override
    public void visit(VectorBaseInfo info) {

        assert (info.getDefinition().isPresent());

    }

    @Override
    public void visit(AliasInfo info) {
        throw new RuntimeException("Cannot compile an alias. It must have been substituted by now.");
    }

    public static void writePrelude(Printer out) {

        out.write("% Octave code generated by Pacioli compiler");
        out.newline();
        out.newline();
        out.write("1; % dummy statement to tell Octave this is not a function file");
        out.write(primitives);
        out.newline();
        out.newline();
        /*
         * out.write("function retval = fetch_global (module, name)");
         * out.newline();
         * out.write("  switch (strcat(\"glbl_\", module, \"_\", name))");
         * out.newline();
         * out.write("    case \"glbl_base__\"");
         * out.newline();
         * out.write("      retval = {0,1};");
         * out.newline();
         * for (ValueInfo info: values.allInfos()) {
         * if (info.getDefinition().isPresent()) {
         * ValueDefinition definition = info.getDefinition().get();
         * String fullName = info.globalName();
         * if (definition.body instanceof LambdaNode) {
         * out.format("    case \"%s\"\n", fullName);
         * out.format("      retval = @%s;\n", fullName);
         * 
         * } else {
         * out.format("    case \"%s\"\n", fullName);
         * out.format("      global %s;\n", fullName);
         * out.format("      retval = %s;\n", fullName);
         * }
         * }
         * }
         * out.write("    otherwise");
         * out.newline();
         * out.
         * write("    error(strcat(\"global '\", name, \"' from module '\", module, \"' unknown\"));"
         * );
         * out.newline();
         * out.write("  endswitch;");
         * out.newline();
         * out.write("endfunction;");
         */
        out.newline();
    }

    static final String primitives = "\n" +
            "\n" +
            "global glbl_base__ = {0,1};\n" +
            "\n" +
            "function result = glbl_base_add_mut(list, item)\n" +
            "  result = glbl_base_append(list, glbl_base_singleton_list(item));\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function list = glbl_base_append(x,y)\n" +
            " list = {x{:} y{:}};\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_apply(fun,args)\n" +
            " result = fun(args{:});\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function domain = glbl_base_column_domain(x)\n" +
            "  n = size(x)(2);\n" +
            "  domain = cell(1, n);\n" +
            "  for i = 1:n\n" +
            "    key = {i-1,n};\n" +
            "    domain{1,i} = key;\n" +
            "  endfor;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function units = glbl_base_column_unit(x)\n" +
            "  n = size(x)(2);\n" +
            "  units = cell(1, n);\n" +
            "  for i = 1:n\n" +
            "      units{1,i} = 1;\n" +
            "  endfor\n" +
            "  units = ones(1,n);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_cons(item, list)\n" +
            "  result = glbl_base_append(glbl_base_singleton_list(item), list);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_cos(angle)\n" +
            "  result = cos(angle);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_divide(x,y)\n" +
            "  num = glbl_base_multiply(x, glbl_base_reciprocal(y));\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function list = glbl_base_empty_list()\n" +
            "  %list = {};\n" +
            "list = {1}(1,2:end);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_equal(x,y)\n" +
            "%  result = logical(x == y);\n" +
            "  result = isequal(x, y);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_exp(x)\n" +
            "  num = exp(x);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_expt(x,y)\n" +
            "  num = arrayfun(@(z) one_expt(z, y), x);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "function num = one_expt(x, y)\n" +
            "  num = x^y;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_mexpt(x,y)\n" +
            "  num = x^y;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_fold_list(fun, items)\n" +
            "  if (numel(items) == 0)\n" +
            "      error(\"fold list called on empty list\");\n" +
            "  endif\n" +
            "  result = items{1, 1};\n" +
            "  for i=2:numel(items)\n" +
            "    result = fun(result, items{1, i});\n" +
            "  end\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_get(x, i, j)\n" +
            "  num = x(i{1} + 1, j{1} + 1);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function item = glbl_base_head(l)\n" +
            "  item = l{1,1};\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_left_identity(mat)\n" +
            "\n" +
            "  result = eye(size(mat)(1));\n" +
            "\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_less(x,y)\n" +
            "  result = x < y;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function length = glbl_base_list_size(list)\n" +
            "  length = numel(list);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_ln(x)\n" +
            "  result = log(x);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_loop_list(init, fun, items)\n" +
            "  result = init;\n" +
            "  for i=1:numel(items)\n" +
            "    result = fun(result, items{i});\n" +
            "  end\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_magnitude(x)\n" +
            "  num = x;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_make_matrix(items)\n" +
            "  if (numel(items) == 0)\n" +
            "    error(\"matrix_from_tuples called on empty list\");\n" +
            "  endif\n" +
            " rowkey = items{1, 1}{1, 1};\n" +
            " columnkey = items{1, 1}{1, 2};\n" +
            " result = zeros(rowkey{1, 2}, columnkey{1, 2});\n" +
            " for i=1:numel(items)\n" +
            "   result(items{1, i}{1, 1}{1, 1} + 1, items{1, i}{1, 2}{1, 1} + 1) = items{1, i}{1, 3};\n" +
            " end\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_minus(x,y)\n" +
            "  num = glbl_base_sum(x, glbl_base_negative(y));\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_mod(a, m)\n" +
            "  result = mod(a, m);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_multiply(x,y)\n" +
            "  num = x.*y;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function list = glbl_base_naturals(n)\n" +
            " list = num2cell(0:n-1);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_negative(x)\n" +
            "  num = -x;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_not(x)\n" +
            "  num = not(x);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_not_equal(x,y)\n" +
            "  result = not(glbl_base_equal(x, y));\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function item = glbl_base_nth(n, l)\n" +
            "  item = l{1,n+1};\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_print(value)\n" +
            "  value\n" +
            "  result = value;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_dim_inv(x)\n" +
            "  num = glbl_base_transpose(glbl_base_reciprocal(x));\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_dim_div(x, y)\n" +
            "  num = glbl_base_mmult(x, glbl_base_dim_inv(y));\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "function res = glbl_base_svd(x)\n" +
            "  n = size(x)(1);\n" +
            "  [U,S,V] = svd(x); \n" +
            "  tup = glbl_base_empty_list;\n" +
            "  for i=1:n\n" +
            "    %tup = glbl_base_append(tup, glbl_base_singleton_list(glbl_base_tuple(S(i,i), U(:, i), V(i, :)')));\n"
            +
            "    tup = glbl_base_append(tup, glbl_base_singleton_list(glbl_base_tuple(S(i,i), U(:, i), V(:, i))));\n" +
            "  endfor\n" +
            "  res = tup;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_reciprocal(x)\n" +
            "  num = arrayfun(@(x) one_reciprocal(x), x);\n" +
            "endfunction\n" +
            "\n" +
            "function num = one_reciprocal(x) \n" +
            "  if x == 0\n" +
            "    num = 0;\n" +
            "  else\n" +
            "    num = 1/x;\n" +
            "  endif\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "function domain = glbl_base_row_domain(x)\n" +
            "  n = size(x)(1);\n" +
            "  domain = cell(1, n);\n" +
            "  for i = 1:n\n" +
            "    key = {i-1,n};\n" +
            "    domain{1,i} = key;\n" +
            "  endfor;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function units = glbl_base_row_unit(x)\n" +
            "  n = size(x)(1);\n" +
            "  units = cell(1, n);\n" +
            "  for i=1:n\n" +
            "    units{1,i} = 1;\n" +
            "  endfor\n" +
            "  units = ones(n,1);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_scale(x,y)\n" +
            "  num = x*y;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_scale_down(x,y)\n" +
            "  num = x/y;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_sin(angle)\n" +
            "  result = sin(angle);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function list = glbl_base_singleton_list(x)\n" +
            "  list = {x};\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_solve(lhs, rhs)\n" +
            "  num = lhs \\ rhs;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_sqrt(x)\n" +
            "  num = sqrt(x);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_sum(x,y)\n" +
            "  num = x+y;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n" +
            "function lst = glbl_base_reverse(x)\n" +
            "  lst = flip(x);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n" +
            "function item = glbl_base_tail(l)\n" +
            "  item = l(1,2:end);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_transpose(x)\n" +
            "  num = x';\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_tuple(varargin)\n" +
            "  result = varargin;\n" +
            "end\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_unit_factor(x)\n" +
            "  num = 1;\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = glbl_base_zip(x,y)\n" +
            " result = cellfun(@(a,b) {a b}, x, y, \"UniformOutput\", false);\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "\n" +
            "function result = _if(x,y,z)\n" +
            "  if x \n" +
            "    result = y();\n" +
            "  else\n" +
            "    result = z();\n" +
            "  endif\n" +
            "endfunction\n" +
            "\n" +
            "\n" +
            "function num = glbl_base_skip()\n" +
            "  num = 0" +
            "endfunction\n" +
            "\n" +
            "\n" +

            "";

    @Override
    public void visit(ClassInfo classInfo) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

    // -------------------------------------------------------------------------
    // Matlab primitives
    // -------------------------------------------------------------------------

    /*
     * for (final File file: new
     * File("E:/code/private/pacioli-samples/shells/new-matlab-primitives/").
     * listFiles()) {
     * out.newline();
     * out.newline();
     * try {
     * String matlabPrimitive = FileUtils.readFileToString(file,
     * Charset.defaultCharset());
     * out.print(matlabPrimitive);
     * } catch (IOException e) {
     * e.printStackTrace();
     * 
     * }
     * }
     */

}
