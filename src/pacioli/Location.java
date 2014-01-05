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

package pacioli;

public class Location {

    private final int from;
    private final int to;
    private final String source;
    private final String file;

    public Location(String file, String source, int from, int to) {
        this.source = source;
        this.file = file;
        this.from = Math.min(from, to);
        this.to = Math.max(from, to);
    }
    
    public Location(String file, String source) {
        this.source = source;
        this.file = file;
        this.from = -1;
        this.to = -1;
    }

    public Location join(Location other) {
    	if (from < 0 || to < 0) {
    		return other;
    	}
    	if (other.from < 0 || other.to < 0) {
    		return this;
    	}
        if (source != other.source || file != other.file) {
            throw new RuntimeException("Cannot join locations from different sources");
        } else {
            return new Location(file, source, Math.min(from, other.from), Math.max(to, other.to));
        }
    }

    public String description2() {
    	if (from < 0 || to < 0) {
    		return "No source location available";	
    	} else{
    		return source.substring(from, to);
    	}
    }

    public String description() {

        assert (to <= source.length());

        if (0 <= from && from <= to) {

            int fromLine = 0;
            int fromColumn = 0;
            int i = 0;
            while (i != from) {
                if (source.charAt(i++) == '\n') {
                    fromLine += 1;
                    fromColumn = 0;
                } else {
                    fromColumn += 1;
                }
            }

            int toLine = fromLine;
            int toColumn = fromColumn;
            while (i != to) {
                if (source.charAt(i++) == '\n') {
                    toLine += 1;
                    toColumn = 0;
                } else {
                    toColumn += 1;
                }
            }

            while (i < source.length() && source.charAt(i) != '\n') {
                i++;
            }

            int start = from - fromColumn;
            int end = i;

            String underline = "";
            for (int j = 0; j < to - start; j++) {
                if (j < fromColumn) {
                    underline += " ";
                } else {
                    underline += "^";
                }
            }
            if (to == from) {
                underline += "^";
            }

            if (fromLine == toLine) {
                String sub = "";
                String subSource = source.substring(start, end);
                for (int j = 0; j < subSource.length(); j++) {
                    if (subSource.charAt(j) == '\t') {
                        sub += " ";
                    } else {
                        sub += subSource.charAt(j);
                    }
                }

                return String.format("file %s at line %s\n\n%s\n%s",
                        file, fromLine + 1, sub, underline);
            } else {
                String subSource = source.substring(start, end);
                String sub = "> ";
                for (int j = 0; j < subSource.length(); j++) {
                    sub += subSource.charAt(j);
                    if (subSource.charAt(j) == '\n') {
                        sub += "> ";
                    }
                }

                return String.format("file %s at line %s\n\n%s\n",
                        file, fromLine + 1, sub);
            }
        } else {
            return "No source location available";
        }
    }
}
