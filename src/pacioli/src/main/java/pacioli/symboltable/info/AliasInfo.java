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

import pacioli.ast.definition.AliasDefinition;
import pacioli.compiler.Location;
import pacioli.symboltable.SymbolTableVisitor;

public final class AliasInfo extends UnitInfo {

    private final AliasDefinition definition;

    public AliasInfo(GeneralInfo info, AliasDefinition definition) {
        super(info);
        this.definition = definition;
    }

    public Boolean isAlias() {
        return true;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }

    @Override
    public Optional<AliasDefinition> definition() {
        return Optional.ofNullable(definition);
    }

    public static class Builder extends GeneralBuilder<Builder, AliasInfo> {

        private AliasDefinition definition;

        public Builder definition(AliasDefinition definition) {
            this.definition = definition;
            return this;
        }

        @Override
        protected Builder self() {
            return this;
        }

        @Override
        public Optional<Location> definitionLocation() {
            return Optional.ofNullable(this.definition).map(def -> def.location());
        }

        @Override
        public AliasInfo build() {
            return new AliasInfo(this.buildGeneralInfo(), definition);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
