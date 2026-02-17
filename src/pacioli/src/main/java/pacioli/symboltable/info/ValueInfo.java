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

package pacioli.symboltable.info;

import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.LambdaNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.types.ast.TypeNode;
import pacioli.types.type.FunctionType;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;

public class ValueInfo extends AbstractInfo {

    private final boolean isMonomorphic;
    private final boolean isRef;
    private final ValueDefinition definition;
    private final Declaration declaredType;
    private final ClassInfo typeClass;
    private final List<String> primitiveArgs;

    // Set during type inference
    private TypeObject inferredType;

    public ValueInfo(
            GeneralInfo info,
            boolean isMonomorphic,
            boolean isRef,
            ValueDefinition definition,
            ClassInfo typeClass,
            Declaration declaredType,
            List<String> primitiveArgs) {
        super(info);
        this.isMonomorphic = isMonomorphic;
        this.definition = definition;
        this.typeClass = typeClass;
        this.declaredType = declaredType;
        this.isRef = isRef;
        this.primitiveArgs = primitiveArgs;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("%s_%s", generalInfo().module(), name());
    }

    public static String global(String module, String name) {
        return String.format("%s_%s", module, name);
    }

    @Override
    public Optional<ValueDefinition> definition() {
        return Optional.ofNullable(this.definition);
    }

    public boolean isMonomorphic() {
        return this.isMonomorphic;
    }

    public Optional<TypeNode> declaredType() {
        return Optional.ofNullable(this.declaredType).map(decl -> decl.typeNode);
    }

    public Optional<Declaration> declaration() {
        return Optional.ofNullable(this.declaredType);
    }

    public Optional<TypeObject> inferredType() {
        return Optional.ofNullable(inferredType);
    }

    public Optional<ClassInfo> typeClass() {
        return Optional.ofNullable(this.typeClass);
    }

    public boolean isRef() {
        return isRef;
    }

    public Optional<List<String>> arguments() {
        if (this.isFunction()) {
            if (this.definition().isPresent()) {
                var def = this.definition().get();
                if (def.body instanceof LambdaNode lambda) {
                    return Optional.of(lambda.arguments);
                }
            }
        }
        return Optional.ofNullable(this.primitiveArgs);
    }

    /**
     * The declared type if available, otherwise the inferred type. Throws an error
     * if no type is known.
     * 
     * @return The declared or inferred type.
     */
    public TypeObject publicType() {
        if (declaredType != null) {
            return declaredType.typeNode.evalType();
        } else if (inferredType != null) {
            return inferredType;
        } else {
            throw new RuntimeException("No type info",
                    new PacioliException(location(), "no inferred or declared type for %s", name()));
        }
    }

    /**
     * The inferred type. Throws an error if no inferred type is known.
     * 
     * @return The inferred type.
     */
    public TypeObject localType() {
        if (inferredType != null) {
            return inferredType;
        } else {
            throw new RuntimeException("No type info (did you mean getType() instead of inferredType()?)",
                    new PacioliException(location(), "no inferred type for %s ", name()));
        }
    }

    public Boolean isFunction() {
        Schema schema = (Schema) publicType();
        return schema.type() instanceof FunctionType;
    }

    public void setinferredType(TypeObject type) {
        assert (this.inferredType == null);
        this.inferredType = type;
    }

    public boolean isUserDefined() {
        return this.definition != null ? this.definition.isUserDefined : false;
    }

    public boolean isOverloaded() {
        return this.typeClass != null;
    }

    public static class Builder extends GeneralBuilder<Builder, ValueInfo> {

        public Boolean isMonomorphic;
        public boolean isRef = false;
        public ValueDefinition definition;
        public Declaration declaredType;
        public ClassInfo typeClass;
        public List<String> primitiveArgs;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder isMonomorphic(Boolean isMonomorphic) {
            this.isMonomorphic = isMonomorphic;
            return this;
        }

        public Builder definition(ValueDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder declaredType(Declaration declaredType) {
            this.declaredType = declaredType;
            return this;
        }

        public Builder isRef(boolean isRef) {
            this.isRef = isRef;
            return this;
        }

        public Builder typeClass(ClassInfo typeClass) {
            this.typeClass = typeClass;
            return this;
        }

        public Builder primitiveArgs(List<String> primitiveArgs) {
            this.primitiveArgs = primitiveArgs;
            return this;
        }

        @Override
        public Optional<Location> definitionLocation() {
            return Optional.ofNullable(this.definition).map(def -> def.location());
        }

        public ValueInfo build() {
            if (isMonomorphic == null) {
                throw new RuntimeException("Field missing");
            }
            return new ValueInfo(
                    this.buildGeneralInfo(),
                    this.isMonomorphic,
                    this.isRef,
                    this.definition,
                    this.typeClass,
                    this.declaredType,
                    this.primitiveArgs);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
