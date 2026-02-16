# Plan: Add Java Model Context Protocol (MCP) Server to Pacioli

## Overview

This plan outlines the integration of a Model Context Protocol (MCP) server into the Pacioli compiler, allowing Claude and other AI systems to interact with the Pacioli language for code analysis, compilation, and execution. The entrypoint will be integrated into `Pacioli.java` as a new `mcp` command.

---

## Executive Summary

The MCP server will expose Pacioli's capabilities through a standardized protocol, enabling:

- **Code Analysis**: Parse and analyze Pacioli code, extract types, symbols, and documentation
- **Compilation**: Compile Pacioli code to various targets (MVM, JavaScript, MATLAB, Python)
- **Project Navigation**: Explore modules, libraries, and dependencies
- **Interactive Development**: Real-time feedback on type inference, errors, and documentation

---

## 1. Architecture Overview

### 1.1 Integration Points

```
Pacioli.java (main entry point)
├── mcp command handler
│   └── PacioliMCPServer (new)
│       ├── ToolHandler (manages MCP tools)
│       ├── ResourceManager (manages code resources)
│       └── MCPTransport (stdio-based communication)
```

### 1.2 Key Components

| Component            | Purpose                                       | Location                              |
| -------------------- | --------------------------------------------- | ------------------------------------- |
| `PacioliMCPServer`   | Main MCP server implementation                | `pacioli/mcp/PacioliMCPServer.java`   |
| `MCPToolHandler`     | Implements MCP tool definitions and execution | `pacioli/mcp/MCPToolHandler.java`     |
| `MCPResourceManager` | Manages code files and library resources      | `pacioli/mcp/MCPResourceManager.java` |
| `MCPTransport`       | Handles stdio-based JSON-RPC communication    | `pacioli/mcp/MCPTransport.java`       |
| Tool Implementations | Individual tool executors (listed below)      | `pacioli/mcp/tools/`                  |

---

## 2. Dependencies

### 2.1 New Maven Dependencies to Add

#### Model Context Protocol SDK

```xml
<!-- Python MCP reference implementation provides SDK specifications -->
<!-- We'll need to either:
  1. Use the official Java MCP SDK when available
  2. Implement JSON-RPC 2.0 manually over stdio
  3. Wrap Python MCP SDK via process execution (not ideal)
-->
```

**Recommended Approach**: Implement custom MCP transport using existing JSON handling capabilities:

- **`com.google.code.gson:gson`** (JSON serialization)

  ```xml
  <dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
  </dependency>
  ```

- **`commons-lang3`** (utility functions)
  ```xml
  <dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
  </dependency>
  ```

### 2.2 Dependency Rationale

- **GSON**: Already familiar pattern in Pacioli (LSP4J uses Jackson/JSON)
- **commons-lang3**: String/collection utilities for data transformation
- **No external MCP library**: MCP is a simple JSON-RPC 2.0 protocol; implementing directly keeps dependencies minimal

---

## 3. MCP Server Implementation Plan

### 3.1 Command Handler Integration (Pacioli.java)

**Location**: `Pacioli.java` - `handleArgs()` method

**Changes**:

1. Add `mcp` command recognition in the command parser
2. Route to new `mcpCommand()` method
3. Pass library paths and optional configuration to MCP server

```java
// In handleArgs() switch statement
else if (command.equals("mcp")) {
    mcpCommand(libs);
}

// New method
private static void mcpCommand(List<File> libs) {
    try {
        PacioliMCPServer server = new PacioliMCPServer(libs);
        server.start();
    } catch (Exception e) {
        logToFile("pacioli_mcp_error.log", e.getMessage());
        e.printStackTrace();
    }
}
```

### 3.2 Core MCP Server Architecture

#### 3.2.1 PacioliMCPServer.java

**Responsibilities**:

- Initialize MCP protocol state
- Manage tool definitions and resources
- Handle initialization handshake
- Route incoming requests to appropriate handlers

**Key Methods**:

```java
class PacioliMCPServer {
    - __init__(libraries: List<File>)
    - start(): void                      // Start listening on stdio
    - handleMessage(request): JSONObject // Process JSON-RPC request
    - getToolDefinitions(): List<Tool>   // List available tools
    - getResources(): List<Resource>     // List available resources
    - listTools(): JSONObject            // Dynamic capability discovery
}
```

#### 3.2.2 MCPToolHandler.java

**Responsibilities**:

