/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.mcp;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class PacioliMCPServer {
    // TODO: better logging
    private static final String LOGFILE = null;
    // private static final String LOGFILE = "pacioli-mcp-server.log";

    private final MCPResourceManager resourceManager;
    private final MCPToolHandler toolHandler;
    private final MCPTransport transport;

    /**
     * Constructor that expects all dependencies. Use the MPCContainer to create a
     * server including its dependencies.
     * 
     * @param libs            Pacioli library directories.
     * @param transport
     * @param resourceManager
     * @param toolHandler
     */
    public PacioliMCPServer(
            MCPTransport transport,
            MCPResourceManager resourceManager,
            MCPToolHandler toolHandler) {
        this.resourceManager = resourceManager;
        this.toolHandler = toolHandler;
        this.transport = transport;
    }

    public void start() throws Exception {
        transport.start(this::handleMessage);
    }

    public void stop() {
        transport.close();
    }

    private void sendResponse(JsonElement id, JsonObject result) {
        JsonObject response = new JsonObject();

        response.addProperty("jsonrpc", "2.0");
        response.add("id", id);
        response.add("result", result);

        this.transport.send(response);
    }

    private void sendErrorResponse(JsonElement id, int code, String message) {
        JsonObject error = new JsonObject();
        error.addProperty("code", code);
        error.addProperty("message", "Internal error: " + message);

        JsonObject response = new JsonObject();
        response.addProperty("jsonrpc", "2.0");
        response.add("error", error);
        response.add("id", id);

        transport.send(response);
    }

    private void handleMessage(JsonObject message) {
        try {
            String method = message.has("method") ? message.get("method").getAsString() : null;

            log(String.format("Handling method: %s", method));

            if (method == null)
                return;

            switch (method) {
                case "initialize": {
                    this.sendResponse(message.get("id"), initializationResponse());

                    return;
                }
                case "notifications/initialized": {
                    // Client has completed initialization handshake
                    // This is a notification, so no response is sent
                    // Server is now ready to handle tool calls from client
                    return;
                }
                case "tools/list": {
                    // Discovery call to see our tool capabilities
                    this.sendResponse(message.get("id"), listTools());

                    return;
                }
                case "resources/list": {
                    // Discovery call to see our resource capabilities
                    this.sendResponse(message.get("id"), listResources());

                    return;
                }
                case "resources/templates/list": {
                    // Discovery call to see our resource capabilities
                    this.sendResponse(message.get("id"), listResourceTemplates());

                    return;
                }
                case "tools/call": {
                    // Tool invocation
                    JsonObject params = message.getAsJsonObject("params");
                    JsonObject result = toolHandler.callTool(params);

                    this.sendResponse(message.get("id"), result);

                    return;
                }
                case "resources/read": {
                    // Resource request
                    JsonObject params = message.getAsJsonObject("params");
                    String uri = params.get("uri").getAsString();

                    String text = resourceManager.fetch(uri);

                    JsonObject body = new JsonObject();
                    body.addProperty("uri", uri);
                    body.addProperty("mimeType", "text");
                    body.addProperty("text", text);

                    JsonArray contents = new JsonArray();
                    contents.add(body);

                    JsonObject result = new JsonObject();
                    result.add("contents", contents);

                    this.sendResponse(message.get("id"), result);

                    return;
                }
                default: {
                    sendErrorResponse(message.get("id"), -32603, String.format("Unexpected method '%s'", method));
                    break;
                }
            }

        } catch (Exception e) {
            log(String.format("Error: %s", e.getMessage()));
            sendErrorResponse(message.get("id"), -32603, "Internal error: " + e.getMessage());
        }
    }

    // Tmp log
    private void log(String message) {
        if (LOGFILE != null) {
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOGFILE, true))) {
                writer.write(String.format("[%s] %s%n",
                        ZonedDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                        message));
            } catch (IOException e) {
            }
        }
    }

    private static JsonObject initializationResponse() {
        JsonObject prompts = new JsonObject();
        JsonObject resources = new JsonObject();
        resources.addProperty("subscribe", false);
        resources.addProperty("listChanged", false);
        JsonObject tools = new JsonObject();

        JsonObject capabilities = new JsonObject();

        capabilities.add("prompts", prompts);
        capabilities.add("resources", resources);
        capabilities.add("tools", tools);

        JsonObject serverinfo = new JsonObject();
        serverinfo.addProperty("name", "Pacioli MCP");
        serverinfo.addProperty("version", "0.0.0");
        serverinfo.addProperty("description",
                String.format("Pacioli MCP running in %s", Path.of("").toAbsolutePath().toString()));

        JsonObject result = new JsonObject();

        result.addProperty("protocolVersion", "2025-11-25");
        result.add("capabilities", capabilities);
        result.add("serverInfo", serverinfo);

        return result;
    }

    private static JsonObject listTools() {
        JsonArray toolArray = new JsonArray();

        toolArray.add(toolInfo(
                "locate_references",
                "Finds all references to a Pacioli value or type and returns a list of their locations.",
                Map.ofEntries(
                        Map.entry("name", toolProperty("string", "Name of the Pacioli value or type")),
                        Map.entry("file", toolProperty("string", "Pacioli file where the name is from")),
                        Map.entry("kind", toolProperty("string", "One of 'value' or 'type'")))));

        toolArray.add(toolInfo(
                "project_graph",
                "Gives all files that are reachable from a Pacioil file via import or includes, including the base and standard libraries",
                Map.ofEntries(
                        Map.entry("file", toolProperty("string", "A Pacioli file")))));

        JsonObject result = new JsonObject();

        result.add("tools", toolArray);

        return result;
    }

    private static JsonObject toolInfo(String name, String description, Map<String, JsonObject> properties) {

        JsonObject schemaProperties = new JsonObject();
        JsonArray schemaRequired = new JsonArray();

        for (Map.Entry<String, JsonObject> entry : properties.entrySet()) {
            schemaProperties.add(entry.getKey(), entry.getValue());
            schemaRequired.add(entry.getKey());
        }

        JsonObject schema = new JsonObject();
        schema.addProperty("type", "object");
        schema.add("properties", schemaProperties);
        schema.add("required", schemaRequired);

        JsonObject info = new JsonObject();
        info.addProperty("name", name);
        info.addProperty("description", description);
        info.add("inputSchema", schema);

        return info;
    }

    private static JsonObject toolProperty(String type, String description) {
        JsonObject property = new JsonObject();

        property.addProperty("type", type);
        property.addProperty("description", description);

        return property;
    }

    private static JsonObject listResources() {
        JsonArray resourceArray = new JsonArray();

        JsonObject result = new JsonObject();

        result.add("resources", resourceArray);

        return result;
    }

    // private static JsonObject resourceInfo(
    // String uri,
    // String name,
    // String title,
    // String description) {

    // JsonObject info = new JsonObject();
    // info.addProperty("uri", uri);
    // info.addProperty("name", name);
    // info.addProperty("title", title);
    // info.addProperty("description", description);

    // return info;
    // }

    private static JsonObject listResourceTemplates() {
        JsonArray resourceArray = new JsonArray();

        JsonObject result = new JsonObject();

        result.add("resourceTemplates", resourceArray);

        return result;
    }

    // private static JsonObject resourceTemplateInfo(
    // String uri,
    // String name,
    // String title,
    // String description) {

    // JsonObject info = new JsonObject();
    // info.addProperty("uriTemplate", uri);
    // info.addProperty("name", name);
    // info.addProperty("title", title);
    // info.addProperty("description", description);

    // return info;
    // }
}
