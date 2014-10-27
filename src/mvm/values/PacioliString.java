package mvm.values;

import java.io.PrintWriter;

public class PacioliString extends AbstractPacioliValue {

	    private final String value;

	    public PacioliString(String value) {
	        this.value = value;
	    }

	    @Override
	    public void printText(PrintWriter out) {
	    	out.print(value);
	    }

	    @Override
	    public int hashCode() {
	        return value.hashCode();
	    }

	    @Override
	    public boolean equals(Object other) {
	        if (other == this) {
	            return true;
	        }
	        if (!(other instanceof PacioliString)) {
	            return false;
	        }
	        PacioliString otherString = (PacioliString) other;
	        return this.value.equals(otherString.value);
	    }
	}