- Define MCP tool specifications
- Execute tools with validation
- Return properly formatted responses

**Tools to Implement** (Phase 1):

| Tool Name           | Input                          | Output                                  | Purpose                        |
| ------------------- | ------------------------------ | --------------------------------------- | ------------------------------ |
| `tools/list`        | (none)                         | Array of tool definitions with schemas  | Dynamic capability discovery   |
| `analyze_file`      | `filepath`, `libdir`           | JSON with type info, symbols, errors    | Parse and analyze Pacioli file |
| `list_symbols`      | `filepath`, `libdir`           | Array of symbol definitions with types  | Extract public API from module |
| `get_documentation` | `name`, `libdir`               | Markdown documentation                  | Get API documentation          |
| `compile`           | `filepath`, `libdir`, `target` | Compiled code or error details          | Compile to target language     |
| `infer_types`       | `filepath`, `libdir`           | Type annotations with inference details | Show inferred types            |
| `list_libraries`    | `libdir`                       | Array of available libraries            | Browse available modules       |

#### 3.2.3 MCPResourceManager.java

**Responsibilities**:

- Index available Pacioli files and libraries
- Provide file content and metadata
- Track dependency graphs

**Key Methods**:

```java
class MCPResourceManager {
    - __init__(libraryPaths: List<File>)
    - listLibraries(): List<LibraryInfo>
    - getFileContent(path: String): String
    - getFileMetadata(path: String): FileMetadata
    - resolveDependencies(path: String): List<File>
}
```

#### 3.2.4 MCPTransport.java

**Responsibilities**:

- Handle JSON-RPC 2.0 message protocol
- Manage stdio communication
- Parse and serialize messages

**Implementation Notes**:

- Read messages line-by-line from stdin (JSON text format)
- Write responses to stdout
- Implement request/response matching via `id` field
- Handle notifications (no response needed)

---

## 4. Detailed Implementation Phases

### Phase 1: Foundation (Core MCP Protocol + Basic Tools)

**Duration**: 1-2 weeks

**Tasks**:

1. Create `pacioli/mcp/` package directory
2. Implement `MCPTransport` class:
   - JSON-RPC 2.0 request/response parsing
   - Message marshaling/unmarshaling via GSON
   - Stdio management
3. Implement `PacioliMCPServer` class:
   - Protocol initialization and version negotiation
   - Request routing
   - **Implement `tools/list` method for dynamic capability discovery**
4. Implement `MCPResourceManager`:
   - Library discovery and indexing
5. Implement `MCPToolHandler` with first 2 tools:
   - `analyze_file`
   - `list_symbols`
6. Add `mcp` command to `Pacioli.java`
7. Add Maven dependencies
8. Create basic unit tests

**Deliverables**:

- Working MCP server responding to initialization
- Two functional tools for code analysis
- MCP can be invoked via: `pacioli mcp -lib /path/to/lib`

### Phase 2: Extended Tools

**Duration**: 1 week

**Tasks**:

1. Implement remaining tools:
   - `get_documentation`
   - `compile`
   - `infer_types`
   - `list_libraries`
2. Add tool-specific error handling
3. Improve error messages with location information
4. Add integration tests

**Deliverables**:

- All 6 core tools functional
- Comprehensive error handling
- Integration with existing compiler pipeline

### Phase 3: Advanced Features

**Duration**: 2+ weeks

**Tasks**:

1. Add resource definitions (expose code files as resources)
2. Implement file monitoring (detect changes)
3. Add caching layer for compiled output
4. Implement progressive compilation (incremental builds)
5. Add debugging support (breakpoints, step execution)
6. Performance optimization

**Deliverables**:

- Resource-based code browsing
- Real-time diagnostic updates
- Incremental compilation support

### Phase 4: Documentation & Polish

**Duration**: 1 week

**Tasks**:

1. Write MCP protocol documentation
2. Document all tools and their schemas
3. Create examples and use cases
4. Add logging/debugging support
5. Performance profiling and optimization

---

## 5. File Structure

