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

import pacioli.ast.definition.IndexSetDefinition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class IndexSetInfo extends AbstractInfo implements TypeInfo {

    private final IndexSetDefinition definition;

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    public IndexSetInfo(GeneralInfo info, IndexSetDefinition definition) {
        super(info);
        this.definition = definition;
    }

    public IndexSetInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location) {
        super(new GeneralInfo(name, file, isGlobal, isPublic, location));
        this.definition = null;
    }

    @Override
    public Optional<IndexSetDefinition> definition() {
        return Optional.ofNullable(this.definition);
    }

    @Override
    public String globalName() {
        return String.format("index_%s_%s", generalInfo().module(), name());
    }

    public static class Builder extends GeneralBuilder<Builder, IndexSetInfo> {

        private IndexSetDefinition definition;

        public Builder definition(IndexSetDefinition definition) {
            this.definition = definition;
            return this;
        }

        @Override
        public IndexSetInfo build() {
            return new IndexSetInfo(buildGeneralInfo(), definition);
        }

        @Override
        public Optional<Location> definitionLocation() {
            return Optional.ofNullable(this.definition).map(def -> def.location());
        }

        @Override
        protected Builder self() {
            return this;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
