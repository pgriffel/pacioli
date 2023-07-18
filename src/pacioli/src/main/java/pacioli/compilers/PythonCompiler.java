package pacioli.compilers;

import java.util.ArrayList;
import java.util.List;

import pacioli.Pacioli;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.StatementNode;
import pacioli.misc.CompilationSettings;
import pacioli.misc.Printer;
import pacioli.misc.Utils;
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
                        // usedGlobals.add(vinfo.globalName());
                    }
                }
            }
            List<String> args = new ArrayList<String>();
            for (String arg : code.arguments) {
                args.add(arg.toLowerCase());
            }
            if (code.expression instanceof StatementNode) {
                out.newline();
                out.format("def %s (%s):", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();

                if (usedGlobals.size() > 0) {
                    String pre = "global";
                    for (String gl : usedGlobals) {
                        out.format("%s %s", pre, gl);
                        pre = ",";
                    }
                    out.newline();
                }

                code.expression.accept(new PythonGenerator(out, settings));
                out.newlineDown();
                // out.format("endfunction;");
                out.newline();
            } else {
                out.newline();
                out.format("def %s (%s):", info.globalName().toLowerCase(), Utils.intercalate(",", args));
                out.newlineUp();

                if (usedGlobals.size() > 0) {
                    String pre = "global";
                    for (String gl : usedGlobals) {
                        out.format("%s %s", pre, gl);
                        pre = ",";
                    }
                    out.newline();
                }

                out.format("return ");
                code.expression.accept(new PythonGenerator(out, settings));
                out.format(";");
                out.newlineDown();
                // out.format("endfunction;");
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
    public void visit(TypeVarInfo typeVarInfo) {
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
        out.write("# Python code generated by Pacioli compiler");
        out.newline();
        out.newline();
        out.write(PythonCompiler.primitives);
        out.newline();
        out.newline();
        out.newline();
    }

    private static final String primitives = "import numpy as np\n" +
            "import sys\n" +
            "\n" +
            "\n" +
            "glbls_dict = {}\n" +
            "\n" +
            "\n" +
            "def fetch_global(name):\n" +
            "    if name not in glbls_dict:\n" +
            "        glbls_dict[name] = globals()[name]()\n" +
            "    return glbls_dict[name]\n" +
            "\n" +
            "\n" +
            "def glbl_base__():\n" +
            "    return (0,1)\n" +
            "\n" +
            "\n" +
            "def glbl_base_add_mut(list, item):\n" +
            "    return glbl_base_append(list, glbl_base_singleton_list(item));\n" +
            // " list.append(item)\n" +
            // " return list\n" +
            "\n" +
            "\n" +
            "def glbl_base_append(x,y):\n" +
            "    tmp = x[:]\n" +
            "    tmp.extend(y)\n" +
            "    return tmp\n" +
            "\n" +
            "\n" +
            "def glbl_base_apply(fun,args):\n" +
            "    return fun(*args)\n" +
            "\n" +
            "\n" +
            "def glbl_base_column_domain(x):\n" +
            "    n = x.shape[1]\n" +
            "    return [(i,n) for i in np.arange(n)]\n" +
            "\n" +
            "\n" +
            "def glbl_base_column_unit(x):\n" +
            "    return np.ones([x.shape[1], 1])\n" +
            "\n" +
            "\n" +
            "def glbl_base_cons(item, list):\n" +
            "    return glbl_base_append(glbl_base_singleton_list(item), list);\n" +
            "\n" +
            "\n" +
            "def glbl_base_cos(angle):\n" +
            "    return cos(angle);\n" +
            "\n" +
            "\n" +
            "def glbl_base_divide(x,y):\n" +
            "    return glbl_base_multiply(x, glbl_base_reciprocal(y))\n" +
            "\n" +
            "\n" +
            "def glbl_base_left_divide(x,y):\n" +
            "    return glbl_base_multiply(glbl_base_reciprocal(x), y)\n" +
            "\n" +
            "\n" +
            "def glbl_base_empty_list():\n" +
            "    return []\n" +
            "\n" +
            "\n" +
            "def glbl_base_equal(x,y):\n" +
            "    if isinstance(x, np.ndarray):\n" +
            "        return isinstance(y, np.ndarray) and np.all(x == y)\n" +
            "    if isinstance(x, tuple):\n" +
            "        return isinstance(y, tuple) and len(x) == len(y) and all(glbl_base_equal(a, b) for a, b in zip(x, y))\n"
            +
            "    if isinstance(x, list):\n" +
            "        return isinstance(y, list) and len(x) == len(y) and all(glbl_base_equal(a, b) for a, b in zip(x, y))\n"
            +
            "    return x == y\n" +
            "\n" +
            "\n" +
            "def glbl_base_exp(x):\n" +
            "    return np.exp(x)\n" +
            "\n" +
            "\n" +
            "def glbl_base_expt(x,y):\n" +
            "    return x**y\n" +
            "\n" +
            "\n" +
            "def glbl_base_mexpt(x,y):\n" +
            "    return np.linalg.matrix_power(x, y[0,0])\n" +
            "\n" +
            "\n" +
            "def glbl_base_tuple(*args):\n" +
            "    return args;\n" +
            "\n" +
            "\n" +
            "def glbl_base_sum(x,y):\n" +
            "    return x+y;\n" +
            "\n" +
            "\n" +
            "def glbl_base_mmult(x,y):\n" +
            "    return x@y;\n" +
            "\n" +
            "\n" +
            "def glbl_base_dim_inv(x):\n" +
            "    return glbl_base_transpose(glbl_base_reciprocal(x))\n" +
            "\n" +
            "\n" +
            "def glbl_base_transpose(x):\n" +
            "    return np.transpose(x)\n" +
            "\n" +
            "\n" +
            "def glbl_base_reciprocal(x):\n" +
            "    return np.vectorize(lambda val: 0 if val == 0 else 1/val)(x)\n" +
            "\n" +
            "\n" +
            "def glbl_base_scale(x,y):\n" +
            "    return y*x\n" +
            "\n" +
            "\n" +
            "def glbl_base_rscale(x,y):\n" +
            "    return x*y\n" +
            "\n" +
            "\n" +
            "def glbl_base_make_matrix(items):\n" +
            "    if (len(items) == 0):\n" +
            "        error(\"matrix_from_tuples called on empty list\");\n" +
            "    rowkey = items[0][0]\n" +
            "    columnkey = items[0][1]\n" +
            "    result = np.zeros([rowkey[1], columnkey[1]]);\n" +
            "    for (i, j, v)  in items:\n" +
            "        result[i[0], j[0]] = v\n" +
            "    return result\n" +
            "\n" +
            "\n" +
            "def glbl_base_singleton_list(x):\n" +
            "    return [x]\n" +
            "\n" +
            "\n" +
            "def glbl_base_minus(x,y):\n" +
            "    return x-y\n" +
            "\n" +
            "\n" +
            "def glbl_base_multiply(x,y):\n" +
            "    return x*y\n" +
            "\n" +
            "\n" +
            "def glbl_base_get(x, i, j):\n" +
            "    return x[i[0], j[0]];\n" +
            "\n" +
            "\n" +
            "def glbl_base_sqrt(x):\n" +
            "    return np.sqrt(x)\n" +
            "\n" +
            "\n" +
            "def glbl_base_magnitude(x):\n" +
            "    return x\n" +
            "\n" +
            "\n" +
            "def glbl_base_unit_factor(x):\n" +
            "    return np.array([[1]]);\n" +
            "\n" +
            "\n" +
            "def glbl_base_dim_div(x, y):\n" +
            "    return glbl_base_mmult(x, glbl_base_dim_inv(y))\n" +
            "\n" +
            "\n" +
            "def glbl_base_row_unit(x):\n" +
            "    return np.ones([x.shape[0], 1])\n" +
            "\n" +
            "\n" +
            "def glbl_base_scale_down(x,y):\n" +
            "    return x/y\n" +
            "\n" +
            "\n" +
            "def glbl_base_total(x):\n" +
            "    return x.sum()\n" +
            "\n" +
            "\n" +
            "def glbl_base_mod(a, m):\n" +
            "    return np.mod(a, m)\n" +
            "\n" +
            "\n" +
            "def glbl_base_negative(x):\n" +
            "    return -x\n" +
            "\n" +
            "\n" +
            "def glbl_base_row_domain(x):\n" +
            "    n = x.shape[0]\n" +
            "    return [(i,n) for i in np.arange(n)]\n" +
            "\n" +
            "\n" +
            "def glbl_base_loop_list(init, fun, items):\n" +
            "    result = init\n" +
            "    for item in items:\n" +
            "        result = fun(result, item)\n" +
            "    return result\n" +
            "\n" +
            "\n" +
            "def glbl_base_map_list(fun, items):\n" +
            "    return [fun(x) for x in items]\n" +
            "\n" +
            "\n" +
            "def glbl_base_zip(x,y):\n" +
            "    return list(zip(x, y))\n" +
            "\n" +
            "\n" +
            "def glbl_base_tail(l):\n" +
            "    return l[1:];\n" +
            "\n" +
            "\n" +
            "def glbl_base_head(l):\n" +
            "    return l[0];\n" +
            "\n" +
            "\n" +
            "def glbl_base_left_identity(mat):\n" +
            "    return np.eye(mat.shape[0])\n" +
            "\n" +
            "\n" +
            "def glbl_base_naturals(n):\n" +
            "    return [np.array([[x]]) for x in np.arange(n)]\n" +
            "\n" +
            "\n" +
            "def glbl_base_list_size(list):\n" +
            "    return np.array([[len(list)]])\n" +
            "\n" +
            "\n" +
            "def glbl_base_fold_list(fun, items):\n" +
            "    if (len(items) == 0):\n" +
            "        error(\"fold list called on empty list\");\n" +
            "    result = items[0]\n" +
            "    for item in items[1:]:\n" +
            "        result = fun(result, item)\n" +
            "    return result\n" +
            "\n" +
            "\n" +
            "def glbl_base_solve(lhs, rhs):\n" +
            "    return np.linalg.lstsq(lhs, rhs)[0].reshape([lhs.shape[1], rhs.shape[1]])\n" +
            "\n" +
            "\n" +
            "def glbl_base_greater(x,y):\n" +
            "    return np.all(x > y)\n" +
            "\n" +
            "\n" +
            "def glbl_base_less(x,y):\n" +
            "    return np.all(x < y)\n" +
            "\n" +
            "\n" +
            "def glbl_base_less_eq(x,y):\n" +
            "    return np.all(x <= y)\n" +
            "\n" +
            "\n" +
            "def glbl_base_get_num(x, i, j):\n" +
            "    return np.array([[x[i[0], j[0]]]])\n" +
            "\n" +
            "\n" +
            "def glbl_base_ln(x):\n" +
            "    return np.log(x);\n" +
            "\n" +
            "\n" +
            "def glbl_base_log(x, b):\n" +
            "    return np.log(x) / np.log(b[0,0]);\n" +
            "\n" +
            "\n" +
            "def glbl_base_abs(x):\n" +
            "    return np.abs(x)\n" +
            "\n" +
            "\n" +
            "def glbl_base_identity(x):\n" +
            "    return x\n" +
            "\n" +
            "\n" +
            "def glbl_base_not_equal(x,y):\n" +
            "    return not(glbl_base_equal(x, y))\n" +
            "\n" +
            "\n" +
            "def glbl_base_skip():\n" +
            "    return" +
            "\n" +
            "\n" +
            "def glbl_base_print(value):\n" +
            "    if isinstance(value, np.ndarray):\n" +
            "        vec = value.reshape([value.size, 1])\n" +
            "        print(\"Index, Value\")\n" +
            "        for i in range(0, value.size):\n" +
            "            val = vec[i, 0]\n" +
            "            if val != 0:\n" +
            "                print(f\"{i} -> {val}\")\n" +
            "    else:\n" +
            "        print(value)\n" +
            "\n" +
            "\n" +
            "def glbl_base_write(value):\n" +
            "    sys.stdout.write(str(value))\n" +
            "\n" +
            "\n" +
            "def glbl_base_num2string(value, decs):\n" +
            "    return \"{}\".format(value[0, 0])\n" +
            "\n" +
            "\n" +
            "def glbl_base_random():\n" +
            "    return [[np.random.random()]]\n" +
            "\n" +
            "\n" +
            "def glbl_base_sin(angle):\n" +
            "    return np.sin(angle);\n" +
            "\n" +
            "\n" +
            "def glbl_base_cos(angle):\n" +
            "    return np.cos(angle);\n" +
            "\n" +
            "\n" +
            "def glbl_base_nth(n, l):\n" +
            "    return l[n[0, 0]]\n" +
            "\n" +
            "\n" +
            "def glbl_base_not(x):\n" +
            "    return not(x)\n" +
            "\n" +
            "\n" +
            "def glbl_base_svd(x):\n" +
            "    (U,S,V) = np.linalg.svd(x)\n" +
            "    n = S.shape[0]\n" +
            "    tup = glbl_base_empty_list();\n" +
            "    for i in range(0, n):\n" +
            "        tup = glbl_base_append(tup, glbl_base_singleton_list(glbl_base_tuple(S[i], U[:, i].reshape([n, 1]), V[i, :].reshape([n, 1]))))\n"
            +
            "    return tup\n" +
            "\n" +
            "\n" +
            "def glbl_base_reverse(x):\n" +
            "    return x[::-1]\n" +
            "\n" +

            "\n" +
            "def glbl_numpy_test_nmode(tensor, n, matrix, shape):\n" +
            "    nSize = shape[n[0,0]]\n" +
            // " matrixRowSize = round(matrix.size / nSize)\n" +
            // " print(\"NMODE\")\n" +
            // " print(matrix.shape)\n" +
            // " print(tensor.shape)\n" +
            // " print(shape)\n" +
            // " print(nSize)\n" +
            // " print(matrixRowSize)\n" +
            "    swapped = np.swapaxes(tensor.reshape(shape), n, len(shape) - 1)\n" +
            "    transformed = matrix.reshape([round(matrix.size / nSize), nSize]) @ swapped.reshape(swapped.shape + (1,)) \n"
            +
            "    return transformed.reshape([transformed.size, 1])\n" +
            "\n" +

            // lib numpy/iris

            "\n" +
            "from sklearn.datasets import load_iris\n" +
            "from sklearn.model_selection import train_test_split;\n" +
            "from sklearn.neighbors import KNeighborsClassifier\n" +
            "\n" +
            "def glbl_numpy_iris_numpy_iris_array():\n" +
            "    iris = load_iris()\n" +
            "    data = iris.data\n" +
            "    target = iris.target\n" +
            "    (nr_samples, nr_features) = data.shape\n" +
            "    nr_targets = len(iris.target_names)\n" +
            "    target_vector = np.zeros([nr_samples, nr_targets])\n" +
            "    for i in range(0, nr_samples):\n" +
            "        target_vector[i, target[i]] = 1\n" +
            "    return (data.reshape([nr_samples * nr_features, 1]), "
            + "          target_vector.reshape([nr_samples * nr_targets, 1]))\n" +
            "\n" +
            "\n" +
            "def glbl_numpy_iris_numpy_iris_list():\n" +
            "    iris = load_iris()\n" +
            "    data = iris.data\n" +
            "    target = iris.target\n" +
            "    (nr_samples, nr_features) = data.shape\n" +
            "    nr_targets = len(iris.target_names)\n" +
            "    result = []\n" +
            "    for i in range(0, nr_samples):\n" +
            "        tups = []\n" +
            "        for j in range(0, nr_features):\n" +
            "            tups.append(((j, nr_features), (0,1), data[i, j]))\n" +
            "        result.append((glbl_base_make_matrix(tups), (target[i], nr_targets)))\n" +
            "    return result\n" +
            "\n" +
            "\n" +
            "def glbl_numpy_iris_knn_fit(data, target):\n" +
            "    nr_samples = 150\n" +
            "    nr_features = 4\n" +
            "    nr_targets = 3\n" +
            "    data_array = data.reshape([nr_samples, nr_features])\n" +
            "    target_array = target.reshape([nr_samples, nr_targets])\n" +
            "    target_vector = np.empty([nr_samples])\n" +
            "    for i in range(0, nr_samples):\n" +
            "        for j in range(0, nr_targets):\n" +
            "            if target_array[i,j] != 0:\n" +
            "                target_vector[i] = j\n" +
            "    classifier = KNeighborsClassifier()\n" +
            "    classifier.fit(data_array, target_vector)\n" +
            "    return classifier\n" +
            "\n" +
            "\n" +
            "def glbl_numpy_iris_knn_predict(classifier, data):\n" +
            "    return classifier.predict(np.reshape(data, [1, data.shape[0]]))\n" +
            "\n";

    @Override
    public void visit(ClassInfo classInfo) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

}