```
src/pacioli/src/main/java/pacioli/mcp/
├── PacioliMCPServer.java          # Main server class
├── MCPToolHandler.java             # Tool definitions and execution
├── MCPResourceManager.java         # File and library management
├── MCPTransport.java               # JSON-RPC protocol handling
├── MCPException.java               # MCP-specific exceptions
├── types/
│   ├── Tool.java                   # Tool definition class
│   ├── Resource.java               # Resource definition class
│   └── TextContent.java            # Text content wrapper
├── tools/
│   ├── AnalyzeTool.java            # analyze_file implementation
│   ├── ListSymbolsTool.java        # list_symbols implementation
│   ├── DocumentationTool.java      # get_documentation implementation
│   ├── CompileTool.java            # compile implementation
│   ├── InferTypesTool.java         # infer_types implementation
│   └── ListLibrariesTool.java      # list_libraries implementation
└── handlers/
    ├── ToolExecutionHandler.java   # Tool invocation logic
    └── ResourceHandler.java         # Resource serving logic
```

---

## 6. Integration with Existing Compiler

### 6.1 Reuse Existing Components

The MCP server will leverage existing Pacioli infrastructure:

| Component                             | Usage                               |
| ------------------------------------- | ----------------------------------- |
| `Project`                             | Load and build dependency graph     |
| `Bundle`                              | Aggregate symbols for analysis      |
| `SymbolTable`                         | Extract symbol information          |
| `PacioliFile`                         | Parse individual files              |
| `CompilationSettings`                 | Control compilation options         |
| `JSTranspiler`, `MVMTranspiler`, etc. | Generate code for different targets |

### 6.2 API Wrapper Classes

Create thin wrappers to expose compiler functionality:

```java
// Example: analyzing a file
public class PacioliAnalyzer {
    public AnalysisResult analyzeFile(File file, List<File> libs) {
        Project project = new Project(file, libs);
        Bundle bundle = project.compileBundle();
        return new AnalysisResult(bundle);
    }
}

// Provide structured output for MCP
public class AnalysisResult {
    public List<SymbolInfo> symbols;
    public List<CompilerError> errors;
    public Map<String, TypeInfo> typeMap;
}
```

---

## 7. MCP Tool Specifications

### 7.1 tools/list Method (Dynamic Capability Discovery)

**Purpose**: List all available tools with their specifications, input schemas, and documentation. This enables clients to dynamically discover capabilities without hardcoding tool names.

**Input Schema**: None (no parameters required)

**Output Schema**:

```json
{
  "tools": [
    {
      "name": "analyze_file",
      "description": "Parse and analyze a Pacioli file, returning symbols, types, and diagnostics",
      "inputSchema": {
        "type": "object",
        "properties": {
          "filepath": {
            "type": "string",
            "description": "Path to the Pacioli file to analyze"
          },
          "libdir": {
            "type": "string",
            "description": "Path to the library directory"
          }
        },
        "required": ["filepath", "libdir"]
      }
    },
    {
      "name": "list_symbols",
      "description": "Extract all public symbols from a module (API listing)",
      "inputSchema": {
        "type": "object",
        "properties": {
          "filepath": {
            "type": "string",
            "description": "Path to the Pacioli module file"
          },
          "libdir": {
            "type": "string",
            "description": "Path to the library directory"
          }
        },
        "required": ["filepath", "libdir"]
      }
    },
    {
      "name": "compile",
      "description": "Compile Pacioli code to a target language",
      "inputSchema": {
        "type": "object",
        "properties": {
          "filepath": {
            "type": "string",
            "description": "Path to the Pacioli file to compile"
          },
          "libdir": {
            "type": "string",
            "description": "Path to the library directory"
          },
          "target": {
            "type": "string",
            "description": "Target language (mvm, javascript, matlab, python)",
            "enum": ["mvm", "javascript", "matlab", "python"]
          }
        },
        "required": ["filepath", "libdir", "target"]
      }
    }
  ]
}
```

**Implementation Notes**:

- The `tools/list` method is handled directly by the server (not as a tool in MCPToolHandler)
- Implement as a special case in `PacioliMCPServer.handleMessage()` when `method == "tools/list"`
- Return tool definitions with full JSON schemas for client introspection
- Update tool definitions when tools are dynamically added (Phase 3+)
- Tool descriptions should include parameter requirements and output format

