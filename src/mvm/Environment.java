/*
 * Copyright (c) 2013 Paul Griffioen
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

package mvm;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import mvm.values.PacioliValue;

public class Environment {

    private final HashMap<String, PacioliValue> store;
    private Environment next;

    public Environment() {
        store = new HashMap<String, PacioliValue>();
        next = null;
    }

    public Environment(String key, PacioliValue value) {
        store = new HashMap<String, PacioliValue>();
        store.put(key, value);
        next = null;
    }

    public Environment(List<String> arguments, Environment env) {
        store = new HashMap<String, PacioliValue>();
        for (String key: arguments) {
            store.put(key, env.store.get(key));
        }
        next = null;
    }

    public Environment(List<String> arguments, List<PacioliValue> params) {
        store = new HashMap<String, PacioliValue>();
        for (int i = 0; i < arguments.size(); i++) {
            store.put(arguments.get(i), params.get(i));
        }
        next = null;
    }

    public PacioliValue lookup(String name) throws MVMException {
        if (store.containsKey(name)) {
            return store.get(name);
        } else {
            if (next == null) {
                throw new MVMException("variable '%s' unknown", name);
            } else {
                return next.lookup(name);
            }
        }

    }

    public Environment pushUnto(Environment environment) {
        if (next == null) {
            next = environment;
            return this;
        } else {
            throw new RuntimeException("huh");
        }
    }

    public boolean containsKey(String name) {
        if (store.containsKey(name)) {
            return true;
        }
        if (next != null) {
            return next.containsKey(name);
        }
        return false;
    }

    public Set<Map.Entry<String, PacioliValue>> entrySet() {
        Set<Map.Entry<String, PacioliValue>> keys = store.entrySet();
        if (next != null) {
            keys.addAll(next.entrySet());
        }
        return keys;
    }

    public void put(String name, PacioliValue value) {
        store.put(name, value);
    }

    public Set<String> keySet() {
        Set<String> keys = store.keySet();
        if (next != null) {
            keys.addAll(next.keySet());
        }
        return keys;
    }
}
