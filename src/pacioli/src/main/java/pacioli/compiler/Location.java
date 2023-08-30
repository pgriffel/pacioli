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

package pacioli.compiler;

import java.io.File;
import java.io.IOException;

/**
 * A location is a range in a file. A position is a location with an equal range
 * start and end.
 *
 */
public class Location {

    private final File file;

    private final Integer fromLine;
    private final Integer fromColumn;
    private final Integer fromOffset;

    private final Integer toLine;
    private final Integer toColumn;
    private final Integer toOffset;

    /**
     * Constructs a Location that represents a position in a file. Join two position
     * locations to create a range. It is the caller's responsibility that the
     * numbers
     * for this constructor are consistent and denote a real file position.
     * 
     * @param file   The file
     * @param line   Zero based line of the position in the file
     * @param column Zero based offset on the line of the position in the file
     * @param offset Zero based position in the file
     */
    public Location() {
        this.file = null;
        this.fromOffset = null;
        this.toOffset = null;
        this.fromLine = null;
        this.fromColumn = null;
        this.toLine = null;
        this.toColumn = null;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((file == null) ? 0 : file.hashCode());
        result = prime * result + ((fromLine == null) ? 0 : fromLine.hashCode());
        result = prime * result + ((fromColumn == null) ? 0 : fromColumn.hashCode());
        result = prime * result + ((fromOffset == null) ? 0 : fromOffset.hashCode());
        result = prime * result + ((toLine == null) ? 0 : toLine.hashCode());
        result = prime * result + ((toColumn == null) ? 0 : toColumn.hashCode());
        result = prime * result + ((toOffset == null) ? 0 : toOffset.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Location other = (Location) obj;
        if (file == null) {
            if (other.file != null)
                return false;
        } else if (!file.equals(other.file))
            return false;
        if (fromLine == null) {
            if (other.fromLine != null)
                return false;
        } else if (!fromLine.equals(other.fromLine))
            return false;
        if (fromColumn == null) {
            if (other.fromColumn != null)
                return false;
        } else if (!fromColumn.equals(other.fromColumn))
            return false;
        if (fromOffset == null) {
            if (other.fromOffset != null)
                return false;
        } else if (!fromOffset.equals(other.fromOffset))
            return false;
        if (toLine == null) {
            if (other.toLine != null)
                return false;
        } else if (!toLine.equals(other.toLine))
            return false;
        if (toColumn == null) {
            if (other.toColumn != null)
                return false;
        } else if (!toColumn.equals(other.toColumn))
            return false;
        if (toOffset == null) {
            if (other.toOffset != null)
                return false;
        } else if (!toOffset.equals(other.toOffset))
            return false;
        return true;
    }

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
     * @return A location with a range from the smallest start to the larget end of
     *         the two locations.
     */
    public Location join(Location other) {
        if (file == null) {
            return other;
        } else if (other.file == null) {
            return this;
        } else if (file.equals(other.file)) {
            Location smallestFrom = (this.fromOffset < other.fromOffset) ? this : other;
            Location largestTo = (this.toOffset < other.toOffset) ? other : this;
            return new Location(file, smallestFrom.fromLine, smallestFrom.fromColumn, smallestFrom.fromOffset,
                    largestTo.toLine, largestTo.toColumn, largestTo.toOffset);
        } else {
            throw new RuntimeException("Cannot join locations from different sources");
        }
    }

    public File file() {
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

        if (file == null) {
            return "No location info";
        }

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
