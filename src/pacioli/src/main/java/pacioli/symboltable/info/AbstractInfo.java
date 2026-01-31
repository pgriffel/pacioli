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

import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;

public abstract class AbstractInfo implements Info {

    private final GeneralInfo general;

    public AbstractInfo(GeneralInfo general) {
        this.general = general;
    };

    @Override
    public GeneralInfo generalInfo() {
        return general;
    }

    @Override
    public String name() {
        return generalInfo().name();
    }

    @Override
    public Location location() {
        return general.location();
    }

    @Override
    public boolean isGlobal() {
        return general.isGlobal();
    }

    @Override
    public boolean isPublic() {
        return general.isPublic();
    }

    @Override
    public boolean isFromFile(PacioliFile file) {
        return generalInfo().module().equals(file.module());
    }
}
