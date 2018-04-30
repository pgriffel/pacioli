package pacioli.visitors;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.List;
import java.util.Stack;

import mvm.values.matrix.IndexSet;
import mvm.values.matrix.MatrixDimension;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.PacioliType;
import pacioli.types.TypeIdentifier;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class ResolveVisitor extends IdentityVisitor implements Visitor {

	private Progam prog;
	
	private Deque<SymbolTable<IndexSetInfo>> indexSetTables = new ArrayDeque<SymbolTable<IndexSetInfo>>();
	private Deque<SymbolTable<UnitInfo>> unitTables = new ArrayDeque<SymbolTable<UnitInfo>>();
	private Deque<SymbolTable<SymbolInfo>> typeTables = new ArrayDeque<SymbolTable<SymbolInfo>>();
	private Deque<SymbolTable<ValueInfo>> valueTables = new ArrayDeque<SymbolTable<ValueInfo>>();
	
	private Stack<String> statementResult;

	public static final List<String> builtinTypes =
	            new ArrayList<String>(Arrays.asList("Tuple", "List", "Index", "Boole", "Void", "Ref", "String", "Report", "Identifier"));
	
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------

	public ResolveVisitor(Progam prog) {
		this.prog = prog;
		statementResult = new Stack<String>();
		indexSetTables.push(prog.indexSets);
		unitTables.push(prog.units);
		SymbolTable<SymbolInfo> typeTable = new SymbolTable<SymbolInfo>();
		SymbolTable<? extends SymbolInfo> it = prog.indexSets;
		SymbolTable<? extends SymbolInfo> ty = prog.types; 
		SymbolTable<? extends SymbolInfo> un = prog.units;
		typeTable.addAll((SymbolTable<SymbolInfo>) it);
		typeTable.addAll((SymbolTable<SymbolInfo>) ty);
		typeTable.addAll((SymbolTable<SymbolInfo>) un);
		typeTables.push(typeTable);		
		valueTables.push(prog.values);
	}

	// -------------------------------------------------------------------------
	// Visitors
	// -------------------------------------------------------------------------
		
	@Override
	public void visit(AliasDefinition node) {
		//returnNode(node.setUnit(node.unit.resolved(dictionary)));
		visitorThrow(node.getLocation(), "todo");
	}

	@Override
	public void visit(Declaration node) {
		node.typeNode.accept(this);
	}

	@Override
	public void visit(IndexSetDefinition node) {
		visitorThrow(node.getLocation(), "todo");
	}


	@Override
	public void visit(Toplevel node) {
		node.body.accept(this);
	}

	@Override
	public void visit(TypeDefinition typeDefinition) {
		//throw new RuntimeException("todo ");
		Pacioli.logln("NOT VISITING TYPE DEF %s", typeDefinition.getLocation().description());
	}

	@Override
	public void visit(UnitDefinition node) {
		if (node.body != null) {
			node.body.accept(this);
		}
	}

	@Override
	public void visit(UnitVectorDefinition node) {
		node.indexSetNode.accept(this);
		for (UnitDecl entry: node.items) {
            entry.value.accept(this);;
		}
	}

	@Override
	public void visit(ValueDefinition node) {
		node.body.accept(this);
	}
	
	public void visit(LambdaNode node) {
		
		// Create the node's symbol table
		node.table = new SymbolTable<ValueInfo>(valueTables.peek());
		
		// Create a symbol info record for each lambda parameter and store it in the table
		for (String arg: node.arguments) {
			ValueInfo info = new ValueInfo();
			info.generic = new GenericInfo(arg, prog.program.module.name, prog.file, false, false);
			node.table.put(arg, info);
		}
		
		// Push the symboltable on the stack and resolve the body
		valueTables.push(node.table);
		node.expression.accept(this);
		valueTables.pop();
	}
	
	
	@Override
	public void visit(IdentifierNode node) {
		
		// Lookup the info record
		ValueInfo info = valueTables.peek().lookup(node.name);
		
		// Check that it exists
		if (info == null) {
			visitorThrow(node.getLocation(), "Identifier '%s' unknown", node.name);
		}
		
		// Store the record in the identifier
		node.info = info;		
	}

	@Override
	public void visit(AssignmentNode node) {
		
		// Find the info. It should have been created in a statement node.
		ValueInfo info = valueTables.peek().lookup(node.var.getName());
		assert(info != null);
		
		// Store the info in the variable and resolve the value
		node.var.info = info;
		node.value.accept(this);
	}

	@Override
	public void visit(KeyNode node) {
		
		List<IndexSetInfo> infoList = new ArrayList<IndexSetInfo>();
    	for (String name: node.indexSets) {
    		IndexSetInfo info = indexSetTables.peek().lookup(name);
    		if (info != null) {
    			infoList.add(info);
            } else {
            	throw new RuntimeException(new PacioliException(node.getLocation(), "Index set '%s' unknown", name));
            }
    	}
    	
		node.info = infoList;		
	}

	private MatrixDimension compileTimeMatrixDimension(IndexType dimType) {
		if (dimType.isVar()) {
			return null;
		} else {
			List<IndexSet> sets = new ArrayList<IndexSet>();
			for (TypeIdentifier id : dimType.getIndexSets()) {
				IndexSetInfo indexSetInfo = indexSetTables.peek().lookup(id.name);
				assert(indexSetInfo != null); // exception throwen
				sets.add(indexSetInfo.definition.getIndexSet());
			}
		    return new MatrixDimension(sets);
		}
	}
	
	@Override
	public void visit(MatrixLiteralNode node) {
		
		// Resolve the matrix type
		node.typeNode.accept(this);
		
		// Evaluate the matrix type 
		MatrixType matrixType;
		try {
			PacioliType type = node.typeNode.evalType(false);
			if (type instanceof MatrixType) {
				matrixType = (MatrixType) type;
			} else {
				throw new PacioliException(node.typeNode.getLocation(), "Expected a matrix type");
			} 
		} catch (PacioliException e) {
			throw new RuntimeException(e);
		}
		
		// Store the matrix type's row and column dimension 
		node.rowDim = compileTimeMatrixDimension(matrixType.rowDimension);
		node.columnDim = compileTimeMatrixDimension(matrixType.columnDimension);	
		
		// Check that the dimensions exist
		if(node.rowDim == null || node.columnDim == null) {
			visitorThrow(node.typeNode.getLocation(), "Expected a closed matrix type");
		}
	}

	@Override
	public void visit(ReturnNode node) {
		if (statementResult.isEmpty()) {
    		throw new RuntimeException("No result place for return");
    	} else {
    		
    		String resultName = statementResult.peek();
    		assert(resultName != null);
    		
    		SymbolTable<ValueInfo> table = new SymbolTable<ValueInfo>(valueTables.peek());
    		ValueInfo info = table.lookup(resultName);
        	assert(info != null);
    		node.info = info;
    		//IdentifierNode result = IdentifierNode.newLocalMutableVar(resultName, node.getLocation());
    		//returnNode(node.resolve(expAccept(node.value), result));
    		node.value.accept(this);
    	}
	}

	@Override
	public void visit(StatementNode node) {
		
		// Create a symbol table for all assigned variables in scope and the result place
		node.table = new SymbolTable<ValueInfo>(valueTables.peek());
		
		// Find all assigned variables
		for (IdentifierNode id : node.body.locallyAssignedVariables()) {
            
			// Create a value info record for the variable
            ValueInfo info = new ValueInfo();
			info.generic = new GenericInfo(id.getName(), prog.program.module.name, prog.file, false, false);
			info.isRef = true;
            
			// Put the info in the symbol table
            node.table.put(id.getName(), info);
        }
        
		
        // Create an info record for the result and put it in the symbol table
        ValueInfo info = new ValueInfo();
        info.generic = new GenericInfo("result", prog.program.module.name, prog.file, false, false);
        node.table.put("result", info);
        
        // Create a place for the statement result and attach the info record
        info.resultPlace = IdentifierNode.newLocalMutableVar("result", node.getLocation());
        info.resultPlace.info = info;
        
        // Resolve the body
        statementResult.push("result");
        valueTables.push(node.table);
        node.body.accept(this);
        valueTables.pop();
        statementResult.pop();        
	}

	@Override
	public void visit(TupleAssignmentNode node) {
		// Fixme
		List<IdentifierNode> resolvedVars = new ArrayList<IdentifierNode>();
        for (IdentifierNode var: node.vars) {
            IdentifierNode resolved = IdentifierNode.newLocalMutableVar(var.getName(), var.getLocation());
            resolvedVars.add(resolved);
        }
        //ExpressionNode resolvedTuple = expAccept(node.tuple);
        node.tuple.accept(this);
        //returnNode(new TupleAssignmentNode(node.getLocation(), resolvedVars, resolvedTuple));
	}

	@Override
	public void visit(BangTypeNode node) {
		// todo: error reporting instead of asserts
		SymbolInfo indexSetInfo = typeTables.peek().lookup(node.indexSetName());
		assert(indexSetInfo != null);
		node.indexSet.info = indexSetInfo;
		
		if (node.unit != null) {
			String fullName = node.indexSetName() + "!" + node.unit.getName();
	        
			SymbolInfo unitInfo = typeTables.peek().lookup(fullName);
			assert(unitInfo != null);
			node.unit.info = unitInfo;
		}
	}

	@Override
	public void visit(SchemaNode node) {
		
		// Create the node's symbol table
		node.table = new SymbolTable<SymbolInfo>(typeTables.peek());
		
		// Add info records for all variables
		for (String arg: node.context.typeVars) {
			GenericInfo generic = new GenericInfo(arg, prog.program.module.name, prog.file, false, false);
			TypeInfo info = new TypeInfo();
			info.generic = generic;
			node.table.put(arg, info);
		}
		for (String arg: node.context.indexVars) {
			GenericInfo generic = new GenericInfo(arg, prog.program.module.name, prog.file, false, false);
			IndexSetInfo info = new IndexSetInfo();
			info.generic = generic;
			node.table.put(arg, info);
		}
		for (String arg: node.context.unitVars) {
			GenericInfo generic = new GenericInfo(arg, prog.program.module.name, prog.file, false, false);
			UnitInfo info = new UnitInfo();
			info.generic = generic;
			node.table.put(arg, info);
		}
		
		// Resolve the node's type
		typeTables.push(node.table);
		node.type.accept(this);
		typeTables.pop();
	}

	@Override
	public void visit(TypeIdentifierNode node) {

		// Find the node's name
		String name = node.getName();
		
		// Lookup the name in the symbol table stack and check it's existence
		SymbolInfo typeInfo = typeTables.peek().lookup(name);
		if (typeInfo == null) {
			visitorThrow(node.getLocation(), "Type identifier %s unknown", name);
		}
		
		// See what kind of info it is
		Boolean isType = typeInfo instanceof TypeInfo;
		Boolean isUnit = typeInfo instanceof UnitInfo;
		Boolean isIndexSet = typeInfo instanceof IndexSetInfo;
		
		// Check for ambiguities and store the info in the node
		if (isType) {
			if (isUnit || isIndexSet) {
				visitorThrow(node.getLocation(), "Type variable '" + name + "' ambiguous");				
			}
			node.info = typeInfo;
		} else if (isUnit) {
				if (isType || isIndexSet) {
					visitorThrow(node.getLocation(), "Type variable '" + name + "' ambiguous");				
				}
				node.info = typeInfo;
		} else if (isIndexSet) {
			if (isType || isUnit) {
				visitorThrow(node.getLocation(), "Type variable '" + name + "' ambiguous");				
			}
			node.info = typeInfo;
		} else {
			visitorThrow(node.getLocation(), "huh");
		}
	}

/*	@Override
	public void visit(TypePowerNode typePowerNode) throws PacioliException {
		// TODO Auto-generated method stub
		throw new RuntimeException("todo bangtype");
	}

	@Override
	public void visit(PrefixUnitTypeNode prefixUnitTypeNode) throws PacioliException {
		// TODO Auto-generated method stub
		throw new RuntimeException("todo bangtype");
	}

	@Override
	public void visit(TypeMultiplyNode typeMultiplyNode) throws PacioliException {
		// TODO Auto-generated method stub
		throw new RuntimeException("todo bangtype");
	}

	@Override
	public void visit(TypeDivideNode typeDivideNode) throws PacioliException {
		// TODO Auto-generated method stub
		throw new RuntimeException("todo bangtype");
	}

	@Override
	public void visit(TypeKroneckerNode typeKroneckerNode) throws PacioliException {
		// TODO Auto-generated method stub
		throw new RuntimeException("todo bangtype");
	}

	@Override
	public void visit(TypePerNode typePerNode) throws PacioliException {
		// TODO Auto-generated method stub
		throw new RuntimeException("todo bangtype");
	}*/
	
	@Override
	public void visit(UnitIdentifierNode node) {
		UnitInfo unitInfo = unitTables.peek().lookup(node.name);
		if (unitInfo == null) {
			throw new RuntimeException(new PacioliException(node.getLocation(), "unit %s unknown", node.name));
		}
		node.info = unitInfo;
	}
}