**Request Example**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**Response Example**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "analyze_file",
        "description": "...",
        "inputSchema": {...}
      }
    ]
  }
}
```

---

### 7.2 analyze_file Tool

**Purpose**: Parse and analyze a Pacioli file, returning symbols, types, and diagnostics.

**Input Schema**:

```json
{
  "filepath": "path/to/file.pacioli",
  "libdir": "/path/to/lib"
}
```

**Output Schema**:

```json
{
  "symbols": [
    {
      "name": "matrix_multiply",
      "kind": "function",
      "type": "for_index M,N,K: (Matrix<M,K>, Matrix<K,N>) -> Matrix<M,N>",
      "documentation": "Multiply two matrices...",
      "location": { "file": "base.pacioli", "line": 42 }
    }
  ],
  "errors": [
    {
      "message": "Undefined variable 'x'",
      "location": { "file": "test.pacioli", "line": 10, "column": 5 },
      "severity": "error"
    }
  ],
  "types": {
    "result": "Matrix<Row,Col>"
  }
}
```

### 7.3 list_symbols Tool

**Purpose**: Extract all public symbols from a module (API listing).

**Input Schema**:

```json
{
  "filepath": "lib/base/base.pacioli",
  "libdir": "/path/to/lib"
}
```

**Output Schema**:

```json
{
  "module": "base",
  "symbols": [
    {
      "name": "identity",
      "type": "for_index N: () -> Matrix<N,N>",
      "isPublic": true
    }
  ]
}
```

### 7.4 compile Tool

**Purpose**: Compile code to a target language.

**Input Schema**:

```json
{
  "filepath": "myprogram.pacioli",
  "libdir": "/path/to/lib",
  "target": "javascript",
  "kind": "bundle"
}
```

**Output Schema**:

```json
{
  "success": true,
  "code": "// Generated JavaScript code\nconst result = ...",
  "outputFile": "myprogram.js",
  "messages": []
}
```

**Supported targets**: `mvm`, `javascript`, `matlab`, `python`

### 7.5 infer_types Tool

**Purpose**: Show type inference for expressions and definitions.

**Input Schema**:

```json
{
  "filepath": "test.pacioli",
  "libdir": "/path/to/lib"
}
```

**Output Schema**:

```json
{
  "definitions": [
    {
      "name": "x",
      "location": { "line": 5 },
      "inferredType": "Matrix<Index, Unit>",
      "confidence": "certain"
    }
  ]
}
```

---

## 8. Error Handling Strategy

### 8.1 Exception Hierarchy

```java
class MCPException extends Exception {
    // Base MCP exception
}

class MCPToolException extends MCPException {
    // Tool execution failed
    int code;
    Object data;
}

class MCPProtocolException extends MCPException {
    // JSON-RPC protocol violation
}

class MCPCompilationException extends MCPException {
    // Pacioli compiler error
    PacioliException cause;
}
```

### 8.2 Error Response Format

JSON-RPC 2.0 error response:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Internal error: Compilation failed",
    "data": {
      "type": "compilation_error",
      "details": "Type mismatch at line 42: expected Matrix, got Scalar"
    }
  },
  "id": 1
}
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Location**: `src/pacioli/src/test/java/pacioli/mcp/`

Test classes:

- `MCPTransportTest`: Protocol message serialization
- `PacioliMCPServerTest`: Server initialization and routing
- `AnalyzeToolTest`: File analysis functionality
- `CompileToolTest`: Compilation with different targets

### 9.2 Integration Tests

- End-to-end MCP server startup and shutdown
- Multiple sequential tool invocations
- Error handling and recovery
- Resource management

### 9.3 Test Fixtures

Use existing Pacioli test files from `test/` directory:

- `test/base/` - Basic language features
- `test/standard/` - Standard library tests
- `test/pacioli_js/` - JavaScript compilation

---

## 10. Configuration & Options

### 10.1 MCP Command Options

```bash
# Basic usage
pacioli mcp -lib /path/to/lib

# With logging
pacioli mcp -lib /path/to/lib -log pacioli_mcp.log

# With debug output
pacioli mcp -lib /path/to/lib -debug
```

### 10.2 Options File Integration

Support in `debug.options`:

```properties
# Enable MCP server
mcp.enabled=true

