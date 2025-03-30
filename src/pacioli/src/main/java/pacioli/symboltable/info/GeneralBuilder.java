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

import pacioli.ast.definition.Documentation;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;

public abstract class GeneralBuilder<S, T> implements InfoBuilder<S, T> {

    private String name;
    private PacioliFile file;
    private Boolean isGlobal;
    private Location location;
    private Documentation documentation;
    private boolean isPublic;

    protected abstract S self();

    public S name(String name) {
        this.name = name;
        return self();
    }

    public S file(PacioliFile file) {
        this.file = file;
        return self();
    }

    public S isGlobal(Boolean isGlobal) {
        this.isGlobal = isGlobal;
        return self();
    }

    public S location(Location location) {
        this.location = location;
        return self();
    }

    public S documentation(Documentation documentation) {
        if (this.documentation != null) {
            throw new PacioliException(documentation.location(),
                    "Duplicate doc for '%s'. It is already defined in %s.",
                    documentation.name(),
                    this.documentation.location().description());
        }
        this.documentation = documentation;
        return self();
    }

    public S isPublic(boolean isPublic) {
        this.isPublic = isPublic;
        return self();
    }

    GeneralInfo buildGeneralInfo() {
        if (name == null ||
                file == null ||
                isGlobal == null ||
                location == null) {
            throw new RuntimeException("Field missing");
        }
        return new GeneralInfo(name, file, isGlobal, isPublic, location, this.documentation);
    }
}
