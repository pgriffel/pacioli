package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import pacioli.ast.Node;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.RecordDefinition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.DataDefinitionNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdListNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetFunctionBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetTupleBindingNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.type.ParametricType;

public class DesugarVisitor extends IdentityTransformation {

    List<Definition> desugared = new ArrayList<>();

    @Override
    public void visit(ProgramNode node) {
        /*
         * // Create a copy of the program node
         * ProgramNode prog = new ProgramNode(null);
         * 
         * // Add the includes unaltered
         * for (IdentifierNode include : node.includes) {
         * prog.addInclude(include);
         * }
         */
        // Create single declarations for the multideclarations
        List<Definition> noMultis = new ArrayList<Definition>();
        for (Definition def : node.definitions()) {
            if (def instanceof MultiDeclaration) {
                MultiDeclaration decl = (MultiDeclaration) def;
                for (IdentifierNode id : decl.ids) {
                    noMultis.add(new Declaration(decl.location(), id, decl.node));
                }
            } else {
                noMultis.add(def);
            }
        }

        // Desugar the definitions.

        for (Definition def : noMultis) {
            Node desugaredNode = nodeAccept(def);
            assert (desugaredNode instanceof Definition);
            // prog.addDefinition((Definition) desugared);
            desugared.add((Definition) desugaredNode);
        }

        returnNode(new ProgramNode(node.location(), node.includes(), node.imports(), node.exports(), desugared));
    }

