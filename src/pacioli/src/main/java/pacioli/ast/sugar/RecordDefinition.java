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

package pacioli.ast.sugar;

import java.util.ArrayList;
import java.util.List;
import pacioli.ast.Visitor;
import pacioli.ast.definition.AbstractDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Documentation;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.QuantNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;

/**
 * Poor man's records
 * 
 * Syntactic sugar for faking records with tuples.
 * 
 * A record with field1, ..., fieldN of type Type1, ..., TypeN is implemented
 * as a Tuple(Type1, ..., TypeN).
 * 
 * The record definition is desugared into
 * 
 * - a constructor of type (Type1, ..., TypeN) -> Record
 * 
 * - N getters of type (Record) -> TypeX
 * 
 * - N setters of type (TypeX, Record) -> Record
 */
public class RecordDefinition extends AbstractDefinition {

    public static class FieldDefinition {

        public final IdentifierNode id;
        public final TypeNode type;

        public FieldDefinition(IdentifierNode id, TypeNode type, Location location) {
            this.id = id;
            this.type = type;
        }
    }

    /**
     * The type quantifier part of the record definition.
     */
    public final List<QuantNode> quantNodes;

    /**
     * The type part of a record definition.
     * 
     * This must be a type application. This is not enforced in the grammar to give
     * better error messages.
     */
    public final TypeNode type;

    /*
     * The identifier part of the record definition.
     * 
     * This is the base name of the generated record functions.
     */
    public final IdentifierNode id;

    /**
     * The field definitions from the record definition.
     */
    public final List<FieldDefinition> fields;

