package pacioli.mcp;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.function.Consumer;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class MCPTransport {
    private final Gson gson = new Gson();
    private final BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    private final PrintWriter out = new PrintWriter(System.out, true);

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
}