    public void visit(IdListNode node) {
        if (node.ids.size() == 1 && node.ids.get(0) instanceof IdentifierNode) {
            returnNode(node.ids.get(0));
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.location(),
                    "Didn't expect tuple destructuring here. Did you mean tuple(...)? Destructuring a tuple is only possible in a let or comprehension, or by applying a function to the tuple."));
        }
    }

    @Override
    public void visit(LetNode node) {

        // The grammar makes a new LetNode for each binding so the binding is always
        // size 1
        if (node.binding.size() > 1) {
            throw new RuntimeException("Visit error: TODO LetNode with multiple bindings.");
        }

        ExpressionNode desugaredBody = (ExpressionNode) nodeAccept(node.body);
        LetNode.BindingNode binding = node.binding.get(0);

        if (binding instanceof LetTupleBindingNode tup) {
            // The grammar already desugars this, but it is created somewhere else
            ExpressionNode fun = new LambdaNode(tup.vars, desugaredBody, tup.location());
            returnNode(new ApplicationNode(
                    new IdentifierNode("apply", tup.location()),
                    Arrays.asList(fun, (ExpressionNode) nodeAccept(tup.value)),
                    tup.location()));
        } else if (binding instanceof LetFunctionBindingNode) {
            // The grammar already desugars this
            throw new RuntimeException("TODO: desugar function let");
        } else if (binding instanceof LetBindingNode bind) {
            LetBindingNode desugaredBinding = new LetBindingNode(
                    binding.location(),
                    bind.var,
                    (ExpressionNode) nodeAccept(bind.value));
            returnNode(new LetNode(Arrays.asList(desugaredBinding), desugaredBody, node.location()));
        } else {
            throw new RuntimeException("Unexpected binding");
        }

    }

    @Override
    public void visit(RecordDefinition node) {

        if (node.type instanceof TypeApplicationNode ta) {

            String nodeIdName = node.id.name();
            Location nodeLocation = node.location();

            var memberTypes = new ArrayList<TypeNode>();
            var funParams = new ArrayList<String>();
            var funArgs = new ArrayList<ExpressionNode>();

            for (DataDefinitionNode.Binding binding : node.bindings) {
                memberTypes.add(binding.dimType);
                funParams.add(binding.id.name());
                funArgs.add(new IdentifierNode(binding.id.name(), binding.id.location().collapse()));
            }

            for (DataDefinitionNode.Binding binding : node.bindings) {

                String name = binding.id.name();
                Location loc = binding.id.location().collapse();

                // Accessor
                var acrId = new IdentifierNode(nodeIdName + "_" + name, binding.id.location());

                var accessor = new LambdaNode(funParams, new IdentifierNode(name, loc), loc);

                var body = new LambdaNode(
                        List.of("record"),
                        new ApplicationNode(new IdentifierNode("apply", loc),
                                List.of(accessor, new IdentifierNode("record", loc)), loc),
                        loc);

                var def = new ValueDefinition(loc, acrId, body);

                this.desugared.add(def);

                // Accessor declaration
                TypeIdentifierNode tupleId = new TypeIdentifierNode(loc, "Tuple");
                // TypeIdentifierNode typId = new TypeIdentifierNode(loc, ta.op.name());
                var tup = new TypeApplicationNode(node.type.location().collapse(), tupleId, List.of(ta));

                var fun = new FunctionTypeNode(loc, tup, binding.dimType);
                var schema = new SchemaNode(nodeLocation.collapse(), node.quantNodes, fun);
                var decl = new Declaration(loc, new IdentifierNode(nodeIdName + "_" + name, loc), schema);

                this.desugared.add(decl);

                // Setter definition
                var setterId = new IdentifierNode("with_" + nodeIdName + "_" + name, loc);
                // var param1 = new IdentifierNode(name, loc);
                // var param2 = new IdentifierNode("record", loc);

                var setterParams = new ArrayList<String>();
                for (String funParam : funParams) {
                    setterParams.add(funParam.equals(name) ? "_" : funParam);
                }

                var setterBody = new ApplicationNode(new IdentifierNode("tuple", nodeLocation.collapse()), funArgs,
                        nodeLocation.collapse());
                var setter = new LambdaNode(setterParams, setterBody, loc);

                var sbody = new LambdaNode(
                        List.of(name, "record"),
                        new ApplicationNode(new IdentifierNode("apply", loc),
                                List.of(setter, new IdentifierNode("record", loc)), loc),
                        loc);

                var sdef = new ValueDefinition(loc, setterId, sbody);

                this.desugared.add(sdef);

                // Setter declaration
                // TypeIdentifierNode tupleId = new TypeIdentifierNode(loc, "Tuple");
                // TypeIdentifierNode typId = new TypeIdentifierNode(loc, node.type.name());
                var stup = new TypeApplicationNode(node.type.location().collapse(), tupleId,
                        List.of(binding.dimType, ta));

                var sfun = new FunctionTypeNode(loc, stup, ta);
                var sschema = new SchemaNode(nodeLocation.collapse(), node.quantNodes, sfun);
                var sdecl = new Declaration(loc, new IdentifierNode("with_" + nodeIdName + "_" + name,
                        loc), sschema);

                this.desugared.add(sdecl);
            }

            // Constructor definition
            var ctrId = new IdentifierNode("make_" + nodeIdName, node.id.location());
            var def = new ValueDefinition(nodeLocation.collapse(), ctrId,
                    new LambdaNode(funParams,
                            new ApplicationNode(new IdentifierNode("tuple", nodeLocation.collapse()), funArgs,
                                    nodeLocation.collapse()),
                            nodeLocation.collapse()));

            this.desugared.add(def);

            // Constructor declaration
            TypeIdentifierNode tuplId = new TypeIdentifierNode(nodeLocation.collapse(), "Tuple");
            // TypeIdentifierNode typId = new TypeIdentifierNode(nodeLocation.collapse(),
            // node.type.name());
            var tp = new TypeApplicationNode(node.type.location().collapse(), tuplId, memberTypes);

            var fun = new FunctionTypeNode(nodeLocation.collapse(), tp, ta);
            var schema = new SchemaNode(nodeLocation.collapse(), node.quantNodes, fun);

            var decl = new Declaration(nodeLocation.collapse(),
                    new IdentifierNode("make_" + nodeIdName, nodeLocation.collapse()), schema);

            this.desugared.add(decl);

            // The type definitions
            // var app = new TypeApplicationNode(nodeLocation.collapse(), node.type,
            // List.of());
            TypeIdentifierNode tupleId = new TypeIdentifierNode(nodeLocation.collapse(), "Tuple");
            var tup = new TypeApplicationNode(node.type.location().collapse(), tupleId, memberTypes);
            var typeDef = new TypeDefinition(nodeLocation.collapse(), node.quantNodes, ta, tup);
            returnNode(typeDef);

        } else {
            throw new PacioliException(node.location(), "Expected type application");
        }

    }

}