    public RecordDefinition(
            Location location,
            List<QuantNode> quantNodes,
            TypeNode type,
            IdentifierNode id,
            List<FieldDefinition> fields) {
        super(location);
        this.quantNodes = quantNodes;
        this.type = type;
        this.id = id;
        this.fields = fields;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String name() {
        return "record";
    }

    public TypeDefinition typeDefinition() {

        Location invisible = this.type.location().collapse();

        var type = new TypeApplicationNode(
                invisible,
                new TypeIdentifierNode(invisible, "Tuple"),
                this.memberTypes());

        return new TypeDefinition(invisible, this.quantNodes, this.typeApplicationNode(), type);
    }

    public Documentation constructorDocumentation() {

        Location invisible = this.id.location().collapse();

        return new Documentation(
                invisible,
                new IdentifierNode("make_" + this.baseName(), invisible),
                new StringNode(
                        String.format("Constructor for record <code>%s</code>", this.type.pretty()),
                        invisible));
    }

    public Declaration constructorDeclaration() {

        Location location = this.id.location();
        Location invisible = location.collapse();

        var constructorId = new IdentifierNode("make_" + this.baseName(), location);

        var schema = new SchemaNode(
                invisible,
                this.quantNodes,
                new FunctionTypeNode(
                        invisible,
                        new TypeApplicationNode(
                                invisible,
                                new TypeIdentifierNode(invisible, "Tuple"),
                                this.memberTypes()),
                        this.typeApplicationNode()));

        return new Declaration(invisible, constructorId, schema);

    }

    public ValueDefinition constructorDefinition() {

        Location location = this.id.location();
        Location invisible = location.collapse();

        var constructorId = new IdentifierNode("make_" + this.baseName(), location);

        // (field1, ..., fieldN) -> tuple(field1, ..., fieldN)
        var constructorBody = new LambdaNode(
                this.funParams(),
                new ApplicationNode(
                        new IdentifierNode("tuple", invisible),
                        this.funArgs(),
                        invisible),
                invisible);

        return new ValueDefinition(invisible, constructorId, constructorBody);
    }

    public Documentation getterDocumentation(FieldDefinition binding) {

        String fieldName = binding.id.name();

        Location invisible = binding.id.location().collapse();

        return new Documentation(
                invisible,
                new IdentifierNode(this.baseName() + "_" + fieldName, invisible),
                new StringNode(String.format("Getter for record <code>%s</code>", this.type.pretty()),
                        invisible));
    }

    public Declaration getterDeclaration(FieldDefinition binding) {

        Location invisible = binding.id.location().collapse();

        var getterId = new IdentifierNode(this.baseName() + "_" + binding.id.name(), invisible);

        var schema = new SchemaNode(
                invisible,
                this.quantNodes,
                new FunctionTypeNode(
                        invisible,
                        new TypeApplicationNode(
                                invisible,
                                new TypeIdentifierNode(invisible, "Tuple"),
                                List.of(this.typeApplicationNode())),
                        binding.type));

        return new Declaration(invisible, getterId, schema);
    }

    public ValueDefinition getterDefinition(FieldDefinition binding) {

        String fieldName = binding.id.name();

        Location location = binding.id.location();
        Location invisible = location.collapse();

        var getterId = new IdentifierNode(this.baseName() + "_" + fieldName, location);

        // (record) -> apply((field1, field2, ...) -> fieldX, record)
        var getterBody = new LambdaNode(
                List.of("record"),
                new ApplicationNode(
                        new IdentifierNode("apply", invisible),
                        List.of(
                                new LambdaNode(this.funParams(), new IdentifierNode(fieldName, invisible), invisible),
                                new IdentifierNode("record", invisible)),
                        invisible),
                invisible);

        return new ValueDefinition(invisible, getterId, getterBody);
    }

    public Documentation setterDocumentation(FieldDefinition binding) {

        Location invisible = binding.id.location().collapse();

        return new Documentation(
                invisible,
                new IdentifierNode("with_" + this.baseName() + "_" + binding.id.name(), invisible),
                new StringNode(
                        String.format("Setter for record <code>%s</code>", this.type.pretty()),
                        invisible));
    }

    public Declaration setterDeclaration(FieldDefinition binding) {

        Location invisible = binding.id.location().collapse();

        var setterId = new IdentifierNode("with_" + this.baseName() + "_" + binding.id.name(), invisible);

        TypeApplicationNode recordType = this.typeApplicationNode();

        var schema = new SchemaNode(
                invisible,
                this.quantNodes,
                new FunctionTypeNode(
                        invisible,
                        new TypeApplicationNode(
                                invisible,
                                new TypeIdentifierNode(invisible, "Tuple"),
                                List.of(binding.type, recordType)),
                        recordType));

        return new Declaration(invisible, setterId, schema);
    }

    public ValueDefinition setterDefinition(FieldDefinition binding) {

        String fieldName = binding.id.name();

        Location location = binding.id.location();
        Location invisible = location.collapse();

        var setterId = new IdentifierNode("with_" + this.baseName() + "_" + fieldName, location);

        var setterParams = new ArrayList<String>();
        for (String funParam : this.funParams()) {
            setterParams.add(funParam.equals(fieldName) ? "_" : funParam);
        }

        // (fieldX, record) ->
        // apply((field1, ..., _, ..., fieldN) -> tuple(field1, ..., fieldN), record)
        var setterBody = new LambdaNode(
                List.of(fieldName, "record"),
                new ApplicationNode(
                        new IdentifierNode("apply", invisible),
                        List.of(
                                new LambdaNode(
                                        setterParams,
                                        new ApplicationNode(
                                                new IdentifierNode("tuple", invisible),
                                                this.funArgs(),
                                                invisible),
                                        invisible),
                                new IdentifierNode("record", invisible)),
                        invisible),
                invisible);

        return new ValueDefinition(invisible, setterId, setterBody);
    }

    private String baseName() {
        return this.id.name();
    }

    private TypeApplicationNode typeApplicationNode() {
        if (this.type instanceof TypeApplicationNode ta) {
            return ta;
        } else {
            throw new PacioliException(this.type.location(), "Expected a type application");
        }
    }

    private List<TypeNode> memberTypes() {
        List<TypeNode> memberTypes = new ArrayList<>();
        for (FieldDefinition binding : this.fields) {
            memberTypes.add(binding.type);
        }
        return memberTypes;
    }

    private List<String> funParams() {
        List<String> funParams = new ArrayList<>();
        for (FieldDefinition binding : this.fields) {
            funParams.add(binding.id.name());
        }
        return funParams;
    }

    private List<ExpressionNode> funArgs() {
        List<ExpressionNode> funArgs = new ArrayList<>();
        for (FieldDefinition binding : this.fields) {
            funArgs.add(new IdentifierNode(binding.id.name(), binding.id.location().collapse()));
        }
        return funArgs;
    }
}