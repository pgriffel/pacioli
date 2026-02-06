package pacioli.mcp;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.function.Consumer;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class MCPTransport {
    private final Gson gson = new Gson();
    private final BufferedReader in;
    private final PrintWriter out;

    public MCPTransport() {
        this(System.in, System.out);
    }

    public MCPTransport(InputStream inStream, OutputStream outStream) {
        this.in = new BufferedReader(new InputStreamReader(inStream));
        this.out = new PrintWriter(outStream, true);
    }

    public void start(Consumer<JsonObject> handler) throws Exception {
        String line;
        while ((line = in.readLine()) != null) {
            if (line.trim().isEmpty()) {
                continue;
            }
            JsonObject obj = JsonParser.parseString(line).getAsJsonObject();
            handler.accept(obj);
        }
    }

    public void send(JsonObject obj) {
        out.println(gson.toJson(obj));
        out.flush();
    }

    public void close() {
        // TODO: is this close needed? The integration test hangs when this close is
        // called.
        // try {
        // in.close();
        // } catch (Exception e) {
        // // ignore
        // }
        try {
            out.close();
        } catch (Exception e) {
            // ignore
        }
    }
}
