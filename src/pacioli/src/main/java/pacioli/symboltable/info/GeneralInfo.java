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

import java.io.File;
import java.util.Optional;

import pacioli.ast.definition.Documentation;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;

public class GeneralInfo {

    private final String name;
    private final PacioliFile file;
    private final Location location;
    private final boolean isGlobal;
    private final boolean isPublic;
    private final Documentation documentation;

    public GeneralInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location,
            Documentation documentation) {
        assert (location != null);
        this.name = name;
        this.file = file;
        this.isGlobal = isGlobal;
        this.isPublic = isPublic;
        this.location = location;
        this.documentation = documentation;
    }

    public GeneralInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location) {
        assert (location != null);
        this.name = name;
        this.file = file;
        this.isGlobal = isGlobal;
        this.isPublic = isPublic;
        this.location = location;
        this.documentation = null;
    }

    public String name() {
        return name;
    }

    public PacioliFile file() {
        return file;
    }

    public Location location() {
        return location;
    }

    public File fsFile() {
        return file.fsFile();
    }

    public String module() {
        return file.module();
    }

    public boolean isGlobal() {
        return isGlobal;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public boolean isLocal() {
        return !isGlobal;
    }

    public GeneralInfo withDocumentation(Documentation documentation) {
        return new GeneralInfo(this.name, this.file, this.isGlobal, this.isPublic, this.location, documentation);
    }

    public Optional<Documentation> documentation() {
        return Optional.ofNullable(this.documentation);
    }
}
