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

/**
 * A location is a range in a file. A position is a location with an equal range start and end.
 *
 */
public class Location {

    private final File file;
    
    private final int fromLine;
    private final int fromColumn;
    private final int fromOffset;
    
    private final int toLine;
    private final int toColumn;
    private final int toOffset;

    /**
     * Constructs a Location that represents a position in a file. Join two position
     * locations to create a range. It is the caller's responsibility that the numbers
     * for this constructor are consistent and denote a real file position.
     * 
     * @param file The file
     * @param line Zero based line of the position in the file
     * @param column Zero based offset on the line of the position in the file
     * @param offset Zero based position in the file
     */
    public Location(File file, int line, int column, int offset) {
        this.file = file;
        this.fromOffset = offset;
        this.toOffset = offset;
        this.fromLine = line;
        this.fromColumn = column;
        this.toLine = line;
        this.toColumn = column;
    }
    
    private Location(File file, int fromLine, int fromColumn, int fromOffset, int toLine, int toColumn, int toOffset) {
        this.file = file;
        this.fromOffset = fromOffset;
        this.toOffset = toOffset;
        this.fromLine = fromLine;
        this.fromColumn = fromColumn;
        this.toLine = toLine;
        this.toColumn = toColumn;
    }
    
    /**
     * The 'union' of two locations.
     * 
     * Throws a runtime error when the locations are not from the same file.
     * 
     * @param other A location
     * @return A location with a range from the smallest start to the larget end of the two locations.
     */
    public Location join(Location other) {
        if (file.equals(other.file)) {
            Location smallestFrom = (this.fromOffset < other.fromOffset) ? this : other;
            Location largestTo = (this.toOffset < other.toOffset) ? other : this;
            return new Location(file, smallestFrom.fromLine, smallestFrom.fromColumn, smallestFrom.fromOffset,
                                      largestTo.toLine, largestTo.toColumn, largestTo.toOffset);
        } else {
            throw new RuntimeException("Cannot join locations from different sources");
        }
    }
    
    public File getFile() {
        return file;
    }

    public String fragment() {
        try {
            return Utils.readFile(file).substring(fromOffset, toOffset);
        } catch (IOException e) {
            return "No source for file" + file + ": " + e.getMessage();
        }
    }

    public String description() {
        
        String source;
        try {
            source = Utils.readFile(file);
        } catch (IOException e) {
            return "No source for file" + file + ": " + e.getMessage();
        }

        assert (toOffset <= source.length());

        int start = fromOffset - fromColumn;
        int end = fromOffset;
        
        while (end < source.length() && source.charAt(end) != '\n') {
            end++;
        }

        String underline = "";
        for (int j = 0; j < toOffset - start; j++) {
            if (j < fromColumn) {
                underline += " ";
            } else {
                underline += "^";
            }
        }
        if (toOffset == fromOffset) {
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
    }
}
