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

package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.TypeDefinition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class ParametricInfo extends AbstractInfo implements TypeInfo {

    private final TypeDefinition definition;

    public ParametricInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location) {
        super(new GeneralInfo(name, file, isGlobal, isPublic, location));
        this.definition = null;
    }

    public ParametricInfo(GeneralInfo info, TypeDefinition definition) {
        super(info);
        this.definition = definition;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        // throw new RuntimeException("todo");
        // TODO: check this name with the name used by the compiler. This was added just
        // for logging.
        // return String.format("type_%s", name());
        return String.format("%s_%s", generalInfo().module().replace("-", "_"), name());
    }

    @Override
    public Optional<TypeDefinition> definition() {
        return Optional.ofNullable(definition);
    }

    public static class Builder extends GeneralBuilder<Builder, ParametricInfo> {

        private TypeDefinition definition;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder definition(TypeDefinition definition) {
            this.definition = definition;
            return this;
        }

        @Override
        public Optional<Location> definitionLocation() {
            return Optional.ofNullable(this.definition).map(def -> def.location());
        }

        @Override
        public ParametricInfo build() {
            return new ParametricInfo(this.buildGeneralInfo(), this.definition);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
