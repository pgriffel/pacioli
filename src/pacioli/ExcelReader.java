package pacioli;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.xml.parsers.SAXParserFactory;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.openxml4j.opc.PackageAccess;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.codehaus.jparsec.functors.Pair;
import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;

/**
 *
 * @author Administrator
 */
public class ExcelReader {

    private final File xlsxFile;
    private final OPCPackage opcPackage;
    private final ReadOnlySharedStringsTable sharedStringsTable;

    public ExcelReader(String fileName) throws Exception {
        this.xlsxFile = new File(fileName);
        if (!xlsxFile.exists()) {
            throw new FileNotFoundException("File '" + fileName + "' does not exist");
        }
        this.opcPackage = OPCPackage.open(xlsxFile.getPath(), PackageAccess.READ);
        this.sharedStringsTable = new ReadOnlySharedStringsTable(opcPackage);
    }

    public List<String> readIndexSet(String sheet, String column, int row) throws Exception {
        IndexSetHandler handler = new IndexSetHandler(column, row);
        readSheet(handler, sheet);
        return handler.getValues();
    }

    public List<Pair<List<String>, String>> readMatrix(String sheet, List<String> columns, int row) throws Exception {
    	// Use ColumnsHandler and remove MatrixHandler. Convert to pair list here if necessary.
        MatrixHandler handler = new MatrixHandler(columns, columns.get(columns.size() - 1), row);
        readSheet(handler, sheet);
        return handler.getValues();
    }
    
    public List<List<String>> readColumns(String sheet, List<String> columns, int row) throws Exception {
        ColumnsHandler handler = new ColumnsHandler(columns, row);
        readSheet(handler, sheet);
        return handler.getValues();
    }

    private void readSheet(DefaultHandler handler, String sheet) throws Exception {
        XMLReader sheetParser = SAXParserFactory.newInstance().newSAXParser().getXMLReader();
        sheetParser.setContentHandler(handler);
        InputStream stream = openSheetStream(sheet);
        try  {
            sheetParser.parse(new InputSource(stream));
        } finally {
        	if (stream != null) stream.close();
        }
    }

    private InputStream openSheetStream(String sheet) throws Exception {

        XSSFReader xssfReader = new XSSFReader(opcPackage);
        XSSFReader.SheetIterator iter = (XSSFReader.SheetIterator) xssfReader.getSheetsData();

        InputStream stream = null;
        InputStream next;
        while (iter.hasNext()) {
            next = iter.next();
            if (iter.getSheetName().equals(sheet)) {
                stream = next;
            }
        }

        if (stream == null) {
            throw new IOException("Sheet '" + sheet + "' does not exist in file '" + xlsxFile.getName() + "'");
        }

        return stream;
    }

    private String cellValue(String value, String valueType) {
        if ("s".equals(valueType)) {
            int idx = Integer.parseInt(value);
            XSSFRichTextString rtss = new XSSFRichTextString(sharedStringsTable.getEntryAt(idx));
            return rtss.toString();
        } else {
            return value;
        }
    }

    private class IndexSetHandler extends DefaultHandler {

        // Parameters
        private final int firstRow;
        private final String valueColumn;
        // Accumulators
        private final StringBuffer value;
        private final Set<String> valueSet;
        private final List<String> valueList;
        // Parser state
        private boolean vIsOpen;
        private String valueType;
        private int currentRow;
        private String currentCell;

        private IndexSetHandler(String column, int row) {
            this.value = new StringBuffer();
            this.valueSet = new HashSet<String>();
            this.valueList = new ArrayList<String>();
            this.valueColumn = column;
            this.firstRow = row;
        }

        private void setValue(int sheetRow, String value) {
            if (!valueSet.contains(value)) {
                valueList.add(value);
            }
            valueSet.add(value);
        }

        private List<String> getValues() {
            return valueList;
        }

        public void startElement(String uri, String localName, String name,
                Attributes attributes) throws SAXException {

            if ("inlineStr".equals(name) || "v".equals(name)) {
                vIsOpen = true;
                value.setLength(0);
            } else if ("c".equals(name)) {
                currentCell = attributes.getValue("r");
                valueType = attributes.getValue("t");
                //valueStyle = attributes.getValue("s");
            } else if ("row".equals(name)) {
                currentRow = Integer.valueOf(attributes.getValue("r"));
            }
        }

        public void endElement(String uri, String localName, String name) throws SAXException {
            if ("v".equals(name)) {
                vIsOpen = false;
                if (currentCell.equals(valueColumn + currentRow)) {
                    if (firstRow <= currentRow) {
                        setValue(currentRow, cellValue(value.toString(), valueType));
                    }
                }
            }
        }