# Tool-specific settings
mcp.tools.compile.cache=true
mcp.tools.compile.incremental=true
mcp.analysis.includePrivate=false
```

---

## 11. Documentation Requirements

### 11.1 Developer Documentation

- MCP server architecture overview
- Tool implementation guide
- JSON-RPC protocol details
- Testing guidelines

### 11.2 User Documentation

- CLI usage: `pacioli mcp --help`
- Tool reference documentation
- Example use cases
- Troubleshooting guide

### 11.3 API Documentation

- Javadoc comments on all public classes/methods
- JSON schema documentation for all tool inputs/outputs
- Integration examples for Claude and other clients

---

## 12. Deployment & Release

### 12.1 Artifact Changes

- `pacioli-0.5.0-jar-with-dependencies.jar` will include MCP dependencies
- No change to VS Code extension (LSP remains separate)
- New `pacioli mcp` command available after build

### 12.2 Backward Compatibility

- Existing commands (`compile`, `run`, `lsp`, etc.) unchanged
- MCP is purely additive
- No breaking changes to compiler APIs

### 12.3 Release Notes

- Document new `mcp` command
- List supported tools
- Include migration guide for those switching from LSP to MCP

---

## 13. Future Enhancements (Phase 3+)

### 13.1 Advanced Tools

- `execute` - Run compiled code in MVM
- `debug` - Step through execution with breakpoints
- `refactor` - Rename symbols, extract functions
- `format` - Code formatting
- `search` - Find definitions/references

### 13.2 Streaming & Subscriptions

- File change notifications
- Diagnostic updates
- Compilation progress notifications

### 13.3 Performance Optimizations

- Compilation caching (memcached or local)
- Incremental type checking
- Lazy symbol resolution

### 13.4 IDE Integration Examples

- Claude MCP client configuration
- Cline extension integration
- Other MCP-compatible tools

---

## 14. Risk Mitigation

| Risk                            | Mitigation                                         |
| ------------------------------- | -------------------------------------------------- |
| Breaking existing functionality | Comprehensive test suite, separate MCP module      |
| Performance degradation         | Profiling during development, incremental builds   |
| Dependency conflicts            | Minimal new dependencies, version pinning          |
| Complex error handling          | Centralized exception hierarchy, logging framework |
| Maintenance burden              | Clear architecture, documentation, automated tests |

---

## 15. Success Criteria

### Phase 1 Complete When:

- ✅ MCP server starts and responds to initialization
- ✅ `tools/list` method dynamically discovers and describes available tools
- ✅ `analyze_file` tool returns accurate symbol/type information
- ✅ `list_symbols` extracts public API correctly
- ✅ Command: `pacioli mcp -lib /path/to/lib` works from CLI
- ✅ Basic unit tests pass (>80% code coverage)

### Phase 2 Complete When:

- ✅ All 6 core tools functional and tested
- ✅ Error handling comprehensive
- ✅ Integration with VS Code MCP client verified
- ✅ Documentation complete

### Phase 3 Complete When:

- ✅ Resources implemented
- ✅ Performance benchmarks met
- ✅ Advanced features (caching, incremental build) working
- ✅ Ready for production use

---

## 16. Timeline Summary

| Phase                    | Duration      | Target Completion |
| ------------------------ | ------------- | ----------------- |
| Phase 1 (Foundation)     | 1-2 weeks     | Week 2            |
| Phase 2 (Extended Tools) | 1 week        | Week 3            |
| Phase 3 (Advanced)       | 2+ weeks      | Week 5+           |
| Phase 4 (Polish)         | 1 week        | Week 6+           |
| **Total**                | **5-6 weeks** | **~6 weeks**      |

---

## Appendix A: MCP Protocol Overview

**MCP (Model Context Protocol)** is a standardized protocol enabling AI models to safely interact with software through defined capabilities:

- **Tools**: Callable functions with input schemas and documentation
- **Resources**: Files and data accessible by the model
- **Prompts**: Multi-turn conversation templates
- **Sampling**: Integration with model sampling APIs

**Transport**: JSON-RPC 2.0 over stdio (for this implementation)

**Reference**: https://modelcontextprotocol.io/

---

## Appendix B: Example MCP Client Interaction

```python
# Example: Using Claude via Pacioli MCP server
import subprocess
import json

# Start Pacioli MCP server
proc = subprocess.Popen(
    ['java', '-jar', 'pacioli.jar', 'mcp', '-lib', './lib/'],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Initialize connection
init_request = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2024-11-05",
        "implementation": {"name": "pacioli", "version": "0.5.0"}
    }
}

proc.stdin.write(json.dumps(init_request) + '\n')
proc.stdin.flush()

# Read initialization response
response = json.loads(proc.stdout.readline())
print("Server capabilities:", response['result']['capabilities'])

# Call analyze_file tool
analyze_request = {
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
        "name": "analyze_file",
        "arguments": {
            "filepath": "mycode.pacioli",
            "libdir": "./lib/"
        }
    }
}

proc.stdin.write(json.dumps(analyze_request) + '\n')
proc.stdin.flush()

result = json.loads(proc.stdout.readline())
print("Analysis result:", result['result'])
```

---

**End of Plan**
