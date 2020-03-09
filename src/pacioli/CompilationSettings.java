/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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

package pacioli;

import java.util.ArrayList;
import java.util.List;

public class CompilationSettings {

    public enum Target {MVM, JS, MATLAB};
    
    private boolean debug;
    private boolean traceAll;
    private List<String> toTrace;
    private Target target;

    public CompilationSettings(boolean debug, boolean traceAll, List<String> toTrace, Target target) {
        this.debug = debug;
        this.traceAll = traceAll;
        this.toTrace = new ArrayList<String>(toTrace);
        this.target = target;
    }

    public CompilationSettings() {
        this.debug = false;
        this.traceAll = false;
        this.toTrace = new ArrayList<String>();
        this.target = Target.MVM;
    }

    public Target getTarget() {
        return target;
    }
    
    public void setTarget(Target target) {
        this.target = target;
    }
    
    public void setDebug(Boolean on) { 
        debug = on;
    };
    
    public boolean isDebugOn() {
        return debug;
    }

    public boolean trace(String name) {
        return traceAll || toTrace.contains(name);
    }
}
