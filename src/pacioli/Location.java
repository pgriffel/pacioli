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

import java.io.File;
import java.io.IOException;

public class Location {

    private final File file;
    
    private final int from; // offset noemen
    private final int to; // offset noemen
    private final int fromLine;
    private final int fromColumn;
    private final int toLine;
    private final int toColumn;
    //private final String source;
    //private final String file;

    public Location(File file, int line, int column, int offset) {
        this.file = file;
        this.from = offset;
        this.to = offset;
        this.fromLine = line;
        this.fromColumn = column;
        this.toLine = line;
        this.toColumn = column;
    }
    
    private Location(File file, int fromLine, int fromColumn, int fromOffset, int toLine, int toColumn, int toOffset) {
        this.file = file;
        this.from = fromOffset;
        this.to = toOffset;
        this.fromLine = fromLine;
        this.fromColumn = fromColumn;
        this.toLine = toLine;
        this.toColumn = toColumn;
    }
/*    
    public Location(String file, String source, int at) {
        this.source = source;
        this.file = file;
        this.from = Math.min(at, at);
        this.to = Math.max(at, at);
        this.fromLine = 0;
        this.fromColumn = 0;
        this.toLine = 0;
        this.toColumn = 0;
    }

    public Location(String file, int fromLine, int fromColumn, int toLine, int toColumn) {
        this.source = null;
        this.file = file;
        this.fromLine = fromLine;
        this.fromColumn = fromColumn;
        this.toLine = toLine;
        this.toColumn = toColumn;
        this.to = 0;
        this.from = 0;
    }

    public Location(String file, String source, int from, int to) {
        this.source = source;
        this.file = file;
        this.from = Math.min(from, to);
        this.to = Math.max(from, to);
        this.fromLine = 0;
        this.fromColumn = 0;
        this.toLine = 0;
        this.toColumn = 0;
    }

    public Location(String file, String source) {
        this.source = source;
        this.file = file;
        this.from = -1;
        this.to = -1;
        this.fromLine = 0;
        this.fromColumn = 0;
        this.toLine = 0;
        this.toColumn = 0;
    }
*/
    public Location join(Location other) {
        if (from < 0 || to < 0) {
            assert(false);
            return other;
        }
        if (other.from < 0 || other.to < 0) {
            assert(false);
            return this;
        }
        if (!file.equals(other.file)) {
            throw new RuntimeException("Cannot join locations from different sources");
        } else {
            Location smallestFrom = (this.from < other.from) ? this : other;
            Location largestTo = (this.to < other.to) ? other : this;
            return new Location(file, smallestFrom.fromLine, smallestFrom.fromColumn, smallestFrom.from,
                                      largestTo.toLine, largestTo.toColumn, largestTo.to);
        }
    }

    public String description2() {
        String source;
        try {
            //source = Utils.readFile(new File(file));
            source = Utils.readFile(file);
        } catch (IOException e) {
            return "No source for file" + file;
        }
        if (from < 0 || to < 0) {
            return "No source location available";
        } else {
            return source.substring(from, to);
        }
    }

    public String description() {
        String source;
        try {
            //source = Utils.readFile(new File(file));
            source = Utils.readFile(file);
        } catch (IOException e) {
            return "No source for file" + file;
        }

        assert (to <= source.length());

        if (0 <= from && from <= to) {

    
            int i = 0;
            
  /*        int fromLine = 0;
            int fromColumn = 0;
            
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
*/
            int start = from - fromColumn;
            int end = from;
            while (end < source.length() && source.charAt(end) != '\n') {
                end++;
            }

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

                return String.format("file %s at line %s\n\n%s\n%s", file, fromLine + 1, sub, underline);
            } else {
                String subSource = source.substring(start, end);
                String sub = "> ";
                for (int j = 0; j < subSource.length(); j++) {
                    sub += subSource.charAt(j);
                    if (subSource.charAt(j) == '\n') {
                        sub += "> ";
                    }
                }

                return String.format("file %s at line %s\n\n%s\n", file, fromLine + 1, sub);
            }
        } else {
            return "No source location available";
        }
    }
}