        public void characters(char[] ch, int start, int length) throws SAXException {
            if (vIsOpen) {
                value.append(ch, start, length);
            }
        }
    }

    private class MatrixHandler extends DefaultHandler {

        // Parameters
        private final int firstRow;
        private final List<String> indexColumns;
        private final String valueColumn;
        // Accumulators
        private final StringBuffer value;
        private final List<String> indexBuffers;
        private String valueBuffer;
        private final List<Pair<List<String>, String>> values;
        // Parser state
        private boolean vIsOpen;
        private String valueType;
        private int currentRow;
        private String currentCell;

        private MatrixHandler(List<String> columns, String column, int row) {
            this.value = new StringBuffer();
            this.values = new ArrayList<Pair<List<String>, String>>();
            this.indexColumns = columns;
            this.valueColumn = column;
            this.firstRow = row;
            this.indexBuffers = new ArrayList<String>();
            for (int i = 0; i < columns.size() - 1; i++) {
                this.indexBuffers.add("");
            }
            this.valueBuffer = "";
        }

        private List<Pair<List<String>, String>> getValues() {
            return values;
        }

        public void startElement(String uri, String localName, String name,
                Attributes attributes) throws SAXException {
            if ("inlineStr".equals(name) || "v".equals(name)) {
                vIsOpen = true;
                value.setLength(0);
            } else if ("c".equals(name)) {
                currentCell = attributes.getValue("r");
                valueType = attributes.getValue("t");
            } else if ("row".equals(name)) {
                currentRow = Integer.valueOf(attributes.getValue("r"));
            }
        }

        public void endElement(String uri, String localName, String name) throws SAXException {
            if ("inlineStr".equals(name) || "v".equals(name)) {
                vIsOpen = false;
                if (currentCell.equals(valueColumn + currentRow)) {
                    valueBuffer = cellValue(value.toString(), valueType);
                } else {
                    for (int i = 0; i < indexColumns.size(); i++) {
                        if (currentCell.equals(indexColumns.get(i) + currentRow)) {
                            indexBuffers.set(i, cellValue(value.toString(), valueType));
                        }
                    }
                }
            } else if ("row".equals(name)) {
                if (firstRow <= currentRow) {
                    List<String> indices = new ArrayList<String>(indexBuffers);
                    Pair<List<String>, String> pair = new Pair<List<String>, String>(indices, valueBuffer);
                    values.add(pair);
                    for (int i = 0; i < indexBuffers.size(); i++) {
                        indexBuffers.set(i, "");
                    }
                }
            }
        }

        public void characters(char[] ch, int start, int length) throws SAXException {
            if (vIsOpen) {
                value.append(ch, start, length);
            }
        }
    }
    
    private class ColumnsHandler extends DefaultHandler {

        // Parameters
        private final int firstRow;
        private final List<String> columns;
        // Accumulators
        private final StringBuffer value;
        private final List<String> valueBuffers;
        private final List<List<String>> values;
        // Parser state
        private boolean vIsOpen;
        private String valueType;
        private int currentRow;
        private String currentCell;

        private ColumnsHandler(List<String> columns, int row) {
            this.value = new StringBuffer();
            this.values = new ArrayList<List<String>>();
            this.columns = columns;
            this.firstRow = row;
            this.valueBuffers = new ArrayList<String>();
            for (int i = 0; i < columns.size(); i++) {
                this.valueBuffers.add("");
            }
        }

        private List<List<String>> getValues() {
            return values;
        }

        public void startElement(String uri, String localName, String name,
                Attributes attributes) throws SAXException {
            if ("inlineStr".equals(name) || "v".equals(name)) {
                vIsOpen = true;
                value.setLength(0);
            } else if ("c".equals(name)) {
                currentCell = attributes.getValue("r");
                valueType = attributes.getValue("t");
            } else if ("row".equals(name)) {
                currentRow = Integer.valueOf(attributes.getValue("r"));
            }
        }

        public void endElement(String uri, String localName, String name) throws SAXException {
            if ("inlineStr".equals(name) || "v".equals(name)) {
                vIsOpen = false;
                for (int i = 0; i < columns.size(); i++) {
                    if (currentCell.equals(columns.get(i) + currentRow)) {
                        valueBuffers.set(i, cellValue(value.toString(), valueType));
                    }
                }
            } else if ("row".equals(name)) {
                if (firstRow <= currentRow) {
                    List<String> row = new ArrayList<String>(valueBuffers);
                    values.add(row);
                    for (int i = 0; i < valueBuffers.size(); i++) {
                        valueBuffers.set(i, "");
                    }
                }
            }
        }

        public void characters(char[] ch, int start, int length) throws SAXException {
            if (vIsOpen) {
                value.append(ch, start, length);
            }
        }
    }
}
