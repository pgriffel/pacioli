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
    
    private Target target = Target.MVM;
    private boolean debug = false;
    private boolean traceAll = false;
    private List<String> toTrace = new ArrayList<String>();
    private String kind = "bundle";
    
    public CompilationSettings() {
    }

    public Target getTarget() {
        return target;
    }
    
    public void setTarget(Target target) {
        this.target = target;
    }
    
    public String getKind() {
        return kind;
    }
    
    public void setKind(String kind) {
        this.kind = kind;
    }
    
    public void setDebug(Boolean on) { 
        debug = on;
    };
    
    public void toggleDebug() { 
        debug = !debug;
    };
    
    public boolean isDebugOn() {
        return debug;
    }
    
    public void setTraceAll(Boolean on) { 
        traceAll = on;
    };
    
    public void toggleTraceAll() { 
        traceAll = !traceAll;
    };
    
    public boolean isTraceAllOn() {
        return traceAll;
    }
    
    public void traceName(String name) {
        toTrace.add(name);
    }
    
    public boolean isTracing(String name) {
        return traceAll || toTrace.contains(name);
    }
}
