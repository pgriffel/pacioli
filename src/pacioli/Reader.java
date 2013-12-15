/*
 * Copyright (c) 2013 Paul Griffioen
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

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.NumberTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypeOperationNode;
import pacioli.types.ast.TypePowerNode;
import pacioli.types.matrix.StringBase;
import org.codehaus.jparsec.OperatorTable;
import org.codehaus.jparsec.Parser;
import org.codehaus.jparsec.Parsers;
import org.codehaus.jparsec.Scanners;
import org.codehaus.jparsec.Terminals;
import org.codehaus.jparsec.Token;
import org.codehaus.jparsec.error.ParseErrorDetails;
import org.codehaus.jparsec.error.ParserException;
import org.codehaus.jparsec.functors.Map;
import org.codehaus.jparsec.functors.Map2;
import org.codehaus.jparsec.functors.Map3;
import org.codehaus.jparsec.functors.Map4;
import org.codehaus.jparsec.functors.Map5;
import org.codehaus.jparsec.functors.Pair;

import uom.Fraction;
import uom.NamedUnit;
import uom.Unit;

public class Reader {

    private static String source;

    public static Module loadModule(String fileName) throws PacioliException, IOException {
        source = Utils.readFile(fileName);
        try {
            Module module = moduleParser().parse(source);
            return module;
        } catch (ParserException ex) {

            // See if this is a chained exception. The reader uses this to 
            // throw Pacioli exceptions, because the map on Parsers does not
            // allow checked exceptions. The runtime ParserException carries
            // the Pacioli exception that is thrown here.
            if (ex.getCause() != null) {
                if (ex.getCause() instanceof PacioliException) {
                    throw (PacioliException) ex.getCause();
                } else {
                    // If we get here there is a bug in the reader
                    throw new PacioliException(ex);
                }
            }

            // A parser error should contain details. If not we throw
            // a PacioliException.
            ParseErrorDetails details = ex.getErrorDetails();
            if (details == null) {
                throw new PacioliException(ex);
            } else {
                int pos = details.getIndex();
                String message = String.format("Expected on of %s but found %s.", details.getExpected(), details.getEncountered());
                if (details.getUnexpected() != null) {
                    message += String.format(" Dit not expect %s.", details.getUnexpected());
                }
                if (details.getFailureMessage() != null) {
                    message += String.format(" (%s)", details.getFailureMessage());
                }
                throw new PacioliException(new Location(source, pos, pos), "%s", message);
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////
    // Tokens
    private static final String[] OPERATORS = {
        "+", "-", "*", "/", "%", "^T", "^R", "^D", "^", ".*", ".^", "./", "\\", ".\\", "/.",
        ">", "<", "=", ">=", "<=", "!=",
        ".", ",", ":", "::", "->",
        "(", ")", "[", "]", "{", "}",
        ";", "|", "<-", ":=", "!", "@",
        "<=>", "==>", "<=="
    };
    private static final String[] KEYWORDS = {
        "module", "define", "include", "declare", "defindex", "defunit", "defmatrix", "defconv", "defproj", "deftype", "defalias",
        "let", "in", "begin", "end", "if", "then", "else", "elseif", "lambda", "while", "return", "do",
        "for_type", "for_index", "for_unit",
        "per", "and", "or", "true", "false",};
    private static final Terminals TERMS = Terminals.caseSensitive(OPERATORS, KEYWORDS);
    private static final Parser<?> TOKENIZER = Parsers.or(
            TERMS.tokenizer(),
            Terminals.Identifier.TOKENIZER,
            Terminals.DecimalLiteral.TOKENIZER,
            Terminals.StringLiteral.DOUBLE_QUOTE_TOKENIZER);
    // Terminals
    private static final Parser<Void> IGNORED = Parsers.or(
            Scanners.lineComment("#"),
            Scanners.WHITESPACES);
    private static final Parser<ConstNode> NUMBER =
            Parsers.or(Terminals.DecimalLiteral.PARSER.token()
            .map(new Map<Token, ConstNode>() {
        public ConstNode map(Token arg) {
            String name = (String) arg.value();
            // use name length because argh.length seems to include whitespace
            return new ConstNode(name, new Location(source, arg.index(), arg.index() + name.length()));
        }
    }),
            TERMS.token("-").next(Terminals.DecimalLiteral.PARSER.token())
            .map(new Map<Token, ConstNode>() {
        public ConstNode map(Token arg) {
            String name = (String) arg.value();
            // use name length because argh.length seems to include whitespace
            return new ConstNode("-" + name, new Location(source, arg.index(), arg.index() + name.length()));
        }
    }));
    ////////////////////////////////////////////////////////////////////////////////
    // Some Terminals
    private static final Parser<ConstNode> BOOLEAN =
            Parsers.or(
            TERMS.token("true")
            .map(new Map<Token, ConstNode>() {
        public ConstNode map(Token arg) {
            return new ConstNode("true", new Location(source, arg.index(), arg.index() + arg.length()));
        }
    }),
            TERMS.token("false")
            .map(new Map<Token, ConstNode>() {
        public ConstNode map(Token arg) {
            return new ConstNode("false", new Location(source, arg.index(), arg.index() + arg.length()));
        }
    }));
    private static final Parser<IdentifierNode> IDENTIFIER =
    		Terminals.Identifier.PARSER.token()
    		.map(new Map<Token, IdentifierNode>() {
    			public IdentifierNode map(Token arg) {
    				String name = (String) arg.value();
    				// use name length because argh.length seems to include whitespace
    				return new IdentifierNode(name, new Location(source, arg.index(), arg.index() + name.length()));
    			}
    		});
    private static final Parser<IdentifierNode> NAME =
    		Parsers.or(IDENTIFIER,
    		Terminals.StringLiteral.PARSER.token()
    		.map(new Map<Token, IdentifierNode>() {
    			public IdentifierNode map(Token arg) {
    				String name = (String) arg.value();
    				// use name length because argh.length seems to include whitespace
    				return new IdentifierNode(name, new Location(source, arg.index(), arg.index() + name.length()));
    			}
    		}));
    private static final Parser<IdentifierNode> PATH =
    		IDENTIFIER.sepBy1(TERMS.token("/"))
    		.map(new Map<List<IdentifierNode>, IdentifierNode>() {
    			public IdentifierNode map(List<IdentifierNode> arg) {
    				List<String> names = new ArrayList<String>();
    				Location loc = new Location(); 
    				for (IdentifierNode id : arg) {
    					names.add(id.getName());
    					loc = loc.join(id.getLocation());
					}
    				return new IdentifierNode(Utils.intercalate("/", names), loc);
    			}
    		});
    private static final Parser<MatrixTypeNode> BANG =
    		Parsers.sequence(
    				TERMS.token("|"),
    				typeParserRec(),
    				TERMS.token("|"),
    				new Map3<Token, TypeNode, Token, MatrixTypeNode>() {
    					public MatrixTypeNode map(Token left, TypeNode typeNode, Token right) {
    						Location location = new Location(source, left.index(), right.index() + right.length());
    						return new MatrixTypeNode(location, typeNode);
    					}
    				});
    private static final Parser<KeyNode> KEY =
    		Parsers.tuple(
    				IDENTIFIER
    				.followedBy(TERMS.token("@")),
    				IDENTIFIER).sepBy1(TERMS.token("%"))
    				.map(new Map<List<Pair<IdentifierNode, IdentifierNode>>, KeyNode>() {
    					public KeyNode map(List<Pair<IdentifierNode, IdentifierNode>> keys) {

    						KeyNode keyNode = null;

    						for (Pair<IdentifierNode, IdentifierNode> pair : keys) {
    							KeyNode node = new KeyNode(pair.a.getName(), pair.b.getName(), pair.a.getLocation().join(pair.b.getLocation()));
    							if (keyNode == null) {
    								keyNode = node;
    							} else {
    								keyNode = keyNode.merge(node);
    							}
    						}

    						return keyNode;
    					}
    				});
    ////////////////////////////////////////////////////////////////////////////////
    // Module
    private static Parser<Module> moduleParser() {
        return Parsers.sequence(
                Parsers.sequence(TERMS.token("module"), PATH)
                .followedBy(TERMS.token(";")),
                TERMS.token("include")
                .next(PATH)
                .followedBy(TERMS.token(";")).many(),
                Parsers.or(
                declarationParser(),
                definitionParser(),
                functionDefinitionParser(),
                toplevelParser(),
                defIndexParser(),
                defunitVectorParser(),
                defunitParser(),
                defbaseunitParser(),
                defConversionParser(),
                defProjectionParser(),
                defTypeParser(),
                defAliasParser(),
                defMatrixParser()).many(),
                new Map3<IdentifierNode, List<IdentifierNode>, List<Callback<Module, Void>>, Module>() {
            public Module map(IdentifierNode name, List<IdentifierNode> includes, List<Callback<Module, Void>> actions) {
                Module module = new Module(name.getName());
                for (IdentifierNode include : includes) {
                    module.include(include.getName());
                }
                for (Callback action : actions) {
                    action.call(module);
                }
                return module;
            }
        }).from(TOKENIZER, IGNORED.skipMany());
    }

    private static Parser<Callback<Module, Void>> definitionParser() {
        return Parsers.sequence(
                TERMS.token("define")
                .next(IDENTIFIER),
                TERMS.token("=")
                .next(expressionParser())
                .followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, ExpressionNode, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final ExpressionNode body) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            module.define(id, body);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> toplevelParser() {
        return expressionParser()
                .followedBy(TERMS.token(";"))
                .map(new Map<ExpressionNode, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final ExpressionNode body) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        module.addExpression(body);
                        return null;
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> declarationParser() {
        return Parsers.sequence(
                TERMS.token("declare")
                .next(IDENTIFIER),
                TERMS.token("::")
                .next(typeParser())
                .followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, TypeNode, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final TypeNode node) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            module.declare(id, node);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defAliasParser() {
        return Parsers.sequence(
                TERMS.token("defalias").next(IDENTIFIER),
                TERMS.token("=").next(unitParser()).followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, Unit, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final Unit unit) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            module.addAliasDef(id, unit);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };

            }
        });
    }

    private static Parser<Callback<Module, Void>> defTypeParser() {
        Parser<TypeNode> typeParser = typeParserRec();
        return Parsers.sequence(
                TERMS.token("deftype").next(contextParser()),
                typeParser,
                TERMS.token("=").next(typeParser).followedBy(TERMS.token(";")),
                new Map3<TypeContext, TypeNode, TypeNode, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final TypeContext context, final TypeNode lhs, final TypeNode rhs) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            Location loc = lhs.getLocation().join(rhs.getLocation());
                            if (lhs instanceof TypeApplicationNode) {
                                module.addTypeDef(loc, context, (TypeApplicationNode) lhs, rhs);
                                return null;
                            } else {
                                throw new PacioliException(loc, "Left side of typedef is not a type function: %s", lhs.toText());
                            }
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> functionDefinitionParser() {
        return Parsers.sequence(
                TERMS.token("define"),
                IDENTIFIER,
                TERMS.token("(")
                .next(IDENTIFIER.sepBy(TERMS.token(",")))
                .followedBy(TERMS.token(")")),
                TERMS.token("=")
                .next(expressionParser())
                .followedBy(TERMS.token(";")),
                new Map4<Token, IdentifierNode, List<IdentifierNode>, ExpressionNode, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final Token define, final IdentifierNode id, final List<IdentifierNode> args, final ExpressionNode body) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            List<String> names = new ArrayList<String>();
                            for (IdentifierNode id : args) {
                                names.add(id.getName());
                            }
                            module.define(id, new LambdaNode(freshUnderscores(names), body, tokenLocation(define).join(body.getLocation())));
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defIndexParser() {
        return Parsers.sequence(
                TERMS.token("defindex")
                .next(IDENTIFIER),
                TERMS.token("=")
                .next(Parsers.between(TERMS.token("{"), NAME.sepBy(TERMS.token(",")), TERMS.token("}")))
                .followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, List<IdentifierNode>, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final List<IdentifierNode> items) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                    	List<String> names = new ArrayList<String>();
                    	for (IdentifierNode id: items) {
                    		names.add(id.getName());
                    	}
                        try {
                            module.addIndexDef(id, names);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defunitVectorParser() {
        return Parsers.sequence(
                TERMS.token("defunit")
                .next(IDENTIFIER),
                TERMS.token("!")
                .next(IDENTIFIER),
                TERMS.token("=")
                .next(Parsers.between(
                TERMS.token("{"),
                Parsers.tuple(Terminals.Identifier.PARSER.followedBy(TERMS.token(":")), unitParser()).sepBy(TERMS.token(",")),
                TERMS.token("}")))
                .followedBy(TERMS.token(";")),
                new Map3<IdentifierNode, IdentifierNode, List<Pair<String, Unit>>, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode indexId, final IdentifierNode id, final List<Pair<String, Unit>> items) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            java.util.Map<String, Unit> unitVector = new HashMap<String, Unit>();
                            for (Pair<String, Unit> pair : items) {
                                unitVector.put(pair.a, pair.b);
                            }
                            module.addUnitVectorDef(indexId, id, unitVector);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defbaseunitParser() {
        return Parsers.sequence(
                TERMS.token("defunit").next(IDENTIFIER),
                Terminals.StringLiteral.PARSER
                .followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, String, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final String symbol) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            module.addUnit(id, new NamedUnit(symbol));
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defunitParser() {
        return Parsers.sequence(
                TERMS.token("defunit").next(IDENTIFIER),
                Terminals.StringLiteral.PARSER,
                TERMS.token("=").next(unitParser()).followedBy(TERMS.token(";")),
                new Map3<IdentifierNode, String, Unit, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final String symbol, final Unit unit) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            module.addUnit(id, new NamedUnit(symbol, unit));
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defMatrixParser() {
        return Parsers.sequence(
                TERMS.token("defmatrix")
                .next(IDENTIFIER),
                TERMS.token("::")
                .next(typeParser()),
                TERMS.token("=")
                .next(Parsers.between(
                TERMS.token("{"),
                Parsers.tuple(NAME.sepBy1(TERMS.token(",")).followedBy(TERMS.token("->")), NUMBER).sepBy(TERMS.token(",")),
                TERMS.token("}")))
                .followedBy(TERMS.token(";")),
                new Map3<IdentifierNode, TypeNode, List<Pair<List<IdentifierNode>, ConstNode>>, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final TypeNode typeNode, final List<Pair<List<IdentifierNode>, ConstNode>> pairs) {
                return new Callback<Module, Void>() {
                	public Void call(Module module) {
                		List<Pair<List<String>, ConstNode>> stringPairs = new ArrayList<Pair<List<String>,ConstNode>>();
                    	
                    	for (Pair<List<IdentifierNode>, ConstNode> pair: pairs) {
                    		List<String> names = new ArrayList<String>();
                    		for (IdentifierNode id: pair.a) {
                    			names.add(id.getName());
                    		}
                    		stringPairs.add(new Pair<List<String>, ConstNode>(names, pair.b));
                    	}
                        	
                        try {
                            module.addMatrixDef(id.getLocation().join(typeNode.getLocation()), id, typeNode, stringPairs);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defConversionParser() {
        return Parsers.sequence(
                TERMS.token("defconv")
                .next(IDENTIFIER),
                TERMS.token("::")
                .next(typeParser())
                .followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, TypeNode, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final TypeNode node) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            module.addConvDef(id, node);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }

    private static Parser<Callback<Module, Void>> defProjectionParser() {
        return Parsers.sequence(
                TERMS.token("defproj")
                .next(IDENTIFIER),
                TERMS.token("::")
                .next(typeParser())
                .followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, TypeNode, Callback<Module, Void>>() {
            public Callback<Module, Void> map(final IdentifierNode id, final TypeNode node) {
                return new Callback<Module, Void>() {
                    public Void call(Module module) {
                        try {
                            module.addProjDef(id, node);
                            return null;
                        } catch (PacioliException ex) {
                            throw new ParserException(ex, null, null, null);
                        }
                    }
                };
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////
    // Units
    private static Parser<Unit> unitParser() {
        return Parsers.or(
                UNITNUMBER,
                unitPower(),
                unitScaled(),
                unitNamed())
                .sepBy1(TERMS.token("*"))
                .sepBy1(TERMS.token("/"))
                .map(new org.codehaus.jparsec.functors.Map<List<List<Unit>>, Unit>() {
            public Unit map(List<List<Unit>> termss) {
                Unit unit = Unit.ONE;
                boolean first = true;
                for (List<Unit> terms : termss) {
                    Unit tmp = Unit.ONE;
                    for (Unit term : terms) {
                        tmp = tmp.multiply(term);
                    }
                    if (first) {
                        unit = unit.multiply(tmp);
                    } else {
                        unit = unit.multiply(tmp.reciprocal());
                    }
                    first = false;
                }
                return unit;
            }
        });
    }
    private static final Parser<Unit> UNITNUMBER =
            Terminals.DecimalLiteral.PARSER
            .map(new org.codehaus.jparsec.functors.Map<String, Unit>() {
        public Unit map(String num) {
            return Unit.ONE.multiply(new BigDecimal(num));
        }
    });

    public static Parser<Integer> signedInteger() {
        return Parsers.or(
                Terminals.DecimalLiteral.PARSER
                .map(new org.codehaus.jparsec.functors.Map<String, Integer>() {
            public Integer map(String power) {
                return Integer.parseInt(power);
            }
        }),
                TERMS.token("-")
                .next(Terminals.DecimalLiteral.PARSER)
                .map(new org.codehaus.jparsec.functors.Map<String, Integer>() {
            public Integer map(String power) {
                Integer i = Integer.parseInt(power);
                return -i;
            }
        }));
    }

    private static Parser<Unit> unitPower() {
        return Parsers.sequence(
                Parsers.or(
                UNITNUMBER,
                unitScaled(),
                unitNamed()),
                TERMS.token("^")
                .next(signedInteger()),
                new org.codehaus.jparsec.functors.Map2<Unit, Integer, Unit>() {
            public Unit map(Unit unit, Integer power) {
                return unit.raise(new Fraction(power));
            }
        });
    }

    private static Parser<Unit> unitNamed() {
        return Terminals.Identifier.PARSER
                .map(new org.codehaus.jparsec.functors.Map<String, Unit>() {
            public Unit map(String name) {
                return new StringBase(name);
            }
        });
    }
    
    private static Parser<Unit> unitScaled() {
        return Parsers.sequence(
        		Terminals.Identifier.PARSER.followedBy(TERMS.token(":")),
        		Terminals.Identifier.PARSER,
                new Map2<String, String, Unit>() {
            public Unit map(final String prefix, final String name) {
                // todo: better location info
            	return new StringBase(prefix, name);
            }
        });
    }

    
    ////////////////////////////////////////////////////////////////////////////////
    // Types
    private static Parser<TypeNode> typeParser() {
        return typeParserRec();
    }

    private static Parser<TypeNode> typeParserRec() {
        Parser.Reference<TypeNode> reference = Parser.newReference();
        Parser<TypeNode> termParser = termParser();
        Parser<TypeNode> lazyExpr = reference.lazy();
        Parser<TypeNode> parser = Parsers.or(
                typeSchemeParser(lazyExpr),
                functionTypeParser(lazyExpr),
                simpleFunctionTypeParser(lazyExpr),
                parametricTypeParser(lazyExpr),
                matrixTypeParser(Parsers.or(parametricTypeParser(lazyExpr), termParser)),
                matrixTermIdentifier());
        reference.set(parser);
        return parser;
    }

    private static Parser<TypeContext> contextParser() {
        return Parsers.or(forTypeParser(), forIndexParser(), forUnitParser()).endBy1(TERMS.token(":"))
                .map(new Map<List<TypeContext>, TypeContext>() {
            public TypeContext map(List<TypeContext> contexts) {
                TypeContext total = new TypeContext();
                for (TypeContext context : contexts) {
                    total.addAll(context);
                }
                return total;
            }
        });
    }

    private static Parser<TypeContext> forTypeParser() {
        return TERMS.token("for_type").next(IDENTIFIER.sepBy(TERMS.token(",")))
                .map(new Map<List<IdentifierNode>, TypeContext>() {
            public TypeContext map(List<IdentifierNode> ids) {
                TypeContext context = new TypeContext();
                for (IdentifierNode id : ids) {
                    context.addTypeVar(id.getName());
                }
                return context;
            }
        });
    }

    private static Parser<TypeContext> forIndexParser() {
        return TERMS.token("for_index").next(IDENTIFIER.sepBy(TERMS.token(",")))
                .map(new Map<List<IdentifierNode>, TypeContext>() {
            public TypeContext map(List<IdentifierNode> ids) {
                TypeContext context = new TypeContext();
                for (IdentifierNode id : ids) {
                    context.addIndexVar(id.getName());
                }
                return context;
            }
        });
    }

    private static Parser<TypeContext> forUnitParser() {
        return TERMS.token("for_unit").next(IDENTIFIER.sepBy(TERMS.token(",")))
                .map(new Map<List<IdentifierNode>, TypeContext>() {
            public TypeContext map(List<IdentifierNode> ids) {
                TypeContext context = new TypeContext();
                for (IdentifierNode id : ids) {
                    context.addUnitVar(id.getName());
                }
                return context;
            }
        });
    }

    private static Parser<TypeNode> typeSchemeParser(Parser<TypeNode> typeParser) {
        return Parsers.sequence(
                contextParser(),
                typeParser,
                new Map2<TypeContext, TypeNode, TypeNode>() {
            public TypeNode map(final TypeContext vars, final TypeNode type) {
                // todo: better location info
                return new SchemaNode(type.getLocation(), vars, type);
            }
        });
    }

    private static Parser<TypeNode> functionTypeParser(Parser<TypeNode> typeParser) {
        return Parsers.sequence(
                TERMS.token("("),
                typeParser.sepBy(TERMS.token(",")).followedBy(TERMS.token(")")),
                TERMS.token("->").next(typeParser),
                new Map3<Token, List<TypeNode>, TypeNode, TypeNode>() {
            public TypeNode map(final Token paren, final List<TypeNode> functionArgs, final TypeNode type) {
                // todo: better location info
                TypeNode domain = new TypeApplicationNode(tokenLocation(paren), "Tuple", functionArgs);
                return new FunctionTypeNode(tokenLocation(paren), domain, type);
            }
        });
    }

    private static Parser<TypeNode> simpleFunctionTypeParser(Parser<TypeNode> typeParser) {
        return Parsers.sequence(
                IDENTIFIER,
                TERMS.token("->").next(typeParser),
                new Map2<IdentifierNode, TypeNode, TypeNode>() {
            public TypeNode map(final IdentifierNode id, final TypeNode type) {
                // todo: better location info
                TypeNode domain = new TypeIdentifierNode(id.getLocation(), id.getName());
                return new FunctionTypeNode(id.getLocation(), domain, type);
            }
        });
    }

    private static Parser<TypeNode> parametricTypeParser(Parser<TypeNode> typeParser) {
        return Parsers.sequence(
                IDENTIFIER,
                TERMS.token("(").next(typeParser.sepBy(TERMS.token(","))),
                TERMS.token(")"),
                new Map3<IdentifierNode, List<TypeNode>, Token, TypeNode>() {
            public TypeNode map(final IdentifierNode id, final List<TypeNode> args, Token paren) {
                Location loc = id.getLocation().join(tokenLocation(paren));
                return new TypeApplicationNode(loc, id.getName(), args);
            }
        });
    }

    private static Parser<TypeNode> matrixTypeParser(Parser<TypeNode> typeParser) {
        return matrixExprTypeParser(typeParser);
    }

    private static Parser<TypeNode> matrixExprTypeParser(Parser<TypeNode> typeParser) {
        Parser<TypeNode> termParser = typeParser;
        return Parsers.or(
                Parsers.sequence(
                matrixDimensionParser(termParser),
                TERMS.token("per")
                .next(matrixDimensionParser(termParser)),
                new Map2<TypeNode, TypeNode, TypeNode>() {
            public TypeNode map(final TypeNode row, final TypeNode column) {
                Location location = row.getLocation().join(column.getLocation());
                return new TypeOperationNode(location, "per", row, column);
            }
        }),
                matrixDimensionParser(termParser));
    }

    private static Parser<TypeNode> matrixDimensionParser(Parser<TypeNode> termParser) {
        Parser<TypeNode> parser = new OperatorTable<TypeNode>()
                .infixl(TERMS.token("*").next(matrixOperatorParser("multiply")), 20)
                .infixl(TERMS.token("/").next(matrixOperatorParser("divide")), 20)
                .infixl(TERMS.token("%").next(matrixOperatorParser("kronecker")), 10)
                .build(termParser);
        return parser;
    }

    private static Parser<? extends Map2<TypeNode, TypeNode, TypeNode>> matrixOperatorParser(final String name) {
        return Parsers.constant(new Map2<TypeNode, TypeNode, TypeNode>() {
            public TypeNode map(final TypeNode left, final TypeNode right) {
                assert(left.getLocation() != null);
                assert(right.getLocation() != null);
                Location location = left.getLocation().join(right.getLocation());
                return new TypeOperationNode(location, name, left, right);
            }
        });
    }

    private static Parser<TypeNode> termParser() {
        return Parsers.or(powerTermParser(), trueTermParser());
    }

    private static Parser<TypeNode> powerTermParser() {
        return Parsers.sequence(
                trueTermParser(),
                TERMS.token("^").next(signedInteger()),
                new Map2<TypeNode, Integer, TypeNode>() {
            public TypeNode map(final TypeNode term, final Integer power) {
                return new TypePowerNode(term.getLocation(), term, power);
            }
        });
    }

    private static Parser<TypeNode> trueTermParser() {
        return Parsers.or(matrixTermBang(), matrixTermIdentifier(), matrixTermNumber());
    }

    private static Parser<TypeNode> matrixTermBang() {
        return Parsers.or(
                Parsers.sequence(
                IDENTIFIER
                .followedBy(TERMS.token("!")),
                IDENTIFIER,
                new Map2<IdentifierNode, IdentifierNode, TypeNode>() {
            public TypeNode map(final IdentifierNode indexSet, final IdentifierNode unit) {
                return new BangTypeNode(indexSet.getLocation().join(unit.getLocation()), indexSet.getName(), unit.getName());
            }
        }),
                Parsers.sequence(
                IDENTIFIER,
                TERMS.token("!"),
                new Map2<IdentifierNode, Token, TypeNode>() {
            public TypeNode map(final IdentifierNode indexSet, Token mark) {
                return new BangTypeNode(indexSet.getLocation(), indexSet.getName());
            }
        }));
    }

    private static Parser<TypeNode> matrixTermIdentifier() {
        return IDENTIFIER.map(new Map<IdentifierNode, TypeNode>() {
            public TypeNode map(final IdentifierNode id) {
                return new TypeIdentifierNode(id.getLocation(), id.getName());
            }
        });
    }

    private static Parser<TypeNode> matrixTermNumber() {
        return NUMBER.map(new Map<ConstNode, TypeNode>() {
            public TypeNode map(final ConstNode num) {
                return new NumberTypeNode(num.valueString(), num.getLocation());
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Statements
    private static Parser<ExpressionNode> statementParser(Parser<ExpressionNode> expParser) {
        Parser.Reference<ExpressionNode> reference = Parser.newReference();
        Parser<ExpressionNode> lazyExpr = reference.lazy();
        final String result = "result";
        Parser<ExpressionNode> nestedParser = statementSequenceParser(lazyExpr, expParser, result, false);
        Parser<ExpressionNode> parser = Parsers.sequence(
                TERMS.token("begin"),
                statementSequenceParser(lazyExpr, expParser, result, true),
                TERMS.token("end"),
                new Map3<Token, ExpressionNode, Token, ExpressionNode>() {
            public ExpressionNode map(Token begin, ExpressionNode body, Token end) {
                return body;
            }
        });
        reference.set(nestedParser);
        return parser;
    }

    private static Parser<ExpressionNode> statementSequenceParser(Parser<ExpressionNode> statementParser, Parser<ExpressionNode> expParser, final String result, final boolean top) {
        return Parsers.or(
                assignmentStatementParser(expParser),
                tupleAssignmentParser(expParser),
                ifStatementParser(statementParser, expParser),
                whileStatementParser(statementParser, expParser),
                returnStatementParser(expParser, result),
                applicationParser(expParser))
                .many()
                .map(new Map<List<ExpressionNode>, ExpressionNode>() {
            public ExpressionNode map(List<ExpressionNode> body) {
                assert (0 < body.size());
                // todo fix this mess!
                if (false && !top) {
                    return body.get(0);
                } else {
                    Location loc = body.get(0).getLocation().join(body.get(body.size() - 1).getLocation());
                    return new SequenceNode(loc, body, new IdentifierNode(result, loc), top);
                }
            }
        });
    }

    private static Parser<ExpressionNode> assignmentStatementParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                IDENTIFIER,
                TERMS.token(":=").next(expParser).followedBy(TERMS.token(";")),
                new Map2<IdentifierNode, ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(IdentifierNode id, ExpressionNode value) {
                Location loc = id.getLocation().join(value.getLocation());
                return new AssignmentNode(loc, id, value);
            }
        });
    }

    private static Parser<ExpressionNode> tupleAssignmentParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                TERMS.token("("),
                IDENTIFIER.sepBy(TERMS.token(","))
                .followedBy(TERMS.token(")"))
                .followedBy(TERMS.token(":=")),
                expParser.followedBy(TERMS.token(";")),
                new Map3<Token, List<IdentifierNode>, ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(final Token paren, List<IdentifierNode> vars, final ExpressionNode value) {
                Location loc = tokenLocation(paren).join(value.getLocation());
                return new TupleAssignmentNode(loc, vars, value);
            }
        });
    }

    private static Parser<ExpressionNode> returnStatementParser(Parser<ExpressionNode> expParser, final String result) {
        return Parsers.sequence(
                TERMS.token("return"),
                expParser.optional().followedBy(TERMS.token(";")),
                new Map2<Token, ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(Token start, ExpressionNode value) {
                if (value == null) {
                	Location loc = tokenLocation(start);
                	return new ReturnNode(loc, new IdentifierNode(result, loc), new IdentifierNode("nothing", loc));
                } else {
                	Location loc = tokenLocation(start).join(value.getLocation());
                	return new ReturnNode(loc, new IdentifierNode(result, loc), value);
                }
            }
        });
    }

    private static Parser<ExpressionNode> whileStatementParser(Parser<ExpressionNode> statementParser, Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                TERMS.token("while"),
                expParser,
                TERMS.token("do").next(statementParser),
                TERMS.token("end"),
                new Map4<Token, ExpressionNode, ExpressionNode, Token, ExpressionNode>() {
            public ExpressionNode map(Token start, ExpressionNode test, ExpressionNode body, Token end) {
                Location loc = tokenLocation(start).join(tokenLocation(end));
                return new WhileNode(loc, test, body);
            }
        });
    }
    
    private static Parser<ExpressionNode> ifStatementParser(
    		Parser<ExpressionNode> statementParser, 
    		Parser<ExpressionNode> expParser) {
    	return Parsers.sequence(
                TERMS.token("if").next(expParser),
                TERMS.token("then").next(statementParser),
                ifRestParser(statementParser, expParser),
                new Map3<ExpressionNode, ExpressionNode, List<Pair<ExpressionNode, ExpressionNode>>, ExpressionNode>() {
            public ExpressionNode map(ExpressionNode test, ExpressionNode body, List<Pair<ExpressionNode, ExpressionNode>> rest) {
            	ExpressionNode statement;
            	statement = new ApplicationNode(new IdentifierNode("skip", test.getLocation()), new ArrayList<ExpressionNode>(), test.getLocation());
            	for (int i = rest.size() - 1; 0 <= i; i--) {
                    Pair<ExpressionNode, ExpressionNode> pair = rest.get(i);
                    statement = new IfStatementNode(pair.a.getLocation().join(pair.b.getLocation()), pair.a, pair.b, statement);
                }
                return new IfStatementNode(test.getLocation().join(body.getLocation()), test, body, statement);
            }
        });
    }
    
    
    private static Parser<List<Pair<ExpressionNode, ExpressionNode>>> ifRestParser(
    		Parser<ExpressionNode> statementParser, 
    		Parser<ExpressionNode> expParser) {
    	
    	Parser.Reference<List<Pair<ExpressionNode, ExpressionNode>>> reference = Parser.newReference();
        
        Parser<List<Pair<ExpressionNode, ExpressionNode>>> parser = Parsers.or(
        		ifRestEndParser(statementParser, expParser),
        		ifRestRestParser(statementParser, expParser, reference.lazy()));
        
        reference.set(parser);
        
        return parser;
    }
    
    private static Parser<List<Pair<ExpressionNode, ExpressionNode>>> ifRestEndParser(
    		Parser<ExpressionNode> statementParser, 
    		Parser<ExpressionNode> expParser) {
    	List<Pair<ExpressionNode, ExpressionNode>> empty = new ArrayList<Pair<ExpressionNode, ExpressionNode>>(); 
        	return TERMS.token("end").retn(empty);
    }
    
    private static Parser<List<Pair<ExpressionNode, ExpressionNode>>> ifRestRestParser(
    		Parser<ExpressionNode> statementParser, 
    		Parser<ExpressionNode> expParser,
    		Parser<List<Pair<ExpressionNode, ExpressionNode>>> restParser) {
        return TERMS.token("else").next(elseRestParser(statementParser, expParser, restParser));
    }
    
    private static Parser<List<Pair<ExpressionNode, ExpressionNode>>> elseRestParser(
    		Parser<ExpressionNode> statementParser, 
    		Parser<ExpressionNode> expParser,
    		Parser<List<Pair<ExpressionNode, ExpressionNode>>> restParser) {
    	return Parsers.or(
    			elseRestIfParser(statementParser, expParser, restParser),
    			elseRestIflessParser(statementParser, expParser, restParser));
    }
    
    private static Parser<List<Pair<ExpressionNode, ExpressionNode>>> elseRestIfParser(
    		Parser<ExpressionNode> statementParser, 
    		Parser<ExpressionNode> expParser,
    		Parser<List<Pair<ExpressionNode, ExpressionNode>>> restParser) {
    	return Parsers.sequence(
                TERMS.token("if").next(expParser),
                TERMS.token("then").next(statementParser),
                restParser,
                new Map3<ExpressionNode, ExpressionNode, List<Pair<ExpressionNode, ExpressionNode>>, List<Pair<ExpressionNode, ExpressionNode>>>() {
            public List<Pair<ExpressionNode, ExpressionNode>> map(ExpressionNode test, ExpressionNode body, List<Pair<ExpressionNode, ExpressionNode>> rest) {
            	List<Pair<ExpressionNode, ExpressionNode>> list = new ArrayList<Pair<ExpressionNode,ExpressionNode>>(rest); 
            	list.add(new Pair<ExpressionNode, ExpressionNode>(test, body));
            	return list;
            }
        });
    }
    
    private static Parser<List<Pair<ExpressionNode, ExpressionNode>>> elseRestIflessParser(
    		Parser<ExpressionNode> statementParser, 
    		Parser<ExpressionNode> expParser,
    		Parser<List<Pair<ExpressionNode, ExpressionNode>>> restParser) {
    	return statementParser.followedBy(TERMS.token("end")).map(new Map<ExpressionNode, List<Pair<ExpressionNode, ExpressionNode>>>() {
			public List<Pair<ExpressionNode, ExpressionNode>> map(ExpressionNode body) {
				return Arrays.asList(new Pair<ExpressionNode, ExpressionNode>(new ConstNode("true", body.getLocation()), body)); 
			}
		});
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Expressions
    private static Parser<ExpressionNode> expressionParser() {
        Parser.Reference<ExpressionNode> reference = Parser.newReference();
        Parser<ExpressionNode> lazyExpr = reference.lazy();
        Parser<ExpressionNode> parser = Parsers.or(
                arithmeticParser(nonArithmeticParser(lazyExpr)),
                nonArithmeticParser(lazyExpr));
        reference.set(parser);
        return parser;
    }

    private static Parser<ExpressionNode> parenthesisParser(Parser<ExpressionNode> expParser) {
        return Parsers.between(TERMS.token("("),
                expParser,
                TERMS.token(")"))
                .map(
                new Map<ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(ExpressionNode val) {
                return val;
            }
        });
    }

    private static Parser<ExpressionNode> applicationParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                IDENTIFIER,
                TERMS.token("("),
                expParser.sepBy(TERMS.token(",")),
                TERMS.token(")"),
                new Map4<ExpressionNode, Token, List<ExpressionNode>, Token, ExpressionNode>() {
            public ExpressionNode map(ExpressionNode fun, Token left, List<ExpressionNode> args, Token right) {
                return new ApplicationNode(fun, args, fun.getLocation().join(tokenLocation(right)));
            }
        });
    }

    private static Parser<ExpressionNode> lambdaParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                TERMS.token("lambda"),
                Parsers.between(TERMS.token("("), IDENTIFIER.sepBy(TERMS.token(",")), TERMS.token(")")),
                expParser,
                TERMS.token("end"),
                new Map4<Token, List<IdentifierNode>, ExpressionNode, Token, ExpressionNode>() {
            public ExpressionNode map(Token lambda, List<IdentifierNode> vars, ExpressionNode body, Token end) {
                List<String> names = new ArrayList<String>();
                for (IdentifierNode id : vars) {
                    names.add(id.getName());
                }
                return new LambdaNode(freshUnderscores(names), body, tokenLocation(lambda).join(tokenLocation(end)));
            }
        });
    }

    private static Parser<ExpressionNode> ifParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                TERMS.token("if"),
                expParser.followedBy(TERMS.token("then")),
                expParser.followedBy(TERMS.token("else")),
                expParser,
                TERMS.token("end"),
                new Map5<Token, ExpressionNode, ExpressionNode, ExpressionNode, Token, ExpressionNode>() {
            public ExpressionNode map(Token begin, ExpressionNode test, ExpressionNode pos, ExpressionNode neg, Token end) {
                return new BranchNode(test, pos, neg, tokenLocation(begin).join(tokenLocation(end)));
            }
        });
    }

    private static Parser<ExpressionNode> nonArithmeticParser(Parser<ExpressionNode> expParser) {
        Parser<ExpressionNode> parser = Parsers.or(
                BOOLEAN,
                applicationParser(expParser),
                listParser(expParser),
                statementParser(expParser),
                letParser(expParser),
                ifParser(expParser),
                lambdaParser(expParser),
                BANG,
                KEY,
                parenthesisParser(expParser),
                comprehensionParser(expParser),
                foldComprehensionParser(expParser),
                NUMBER,
                IDENTIFIER);
        return parser;
    }

    private static Parser<ExpressionNode> arithmeticParser(Parser<ExpressionNode> termParser) {
        Parser<ExpressionNode> parser = new OperatorTable<ExpressionNode>()
        		.infixl(TERMS.token(".^").next(binaryOperatorParser("power")), 100)
                .infixl(TERMS.token("^").next(binaryOperatorParser("expt")), 100)
                .infixl(TERMS.token("per").next(binaryOperatorParser("dim_div")), 60)
                .infixl(TERMS.token(".").next(binaryOperatorParser("scale")), 50)
                .infixl(TERMS.token("/.").next(binaryOperatorParser("scale_down")), 50)
                .infixl(TERMS.token("*").next(binaryOperatorParser("multiply")), 50)
                .infixl(TERMS.token("/").next(binaryOperatorParser("divide")), 50)
                .infixl(TERMS.token("\\").next(binaryOperatorParser("left_divide")), 50)
                .infixl(TERMS.token(".*").next(binaryOperatorParser("dot")), 50)
                .infixl(TERMS.token("./").next(binaryOperatorParser("right_division")), 50)
                .infixl(TERMS.token(".\\").next(binaryOperatorParser("left_division")), 50)
                .infixl(TERMS.token("+").next(binaryOperatorParser("sum")), 40)
                .infixl(TERMS.token("-").next(binaryOperatorParser("minus")), 40)
                .infixl(TERMS.token("<").next(binaryOperatorParser("less")), 30)
                .infixl(TERMS.token("<=").next(binaryOperatorParser("less_eq")), 30)
                .infixl(TERMS.token(">").next(binaryOperatorParser("greater")), 30)
                .infixl(TERMS.token(">=").next(binaryOperatorParser("greater_eq")), 30)
                .infixn(TERMS.token("=").next(binaryOperatorParser("equal")), 30)
                .infixn(TERMS.token("!=").next(binaryOperatorParser("not_equal")), 30)
                .infixl(TERMS.token("and").next(binaryOperatorParser("and")), 20)
                .infixl(TERMS.token("or").next(binaryOperatorParser("or")), 20)
                .infixl(TERMS.token("<=>").next(binaryOperatorParser("equal")), 10)
                .infixl(TERMS.token("==>").next(binaryOperatorParser("implies")), 10)
                .infixl(TERMS.token("<==").next(binaryOperatorParser("follows_from")), 10)
                .prefix(TERMS.token("-").next(unaryOperatorParser("negative")), 90)
                .postfix(TERMS.token("^D").next(unaryOperatorParser("dim_inv")), 100)
                .postfix(TERMS.token("^T").next(unaryOperatorParser("transpose")), 100)
                .postfix(TERMS.token("^R").next(unaryOperatorParser("reciprocal")), 100)
                .build(termParser);
        return parser;
    }

    private static Parser<? extends Map2<ExpressionNode, ExpressionNode, ExpressionNode>> binaryOperatorParser(final String name) {
        return Parsers.constant(new Map2<ExpressionNode, ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(ExpressionNode o1, ExpressionNode o2) {
                Location loc = o1.getLocation().join(o2.getLocation());
                if (name.equals("and")) {
                    return new BranchNode(o1, o2, new ConstNode("false", loc), loc);
                } else if (name.equals("or")) {
                    return new BranchNode(o1, new ConstNode("true", loc), o2, loc);
                } else if (name.equals("implies")) {
                    return new BranchNode(o1, o2, new ConstNode("true", loc), loc);
                } else if (name.equals("follows_from")) {
                    return new BranchNode(o2, o1, new ConstNode("true", loc), loc);
                } else {
                    List<ExpressionNode> args = new ArrayList<ExpressionNode>();
                    args.add(o1);
                    args.add(o2);
                    return new ApplicationNode(new IdentifierNode(name, loc), args, loc);
                }
            }
        });
    }

    private static Parser<? extends Map<ExpressionNode, ExpressionNode>> unaryOperatorParser(final String name) {
        return Parsers.constant(new Map<ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(ExpressionNode o2) {
                List<ExpressionNode> args = new ArrayList<ExpressionNode>();
                args.add(o2);
                // How to do location info?
                return new ApplicationNode(new IdentifierNode(name, o2.getLocation()), args, o2.getLocation());
            }
        });
    }

    private static Parser<ExpressionNode> listParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                TERMS.token("["),
                expParser.sepBy(TERMS.token(",")),
                TERMS.token("]"),
                new Map3<Token, List<ExpressionNode>, Token, ExpressionNode>() {
            public ExpressionNode map(Token left, List<ExpressionNode> arg, Token right) {
                // Todo: more refined location info?!
                Location loc = tokenLocation(left).join(tokenLocation(right));
                ExpressionNode list = new ApplicationNode(new IdentifierNode("empty_list", loc), new ArrayList<ExpressionNode>(), loc);
                for (ExpressionNode item : arg) {
                    List<ExpressionNode> tup = new ArrayList<ExpressionNode>();
                    tup.add(list);
                    tup.add(item);
                    list = new ApplicationNode(new IdentifierNode("add_mut", loc), tup, loc);
                }
                return list;
            }
        });
    }

    private static Parser<ExpressionNode> comprehensionParser(final Parser<ExpressionNode> expParser) {
        final String accuName = "accu";
        return Parsers.sequence(
                TERMS.token("["),
                expParser.followedBy(TERMS.token("|")),
                Parsers.or(generatorParser(expParser, "accu"),
                assignmentParser(expParser, "accu"),
                tupleGeneratorParser(expParser, "accu"),
                filterParser(expParser, "list", accuName)).sepBy1(TERMS.token(",")),
                TERMS.token("]"),
                new Map4<Token, ExpressionNode, List<Map<ExpressionNode, ExpressionNode>>, Token, ExpressionNode>() {
            public ExpressionNode map(Token left, ExpressionNode head, List<Map<ExpressionNode, ExpressionNode>> clauses, Token right) {

                Location loc = tokenLocation(left).join(tokenLocation(right));

                ExpressionNode addMut = new IdentifierNode("add_mut", loc);
                ExpressionNode accu = new IdentifierNode(accuName, loc);
                ExpressionNode body = new ApplicationNode(addMut, Arrays.asList(accu, head), loc);
                for (int i = clauses.size() - 1; 0 <= i; i--) {
                    body = clauses.get(i).map(body);
                }

                ExpressionNode lambda = new LambdaNode(Arrays.asList(accuName), body, loc);
                ExpressionNode emptyListId = new IdentifierNode("empty_list", loc);
                ExpressionNode emptyList = new ApplicationNode(emptyListId, new ArrayList<ExpressionNode>(), loc);

                return new ApplicationNode(lambda, Arrays.asList(emptyList), loc);
            }
        });
    }

    private static Parser<ExpressionNode> foldComprehensionParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                IDENTIFIER,
                comprehensionParser(expParser),
                new Map2<IdentifierNode, ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(IdentifierNode op, ExpressionNode body) {
                Location loc = body.getLocation();
                if (op.getName().equals("sum")) {
                    return new ApplicationNode((ExpressionNode) new IdentifierNode("list_sum", loc), Arrays.asList(body), loc);
                } else if (op.getName().equals("count")) {
                    return new ApplicationNode((ExpressionNode) new IdentifierNode("list_size", loc), Arrays.asList(body), loc);
                } else if (op.getName().equals("all")) {
                    return new ApplicationNode((ExpressionNode) new IdentifierNode("list_all", loc), Arrays.asList(body), loc);
                } else if (op.getName().equals("some")) {
                    return new ApplicationNode((ExpressionNode) new IdentifierNode("list_some", loc), Arrays.asList(body), loc);
                } else if (op.getName().equals("gcd")) {
                    return new ApplicationNode((ExpressionNode) new IdentifierNode("list_gcd", loc), Arrays.asList(body), loc);
                } else {
                    throw createException(op.getLocation(), "Comprehension operator '%s' unnown", op.getName());
                }
            }
        });
    }

    private static Parser<Map<ExpressionNode, ExpressionNode>> generatorParser(Parser<ExpressionNode> expParser, final String accu) {
        return Parsers.sequence(
                IDENTIFIER,
                TERMS.token("<-")
                .next(expParser),
                new Map2<IdentifierNode, ExpressionNode, Map<ExpressionNode, ExpressionNode>>() {
            public Map<ExpressionNode, ExpressionNode> map(final IdentifierNode var, final ExpressionNode list) {
                return new Map<ExpressionNode, ExpressionNode>() {
                    public ExpressionNode map(ExpressionNode rest) {
                        Location loc = var.getLocation().join(list.getLocation());
                        return new ApplicationNode(
                                new IdentifierNode("loop_list", loc),
                                Arrays.asList((ExpressionNode) new IdentifierNode(accu, loc), new LambdaNode(freshUnderscores(Arrays.asList(accu, var.getName())), rest, loc), list),
                                loc);
                    }
                };
            }
        });
    }

    private static Parser<Map<ExpressionNode, ExpressionNode>> assignmentParser(Parser<ExpressionNode> expParser, String accu) {
        return Parsers.sequence(
                IDENTIFIER,
                TERMS.token(":=")
                .next(expParser),
                new Map2<IdentifierNode, ExpressionNode, Map<ExpressionNode, ExpressionNode>>() {
            public Map<ExpressionNode, ExpressionNode> map(final IdentifierNode var, final ExpressionNode value) {
                return new Map<ExpressionNode, ExpressionNode>() {
                    public ExpressionNode map(ExpressionNode rest) {
                        Location loc = var.getLocation().join(value.getLocation());
                        return new ApplicationNode(
                                new LambdaNode(freshUnderscores(Arrays.asList(var.getName())), rest, loc),
                                Arrays.asList(value),
                                loc);
                    }
                };
            }
        });
    }

    private static Parser<Map<ExpressionNode, ExpressionNode>> filterParser(Parser<ExpressionNode> expParser, String list, final String accu) {
        return expParser.map(new Map<ExpressionNode, Map<ExpressionNode, ExpressionNode>>() {
            public Map<ExpressionNode, ExpressionNode> map(final ExpressionNode cond) {
                return new Map<ExpressionNode, ExpressionNode>() {
                    public ExpressionNode map(ExpressionNode rest) {
                        return new BranchNode(cond, rest, new IdentifierNode(accu, cond.getLocation()), cond.getLocation());
                    }
                };
            }
        });
    }

    private static Parser<Map<ExpressionNode, ExpressionNode>> tupleGeneratorParser(Parser<ExpressionNode> expParser, final String accu) {
        return Parsers.sequence(
                TERMS.token("("),
                IDENTIFIER.sepBy(TERMS.token(",")).followedBy(TERMS.token(")")),
                TERMS.token("<-")
                .next(expParser),
                new Map3<Token, List<IdentifierNode>, ExpressionNode, Map<ExpressionNode, ExpressionNode>>() {
            public Map<ExpressionNode, ExpressionNode> map(final Token paren, final List<IdentifierNode> vars, final ExpressionNode list) {
                return new Map<ExpressionNode, ExpressionNode>() {
                    public ExpressionNode map(ExpressionNode rest) {

                        Location loc = tokenLocation(paren).join(list.getLocation());

                        List<String> args = new ArrayList<String>();
                        for (IdentifierNode var : vars) {
                            args.add(var.getName());
                        }

                        ExpressionNode apply = new IdentifierNode("apply", loc);
                        ExpressionNode restLambda = new LambdaNode(freshUnderscores(args), rest, loc);
                        ExpressionNode tup = new IdentifierNode("tup", loc);
                        ExpressionNode loopList = new IdentifierNode("loop_list", loc);
                        ExpressionNode accuId = new IdentifierNode(accu, loc);
                        ExpressionNode restApp = new ApplicationNode(apply, Arrays.asList(restLambda, tup), loc);
                        ExpressionNode restAppLambda = new LambdaNode(Arrays.asList(accu, "tup"), restApp, loc);

                        return new ApplicationNode(loopList, Arrays.asList(accuId, restAppLambda, list), loc);
                    }
                };
            }
        });
    }

    private static Parser<ExpressionNode> letParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                TERMS.token("let"),
                letBindingParser(expParser).sepBy(TERMS.token(",")),
                TERMS.token("in")
                .next(expParser)
                .followedBy(TERMS.token("end")),
                new Map3<Token, List<Callback<ExpressionNode, ExpressionNode>>, ExpressionNode, ExpressionNode>() {
            public ExpressionNode map(
                    Token let,
                    List<Callback<ExpressionNode, ExpressionNode>> bindings,
                    ExpressionNode body) {
                ExpressionNode expr = body;
                for (int i = bindings.size() - 1; 0 <= i; i--) {
                    expr = bindings.get(i).call(expr);
                }
                return expr;
            }
        });
    }

    private static Parser<Callback<ExpressionNode, ExpressionNode>> letBindingParser(Parser<ExpressionNode> expParser) {
        return Parsers.or(
                tupleBindingParser(expParser),
                functionBindingParser(expParser),
                bindingParser(expParser));
    }

    private static Parser<Callback<ExpressionNode, ExpressionNode>> bindingParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                IDENTIFIER.followedBy(TERMS.token("=")),
                expParser,
                new Map2<IdentifierNode, ExpressionNode, Callback<ExpressionNode, ExpressionNode>>() {
            public Callback<ExpressionNode, ExpressionNode> map(final IdentifierNode var, final ExpressionNode val) {
                return new Callback<ExpressionNode, ExpressionNode>() {
                    public ExpressionNode call(ExpressionNode rest) {
                        Location loc = var.getLocation().join(val.getLocation());
                        return new ApplicationNode(
                                new LambdaNode(freshUnderscores(Arrays.asList(var.getName())), rest, loc),
                                Arrays.asList(val),
                                loc.join(rest.getLocation()));
                    }
                };
            }
        });
    }

    private static Parser<Callback<ExpressionNode, ExpressionNode>> tupleBindingParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                TERMS.token("("),
                IDENTIFIER.sepBy(TERMS.token(","))
                .followedBy(TERMS.token(")"))
                .followedBy(TERMS.token("=")),
                expParser,
                new Map3<Token, List<IdentifierNode>, ExpressionNode, Callback<ExpressionNode, ExpressionNode>>() {
            public Callback<ExpressionNode, ExpressionNode> map(final Token paren, List<IdentifierNode> vars, final ExpressionNode value) {
                final List<String> names = new ArrayList<String>();

                for (IdentifierNode id : vars) {
                    names.add(id.getName());
                }
                return new Callback<ExpressionNode, ExpressionNode>() {
                    public ExpressionNode call(ExpressionNode rest) {
                        Location loc = tokenLocation(paren).join(value.getLocation());
                        return new ApplicationNode(
                                new IdentifierNode("apply", loc),
                                Arrays.asList(new LambdaNode(freshUnderscores(names), rest, loc), value),
                                loc.join(rest.getLocation()));
                    }
                };
            }
        });
    }

    private static List<String> freshUnderscores(List<String> names) {
        List<String> fresh = new ArrayList<String>();
        for (String name : names) {
            if (name.equals("_")) {
                fresh.add(freshUnderscore());
            } else {
                fresh.add(name);
            }
        }
        return fresh;
    }
    private static int counter = 0;

    public static String freshUnderscore() {
        return "_" + counter++;
    }

    private static Parser<Callback<ExpressionNode, ExpressionNode>> functionBindingParser(Parser<ExpressionNode> expParser) {
        return Parsers.sequence(
                IDENTIFIER,
                Parsers.between(TERMS.token("("),
                IDENTIFIER.sepBy(TERMS.token(",")),
                TERMS.token(")"))
                .followedBy(TERMS.token("=")),
                expParser,
                new Map3<IdentifierNode, List<IdentifierNode>, ExpressionNode, Callback<ExpressionNode, ExpressionNode>>() {
            public Callback<ExpressionNode, ExpressionNode> map(final IdentifierNode name, List<IdentifierNode> vars, final ExpressionNode body) {

                final Location loc = name.getLocation().join(body.getLocation());

                final List<String> names = new ArrayList<String>();

                for (IdentifierNode id : vars) {
                    names.add(id.getName());
                }

                return new Callback<ExpressionNode, ExpressionNode>() {
                    public ExpressionNode call(ExpressionNode rest) {

                        ExpressionNode restLambda = new LambdaNode(Arrays.asList(name.getName()), rest, loc);
                        ExpressionNode bodyLambda = new LambdaNode(freshUnderscores(names), body, loc);

                        return new ApplicationNode(restLambda, Arrays.asList(bodyLambda), loc);
                    }
                };
            }
        });


    }

    ////////////////////////////////////////////////////////////////////////////////
    // Utilities
    private static interface Callback<S, T> {

        public T call(S arg);
    }

    public static ParserException createException(Location loc, String form, Object... args) {
        PacioliException ex = new PacioliException(loc, String.format(form, args));
        return new ParserException(ex, null, null, null);
    }

    private static Location tokenLocation(Token token) {
        return new Location(source, token.index(), token.index() + token.length());
    }
}
